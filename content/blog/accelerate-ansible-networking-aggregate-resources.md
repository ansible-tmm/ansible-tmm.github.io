---
title: Accelerate Network Automation with Aggregate Resources
slug: accelerate-ansible-networking-aggregate-resources
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2018-01-09'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/accelerate-ansible-networking-aggregate-resources
description: Accelerate Network Automation with aggregate resources as a better way
  to iterate without the need to execute each task one by one.
topics:
- Network automation
read_time_minutes: 5
synced_at: '2026-09-03T19:21:24Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** Accelerate Network Automation with aggregate resources as a better way to iterate without the need to execute each task one by one.

<!-- blog-enrichment:end -->

[![](https://www.redhat.com/rhdc/managed-files/ansible/Ansible-Networking-Update-Social.png)](https://www.redhat.com/rhdc/managed-files/ansible/Ansible-Networking-Update-Social.png)

One of the major networking features in Red Hat Ansible Engine 2.4 was the addition of **aggregate resources** to the networking modules. The Ansible networking team recently talked about this at the Ask an Expert webinar in November.

### What are Aggregate Resources?

Simply put, aggregate resources are a better way to iterate (or loop) without the need to execute each task one by one. That is, you can now “aggregate” a collection as a single task instead of a collection of discrete loops.

**Loop Method**

[![](https://www.redhat.com/rhdc/managed-files/ansible/Loop-Method-Networking-Diagram.png)](https://www.redhat.com/rhdc/managed-files/ansible/Loop-Method-Networking-Diagram.png)

**Aggregate Method**

[![](https://www.redhat.com/rhdc/managed-files/ansible/Aggregate-Method-Networking-Diagram.png)](https://www.redhat.com/rhdc/managed-files/ansible/Aggregate-Method-Networking-Diagram.png)

| Loop Method (with\_items:) | Aggregate Method (aggregate:) |
| --- | --- |
| 1. Connect via SSH or eAPI 2. Execute eos\_vlan module for VLAN1 3. Execute eos\_vlan module for VLAN2 4. Execute eos\_vlan module for VLAN3 5. Execute eos\_vlan module for VLAN4 . . . 6. Execute eos\_vlan module for VLAN500 7. Disconnect SSH 8. Display Playbook Recap | 1. Connect via SSH or eAPI 2. Execute eos\_vlan module  - Generate VLAN commands for entire set - Execute in one task  3. Disconnect SSH 4. Display Playbook Recap |
| **503 steps** | **4 steps** |

> [!callout type=tmm label="TMM resource" title="Ansible Product Demos" url="https://ansible.github.io/product-demos/" cta="Browse demos"]
> Reusable demos that showcase Ansible Automation Platform capabilities.

Based on feedback from customers, partners and community members, this post provides more examples and more detail of this important new feature. The simplest way to showcase this is to compare the old way and the new way, and highlight the differences between each.

For this scenario we assume a network operator wants to configure 500 VLANs on a Arista EOS device. We can use the [eos\_vlan](https://docs.ansible.com/ansible/2.4/net_vlan_module.html) Ansible module to easily accomplish this. Refer to the following Ansible Playbook snippet.

### Ansible 2.3 and older

The **vlan\_id** parameter is where the actual 802.1q VLAN number is specified. The **name** parameter is a description that helps identify what this VLAN is for (i.e. printers, laptops, etc). Finally, the **state** parameter describes what the intended or expected state should be, which can be present, absent, active or suspend.

```
    - eos_vlan:
        vlan_id: "{{ item.vlan_id }}"
        name: "{{ item.name | default('VLAN' + item.vlan_id|string) }}"
        state: "{{ item.state | default('active') }}"
      with_items:
        - { vlan_id: 1, name: default }
        - { vlan_id: 2, name: Vl2 }
        - { vlan_id: 3, state: suspend }
```

[View the full playbook: oldway.yml](https://github.com/network-automation/aggregate_resources/blob/master/oldway.yml)

Prior to integrating the aggregate resources feature, **with\_items** was used [as a loop](http://docs.ansible.com/ansible/latest/playbooks_loops.html) and passed this criteria for multiple VLANs. Loops are very useful within Ansible, however in this particular example loops can have serious performance impacts. To highlight the execution time differences, we can use the Linux **time** command.

```
sean@rhel7 ~]$ time ansible-playbook oldway.yml
```

This particular playbook with just the one task took 18 minutes and 52 seconds to run over 500 VLANs. Ansible still provides parallelism across many different network switches, but this is far too slow for many large scale production environments!

### Red Hat Ansible Engine 2.4 and newer

The new aggregate method allows us to pass the entire list of VLAN information without looping. The exact same list of VLANs shown in oldway.yml can be reused easily. Simply moving every line of the VLAN data from the task level to the module level (two spaces in) under the **aggregate** section (replacing **with\_items** previously). Instead of looping each VLAN one at a time, we can send all the information at once. Keep in mind this example is only showing the first three VLANs, the full example contains 500 VLANs. This is what the updated task in the playbook looks like:

```
   - eos_vlan:
        state: active
        aggregate:
          - { vlan_id: 1, name: default }
          - { vlan_id: 2, name: Vl2 }
          - { vlan_id: 3, state: suspend }
```

The modified task with aggregate resources is also timed to compare:

```
sean@rhel7 ~]$ time ansible-playbook newway.yml
```

[View the full playbook: newway.yml](https://github.com/network-automation/aggregate_resources/blob/master/newway.yml)

This took 10 seconds to complete, which is significantly faster than the previous ~19 minute method. Another advantage is that you will also see all VLANs as either changed or OK at the task level (referring to Ansible’s ability to keep track of state) rather than VLAN by VLAN as with the loop method.

### The Purge Ability

In conjunction with the aggregate feature, there is a purge parameter. The purge knob is defined as “Purge VLANs not defined in the aggregate parameter.” This means that VLANs not defined in the aggregate will be removed from the switch. So when the aggregate in this example is used all other VLANs will be deleted.

```
 - eos_vlan:
        state: active
        purge: yes
        aggregate:
          - { vlan_id: 1, name: default }
          - { vlan_id: 2, name: Vl2 }
          - { vlan_id: 3, state: suspend }
```

[View the full playbook: purge.yml](https://github.com/network-automation/aggregate_resources/blob/master/purge.yml)

When it is not used, it only enforced that the VLANs exist in the state the aggregate sends them. What are potential use-cases for each?

| purge: yes | In this particular eos\_vlan example turning the purge ability on allows us to **enforce configuration policy**.  What that means is if another user or process adds a VLAN, we will revert the configuration to only contain the VLANs we provide in the aggregate parameter. |
| --- | --- |
| **purge: no** | If the user running the playbook doesn’t care about the state of any VLANs not provided (i.e. he is working on VLAN10-50 and doesn’t care about VLAN200 which also happens to be configured).  This allows playbooks to be written in a way where a temporary configuration could be supplied without affecting ongoing configuration. |

### Going Further

Where else can I use **aggregate**? Other Arista examples include those such as the [eos\_user](http://docs.ansible.com/ansible/latest/eos_user_module.html) module and the [eos\_vrf](http://docs.ansible.com/ansible/latest/eos_vrf_module.html) module. Users and VRFs can be handled in a single aggregate rather than a collection of looped tasks. Instead of sending configuration user by user, or VRF by VRF with a loop it is now possible to use the aggregate. This will speed up configurations and give an alternative to using os\_config modules with Jinja templating.

> [!callout type=tmm label="Team resource" title="Network automation on the TMM blog" url="/blog/?author=sean-cavanaugh" cta="Browse posts"]
> More posts on network automation from the Ansible Technical Marketing team.

|  |
| --- |
| The aggregate feature is not limited to just the Arista EOS platform. Other networking platforms such as Cisco IOS, Cisco NX-OS and Juniper JunOS also have aggregate enabled in those respective modules. The Red Hat Ansible Engine Networking Add-on includes full support for use of aggregate in the [supported platform modules](http://docs.ansible.com/ansible/latest/modules_support.html). |

Ansible network modules that are capable of the aggregate feature are listed on their respective module documentation page. The aggregate keyword will appear under the parameter heading in the Options table. Click here for a [complete list of modules.](http://docs.ansible.com/ansible/latest/list_of_network_modules.html)

All scenarios in this blog post are stored in a GitHub repo in our [network automation community.](https://github.com/network-automation)

Follow the aggregate resources repository [here](https://github.com/network-automation/aggregate_resources).

To become a member of the growing community [email us](mailto:ansible-network@redhat.com) with your GitHub ID.

Have more questions? Join our next regularly scheduled Ask an Expert: [Networking Webinar.](https://www.ansible.com/resources/webinars-training/ask-an-expert-ansible-networks)

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Join Red Hat Ansible Automation Platform at AutoCon 2](/blog/red-hat-ansible-will-be-autocon2/)
> - [Ansible Network Resource Modules: Deep Dive on Return Values](/blog/ansible-network-resource-modules-deep-dive-on-return-values/)
> - [Red Hat Ansible Network Automation Updates](/blog/red-hat-ansible-network-automation-updates/)

<!-- blog-enrichment:related-end -->
