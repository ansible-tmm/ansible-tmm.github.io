---
title: Automating your CentOS Linux to RHEL migration
slug: automating-your-centos-linux-rhel-migration
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2024-06-26'
updated: '2026-04-23'
source: redhat
source_url: https://www.redhat.com/en/blog/automating-your-centos-linux-rhel-migration
description: CentOS Linux EOL is edging  closer and Ansible Automation Platform is
  just the tool to help you upgrade with speed, consistency and scale.
topics:
- Linux
read_time_minutes: 6
synced_at: '2026-09-03T19:21:37Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** CentOS Linux EOL is edging  closer and Ansible Automation Platform is just the tool to help you upgrade with speed, consistency and scale.

<!-- blog-enrichment:end -->

The end of life (EOL) for CentOS Linux 7 is approaching, with updates ending on **June 30, 2024**. This impending deadline signifies the end of security updates and maintenance, posing significant risks for organizations that continue to rely on the outdated operating system. Upgrading to a more current and supported platform, such as [Red Hat Enterprise Linux](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux) (RHEL), is needed to maintain an up-to-date security posture and  continued functionality.

Migrating these systems, which may play a critical role in your organization’s IT infrastructure, is not trivial. [Red Hat Ansible Automation Platform](https://www.redhat.com/en/technologies/management/ansible) can help streamline and automate this process, however, reducing the complexity, while enabling scalability and the ability to orchestrate changes to the surrounding infrastructure to support the migration.

In this article I explore what is possible when using Ansible Automation Platform to drive this migration at scale across your organization and the steps needed to achieve this.

[![Centos Linux Migration to RHEL Workflow](https://www.redhat.com/rhdc/managed-files/migrating-centos-rhel-img1.png)](https://www.redhat.com/rhdc/managed-files/migrating-centos-rhel-img1.png)

### Migrating from CentOS Linux to RHEL

Sure, logging into a CentOS Linux system and starting the [Convert2RHEL](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux/migration-process/convert2rhel) command line process is pretty easy. But what about doing this with multiple systems? What about all the infrastructure dependencies that might be in place?

Using Ansible Automation Platform for this process helps you address scale and dependencies while allowing you to build a logical workflow for your migration. What's more powerful than converting at scale? Remediations at scale! We can automate the remediation of all those blockers.

We often refer to Ansible Automation Platform as simple and powerful, but its true superpower is covering multiple domains and use cases. We can automate the migration process, but we can also use the multidomain aspect to address infrastructure and platform dependencies.

[![Overview of Red Hat Ansible Automation Platform integrations](https://www.redhat.com/rhdc/managed-files/migrating-centos-rhel-img2.png)](https://www.redhat.com/rhdc/managed-files/migrating-centos-rhel-img2.png)

Let's look at a typical example of a system in use that we now want to migrate to RHEL. I have a set of application servers hosting my streaming application. These systems do not operate in isolation — there could be firewalls, load balancing and even connectivity to databases involved. There could also be other pre-work needed. I might need to:

- Update dependent systems
- Back up the data or snapshot the system
- Remove systems from notifications in our monitoring solution
- Open a service ticket in our ITSM before we even get started

With operational knowledge of everything we need to do, we can build our Ansible Playbooks and standardize the process for consistency. Using Ansible Automation Platform gives us the ultimate “ops-life” hack by providing Red Hat [Ansible Lightspeed](https://www.redhat.com/en/technologies/management/ansible/ansible-lightspeed), our generative AI for playbook creation. We can take our knowledge and let Ansible Lightspeed help us build our playbooks faster while following best practices.

Once we have our content created, we can then use the automation controller to build out an automation workflow and map out the process logically before we proceed with automating the actual [Convert2RHEL](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux/migration-process/convert2rhel) process.

[![CentOS Linux Upgrade Workflow](https://www.redhat.com/rhdc/managed-files/migrating-centos-rhel-img3.png)](https://www.redhat.com/rhdc/managed-files/migrating-centos-rhel-img3.png)

Before we move on, I want to point out a crucial component of this workflow: The ability to automate snapshots of the systems. This is important for both the CentOS Linux migration to RHEL and the automated upgrade of RHEL. I will show you an example from our Ansible validated content for [infra.lvm\_snapshots](https://console.redhat.com/ansible/automation-hub/repo/validated/infra/lvm_snapshots/)when we discuss the RHEL upgrade.

Now, what about the actual process of converting our systems? With our Ansible Automation Platform subscription, we have access to [Ansible validated content](https://www.redhat.com/en/technologies/management/ansible/content-collections) which provides expert, opinionated automation content all sitting in [Ansible automation hub](https://www.redhat.com/en/technologies/management/ansible/automation-hub) on [console.redhat.com](http://console.redhat.com).

[![Ansible Automation Platform content collections](https://www.redhat.com/rhdc/managed-files/migrating-centos-rhel-img4.png)](https://www.redhat.com/rhdc/managed-files/migrating-centos-rhel-img4.png)

We will use the [infra.convert2rhel](https://console.redhat.com/ansible/automation-hub/repo/validated/infra/convert2rhel/) collection to get started. This collection provides roles that we can use to perform the conversion using the [Convert2RHEL](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux/migration-process/convert2rhel) framework. Using the sample playbook provided in the Ansible validated content, I can simply add this to my workflow and have it start the migration once the pre-work tasks have been completed.

```
---
- name: Convert CentOS Linux to RHEL
hosts: centos
strategy: free
become: true
force_handlers: true
vars:
  rhsm_username: "{{ rhsm_username }}"
  rhsm_password: "{{ rhsm_password }}"
  rhsm_org: "{{ rhsm_org }}"
  rhsm_activation_key: "{{ rhsm_activation_key }}"
tasks:
  - name: Perform OS conversion
    ansible.builtin.import_role:
      name: infra.convert2rhel.convert
```

If you look at the sample playbook, it's important to note the use of a strategy. If you are not familiar with this, this enables us to control [how tasks are executed across](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_strategies.html) the hosts. In our example, we use strategy: free -  which allows tasks to be executed as soon as possible without waiting for other hosts, and it runs each host independently. This is ideal for upgrading multiple machines at scale.

As soon as we migrate our systems, we can utilize Ansible Automation Platform to automate testing and check ports and configurations as the last step in your migration to RHEL workflow.

### “RHEL-come” to Enterprise Linux!

Once our CentOS Linux systems have been migrated, we will now be on RHEL 7.  It is recommended to then upgrade to RHEL 8 with a similar process—we use the LEAPP upgrading tool framework to assist us. Red Hat also offers an Extended Life Cycle Support (ELS) add-on subscription for RHEL 7 systems, for more information, refer to [Announcing up to 4 years of Extended Life Cycle Support (ELS) for Red Hat Enterprise Linux 7](https://www.redhat.com/en/blog/announcing-4-years-extended-life-cycle-support-els-red-hat-enterprise-linux-7).

Just like Convert2RHEL, Red Hat provides the Ansible validated content for [infra.leapp](https://console.redhat.com/ansible/automation-hub/repo/validated/infra/leapp/). The [infra.leapp](https://console.redhat.com/ansible/automation-hub/repo/validated/infra/leapp/)content contains roles that assist our pre-upgrade steps, like generating the pre-upgrade report, remediating roles for common issues/inhibitors and upgrading our systems.

When we upgrade between major versions of RHEL, we typically use LEAPP to assess the systems and create a pre-upgrade report. LEAPP will collect data and provide a report on potential issues/inhibitors with possible suggestions to resolve them.  While we can use the Ansible Role to remediate common issues found by LEAPP, however, third party dependencies or perhaps some configuration changes might need to be resolved separately.

#### Step 1: Assessing your systems

We can turn to Ansible Automation Platform again to streamline the remediation process of our systems by taking the issues in the report, building a remediation playbook and applying the changes at scale to the systems we want to upgrade. Furthermore, we can utilize [Ansible  Lightspeed](https://www.redhat.com/en/technologies/management/ansible/ansible-lightspeed) to generate some of the remediation if we are unsure about the tasks needed.

Example: Our systems had an inhibitor for root remote login and we used Ansible Lightspeed to build the remediation for that:

[![Ansible Lightspeed screenshot](https://www.redhat.com/rhdc/managed-files/migrating-centos-rhel-img5.png)](https://www.redhat.com/rhdc/managed-files/migrating-centos-rhel-img5.png)

#### Step 2: Trigger the upgrade:

We can deploy our playbooks with a workflow at scale, even around the globe, with the use of technologies like [automation mesh](https://www.redhat.com/en/technologies/management/ansible/automation-mesh), which is part of the Ansible Automation Platform.

Using our Ansible validated content, we can create snapshots of our LVM’s so we can revert back should something fail during the next upgrade step.

```
---
- name: Create/revert/remove/check LVM snapshots of node
hosts: "{{ rhel_inventory_group | default(omit) }}"
become: yes
environment:
  LANG: en_US.UTF-8
  LC_ALL: en_US.UTF-8
  TERM: linux
tasks:
  - ansible.builtin.set_fact:
      snapshot_create_set_name: "{{ snapshot_set_name }}"
      snapshot_remove_set_name: "{{ snapshot_set_name }}"
      snapshot_revert_set_name: "{{ snapshot_set_name }}"
  - name: "Execute snapshot check"
    ansible.builtin.include_role:
      name: "infra.lvm_snapshots.snapshot_create"
    vars:
      snapshot_create_check_only: true
      # Additional snapshot_* vars provided via AAP2 job template and associated surveys
    when: lvm_snapshots_action == "check"
  - name: "Execute snapshot {{ lvm_snapshots_action }}"
    ansible.builtin.include_role:
      name: "infra.lvm_snapshots.snapshot_{{ lvm_snapshots_action }}"
      # Additional snapshot_* vars provided via AAP2 job template and associated surveys
    when: (lvm_snapshots_action == "create") or (lvm_snapshots_action == "remove") or (lvm_snapshots_action == "revert")
```

Once we have our snapshots, we can upgrade our RHEL system using content from our Ansible collections.

```
---
- name: Upgrade
hosts: "{{ rhel_inventory_group | default(omit) }}"
strategy: free
become: true
force_handlers: true
# vars:
#   ansible_python_interpreter: /usr/libexec/platform-python
tasks:
  - name: Perform OS upgrade
    ansible.builtin.import_role:
      name: infra.leapp.upgrade
...
```

As soon as a system has been upgraded, we can use Ansible Automation Platform to check the state of the system. If everything is good, we can also use automation to bring the systems back into production.

#### Step 3: Post-upgrade add-ons

Our upgrades are done, but we can still do more with Ansible Automation Platform. Post-upgrade configuration and integration can take place as part of our automation workflows, streamlining all the additional tasks we often forget about when upgrading systems. Ansible Automation Platform allows you to integrate your new RHEL system into [Red Hat Insights](https://www.redhat.com/en/technologies/management/insights), simplifying compliance checks and enforcement. We can also configure [Performance Co-Pilot](https://www.redhat.com/en/blog/automate-performance-management-performance-co-pilot) to report system metrics to [Event-Driven Ansible](https://www.redhat.com/en/technologies/management/ansible/event-driven-ansible) and just about every other Day 2 task you could think of!

[Automation analytics](https://console.redhat.com/ansible/ansible-dashboard)can help provide clarity on the automated process or help us identify possible anomalies in the hosts during the process, which we can then address later.

> [!callout type=tmm label="TMM resource" title="Getting started with Event-Driven Ansible" url="/blog/getting-started-with-event-driven-ansible/" cta="Read the guide"]
> Step-by-step guide from the Ansible TMM team.

## Learn more

- This exercise is from a workshop provided by Red Hat - [Check out the code](https://github.com/redhat-partner-tech/leapp-project)
- Try [Ansible Automation Platform](https://www.redhat.com/en/technologies/management/ansible/try-it) free for 60 days
- Learn how to automate on the platform with our [self-paced labs](https://www.redhat.com/en/interactive-labs/ansible)
- Check out the action on our [YouTube Channel](https://www.youtube.com/@AnsibleAutomation)

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [5 ways to augment security risk management in the AI era](/blog/5-ways-augment-security-risk-management-ai-era/)
> - [Navigating AI vulnerability discovery and achieving operational resilience with automation](/blog/navigating-ai-vulnerability-discovery-and-achieving-operational-resilience-automation/)
> - [AI threats move fast. Your defenses should too.](/blog/ai-threats-move-fast-your-defenses-should-too/)

<!-- blog-enrichment:related-end -->
