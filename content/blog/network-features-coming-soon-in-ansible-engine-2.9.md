---
title: Network Features Coming Soon in Ansible Engine 2.9
slug: network-features-coming-soon-in-ansible-engine-2.9
authors:
- slug: andrius-benokraitis
  name: Andrius Benokraitis
published: '2019-10-14'
updated: '2025-11-19'
source: redhat
source_url: https://www.redhat.com/en/blog/network-features-coming-soon-in-ansible-engine-2.9
description: In this blog post, we discuss the network features coming soon in Ansible
  Engine 2.9.
topics:
- Network automation
read_time_minutes: 9
synced_at: '2026-09-03T19:20:31Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** In this blog post, we discuss the network features coming soon in Ansible Engine 2.9.

> [!toc]
> **On this page**
>
> - [What we’ve learned](#what-weve-learned)
> - [Facts enhancements](#facts-enhancements)
> - [Introducing resource modules](#introducing-resource-modules)
> - [How do the new resource modules differ from previous modules?](#how-do-the-new-resource-modules-differ-from-previous-modules)
> - [So what does this all mean? Why does this matter?](#so-what-does-this-all-mean-why-does-this-matter)
> - [Which resource modules were introduced in Ansible Engine 2.9?](#which-resource-modules-were-introduced-in-ansible-engine-29)
> - [What’s planned for Ansible 2.10 and beyond](#whats-planned-for-ansible-210-and-beyond)
> - [Resources and getting started](#resources-and-getting-started)

<!-- blog-enrichment:end -->

[![slack-imgs.com-2](https://www.redhat.com/rhdc/managed-files/ansible/slack-imgs.com-2.png)](https://www.redhat.com/rhdc/managed-files/ansible/slack-imgs.com-2.png)

The upcoming Red Hat Ansible Engine 2.9 release has some really exciting improvements, and the following blog highlights just a few of the notable additions. In typical Ansible fashion, development of Ansible Network enhancements are done in the open with the help of the community. You can follow along by watching the [GitHub project board](https://github.com/ansible/ansible/projects/10), as well as the roadmap for the [Red Hat Ansible Engine 2.9 release](https://github.com/ansible/community/wiki/Network%3A-2.9-Roadmap) via the [Ansible Network](https://github.com/ansible/community/wiki/Network%3A-2.9-Roadmap) wiki page.

As was recently announced, [Red Hat Ansible Automation](https://www.redhat.com/en/about/press-releases/red-hat-elevates-enterprise-automation-new-red-hat-ansible-automation-platform?sc_cid=701f2000000u72fAAA) [Platform](https://www.redhat.com/en/about/press-releases/red-hat-elevates-enterprise-automation-new-red-hat-ansible-automation-platform?sc_cid=701f2000000u72fAAA) now includes Ansible Tower, Ansible Engine, and all Ansible Network content. To date, many of the most popular network platforms are enabled via Ansible Modules. Here are just a few:

- Arista EOS
- Cisco IOS
- Cisco IOS XR
- Cisco NX-OS
- Juniper Junos
- VyOS

A full list of the platforms that are fully supported by Red Hat via an Ansible Automation subscription can be found at the following location: <https://docs.ansible.com/ansible/2.9/modules/network_maintained.html#network-supported>

> [!callout type=tmm label="TMM resource" title="Event-Driven Ansible ChatOps" url="/blog/event-driven-ansible-chatops-from-chat-to-action/" cta="Read the guide"]
> From chat message to automated action with the TMM team walkthrough.

## What we’ve learned

In the last four years we’ve learned a lot about developing a platform for network automation. We’ve also learned a lot about how users apply these platform artifacts as consumed in end-user Ansible Playbooks and Roles. In the end, here are a few of the top lessons learned:

- Enterprises aren’t automating devices from a single vendor, but from many.
- Automation isn’t just a technical challenge, but also a cultural challenge.
- Network automation at scale is harder than people think because of fundamental architectural automation design principles.

When the long-term roadmap was being discussed over a year ago, our enterprise customers had the following requests:

- Make fact gathering more standardized and part of a more seamless experience to the automation workflow, no matter the device.
- Make updating of configurations back to the device a more standardized and seamless experience as well, allowing for Ansible Modules to take care of the latter half of the “round trip” after fact gathering.
- Provide an opinionated and supported means of converting the network device configuration into structured data. This provides the foundational pieces in moving the “source of truth” off the network device.

> [!callout type=tmm label="TMM resource" title="Solution Guides" url="https://ansible-tmm.github.io/solution-guides/" cta="Browse guides"]
> Outcome-focused guides for infrastructure and IT automation challenges.

## Facts enhancements

Pulling facts from network devices can be a very hit or miss activity with Ansible. Network platforms have various degrees of abilities when it comes to fact gathering, with little to no ability to parse and standardize the look and feel of the data into key/value pairs. Refer to Ken Celenza’s [blog post](https://www.networktocode.com/blog/post/Updating_Structured_Data_in_Ansible_Jinja/) on the tedious and laborious means to parsing and standardizing fact data.

You may have noticed the development effort around the [Ansible Network Engine Ansible Role](https://galaxy.ansible.com/ansible-network/network-engine). Needless to say, 24,000+ downloads later, the Network Engine Role quickly became one of the most popular Ansible Roles on Ansible Galaxy for network automation use cases. Prior to much of this being moved into Ansible 2.8 to prepare for what was needed next in Ansible 2.9, this Ansible Role provided the first set of tools to assist in command parsing, command manipulation, and data gathering for network devices.

If you are knowledgeable in using Network Engine, this is a very powerful means of pulling, parsing and standardizing fact data for use in Ansible. The one challenge with this role was the need to build loads and loads of parsers for each platform across all network activities. To know how big a job building, delivering, and maintaining parsers are, go check out the [1200+ parsers](https://developer.cisco.com/docs/genie-docs/) from the fine folks at Cisco.

In a nutshell, pulling facts from devices and normalizing them into key/value pairs is extremely important for automating at scale but difficult to accomplish across multiple vendors and network platforms.

Without the use of additional libraries, Ansible Roles, or custom parsers, each of the network facts modules in Ansible 2.9 can now parse network device configuration and return structured data.

Starting with Ansible 2.9 and continuing with future releases, every time an updated network module is released, the facts module is enhanced to expose that section of configuration. In short, facts and module development are now happening as the same pace and will always share a common data structure.

The configuration of resources on a network device can be retrieved and converted to structured data in two different ways. Both allow for a specific list of resources to collect and convert using the new gather\_network\_resources keyword. The resource names conveniently map to their corresponding resource module name.

**During fact gathering:**

Using gather\_facts is a convenient way to retrieve the current device configuration at the beginning of a playbook for use throughout the playbook. Specify the individual resources that should be retrieved from the device.

```
- hosts: arista  
  module_defaults:  
    eos_facts:  
      gather_subset: min  
      gather_network_resources:  
      - interfaces  
  gather_facts: True
```

You might have noticed something a bit different in the above examples, namely that gather\_facts: True is now available for native fact gathering for network devices.

**Using the network facts module directly:**

```
- name: collect interface configuration facts  
  eos_facts:  
    gather_subset: min  
    gather_network_resources:  
    - interfaces
```

**The playbook returns the following interface facts:**

```
ansible_facts:  
   ansible_network_resources:  
      interfaces:  
      - enabled: true  
        name: Ethernet1  
        mtu: '1476'  
      - enabled: true  
        name: Loopback0  
      - enabled: true  
        name: Loopback1  
      - enabled: true  
        mtu: '1476'  
        name: Tunnel0  
      - enabled: true  
        name: Ethernet1  
      - enabled: true  
        name: Tunnel1  
      - enabled: true  
        name: Ethernet1
```

Notice how Ansible pulled the native configuration from the Arista device and converted it into structured data for use as standard key/value pairs for additional follow-on tasks and activities.

The interface facts can be added to your stored Ansible variables and immediately or used later as the input for the eos\_interfaces resource module without being manipulated or transformed.

## Introducing resource modules

Now that we’ve pulled facts, normalized the data, and put them into a standardized internal data structure schema, we now have an “off box” source of truth. Hooray! This is indeed great, but the problem now is that you still need a method to take key/value pairs as source and convert them back into the specific configuration that the specific device platform is expecting. Platform-specific modules now need to be developed to satisfy these new requirements of the fact gathering and normalizing activities.

So what exactly is a “resource module?” Sections of a device’s configuration can be thought of as a resources provided by that device. Network resource modules are intentionally scoped to configure a single resource and can be combined as building blocks to configure complex network services. As a result, there is an inherent simplicity in the requirements and specification for a resource module, since a resource module can read and configure a specific network service on a network device.

To better explain what a resource module can do, let’s take a look at the following example playbook that demonstrates an idempotent operation using the new network resource facts and eos\_l3\_interface module.

```
- name: example of facts being pushed right back to device.  
  hosts: arista  
  gather_facts: false  
  tasks:  
  - name: grab arista eos facts  
    eos_facts:  
      gather_subset: min  
      gather_network_resources: l3_interfaces  
  
  - name: ensure that the IP address information is accurate  
    eos_l3_interfaces:  
      config: "{{ ansible_network_resources['l3_interfaces'] }}"  
      register: result  
  
  - name: ensure config did not change  
    assert:  
      that: not result.changed
```

As you can see, the facts gathered from the device were passed directly to the corresponding resource module without transformation. Running this playbook pulls the values from the device and compares them to what’s expected. In this example the value fetched matches what is expected (that is, checking for configuration drift), and reports back if the configuration has changed or not.

Saving the facts to stored Ansible Variables and using them in conjunction with resource module in check mode periodically is an ideal way to detect configuration drift. This approach provides a simple way to see if anyone has manually changed specific values. In most cases enterprises are still allowing for manual updates and configuration even though many of the operations are done via Ansible Automation.

## How do the new resource modules differ from previous modules?

For the network automation engineer there are three major differences between the new network resource modules released with Ansible 2.9 and previous modules.

1. For a given network “resource” (a “resource” can also be thought of a “section” of configuration) modules and facts integration will be developed across all our supported network operating systems at the same time. We believe that if Ansible supports the configuration of a resource on one network platform we should support it across the board. This increases the ease of use for resource modules because a network automation engineer will be able to now configure a resource (e.g.LLDP) on all the network operating systems they use with native and supported modules.
2. Resource modules now include state values.

   1. merged: configuration merged with the provided configuration (default)
   2. replaced: configuration of provided resources will be replaced with the provided configuration
   3. overridden: The configuration of the provided resources will be replaced with the provided configuration, extraneous resource instances will be removed
   4. deleted: The configuration of the provided resources will be deleted/defaulted  
      [![](https://www.redhat.com/rhdc/managed-files/ansible/Coming%20Soon%20Network%20features%20coming%20soon%20in%20Ansible%20Engine%202-2.9.png)](https://www.redhat.com/rhdc/managed-files/ansible/Coming%20Soon%20Network%20features%20coming%20soon%20in%20Ansible%20Engine%202-2.9.png)

3. Resource modules now include consistent return values. After a network resource module has made (or suggested) the necessary changes on a network device it will return the same key/value pairs to the playbook.

   1. before: The configuration on the device, as structured data, prior to the task
   2. after: If the device has changed, (or would have when using check-mode) The resulting configuration will be return as structured data
   3. commands: Any configuration commands that were issued on the device to bring it to the desired end-state.

[![](https://www.redhat.com/rhdc/managed-files/ansible/Coming%20Soon%20Network%20features%20coming%20soon%20in%20Ansible%20Engine%202.9.png)](https://www.redhat.com/rhdc/managed-files/ansible/Coming%20Soon%20Network%20features%20coming%20soon%20in%20Ansible%20Engine%202.9.png)

[![](https://www.redhat.com/rhdc/managed-files/ansible/Coming%20Soon%20Network%20features%20coming%20soon%20in%20Ansible%20Engine%202-1.9.png)](https://www.redhat.com/rhdc/managed-files/ansible/Coming%20Soon%20Network%20features%20coming%20soon%20in%20Ansible%20Engine%202-1.9.png)

## So what does this all mean? Why does this matter?

There is a lot going on in this blog with a lot of advanced concepts, but in the end we hope you have a better understanding about how fact collection, data normalization, and roundtrip configuration are all things enterprise customers request as part of an automation platform. The real question is why are these types of enhancements even being requested? Currently, many enterprises are going through digital transformation in order to be more agile, competitive, and flexible in their IT environments. Whether people like it or not, many network engineers are becoming network developers via bottom-up organic job interest or via top-down business requirements from IT managers.

Enterprises are realizing that automating network templates in silos is still siloed engineering, and this only takes the enterprise so far. The Red Hat Ansible Automation Platform provides proscriptive and opinionated resource data models to programmatically manage the underlying data contained within the network device. That is, users are increasingly moving away from bespoke methods of configuration to more modern methods that focuses on the technology (e.g. IP addresses, VLANs, LLDP, etc) rather than the specific vendor implementation.

So given this, are the days of the tried and true command and config modules numbered? In the short-term, no way. The forthcoming network resource modules won’t cover 100% of use cases for every vendor network platform, so network engineers will still need the command config modules for specific implementations. The goal of resource modules is to reduce the complexity of large Jinja templates and more easily normalize unstructured device configuration into structured JSON. Resource modules allow existing networks to more easily convert their running configuration into structure key/value pairs, creating an easy human-readable source of truth. By focusing on the structured key/value pairs the focus can be shifted from running configurations on each device to instead working on agnostic structured data, bringing networks into the forefront of infrastructure as code.

## Which resource modules were introduced in Ansible Engine 2.9?

Before we detail what was completed in Ansible 2.9, let’s take a quick look at how we broke down the full scope of work that would have to be accomplished.

Seven categories were identified, and then specific network resources aligned for each category:

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
| Policy acls acl\_interfaces prefix\_lists qos qos\_interfaces route\_maps  Operation file ping traceroute reboot local\_ping wait\_for\_connection | Services bfd dhcp glbp glbp\_interfaces hsrp hsrp\_interfaces ldp **lldp** **lldp\_interfaces** mlag udld udld\_interfaces vpc vpc\_interfaces vrrp vrrp\_interfaces vtp | Foundation aaa api banners dns ipv4 ipv6 local\_users logging mgmt ntp roles sflow snmp system vty | Topology - Protocols bgp igmp igmp\_interfaces isis ldp ospf ospf\_interfaces pim pim\_interfaces rip static\_routes stp stp\_interfaces **lacp** **lacp\_interfaces** | Topology - Virtualization **vlans** vrfs vrf\_interfaces  Topology - Interfaces **interfaces** **l2\_interfaces** **l3\_interfaces** **lag\_interfaces** |

NOTE: the resources above in **bold** were planned and delivered in Ansible 2.9.

Based on feedback from enterprise customers and the community, the logical first set of modules to focus on were ones that related to network topology protocols, virtualization, and interfaces.

The following resource modules have been developed and included by the Ansible Network team, and align with the platforms supported by Red Hat:

|  |  |  |
| --- | --- | --- |
| eos\_interfaces eos\_l2\_interfaces eos\_l3\_interfaces eos\_lacp eos\_lacp\_interfaces eos\_lag\_interfaces eos\_lldp\_global eos\_lldp\_interfaces eos\_vlans | ios\_interfaces ios\_l2\_interfaces ios\_l3\_interfaces ios\_lacp ios\_lacp\_interfaces ios\_lag\_interfaces ios\_lldp\_global ios\_lldp\_interfaces ios\_vlans | iosxr\_interfaces iosxr\_l2\_interfaces iosxr\_l3\_interfaces iosxr\_lacp iosxr\_lacp\_interfaces iosxr\_lag\_interfaces iosxr\_lldp\_global iosxr\_lldp\_interfaces |
| junos\_interfaces junos\_l2\_interfaces junos\_l3\_interfaces junos\_lacp junos\_lacp\_interfaces junos\_lag\_interfaces junos\_lldp\_global junos\_lldp\_interfaces junos\_vlans | nxos\_bfd\_interfaces nxos\_interfaces nxos\_l2\_interfaces nxos\_l3\_interfaces nxos\_lacp nxos\_lacp\_interfaces nxos\_lag\_interfaces nxos\_lldp\_global nxos\_telemetry nxos\_vlans | vyos\_interfaces vyos\_l3\_interfaces vyos\_lag\_interfaces vyos\_lldp\_global vyos\_lldp\_interfaces |

The following have been developed and included by the Ansible community:

exos\_lldp\_global - developed by Extreme Networks

nxos\_bfd\_interfaces - developed by Cisco

nxos\_telemetry - developed by Cisco

As you can see the concept of resource modules is to further the strategy of making Ansible more platform-focused. That is, including the needed features and functions in Ansible itself to promote standardization in developing network-related modules, as well as creating a more seamless user experience from the Ansible Role and Playbook level. In order to scale out development of resource modules, the Ansible team has released a tool called Module Builder.

## What’s planned for Ansible 2.10 and beyond

Once Ansible 2.9 is released the next set of resource modules for Ansible 2.10 will be focused on further configuring network topology and policy, such as [ACLs, OSPF and BGP](https://github.com/ansible/community/wiki/Network:-2.10-Roadmap). The roadmap is still being solidified, so if you have any comments please feel free to join us in the [Ansible Network](https://www.ansible.com/community) [Community](https://www.ansible.com/community).

## Resources and getting started

[Ansible Automation Platform Press Release](https://www.redhat.com/en/about/press-releases/red-hat-elevates-enterprise-automation-new-red-hat-ansible-automation-platform?sc_cid=701f2000000u72fAAA)

[Ansible Automation Platform Blog](https://www.ansible.com/blog/introducing-red-hat-ansible-automation-platform)

[The Future of Ansible Content Delivery](https://www.ansible.com/blog/the-future-of-ansible-content-delivery)

[Thoughts on Restructuring the Ansible Project](https://www.ansible.com/blog/thoughts-on-restructuring-the-ansible-project)

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Join Red Hat Ansible Automation Platform at AutoCon 2](/blog/red-hat-ansible-will-be-autocon2/)
> - [Event-Driven Ansible - ChatOps - From Chat to Action](/blog/event-driven-ansible-chatops-from-chat-to-action/)
> - [Addressing NetOps issues with Event-Driven Ansible](/blog/addressing-netops-issues-with-event-driven-ansible/)

<!-- blog-enrichment:related-end -->
