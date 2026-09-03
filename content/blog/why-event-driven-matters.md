---
title: Why Event-Driven Automation Matters
slug: why-event-driven-matters
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2022-09-21'
updated: '2025-11-26'
source: redhat
source_url: https://www.redhat.com/en/blog/why-event-driven-matters
description: Learn why event-driven matters and how it can help you.
topics: []
read_time_minutes: 3
synced_at: '2026-09-03T19:21:44Z'
---

- [Back to all posts](/blog/)

---

[![Event driven automation blog](https://www.redhat.com/rhdc/managed-files/ansible/Event%20driven%20automation%20blog.png)](https://www.redhat.com/rhdc/managed-files/ansible/Event%20driven%20automation%20blog.png)

Life comes down to moments. These events are often how we define our achievements, successes, and failures throughout life. Just like our daily lives, IT organizations and teams can also have these defining moments, where you will often hear phrases like the "great database crash of '98." Many of these memorable IT  moments occur from limiting ourselves to a reactive approach when it comes to managing our IT assets. This is where event-driven automation can help us move from reactive to proactive IT management – well before we have the next great issue or moment in our IT teams.

In an IT context, events come from monitoring or other tools to tell us when something needs attention.  With this event data, we are able respond faster with automated tasks, resolving issues or enhancing observation where needed, often so we can identify and address festering issues before they are full blown problems. A byproduct of this means teams are now able to spend more time innovating, and are able to realize greater work-life balance because  troubleshooting patterns and remediation approaches are automatically initiated based on an initial event in your environments.

## Events on the Infrastructure

Consider the ubiquitous, laborious, and manual experience of remediating tickets submitted through IT service management systems. Automating from IT service management system events is one potent way to find savings in the costs of closing out trouble tickets. Historically, tickets require some level of manual touch, even if there is no system issue to resolve. And resolving system issues manually only increases the time and cost. Using event-driven automation to remediate the tickets and, even resolve or partially resolve the incidents themselves, not only helps you reduce your costs and better allocate your resources, it can also improve your customer experience. And your efficiencies can improve as your data grows, allowing you to automate a growing number of issues, and increasing complexity, depending on the ruleset you want to create.

In addition to resolving tickets, [event-driven automation can also be used to automate compliance](https://www.ansible.com/blog/event-driven-remediation-with-systemd-and-red-hat-ansible-automation-platform) by checking and maintaining patch levels, and remediating and preventing drift. Using a file system watcher, file system changes can be a trigger for remediation. Not only can the remediation be helpful, but the resulting data can be evaluated to identify larger problems that may require manual intervention. On the security side, firewall changes could be used as a trigger for event-driven remediation.

## Events on the Network

But there are also other areas where event-driven remediation could help you find surprising efficiencies and cost savings, like network automation. Going beyond automating device configuration or network fact collection, imagine the value of creating a self-scaling, self-healing network. An event based on a workload threshold within an environment could trigger automated network resource management, improving customer experience, as well as reducing the time and cost associated with manual scaling. When you can customize and scale how extensive and complex your automation is, you can increase efficiency over time, without sacrificing the ability to gather data and assess risk.

## Events at the edge

Automation plays a key role in managing data and applications at the edge. As with the above use cases, event-driven automation can identify system changes in edge devices and remediate drift. You could also use triggers to deploy containers at the edge using `systemd` with Red Hat Enterprise Linux.

## The future of events and automation

While there’s still a lot of room for innovation (applying machine learning, for example), much of the value lies in using event-driven automation to be more proactive in your IT operations and further reduce manual efforts.

In closing, there is a large amount of event data about your IT systems already in your environment. Why not use it to your advantage to make troubleshooting issues faster and easier or even resolving them before they grow into a moment? Get started by learning more about event-driven automation.  Here are a few resources to help:

- [Achieving speed and accuracy though event-driven automation](https://www.redhat.com/en/blog/achieving-speed-and-accuracy-through-event-driven-automation)
- [Event-driven remediation with systemd and Red Hat Ansible Automation Platform](https://www.ansible.com/blog/event-driven-remediation-with-systemd-and-red-hat-ansible-automation-platform)
- [Implementing an event driven architecture (AnsibleFest 2021)](https://www.youtube.com/watch?v=PFYZbgx3mg0&list=PLdu06OJoEf2aVagK5rW1uMA76H8rPw3CT&index=29)
- [Check out these advanced automation session at AnsibleFest 2022](https://events.experiences.redhat.com/widget/redhat/rhaf22/SessionCatalog2022?search=event-driven&tab.day=20221019)

Also check out  [AnsibleFest 2022](https://www.ansible.com/ansiblefest) in person in Chicago on October 18 and 19, 2022!  Exciting news will be shared and you can check out additional event driven sessions.

---

### About the author

[![Nuno Martins](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/Nuno%20Martins.webp?itok=-RZ_7BCo)](https://www.redhat.com/en/authors/nuno-martins)

[### Nuno Martins

Technical Marketing Manager, Red Hat Ansible Automation Platform](https://www.redhat.com/en/authors/nuno-martins)

Nuno is a Technical Marketing Manager for the Ansible Automation Platform. He is a Red Hat Certified Architect and a Certified Instructor with over 15 years of experience in multiple technologies. Currently based in South Africa, he has international experience with having worked all over Europe and Africa.

[More from this author](https://www.redhat.com/en/authors/nuno-martins)

Enter keywords here to search blogs

UI\_Icon-Red\_Hat-Close-A-Black-RGB

Search

## More like this

Blog post

### [The architecture of autonomy: How ING built a future-proof tech strategy](https://www.redhat.com/en/blog/architecture-autonomy-how-ing-built-future-proof-tech-strategy)

Blog post

### [The last mile problem in agentic AI: Why tool calling reliability is harder than it looks](https://www.redhat.com/en/blog/last-mile-problem-agentic-ai-why-tool-calling-reliability-harder-it-looks)

Original podcast

### [How Red Hat cleared IT debt for scalable AI](https://www.redhat.com/en/technically-speaking/ai-ready-data-cleanup)

Original podcast

### [Virtualization Is (Still) King | Compiler](https://www.redhat.com/en/compiler-podcast/virtualization-ai)
