---
title: Peeling back the layers and understanding automation mesh
slug: peeling-back-the-layers-and-understanding-automation-mesh
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2022-08-01'
updated: '2025-11-19'
source: redhat
source_url: https://www.redhat.com/en/blog/peeling-back-the-layers-and-understanding-automation-mesh
description: Read about the technical implementation of automation mesh, what network
  ports it is using and how you can secure it.
topics: []
read_time_minutes: 9
synced_at: '2026-09-03T19:20:56Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

Red Hat Ansible Automation Platform 2 features an awesome new way to scale out your automation workloads: automation mesh.  If you are unfamiliar with automation mesh, I highly recommend reading Craig Brandt’s blog post [What's new: an introduction to automation mesh](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2.1-automation-mesh) which outlines how automation mesh can simplify your operations and scale your automation globally.  For this blog post, I want to focus on the technical implementation of automation mesh, what network ports it is using and how you can secure it.

To quickly summarize both Craig’s blog post and our documentation, we separated the control plane (which includes the webUI and API) from the execution plane (where an Ansible Playbook is executed) in Ansible Automation Platform 2.  This allows you to choose where jobs run across execution nodes, so you can deliver and run automation closer to the devices that need it. In our implementation, there is four different types of nodes:

- **Control plane nodes**: These are  accessed either via the WebUI and API. Execution capabilities are disabled on these nodes.
- **Execution nodes**: This is where Ansible Playbooks are actually executed.  This node will run an automation execution environment which in turn, runs the Ansible Playbook.
- **Hop nodes**: These optional nodes can be used to interconnect control nodes and Execution nodes.
- **Hybrid nodes**: This performs automation controller runtime functions as well as executing automation (not covered in this blog).

[![](https://www.redhat.com/rhdc/managed-files/ansible/k5ot1T_1tDkUb5vwSwmXnM0Y8A_ApAD_qiRKnV9ChKNCywGvDd9h3H_ub6kpO23b9GZsoZoCMjfFoAoptUfC0Bw_dBAxdBkMqgs41H6l_xouLEGM5cQ2nLCs9KrtTisE6YAEYKQM2p4tXvovXDoK6QQ.png)](https://www.redhat.com/rhdc/managed-files/ansible/k5ot1T_1tDkUb5vwSwmXnM0Y8A_ApAD_qiRKnV9ChKNCywGvDd9h3H_ub6kpO23b9GZsoZoCMjfFoAoptUfC0Bw_dBAxdBkMqgs41H6l_xouLEGM5cQ2nLCs9KrtTisE6YAEYKQM2p4tXvovXDoK6QQ.png)

Before we get started, here are two great pieces of documentation that cover networking ports for automation mesh:

- [Documentation: automation mesh - Access control requirements](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.2/html/red_hat_ansible_automation_platform_installation_guide/planning-installation#ref-access-control-requirements_planning)
- [Reference Architecture: Deploying Ansible Automation Platform 2](https://access.redhat.com/documentation/en-us/reference_architectures/2021/html-single/deploying_ansible_automation_platform_2.1/index#config_controller_exec_nodes)

Ansible Automation Platform makes use of another upstream project called [receptor](https://receptor.readthedocs.io/en/latest/).  This technology implements an overlay network connecting your controller, hop and execution nodes and is fully implemented with the Ansible Automation Platform installer. On each node in your automation overlay, there will be a receptor application that runs as a daemon.

While every port that Ansible Automation Platform uses are configurable, the default network ports used to deploy and connect automation mesh are:

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| **Port** | **Protocol** | **Service** | **Ansible var:** | **Required for** |
| 22 | TCP | SSH | `ansible_port` | Installation |
| 27199 | TCP | Receptor | `receptor_listener_port` | Listening port for receptor connection. |
| 443\* | TCP | Podman | N/A | Access to a container registry for execution environments (e.g. registry.redhat.io or private automation hub).  Configurable server side on your registry. |

- *The port may vary based on your container registry configuration*

For the purposes of this blog post, I am going to use a single site from the reference architecture linked above.  Here is picture of just Ansible Site 1:

[![](https://www.redhat.com/rhdc/managed-files/ansible/MzXBTKKnxU8UP1-447RzfLzVSmdbp3TIRWYj56hm1czWyFrpJv8M-aJGxT42xQCL0QFNzXF9o62g__yJmOc2GIw03n5g4a-PmdtLSYbRVeh0EaEUYvQCYhiRBmVwOOksOsNYHDLEp2wc1rBGpJ7QPUw.png)](https://www.redhat.com/rhdc/managed-files/ansible/MzXBTKKnxU8UP1-447RzfLzVSmdbp3TIRWYj56hm1czWyFrpJv8M-aJGxT42xQCL0QFNzXF9o62g__yJmOc2GIw03n5g4a-PmdtLSYbRVeh0EaEUYvQCYhiRBmVwOOksOsNYHDLEp2wc1rBGpJ7QPUw.png)

In the above diagram you can see that there is an automation controller cluster containing three cluster nodes and two execution nodes.  In this particular example there is no hop node.  The way to set up automation mesh is via your inventory file of the Ansible Automation Platform installer.  The installer uses Ansible (we drink our own champagne!) to install and configure the overlay network between the control nodes and the execution nodes.

Here is the relevant portion of the inventory for the Ansible Automation Platform installer that will deploy automation mesh for us.

```
[automationcontroller]
controlplane-1.site1.example.com
controlplane-2.site1.example.com
controlplane-3.site1.example.com

[automationcontroller:vars]
node_type=control 
peers=execution_nodes 

[execution_nodes]
executionnode-1.site1.example.com 
executionnode-2.site1.example.com
```

In the above example the default values will be used since the `receptor_listener_port` and `ansible_port` are not set.  This means that Ansible Automation Platform will use port 22 to connect to the remote nodes, install the necessary files and configure the receptor daemon to listen for a connection on port 27199.

*NOTE: There are multiple ways to view how your mesh network looks. You can do that before the platform install through the installer setup.sh and the following command:*

```
./setup.sh -e generate_dot_file=”filename”
```

*This will generate a dot file which can be directly opened in a browser or fed to an online dot file viewer such as* [*this one*](https://dreampuf.github.io/GraphvizOnline) *to see the topology.*

[![](https://www.redhat.com/rhdc/managed-files/ansible/BH6akM7Q8eN-TgBnU7hCVt76x78xasIRbJwQN8KMOQukdWvEe47087JGUyBy1MmzrEo6n5y5vIYNgK37KC1jLhP6NGHJ6ouOxJ2gt7WCwCFtU3OdZdxquVnBPpa00UfsmqImO36v8pXuaBPHIX1q9ck.png)](https://www.redhat.com/rhdc/managed-files/ansible/BH6akM7Q8eN-TgBnU7hCVt76x78xasIRbJwQN8KMOQukdWvEe47087JGUyBy1MmzrEo6n5y5vIYNgK37KC1jLhP6NGHJ6ouOxJ2gt7WCwCFtU3OdZdxquVnBPpa00UfsmqImO36v8pXuaBPHIX1q9ck.png)

*Mesh topology view for the above inventory file*

*In addition, Ansible Automation Platform 2.2 introduced a new feature called automation topology viewer, which can show the mesh network in the automation controller once the platform installation is done. Read more about it* [*here*](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2.2)*.*

[![](https://www.redhat.com/rhdc/managed-files/ansible/k4xP-hvPT6fsM0HSPxRSStOrvQEk8NstXGUtbv-MAf0FicdfdFjM54mDqg6jfm-Y5KpRUndcI6zh2GJP9CvWNa95GQPFEPnwSeuJzuB2R99l2HYvq9HF6OFAihM_LHlf6CxUxzHb9ZjDcABaN7xYXYQ.jpg)](https://www.redhat.com/rhdc/managed-files/ansible/k4xP-hvPT6fsM0HSPxRSStOrvQEk8NstXGUtbv-MAf0FicdfdFjM54mDqg6jfm-Y5KpRUndcI6zh2GJP9CvWNa95GQPFEPnwSeuJzuB2R99l2HYvq9HF6OFAihM_LHlf6CxUxzHb9ZjDcABaN7xYXYQ.jpg)

In this specific example, since the `peers=execution_nodes` is under the automation controller group, the connection will be initiated from the control nodes.  In this case, the outbound port is choosing a port from the Linux ephemeral port range as outlined in this k[nowledge base article](https://access.redhat.com/discussions/3103201) on the Red Hat customer portal.  This is exactly how SSH behaves, where the outbound port is not set, but the listening port is using port 22 (by default).

[![](https://www.redhat.com/rhdc/managed-files/ansible/O_7cLoXqrhCD5xnpjJDl-bV2MjwLyUFnAlF07sikLg32jcstsN1MOKR14iWoJhL6koPqgAYeUhqVuGzmpyHIBM6xbprozUcrh_YHX3MezyArL1dK6yV_79IxPrZRZju0erlATseOXQVqqvjigolhRFA.jpg)](https://www.redhat.com/rhdc/managed-files/ansible/O_7cLoXqrhCD5xnpjJDl-bV2MjwLyUFnAlF07sikLg32jcstsN1MOKR14iWoJhL6koPqgAYeUhqVuGzmpyHIBM6xbprozUcrh_YHX3MezyArL1dK6yV_79IxPrZRZju0erlATseOXQVqqvjigolhRFA.jpg)

On the execution nodes side, we will be listening on the predefined port, in this case TCP `27199`.  We can see the daemon running using the systemctl command:

```
[rhel@executionnode-1 ~]$ sudo systemctl status receptor.service
● receptor.service - Receptor
   Loaded: loaded (/usr/lib/systemd/system/receptor.service; enabled; vendor preset: disabled)
  Drop-In: /etc/systemd/system/receptor.service.d
           └─override.conf
   Active: active (running) since Thu 2022-07-21 18:26:32 UTC; 7min ago
 Main PID: 737 (receptor)
    Tasks: 7 (limit: 46230)
   Memory: 59.9M
   CGroup: /system.slice/receptor.service
           └─737 /usr/bin/receptor -c /etc/receptor/receptor.conf

Jul 21 18:26:32 mesh-exec1 systemd[1]: Started Receptor.
```

Using a simple Linux utility like `netstat` we can easily see what ports automation mesh is using on one of the controller nodes:

```
root@controlplane-1:~# netstat -tuplna | grep receptor
tcp        0      0 10.132.2.52:36106       10.132.2.56:27199       ESTABLISHED 800/receptor      
tcp        0      0 10.132.2.52:35105       10.132.2.57:27199       ESTABLISHED 800/receptor
```

Here is what it looks like on one of my execution nodes:

```
root@executionnode-1:~# netstat -tuplna | grep receptor
tcp6       0      0 :::27199                :::*                    LISTEN      757/receptor        
tcp6       0      0 10.132.2.56:27199       10.132.2.52:36106       ESTABLISHED 757/receptor
```

As you can see in the above output, the controller side has only outbound connection from random ephemeral ports, while the destination is port `27199`.  While on the execution node, we are listening on port `27199` and connecting back to the controller node.

What if I want to establish connections from the execution nodes inbound to the controller nodes?

[![](https://www.redhat.com/rhdc/managed-files/ansible/PrG79jefVdlUuVQ8eo0c7ErTG0CtVGS6A2_nUot7SWx2ReLKSETI2UUjHNQ7V0e66zuHUChZaZz8ScJsSuw1YZ2M9gmEV8i-eKo7CpPJbxNY_lN1uBbCrjnCgWq-4ER3WNJ47kE_RJGE04OIsngM9w4.jpg)](https://www.redhat.com/rhdc/managed-files/ansible/PrG79jefVdlUuVQ8eo0c7ErTG0CtVGS6A2_nUot7SWx2ReLKSETI2UUjHNQ7V0e66zuHUChZaZz8ScJsSuw1YZ2M9gmEV8i-eKo7CpPJbxNY_lN1uBbCrjnCgWq-4ER3WNJ47kE_RJGE04OIsngM9w4.jpg)

We would remove `peers=execution_nodes` from under the `automationcontroller` group and create a `peers=automationcontroller` underneath the `execution_nodes` group.

```
[automationcontroller]
controlplane-1.site1.example.com
controlplane-2.site1.example.com
controlplane-3.site1.example.com

[automationcontroller:vars]
node_type=control 
[execution_nodes]
executionnode-1.site1.example.com peers=executionnode-2.site1.example.com
executionnode-2.site1.example.com
[execution_nodes:vars]
peers=automationcontroller
```

Now the connection is initiated from the execution node and the listening port `27199` is on the controller nodes.  Now what if I want to customize the port for automation mesh?

```
[automationcontroller]
controlplane-1.site1.example.com
controlplane-2.site1.example.com
controlplane-3.site1.example.com

[automationcontroller:vars]
node_type=control 
receptor_listener_port=29182

[execution_nodes]
executionnode-1.site1.example.com peers=executionnode-2.site1.example.com
executionnode-2.site1.example.com

[execution_nodes:vars]
peers=automationcontroller
```

By setting the `receptor_listener_port` as a `group_var` all control nodes will now listen on `29182` instead of the default port `27199`. However, in this scenario above, we are also coupling the execution nodes to each other.  The Ansible Automation Platform installer will make sure that execution node 2 is listening for that connection to be created.  Since we did not set the `receptor_listener_port` var, it will default to listening on port `27199`.

## How do I protect my automation mesh network?

There are two big parts to securing your automation mesh topology.  The first is authenticating your automation mesh network with a certificate authority (CA) and the second is consideration of your network and firewall policies.

### Using a Certificate Authority

By default, automation mesh will set up a CA that verifies and signs individual node certificates in an automation mesh environment. Automation mesh supports X.509 compliant certificates.  Each node (control, hop and execution nodes) will have a `.crt` certfile that contains their public key and issues CA, and their private key in a `.key` keyfile.  These are stored in the `/etc/receptor/tls` directory while their CA cert is stored in the `/etc/receptor/ca/` directory.

When a message is initiated for automation mesh, the control node will send its `.cert` (which contains its public key / signed by our CA).  When another automation mesh node receives this message, it will check if we support their CA and respond with its own `cert`.  The control node (our initiating node in this exchange) will extract the public key and generate and respond with a pre-master key. Both nodes will generate a “shared secret” from the pre-master key and then fully encrypted communication will take place for the remainder of the connection.

If you want to use your own CA, you can [follow the documentation for additional details](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.2/html-single/red_hat_ansible_automation_platform_automation_mesh_guide/index#importing-mesh-ca_setting-up).

[![](https://www.redhat.com/rhdc/managed-files/ansible/SuvydWFXiG4kk4UKpy0hyyV4Zb9CcWzME98WlspEGhd-o19HSZJ9Vc8zbTChpnTf1Xu8lDLt8YbpmSL-LakTa1GD3K7pksDLP4JLo-Iggg8ofW_340U1KO67rnXxsC3xFkTq7IZydTHuVBBQ6VmdRbo.png)](https://www.redhat.com/rhdc/managed-files/ansible/SuvydWFXiG4kk4UKpy0hyyV4Zb9CcWzME98WlspEGhd-o19HSZJ9Vc8zbTChpnTf1Xu8lDLt8YbpmSL-LakTa1GD3K7pksDLP4JLo-Iggg8ofW_340U1KO67rnXxsC3xFkTq7IZydTHuVBBQ6VmdRbo.png)

The diagram above illustrates how the TLS encrypted session is created.  This follows the standard SSL/TLS handshake method.  If you want to learn more about SSL/TLS encryption, consider the following walkthrough and overview which contains a nice handshake diagram: <https://www.ssl.com/article/ssl-tls-handshake-overview>

### Network Security Considerations

The Ansible Automation Platform installer takes care of configuring all your automation infrastructure firewall ports.  This means the firewall policies and rules on Red Hat Enterprise Linux 8 or 9 are automatically configured when you deploy automation mesh.  I want to take a look at your network infrastructure and what considerations you can make for network security to automation mesh.

While major features for automation mesh include adding additional automation capacity and resilience, it can also act as a proxy for your automation overlay network to reach the infrastructure you are trying to automate.  Instead of having to open up ports to all your infrastructure, you can simply open up rules to allow control nodes to initiate a connection to execution nodes.  For example, look at the following diagram:

[![](https://www.redhat.com/rhdc/managed-files/ansible/HwFOsojflM4b0Uwrt1FY1Y16DN8f6hcQGjijh86rAG1VgJgOrHnhHNLPp28gfuLbEwc18xgPJkBJOVJ8hW8A-j576xiAXRnwRc-bAYaUnln1KwkyW4_RLz5nHi4mMC0oj3P2cAshLUCcZ_XhPNAeXQs.png)](https://www.redhat.com/rhdc/managed-files/ansible/HwFOsojflM4b0Uwrt1FY1Y16DN8f6hcQGjijh86rAG1VgJgOrHnhHNLPp28gfuLbEwc18xgPJkBJOVJ8hW8A-j576xiAXRnwRc-bAYaUnln1KwkyW4_RLz5nHi4mMC0oj3P2cAshLUCcZ_XhPNAeXQs.png)

In this diagram, there are three Red Hat Enterprise Linux (RHEL) servers that we are trying to automate using port 22 (SSH) to establish a connection.  If my execution node was not in the same network as my RHEL servers, I would need to ensure that port 22 was open to each server in my DMZ (top part of the diagram). However, I can place my execution node in the same network as my RHEL servers.  Doing so enables me to only need one ACL/FW rule through my firewall per connection to that execution node (bottom part of the diagram).  If I have multiple control nodes and want to limit the connections to the execution node to one connection, I could use a hop node as shown below.

For example, in the firewall above,I can have a simple FW rule to only allow connections to my execution node to protect my DMZ network.  Note that the syntax is going to depend on the firewall or network vendor you are using (e.g. is it an AWS firewall, a Cisco IOS network switch, or a Linux firewall?)

```
permit [source] [destination] [port]
permit [IPv4 address of control node] [IPv4 address of execution node] [receptor listening port - 27199]
```

What about outgoing ports?  This works similar to any connection where most modern firewalls and gateways support stateful behavior or something similar to a zone-based firewall.  The “inside” network is trusted so the ephemeral outgoing port is allowed to remain for the duration of that connection.  This is identical to the behavior within your network to SSH connections where the outgoing port is left open in the firewall for that specific TCP connection.  Of course, this can be customized by limiting the ephemeral port range that Linux uses and forcing deterministic outgoing port range.

As you can see, automation mesh is incredibly powerful.  It can add a lot of flexibility to different enterprise environments allowing IT automators to extend their automation anywhere without compromising their security.

## What can I do next?

Whether you are beginning your automation journey or are a seasoned veteran, there are a variety of resources to enhance your automation knowledge:

- [AnsibleFest 2022](https://www.ansible.com/ansiblefest) - Come hang out with myself, and more importantly the automation mesh guru Craig Brandt, who is my friend and colleague who knows everything there is to know about automation mesh in Chicago October 18-19, 2022.
- Self-paced exercises - Specifically check out the exercise “Getting started with automation mesh” to get hands-on time with everything discussed in this blog.
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel.](https://www.youtube.com/ansibleautomation) Be sure to check out our new web series, [Automated Live hosted by Colin McNaughton.](https://www.redhat.com/en/technologies/management/ansible/automated-live-videos)
- [Follow Red Hat Ansible](https://twitter.com/ansible) [Automation Platform](https://www.youtube.com/ansibleautomation) [on Twitter](https://twitter.com/ansible) - Do you have questions or an automation project you want to show off? Tweet at us!

---

### About the author

[![Sean Cavanaugh](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/sean_profile.jpg?itok=6yG8an6S)](https://www.redhat.com/en/authors/sean-cavanaugh)

[### Sean Cavanaugh

Principal Technical Marketing Manager](https://www.redhat.com/en/authors/sean-cavanaugh)

Sean is a Principal Technical Marketing Manager, Ansible, where he brings over 10 years of experience building and automating computer networks. Sean previously worked for both Cumulus Networks (acquired by Nvidia) and Cisco Systems where he helped customers deploy, manage and automate their network infrastructure. He resides in Chapel Hill, NC with his wife and children and tweets from [@IPvSean](https://twitter.com/ipvsean).

[More from this author](https://www.redhat.com/en/authors/sean-cavanaugh)

Enter keywords here to search blogs

UI\_Icon-Red\_Hat-Close-A-Black-RGB

Search

## More like this

Blog post

### [The architecture of autonomy: How ING built a future-proof tech strategy](https://www.redhat.com/en/blog/architecture-autonomy-how-ing-built-future-proof-tech-strategy)

Blog post

### [The last mile problem in agentic AI: Why tool calling reliability is harder than it looks](https://www.redhat.com/en/blog/last-mile-problem-agentic-ai-why-tool-calling-reliability-harder-it-looks)

Original podcast

### [How Red Hat cleared IT debt for scalable AI](https://www.redhat.com/en/technically-speaking/ai-ready-data-cleanup)

Original podcast

### [Virtualization Is (Still) King | Compiler](https://www.redhat.com/en/compiler-podcast/virtualization-ai)
