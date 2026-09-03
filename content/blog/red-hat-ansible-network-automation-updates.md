---
title: Red Hat Ansible Network Automation Updates
slug: red-hat-ansible-network-automation-updates
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2018-10-10'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/red-hat-ansible-network-automation-updates
description: Red Hat Ansible Networking product updates featuring new network automation
  modules, improved Ansible Tower user experience, Ansible Tower credential management
  for network devices, custom Ansible environment support for Ansible Tower and more.
topics:
- Network automation
read_time_minutes: 11
synced_at: '2026-09-03T19:21:18Z'
---

With the recent success of the largest AnsibleFest to date I wanted to take a minute to reflect with a network automation perspective on the colossal enhancements the engineering team at Red Hat has done for the Ansible Engine 2.6 release, the Ansible Tower 3.3 release and the recent Ansible Engine 2.7 release. As a reminder for all Ansible lovers there is a [porting guide](https://docs.ansible.com/ansible/latest/porting_guides/porting_guides.html) for every release to make upgrades as easy as possible!

For this blog post I am going to cover the following topics:

- The httpapi connection plugin

- Support for Arista eAPI and Cisco NX-API

- New network automation modules

- net\_get and net\_put
- netconf\_get, netconf\_rpc and netconf\_config
- cli\_command and cli\_config

- Improved Ansible Tower User Experience
- Ansible Tower credential management for network devices
- Custom Ansible Environment Support for Ansible Tower

## The HTTPAPI connection plugin

[Connection plugins](https://docs.ansible.com/ansible/latest/plugins/connection.html) allow Ansible to connect to target hosts so it can execute tasks on them. With the Ansible 2.5 release the network\_cli connection plugin was introduced, removing the requirement for the provider parameter and standardizing network modules to allow playbooks to look, feel and operate just like they do on Linux hosts. This also allowed Red Hat Ansible Tower to treat network devices like other devices and utilize “machine credentials,” no longer needing “network credentials.” This was covered in a [previous blog post](https://www.ansible.com/blog/coming-soon-networking-features-in-ansible-2.5), but login information like username and password could be used and stored similarly for a Linux server and for an Arista EOS switch or Cisco router.

However, connecting via eAPI and NX-API methods were previously only supported using the legacy provider method. With Ansible 2.6 this is no longer a restriction and the top level httpapi connection method can be used instead. Let’s demonstrate what this looks like.

First, eAPI or NX-API must be enabled on the networking platform for the httpapi method to be usable. Luckily this is super simple with Ansible! An ad-hoc command can quickly turn on eAPI on my Arista EOS switch. 

```
[user@rhel7]$ ansible -m eos_eapi -c network_cli leaf01  
leaf01 | SUCCESS => {   
   "ansible_facts": {   
     "eos_eapi_urls": {   
       "Ethernet1": [   
            "https://192.168.0.14:443"   
        ],   
        "Management1": [   
             "https://10.0.2.15:443"   
        ]   
     }   
    },   
    "changed": false,   
    "commands": []  
}
```

When connecting to the actual Arista EOS switch, a show management api http-commands command shows us the API is turned on:

```
leaf01# show management api http-commands  
Enabled:      Yes  
HTTPS server: running, set to use port 443  
<<<rest of output removed for brevity>>>
```

The following Ansible Playbook performs a simple “show version” and then a debug statement will return just the version from the JSON output provided from the task.

```
---  
- hosts: leaf01   
  connection: httpapi   
  gather_facts: false   
  tasks:   
    - name: type a simple arista command   
      eos_command:   
      commands:   
        - show version | json   
      register: command_output   
  
    - name: print command output to terminal window   
      debug:   
        var: command_output.stdout[0]["version"]
```

Running the playbook will result in the following:

```
[user@rhel7]$ ansible-playbook playbook.yml  
PLAY [leaf01]********************************************************  
  
TASK [type a simple arista command] *********************************  
ok: [leaf01]  
  
TASK [print command output to terminal window] **********************  
ok: [leaf01] => {   
     "command_output.stdout[0][\"version\"]": "4.20.1F"   
  
}   
  
PLAY RECAP***********************************************************  
leaf01 : ok=2 changed=0 unreachable=0 failed=0
```

As a side note, the short versions of commands (e.g. “show ver” vs “show version”) don’t work on Arista eAPI, you must use the full command. For more information on the httpapi connection plugin refer to the [relevant documentation](https://docs.ansible.com/ansible/latest/plugins/connection/httpapi.html).

New network automation modules

The Ansible 2.6 release and upcoming 2.7 release have seven new modules.

#### **net\_get and net\_put**

- [net\_get](https://docs.ansible.com/ansible/latest/modules/net_get_module.html) - copy a file from a network device to Ansible Controller
- [net\_put](https://docs.ansible.com/ansible/latest/modules/net_put_module.html) - copy a file from Ansible Controller to a network device
- [netconf\_get](https://docs.ansible.com/ansible/latest/modules/netconf_get_module.html#netconf-get-module) - fetch configuration/state data from NETCONF enabled network devices
- [netconf\_rpc](https://docs.ansible.com/ansible/latest/modules/netconf_rpc_module.html#netconf-rpc-module) - execute operations on NETCONF enabled network devices
- [netconf\_config](https://docs.ansible.com/ansible/latest/modules/netconf_config_module.html#netconf-config-module) - netconf device configuration, module allows the user to send a configuration XML file to a netconf device, and detects if there was a configuration change.
- [cli\_command](https://docs.ansible.com/ansible/latest/modules/cli_command_module.html#cli-command-module) - run a cli command on cli-based network devices
- [c](https://docs.ansible.com/ansible/devel/modules/cli_config_module.html#cli-config-module)[li\_config](https://docs.ansible.com/ansible/latest/modules/cli_config_module.html#cli-config-module) - push text based configuration to network devices over network\_cli

The net\_get and net\_put modules are agnostic modules that use standard SCP or SFTP transfer protocols (chosen by the protocol parameter) to copy files to and from network devices. Both modules require use of the network\_cli connection method, and that scp is installed (pip install scp) on the controller, and that SCP (or SFTP) is enabled on the network device. 

For this playbook to work we will assume we already performed the following on Leaf01:

```
leaf01#copy running-config flash:running_cfg_eos1.txt  
Copy completed successfully.
```

Here is a look at a playbook with two tasks. The first task copies a file from Leaf01 and the second task copies a file to Leaf01

```
---  
- hosts: leaf01   
  connection: network_cli   
  gather_facts: false   
  tasks:   
     
   - name: COPY FILE FROM THE NETWORK DEVICE TO ANSIBLE CONTROLLER   
     net_get:   
       src: running_cfg_eos1.txt   
  
  - name: COPY FILE FROM THE ANSIBLE CONTROLLER TO THE NETWORK DEVICE   
    net_put:   
      src: temp.txt
```

netconf\_get, netconf\_rpc and netconf\_config

- [netconf\_get](https://docs.ansible.com/ansible/latest/modules/netconf_get_module.html#netconf-get-module) - fetch configuration/state data from NETCONF enabled network devices
- [netconf\_rpc](https://docs.ansible.com/ansible/latest/modules/netconf_rpc_module.html#netconf-rpc-module) - execute operations on NETCONF enabled network devices
- [netconf\_config](https://docs.ansible.com/ansible/latest/modules/netconf_config_module.html#netconf-config-module) - netconf device configuration, module allows the user to send a configuration XML file to a netconf device, and detects if there was a configuration change.

The Network Configuration Protocol (NETCONF) is a network management protocol developed and standardized by the IETF. As defined in RFC 6241, NETCONF can be used to install, manipulate, and delete the configuration of network devices. NETCONF is an alternative to SSH command line (network\_cli) and device APIs like Cisco NX-API and Arista eAPI (httpapi).  
  
To showcase the new netconf modules, I will first enable netconf on some Juniper routers using the [junos\_netconf](https://docs.ansible.com/ansible/latest/modules/junos_netconf_module.html) module. Not all networking devices support netconf so please check your vendor’s documentation for which specific platforms support it.

```
[user@rhel7 ~]$ ansible -m junos_netconf juniper -c network_cli  
rtr4 | CHANGED => {   
    "changed": true,   
    "commands": [   
         "set system services netconf ssh port 830"   
    ]  
}  
rtr3 | CHANGED => {   
    "changed": true,   
    "commands": [   
         "set system services netconf ssh port 830"   
    ]  
}
```

Juniper Networks has a Junos XML API Explorer for [Operational Tags](https://apps.juniper.net/xmlapi/operTags.jsp) as well as [Configuration Tags](https://apps.juniper.net/xmlapi/). Lets look at an operational requests example Juniper Networks [uses in their example documentation](https://www.juniper.net/documentation/en_US/junos/topics/task/operational/netconf-session-request-sending.html) for an RPC request for a specific interface:

```
<rpc>  
  <get-interface-information>  
   <interface-name>ge-2/3/0</interface-name>  
    <detail/>  
 </get-interface-information>  
</rpc>  
]]>]]>
```

This will translate elegantly to an Ansible Playbook. The get-interface-information is the RPC call, and additional parameters are defined under the content parameter as key, value pairs. In this case there is one option, the interface-name, and on our network device we just want to look at em1.0. We use the register task level parameter simply to save the results so we can use the debug module and print the output to the terminal window. The netconf\_rpc module also allows us to translate the XML return values directly into JSON.

```
---  
- name: RUN A NETCONF COMMAND   
  hosts: juniper   
  gather_facts: no   
  connection: netconf   
  
  tasks:   
  
    - name: GET INTERFACE INFO   
      netconf_rpc:   
        display: json   
        rpc: get-interface-information   
        content:   
          interface-name: "em1.0"   
      register: netconf_info   
  
    - name: PRINT OUTPUT TO TERMINAL WINDOW   
      debug:   
        var: netconf_info
```

Running the playbook will return the following:

```
ok: [rtr4] => {  
   "netconf_info": {  
   "changed": false,  
   "failed": false,  
   "output": {  
      "rpc-reply": {  
        "interface-information": {  
         "logical-interface": {  
          "address-family": [  
           {  
              "address-family-flags": {  
                 "ifff-is-primary": ""  
               },  
               "address-family-name": "inet",  
               "interface-address": [  
               {  
                  "ifa-broadcast": "10.255.255.255",  
                  "ifa-destination": "10/8",  
                  "ifa-flags": {  
                      "ifaf-current-preferred": ""  
                  },  
                  "ifa-local": "10.0.0.4"  
                },  
<<<rest of output removed for brevity>>>
```

For more information on the Juniper platform refer to the [Juniper P](https://docs.ansible.com/ansible/latest/network/user_guide/platform_junos.html#junos-os-platform-options)[latform](https://docs.ansible.com/ansible/latest/network/user_guide/platform_junos.html#junos-os-platform-options) [G](https://docs.ansible.com/ansible/latest/network/user_guide/platform_junos.html#junos-os-platform-options)[uide](https://docs.ansible.com/ansible/latest/network/user_guide/platform_junos.html#junos-os-platform-options). For more information on the NETCONF connection plugin refer to [the](https://docs.ansible.com/ansible/latest/plugins/connection/netconf.html) [NETCONF](https://docs.ansible.com/ansible/latest/plugins/connection/netconf.html) [documentation](https://docs.ansible.com/ansible/latest/plugins/connection/netconf.html).

### cli\_command and cli\_config

- [cli\_command](https://docs.ansible.com/ansible/devel/modules/cli_command_module.html#cli-command-module) - run a cli command on cli-based network devices
- [cli\_config](https://docs.ansible.com/ansible/devel/modules/cli_config_module.html#cli-config-module) - push text based configuration to network devices over network\_cli

Available in the Ansible Engine 2.7 release, the cli\_command and cli\_config modules are vendor agnostic modules for automating against network platforms. These modules key off of the ansible\_network\_os variable (defined in the inventory file or group\_vars directory) to use the correct cliconf plugin. This results in a more vendor neutral approach to network automation playbooks. For a list of all the ansible\_network\_os values please [refer to the documentation](https://docs.ansible.com/ansible/latest/network/user_guide/platform_index.html#settings-by-platform). The platform modules are not being deprecated in this release, so there is no rush to update existing playbooks! Please refer to the [official porting guides](https://docs.ansible.com/ansible/latest/porting_guides/porting_guides.html) for more information.

[![Network-Automation-Module-Deprecation](https://www.redhat.com/rhdc/managed-files/ansible/Network-Automation-Module-Deprecation.png)](https://www.redhat.com/rhdc/managed-files/ansible/Network-Automation-Module-Deprecation.png)

Let's look at what an Ansible Playbook would look like. This playbook will be run against two Cisco Cloud Services Routers (CSR) running IOS-XE. We set ansible\_network\_os to ios in our inventory.

```
<config snippet from inventory>  
[cisco]  
rtr1 ansible_host=34.203.197.120   
rtr2 ansible_host=34.224.60.230  
  
[cisco:vars]  
ansible_ssh_user=ec2-user  
ansible_network_os=ios
```

Here is a playbook using cli\_config and cli\_command:

```
---  
- name: AGNOSTIC PLAYBOOK   
  hosts: cisco   
  gather_facts: no   
  connection: network_cli   
    
  tasks:   
     - name: CONFIGURE DNS   
       cli_config:   
         config: ip name-server 8.8.8.8   
  
     - name: CHECK CONFIGURATION   
         cli_command:   
           command: show run | i ip name-server   
       register: cisco_output   
  
     - name: PRINT OUTPUT TO SCREEN   
       debug:   
         var: cisco_output.stdout
```

Finally, the output of the Ansible Playbook:

```
[user@rhel7 ~]$ ansible-playbook cli.yml  
  
PLAY [AGNOSTIC PLAYBOOK] *********************************************  
  
TASK [CONFIGURE DNS] *************************************************  
ok: [rtr1]  
ok: [rtr2]  
  
TASK [CHECK CONFIGURATION] *******************************************  
ok: [rtr1]  
ok: [rtr2]  
  
TASK [PRINT OUTPUT TO SCREEN] ****************************************  
ok: [rtr1] => {   
    "cisco_output.stdout": "ip name-server 8.8.8.8"  
}  
ok:   
    [rtr2] => {   
    "cisco_output.stdout": "ip name-server 8.8.8.8"  
}  
  
PLAY RECAP **********************************************************  
rtr1 : ok=3 changed=0 unreachable=0 failed=0  
rtr2 : ok=3 changed=0 unreachable=0 failed=0
```

Looking at the output above you will also notice that the modules are [idempotent](https://docs.ansible.com/ansible/latest/reference_appendices/glossary.html) as long as you use the matching syntax for the appropriate network device.

## Improved Ansible Tower User Experience

With the release of Red Hat Ansible Tower 3.3, the web user interface has been improved to be more functional and to get more things done with less clicks. When you login to your upgraded Ansible Tower 3.3 you will be greeted with the new refreshed UX. 

Credential management, job scheduling , inventory scripts, role based access control (RBAC), notifications and more are now one click away on the left menu. When looking under the Jobs View more information is provided at the top level, such as the start time, user who launched the job, inventory the job was run against and the project the playbook was retrieved from.

## Ansible Tower Credential Management for Network Devices

With Red Hat Ansible Tower 3.3, credential management is now easier than ever for network devices. With the new Web UI, reaching the **Credentials** menu is just 1-click away. Select **Credentials** under **Resources** on the left-hand menubar. 

Previously, there was a credential type called **Network** which sets environment variables ANSIBLE\_NET\_USERNAME and ANSIBLE\_NET\_PASSWORD which works well with the legacy network provider method. This is documented in the [credential section of the Tower documentation](https://docs.ansible.com/ansible-tower/latest/html/userguide/credentials.html#network) and is still fully supported for existing Ansible Playbooks. However with the new top-level httpapi and network\_cli connection methods, this is no longer required. Usernames and passwords work identically to how Ansible connects to standard Linux hosts. Therefore, the **Machine** credentials type can now be used for network devices. Select the Machine credential and just type in the username and password (or provide an SSH key). 

NOTE: Ansible Tower encrypts the password once you save the credential.

With encryption, the credential can be delegated to groups or individuals without them seeing or knowing the actual password. For more information on how the credentials work, what encryption is being used, and other credential types (like Amazon AWS, Microsoft Azure and Google GCE) check out the relevant [Ansible](https://docs.ansible.com/ansible-tower/latest/html/userguide/credentials.html)[Tower Documentation](https://docs.ansible.com/ansible-tower/latest/html/userguide/credentials.html).

For a more detailed description of the new Red Hat Ansible Tower 3.3 release checkout Chris Short’s [blog post here](https://www.ansible.com/blog/ansible-tower-3.3-available-now).

   
Custom Ansible Environment Support for Tower

What if I want some Ansible Playbooks to run with Ansible Engine 2.4.2 and some playbooks to run with Ansible Engine 2.6.4? To solve this particular use case Tower uses virtualenv. Virtualenv is a tool to create isolated Python environments to avoid problems caused by conflicting dependencies and differing versions. With the Ansible Tower 3.3 release the virtualenv can be set at the Organization, Project or Job Template level. Here is a look at the Job Template we have setup in Ansible Tower for performing backups of our network.

As soon as two or more virtual environments are configured on Ansible Tower, an **Ansible Environment** drop down menu will appear in the Web UI. This makes it incredibly easy to choose which version of Ansible a particular Job is run with.

If,you have a mix of network automation playbooks that were written using the provider method (pre Ansible 2.4 and earlier) and newer playbooks using httpapi or network\_cli connection plugins (2.5 and later) you could now easily assign different versions of Ansible to each particular Job. Other possible use-cases include having different versions of Ansible for your dev environment vs your production environment. To think about this another way, upgrading Tower does not mean your organization is locked to one particular version of Ansible Engine. This allows a lot more flexibility for automating different types of networking gear, environments and use cases.

For more information on using virtualenv with Ansible Tower refer to the [re](https://docs.ansible.com/ansible-tower/latest/html/upgrade-migration-guide/virtualenv.html#using-virtualenv-with-at)[levant](https://docs.ansible.com/ansible-tower/latest/html/upgrade-migration-guide/virtualenv.html#using-virtualenv-with-at) [documentation](https://docs.ansible.com/ansible-tower/latest/html/upgrade-migration-guide/virtualenv.html#using-virtualenv-with-at).

## Thank You

The Ansible Networking team is excited about the forthcoming Ansible 2.7 release, and would like to extend a warm thank you to all networking partners and community members who helped make it possible. We love to hear your feedback, thoughts and ideas, and we welcome you to participate in the[Ansible networking community](https://github.com/ansible/community/tree/master/group-network).
