---
title: 'What''s new in Ansible Automation Platform 2: automation execution environments'
slug: whats-new-in-ansible-automation-platform-2-automation-execution-environments
authors:
- slug: anshul-behl
  name: Anshul Behl
published: '2021-10-04'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/whats-new-in-ansible-automation-platform-2-automation-execution-environments
description: Ansible Automation Platform 2 introduces “automation execution environments.”
  These are atomic images on which all automation is run.
topics: []
read_time_minutes: 5
synced_at: '2026-09-03T19:20:43Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** Ansible Automation Platform 2 introduces “automation execution environments.” These are atomic images on which all automation is run.

<!-- blog-enrichment:end -->

[![aap 2 gray flying as-1](https://www.redhat.com/rhdc/managed-files/ansible/aap%202%20gray%20flying%20as-1.png)](https://www.redhat.com/rhdc/managed-files/ansible/aap%202%20gray%20flying%20as-1.png)

Red Hat Ansible Automation Platform 2 is now available to customers. This release expands the possibilities of automation across your organization, with a more secure, flexible foundation to build and deploy automation with greater acceleration, orchestration and innovation.

As automation usage/practices/etc. spreads throughout an organization, managing multiple automation environments for different teams and use cases become challenging. This is even more true as automation starts to scale across the IT organization. As automation continues to be part of critical workflows, the following enhancements have been made in Ansible Automation Platform 2:

- Enables the Ansible Automation Platform administrator with the ability to provide and manage automation execution environments (see below) to differing groups, like networking and cloud teams. Each has specific content needs for their roles  instead of addressing different environments as an individual.
- Provide the automation developers with a consistent Ansible environment that’s the same as production, so they can stop worrying about the automation environment and dependencies and focus more on the automation content itself.
- Enable automation teams to define, build and update their automation environments without requiring them to contact the platform administrator for changes to the platform.
- Build and distribute automation execution environments via private automation hub, allowing consistency and usability across teams in an organization.
- Enable third-party developers and partners to create their own automation execution environments for their users and customers using the newly released ansible-builder command line tool.

#### **What are automation execution environments?**

Having consistent, reliable automation is key to a successful automation initiative. One Ansible Automation Platform customer had their internal administration team maintaining over 40 different virtual environments for various teams. Some used different versions of Ansible; network teams required different automation content (and dependencies) for their specific devices, and developers built their own environments for testing.

> [!callout type=tmm label="TMM resource" title="Solution Guides" url="https://ansible-tmm.github.io/solution-guides/" cta="Browse guides"]
> Outcome-focused guides for infrastructure and IT automation challenges.

There were no platform tools to support and maintain these environments other than documentation pointing to the de facto solution of specific python virtual environments. This caused custom environments to proliferate, drift to happen between development and production, and an increase in the cost and complexity of automation. Furthermore, this burden landed on the platform administrator to keep track of while maintaining everything as operational.

Ansible Automation Platform 2 introduces a new construct called automation execution environments. These are atomic images on which all automation is run. Automation execution environments contain the following:

- RHEL UBI 8
- Ansible 2.9 or Ansible Core 2.11
- Python 3.8
- Any Ansible Content Collections
- Collection python or binary dependencies.

This provides a standardized way to define, build and distribute the environments that the automation runs in. In a nutshell, automation execution environments are container images that allow for easier administration of Ansible by the platform administrator.

#### **Role of automation execution environments in Ansible Automation Platform 2.0**

[![](https://www.redhat.com/rhdc/managed-files/ansible/ABU%20Blog%20%7C%20Whats%20new%20in%20Ansible%20Automation%20Platform%202%20automation%20execution%20environments-1.png)](https://www.redhat.com/rhdc/managed-files/ansible/ABU%20Blog%20%7C%20Whats%20new%20in%20Ansible%20Automation%20Platform%202%20automation%20execution%20environments-1.png)

> [!callout type=tmm label="TMM resource" title="Workshops and Labs" url="https://labs.demoredhat.com/" cta="Launch a lab"]
> Launch guided lab environments for Ansible and Red Hat technologies.

*Automation controller 4.0 architecture*

The move to automation execution environments is part of Red Hat’s approach to separate the control plane from execution plane for better scalability for automation developers and administrators. Automation teams require that their automation runs consistently across multiple platforms. All custom dependencies are now defined at the development phase and are no longer defined at the administration/deployment phase. Having the automation execution decoupled from the control plane enables faster development cycles, scalability, reliability and portability across environments. Automation execution environments have enabled Ansible Automation Platform to move to a distributed architecture, so customers can scale automation across their organization.

#### **What is** **ansible-builder****?**

Now that you are aware of automation execution environments, the benefits they offer and the role they play in Ansible Automation Platform 2 release, how do you actually build one?

To enable Ansible content creators and Ansible Automation Platform administrators to take advantage of automation execution environments, ansible-builder was created. It creates these by using the dependency information defined in various Ansible Content Collections, as well as by the user.

[![](https://www.redhat.com/rhdc/managed-files/ansible/ABU%20Blog%20%7C%20Whats%20new%20in%20Ansible%20Automation%20Platform%202%20automation%20execution%20environments.png)](https://www.redhat.com/rhdc/managed-files/ansible/ABU%20Blog%20%7C%20Whats%20new%20in%20Ansible%20Automation%20Platform%202%20automation%20execution%20environments.png)
With the release of Ansible Automation Platform 2, there are a set of prebuilt, supported automation execution environments available on the Red Hat Container Registry. These images can be used in different capacities in your organization’s environment and are provided as part of the Ansible Automation Platform subscription. The supported automation execution environments are hosted in a parent repository called *ansible-automation-platform-20-early-access* on registry.access.redhat.com. The following pre-built environments are now available:

- Minimal (ee-minimal-rhel8) - Contains Ansible-2.11 built on top of [UBI8](https://www.redhat.com/en/blog/introducing-red-hat-universal-base-image) and python-3.8. This image doesn’t contain any Collections. You can use this image as the base image to build additional automation execution environments with your custom collections or the Ansible Certified Content Collections available on the automation hub.
- Supported (ee-supported-rhel8) - This is the default image available with the automation controller. It is built on top of the minimal image and contains [Ansible Content Collections supported by Red Hat](https://access.redhat.com/articles/4993781).
- Ansible 2.9 (ee-29-rhel8) - Contains Ansible-2.9 and all the required Ansible dependencies. This image is best for customers who are planning to migrate to Ansible Automation Platform 2.0 from Ansible Automation Platform 1.2.

The execution environment builder (ansible-builder) is used to build custom automation execution environments by layering on top of the images provided with Ansible Automation Platform 2.

Please check the [upstream blog](https://330046.hubspotpreview-na1.com/blog/introduction-to-ansible-builder) on ansible-builder, and check out [this section](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.0-ea/html-single/ansible_builder_guide/index?lb_target=production#proc-customize-ee-image) of the customer documentation to understand how to build your own automation execution environment on top of the default ones provided by Ansible Automation Platform.

#### **Who will use** **ansible-builder****?**

An automation execution environment is the common artifact between the Ansible content creator and the automation platform administrator. They both should understand how to build them using ansible-builder. Content creators provide the platform administrator with automation execution environments or vice versa, but the common theme to keep in mind here is that the ultimate goal is to graduate the same automation execution environment from the content creator’s development machine to the production environment. The result is no longer managing the multiple python virtual environments in a manual way.

#### **Key takeaways**

The Ansible Automation Platform 2 release includes a myriad of new features that are built to complement the concept of automation execution environments. With the new release, you can do the following:

- Build and distribute automation execution environments via [private automation hub](https://access.redhat.com/articles/6145072), allowing consistency and usability across teams in an organization.
- Enable third-party developers and partners to create their own automation execution environments for their users and customers using the newly released ansible-builder command line tool.

#### **Where to go next**

- If you’re ready to get hands-on, we have [self-paced interactive labs available](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) to explore new Ansible Automation Platform 2 technologies.
- If you are a Red Hat customer, please visit the[Ansible Automation Platform 2 landing page](https://red.ht/AAP-20) in the Red Hat Customer Portal that consolidates all our documentation and guidance available to you.
- [Please reach out to your local Red Hat representative to assist your organization in getting started with Ansible Automation Platform 2.0](https://www.ansible.com/contact-us)

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [The anatomy of automation execution environments](/blog/the-anatomy-of-automation-execution-environments/)
> - [Migrating from Python virtual environments to automation execution environments in Ansible Automation Platform 2](/blog/migrating-from-python-virtual-environments-to-automation-execution-environments-in-ansible-automation-platform-2/)
> - [Introducing the new Red Hat Ansible development tools: Streamlining the Ansible creator experience](/blog/new-red-hat-ansible-development-tools/)

<!-- blog-enrichment:related-end -->
