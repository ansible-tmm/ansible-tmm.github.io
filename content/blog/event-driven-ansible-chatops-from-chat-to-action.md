---
title: Event-Driven Ansible - ChatOps - From Chat to Action
slug: event-driven-ansible-chatops-from-chat-to-action
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2023-09-01'
updated: '2026-01-26'
source: redhat
source_url: https://www.redhat.com/en/blog/event-driven-ansible-chatops-from-chat-to-action
description: 'Implement Automated ChatOps: Learn how to use event-driven automation
  to take action from chat information.'
topics:
- Network automation
read_time_minutes: 7
synced_at: '2026-09-03T19:21:40Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

[![](https://www.redhat.com/rhdc/managed-files/ansible/pszGMvKzusRlBORTiEl3U2nfqYiLB-CnvtSqfV0pRJLcMAZs3UuJJDM7xTZB5owVZ_wlUawLqid-WJpYfaL__-MB3KX5VynTDwv5Nn2BpT2OBIc9Cb0eUL44kGnpSrWJo3Hi1CSldqrL06ZcyiW--YQ_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/pszGMvKzusRlBORTiEl3U2nfqYiLB-CnvtSqfV0pRJLcMAZs3UuJJDM7xTZB5owVZ_wlUawLqid-WJpYfaL__-MB3KX5VynTDwv5Nn2BpT2OBIc9Cb0eUL44kGnpSrWJo3Hi1CSldqrL06ZcyiW--YQ_0.png)

Like any well-rounded individual, in times of intense concentration, you will find me talking to myself in search of some hidden knowledge that I might have received in a dream, or perhaps quoting something from a fantasy novel about wizards and creatures in an attempt to fix a problem. Unfortunately, wearing a robe and shouting “Repairo Network!” while pointing my pen toward the device has yet to help in any situation.

At the 2023 AnsibleFest, as part of the main stage demonstration, I used the magic of Event-Driven Ansible to integrate ChatOps in our fictional infrastructure drama. ChatOps is not new, but I think it's a pretty cool way to make changes or interact with your infrastructure.

We know that Event-Driven Ansible requires a source for events, a list of conditions which we call rulesets, and ultimately an action to match those conditions, which makes it perfect to use as a chatbot-type system.

For me to have a heart-to-heart with my beloved network, I will need to configure my chat as a source of events for Event-Driven Ansible, and to do this, I will use the webhook source plugin, which is part of the [ansible.eda](https://galaxy.ansible.com/ansible/eda) collection. Many enterprise chat platforms provide a method to send and receive webhooks to trigger words in the chat, which is perfect for what we want to do.

[![Event-Driven Ansible ChatOps mechanism](https://www.redhat.com/rhdc/managed-files/ansible/dPscoFKsfE0mcimaWcs4UTWfzvCTYxw55s-EhFLeFqthlKCaqz9Qo_JKDV0P9HBvAwjcb0pAD0YWVRv6Qvi-ddRUf9Mj-w9kNpqMgKohky2JUheAYYuAMm9EzXubm0Vox4R2Tlyeae2R6Via1IDZLhQ_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/dPscoFKsfE0mcimaWcs4UTWfzvCTYxw55s-EhFLeFqthlKCaqz9Qo_JKDV0P9HBvAwjcb0pAD0YWVRv6Qvi-ddRUf9Mj-w9kNpqMgKohky2JUheAYYuAMm9EzXubm0Vox4R2Tlyeae2R6Via1IDZLhQ_0.png)

*Event-Driven Ansible ChatOps mechanism*

- We will use an outgoing webhook from the chat application to Event-Driven Ansible.
- Event-Driven Ansible will match the payload against its defined conditions.
- Once a condition is met, the corresponding action will take place.
- Feedback notification will be sent from the action as an incoming webhook to the chat.

Now that the fundamentals are done, let's look at how we could use this.

I have a network configured with three interconnected switches, got my chat system up and have Event-Driven Ansible listening with my rulebooks activated!

[![](https://www.redhat.com/rhdc/managed-files/ansible/XtINx-95ksqmiODvIJcdq5fZsojimzIlKgslR6CZuu23GcheEejZl_pllPi9HQ7Iu4fMoN6SWBykFICtO2w7-tl1PKRiaUT_VMU5tB3s9mj_9nVXRDRQBI6gP-p7OgiFG6EQ_fYjgOpf0Nq_HDwIuK0_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/XtINx-95ksqmiODvIJcdq5fZsojimzIlKgslR6CZuu23GcheEejZl_pllPi9HQ7Iu4fMoN6SWBykFICtO2w7-tl1PKRiaUT_VMU5tB3s9mj_9nVXRDRQBI6gP-p7OgiFG6EQ_fYjgOpf0Nq_HDwIuK0_0.png)

*Event-Driven Ansible NetOps - ChatOps use case*

If you have read one of the previous [blogs](https://www.ansible.com/blog/addressing-netops-issues-with-event-driven-ansible) about using network telemetry with Event-Driven Ansible, you would see that we are streaming telemetry from the network into Kafka and from there using Event-Driven Ansible to process events. In a large-scale environment, we would typically use a centralized tool like CloudVision from Arista, or Cisco ThousandEyes to gather the telemetry and forward them to Event-Driven Ansible.

### > Ding ding, incoming message!

For our first example, we will simulate a BGP failure and take all the steps we would typically perform to troubleshoot by codifying  them in an Ansible Playbook that we can use as an action. Below is an example of a failure in BGP, followed by my rulebook:

```
ceos3(config-if-Et3)#show ip bgp summary vrf all

BGP summary information for VRF default
Router identifier 3.3.3.3, local AS number 65003
Neighbor Status Codes: m - Under maintenance
  Neighbor         V  AS           MsgRcvd   MsgSent  InQ OutQ  Up/Down State   PfxRcd PfxAcc
  10.0.1.2         4  65002             24        24    0    0 00:17:24 Estab 4  4
  10.0.1.1         4  65001             22        23    0    0 00:01:20 Idle(NoIf)
```

*BGP failure output from Leaf02*

The below rulebook is allowing us to listen to our Kafka topic for messages from our switches.

```
---
- name: Switch State Event from Arista

  hosts: all
  sources:
   - ansible.eda.kafka:
       host: broker
       port: 9092
       topic: network

  rules:
   - name: BGP change detected
     condition: event.fields.session_state == "IDLE"
     action:
       run_playbook:
        name: bgp_troubleshooting.yml
        post_events: true

   - name: Notify Chat
     condition: event.status is defined
     action:
        run_playbook:
          name: notify_chat.yml
```

[*rulebook/switch\_status.yml*](https://gist.github.com/nmartins0611/3bae5c44a77eb7d1b850c1bd8d0d80c7)*Ansible Rulebook*

Our first condition evaluates the event payloads coming from our Kafka topic and we are looking for an “*IDLE”* state in the BGP status. Once this condition has been met, we will run a troubleshooting playbook. What I want to point out is the **post\_events: true** in the action.

### Posting events with Event-Driven Ansible

[**Post\_events**](https://ansible.readthedocs.io/projects/rulebook/en/stable/actions.html#post-event) allows us to provide feedback from the playbook back into the rulebook. If you are running troubleshooting on an event, we would perhaps want to know what the outcome is of specific tasks, so we could decide on the next course of action or gather all the relevant information to create an incident ticket.

In my example, I have a second condition which is looking for a fact that gets set whenever this troubleshooting is done. Once it is done, the notify\_chat.yml playbook will trigger and my company chat will be notified of the issue and the results of the first phase of troubleshooting.

```
---
 - name: Send notification message via Mattermost
      community.general.mattermost:
       url: http://chat.mydomain.com:8065
       api_key: 6xyqnbqdpfg89eneqg13146azc 
       attachments:
         - text: "!!!!!! ALERT !!!!!!"
           color: '#ff00dd'
           title: BGP ERROR
           fields:
            - title: Issue
              value: "BGP {{ ansible_eda.event.fields.session_state }} Error!"
              short: true
            - title: Details
              value: "Neighbor Address: {{ ansible_eda.event.tags.neighbor_address }} from switch {{ ansible_eda.event.name }}"
              short: true
      delegate_to: localhost
```

[*playbooks/notify\_chat.yml*](https://gist.github.com/nmartins0611/0d355fcff2b6bea316f14e7e06b28664)*Ansible Playbook*

[![](https://www.redhat.com/rhdc/managed-files/ansible/jn-gWcjOw4-WeqsaVz9MskAB-e23rkd4TkvWRBma-MIIIti5dvbM9e6axYmb-1tC_RKCobAv4hKjgwsKoLJsLO2HrLXMSE_RewVD6_KrXg2DcRkmdF6xqFYYZYcBcs94iH90ZGJWo_0J4__p5YQ5_tI_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/jn-gWcjOw4-WeqsaVz9MskAB-e23rkd4TkvWRBma-MIIIti5dvbM9e6axYmb-1tC_RKCobAv4hKjgwsKoLJsLO2HrLXMSE_RewVD6_KrXg2DcRkmdF6xqFYYZYcBcs94iH90ZGJWo_0J4__p5YQ5_tI_0.png)

*Mattermost chat output*

### > BRB, got to automate!

The previous example used Event-Driven Ansible to respond to an event by running a troubleshooting playbook and then notifying the team of the details.

But what if I want to whisper sweet nothings to Event-Driven Ansible and have it do some work for me?

Let’s use the chat to initiate a configuration backup of one or more of our switches. We will configure an outgoing webhook based on a trigger word and point it to my Event-Driven Ansible endpoint.

We’ll use a trigger word in the chat like “backup” that will be used in the event condition, but what I want is to be able to say **“*****backup leaf02.mydomain.com”*** and have Event-Driven Ansible backup the correct switch. So, in my rulebook I will define a condition looking for that “backup” trigger, and I will then action a playbook that will process the text payload so I can get the hostname of the switch.

```
---
- name: Listen for events on a webhook
  hosts: all
  sources:
    - ansible.eda.webhook:
        host: 0.0.0.0
        port: 5000

  rules:

   - name: Filter payload for hostnames
      condition: event.payload.text is match("backup")
      action:
      run_playbook:
       name: filter_regex.yml
       post_events: true

    - name: Backup specified switch
      condition: event.switch_devices is defined
      action:  
      run_playbook:
       Name: switch_backup.yml
```

[*rulebook/chatops.yml*](https://gist.github.com/nmartins0611/4a680e32382c0f811c5240223247b291) *rulebook*

```
---
- name: Regex Processing for hostnames
  hosts: localhost
  connection: local
  gather_facts: false
  vars:
    eda_input: "{{ ansible_eda.event.payload.text }}"  # access event payload
    regex_pattern: '\b(\w+\.mydomain\.com)\b'          # can supply via vars.yml

  tasks:

    - name: Extract switch name from text
      set_fact:
       cacheable: yes
       switch_devices: "{{ eda_input | regex_findall(regex_pattern) }}"
       regex_proc: done
```

[playbook/filter\_regex.yml](https://gist.github.com/nmartins0611/6554b586bdbd780ff7dd9002ebf215f9) playbook

This “filter\_regex.yml” playbook will process the event payload and look for the hostname of the switch. We then set it as a fact so it is persistent. What is super cool is that Event-Driven Ansible can access facts that have been set in playbooks, and in conjunction with **post\_events,** we are able to feed this back into the rulebook for processing. To access this fact, we can simply use event.switch\_devices.

The below playbook is triggered to backup the desired switch when the event.switch\_devices is defined:

```
---
- name: Backup Switch
  hosts: "{{ ansible_eda.event.switch_devices }}"
  gather_facts: false
  connection: httpapi
  vars:
   ansible_httpapi_port: 443
   ansible_httpapi_use_ssl: true
   ansible_httpapi_validate_certs: false

  tasks:

  - name: configurable backup path
    arista.eos.eos_config:
     backup: yes
     backup_options:
     filename: "{{ ansible_eda.event.switch_devices }}.cfg"
```

[*playbook/switch\_backup.yml*](https://gist.github.com/nmartins0611/b4e8824851b5007d3a8a1ccf398cac4b) *playbook*

There you have it! We have been able to use incoming and outgoing webhooks as sources for Event-Driven Ansible in a ChatOps environment, allowing us to drive automation with the power of the typed word!

[![](https://www.redhat.com/rhdc/managed-files/ansible/ZHAHMibWfVGsjuTVpOvENzjWGdMmawSyjej-AsR-Jp7v3_kZJo3mES5isnssETjKUmeLsptH16DTqY4DCH1VDtTLP6c0QbDp3tPDpDH5MFJU-kTtd4_hRw-RPGGA70toXLAQTFnbFyx22ul7doJXlY8_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/ZHAHMibWfVGsjuTVpOvENzjWGdMmawSyjej-AsR-Jp7v3_kZJo3mES5isnssETjKUmeLsptH16DTqY4DCH1VDtTLP6c0QbDp3tPDpDH5MFJU-kTtd4_hRw-RPGGA70toXLAQTFnbFyx22ul7doJXlY8_0.png)

### Call to Action

- Watch the action in [latest demo](https://www.youtube.com/watch?v=Dj7dhZdnRIY)
- Check out our [NetOps and Event-Driven Ansible](https://www.ansible.com/blog/addressing-netops-issues-with-event-driven-ansible) blog
- Give the [Self-paced](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) labs a try
- Check out the [Getting Started with Event-Driven Ansible](https://www.redhat.com/en/engage/event-driven-ansible-20220907) training
- Grab these code examples on the [GitHub repo](https://github.com/nmartins0611/eda_chatops_blog)
- Learn more about [Event-Driven Ansible](https://www.redhat.com/en/technologies/management/ansible/event-driven-ansible)
- Join the [Ansible Community Forum](https://forum.ansible.com/) to discuss this [blog post](https://forum.ansible.com/t/event-driven-ansible-chatops-from-chat-to-action/279)

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
