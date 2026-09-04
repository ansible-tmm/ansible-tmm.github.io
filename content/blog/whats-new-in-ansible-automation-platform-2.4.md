---
title: What's new in Ansible Automation Platform 2.4
slug: whats-new-in-ansible-automation-platform-2.4
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2023-06-27'
updated: '2025-11-26'
source: redhat
source_url: https://www.redhat.com/en/blog/whats-new-in-ansible-automation-platform-2.4
description: An overview of new features found in the Ansible Automation Platform
  2.4 release
topics: []
read_time_minutes: 7
synced_at: '2026-09-03T19:20:54Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** An overview of new features found in the Ansible Automation Platform 2.4 release

> [!toc]
> **On this page**
>
> - [Event-Driven Ansible](#event-driven-ansible)
> - [Collection repository management](#collection-repository-management)
> - [Validated content integration](#validated-content-integration)
> - [Ansible Builder 3.0](#ansible-builder-30)
> - [Platform install support for ARM](#platform-install-support-for-arm)
> - [Platform install support for Linux on Power and Z are in Technology Preview support](#platform-install-support-for-linux-on-power-and-z-are-in-technology-preview-support)
> - [Updated user interface in Technology Preview support](#updated-user-interface-in-technology-preview-support)
> - [The Ansible Lightspeed with IBM Watson Code Assistant Technical Preview is now available](#the-ansible-lightspeed-with-ibm-watson-code-assistant-technical-preview-is-now-available)
> - [Wrap-up, next steps and resources](#wrap-up-next-steps-and-resources)

<!-- blog-enrichment:end -->

[![2.4 banner](https://www.redhat.com/rhdc/managed-files/ansible/2.4%20banner.png)](https://www.redhat.com/rhdc/managed-files/ansible/2.4%20banner.png)

We are excited to announce the general availability of Red Hat Ansible Automation Platform 2.4, which continues to build on our core promise to help customers “Create, Manage, and Scale” their automation.

This blog post outlines a number of new features and capabilities found in the 2.4 release, including the long-anticipated general availability of [Event-Driven Ansible](https://www.redhat.com/en/about/press-releases/red-hat-accelerates-it-automation-event-driven-ansible). Ansible Automation Platform 2.4 is going to greatly expand the scope of both *what* and *how* organizations are able to automate with Ansible—so let’s dive right in.

## Event-Driven Ansible

Back at [AnsibleFest 2022, we introduced](https://www.redhat.com/blog/introducing-event-driven-ansible) the Event-Driven Ansible developer preview and the results have been very exciting. By developing this set of capabilities in the upstream community, we worked alongside the Ansible community, partners and customers to release numerous certified and community source plugins right at launch. Now fully supported as a component of Ansible Automation Platform 2.4, Event-Driven Ansible comes with a new webUI, Event-Driven Ansible controller, to help you integrate your Event-Driven Ansible with Ansible Automation Platform and take advantage of a host of new capabilities.

[![](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-15-3156-PM.4.png)](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-15-3156-PM.4.png)

Event-Driven Ansible controller for Event-Driven Ansible - Getting Started

Event-Driven Ansible connects intelligent sources of events with corresponding actions via rules. Ansible Rulebooks define the event source and explain, in the form of conditional “if-this-then-that” statements, the action to take when the event occurs. Based on the rulebook you design, Event-Driven Ansible recognizes the specified event, matches it with the appropriate action, and automatically executes it. Actions can include executing existing Ansible Playbooks, templates, or modules to extend value from your trusted automation—as a user you have the option to decide.

As part of the Ansible Automation Platform 2.4 release, the following integrations are now fully supported:

|  |
| --- |
| **In each Partner's collections** |
| IBM Instana |
| Palo Alto Networks PAN-OS |
| Red Hat Insights |
| Turbonomic |
| Zabbix |
| *Cisco ThousandEyes* *(expected Q3 2023)* |
| *CrowdStrike* *(expected Q3 2023)* |
| *Dynatrace* *(expected Q3 2023)* |
| *F5* *(expected Q3 2023)* |
| *ServiceNow* *(expected Q3 2023)* |

|  |
| --- |
| **In the** [**ansible.eda**](https://github.com/ansible/event-driven-ansible/tree/main/extensions/eda/plugins/event_source)**Collection** |
| Alertmanager |
| Amazon AWS SQS Queue |
| Amazon AWS Cloudtrail |
| Azure Service Bus |
| Kafka (AMQ Streams) |
| Kubernetes (Openshift) |
| Prometheus/AlertManager |
| Webhooks |
| …and many more |

NOTE: Ansible partner Event-Driven Ansible source plugins can be certified asynchronously from release dates. A tracking page with a curated, up-to-date list of all Event-Driven Ansible content that has been certified will be made available soon.

### Next steps with Event-Driven Ansible If you’re ready to get started, we encourage you to visit the[Event-Driven Ansible](https://www.redhat.com/en/technologies/management/ansible/event-driven-ansible) [page](https://www.redhat.com/en/technologies/management/ansible/event-driven-ansible) for more information, including links to helpful resources, blogs, videos and more. There are also some great demo videos available on the Red Hat Ansible Automation Platform YouTube channel. Check ‘em out!

- [Bridging observability and automation with Event-Driven Ansible](https://www.youtube.com/watch?v=7i_EzHyrKQc&t=3s)
- [Demo: Using Event-Driven Ansible with Elasticsearch logs!](https://www.youtube.com/watch?v=emHLD4_YcLw&t=5s)
- [Demo: Respond to DNS events with Event-Driven Ansible!](https://www.youtube.com/watch?v=RBKKgawZiqI&t=1s)

> [!callout type=tmm label="TMM resource" title="Getting started with Event-Driven Ansible" url="/blog/getting-started-with-event-driven-ansible/" cta="Read the guide"]
> Step-by-step guide from the Ansible TMM team.

## Collection repository management

The goal of the private automation hub in Ansible Automation Platform is to help organizations better control and manage their automation content (and by automation content, we specifically mean [Ansible Content Collections](https://www.ansible.com/products/content-collections) and [Automation execution environments](https://docs.ansible.com/automation-controller/latest/html/userguide/execution_environments.html)). Whether you are producing private content, need to access trusted and fully supported content, or want to integrate community content, the private automation hub can allow an on-premises solution to help manage what teams get access to what content.

[![](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-15-1543-PM.4.png)](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-15-1543-PM.4.png)

The new collection repository management feature found in Ansible Automation Platform 2.4 provides customers and partners much more control over *who* gets access to *what* automation content. Prior to this feature, platform users were only able to access the built-in repositories of content for Ansible Content Collections. This meant that everyone within an organization had access to these built-in repositories such as rh-certified content or community content, but there was no ability for more repositories to subdivide who had access to what.

[![](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-14-3871-PM.4.png)](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-14-3871-PM.4.png)

Repositories view in private automation hub

This new capability will make it much easier for customers and partners to securely distribute the automation content to the correct teams, which in turn will help them get even more value out of Ansible Automation Platform. Click [here](https://www.redhat.com/products/automation-hub) for more info about Ansible automation hub and private automation hub. 

> [!callout type=tmm label="TMM resource" title="Solution Guides" url="https://ansible-tmm.github.io/solution-guides/" cta="Browse guides"]
> Outcome-focused guides for infrastructure and IT automation challenges.

## Validated content integration

At AnsibleFest 2022, we introduced Ansible [validated content](https://www.redhat.com/en/blog/automate-expert-ansible-validated-content). Ansible validated content is a new set of collections containing pre-built YAML content to address the most common automation use cases. You can use Ansible validated content out-of-the-box or as a learning opportunity to develop your skills. It's a trusted starting point to bootstrap your automation: use it, customize it and learn from it.

With Ansible Automation Platform 2.4, even more Ansible validated content is now fully integrated into private automation hub. This includes the following new collections:

|  |  |  |
| --- | --- | --- |
| **Collection Name** | **Domain** | **Description** |
| cloud.azure\_ops | Cloud | Automate the management of cloud resources on Microsoft Azure. |
| network.interfaces | Network | Manage Interfaces resources independent of platforms and perform interfaces health checks. |
| network.ospf | Network | Manage Telemetry configuration on networking devices and setup a Telegraf - Kafka stack. |

In addition, all Ansible validated content will also be available on [Ansible automation hub on console.redhat.com](https://console.redhat.com/ansible/automation-hub/). This means that content can be asynchronously updated at any time, and not dependent on downloading a new bundled installer to refresh content on private automation hub as it has been previously. For a full list of all Ansible validated content, you can reference this [curated list](https://github.com/ansible/validated-content-discussion/blob/main/validated-content-list.md).

## Ansible Builder 3.0

The 2.4 release also includes [ansible-builder](https://ansible.readthedocs.io/projects/builder/en/latest/) 3.0, a content tooling upgrade that will make the execution environment (EE) creation process much more efficient. First, Containerfile hacking is not required for common and advanced scenarios, and the execution environment definition provides broad customization options. Secondly, single file definition now allows for the inclusion of collections and related package requirements inline. Next, the Builder Image concept is dead, which means no more confusion around what version of builder image should go with the base image. And finally, teams now have the ability to create a base EE from scratch for development purposes.

As execution environments continue to become an increasingly important part of the Ansible Automation Platform experience, we will continue to make upgrades like these to reduce complexity and boost efficiency.

[![](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-14-8467-PM.4.png)](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-14-8467-PM.4.png)

ansible-builder v3 definition file

## Platform install support for ARM

Ansible has always been a popular choice for a variety of data center and [edge environments](https://www.redhat.com/en/technologies/management/ansible/edge), and that adoption curve has continued to expand thanks to the inclusion of [automation mesh](https://www.redhat.com/products/automation-mesh) in Ansible Automation Platform. Automation mesh enables customers to install execution nodes at remote sites including small data centers, Point of Presence (PoPs), retail locations, cruise ships and more.

[![](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-14-6415-PM.4.png)](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-14-6415-PM.4.png)

We are excited to announce that as part of the Ansible Automation Platform 2.4 release, all platform components are now fully supported on ARM architectures. This means wherever you are installing Ansible Automation Platform, or even just adding execution nodes for automation mesh, you can have fully supported Ansible on the infrastructure of your choice.

---

The Ansible Automation Platform 2.4 release also brings [technology previews](https://access.redhat.com/support/offerings/techpreview) of some exciting platform enhancements on our product roadmap.

## Platform install support for Linux on Power and Z are in Technology Preview support

In addition to the aforementioned ARM support, we are announcing technology preview support for installing Ansible Automating Platform on [IBM Power](https://www.ibm.com/power) and [IBM Z](https://www.ibm.com/z?utm_content=SRCWW&p1=Search&p4=43700051923373773&p5=e&gclid=EAIaIQobChMI0rvOpZLI_wIVk6zICh0CyQNrEAAYASAAEgJvivD_BwE&gclsrc=aw.ds) server hardware. This adds to the depth and breadth of CPU architecturesAnsible Automation Platform is installed on and continues to help in a variety of different deployment models across the diverse IT infrastructure our customers have deployed.

## Updated user interface in Technology Preview support

The technology preview support of an updated graphical user interface is a glimpse into our vision for empowering customers to manage and scale all of these features into one simple user flow. The long-term goal is a unified user experience across the various platform components including automation controller, private automation hub and Event-Driven Ansible controller. For this initial release, the updated user interface is enabled just for automation controller, but this will expand over time into other platform components.

[![](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-13-9929-PM.4.png)](https://www.redhat.com/rhdc/managed-files/ansible/WIP%20Blog%20Whats%20new%20in%20Ansible%20Automation%20Platform%202-Jun-26-2023-09-13-13-9929-PM.4.png)

Automation controller dashboard shown in dark mode.

The updated user interface includes many new capabilities including support for dark mode (shown above), which will default to match your operating system defaults, but can be pinned to your preference. The webUI is much more responsive, customizable and easy to use, but the reason this is in technical preview is so that we can get feedback from our customers and improve it further. Not all capabilities from the previous webUI have been matched, but these will improve over time.

To learn how to enable the new user interface on Ansible Automation Platform 2.4 check out this quick four minute [video demonstration](https://youtu.be/IBtGCQBkM0A).

## The Ansible Lightspeed with IBM Watson Code Assistant Technical Preview is now available

One final (and exciting) bit of news as we wrap this blog up. First [announced last month at Red Hat Summit and AnsibleFest 2023](https://www.redhat.com/en/about/press-releases/red-hat-introduces-ansible-lightspeed-ai-driven-it-automation), the Technical Preview of Ansible Lightspeed with IBM Watson Code Assistant is now available.

|  |
| --- |
| Ansible Lightspeed with IBM Watson Code Assistant is **NOT** a part of Ansible Automation Platform at this time. It is a technical preview, and support policy is shown in the following [knowledge base article](https://access.redhat.com/support/offerings/techpreview). |

If you missed the news, Ansible Lightspeed with IBM Watson Code Assistant is a new generative AI service focused on enhancing the Ansible Playbook creation experience. Interested? Head to [redhat.com/ansible-lightspeed](http://www.redhat.com/ansible-lightspeed) for more information. You can also [check out this blog](https://www.redhat.com/blog/now-in-technology-preview-ansible-lightspeed-with-ibm-watson-code-assistant?hs_preview=VRkefZIl-119908369436) for an in-depth look at what to expect and how to get connected.

## Wrap-up, next steps and resources

Ansible Automation Platform 2.4 is built to be trusted, flexible, and easy to use - while offering customers more. If you’re already an Ansible Automation Platform customer, the first thing you should do is hit the [Customer Portal](https://access.redhat.com/) to download the 2.4 release,[check out the release notes](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.4/html/red_hat_ansible_automation_platform_release_notes/index), and start exploring.

- You can also check out this [video](https://youtu.be/kiGofmvawOg), which covers a lot of the material in this blog, but also includes demos of everything so you can see it all in action. It also features a great walk through of Event-Driven Ansible by Colin McNaughton.

**Event-Driven Ansible** is all about doing more with automation and getting more value from existing technology investments. There are a ton of great resources available for anyone looking to get their event-driven journey started.

- Blog: [Event-Driven Ansible is here](https://www.redhat.com/blog/event-driven-ansible-is-here)
- Blog: [Event-Driven Ansible: Driving Innovations at the Edge](https://www.redhat.com/blog/event-driven-ansible-driving-innovations-at-the-edge)
- New hands-on, on-demand lab: [Getting started with event-driven automation](https://www.redhat.com/en/engage/event-driven-ansible-20220907)
- Webinar: [Work smarter using event-driven automation across IT operations](https://www.redhat.com/resources/webinars-training/work-smarter-using-event-driven-automation-across-it-operation)
- Checklist: [5 ways event-driven automation can help you achieve more](https://www.redhat.com/en/resources/5-ways-event-driven-automation-checklist)
- Checklist: [5 reasons to include event-driven automation in your IT strategy](https://www.redhat.com/rhdc/managed-files/ma-5-reasons-for-event-driven-automation-checklist-330650-202305-en.pdf)

**Collection repository management** will provide customers with the ability to grow their automation practices with more trust and more control.

**Ansible validated content** is a great resource for customers to get more done, more quickly. If you haven’t been taking advantage of Ansible validated content, it’s time to change that!

- Blog: [Automate like an expert with Ansible validated content](https://www.redhat.com/en/blog/automate-expert-ansible-validated-content#:~:text=What%20does%20%E2%80%9Cvalidated%E2%80%9D%20mean%3F,on%20successfully%20deployed%20customer%20examples)
- Datasheet: Start automating in less time with Ansible validated content

**Ansible Builder v3** will help developers create execution environments more efficiently.

And **platform support on an expanded set of CPU architectures** will ensure more flexibility - and more possibilities.

That’s all for now. Thanks for reading and stay tuned for additional blogs going deeper on some of the new features outlined here today. And as always - happy automating.

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Learn why Red Hat customer MAPFRE chose Red Hat Ansible Automation Platform](/blog/learn-why-red-hat-customer-mapfre-chose-red-hat-ansible-automation-platform/)
> - [Using Ansible and Packer, From Provisioning to Orchestration](/blog/ansible-and-packer-why-they-are-better-together/)
> - [Ansible Tips and Tricks, Dealing with Unreliable Connections and Services](/blog/ansible-tips-and-tricks-dealing-with-unreliable-connections-and-services/)

<!-- blog-enrichment:related-end -->
