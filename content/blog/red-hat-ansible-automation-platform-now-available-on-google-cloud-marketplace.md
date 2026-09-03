---
title: Red Hat Ansible Automation Platform on Google Cloud Marketplace
slug: red-hat-ansible-automation-platform-now-available-on-google-cloud-marketplace
authors:
- slug: hicham-mourad
  name: Hicham Mourad
published: '2023-02-20'
updated: '2026-07-29'
source: redhat
source_url: https://www.redhat.com/en/blog/red-hat-ansible-automation-platform-now-available-on-google-cloud-marketplace
description: Breaking news! Red Hat just announced Ansible Automation Platform’s availability
  on Google Cloud Marketplace.
topics:
- Cloud automation
read_time_minutes: 4
synced_at: '2026-09-03T19:21:26Z'
---

## Introduction

As organization’s hybrid cloud environments continue to grow in complexity, so does the need to increase efficiency and speed. The solution is to take advantage of an automation platform that can help any organization create, manage and scale their automation efforts across the entire IT infrastructure. Red Hat Ansible Automation Platform enables organizations to coordinate and scale automation across all IT domains and fosters a culture of collaboration between disparate teams.

In 2023, we announced the [availability of Ansible Automation](https://www.redhat.com/en/about/press-releases/red-hat-launches-ansible-automation-platform-google-cloud) Platform on Google Cloud.

In this blog, you’ll learn more details about this offering and why you should consider adopting Ansible Automation Platform directly from Google Cloud Marketplace.

## Google Cloud Marketplace deployment

Ansible Automation Platform deploys directly from Google Cloud Marketplace as a self-managed application. The many benefits include:

1. Deployment of the solution into your environment, where you have total control over how you deploy, configure and operationalize the solution. You can follow the [Installation planning guide](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/latest) and [Tested deployment model guide](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/latest)
2. The ability to scale the Ansible Automation Platform environment using [automation mesh](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/latest)with extension nodes
3. Taking advantage of the many Google Cloud services, you are accustomed to, including Google Cloud billing and any committed spend you have with Google Cloud (committed use discounts CUDs)
4. World-class premium support from Red Hat!

How do you get started with Ansible Automation Platform on Google Cloud? Simply visit [Google Cloud Marketplace](https://console.cloud.google.com/marketplace/browse?q=red%20hat%20ansible%20automation%20platform) and search for Red Hat Ansible Automation Platform.

[![Once there, you will notice 3 Google Marketplace tiles available (Figure 1).  ](https://www.redhat.com/rhdc/managed-files/image1_243.png)](https://www.redhat.com/rhdc/managed-files/image1_243.png)

Figure 1

Once there, you will notice 3 Google Marketplace tiles available (Figure 1).

**You will choose from 2 options**: the self-managed subscription, or the self-managed virtual machine (VM)-based offer.

**OPTION 1: Red Hat Ansible Automation Platform Subscription (self-managed)**

[![This option is for annual contracts with PRIVATE OFFERS.](https://www.redhat.com/rhdc/managed-files/image6_52.png)](https://www.redhat.com/rhdc/managed-files/image6_52.png)

Figure 2

- **This option is for annual contracts with PRIVATE OFFERS.**
- Customers have full control over the design / architecture / configuration of Ansible Automation Platform.
- This subscription offer should be used with the Red Hat Ansible Automation Platform Subscription Deployment offer that requires a subscription (Figure 2).
- **Step 1 for deployment**: Contact Red Hat sales to get a private offer. Accept it, then move to step 2 when ready.
- **Step 2 for deployment**: Use this Red Hat Ansible Automation Platform Subscription Deployment tile to deploy the Red Hat Enterprise Linux VMs for your Ansible Automation Platform deployment based on your [desired architecture](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/latest). Use the SUBSCRIPTION entitlement from step 1 to activate Ansible Automation Platform.

**OPTION 2: Red Hat Ansible Automation Platform Self-Managed (VM-based offer)**

[![This Self-managed VM-based offer is for organizations that want to use Ansible Automation Platform on their own and purchase it at list price (Figure 3).](https://www.redhat.com/rhdc/managed-files/image7_38.png)](https://www.redhat.com/rhdc/managed-files/image7_38.png)

Figure 3

- This Self-managed VM-based offer is for organizations that want to use Ansible Automation Platform on their own and purchase it at list price (Figure 3).
- This is intended for hourly consumption.
- Customers have full control over the design / architecture / configuration of Ansible Automation Platform.
- Activate your Ansible Automation Platform subscription.
- Use this tile to deploy the Red Hat Enterprise Linux VMs for your deployment based on your [desired architecture](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/latest).
- Use the SUBSCRIPTION entitlement to activate Ansible Automation Platform.

**Ansible Automation Platform installation on VMs**

With the infrastructure all in place, the next step is to install Ansible Automation Platform. Download the latest version of Ansible Automation Platform from Red Hat Customer Portal.  Remember to [plan the installation](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.5/html/planning_your_installation/index), and set up a [tested / supported environment](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.5/html/tested_deployment_models).

## Google Cloud integrations

For many organizations using Google Cloud today, there’s a huge benefit in taking advantage of Ansible Automation Platform on Google Cloud Marketplace. It runs in your Google Cloud account and integrates efficiently with many of the Google Cloud services, including Google billing. Additionally, if you have Google Cloud committed use discounts (CUDs), this solution will count towards that spend agreement and will be reflected on your Google Cloud bill.

Speaking of integration, you’ll have access to Red Hat Ansible Certified [Google Cloud Collection](https://console.redhat.com/ansible/automation-hub/repo/published/google/cloud/) that includes Ansible content to automate the management of Google Cloud resources. Ansible Certified Content Collections provide the ability to integrate with many different technologies and simplify automation against these technologies. Ansible Automation Platform brings together and centralizes all your automation needs from cloud to private cloud to edge and across numerous automation use cases.

Once you’ve deployed Ansible Automation Platform with a few simple configuration steps, you can integrate with identity providers of your choice to provide single sign-on, in addition to being able to take advantage of Ansible Automation Platforms role-based access control (RBAC) capabilities.

[![role-based access control](https://www.redhat.com/rhdc/managed-files/role-based%20access%20control.gif)](https://www.redhat.com/rhdc/managed-files/role-based%20access%20control.gif)

## Automation content

Anyone using Ansible Automation Platform in Google Cloud will want to start by using Red Hat Ansible Certified Content Collection for Google Cloud. With your Ansible Automation Platform subscription, you have access to all Red Hat Certified Content available on the [Red Hat Hybrid Cloud Console](https://console.redhat.com/). Visit Ansible Automation Platform services and look for [automation hub / collections (Figure 4)](https://console.redhat.com/ansible/automation-hub).

[![Ansible Automation Platform subscription](https://www.redhat.com/rhdc/managed-files/Ansible%20Automation%20Platform%20subscription.png)](https://www.redhat.com/rhdc/managed-files/Ansible%20Automation%20Platform%20subscription.png)

The Google Cloud Collection referenced (Figure 5) shows over 170+ modules to interrogate, manage and automate numerous Google Cloud resource types, including Google compute engine networking, databases, Google Kubernetes Engine, storage, security groups, Identity and Access Management (IAM) and more.

[![Ansible automation hub](https://www.redhat.com/rhdc/managed-files/Ansible%20automation%20hub_0.png)](https://www.redhat.com/rhdc/managed-files/Ansible%20automation%20hub_0.png)

See the full list of modules on [Ansible automation hub](https://console.redhat.com/ansible/automation-hub/repo/published/google/cloud/content/) (Figure 6).

There’s some great automation content available, including examples to learn more about using Ansible Automation Platform on Google Cloud. Additionally, [GitHub repository](https://github.com/ansible-content-lab/cloud-deploy) has automation content for automating Google Cloud’s (and other environments’) network resources, such as creating VPC networking and more.

Remember to take advantage of the many Red Hat Ansible Certified Content Collection technologies you can find on [Red Hat Hybrid Cloud Console](https://console.redhat.com/ansible/automation-hub). There’s a high probability that the technologies you use in your environment are already [available](https://console.redhat.com/ansible/automation-hub) and can enable you to automate many of the use cases you have today.

Figure 7 shows a small sample of what’s available.

[![automating in Google Cloud](https://www.redhat.com/rhdc/managed-files/automating%20in%20Google%20Cloud.png)](https://www.redhat.com/rhdc/managed-files/automating%20in%20Google%20Cloud.png)

**Is this just for automating in Google Cloud?**

You can run Ansible Automation Platform anywhere, including on Google Cloud. As long as you have proper networking configuration and connectivity, you are able to automate public cloud, private cloud, physical and virtual environments and edge resources.

Automation use cases are endless, and there are so many efficiencies and savings you will gain by using Ansible Automation Platform. Reduce human errors, automate repetitive activities, integrate into DevOps use cases and increase collaboration amongst the many different IT domains.

## What can I do next?

- Learn more about [Ansible Automation Platform on Google Cloud Marketplace](https://www.redhat.com/en/technologies/management/ansible/google-cloud)
- Learn more about [Ansible Automation Platform on other hyperscalers](https://www.redhat.com/en/technologies/management/ansible)
- Get hands-on self-paced labs on Ansible Automation Platform
- Take a look at the Ansible Automation Platform [documentation](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/latest)
- Consider trying other Red Hat products from the Google Cloud Marketplace, as shown below (Figure 8).

[![Google Cloud Marketplace](https://www.redhat.com/rhdc/managed-files/image6_45.png)](https://www.redhat.com/rhdc/managed-files/image6_45.png)

---

### About the author

[![Hicham Mourad](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/ansible/hicham%20%281%29_0.jpeg?itok=bbvELvbE)](https://www.redhat.com/en/authors/hicham-mourad)

[### Hicham Mourad](https://www.redhat.com/en/authors/hicham-mourad)

Hicham is responsible for technical marketing of the Red Hat Ansible Automation Platform on Clouds. Hicham has been in the software industry for over 20 years and for many of them focused on cloud management.
Hicham has been a frequent presenter at events and conferences like VMworld, vForum, VMUG, VMLive, Gartner, Dell Technology World, AWS re:Invent, HPE Discover, Cloud Field Day, Red Hat Summit, AnsibleFest, in addition to Customer events.

[More from this author](https://www.redhat.com/en/authors/hicham-mourad)

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
