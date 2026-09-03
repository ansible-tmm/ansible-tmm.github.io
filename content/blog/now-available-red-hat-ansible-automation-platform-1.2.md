---
title: 'Now Available: Red Hat Ansible Automation Platform 1.2'
slug: now-available-red-hat-ansible-automation-platform-1.2
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2020-11-19'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/now-available-red-hat-ansible-automation-platform-1.2
description: Red Hat Ansible Automation Platform 1.2 is now generally available with
  increased focus on improving efficiency, increasing productivity and controlling
  risk and expenses.
topics: []
read_time_minutes: 4
synced_at: '2026-09-03T19:21:04Z'
---

<!-- blog-enrichment:start -->

> [!toc]
> **On this page**
>
> - [An automation platform for mission critical workloads](#an-automation-platform-for-mission-critical-workloads)
> - [What's new with Ansible Automation Platform 1.2?](#whats-new-with-ansible-automation-platform-12)
> - [How does Ansible Automation Platform 1.2 work with Kubernetes?](#how-does-ansible-automation-platform-12-work-with-kubernetes)
> - [Where do I go next?](#where-do-i-go-next)

<!-- blog-enrichment:end -->

Red Hat Ansible Automation Platform 1.2 is now generally available with increased focus on improving efficiency, increasing productivity and controlling risk and expenses.  While many IT infrastructure engineers are familiar with automating compute platforms, Ansible Automation Platform is the first holistic automation platform to help manage, automate and orchestrate everything in your IT infrastructure from edge to datacenter.  To download the newest release or get a trial license, please sign up on <http://red.ht/try_ansible>.

[![Image One](https://www.redhat.com/rhdc/managed-files/ansible/Image%20One.jpg)](https://www.redhat.com/rhdc/managed-files/ansible/Image%20One.jpg)

## An automation platform for mission critical workloads

The Ansible project is a remarkable open source project with hundreds of thousands of users encompassing a large community.  Red Hat extends this community and open source developer model to innovate, experiment and incorporate feedback to satisfy our customer challenges and use cases.  Red Hat Ansible Automation Platform transforms Ansible and many related open source projects into an enterprise grade, multi-organizational automation platform for mission-critical workloads.  In modern IT infrastructure, automation is no longer a nice-to-have; it’s often now a requirement to run, operate and scale how everything is managed: including network, security, Linux, Windows, cloud and more.

Ansible Automation Platform includes a RESTful API for seamless integration with existing IT tools and processes.  The platform also includes a web UI with a push-button intuitive interface for novice users to consume and operate automation with safeguards.  This includes Role Based Access Controls (RBAC) to help control who can automate what job on which equipment, as well as enterprise integrations with TACACS+, RADIUS, and Active Directory.  Ansible Automation Platform also enables advanced workflows.  The workflows visualizer allows reusability of automation to concentrate on holistic use cases versus individual IT departments.  This encompasses the entire application deployment, from server installation to network ports being opened, including an email or Slack message alerting you that the automation workflow is complete.

[![Image 2](https://www.redhat.com/rhdc/managed-files/ansible/Image%202.jpg)](https://www.redhat.com/rhdc/managed-files/ansible/Image%202.jpg)

Ansible Automation Platform also includes access to multiple hosted services found on cloud.redhat.com.  These hosted services extend the capabilities of Ansible by providing enterprise features like governance and analytics across all Ansible Automation Platform clusters:

- **Automation Analytics** -  shares knowledge and insights that demonstrate automation value, finds both automation successes and automation opportunities, and proactively discovers problems in automation workloads across the enterprise.

- Learn more on YouTube: [Automation Analytics](https://www.youtube.com/playlist?list=PLdu06OJoEf2a1pAuaaxYqVREvPQz1wNa1)

- **Automation Hub** - the official repository to discover and download certified Ansible Content Collections maintained by Red Hat and technology partners.

- Learn more on YouTube: [Automation Hub](https://www.youtube.com/playlist?list=PLdu06OJoEf2aBf5nV5qQZmy2AH_Wif5vU)

- **automation services catalog** - organizes automation content across multiple clusters, provides multi-layered governance approvals, initiates automation jobs from a central point, and enables self-service business workflows.

- Learn more on YouTube: [automation services catalog](https://www.youtube.com/playlist?list=PLdu06OJoEf2ZN_AWwwJ3jxp6G03dCivlp)

> [!callout type=tmm label="Team resource" title="Event-Driven Ansible ChatOps" url="/blog/event-driven-ansible-chatops-from-chat-to-action/" cta="Read the guide"]
> From chat message to automated action with the TMM team walkthrough.

## What's new with Ansible Automation Platform 1.2?

**Introducing private Automation Hub**  
This new addition to Ansible Automation Platform provides a central location for local, internal automation communities to synchronize and manage their Ansible content via on-premises or any cloud provider. Administrators can synchronize available certified Content Collections as desired from Automation Hub on cloud.redhat.com to their own locally managed instance. More importantly, IT operations teams can allow development teams to manage their own internally developed automation content, providing a curated library of content to reuse and share as they stand up new automation projects quickly and predictably.

- Read the blog: [Control your content with private Automation Hub](https://www.ansible.com/blog/control-your-content-with-private-automation-hub)
- Learn more on YouTube:
  - [Private Automation Hub - Demonstration and Overview](https://youtu.be/-QKPTDwWu28)
  - [Ansible Automation Platform Installer introduction](https://youtu.be/yfyUIvhSYxg)

**Enhancements to automation services catalog**

New integrations now connect the automation services catalog to various IT service management systems, such as ServiceNow for service desk ticketing and BMC Remedy for configuration management database asset registration.  This helps customers align multi-vendor solutions for required enterprise compliance standards. 

Also for this release, in [Technology Preview](https://access.redhat.com/support/offerings/techpreview), customers can securely connect their automation services catalog to customer-deployed instances of Ansible Automation Platform. Working across multiple clusters, it provides a single, centralized point to manage and execute self-service and other automation jobs, now at the push of a button.

**Adding new Ansible-maintained Certified Content Collections for the most popular IT platforms**

Three new certified Ansible Content Collections cover areas that are in high demand, including:

- [Red Hat OpenShift Collection](https://cloud.redhat.com/ansible/automation-hub/) for OpenShift cluster automation; supported by Red Hat.
- [Kubernetes Core Collection](https://cloud.redhat.com/ansible/automation-hub/kubernetes/core) for native Kubernetes automation; supported by Red Hat.
- [VMware vSphere REST API Collection](https://cloud.redhat.com/ansible/automation-hub/vmware/vmware_rest) that contains 170+ Ansible modules and plugins using VMware REST API, supported by Red Hat.
- These new, supported Collections follow the initial [announcement made in June](https://www.ansible.com/blog/now-available-the-new-ansible-content-collections-on-automation-hub) containing network, cloud, and security content.

> [!callout type=tmm label="TMM resource" title="Solution Guides" url="https://ansible-tmm.github.io/solution-guides/" cta="Browse guides"]
> Outcome-focused guides for infrastructure and IT automation challenges.

## How does Ansible Automation Platform 1.2 work with Kubernetes?

In addition to the Ansible Content Collections listed above for Red Hat OpenShift and Kubernetes, we also [announced](https://www.redhat.com/en/about/press-releases/red-hat-expands-automation-hybrid-clouds-red-hat-ansible-automation-platform-integration-red-hat-openshift-environments) a [Technology Preview](https://access.redhat.com/support/offerings/techpreview) integration between Red Hat Advanced Cluster Management for Kubernetes and Ansible Automation Platform that helps scale and accelerate modernization initiatives based on Red Hat OpenShift.  Kubernetes is driving application modernization; however, this journey is incomplete without leveraging existing IT systems. Advanced Cluster Management for Kubernetes can be used to automate the deployment and management of Red Hat OpenShift clusters and applications, and to control policy compliance and enforcement. Automating everything outside of Kubernetes (networking, databases, firewall, etc.) can be done with Ansible Automation Platform.  By allowing developers and their container-native applications to interact with non-container native technologies, customers can bring externally hosted components into the container application lifecycle in a controlled and trusted way.  

- Read the press release: [Red Hat Expands Automation for Hybrid Clouds with Red Hat Ansible Automation Platform Integration for Red Hat OpenShift Environments](https://www.redhat.com/en/about/press-releases/red-hat-expands-automation-hybrid-clouds-red-hat-ansible-automation-platform-integration-red-hat-openshift-environments?extIdCarryOver=true&intcmp=7013a000002gv02AAA&percmp=7013a000002gyVvAAI&sc_cid=701f2000001Css5AAC)
- Learn more on YouTube: [Application Modernization for Hybrid Environments: Ansible Automation Platform + Advanced Cluster Management](https://www.youtube.com/watch?v=P3BFWP_QXe4&feature=emb_title)

## Where do I go next?

**Where can I get a trial?**  
If you want to get a trial to Ansible Automation Platform, please visit <http://red.ht/try_ansible>

**Where can I learn Ansible?**

Are you new to Ansible automation and want to learn?  Check out our getting started guide lessons on developers.redhat.com: <https://developers.redhat.com/products/ansible/getting-started>

**Where can I learn more on Ansible hosted services?**

Check out the documentation online here: <https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform>

**I missed AnsibleFest 2020. where is the content?**

We got you covered, check out this video: [AnsibleFest 2020! I missed it! Where is the content?](https://www.youtube.com/watch?v=YjEPR9jjSD0&t=2s)

Explore everything on-demand for free on [www.ansible.com/ansiblefest](https://www.ansible.com/ansiblefest)

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Learn why Red Hat customer MAPFRE chose Red Hat Ansible Automation Platform](/blog/learn-why-red-hat-customer-mapfre-chose-red-hat-ansible-automation-platform/)
> - [Using Ansible and Packer, From Provisioning to Orchestration](/blog/ansible-and-packer-why-they-are-better-together/)
> - [Ansible Tips and Tricks, Dealing with Unreliable Connections and Services](/blog/ansible-tips-and-tricks-dealing-with-unreliable-connections-and-services/)

<!-- blog-enrichment:related-end -->
