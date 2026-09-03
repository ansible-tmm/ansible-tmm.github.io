---
title: Introducing Ansible Automation Platform 2
slug: introducing-ansible-automation-platform-2
authors:
- slug: andrius-benokraitis
  name: Andrius Benokraitis
published: '2021-09-29'
updated: '2026-03-05'
source: redhat
source_url: https://www.redhat.com/en/blog/introducing-ansible-automation-platform-2
description: Introducing Red Hat Ansible Automation Platform 2 and changes to how
  automation is developed, managed, and operated in large, complex environments.
topics:
- Events
read_time_minutes: 4
synced_at: '2026-09-03T19:20:31Z'
---

- [Back to all posts](/blog/)

---

[![aap 2-1](https://www.redhat.com/rhdc/managed-files/ansible/aap%202-1.png)](https://www.redhat.com/rhdc/managed-files/ansible/aap%202-1.png)

For the last two years, the Red Hat Ansible Automation Platform product team has been hard at work developing the next major release. We are incredibly excited to introduce Red Hat Ansible Automation Platform 2, which was [just announced](https://www.redhat.com/en/about/press-releases/red-hat-ansible-automation-platform-2-drives-cloud-native-automation-and-helps-developers-become-automators) at [AnsibleFest 2021](http://ansiblefest.com).

**What’s new in Ansible Automation Platform 2?**

The main focus was to enhance the foundational pieces of the Ansible Automation Platform and to enable automators to automate at enterprise scale more easily and flexibly. This means everything you know and love about writing Ansible Playbooks is largely unchanged, but what is evolving is the underlying implementation of how automation is developed, managed, and operated in large complex environments. In the end, enterprise automation platforms must be designed, packaged, and supported with container native and hybrid cloud environments in mind.

So how did we get here? It’s been years in the making, which included the following changes:

*1.* [*Ansible content was separated from the Ansible executable*](https://www.ansible.com/blog/the-future-of-ansible-content-delivery) *in the Ansible Project, creating a new construct called an* [*Ansible Content Collection*](https://www.ansible.com/blog/getting-started-with-ansible-collections)*s to house Ansible modules, plugins, roles and more in a discrete and atomic form.*

The vast majority of time recently has been spent relocating the majority of Ansible content (modules, plugins) into standalone Ansible Collections developed and maintained separately from the [Ansible open source project](https://github.com/ansible/ansible/). The main benefit is that the updating of Ansible content is no longer dependent on updating the Ansible project itself, allowing for continuous and asynchronous releases of content while maintaining stable releases of the Ansible executable.

*2. The control plane was separated from the execution plane in Ansible Tower, and renamed these components to automation controller and automation execution environments.*

Ansible Tower was split into two components: automation controller (control plane) and automation execution environments (execution plane) in order to better scale and provide more predictable automation for enterprises. By splitting Tower into two components, you can now have execution running outside of the control node and is more conducive to running your automation in hybrid cloud and container native environments such as Red Hat OpenShift. You’ll also see additional features in the upcoming 2.1 release with a new component called automation mesh (think: a service mesh for Ansible), which replaces isolated nodes in Ansible Tower. This becomes more interesting by enabling new use cases such as automating at or to the edge as well as cloud automation.  
  
*3. New tools were created to better enable enterprise automation developers.*  
  
Developing Ansible content has largely been up to the individual for building and curating content. New tools such as automation content navigator (ansible-navigator) and execution environment builder (ansible-builder) allow for a more consistent experience for content developed on a workstation that’s destined for an enterprise automation controller instance. This is made possible with  automation execution environments, which are now much more predictable, portable, and scalable compared to traditional Python virtual environments previously.

Ansible Automation Platform 2 introduces an improved architecture and a variety of new tools to scale your automation while still providing a familiar Ansible experience to your teams.  We want to provide you with all the information you need to get your automation teams up to speed on the new features and start developing your migration strategy (if applicable) to best prepare for the forthcoming 2.1 general availability anticipated for later this year. Over the next month, keep an eye on the [Knowledgebase on Red Hat Customer Portal](https://red.ht/AAP-20) for all the latest on documentation, installation, migration and component deep dives.

**Where do I go next?**

As automation becomes more strategic to your business, so will the changes you make in the way you can adopt, manage and operate automation. Ansible Automation Platform 2 introduces an improved architecture and flexibility with automation controller and automation execution environments, along with a variety of new tools to scale your automation while still providing a familiar experience to your teams.  We want to ensure you have all the information you need to get your automation teams up to speed on the new features and start developing your migration strategy.

There are a number of resources available as you begin to explore Ansible Automation Platform 2:

- To learn more about new features and components, check out the[updated product overview page on ansible.com](https://www.ansible.com/products/automation-platform). You can also consult our new interactive features guide.
- If you’re ready to get hands on, we have [self-paced interactive labs available](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) to explore right now.
- It's not too late to [register (for free!) for AnsibleFest 2021](http://ansiblefest.com); you can follow along live on September 29th and 30th, or explore session content on-demand following the event.
- We also encourage you to register for our free upcoming webinar “Red Hat Ansible Automation Platform brings you a new way to automate,” which will be live on November 2 and available afterwards on demand.

**How do I get more help?**

If you are interested in hearing more about Ansible Automation Platform 2, please reach out to your Red Hat sales representative. In the meantime, you can log into the [Red Hat Customer Portal](https://red.ht/AAP-20) for official resources around the launch, including migration considerations, getting started blogs, and official documentation which can be found at [the Early Access page](https://red.ht/AAP-20)*. (Note: a Red Hat subscription is required for access)*

Still need assistance? Can’t find your Red Hat Sales representative? Contact [Red Hat Technical support](https://access.redhat.com/support/contact/technicalSupport/) for additional information. Please refer to the [official resources](https://red.ht/AAP-20) that will help you on your automation journey.

---

### About the author

[![Andrius Benokraitis](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/Andrius-Benokraitis.jpg?itok=bGBYkaZb)](https://www.redhat.com/en/authors/andrius-benokraitis)

[### Andrius Benokraitis

Senior Manager, Technical Marketing for Ansible Automation Platform](https://www.redhat.com/en/authors/andrius-benokraitis)

Andrius is a Senior Manager, Technical Marketing for Ansible Automation Platform. He brings over 20 years in the computer software industry from companies such as IBM, Nortel, and Cumulus Networks. Andrius is skilled in Network Automation, Enterprise Linux, Business Analytics, Technical Writing, and Strategic Alliances.

[More from this author](https://www.redhat.com/en/authors/andrius-benokraitis)

Enter keywords here to search blogs

UI\_Icon-Red\_Hat-Close-A-Black-RGB

Search

## More like this

Blog post

### [The agentic paradox and the case for hybrid AI](https://www.redhat.com/en/blog/agentic-paradox-and-case-hybrid-ai)

Blog post

### [Save the date: Red Hat Summit 2027 is coming to Boston](https://www.redhat.com/en/blog/save-date-red-hat-summit-2027-coming-boston)
