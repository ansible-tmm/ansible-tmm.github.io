---
title: Control your content with private Automation Hub
slug: control-your-content-with-private-automation-hub
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2020-11-02'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/control-your-content-with-private-automation-hub
description: Private Automation Hub is an on-premises solution for managing Ansible
  content. This allows an organization to create, share, and curate content for automation
  consumers in their organization.
topics: []
read_time_minutes: 2
synced_at: '2026-09-03T19:21:06Z'
---

- [Back to all posts](/blog/)

---

Private Automation Hub will be included as part of [Red Hat Ansible Automation Platform](https://www.redhat.com/en/about/press-releases/red-hat-accelerates-hybrid-cloud-automation-catalog-ready-use-certified-and-supported-ansible-automation?source=pressreleaselisting&f%5B0%5D=taxonomy_region_tid%3A4521) release 1.2, providing an easier way for our customers to manage their Ansible content. Whether they produce private content, access trusted and supported content from Red Hat or obtain content from third party or other community sources, an internally controlled capability is essential to support the continued growth of automation. As automation becomes critical to managing IT activities, so too becomes the need to have a focal point where collaboration can be encouraged, content shared and trust reinforced.

Private Automation Hub is a self-hosted Ansible content management system. Organizations can host private hubs on their own infrastructure and manage it themselves. Similar to how Red Hat Satellite enables Red Hat Enterprise Linux customers to manage operating system content, private Automation Hub enables automation teams to manage Ansible automation content.  Private Automation Hub allows curation and distribution of Ansible content as close as possible to Ansible Automation Platform clusters. Private Automation Hub is included in the Red Hat Ansible Automation Platform subscription.

[![Hub blog 1](https://www.redhat.com/rhdc/managed-files/ansible/Hub%20blog%201.png)](https://www.redhat.com/rhdc/managed-files/ansible/Hub%20blog%201.png)

Ansible content can be broken up into three main categories:

1. Community content found in Ansible Galaxy
2. Red Hat certified and supported content found in Automation Hub (on cloud.redhat.com)
3. Private content created and curated by an organization and shared locally

Private Automation Hub allows management of all three types of content, choosing which Ansible Content Collections, and which versions, are made available to automation consumers.

All Ansible content is organized as Ansible Content Collections. [Ansible Content Collections are simply a standard directory structure of Ansible content](https://www.ansible.com/blog/getting-started-with-ansible-collections), including, roles, plugins and modules, stored in a tar.gz file. Private Automation Hub, just like hosted Automation Hub, which can be viewed on cloud.redhat.com, sorts collections into namespaces. So for an easy example, the ec2\_key module for Amazon Web Services is stored in the namespace [amazon](https://galaxy.ansible.com/amazon), in the collection aws. In order to use the ec2\_key module, the FQCN or fully qualified content name would be amazon.aws.ec2\_key.

Private Automation Hub allows administrators to build private namespaces and collections, and then allows Ansible Automation Platform clusters to authenticate and retrieve content from them on-demand. This content can also be ordered so that Ansible projects always choose content from Automation Hub before using unsupported content in Ansible Galaxy.

[![Hub blog 2](https://www.redhat.com/rhdc/managed-files/ansible/Hub%20blog%202.png)](https://www.redhat.com/rhdc/managed-files/ansible/Hub%20blog%202.png)

Content has a level of governance inside of private Automation Hub. Content is staged and can be certified or rejected by administrators. Ansible Automation Platform clusters sync to private Automation Hub using the credentials feature and a new Automation Hub credential type where the API token can be input.

[![hub blog 3](https://www.redhat.com/rhdc/managed-files/ansible/hub%20blog%203.png)](https://www.redhat.com/rhdc/managed-files/ansible/hub%20blog%203.png)

Finally, private Automation Hub can also sync existing content from both the community (Ansible Galaxy) and supported and certified content from Automation Hub on cloud.redhat.com. This content can be chosen on a per collection basis so that administrators can filter which collections are made available to their automation consumers.

[![hub blog 4](https://www.redhat.com/rhdc/managed-files/ansible/hub%20blog%204.png)](https://www.redhat.com/rhdc/managed-files/ansible/hub%20blog%204.png)

## 

## Where to go next?

I hope this blog helped outline private Automation Hub and where it fits into your automation infrastructure. We believe that private Automation Hub can help organizations manage, share and curate automation content. The hosted service offering Automation Hub is now extended into private networks with a self hosted option.

Private Automation Hub is part of the Red Hat Ansible Automation Platform 1.2 release and included in your download on red.ht/try\_ansible.

- [Check out our YouTube channel and learn more about Automation Hub and private Automation Hub](https://www.youtube.com/playlist?list=PLdu06OJoEf2aBf5nV5qQZmy2AH_Wif5vU)

- [How to use private Automation Hub with Red Hat Ansible Tower](https://youtu.be/YiwxPFcOWvE)

- [Check out our Ansible Automation Platform Documentation page](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/)
- [Get a trial of Red Hat Ansible Automation Platform](http://red.ht/try_ansible)

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

### [The last mile problem in agentic AI: Why tool calling reliability is harder than it looks](https://www.redhat.com/en/blog/last-mile-problem-agentic-ai-why-tool-calling-reliability-harder-it-looks)

Blog post

### [The architecture of autonomy: How ING built a future-proof tech strategy](https://www.redhat.com/en/blog/architecture-autonomy-how-ing-built-future-proof-tech-strategy)

Original podcast

### [How Red Hat cleared IT debt for scalable AI](https://www.redhat.com/en/technically-speaking/ai-ready-data-cleanup)

Original podcast

### [Virtualization Is (Still) King | Compiler](https://www.redhat.com/en/compiler-podcast/virtualization-ai)
