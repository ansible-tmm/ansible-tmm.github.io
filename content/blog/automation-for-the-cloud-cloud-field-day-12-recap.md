---
title: 'Automation for the cloud: Cloud Field Day 12 recap'
slug: automation-for-the-cloud-cloud-field-day-12-recap
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2021-11-18'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/automation-for-the-cloud-cloud-field-day-12-recap
description: Cloud Field Day 12 was a three day event that focused on the impact of
  cloud on enterprise IT. This blog offers a recap of key Red Hat automation content.
topics: []
read_time_minutes: 2
synced_at: '2026-09-03T19:21:00Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** Cloud Field Day 12 was a three day event that focused on the impact of cloud on enterprise IT. This blog offers a recap of key Red Hat automation content.

<!-- blog-enrichment:end -->

[![cfd12](https://www.redhat.com/rhdc/managed-files/ansible/cfd12.png)](https://www.redhat.com/rhdc/managed-files/ansible/cfd12.png)

I recently had the opportunity to present our Red Hat Ansible Automation Platform cloud strategy at Cloud Field Day 12.   

Cloud Field Day 12 was a three day event that focused on the impact of cloud on enterprise IT. As a presenter, you can use any combination of slides and live demos to foster a discussion with a group of thought leaders. This roundtable included people from many different companies, skill sets, backgrounds and favorite tools. *Check out the Cloud Field Day* [*website*](https://techfieldday.com/event/cfd12/) *to see the delegate panel, their backgrounds and Twitter handles*. I quite enjoyed, and preferred, the conversational tone of Cloud Field Day, and the delegates who asked questions during the demo made it a lot more interactive.

Red Hat presented three products at Cloud Field Day: [Red Hat OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift), which is our enterprise-ready Kubernetes container platform, Ansible Automation Platform, which I co-presented with Richard Henshall, our Head of Product and Strategy for Ansible Automation Platform, and finally [Red Hat Advanced Cluster Management for Kubernetes](https://www.redhat.com/en/technologies/management/advanced-cluster-management), which extends the value of Red Hat OpenShift by deploying apps, managing multiple clusters and enforcing policies across multiple clusters at scale. I will list all three videos below.

> [!callout type=tmm label="TMM resource" title="Workshops and Labs" url="https://labs.demoredhat.com/" cta="Launch a lab"]
> Launch guided lab environments for Ansible and Red Hat technologies.

I will leave most of the Cloud Field Day details to the videos, but I think it is very important for readers to understand that Ansible Automation Platform is automation technology first, built for flexibility and scale, and not necessarily a traditional management tool. Let’s go into more detail as to why:  

Red Hat OpenShift is Red Hat’s container management platform for everything Kubernetes. It provides turn-key, day 1 and day 2+ enterprise management for your OpenShift cluster. Red Hat Advanced Cluster Management scales the management experience to multiple clusters. OpenShift and Red Hat Advanced Cluster Management are specialized management tools for managing OpenShift clusters.

However, Ansible Automation Platform is exactly what its name implies: an automation platform. You can absolutely automate and manage specific Kubernetes and OpenShift operational activities, leveraging existing knowledge of those solutions, but this requires creating Ansible Playbooks to build out automation jobs. The advantage of an automation platform is increased flexibility and adaptability to address a variety of IT challenges. Automation architects can integrate individual automation and management jobs into more complex workflows and focus on overall business outcomes versus an individual tool or process.

> [!callout type=tmm label="TMM resource" title="Ansible Product Demos" url="https://ansible.github.io/product-demos/" cta="Browse demos"]
> Reusable demos that showcase Ansible Automation Platform capabilities.

I really love the following paragraph on the “network management vs. network automation” page on [redhat.com](https://www.redhat.com/en/topics/management/what-is-network-management#management-vs-automation):   

“The difference between management products and automation products lies in the (highly subjective) differences between management and automation. Since there’s no such thing as seamless automation, there’s also no objective point at which management becomes automation. At some point, the human effort required to manage a set of tasks is significantly less than before. When that happens, what was once described as management might now be described as automation.” 

Now enjoy the videos!

Red Hat OpenShift and Ansible Automation Platform Overview

Advanced Techniques with Ansible Automation Platform

Red Hat Advanced Cluster Management

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Learn why Red Hat customer MAPFRE chose Red Hat Ansible Automation Platform](/blog/learn-why-red-hat-customer-mapfre-chose-red-hat-ansible-automation-platform/)
> - [Using Ansible and Packer, From Provisioning to Orchestration](/blog/ansible-and-packer-why-they-are-better-together/)
> - [Ansible Tips and Tricks, Dealing with Unreliable Connections and Services](/blog/ansible-tips-and-tricks-dealing-with-unreliable-connections-and-services/)

<!-- blog-enrichment:related-end -->
