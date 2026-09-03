---
title: Easy automation for Microsoft Windows Server and Azure with Ansible Automation
  Platform
slug: easy-automation-microsoft-windows-server-and-azure-ansible-automation-platform
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2025-03-20'
updated: '2026-07-29'
source: redhat
source_url: https://www.redhat.com/en/blog/easy-automation-microsoft-windows-server-and-azure-ansible-automation-platform
description: The latest update of Ansible Automation Platform has enhanced its capabilities,
  with support for OpenSSH to efficiently manage Windows servers as an alternative
  to using WinRM for connections.
topics:
- Cloud automation
read_time_minutes: 3
synced_at: '2026-09-03T19:21:35Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

The latest update of Ansible Automation Platform has enhanced its capabilities, with support for OpenSSH to efficiently manage Windows servers as an alternative to using WinRM for connections. Additionally, the new `Microsoft.iis` collection includes comprehensive support for configuring Internet Information Services (IIS), and the `ansible.windows` collection has been updated with additional modules to support Windows server management. Furthermore, Ansible Automation Platform extends its reach to cloud and hybrid environments with new support for managing Azure Arc resources, enabling consistent and unified management across on-premises, multi-cloud and edge environments.

## OpenSSH support

When automating Windows, you may have used WinRM in the past. However, OpenSSH has long been a request from customers, and at the end of 2024 [OpenSSH is supported in Windows Server 2022](https://docs.ansible.com/ansible/devel//os_guide/windows_ssh.html#)+ and Ansible core 2.18+.

## Why automate Windows with Ansible Automation Platform?

Traditional Windows management often requires GUI-based configurations, manual patching and repetitive administrative tasks. With Ansible Automation Platform, you can:

- **Save time and reduce costs:** Automate routine tasks like software deployment, user management, and patching
- **Improve consistency and security:** Enforce standard configurations across all Windows servers, reducing configuration drift and compliance risks
- **Enhance scalability:** Manage thousands of Windows systems with a single automation framework, enabling rapid deployment and updates
- **Integrate seamlessly:** Connect Ansible Automation Platform with existing IT ecosystems like Active Directory and Azure for a unified automation experience

## Expanding the ansible.windows collection

The certified [ansible.windows](https://catalog.redhat.com/software/collection/ansible/windows) collection has now been updated with additional modules. Our top 5 "honorable mention" modules:

1. **win\_firewall** – Essential for managing security policies and restricting access to services by configuring the Windows firewall with Ansible Automation Platform
2. **win\_hotfix** – Critical for checking and managing system updates and patches so you can have visibility into the patching status of your servers and know where action needs to be taken
3. **win\_initialize\_disk** – Important for provisioning new storage for your Windows servers by initializing and partitioning disks
4. **win\_certificate\_info** – Necessary for managing and verifying SSL/TLS certificates, crucial for securing web applications hosted on your Windows servers
5. **win\_acl\_inheritance** – Helps enforce permission policies, enabling security and compliance

These 5 modules greatly assist any administrator in the crucial task of securing and hardening of Windows servers. Those are our top 5 but, depending on your use case, you'll likely have some top picks of your own. It's by no means an exhaustive list. In our effort to expand support for Windows automation, a number of modules have been added to the collection. Read more about these additional modules in the [documentation](https://catalog.redhat.com/software/collection/ansible/windows?tab=documentation).

|  |  |  |  |
| --- | --- | --- | --- |
| win\_user\_profile | win\_timezone | win\_snmp | win\_route |
| win\_robocopy | win\_regmerge | win\_region | win\_product\_facts |
| win\_partition | win\_pagefile | win\_maped\_drive | win\_certificate\_info |
| win\_computer\_description | win\_credential | win\_dhcp\_lease | wins\_dns\_record |
| wins\_dns\_zone | win\_eventlog | win\_feature\_info | win\_file\_compression |
| win\_file\_compression\_rule | win\_firewall | win\_hosts | win\_hotfix |
| win\_http\_proxy | win\_iis\_webbinding | win\_initialize\_disk | win\_listen\_ports\_facts |
| win\_acl\_inheritance |  |  |  |

These modules provide Windows administrators and automation experts with a more comprehensive ability to automate Windows services, streamline common tasks, and fine-tune Windows systems and Active Directory installs.

### The microsoft.iis collection

In addition to the `ansible.windows` collection update, we've also created a new collection specifically for IIS management. It enables comprehensive automation for managing Microsoft Internet Information Services (IIS). This collection allows you to:

- **Streamline web server deployments:** Automate IIS role installations, site configurations, and SSL management
- **Ensure consistency across environments:** Use Ansible Playbooks to standardize web server configurations and prevent drift
- **Enhance security and compliance:** Automate security settings, certificate management and application pool configurations
- **Optimize performance:** Implement load balancing, logging and fine-tuned IIS settings for high availability

This certified [collection](https://catalog.redhat.com/software/collection/microsoft/iis) currently includes the following modules:

|  |  |
| --- | --- |
| virtual\_directory | virtual\_directory\_info |
| web\_app\_pool | web\_app\_pool\_info |
| web\_application | web\_application\_info |
| website | website\_info |

This collection focuses on management of IIS and allows you to create and manage virtual directories, web applications, web application pools and IIS websites. The collection also provides modules to gather information on each of these components.

## Azure additions

Azure Arc allows Azure to monitor infrastructure in or outside of the cloud, and Ansible Automation Platform can automate deployment and configuration of that infrastructure.  Azure Arc supports virtual machine (VM) management over SSH, and Ansible Automation Platform now enables connectivity and automation of connected VMs through Arc as if the nodes were directly routable. Read [this article](https://www.redhat.com/en/blog/migrate-to-azure-monitor-agent-on-azure-arc-using-red-hat-ansible-automation-platform) for information about deploying the Azure Arc monitoring agent using Ansible Automation Platform.

New additions to [azure.azcollection](https://catalog.redhat.com/software/collection/azure/azcollection) support using Arc through the Azure\_RM\_arcssh module, which allows you to configure an SSH proxy for Arc hosts to connect to Azure.

The recent updates to the Azure and Microsoft Windows and IIS Certified Collections for Ansible Automation Platform represent a significant step forward in enhancing automation capabilities for enterprises. These updates not only streamline the integration of Azure services with Ansible Automation Platform, but also ensure that organizations can leverage the latest features and connection types. By continuously evolving and expanding the certified collections, Red Hat and Microsoft are empowering IT teams to automate complex workflows with greater efficiency and confidence.

### Where to go next

- Attend Red Hat’s premier event [Red Hat Summit 2025](https://www.redhat.com/en/summit)
- Volvo Cars reveal how they use [Ansible Automation Platform on Microsoft Azure to accelerate time-to-automation](https://youtu.be/8KunwQQynV8?si=cuJBS_3gPcVjO1xj)
- Learn how to use [Windows and Event-Drive Ansible](https://youtu.be/0vQACe3shW0?si=DdzBwCrjfVYgPOGw) with AI ticket enrichment
- Watch a video on [Windows automation: Speed and scale](https://youtu.be/nmW49G-5-p0?si=NHkXu02oMCzP8W1C) to understand how you can scale your automation of Windows servers
- Want to learn Ansible? Check out our[getting started guide](https://developers.redhat.com/products/ansible/getting-started) on[developers.redhat.com](http://developers.redhat.com/)

---

### About the authors

[![Nuno Martins](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/Nuno%20Martins.webp?itok=-RZ_7BCo)](https://www.redhat.com/en/authors/nuno-martins)

[### Nuno Martins

Technical Marketing Manager, Red Hat Ansible Automation Platform](https://www.redhat.com/en/authors/nuno-martins)

Nuno is a Technical Marketing Manager for the Ansible Automation Platform. He is a Red Hat Certified Architect and a Certified Instructor with over 15 years of experience in multiple technologies. Currently based in South Africa, he has international experience with having worked all over Europe and Africa.

[More from this author](https://www.redhat.com/en/authors/nuno-martins)

[![Packer, Matthew-3 - Matthew Packer](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/Packer%2C%20Matthew-3%20-%20Matthew%20Packer.jpg?itok=r0gJyEam)](https://www.redhat.com/en/authors/matthew-packer)

[### Matthew Packer

Principal Product Marketing Manager](https://www.redhat.com/en/authors/matthew-packer)

Matthew Packer is a Principal Product Marketing Manager for Ansible Automation Platform and is responsible for cloud automation. Prior to joining Red Hat, he worked in product marketing specializing in retail payment technology at Vontier and product management at Cisco in cloud-based networking. Matthew also worked as a consultant at Honeywell in the manufacturing and utilities industries with a focus on the Internet of Things (IoT) and predictive analytics space.

[More from this author](https://www.redhat.com/en/authors/matthew-packer)

Enter keywords here to search blogs

UI\_Icon-Red\_Hat-Close-A-Black-RGB

Search

## More like this

Blog post

### [Stop searching, start operating: Scale hybrid clusters with Red Hat Advanced Cluster Management for Kubernetes 2.16](https://www.redhat.com/en/blog/stop-searching-start-operating-scale-hybrid-clusters-red-hat-advanced-cluster-management-kubernetes-216)

Blog post

### [Red Hat OpenShift 4.21: Smarter scaling, faster migration, and AI-powered efficiency](https://www.redhat.com/en/blog/red-hat-openshift-421-smarter-scaling-faster-migration-and-ai-powered-efficiency)

## Keep exploring

- [The automated enterpriseE-book](https://www.redhat.com/en/engage/automated-enterprise-ebook-20171107?intcmp=7013a000003Sq0iAAC "E-book: The automated enterprise")
- Try Red Hat Ansible Automation Platform with self-paced, hands-on labsInteractive lab
- [Red Hat Ansible Automation Platform: A beginner’s guide](https://www.redhat.com/en/engage/redhat-ansible-automation-20220412 "Red Hat Ansible Automation Platform: A beginner’s guide")[E-book](https://www.redhat.com/en/engage/ansible-automation-platform-beginners-guide-ebook "Red Hat Ansible Automation Platform: A beginner’s guide")
