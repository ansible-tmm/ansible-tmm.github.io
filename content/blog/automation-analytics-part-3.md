---
title: Automation Analytics - ROI Calculator and Notifications enhancements
slug: automation-analytics-part-3
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2020-05-27'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/automation-analytics-part-3
description: If you are unfamiliar with Automation Analytics it is included as part
  of a Red Hat Ansible Automation Platform subscription and allows customers to analyze,
  aggregate, and report on data for their Red Hat Ansible Automation Platform deployments.
topics: []
read_time_minutes: 6
synced_at: '2026-09-03T19:21:06Z'
---

The [Red Hat Ansible Automation Platform](https://www.ansible.com/products/automation-platform) is continually offering enhancements through its hosted services on cloud.redhat.com. At Red Hat Summit 2020 the new [automation services catalog](https://www.ansible.com/products/automation-services-catalog) took the spotlight, which provides lifecycle management, provisioning, retirement and cataloging of automation resources to your business. However I wanted to also talk about the additional new  enhancements coming to Automation Analytics! Specifically I have two big things I want to talk about:

- Automations Calculator - a ROI (return on investment) calculator using aggregate data
- Notification improvements and a dedicated panel

If you are unfamiliar with [Automation Analytics](https://www.ansible.com/products/automation-analytics) it is included as part of a Red Hat Ansible Automation Platform subscription and allows customers to analyze, aggregate, and report on data for their Red Hat Ansible Automation Platform deployments. Check out the previous blog I wrote about [Getting Started with Automation Analytics](https://www.ansible.com/blog/getting-started-with-automation-analytics), or if you have concerns around what type of data is being shared with Red Hat check out my blog [Automation Analytics: Part 2 - Looking at Data Collection](https://www.ansible.com/blog/automation-analytics-part-2-looking-at-data-collection).

## Automation Calculator

I am super excited about this new feature of Automation Analytics. A lot of customers I get to meet with are trying to figure out how to measure the success of their automation initiatives.  What does success look like?  How much money and time did automation save me? In many cases automation is a net-new initiative that didn’t have its own budget. Folks leading these initiatives need to be able to communicate this type of information succinctly and effectively with hard data. While many IT engineers may obviously realize that automation is necessary, infrastructure teams still want to measure the value and put dollar amounts to it.

As soon as you login to Automation Analytics and choose automation calculator you are greeted with an easy to read bar graph.

[![Analytics part 3 p1](https://www.redhat.com/rhdc/managed-files/ansible/Analytics%20part%203%20p1.png)](https://www.redhat.com/rhdc/managed-files/ansible/Analytics%20part%203%20p1.png)

Automation Jobs are ranked from most saved to least saved in units of dollars. The calculation formula is provided on the page as well.

- **Manual cost for template X** =(time for a manual run on one host \* (sum of all hosts across all job runs) ) \* cost per hour
- **Automation cost for template X** =cost of automation per hour \* sum of total elapsed hours for a template
- **Savings** =Sum of (manual cost - automation cost) across all templates

To make this easy to understand, I will walkthrough an example:  
  
Job Template called “Configure NGINX”.  Lets make some quick assumptions:

- This normally took an engineer 2 hours to configure manually
- It cost my company $50 dollars an hour to pay this systems administrator.
- I have 400 hosts.
- This task takes 5 minutes to run with Ansible
- The cost of my automation environment is costing me $20 dollars an hour.

**Manual** **cost** = (2 hours \* 400 hosts \* $50) = $40,000

**Automation cost =** ($20 \*5 minutes) = $1.66

**Savings = (**$40,000 - 1.65) = $39,998 in savings.

## Customization

Of course every organization is different so we made these calculations very flexible for you to help more accurately represent your cost savings:

[![Automation Analytics 3 p2](https://www.redhat.com/rhdc/managed-files/ansible/Automation%20Analytics%203%20p2.png)](https://www.redhat.com/rhdc/managed-files/ansible/Automation%20Analytics%203%20p2.png)

In the initial release there is a way to both configure the manual cost for executing the Job by human power alone and the cost of automation for your business. These can be configured and set so that they more accurately represent your costs and time savings in your organization.

Each Job can be granularly configured to represent the time you estimate it would take your team to execute these Jobs manually. For example my “Configure Red Hat Enterprise Linux web servers” role only takes my engineers 30 minutes to complete, not 60, so I can simply change the value to more accurately represent our time savings.  
  
The initial default value looked like this:

[![Analytics part 3 p3](https://www.redhat.com/rhdc/managed-files/ansible/Analytics%20part%203%20p3.png)](https://www.redhat.com/rhdc/managed-files/ansible/Analytics%20part%203%20p3.png)

By changing the amount it will instantly update the cost savings:

[![Analytics part 3 p4](https://www.redhat.com/rhdc/managed-files/ansible/Analytics%20part%203%20p4.png)](https://www.redhat.com/rhdc/managed-files/ansible/Analytics%20part%203%20p4.png)

Clicking on the information button (represented by the lowercase i) I can grab even more detailed information:

[![Analytics part 3 p5](https://www.redhat.com/rhdc/managed-files/ansible/Analytics%20part%203%20p5.png)](https://www.redhat.com/rhdc/managed-files/ansible/Analytics%20part%203%20p5.png)

The total elapsed sum refers to all Job runs over time in seconds. There was 11 runs, which means if a human did these tasks it would take (11 runs \* 30 minutes) 5 ½ hours which equates to (5.5 hours \* $50 an hour) $275 dollars. Ansible Automation only took 297.31 seconds to run this job 11 times as shown in the **Total elapsed sum**, which equates to (20 dollars an hour \* 297.31 seconds) = ~$1.31 dollars. This is half a percent (or 0.46%) of what it cost me manually to do these tasks before!

This percentage also lets you quickly identify high ROI tasks versus low ROI tasks which allows you to make educated decisions on which types of automation have the highest return on investment. This means your team can concentrate on highly rewarding automation tasks versus automating things that are not saving you  much time. The coolest part of this entire ROI calculator is that it is using real data from your Ansible clusters. Module by module, job by job, you can get breakdowns of performance, failure rates, cost and ROI.

## Notifications Panel

Health notifications are an important part of the Automation Analytics offering. This takes the aggregated data and provides valuable context around your deployments providing you quick succinct takeaways on your deployed clusters. The notifications now have their own dedicated panel you can reach this by clicking the UI on the left hand menu:

[![Analytics part 3 p6](https://www.redhat.com/rhdc/managed-files/ansible/Analytics%20part%203%20p6.png)](https://www.redhat.com/rhdc/managed-files/ansible/Analytics%20part%203%20p6.png)

The new dedicated panel provides an intuitive interface with color coding to quickly identify errors, notices and warnings across all of your deployed clusters.

[![analytics part 3 p7](https://www.redhat.com/rhdc/managed-files/ansible/analytics%20part%203%20p7.png)](https://www.redhat.com/rhdc/managed-files/ansible/analytics%20part%203%20p7.png)

The notifications panel also provides filtering, where you can filter down to the specific Ansible Cluster:

[![analytics part 3 p8](https://www.redhat.com/rhdc/managed-files/ansible/analytics%20part%203%20p8.png)](https://www.redhat.com/rhdc/managed-files/ansible/analytics%20part%203%20p8.png)

Or filter by the severity of the notification:

[![analytics part 3 p9](https://www.redhat.com/rhdc/managed-files/ansible/analytics%20part%203%20p9.png)](https://www.redhat.com/rhdc/managed-files/ansible/analytics%20part%203%20p9.png)

Notifications also now include a linkout icon tying them with the respective Ansible cluster deployment:

[![analytics part 3 p10](https://www.redhat.com/rhdc/managed-files/ansible/analytics%20part%203%20p10.png)](https://www.redhat.com/rhdc/managed-files/ansible/analytics%20part%203%20p10.png)

That means as soon as you see a severe notification you can instantly click and be on the respective cluster interface to address the health notification. The panel also now supports paging and will store history of all notifications for users to quickly sort through, keeping a detailed history.

## New Notifications

A beautiful and intuitive panel would be nothing without the actual notifications themselves. We are continually adding new notifications that will help you analyze your clusters. Some of the new ones I want to highlight are:

- **Node in cluster down -** previously Automation Analytics would only tell you if an entire cluster was down. Now if any individual node within the cluster reports an outage this will be relayed in the notifications panel.

- **Ansible cluster approaching license expiry** - Although the Red Hat Ansible Automation Platform will never stop your production workloads, we can now provide health notifications when you are up for renewal.  This will help administrators to plan ahead and easily keep track of their Red Hat Ansible Automation Platform licenses.

- **Ansible cluster approaching license capacity -** in addition to expired licenses we nowalso make it easier to understand usage across multiple clusters.

- **Too Many Pending jobs** - when the Job queue on any cluster approaches 1,000 pending jobs a notification will be issued. The notification will go away when there are no more pending jobs.

- **Ansible Tower version is too close to End of Life** (EOL) - The Ansible Tower version for the cluster is approaching the EOL for support. This notification will go away when the Ansible Tower version is upgraded.
- **Jobs in Error State -** Notification when any jobs that fail due to reasons other than 'task fails' or 'host unreachable'. Generally means service errors and problems with automation infrastructure versus an Ansible Playbook or content collection.

## Where to go next?

I hope this blog helped outline these upcoming features and functionality that Automation Analytics is providing. We believe that Automation Analytics can help organizations measure performance and success of their automation initiatives. The hosted service offering Automation Analytics is optional and included in the price of the Red Hat Ansible Automation Platform. We do not force any existing customers to use the tool and hand us data, but hope this will provide increased benefits.

- [Learn more on Automation Analytics including a video demo](https://www.ansible.com/products/automation-analytics)
- [Attend an Ansible Automation Workshop and get hands-on with Ansible Tower](https://www.ansible.com/community/events/workshops)
- [Contact us to get pricing information on the Ansible Automation Platform](https://www.ansible.com/products/pricing)

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

### [The architecture of autonomy: How ING built a future-proof tech strategy](https://www.redhat.com/en/blog/architecture-autonomy-how-ing-built-future-proof-tech-strategy)

Blog post

### [The last mile problem in agentic AI: Why tool calling reliability is harder than it looks](https://www.redhat.com/en/blog/last-mile-problem-agentic-ai-why-tool-calling-reliability-harder-it-looks)

Original podcast

### [How Red Hat cleared IT debt for scalable AI](https://www.redhat.com/en/technically-speaking/ai-ready-data-cleanup)

Original podcast

### [Virtualization Is (Still) King | Compiler](https://www.redhat.com/en/compiler-podcast/virtualization-ai)
