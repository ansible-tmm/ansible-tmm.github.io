---
title: Addressing NetOps issues with Event-Driven Ansible
slug: addressing-netops-issues-with-event-driven-ansible
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2023-01-12'
updated: '2025-11-19'
source: redhat
source_url: https://www.redhat.com/en/blog/addressing-netops-issues-with-event-driven-ansible
description: Explore network events and what you could potentially do with something
  like Event-Driven Ansible. Read the blog to see examples.
topics:
- Network automation
read_time_minutes: 4
synced_at: '2026-09-03T19:21:42Z'
---

## A simple example - No Shut, No Problem

Since the announcement of [Event-Driven Ansible](https://www.ansible.com/use-cases/event-driven-automation), I cannot stop thinking about potential use cases. Can I get events to automate scaling? Could I use a filesystem event to trigger filesystem integrity checks? Could I get a slackbot to trigger my choice of heavy metal playlist based on a “mood” event? It's all possible! But let’s not go too crazy, not yet.

I started having a look at the fantastic work that one of our engineers, [Nilashish Chakraborty](https://www.linkedin.com/in/nilashishchakraborty/) has been doing around network telemetry and Ansible. This led me down the path to explore network events and what I could potentially do with something like Event-Driven Ansible. So let’s start with a super simple interface example.

Reaching out to the team at [Arista](https://www.arista.com/en/), we started discussing and looking at the mechanisms they are using to get telemetry data. With Arista we are able to use gNMI, gNMI is an open source protocol [specification](https://github.com/openconfig/reference/blob/master/rpc/gnmi/gnmi-specification.md) created by the OpenConfig working group that is used to stream data to and from network devices. The OpenConfig working group operates as an open source project with contributions from network operators, equipment vendors in providing vendor-neutral software to manage network devices. I configured gNMI on my Arista switches and queried the interface with the gNMI client on my machine to make sure I was able to get what I needed.

```
…
! Command: show running-config
! device: arista01 (vEOS-lab, EOS-4.29.0.2F)
…

!
management api gnmi
   transport grpc default
   !
   transport grpc eos
   provider eos-native
!
…
```

Running configuration on Arista EOS

With my switches configured to allow gNMI, I used my [gNMIc client](https://gnmic.kmrd.dev/) on my machine to test a subscription for events.

```
Term> gnmic -a 192.168.11.5:6030 -u admin -p ansibleIScool --insecure subscribe --path \
  "/interfaces/interface[name=Ethernet1]/state/admin-status"
```

This allows us to connect and view the telemetry data that's being streamed. I subscribed just to the admin-status of the ethernet port; however, you could subscribe to whatever data is relevant to you.

```
{
  "source": "192.168.11.5:6030",
  "subscription-name": "default-1670407121",
  "timestamp": 1670402814238747205,
  "time": "2022-12-07T10:46:54.238747205+02:00",
  "updates": [
    {
      "Path": "interfaces/interface[name=Ethernet1]/state/admin-status",
      "values": {
        "interfaces/interface/state/admin-status": "UP"
      }
    }
  ]
}
```

Output from gnmic command

**Note:** If you are not aware of what capabilities are available for you on your chosen platform, you can also use the gNMIc client to check this:

```
Term> gnmic -a 192.168.11.5:6030 -u admin -p ansibleIScool --insecure capabilities
gNMI version: 0.7.0
supported models:
  - openconfig-keychain-types, OpenConfig working group, 0.2.0
  - arista-sampling-notsupported-deviations, Arista Networks, Inc.,
  - openconfig-openflow-types, OpenConfig working group, 0.2.0
…
```

Now that we have this streaming, we need to get this data to some kind of event source that we can use with Event-Driven Ansible. I decided I would like to use Kafka for this and I would use Telegraf to consume the telemetry data and send it to Kafka as an output.

[![](https://www.redhat.com/rhdc/managed-files/ansible/j3d1ImIprurQ0B1zNvEwdJPzbF9IjQXpShmeVFkK9alwmItjGz0tcPB7mnwUuQ4GWVg9lHp5_WiGSTUtcJ4DwX9dx3N-FMIAQLriEqJywL8QHI1vHuJZHxEsM3KH6jn2gbff-fkV474tBUAI26_Bg8spJlhx2PHY50z55zpEx2qh0AwPYhbTdfuJd2Sj_Q.png)](https://www.redhat.com/rhdc/managed-files/ansible/j3d1ImIprurQ0B1zNvEwdJPzbF9IjQXpShmeVFkK9alwmItjGz0tcPB7mnwUuQ4GWVg9lHp5_WiGSTUtcJ4DwX9dx3N-FMIAQLriEqJywL8QHI1vHuJZHxEsM3KH6jn2gbff-fkV474tBUAI26_Bg8spJlhx2PHY50z55zpEx2qh0AwPYhbTdfuJd2Sj_Q.png)

I configured Telegraf to connect to the gNMI and forward the telemetry to my Kafka topic:

```
…
  [[inputs.gnmi.subscription]]
    name = "Ethernet1"
    origin = "openconfig"
    subscription_mode = "sample"
    path = "/interfaces/interface[name=Ethernet1]/state/admin-status"
    sample_interval = "2s"
…
[outputs.kafka]
    brokers = ["192.168.11.49:9092"]
    topic = "network"
…
```

If we have a look at my Kafka topic, and see what messages are coming in we can see that we are receiving the desired information:

```
… <on my Kafka System> 

[kafka ~]# /opt/kafka/bin/kafka-console-consumer.sh --topic network --from-beginning --bootstrap-server localhost:9092 
…

{"fields":{"admin_status":"UP"},"name":"Ethernet1","tags":{"host":"influx.prometheus.io","name":"Ethernet1","path":"","source":"192.168.11.5"},"timestamp":1670440660}

{"fields":{"admin_status":"UP"},"name":"Ethernet1","tags":{"host":"influx.prometheus.io","name":"Ethernet1","path":"","source":"192.168.11.5"},"timestamp":1670440660}

{"fields":{"admin_status":"UP"},"name":"Ethernet1","tags":{"host":"influx.prometheus.io","name":"Ethernet1","path":"","source":"192.168.11.5"},"timestamp":1670440660}

…
```

With these events in Kafka, I can now create my Ansible Rulebook and trigger remediation for the desired steps to respond to this. I can run ansible-rulebook and we can see how it triggers based on the admin\_status of the port.

```
---

- name: Port State Event from Arista

  hosts: all

  sources:
   - ansible.eda.kafka:
       host: 192.168.11.49
       port: 9092
       topic: network

  rules:
   - name: Test
     condition: event.fields.admin_status == "DOWN"
     action:
       run_playbook:
        name: bring-her-up.yml
```

Port-Status Rulebook

```
[localhost]$ ansible-rulebook --rulebook port_status.yml -i inventory.yaml --verbose
```

[![](https://www.redhat.com/rhdc/managed-files/ansible/gqkCCh7-w0jMvK1u3mn2NuUCWPmq76gxMOLzrWsocmb_o9ulLCESRGslozZAC7CM_LXskbWu-AodUqyrMySHqj9jAb7VdPJCdM5zYkLMCKkM3CMxTmaUskwgxjD13KoG100Bpn3cpFXX6rR5Dt6nrxswOHaqrbKYCiCPzN9VqGLJRuSFRW4gZ_SiD2cy6Q.png)](https://www.redhat.com/rhdc/managed-files/ansible/gqkCCh7-w0jMvK1u3mn2NuUCWPmq76gxMOLzrWsocmb_o9ulLCESRGslozZAC7CM_LXskbWu-AodUqyrMySHqj9jAb7VdPJCdM5zYkLMCKkM3CMxTmaUskwgxjD13KoG100Bpn3cpFXX6rR5Dt6nrxswOHaqrbKYCiCPzN9VqGLJRuSFRW4gZ_SiD2cy6Q.png)

So, with Event-Driven Ansible we are able to respond to events we gather from things like network telemetry. Not only could we use this for simple remediation tasks but we could expand this further with adding ITSM integration or perhaps automated troubleshooting and awareness to events on the network. I think that is pretty slick! 

Arista has created an awesome [source plugin](https://github.com/arista-netdevops-community/Ansible-Event-Driven-Automation-Examples/tree/main/nats) that we can use instead of Telegraf and Kafka. [Daniel Hertzberg](https://www.linkedin.com/in/dhertzberg/) and [Julio Perez](https://www.linkedin.com/in/julioperez-pdx/) really grasped Event-Driven Ansible concepts and created this magical source plugin in a week. This plugin utilizes [NATS](https://nats.io/), and if you are like me and haven't heard of NATS, It is similar to Kafka in the sense that it is a messaging queue, but there are some differences and you can read up a bit more about them [here](https://docs.nats.io/nats-concepts/overview/compare-nats). This plugin simplifies and reduces the toolset needed to get all-important telemetry data to ansible-rulebook. 

Watch for another blog that is coming soon around using the Arista source plugin and a juicy network automation use case. 

# Call to Action

- Check out the [Getting Started with Event-Driven Ansible training](https://www.ansible.com/products/ansible-community-training)
- Visit the Event Driven Ansible [web page](https://www.ansible.com/use-cases/event-driven-automation)
- Check out the [Event-Driven Ansible playlist](https://www.youtube.com/playlist?list=PLdu06OJoEf2a3fFl6uaoyGV526ilwD97R) on YouTube
- Check out the [Best of AnsibleFest 2022](https://www.ansible.com/blog/best-of-fest-2022)
- Try [Ansible Automation Platform](https://www.redhat.com/en/technologies/management/ansible/try-it) free for 60 days

---

### About the author

[![Nuno Martins](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/Nuno%20Martins.webp?itok=-RZ_7BCo)](https://www.redhat.com/en/authors/nuno-martins)

[### Nuno Martins

Technical Marketing Manager, Red Hat Ansible Automation Platform](https://www.redhat.com/en/authors/nuno-martins)

Nuno is a Technical Marketing Manager for the Ansible Automation Platform. He is a Red Hat Certified Architect and a Certified Instructor with over 15 years of experience in multiple technologies. Currently based in South Africa, he has international experience with having worked all over Europe and Africa.

[More from this author](https://www.redhat.com/en/authors/nuno-martins)

Enter keywords here to search blogs

UI\_Icon-Red\_Hat-Close-A-Black-RGB

Search

## More like this

Blog post

### [Architecting true autonomy with a level 4/5 network](https://www.redhat.com/en/blog/architecting-true-autonomy-level-45-network)

Blog post

### [Solve multi-controller contention with Red Hat OpenShift networking](https://www.redhat.com/en/blog/solve-multi-controller-contention-red-hat-openshift-networking)

Original podcast

### [Untangling Networks | Compiler](https://www.redhat.com/en/compiler-podcast/untangling-networks)
