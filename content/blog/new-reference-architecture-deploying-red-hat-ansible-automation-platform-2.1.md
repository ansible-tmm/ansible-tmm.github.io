---
title: 'New reference architecture: Deploying Red Hat Ansible Automation Platform
  2.1'
slug: new-reference-architecture-deploying-red-hat-ansible-automation-platform-2.1
authors:
- slug: roger-lopez
  name: Roger Lopez
published: '2021-12-14'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/new-reference-architecture-deploying-red-hat-ansible-automation-platform-2.1
description: The latest reference architecture on the best practices for deploying
  a highly available Ansible Automation Platform 2.1 environment.
topics: []
read_time_minutes: 3
synced_at: '2026-09-03T19:22:00Z'
---

[![RA 2.1](https://www.redhat.com/rhdc/managed-files/ansible/RA%202.1.png)](https://www.redhat.com/rhdc/managed-files/ansible/RA%202.1.png)

With the release of [Red Hat Ansible Automation Platform 2.1](https://www.ansible.com/blog/introducing-red-hat-ansible-automation-platform-2.1), we are proud to deliver the latest reference architecture on the best practices for [deploying a highly available Ansible Automation Platform environment](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html-single/deploying_ansible_automation_platform_2.1/index). 

Why are you going to love it?

This reference architecture focuses on providing a step-by-step deployment procedure to install and configure a highly available Ansible Automation Platform environment from start to finish.   
  
But there’s more!   
  
Aside from the key steps to install Ansible Automation Platform, it incorporates key building blocks to optimize your Ansible Automation Platform environments, including:

- Centralized logging across multiple Ansible Automation Platform environments.
- Securing installation inventory passwords using ansible-vault.
- Using a combination of GitOps practices (configuration as code capabilities) and Git webhooks to streamline the automation and delivery of configurations to multiple Ansible Automation Platform sites automatically, immediately and consistently.

#### What are the foundational pieces to this reference architecture?

The reference architecture consists of two environments of Ansible Automation Platform: *Ansible Site 1* and *Ansible Site 2* for high availability. Site 1 is an active environment while Site 2 is a passive environment. Each site consists of the following:

- A three node automation controller cluster with one PostgreSQL database.
- A three node automation hub cluster with one PostgreSQL database.
- Two execution nodes per automation controller cluster.
- Access to hosted services on *console.redhat.com* such as Red Hat Insights for Red Hat Ansible Automation Platform, automation services catalog and Ansible automation hub.

To achieve high availability (HA) for the PostgreSQL databases, GitOps in conjunction with Git webhooks are used when push or merge events are triggered on a Git repository, which in turn will configure the specified event on both *Ansible Site 1* and *Ansible Site 2*.

#### Why was GitOps (Configuration as Code) used within this reference architecture?

By storing and managing Ansible Automation Platform configuration files as code, you can:

- Standardize the settings being applied to all our Ansible Automation Platform environments.
- Inherit the benefits of version control of our configurations.
- Easily scale additional Ansible Automation Platform deployments to use the same configuration settings.
- Easily track changes of the configuration settings, which helps fix issues easier.

Combining GitOps with Git webhooks, you can set up an Ansible Automation Platform workflow that immediately updates all of our Ansible Automation Platform sites simultaneously with the exact configurations across all the platforms.  
  
In effect, it removes the overhead of having to maintain database backups or enable an expensive database replication solution, while still achieving the strengths of those solutions.

Finally, for logging consistency, a highly available centralized logging environment was installed on both Ansible Automation Platform environments.

#### Why was enabling centralized logging a key part of this reference architecture?

When we think about logging, the first thought that comes to mind is often its ability to troubleshoot a particular issue. As technology continues to evolve and there is an enormous amount of data that applications must capture, logs play a vital role in capturing this data and allowing for operational intelligence methods.

Ansible Automation Platform provides a logging feature that enables the capability to send detailed logs to any number of third party external log aggregation services. Services connected to this data feed serve as a useful means in gaining insight into automation controller usage or technical trends. The data can be used to analyze events in the infrastructure, monitor for anomalies, and correlate events from one service with events in another.  
  
By taking advantage of the latest reference architecture, you inherit the most valuable benefits on how to best run the platform right from the start. And who doesn’t want that?

#### An image representing the reference architecture is provided below. What can I do next?

Whether you are beginning your automation journey or are a seasoned veteran, there are a variety of resources to enhance your automation knowledge:

- [Latest Reference Architecture](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html-single/deploying_ansible_automation_platform_2.1/index) - Download the latest Deploying Red Hat Ansible Automation Platform 2.1 reference architecture for an in-depth step-by-step deployment HOWTO.
- [Self-paced exercises](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) - Check out the interactive in-browser exercises to learn and dive into Ansible Automation Platform.
- [Trial subscription](http://red.ht/try_ansible) - Are you ready to go? Get your own trial subscription for unlimited access to all the components of Ansible Automation Platform.
- [Developer license](https://developers.redhat.com/about) - Did you know that you can get a free developer license to learn in your home lab? Register and get access to all the latest tools, technologies and community that Red Hat has to offer.
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel.](https://www.youtube.com/ansibleautomation) Be sure to check out our new web series, [Automated Live hosted by Colin McNaughton.](https://www.redhat.com/en/technologies/management/ansible/automated-live-videos)
- [Follow Red Hat Ansible](https://twitter.com/ansible) [Automation Platform](https://www.youtube.com/ansibleautomation) [on Twitter](https://twitter.com/ansible) - Do you have questions or an automation project you want to show off? Tweet at us!
