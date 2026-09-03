---
title: 'Coming Soon: Networking Features in Ansible 2.5'
slug: coming-soon-networking-features-in-ansible-2.5
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2018-02-08'
updated: '2025-11-19'
source: redhat
source_url: https://www.redhat.com/en/blog/coming-soon-networking-features-in-ansible-2.5
description: The upcoming Ansible 2.5 open source project release has some really
  exciting improvements. Here we highlight a few of the notable additions.
topics:
- Network automation
read_time_minutes: 10
synced_at: '2026-09-03T19:21:22Z'
---

[![Ansible 2.5 Networking Features](https://www.redhat.com/rhdc/managed-files/ansible/Ansible-2-5-Coming-Soon-Networking.png)](https://www.redhat.com/rhdc/managed-files/ansible/Ansible-2-5-Coming-Soon-Networking.png)

The upcoming Ansible 2.5 open source project release has some really exciting improvements, and the following blog highlights just a few of the notable additions. In typical Ansible fashion, development of networking enhancements is done in the open with the help of the community. You can follow along by watching the [networking GitHub project board](https://github.com/ansible/ansible/projects/10), as well as the roadmap for Ansible 2.5 via the [networking wiki page](https://github.com/ansible/community/wiki/Network%3ACore-roadmap-2.5).

A few highlighted features include:

**[New Connection Types: network\_cli and NETCONF](#Newconnections)**

**[Ansible Fact Improvements](#Facts)**

**[Improved Logging](#Improved)**

**[Continued Enablement for Declarative Intent](#Module)**

**[Persistent SSH Connection Improvements](#SSH)**

**[Additional Platforms and Modules](#Platforms)**

Let's dive into each of these topics and elaborate on what they mean for your Ansible Playbooks!

## New Connection Types: network\_cli and NETCONF

Prior to Ansible 2.5, using networking modules required the connection type to be set to local. A playbook executed the python module locally, and then connected to a networking platform to perform tasks. This was sufficient, but different than how most non-networking Ansible modules functioned. In general, most Ansible modules are executed on the remote host, compared to being executed locally on the Ansible control node. Although many networking platforms can execute Python code, the vast majority require the CLI or an API as the only means for interacting with the device.

[![Ansible-Networking-Workload-Diagram](https://www.redhat.com/rhdc/managed-files/ansible/Ansible-Server-Workload-Diagram.png)](https://www.redhat.com/rhdc/managed-files/ansible/Ansible-Server-Workload-Diagram.png)

In an effort to help streamline the passing of credentials, network modules support an additional parameter called a provider, first introduced in [Ansible 2.3](https://www.ansible.com/blog/networking-features-in-ansible-2-3). A network automation playbook would run locally, use an [Ansible inventory](http://docs.ansible.com/ansible/latest/intro_inventory.html) (just like a normal playbook) but then use the provider on a task-by-task basis to authenticate and connect to each networking platform. This differs from a Linux focused playbook that would initially login to devices using credentials in the inventory itself or passed through the command line.

**network\_cli connection method:**

The provider method is functional for networking but is a different paradigm compared to connection methods on Linux hosts. With Ansible 2.5 the network\_cli connection method also becomes a top level connection. This allows playbooks to look, feel and operate just like they do on Linux hosts. Let's show what this means for your playbooks:

Refer to the following example that compares playbooks using the built-in Cisco IOS module (ios\_config):

**Ansible 2.4 and older**  
 local connection method using provider

```
---
- hosts: rtr1
  connection: local
  gather_facts: no

  vars:
    login:
      username: admin
      password: ansible
      auth_pass: ansible
      authorize: true

  tasks:
    - name: Backup configuration
      ios_config:
        backup: yes
        provider: "{{login}}"
```

**Ansible 2.5**  
 network\_cli connection method

```
---
- hosts: rtr1
  connection: network_cli
  remote_user: admin
  become: yes
  become_method: enable

  tasks:
    - name: Backup configuration
      ios_config:
        backup: yes
```

Note that connecting to networking devices has been simplified with the network\_cli connection method, and that it now mimics how connections are made to non-networking devices.

[![Ansible-2.5-Network-CLI-01](https://www.redhat.com/rhdc/managed-files/ansible/Ansible-2.5-Network-CLI-01.png)](https://www.redhat.com/rhdc/managed-files/ansible/Ansible-2.5-Network-CLI-01.png)

There are additional advantages for executing playbooks at the command line as well. All of the command line options for non-networking platforms can now be used on networking platform playbooks as well. For example, the user, password, connection method and enable parameters can be passed on the command line instead of just the playbook. Note that connection via APIs such as Arista eAPI or Cisco NX API still require the provider method for authentication.

**NETCONF connection method:**

NETCONF also becomes a top-level connection, resulting in connection: netconf to be called at the top level rather than having to be specified as a provider argument. Although not all networking platforms support the NETCONF connection method (more to come), we believe this represents the future for network automation. Connecting to, parsing and passing structured data instead of terminal CLI commands is more reliable, and Ansible is excited to be able to add this feature request.

Refer to the following example that compares playbooks using the built-in Juniper module (junos\_config):

**Ansible 2.4 and older**  
 local connection method using provider

```
---
- hosts: rtr1
  connection: local
  gather_facts: no

  vars:
    login:
      username: admin
      password: ansible
      transport: netconf

  tasks:
    - name: Backup configuration
      junos_config:
        backup: yes
        provider: "{{login}}"
```

**Ansible 2.5**  
 netconf connection method

```
---
- hosts: rtr1
  connection: netconf
  remote_user: admin

  tasks:
    - name: Backup configuration
      junos_config:
        backup: yes
```

Again, just like the network\_cli connection method, playbooks can now use the new netconf connection method if the networking platform supports it.

[![Ansible-2.5-Network-CLI-02](https://www.redhat.com/rhdc/managed-files/ansible/Ansible-2.5-Network-CLI-02.png)](https://www.redhat.com/rhdc/managed-files/ansible/Ansible-2.5-Network-CLI-02.png)

Just like with network\_cli, running playbooks at the command line with the NETCONF connection method is also supported. With all Ansible connection methods, it is also possible to set up network\_cli or netconf as a host parameter in the inventory itself.

For example:

```
[arista]
eos ansible_host=192.168.2.10 ansible_connection=network_cli ansible_network_os=eos

[juniper]
junos ansible_host=192.168.2.20 ansible_connection=netconf ansible_network_os=junos
```

Therefore, it is now possible to specify the connection method for each managed network device inside the inventory file, which adds flexibility and compatibility for multiple networking platforms.

For both network\_cli and netconf connection methods the ansible\_network\_os variable must also be set. This variable informs Ansible which network platform each host corresponds to. For example, if the device is a Juniper router, ansible\_network\_os must be set to junos. This can be set as a variable or even within the inventory itself (as shown above). Refer to the following table for the networking platforms corresponding ansible\_network\_os parameter:

|  |  |
| --- | --- |
| **Network Platform** | **ansible\_network\_os parameter** |
| Arista EOS | eos |
| Cisco IOS | ios |
| Cisco IOS-XR | iosxr |
| Cisco NX-OS | nxos |
| Juniper Junos | junos |
| VyOS | vyos |

There are many more platforms available for use via [community modules](http://docs.ansible.com/ansible/latest/list_of_network_modules.html), but for simplicity and convenience we have detailed networking platforms that are supported as part of the [Red Hat Ansible Engine Networking Add-on](https://www.ansible.com/products/engine/pricing).

## Ansible Fact Improvements

In the playbooks shown above, network automation veterans have noticed another change. Network automation playbooks no longer require gather\_facts: no when using the new network\_cli or netconf connection methods. Previously when using connection: local, if gathering facts was not disabled it would gather facts about the local system. For example, if I ran a playbook from my MacBook Pro on two network devices, I just captured facts about my Macbook Pro twice.

```
SEANs-MacBook:sean$ cat /tmp/cachedir/* | grep ansible_fqdn
    "ansible_fqdn": "SEANs-MacBook-Pro.local",
    "ansible_fqdn": "SEANs-MacBook-Pro.local",
```

With the new connection methods, fact gathering no longer needs to be disabled. Fact gathering for network\_cli and netconf connection methods are not turned on by default.  The playbook author must use the appropriate \*os\_facts module to gather facts.

## Improved Logging

With the [Ansible 2.3 release](https://www.ansible.com/blog/networking-features-in-ansible-2-3), network modules began leveraging the persistent SSH connections framework. Prior to persistent SSH connections, Ansible Playbooks required discrete SSH connections for each task. This meant SSH connections were established and destroyed for each task resulting in extremely high overhead for completion. Persistent SSH connections allow every task to use the same socket throughout the playbook resulting in much better performance. However, some users reported that logging could be enhanced, as demonstrated by the following error message:

```
unable to open shell. Please see: https://docs.ansible.com/ansible/network_debug_troubleshooting.html#unable-to-open-shell
```

Previously, troubleshooting persistent SSH connections required additional steps to debug exactly what the returned “unable to open shell” message meant. With Ansible 2.5 there are now more additional meaningful logging messages that output directly back to the terminal window to quickly troubleshoot and debug any issues.

**Example: Bad username or password**

The following example playbook was run with no password (this playbook works when supplied a password with the -k option):

```
[root@centos aggregate_resources]# ansible-playbook vlan.yml

PLAY [arista] *******************************************************

TASK [eos_vlan] *****************************************************
fatal: [eos]: FAILED! => {"msg": "Authentication failed."}
	to retry, use: --limit @/root/aggregate_resources/purge.retry

PLAY RECAP **********************************************************
eos                 : ok=0    changed=0    unreachable=0    failed=1
```

**Unsupported transport for networking platform**

The following example playbook was run with the network\_cli connection method and  then changed to netconf, which fails because Arista EOS is not yet a supported connection method:

```
[root@centos aggregate_resources]# ansible-playbook vlan.yml

PLAY [arista] *******************************************************

TASK [eos_vlan] *****************************************************
fatal: [eos]: FAILED! => {"msg": "connection=netconf is not supported on eos"}
	to retry, use: --limit @/root/aggregate_resources/purge.retry

PLAY RECAP **********************************************************
eos                 : ok=0    changed=0    unreachable=0    failed=1
```

**Unable to enter configuration mode**

The following example playbook was run with the become and become\_method parameters erroneously removed. Arista vEOS has a default user that logs in as non-privileged. The example playbook requires the enable parameter to be executed correctly. Without become the playbook fails:

```
    [root@centos aggregate_resources]# ansible-playbook vlan.yml

PLAY [arista] *******************************************************

TASK [eos_vlan] *****************************************************
fatal: [eos]: FAILED! => {"changed": false, "msg": "unable to enter configuration mode", "output": "configure session ansible_1513718143\r\n% Invalid input (privileged mode required)\r\nlocalhost>"}
	to retry, use: --limit @/root/aggregate_resources/purge.retry

PLAY RECAP **********************************************************
eos                 : ok=0    changed=0    unreachable=0    failed=1
```

**Host key missing**

In this example, the ~/.ssh/known\_hosts file was erroneously deleted. The control node (the node where the playbook was run from, that has Ansible) is not able to authenticate the network device (since they have never authenticated with each other before).

```
   [root@centos aggregate_resources]# ansible-playbook vlan.yml

PLAY [arista] *******************************************************

TASK [eos_vlan] *****************************************************
fatal: [eos]: FAILED! => {"msg": "paramiko: The authenticity of host '192.168.2.10' can't be established.\nThe ssh-ed25519 key fingerprint is b8618c5d470d714c3512ccac3a52651b."}
	to retry, use: --limit @/root/aggregate_resources/purge.retry

PLAY RECAP **********************************************************
eos                 : ok=0    changed=0    unreachable=0    failed=1
```

These are just a few highlighted examples used for demonstration purposes. Refer to the [networking debug and troubleshooting guide](https://docs.ansible.com/ansible/latest/network_debug_troubleshooting.html) for up-to-date information.

## Continued Enablement for Declarative Intent

In [Ansible 2.4](https://www.ansible.com/blog/networking-features-in-ansible-2-4) the concept of including declarative intent parameters for networking modules was first released. Networking modules enabled for declarative intent can configure the device, but now can also check the operational state. These DI parameters help verify if Ansible Playbooks actually have the networking device setup the way the network operator intended. With Ansible 2.5, additional [Red Hat supported networking modules](https://access.redhat.com/articles/3185021) include additional enablement for declarative intent.

The following table details which modules for which networking platforms have parameters for declarative intent:

|  |  |  |
| --- | --- | --- |
| **Networking Platform** | **Module** | **Parameter** |
| [Arista EOS](http://docs.ansible.com/ansible/latest/list_of_network_modules.html#eos) | [eos\_interface](http://docs.ansible.com/ansible/latest/modules/eos_interface_module.html) | state neighbors rx\_rate tx\_rate |
|  | [eos\_vlan](https://docs.ansible.com/ansible/latest/eos_vlan_module.html) | state interfaces |
|  | [eos\_vrf](https://docs.ansible.com/ansible/latest/eos_vrf_module.html) | interfaces |
| [Cisco IOS](http://docs.ansible.com/ansible/latest/list_of_network_modules.html#ios) | [ios\_interface](https://docs.ansible.com/ansible/latest/ios_interface_module.html) | state neighbors rx\_rate tx\_rate |
|  | [ios\_vlan](http://docs.ansible.com/ansible/latest/modules/ios_vlan_module.html) | state interfaces |
|  | [ios\_vrf](https://docs.ansible.com/ansible/latest/ios_vrf_module.html) | interfaces |
| [Cisco IOS XR](http://docs.ansible.com/ansible/latest/list_of_network_modules.html#iosxr) | [iosxr\_interface](https://docs.ansible.com/ansible/latest/iosxr_interface_module.html) | state rx\_rate tx\_rate |
| [Cisco NX-OS](http://docs.ansible.com/ansible/latest/list_of_network_modules.html#nxos) | [nxos\_interface](https://docs.ansible.com/ansible/latest/nxos_interface_module.html) | state neighbors rx\_rate tx\_rate |
|  | [nxos\_vlan](https://docs.ansible.com/ansible/latest/nxos_vlan_module.html) | state interfaces |
|  | [nxos\_vrf](https://docs.ansible.com/ansible/latest/nxos_vrf_module.html) | interfaces |
| [Juniper Junos](http://docs.ansible.com/ansible/latest/list_of_network_modules.html#junos) | [junos\_interface](https://docs.ansible.com/ansible/latest/junos_interface_module.html) | state neighbors rx\_rate tx\_rate |
|  | [junos\_vrf](https://docs.ansible.com/ansible/latest/junos_vrf_module.html) | interfaces |
| [VyOS](http://docs.ansible.com/ansible/latest/list_of_network_modules.html#vyos) | [vyos\_interface](https://docs.ansible.com/ansible/latest/vyos_interface_module.html) | state neighbors rx\_rate tx\_rate |

Note some network operating systems may not have support for particular DI parameters. For example, if the platform itself does not support VRFs, Ansible cannot configure or check the operational state of VRFs.

Example of the Arista eos\_interface module with DI parameters state, tx\_rate and neighbors set:

```
 - eos_interface:
        name: Ethernet1
        state: up
        tx_rate: gt(0)
        neighbors:
         - port: Ethernet1
           host: leaf2
```

This example checks the following:

- Ethernet1 on the current interface is transmitting more than 0 bits per second (bps)
- The LLDP neighbor for Ethernet1 is named leaf2
- Ethernet1 on the current interface is connected to Ethernet1 port on leaf2

What happens when a DI parameter is not met? In the above example if the interface is not connected (administratively up and protocol up) the task will fail.

```
    TASK [eos_interface] *********************************************************************************************************
fatal: [eos]: FAILED! => {"attempts": 1, "changed": false, "failed_conditions": ["state eq(up)"], "msg": "One or more conditional statements have not been satisfied"}
```

In the above example if there is 0 bps on the interface tx\_rate the task will fail. The Ansible play will output an error with the condition that was not met.

```
    TASK [eos_interface] *********************************************************************************************************
fatal: [eos]: FAILED! => {"attempts": 1, "changed": false, "failed_conditions": ["tx_rate gt(0)"], "msg": "One or more conditional statements have not been satisfied"}
```

The DI parameters are tested in the order they are provided to the task. In the above task the tx\_rate comes before the neighbors parameter so the task will fail on the first parameter that fails. If the tx\_rate passed but the neighbors parameter failed a different error would be shown:

```
 TASK [eos_interface] *********************************************************************************************************
fatal: [eos]: FAILED! => {"attempts": 1, "changed": false, "failed_conditions": ["host leaf2", "port Ethernet1"], "msg": "One or more conditional statements have not been satisfied"}
```

If it is desired to save the results of DI tasks and not fail, this can be accomplished with combination of register and ignore\_errors. This is demonstrated with the net\_check playbook at the [Network Automation Community GitHub repository](https://github.com/network-automation/net_check).

## Persistent SSH Connection Improvements

In addition to logging and troubleshooting improvements previously mentioned, increased logging for persistent SSH connection itself has been improved. With verbosity set, log messages are shown where the Ansible Playbook checks for an existing socket. If [the socket](https://en.wikipedia.org/wiki/Network_socket) does not exist it will create one and keep it open for the duration of the playbook.

```
<192.168.2.10> control socket path is /root/.ansible/pc/423b3317dd
<192.168.2.10> connection to remote device started successfully
<192.168.2.10> local domain socket listeners started successfully
<192.168.2.10> local domain socket path is /root/.ansible/pc/423b3317dd
```

Subsequent tasks will re-use this socket. This behavior can also be seen in the verbose output.

```
<192.168.2.10> attempting to start connection
<192.168.2.10> using connection plugin network_cli
<192.168.2.10> found existing local domain socket, using it!
<192.168.2.10> updating play_context for connection
<192.168.2.10> local domain socket path is /root/.ansible/pc/423b3317dd
```

In the output the socket 423b3317dd is used for both tasks.

Additional SSH behavior improvements have also been included. With Ansible 2.3 and 2.4, the persistent SSH connection remained open for 30 seconds after the playbook completed. In Ansible 2.5, this socket is shut down immediately at the end of a playbook run. This removes the possibility that the socket could be exploited or misused by another program or process.

If you are Network Module Developer and want more information about getting network modules to work with the persistent connections, refer to the [Ansible Network Developers Guide](https://github.com/ansible/community/blob/master/group-network/network_dev_network_cli.rst#requirements-for-network-module-developers).

## Additional Platforms and Modules

Finally, Ansible 2.5 adds more modules for new and existing networking infrastructure platforms with help from corporate and community partnerships. This means additional built-in enablement for more devices and more features and functionality exposed for use in Ansible across your entire IT infrastructure.

The following new platforms have been added to date:

- [Brocade Ironware](http://docs.ansible.com/ansible/latest/modules/list_of_network_modules.html#ironware)
- [Cisco NSO](http://docs.ansible.com/ansible/latest/modules/list_of_network_modules.html#nso)
- [Fortinet Fortimanager](http://docs.ansible.com/ansible/latest/modules/list_of_network_modules.html#fortimanager)
- [Infoblox NIOS](http://docs.ansible.com/ansible/latest/modules/list_of_net_tools_modules.html#nios)
- [Lenovo ENOS](http://docs.ansible.com/ansible/latest/modules/list_of_network_modules.html#enos)
- [Mellanox ONYX](http://docs.ansible.com/ansible/latest/modules/list_of_network_modules.html#onyx)
- [Nokia NetAct](http://docs.ansible.com/ansible/latest/modules/list_of_network_modules.html#netact)

The Ansible Networking team is excited for the forthcoming Ansible 2.5 release, and would like to extend a warm thank you to all networking partners and community members that helped make it possible. We love to hear your feedback, thoughts and ideas, and we welcome you to participate in the [Ansible networking community](https://github.com/ansible/community/tree/master/group-network).
