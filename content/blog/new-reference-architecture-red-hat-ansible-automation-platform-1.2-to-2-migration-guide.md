---
title: 'New reference architecture: Red Hat Ansible Automation Platform 1.2 to 2 Migration
  Guide'
slug: new-reference-architecture-red-hat-ansible-automation-platform-1.2-to-2-migration-guide
authors:
- slug: anshul-behl
  name: Anshul Behl
published: '2022-04-20'
updated: '2026-04-23'
source: redhat
source_url: https://www.redhat.com/en/blog/new-reference-architecture-red-hat-ansible-automation-platform-1.2-to-2-migration-guide
description: we created a simple reference architecture to help guide you migrate
  from Ansible Automation Platform 1.2 to Ansible Automation Platform 2.
topics:
- Automation and management
read_time_minutes: 3
synced_at: '2026-09-03T19:20:39Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** we created a simple reference architecture to help guide you migrate from Ansible Automation Platform 1.2 to Ansible Automation Platform 2.

<!-- blog-enrichment:end -->

[![](https://www.redhat.com/rhdc/managed-files/ansible/svFddIqV7xPFilaUztr4wit2zyRiToanGQacqtyBYkprP1SUAoApyoV89LI0mwv-FK4ijQeT3MARtXYO8Wl0oBCKHY44bdd09eo9XuBIEFBgLBbpzT9WHEqmJqfc-UTKGisvDeur.png)](https://www.redhat.com/rhdc/managed-files/ansible/svFddIqV7xPFilaUztr4wit2zyRiToanGQacqtyBYkprP1SUAoApyoV89LI0mwv-FK4ijQeT3MARtXYO8Wl0oBCKHY44bdd09eo9XuBIEFBgLBbpzT9WHEqmJqfc-UTKGisvDeur.png)

Side-by-Side migration to Ansible Automation Platform 2

The release of [Red Hat Ansible Automation Platform 2.1](https://www.ansible.com/blog/introducing-red-hat-ansible-automation-platform-2.1) comes with a re-imagined architecture that delivers exciting features such as [automation mesh](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/red_hat_ansible_automation_platform_automation_mesh_guide/index) and [automation execution environments](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2-automation-execution-environments) among an entire suite of tools and components that enable enterprises to scale automation across their organizations.

With the importance of enterprise automation and taking advantage of the latest Ansible Automation Platform, we created a simple [reference architecture to help guide you migrate from Ansible Automation Platform 1.2 to Ansible Automation Platform 2](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.4/html-single/ansible_automation_platform_1.2_to_2_migration_guide/index).

It consists of using a side-by-side methodology for the migration process via using the Ansible Automation Platform installer to do the migration and restoring a Database backup from a Ansible Automation Platform 1.2 cluster.

> [!callout type=tmm label="TMM resource" title="Solution Guides" url="https://ansible-tmm.github.io/solution-guides/" cta="Browse guides"]
> Outcome-focused guides for infrastructure and IT automation challenges.

## **Why are you going to love it?**

Say goodbye to the guessing game of how you’ll migrate to the latest and greatest. Our goal is to simplify the migration planning, considerations and, most importantly, the step-by-step on how to do it.

## **What will I find inside this reference architecture?**

Inside [this reference architecture](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.4/html-single/ansible_automation_platform_1.2_to_2_migration_guide/index) you’ll find:

- Migration considerations
- Prerequisites
- Infrastructure migration
- Migrating virtual environments to automation execution environments

The migration considerations focus on technical considerations, your Ansible content migration, and operating model considerations. We want to make sure that before you jump into the existing world that is Ansible Automation Platform 2, you have the tools to make it a successful one.

Moving from considerations, we shift to technical prerequisites, followed by the step-by-step infrastructure migration from Ansible Automation Platform 1.2 to Ansible Automation Platform 2.

This section breaks down every step you’ll need to complete a successful migration, including how to create a new inventory file from an existing Ansible Automation Platform 1.2 inventory. The installer inventory creation highlights the features of automation mesh and shows how to setup automation mesh for your upgraded Ansible Automation Platform.

Lastly, once the infrastructure migration is complete, the focus shifts on making sure your virtual environments from Ansible Automation Platform 1.2 are successfully transformed into automation execution environments for use within Ansible Automation Platform 2.

This one-time effort opens the door to take advantage of the latest Ansible Automation Platform 2 capabilities and the ability to execute consistent automation across multiple platforms with lower long-term maintenance.

To make this process easy, this reference architecture will walk you through an actual migration we did from Ansible Automation Platform 1.2 to Ansible Automation Platform 2.

> [!callout type=tmm label="TMM resource" title="Workshops and Labs" url="https://labs.demoredhat.com/" cta="Launch a lab"]
> Launch guided lab environments for Ansible and Red Hat technologies.

## **What can I do next?**

Whether you are beginning your automation journey or are a seasoned veteran, you can reach out with questions and feedback regarding the migration process at [ansible-feedback@redhat.com](mailto:ansible-feedback@redhat.com). In addition, you can reference a variety of resources to enhance your automation knowledge:

- [Latest migration reference architecture](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.4/html-single/ansible_automation_platform_1.2_to_2_migration_guide/index) - Download the latest migration reference architecture for an in-depth step-by-step how to guide on migrating to Ansible Automation Platform 2.
- [Self-paced exercises](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) - Check out the interactive in-browser exercises to learn and dive into Ansible Automation Platform.
- [Trial subscription](http://red.ht/try_ansible) - Are you ready to go? Get your own trial subscription for unlimited access to all the components of Ansible Automation Platform.
- [Developer license](https://developers.redhat.com/about) - Did you know that you can get a free developer license to learn in your home lab? Register and get access to all the latest tools, technologies and community that Red Hat has to offer.
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel.](https://www.youtube.com/ansibleautomation) Be sure to check out our new web series, [Automated Live hosted by Colin McNaughton.](https://www.redhat.com/en/technologies/management/ansible/automated-live-videos)
- [Follow Red Hat Ansible Automation Platform on Twitter](https://twitter.com/ansible) - Do you have questions or an automation project you want to show off? Tweet at us!

Also, if you’re interested in some hands-on assistance with your migration or want help building a strategy for onboarding Ansible Automation Platform 2, please reach out to your Account Executive for more information about Red Hat Consulting.

A special thanks to Roger Lopez for his contributions to this blog and the migration reference architecture.

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Introducing Ansible plug-ins for Red Hat Developer Hub](/blog/introducing-ansible-plug-ins-red-hat-developer-hub/)
> - [Getting started with Red Hat Ansible Lightspeed with IBM watsonx Code Assistant](/blog/getting-started-red-hat-ansible-lightspeed-ibm-watsonx-code-assistant/)
> - [AI threats move fast. Your defenses should too.](/blog/ai-threats-move-fast-your-defenses-should-too/)

<!-- blog-enrichment:related-end -->
