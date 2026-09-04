---
title: Porting Ansible Network Playbooks with New Connection Plugins
slug: porting-ansible-network-playbooks-with-new-connection-plugins
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2018-04-19'
updated: '2026-06-16'
source: redhat
source_url: https://www.redhat.com/en/blog/porting-ansible-network-playbooks-with-new-connection-plugins
description: 'With the release of new networking features in Ansible 2.5 one of the
  biggest areas of feedback was around the network_cli connection plugin. In this
  post we take you through converting existing networking playbooks that use connection:
  local to using connection: network_cli.'
topics:
- Network automation
read_time_minutes: 7
synced_at: '2026-09-03T19:21:20Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** With the release of new networking features in Ansible 2.5 one of the biggest areas of feedback was around the network_cli connection plugin. In this post we take you through converting existing networking playbooks that use connection: local to using connection: network_cli.

<!-- blog-enrichment:end -->

[![](https://www.redhat.com/rhdc/managed-files/ansible/Porting-Ansible%20Ansible-Network%20Playbooks-with-Connection%20Plugins.png)](https://www.redhat.com/rhdc/managed-files/ansible/Porting-Ansible%20Ansible-Network%20Playbooks-with-Connection%20Plugins.png)

The Ansible Networking Team is excited about the release of [Ansible 2.5](https://www.redhat.com/blog/ansible-2.5-traveling-space-and-time). Back in February, I wrote about new [Networking Features in Ansible 2.5](https://www.redhat.com/blog/coming-soon-networking-features-in-ansible-2.5), and one of the biggest areas of feedback was around the network\_cli connection plugin. For more background on this connection plugin, please refer to the previous blog post.

In this post, I convert existing networking playbooks that use `connection: local` to use `connection: network_cli`. Please note that the passwords are in plain text for demonstration purposes only. Refer to the following Ansible Networking documentation page recommendation for using Ansible Vault for secure password storage and usage.  

To demonstrate, let’s use an existing GitHub repository with working playbooks using the legacy connection local method. NOTE: The connection local method will continue to be supported for quite some time, and has not been announced as deprecated yet. This repository has several examples using Ansible and NAPALM but we are highlighting the Ansible Playbooks in this post.  The GitHub repository can be [found here](https://github.com/network-automation/ansible-napalm-samples).

> [!callout type=tmm label="TMM resource" title="Ansible Product Demos" url="https://ansible.github.io/product-demos/" cta="Browse demos"]
> Reusable demos that showcase Ansible Automation Platform capabilities.

### [Example 1 - Backing Up a Configuration](https://github.com/network-automation/ansible-napalm-samples#example-1---backing-up-a-config)

Networking platforms use their specific `*_config` platform module for easy backups within Ansible. For this playbook we are running the Ansible Playbook against a Cisco NX-OS platform, so we are using the nxos\_config module. Using this module, set the `backup` parameter to `yes`.  This is how the playbook looked using the `connection: local` and `provider` method in Ansible 2.4:

```
---
- hosts: cisco
  connection: local
  tasks:
    - nxos_config:
        backup: yes
        provider: "{{login_info}}"
```

For all of the Ansible samples the provider variables such as `login_info` are located in `group_vars/all`:

```
[sean@centos]$ cat group_vars/all.yml                                                                                               ---
login_info:
  username: admin
  password: Bullf00d!
  authorize: True
```

**How do we take advantage of the network\_cli connection method in Ansible 2.5?**

1. Change the `connection: local` to `connection: network_cli`
2. Remove the `provider` parameter from the task
3. Convert the information in the `login_info` variable in your playbook to your inventory file
4. Add appropriate `ansible_network_os` entries to your inventory

|  |  |
| --- | --- |
| **Network Platform** | **ansible\_network\_os parameter** |
| Arista EOS | eos |
| Cisco IOS | ios |
| Cisco IOS-XR | iosxr |
| Cisco NX-OS | nxos |
| Juniper Junos | junos |
| VyOS | vyos |

**Convert the playbook for steps 1 and 2:**

Local Connection (2.4):

```
---
- hosts: cisco
  connection: local
  tasks:
    - nxos_config:
       backup: yes
       provider: "{{login_info}}"
```

Network\_cli Connection (2.5):

```
---
- hosts: cisco
  connection: network_cli
  tasks:
   - nxos_config:
      backup: yes
```

**Modify the inventory for steps 3 and 4:**

```
[sean@centos]$ cat hosts
[cisco]
n9k ansible_host=192.168.2.3
```

**Next, add three fields for the n9k host:**

- `ansible_user`
- `ansible_password`
- `ansible_network_os`

For this specific scenario, a few assumptions are required:

- The username and password is specific for a particular host (in other words, n9k’s username and password is different from n9k-2’s username and password).
- All the devices in the `[cisco]` group are Cisco Nexus devices.

```
[sean@centos]$ cat hosts
[cisco]
n9k ansible_host=192.168.2.3 ansible_user=admin ansible_password=Bullf00d

[cisco:vars]
ansible_network_os=nxos
```

As you can see above we can tie inventory parameters to a particular host, or to the entire group. The old playbook is named `backup-oldmethod.yml`, and the new playbook is named `backup.yml`. The playbook now runs with the `ansible-playbook` command:

```
[sean@centos]$ ansible-playbook backup.yml

PLAY [cisco] *******************************************************************************************

TASK [nxos_config] ***********************************************************************************
ok: [n9k]

PLAY RECAP ******************************************************************************************
n9k                        : ok=1    changed=0    unreachable=0    failed=0
```

### [Example 2 - Adding an IP address to an Interface](https://github.com/network-automation/ansible-napalm-samples#example-2---adding-an-ip-address-to-an-interface)

In the second Ansible Playbook example we are running against an Arista EOS platform, so we are using the eos\_config module.  

The login information for the Arista EOS device for this example is different from the Cisco NX-OS device, and requires an enable password for privileged commands:

```
[sean@centos]$ cat group_vars/all.yml   
---
login_info_eos:
  username: admin
  password: Bullf00d!
  authorize: True
  auth_pass: DURHAM!
```

Just like in the first example, we need to perform the following activities:

1. Convert the provider dictionary into our inventory
2. Set `ansible_network_os` to `eos`
3. Convert not just the `username` and `password`, but also `authorize` and `auth_pass`
4. Now that network\_cli is a top level connection, ansible\_become\_method is also available now that Ansible leverages the built-in Become (Privilege Escalation). Therefore, specify `enable`, which is similar to Linux’s `sudo`.

|  |  |
| --- | --- |
| **Provider Dictionary (2.4)** | **Inventory Variable (2.5)** |
| authorize: True | ansible\_become=yes |
|  | ansible\_become\_method=enable |
| auth\_pass: DURHAM! | ansible\_become\_pass=DURHAM! |

For our particular example, we assume all Arista devices (devices within the group named `[arista]`) use the same username, password and enable password. This means we can set those parameters under the group `[arista:vars]`. This is what the inventory for it looks like:

```
[arista]
eos ansible_host=192.168.2.10

[arista:vars]
ansible_network_os=eos
ansible_become=yes
ansible_become_method=enable
ansible_user=admin
ansible_password=Bullf00d!
ansible_become_pass=DURHAM!
```

**Now let’s convert the Ansible Playbook:**

Local Connection (2.4):

```
---
- hosts: arista
  connection: local
  tasks:
    - eos_config:
        lines:
          - no switchport
          - ip address 172.16.1.1/24
        parents: interface Ethernet1
        provider: "{{login_info_eos}}"
```

Network\_cli Connection (2.5):

```
---
- hosts: arista
  connection: network_cli
  tasks:
    - eos_config:
        lines:
          - no switchport
          - ip address 172.16.1.1/24
        parents: interface Ethernet1
```

The old playbook is called `ipaddress-oldmethod.yml`, and the new playbook is called `ipaddress.yml`. The playbook now runs the `ansible-playbook` command:

```
[sean@centos]$ ansible-playbook backup.yml

PLAY [cisco] *******************************************************************************************

TASK [nxos_config] ***********************************************************************************
ok: [n9k]

PLAY RECAP ******************************************************************************************
n9k                        : ok=1    changed=0    unreachable=0    failed=0
```

There are also two more examples on the GitHub repo:

- [Adding a new VLAN](https://github.com/network-automation/ansible-napalm-samples#example-3---adding-a-new-vlan)
- [Changing an SNMP Password](https://github.com/network-automation/ansible-napalm-samples#example-4---change-the-snmp-password)

Please consider joining the network-automation GitHub! Just [email us](mailto:ansible-network@redhat.com) with your GitHub username.

### FAQ

**Q: What happens if I don’t convert my playbooks for Ansible 2.5?**  
A: Nothing, except your playbooks won't be as quick and efficient as they could be. The `connection: local` and `provider` method are not being deprecated for the Ansible 2.5 release. However, in relation to Ansible networking modules, it is planned for future deprecation (TBD).   

Please note that deprecating something in Ansible doesn’t mean that it will be immediately removed. Currently, all deprecated parameters, features, modules, etc, are supported for four release cycles after deprecation before they are removed from the Ansible project. When looking at the release cycle you can see that four release cycles is roughly 16 months. You will see a deprecation warning when you run a playbook with a deprecated parameter, feature, or module. Please refer to the Porting Guide before upgrading Ansible.  

> [!callout type=tmm label="TMM resource" title="Network automation on the TMM blog" url="/blog/?author=sean-cavanaugh" cta="Browse posts"]
> More posts on network automation from the Ansible Technical Marketing team.

For more information, you can check out the change log on GitHub to look at what is being deprecated per release.

---

**Q: What if I wrote a module, using an Ansible module, or am using a module provided elsewhere that requires the connection: local method?  You are going to deprecate connection: local?**

A: No. The `connection: local` is not being deprecated, and there are no plans to deprecate it.  Ansible will deprecate the `connection: local` connection method and provider parameter for Ansible Networking modules written by Red Hat.

Module writers should refer to the [Developing network\_cli platforms](https://github.com/ansible/community/blob/master/group-network/network_dev_network_cli.rst) wiki.

---

**Q: Is there a connection: eapi (Arista EOS) or connection: nxapi (Cisco NX-OS)?**

A:  Not yet. In Ansible 2.5, you still need to use the `connection: local` and `provider` method for eapi or nxapi. The eapi and nxapi connections are on the radar for the Ansible Networking team and we will update the roadmap for Ansible Networking after Ansible 2.5 officially launches. Please bookmark the [Ansible Networking wiki](https://github.com/ansible/community/wiki/Network), which contains the roadmap.

---

**Q: What if I have a playbook using a non-networking module (e.g., template module)?**  
A: Modules (or rather, tasks that use modules) that are not networking modules will run locally. Let’s look at an example:

```
---
- hosts: cisco
  connection: network_cli
  tasks:
    - name: backup device configurations
      nxos_config:
        backup: yes
      register: nxos_config_backup

    - name: copy the backup to the desired location
      copy:
        src: "{{ nxos_config_backup['backup_path'] }}"
        dest: "nxos/{{ inventory_hostname }}"

    - name: delete the original file
      file:
        path: "{{ nxos_config_backup['backup_path'] }}"
        state: absent
```

This playbook has three tasks:

1. Create a backup file, under the backup directory
2. Copy this backup file to the desired location (we want to save it under the directory nxos/n9k (n9k is the hostname we have setup in our inventory, we can call this using the `inventory_hostname` variable).
3. Delete the file we copied from.

The first task uses a network-specific module (`nxos_config`), while the other two tasks use generic Linux modules (`copy` and `file`).  This playbook executes the nxos\_config against the specified hosts (the Ansible group `[cisco]`, specified by `hosts: cisco`).  When using the **netconf** or **network\_cli** connection plugin, the copy and file modules run locally (from the machine Ansible was executed from).  

As a side note: it’s very common to see Ansible Networking Playbooks where someone might template a file, then push it to the device like this:

```
- name: render a jinja2 template
  template:
    src: network_config.j2
    dest: network_config

- name: push device configurations
  nxos_config:
    src: network_config
```

The above works with **network\_cli** and **netconf** connection plugins.  The template module runs locally while the nxos\_config module runs against the specified hosts. However, the \*os\_config modules, including `nxos_config`, can take jinja2 files directly, without the need to use the template module.  Below is an example of what the playbook would look like:

```
- name: template AND push device configurations
  nxos_config:
    src: network_config.j2
```

---

**Q: Where can I get more info?**

A: Check out the offical Ansible 2.5 porting guide and   
the new Ansible Networking documentation

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Join Red Hat Ansible Automation Platform at AutoCon 2](/blog/red-hat-ansible-will-be-autocon2/)
> - [Ansible Network Resource Modules: Deep Dive on Return Values](/blog/ansible-network-resource-modules-deep-dive-on-return-values/)
> - [Red Hat Ansible Network Automation Updates](/blog/red-hat-ansible-network-automation-updates/)

<!-- blog-enrichment:related-end -->
