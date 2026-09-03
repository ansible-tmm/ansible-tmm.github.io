---
title: 'Automation Analytics: Part 2 - Looking at Data Collection'
slug: automation-analytics-part-2-looking-at-data-collection
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2019-12-02'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/automation-analytics-part-2-looking-at-data-collection
description: Part 2 of the Automation Analytics blog post expanding on what data is
  collected and how to gain access to that data.
topics: []
read_time_minutes: 7
synced_at: '2026-09-03T19:21:10Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

[![blog_getting-started-Automation-Analytics-Part-2](https://www.redhat.com/rhdc/managed-files/ansible/blog_getting-started-Automation-Analytics-Part-2.png)](https://www.redhat.com/rhdc/managed-files/ansible/blog_getting-started-Automation-Analytics-Part-2.png)

We recently released [Red Hat Ansible Automation Platform](https://www.ansible.com/products/automation-platform) which now includes multiple Software-as-a-Service (SaaS) offerings, one of which is Automation Analytics.  This offering provides a visual dashboard, health notifications and organization statistics for your Ansible Automation. Automation Analytics works across multiple Ansible Tower clusters allowing holistic analytics across your entire automation infrastructure.

In a previous blog I wrote about [Getting Started with Automation Analytics](https://www.ansible.com/blog/getting-started-with-automation-analytics), but now want to expand on what data is collected and how to gain access to that data.  I highly recommend reading the previous blog if you are new to Red Hat Ansible Automation Platform, Ansible Tower concepts and our SaaS offerings. This is important to many customers because they all have their own security concerns with what data leaves their premises as well as  obligations to their own customers and stakeholders to make sure data sent will not be compromised in any way.

[Retrieving the data:](#Retrievingdata)

[Analyzing the data](#Analyzedata)

[config.json](#config.json)

[counts.json](#counts.json)

[cred\_type\_counts.json](#cred_type_counts.json)

[events\_table.csv](#events_table.csv)

[instance\_info.json](#instance_info.json)

[inventory\_counts.json](#inventory_counts.json)

[job\_counts.json](#job_counts.json)

[job\_instance\_counts.json](#job_instance_counts.json)

[manifest.json](#manifest.json)

[org\_counts.json](#org_counts.json)

[projects\_by\_scm\_type.json](#projects_by_scm_type.json)

[query\_info.json](#query_info.json)

[unified\_jobs\_table.csv](#unified_jobs_table.csv)

[unified\_job\_template\_table.csv](#unified_job_template_table.csv)

[Where to go next?](#Where-to-go-next)

## Retrieving the data:

Login to the Ansible Tower host with an account that has root privileges.  Create a folder (or use an existing folder) to work from.

```
[sean@rhel8]$ mkdir my_data
```

Use the awx-manage gather\_analytics command to gather data. Do not use the --ship argument - that will send your data to Red Hat and will delete the temporary tar.gz tarball created and you will not be able to look at the contents. You can also use the command awx-manage gather\_analytics --help to get more details on which arguments are available and what they do.

```
[sean@rhel8]$ sudo awx-manage gather_analytics
Last analytics run was: 2019-11-22 20:37:27.185094+00:00
/tmp/bed08c6b-19cc-4a49-bc9e-82c33936e91b_2019-11-22-203854+0000.tar.gz
```

The output of the command will provide the temporary location of the tar.gz file. Copy the tarball file over into your directory, and untar it.

```
[sean@rhel8]$  cp /tmp/bed08c6b-19cc-4a49-bc9e-82c33936e91b_2019-11-22-203854+0000.tar.gz ~/my_data/my_data.tar.gz
[sean@rhel8]$ tar -zvf my_data.tar.gz
```

Now you will have a directory full of the exact contents that are sent to cloud.redhat.com:

```
[sean@rhel8]$ tree
.
├── config.json
├── counts.json
├── cred_type_counts.json
├── events_table.csv
├── instance_info.json
├── inventory_counts.json
├── job_counts.json
├── job_instance_counts.json
├── manifest.json
├── mydata.tar.gz
├── org_counts.json
├── projects_by_scm_type.json
├── query_info.json
├── unified_jobs_table.csv
└── unified_job_template_table.csv
```

This blog describes the data collected as of Red Hat Ansible Tower 3.6. Later releases of the platform may gather different data, or format it differently.

## Analyzing the data

This is your data, nothing is encrypted on the local file system. That means it is possible to cat each file (or open with the text editor or application of your choice). Please refer to the [Security FAQ](https://www.ansible.com/products/ansible-analytics/faq) for high level answers.  All the created file types are either json or csv files, making them easy to read and understand. I will walk through each file and generally show what data is in there, and provide some thorough examples.

### config.json

The config.json file contains data around the Ansible Tower system itself.  This includes the version of Red Hat Enterprise Linux, relevant universally unique identifiers (uuid), license types, license information, authentication backends and more.  Think of this as literally the Ansible Tower settings that you can find in the Web UI ([documentation is here](https://docs.ansible.com/ansible-tower/latest/html/administration/configure_tower_in_tower.html)).  To pretty print this to make it more readable try using the | python -m json.tool, for example:

```
cat config.json | python -m json.tool
```

Here is an example from an Ansible Tower node I have stood up:

```
{
    "ansible_version": "2.9.1",
    "authentication_backends": [
        "awx.sso.backends.TACACSPlusBackend",
        "social_core.backends.azuread.AzureADOAuth2",
        "django.contrib.auth.backends.ModelBackend"
    ],
    "external_logger_enabled": true,
    "external_logger_type": "splunk",
    "free_instances": 0,
    "install_uuid": "d3d497f7-9d07-43ab-b8de-9d5cc9752b7c",
    "instance_uuid": "bed08c6b-19cc-4a49-bc9e-82c33936e91b",
    "license_expiry": 34937373,
    "license_type": "enterprise",
    "logging_aggregators": [
        "awx",
        "activity_stream",
        "job_events",
        "system_tracking"
    ],
    "pendo_tracking": "detailed",
    "platform": {
        "dist": [
            "redhat",
            "7.4",
            "Maipo"
        ],
        "release": "3.10.0-693.el7.x86_64",
        "system": "Linux",
        "type": "traditional"
    },
    "tower_url_base": "https://ansible.rhdemo.io",
    "tower_version": "3.6.0"
}
```

Because of the large size of the data sets I will from here on start linking to [public gists](https://help.github.com/en/github/writing-on-github/creating-gists) that are easier to consume then in-line in this blog.

### 

### counts.json

The counts.json file simply contains the total amount of objects for each relevant category.  For example the total number of organizations, teams, users, inventories, etc. that exist on the Ansible Tower cluster.  The data is really straightforward and I am providing my Ansible Tower data collected in a [public gist for counts.json](https://gist.github.com/IPvSean/9e7e9e7b597ff1dff63f0736901a5735).

### cred\_type\_counts.json

The file cred\_type\_counts.json provides information breakdowns on each [credential type](https://docs.ansible.com/ansible-tower/latest/html/userguide/credentials.html#credential-types) that is configured in Ansible Tower, including [custom credential types](https://docs.ansible.com/ansible-tower/latest/html/userguide/credential_types.html).  This simply records data on how many are configured, and if they are configured by Ansible Tower or an external source such as CyberArk.  To check out what this looks like and see all the data collected refer to my [public gist for cred\_type\_counts.json](https://gist.github.com/IPvSean/02ac74da4346a6eac9d366f981909bed).

### events\_table.csv

This table provides task by task detail from Job Templates such as the the playbook filename, the role that the tasks resides in, the named description in the task (if any is specified) and more.  This is a CSV versus a JSON because it is literally a table copy of the main\_jobevent table within Ansible Tower (which is already a table). These are any job events that have happened since the last run, in my case since I ran the jobs back to back there is no data in here, since no job events took place.

```
id,created,uuid,parent_uuid,event,task_action,failed,changed,playbook,play,task,role,job_id,host_id,host_name
```

I created a full example where I ran a Job Template from my Ansible Tower cluster and recorded a awx gather\_analytics immediatley after, this can be found [on this gist](https://gist.github.com/IPvSean/e7edb73f21a7eb6d9be058964b6bf9bb) to see what type of data is provided.

### instance\_info.json

The instance\_info.json info provided breakouts per instance versus the holistic Ansible Tower cluster. This allows granular differences between different nodes within an Ansible Tower cluster. This is helpful because if there was a bad install, decreased capacity or unreachable node we can grab additional info.  In this case capacity is a value we calculate on how much memory and cpu is available to that node, and how much the administer has weighted the usage of that capacity, more info can be [found in the documentation](https://docs.ansible.com/ansible-tower/latest/html/userguide/jobs.html#selecting-the-right-capacity).  The capacity value is used to determine how many forks can be allocated to run on that Ansible Tower Instance.  In my case I only have a single node in my Ansible Tower cluster so there is only one uuid in my info:

```
{
    "bed08c6b-19cc-4a49-bc9e-82c33936e91b": {
        "capacity": 57,
        "cpu": 2,
        "enabled": true,
        "last_isolated_check": "2018-08-15T14:48:58.553005+00:00",
        "managed_by_policy": true,
        "memory": 8201400320,
        "uuid": "bed08c6b-19cc-4a49-bc9e-82c33936e91b",
        "version": "3.6.0"
    }
}
```

### inventory\_counts.json

The inventory\_counts.json file provided all known inventories in the Ansible Tower cluster, the amount of hosts associated with each inventory, the [kind of inventory](https://docs.ansible.com/ansible-tower/latest/html/userguide/inventories.html#smart-inventories) and the number of sources (inventories can have more than one source).  I have included my inventory\_counts.json file in this [public gist.](https://gist.github.com/IPvSean/d1a1a54a1d153b0e7f3e8de16f94ad04)

### job\_counts.json

The jobs\_counts.json file provided data around holistic job execution on this Ansible Tower cluster.  This includes total jobs, both successful, cancelled and failed. It will also do breakouts of manual jobs, relaunched jobs.  Refer to my [public gist](https://gist.github.com/IPvSean/64d666f7cfcbd57fabd9ebf35126418c) to see what this data looks like.

### job\_instance\_counts.json

This file provides breakouts of Job Runs by individual instances (also known as nodes) within an Ansible Tower cluster.  My Ansible Tower cluster only has one node so this file is less then interesting but refer to my [public gist](https://gist.github.com/IPvSean/3bbfd0cb86f25e878d320ddd9625d050) to see what this data looks like.

### manifest.json

The manifest.json file keeps track of the data schema for every other file provided.  If a file schema changes on different versions of Ansible Tower this allows cloud.redhat.com to understand each individual schema.  The data schemas may change over time as more and more features are rolled out. Check out [my public gist here](https://gist.github.com/IPvSean/137edc192d5943e1e364d11f9bfbe8c5).

### org\_counts.json

The org\_counts.json file provides information on each [organization](https://docs.ansible.com/ansible-tower/latest/html/userguide/organizations.html) on this Ansible Tower cluster and the amount of users and teams associated with that organization.  Refer to my [public gist](https://gist.github.com/IPvSean/436044e704630846827c1e84348896fb) to see an example.

### projects\_by\_scm\_type.json

The projects\_by\_scm\_type.json provides a breakdown of all [project types](https://docs.ansible.com/ansible-tower/latest/html/userguide/projects.html#projects) including Git, Subversion, Mercurial, and Red Hat Insights.  You can see in my Ansible Tower cluster that I have 19 git projects and 1 Red Hat Insights project:

```
{
    "git": 19,
    "hg": 0,
    "insights": 1,
    "manual": 0,
    "svn": 0
}
```

### 

### query\_info.json

The query\_info.json data simply states the last time the awx-manage gather\_analytics process was run and if it was manual or automatic.

```
{
    "collection_type": "manual",
    "current_time": "2019-11-22 20:10:27.751267+00:00",
    "last_run": "2019-11-22 20:03:40.361225+00:00"
}
```

### 

### unified\_jobs\_table.csv

This file includes information about the job runs (any job template that was executed) including when it was run and if it was successful or failed.  Most of the data is quite clear what it represents, but the polymorphic\_ctype\_id may throw folks. The polymorphic\_ctype\_id is an internal mapping to get that tracks the Job Type such as if the id is a [systemjob](https://docs.ansible.com/ansible-tower/latest/html/administration/management_jobs.html), [workflowjob](https://docs.ansible.com/ansible-tower/latest/html/userguide/workflows.html), job, etc.  This file corresponds to the events\_table.csv, and can also be seen in the [gist provided above](https://gist.github.com/IPvSean/e7edb73f21a7eb6d9be058964b6bf9bb).  The events\_table.csv file gives an entire breakdown of every task within the Job Template versus the unified\_jobs\_table.csv which just catalogs the Job Run, the start time, finish type, etc.

### unified\_job\_template\_table.csv

This file contains information about the Job Templates themselves (versus the Job Runs in the unified\_job\_table.csv file linked above).  This includes the id, polymorphic\_ctype\_id, when it was created, modified, the name of the job template and more. To see an example of this file check out my [public gist here](https://gist.github.com/IPvSean/18f06125f854a0adece060ce35275959).

## Where to go next?

I hope this blog helps outline what type of data is sent to Red Hat to help alleviate any security concerns or data questions.  When I am talking to folks about the Red Hat Ansible Automation Platform I like to explain that they get all the Ansible they know and love today, but we are now bundling everything together in one simple platform for our customers.  The SaaS offering Automation Analytics is optional and included in the price of what folks were paying previously. We do not force any existing customers to use the tool and hand us data, but hope this will provide increased benefits.

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
