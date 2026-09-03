---
title: Ansible Automation Platform … You’re using it wrong.
slug: ansible-automation-platform-youre-using-it-wrong
authors:
- slug: roger-lopez
  name: Roger Lopez
published: '2023-04-03'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/ansible-automation-platform-youre-using-it-wrong
description: Discover 5 lesser-known features of Red Hat Ansible Automation Platform,
  like callback plugins & job slicing, to optimize your automation experience.
topics: []
read_time_minutes: 3
synced_at: '2026-09-03T19:21:55Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

## 5 things you didn’t know your Red Hat Ansible Automation Platform could do

[![5 things blog post](https://www.redhat.com/rhdc/managed-files/ansible/5%20things%20blog%20post.png)](https://www.redhat.com/rhdc/managed-files/ansible/5%20things%20blog%20post.png)

When we think about automation, we tend to focus on efficiency. Automating simple or even complex tasks to streamline our processes - It’s one of the reasons organizations adopt and implement Red Hat Ansible Automation Platform.

But what if we can take our automation abilities to the next level?

In this blog post, I’m going to highlight 5 things you didn’t know your Ansible Automation Platform could do.

### Callback Plugins

Ever need a job to notify you, log events, or capture the performance of a playbook?

Say hello to callback plugins. These plugins provide a way for Ansible to respond to particular events. In order to enable callback plugins, you'll need to tweak your job settings and supply the directory location in the Ansible callback plugins section. 

[![](https://www.redhat.com/rhdc/managed-files/ansible/hvme1ryAl_H_QiRC3XwmQEMddOI-2Xkwe_QR1RMosWAXa5vEAtxtUF8Ca-qiDfU-z4M_kbHqX5l9VNqMSKJWb_CkuLa5FSoAClmKREz01eySAa_4ZkJDcgnRf_I0XSoWfOQQXdT7JEKJ_U9_SrWctws_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/hvme1ryAl_H_QiRC3XwmQEMddOI-2Xkwe_QR1RMosWAXa5vEAtxtUF8Ca-qiDfU-z4M_kbHqX5l9VNqMSKJWb_CkuLa5FSoAClmKREz01eySAa_4ZkJDcgnRf_I0XSoWfOQQXdT7JEKJ_U9_SrWctws_0.png)

For example, the [log\_plays](https://docs.ansible.com/ansible/latest/collections/community/general/log_plays_callback.html#ansible-collections-community-general-log-plays-callback) callback plugin records playbook events to a log file, while the [mail](https://docs.ansible.com/ansible/latest/collections/community/general/mail_callback.html#ansible-collections-community-general-mail-callback) callback plugin can send emails on playbook failures. 

A list of available callback plugins can be found within the [Ansible documentation](https://t.co/Pcpug18nfL). 

### JSON Output

Looking for an easy way to view your Ansible output in JSON format? Take advantage of the Ansible API.

When a job runs within Ansible Automation Platform, it contains a job ID.

If you visit the job events URL for that particular job ID (`https://<controller-server-name>/api/v2/jobs/<job_id>/job_events`), you get instant access to your playbook output in JSON format!

[![](https://www.redhat.com/rhdc/managed-files/ansible/veizmKgWg_IreDRsP-uGQ7HfiwNbqhXBZT9rjkRX1ByxC2n8SQQ2HqGs7dsA9uQnoQ0y5SswKDrY4VfGK2DT62_6sMO-qFr3_pzHRFbHKWe3WnXq40L4OX-Y3CssOhq71T90K73NL9cEWTMzCNTf3e4_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/veizmKgWg_IreDRsP-uGQ7HfiwNbqhXBZT9rjkRX1ByxC2n8SQQ2HqGs7dsA9uQnoQ0y5SswKDrY4VfGK2DT62_6sMO-qFr3_pzHRFbHKWe3WnXq40L4OX-Y3CssOhq71T90K73NL9cEWTMzCNTf3e4_0.png)

### Dynamic Inventories

Do you ever use a dynamic inventory but only need to access a few servers from the list?

Use the Limit field within your Job templates. This ensures that only the specific host(s) or group(s) specified within the Limit field apply to your Ansible Job.

For example, if I want to make only changes to `webservers` and `dbservers` groups, add `webservers:dbservers` in the Limit field within your Ansible Job Template.

[![](https://www.redhat.com/rhdc/managed-files/ansible/b9dY6c4gr_sg4bafKvdMlsDSFgmzkDLCEnn9ZAO6XIQ7vuWvWQluYGuEvSwYYrYj7OBJEvQa3IlMJdY_Zuqo_xFeGhTwizF-E5TcFFc84ceGHQYYpt4nd4i9v-v_GED-N_LMwNthFfH6mh69oG7GGIc_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/b9dY6c4gr_sg4bafKvdMlsDSFgmzkDLCEnn9ZAO6XIQ7vuWvWQluYGuEvSwYYrYj7OBJEvQa3IlMJdY_Zuqo_xFeGhTwizF-E5TcFFc84ceGHQYYpt4nd4i9v-v_GED-N_LMwNthFfH6mh69oG7GGIc_0.png)

### Managing the lifecycle of a containerized application via Git

One of the great things about Ansible Automation Platform is how it can integrate with other tools. This is especially useful when you integrate Ansible Automation Platform with GitHub Webhooks. 

When you combine GitHub Webhooks and Ansible workflows, you can trigger changes to your application automatically. 

A perfect scenario for this is when you're running containerized apps at the Edge but want an automated way to manage those apps.

Here is a [YouTube video I made on managing the lifecycle of a Podman container](https://www.youtube.com/watch?v=NSuZrdsT1nk)

### Improving Execution Time on Large-Scale Jobs

Running a job on 1000s of servers and it’s taking forever to complete?Increase your forks!

Forks are used to determine how many hosts to automate against in parallel (default is 5). But be careful not to overcommit the value!

One way to ensure you don’t overcommit is checking your Capacity Adjustment value. Within Instance Groups -> <Your Group> -> Instances, under Capacity Adjustment you’ll see what each server on that group can handle.

[![](https://www.redhat.com/rhdc/managed-files/ansible/Ijk0ZQ0fNa-7GsA-6DhqJuvScrFhAFQChBAK28JVZLI7ro7rjxNtPJCz73B3fyD4mUXSEXfni6jopSCP5AXAi811TFSdeNbH2LxLWBnBt09uxEsQnc__35so_h3j_kxzqT08X_brb8U1S6K3xAqpOBo_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/Ijk0ZQ0fNa-7GsA-6DhqJuvScrFhAFQChBAK28JVZLI7ro7rjxNtPJCz73B3fyD4mUXSEXfni6jopSCP5AXAi811TFSdeNbH2LxLWBnBt09uxEsQnc__35so_h3j_kxzqT08X_brb8U1S6K3xAqpOBo_0.png)

### Optimizing Execution Performance with Multiple Nodes and Job Slicing

Do you have multiple execution nodes in your Ansible Automation Platform environment? Combine the increasing of forks with job slicing!

Job slicing breaks a job (“slices”) and places a slice per execution node. It allows you to split a single job to run across multiple execution nodes providing faster performance.

[![](https://www.redhat.com/rhdc/managed-files/ansible/1TOEzoflTvjsuNadhaYh2hx9oQdQBhoUNROpgVwNqQSgQb2C7ZrLAA-3rPU6yqBfJDxaQffRmRPaZ6_F7mODE2cHDGSJl-XgB3T9QWT5nHng8CaPm09LeaYJCPe-Xvjv3U2rZEfNf2CxijlEhGbX03s_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/1TOEzoflTvjsuNadhaYh2hx9oQdQBhoUNROpgVwNqQSgQb2C7ZrLAA-3rPU6yqBfJDxaQffRmRPaZ6_F7mODE2cHDGSJl-XgB3T9QWT5nHng8CaPm09LeaYJCPe-Xvjv3U2rZEfNf2CxijlEhGbX03s_0.png)

And there you have it! 5 things to take your automation to the next level!

I hope you found these top 5 tips valuable in discovering new ways to leverage the power of Ansible Automation Platform.

## What can I do next?

Whether you are beginning your automation journey or are a seasoned veteran, there are a variety of resources to enhance your automation knowledge.

- [Self-paced exercises](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) - Check out the interactive in-browser exercises to learn and dive into Ansible Automation Platform.
- [Trial subscription](http://red.ht/try_ansible) - Are you ready to go? Get your own trial subscription for unlimited access to all the components of Ansible Automation Platform.
- [Developer license](https://developers.redhat.com/about) - Did you know that you can get a free developer license to learn in your home lab? Register and get access to all the latest tools, technologies and community that Red Hat has to offer.
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel.](https://www.youtube.com/ansibleautomation)
- [Follow Red Hat Ansible](https://twitter.com/ansible) [Automation Platform](https://www.youtube.com/ansibleautomation) [on Twitter](https://twitter.com/ansible) - Do you have questions or an automation project you want to show off? Tweet at us!

---

### About the author

[![Roger Lopez](https://www.redhat.com/themes/custom/rhdc/img/author-default-img.svg)](https://www.redhat.com/en/authors/roger-lopez)

[### Roger Lopez](https://www.redhat.com/en/authors/roger-lopez)

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
