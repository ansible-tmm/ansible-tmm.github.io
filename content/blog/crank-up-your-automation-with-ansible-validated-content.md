---
title: Crank up your automation with Ansible validated content
slug: crank-up-your-automation-with-ansible-validated-content
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2022-12-12'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/crank-up-your-automation-with-ansible-validated-content
description: Ansible validated content is expert-built automation content packaged
  as Collections that contain Ansible roles and playbooks that you can use “out-the-box”
  through Ansible Automation Platform.
topics: []
read_time_minutes: 3
synced_at: '2026-09-03T19:21:42Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** Ansible validated content is expert-built automation content packaged as Collections that contain Ansible roles and playbooks that you can use “out-the-box” through Ansible Automation Platform.

<!-- blog-enrichment:end -->

[![](https://www.redhat.com/rhdc/managed-files/ansible/L0SaYOYFPRRB8oUzhGJC9V7qE0uBTVzNkDf8IE0efQ2x3M3R6ROcFqPdmrqChWM_4VZ25uifzd1Fjl9eQCWB7rh0QyS83fwOq5bGXxk7VSyZe2JwKm9cfLaZq--ykmuNR9_QBVSB2X7RwdaN2cRPI5QF8QrLKWOT1zkh3epnO5s3Somwm_I383gT6RC6KQ.png)](https://www.redhat.com/rhdc/managed-files/ansible/L0SaYOYFPRRB8oUzhGJC9V7qE0uBTVzNkDf8IE0efQ2x3M3R6ROcFqPdmrqChWM_4VZ25uifzd1Fjl9eQCWB7rh0QyS83fwOq5bGXxk7VSyZe2JwKm9cfLaZq--ykmuNR9_QBVSB2X7RwdaN2cRPI5QF8QrLKWOT1zkh3epnO5s3Somwm_I383gT6RC6KQ.png)

*“Dear Aunt Automation,*

*At Suncavanaugh Corp., we just got this super cool automation platform. It's called Red Hat Ansible Automation Platform. Now, I'm really excited about all this and I have used Ansible before, but I'm worried about getting it working in our environments. How do I even get started with automation that needs to be production ready? What if I need help building what we need? How do I know what I build is good enough for production? This is pretty scary…*

*Love,*

*~ Chagrining in Chapel Hill “*

We can understand these concerns, as this is something that many customers experience when they start their journey into automation. Red Hat Ansible Automation Platform has many tools to assist organizations from savings planner to Red Hat Insights, however, actually getting started still requires you to jump into some YAML and build your first production-ready playbook. You want to start automating, but you don’t know where to start. At AnsibleFest 2022, we announced a new addition to the content ecosystem offered through the platform. Drumroll please...this is Ansible validated content.

Ansible validated content is expert-built automation content packaged as Collections that contain Ansible roles and playbooks that you can use “out-the-box” through Ansible Automation Platform. So, if you are just getting started and you have used tools like savings planner to decide on the use cases you want to focus on, you can grab Ansible validated content and either use the roles or copy what you need to build your automation. This greatly reduces the time needed to get started and also gives you a great reference point instead of reinventing the automation wheel yourself.

> [!callout type=tmm label="TMM resource" title="Solution Guides" url="https://ansible-tmm.github.io/solution-guides/" cta="Browse guides"]
> Outcome-focused guides for infrastructure and IT automation challenges.

## So how can you use Ansible validated content?

In Ansible Automation Platform 2.3, validated content is already pre-loaded into private automation hub.

[![](https://www.redhat.com/rhdc/managed-files/ansible/Gl25mGzPy_vGEZDu0kuBBkGNttvIQFqZK0ICEQnnKS_Tc9Y7K08oQk613mzOCE3BGSZICl9DZXIJlPi6G_CHDjhH0Z8MekBnq9jVcwqAjbweXqd6GKrTgue56kVyPkeEDfU_xqhTRr21ZyOd0yTpNlrC-sqnevsK0_8dsM9bbSH6LzgBsOGso99V-LXSoQ.png)](https://www.redhat.com/rhdc/managed-files/ansible/Gl25mGzPy_vGEZDu0kuBBkGNttvIQFqZK0ICEQnnKS_Tc9Y7K08oQk613mzOCE3BGSZICl9DZXIJlPi6G_CHDjhH0Z8MekBnq9jVcwqAjbweXqd6GKrTgue56kVyPkeEDfU_xqhTRr21ZyOd0yTpNlrC-sqnevsK0_8dsM9bbSH6LzgBsOGso99V-LXSoQ.png)

You select the Collection and grab the latest documentation or installation details with the Galaxy client. For example:

`ansible-galaxy collection install infra.ee_utilities`

(Ansible Galaxy client configuration is needed before using the `ansible-galaxy` cli )

As of the release of Ansible Automation Platform 2.3, we have the following types of content available:

|  |  |
| --- | --- |
| HYBRID CLOUD   - AWS   - Operations     - Setup credentials     - Detach and delete internet gateways     - Configure multi-region CloudTrail     - Creating custom AMIs     - Terminate EC2 instances by tag   - Troubleshooting     - RDS connectivity - Azure   - Lifecycle management     - Load balancers     - Postgres SQL instance     - Network interfaces and stacks     - Resource and security groups     - Virtual machine | SECURITY   - Firewall policy hygiene      NETWORKING   - Network base configuration - Manage BGP network resources - Build, maintain and validate VPN tunnels      NETWORK AT THE EDGE   - Cloud connectivity implementation - Autonomous System Number (ASN) configuration - OSPF management - BGP management - Common network health checks: reachability tests,  interface verification, routing protocols neighbors’ state validation, mac-addresses, VLANs, ARP-tables and bootflash health check, and more. |

Collections available from the Ansible Automation Platform 2.3 release:

|  |  |
| --- | --- |
| Validated Collection | Description |
| network.base | This validated content collection provides a single platform-agnostic entry point to manage all the resources supported for a given network OS. |
| security.firewall\_mgmt | A collection to build, maintain and validate Firewall management and policies across firewall appliances |
| cloud.aws\_troubleshooting | A collection includes a variety of Ansible roles to help troubleshoot AWS Resources. |
| network.vpn | A collection to build, maintain and validate VPN tunnels across cloud providers and network appliances |
| network.bgp | The network.bgp enables users to manage the BGP resources independent of platforms and perform BGP health checks. |
| cloud.aws\_ops | A collection that includes a variety of Ansible roles and playbooks to help automate the management of resources on AWS. |
| infra.osbuild | A collection to build ostree based images for Fedora, Red Hat Enterprise Linux and Centos Stream |
| infra.ah\_configuration | A collection that allows for easy interaction with an Ansible automation hub or Galaxy NG server via Ansible Playbooks. |
| infra.ee\_utilities | A collection that includes a number of roles which can be useful for managing automation execution environments. |
| infra.controller\_configuration | A collection that allows for easy interaction with an AWX or automation controller server via Ansible roles using the AWX/Controller collection modules. |
| infra.aap\_utilities | A collection that includes a number of roles which can be useful for installing and managing AWX or Ansible Automation Platform |

Currently in Ansible Automation Platform 2.3, the validated content is preloaded when you deploy a private automation hub. During the installation process with the bundle, the latest content from the repository for validated content is downloaded and imported into your private automation hub. There are a few options we can utilize in the bundle inventory to change this behavior.

If you want to disable publishing an Ansible validated content to the private automation hub, you can set `automationhub_seed_collections=false`. In addition to this, you can also change what is published to your private automation hub whether it's certified, validated or both sets of content, by setting `automationhub_collection_seed_repository`.

Although the content is currently installed this way through the bundle installer, there are plans to bring Ansible validated content into console.redhat.com. This would allow you to automatically synchronize the latest content from Ansible automation hub on console.redhat.com much as you do with certified content.

> [!callout type=tmm label="Team resource" title="Network automation on the TMM blog" url="/blog/?author=sean-cavanaugh" cta="Browse posts"]
> More posts on network automation from the Ansible Technical Marketing team.

## Additional resources

- Sean’s [Whats new in Ansible Automation Platform 2.3](https://www.ansible.com/blog/whats-new-in-red-hat-ansible-automation-platform-2.3)
- Check out the [Best of AnsibleFest 2022](https://www.ansible.com/blog/best-of-fest-2022)
- Try [Ansible Automation Platform](https://www.redhat.com/en/technologies/management/ansible/try-it) free for 60 days

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [5 ways to augment security risk management in the AI era](/blog/5-ways-augment-security-risk-management-ai-era/)
> - [Navigating AI vulnerability discovery and achieving operational resilience with automation](/blog/navigating-ai-vulnerability-discovery-and-achieving-operational-resilience-automation/)
> - [AI threats move fast. Your defenses should too.](/blog/ai-threats-move-fast-your-defenses-should-too/)

<!-- blog-enrichment:related-end -->
