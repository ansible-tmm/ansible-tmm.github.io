---
title: 'Introducing the new Red Hat Ansible development tools: Streamlining the Ansible
  creator experience'
slug: new-red-hat-ansible-development-tools
authors:
- slug: anshul-behl
  name: Anshul Behl
published: '2024-10-03'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/new-red-hat-ansible-development-tools
description: In this post, we’ll dive into the key features of this new release, explore
  the benefits of the accompanying Ansible development container, and discuss how
  this update lays the foundation for a broader Ansible developer experience.
topics: []
read_time_minutes: 5
synced_at: '2026-09-03T19:20:35Z'
---

- [Back to all posts](/blog/)

---

As automation becomes increasingly essential for modern enterprises, the experience of creating and scaling automation is more important than ever. A smooth, efficient automation creation process helps organizations realize the full value of [Red Hat Ansible Automation Platform](https://www.redhat.com/en/technologies/management/ansible) faster, leading to better return on investment. The latest release of Ansible development tools addresses this by consolidating core Ansible tools into a single package, reducing tool sprawl, and embedding best practices into the automation creation experience. Whether you’re a seasoned Ansible user or just starting out, this release simplifies setup, improves consistency, and lays the groundwork for deeper integrations into the Ansible ecosystem.

In this post, we’ll dive into the key features of this new release, explore the benefits of the accompanying Ansible development container, and discuss how this update lays the foundation for a broader Ansible developer experience.

## What’s new in Ansible development tools

In this section, we’ll dive into the new [Ansible development tools](https://www.redhat.com/en/technologies/management/ansible/development-tools) package, which is designed to streamline the development and testing process for Ansible content. This curated package includes a comprehensive suite of enterprise-grade  automation development capabilities to simplify Ansible content creation, reduce complexity, and bring consistency to your automation projects. By consolidating these capabilities into a single, supported package within Ansible Automation Platform , it enables seamless updates and maintenance, while eliminating the need to juggle individual installations from upstream and downstream sources.

### Included Capabilities

- **ansible-builder:** Execution environment builder automates the process of building execution environments using the schemas and tooling defined in various Ansible Collections and by the user.
- **ansible-core:** Ansible Core is a powerful, agentless automation engine that simplifies IT processes like deployment, configuration, and cloud management using a human-readable YAML syntax, supporting a wide range of modules for scalable automation. It integrates with Ansible Automation Platform to provide enterprise-level orchestration, automation, and analytics capabilities.
- **ansible-creator\*:** The fastest way to scaffold your Ansible Playbook or collection projects with Ansible recommended practices.
- **ansible-dev-environment\*:** A utility for building and managing a virtual environment for Ansible content development.
- **ansible-lint:** A utility to identify and correct stylistic errors and anti-patterns in Ansible Playbooks and roles.
- **ansible-navigator:** A text-based user interface (TUI) for developing and troubleshooting Ansible content with execution environments.
- **ansible-sign:** A utility for signing and verifying Ansible content.
- **Molecule:** a functional test runner for Ansible Collections, playbooks and roles.
- **pytest-ansible\*:** A pytest testing framework extension that provides additional functionality for testing Ansible modules and plugin Python code.
- **tox-ansible\*:** An extension to the tox testing utility that provides additional functionality to check Ansible modules and plugin Python code under different Python interpreters and Ansible core versions.

\* Net new tools available to help improve the Ansible creator experience.

### Why it matters

This package simplifies the management of Ansible development capabilities by bundling them into a single, supported package within the **Ansible Automation Platform**. Instead of dealing with separate packages, versions, and dependencies, all tools are now updated and maintained consistently. This not only saves time and reduces complexity but also verifies that all components are aligned and supported within Ansible Automation Platform, making it easier to build and scale automation across your enterprise.

## Introducing the Ansible development container

Alongside the Ansible development tools package, a new **Ansible development container** is now available, offering a powerful, consistent environment for Ansible development. One of the key advantages of this container is its support for non-RHEL users, including those on Windows systems, making it accessible to a broader audience. This container is designed to integrate smoothly with modern development workflows and has a number of significant advantages.

### Key benefits of the development container

#### Easy setup with dev container support in VS Code

For many developers, setting up a consistent development environment can be a time-consuming process. The new Ansible development container offers **native support for Dev Containers in VS Code**. Combined with the **Ansible extension** for VS Code, this allows you to quickly spin up an Ansible development environment with all the required tooling pre-installed. With just a few clicks, you’re ready to start automating.

This greatly simplifies the onboarding process for new team members and minimizes the time spent configuring local development environments. Everything you need for Ansible development is bundled into the container, ensuring you can focus on writing automation, not assembling environments.

#### An alternative for RPM users

Traditionally, customers relying on Ansible tooling RPMs had to install and maintain these tools individually on their systems. The new container offers a modern, flexible alternative by providing a **containerized environment** that contains all necessary Ansible tooling, freeing users from system-level dependencies and providing them a standardized cross platform development environment.

This is particularly beneficial for customers looking for a simplified approach to managing their Ansible development workflows, or for customers working in environments where installing RPMs may not be the most efficient solution.

#### Support for users on Windows and macOS

One of the most significant updates with the new Ansible development container is that it now offers official support for **users who aren’t on Red Hat Enterprise Linux (RHEL).** This includes users on **Windows** (Podman or Docker with WSL) and **macOS**, as well as those on other Linux distributions. The container provides a fully supported method for these users to leverage the full suite of Ansible development tools.

This greatly expands the accessibility of Ansible tooling, ensuring that even non-RHEL users on **Windows** and **macOS** can enjoy a consistent, reliable, and fully supported Ansible development environment.

## Building the future of Ansible tooling

The release of Ansible development tools and the Ansible development container is just the beginning. This update lays a solid foundation for deeper integration between Ansible tooling and the broader Ansible creator experience.

### Scaffolding with Ansible plug-ins for Red Hat Developer Hub (RHDH)

The integration of [Ansible plug-ins for Red Hat Developer Hub (RHDH)](https://www.redhat.com/en/technologies/management/ansible/developer-hub-plugins) is a perfect example of this forward-looking approach. These plug-ins allow developers to quickly scaffold new projects—whether it’s an Ansible Collection or playbook project—using the ansible-creator tool, all within the Ansible development container.

Ansible plug-ins for Red Hat Developer Hub delivers a portal experience with curated learning paths, push-button content creation, integrated [development tools](https://www.redhat.com/en/technologies/management/ansible/development-tools), and other opinionated resources to help users who are new to Ansible learn quickly while supporting experienced teams with the resources they need to be more productive.

### Red Hat Ansible Lightspeed: Generative AI at your fingertips

[Ansible Lightspeed](https://www.redhat.com/en/technologies/management/ansible/automation-intelligent-assistant), as part of the Ansible extension in VS Code, supercharges the creation process by providing AI-assisted recommendations for Ansible Playbooks. By learning from the user’s context and automating the mundane tasks of playbook creation, Ansible Lightspeed helps developers focus on more strategic tasks, enabling them to scale automation rapidly across their organizations. With the full support of the **Ansible development tools package**, VS Code becomes a single, powerful platform where the entire Ansible creation experience comes together.

This seamless integration makes it much easier for users to build and deploy automation solutions that scale effortlessly across their environments. With all the tools, including Ansible Lightspeed, available within the VS Code extension, users can create, test, and deploy automation content with confidence, knowing that the ecosystem is fully integrated and ready to support them.

[![Dev 2.5 blog image 1](https://www.redhat.com/rhdc/managed-files/image1_191.png)](https://www.redhat.com/rhdc/managed-files/image1_191.png)

*Figure 1: Ansible content creator view in VS Code*

## Conclusion

The new release of Ansible development tools is a game-changer for automation creators and enterprises alike. By consolidating all the essential tools into one package and introducing a flexible, supported development container, Ansible development tools makes Ansible development more accessible, efficient, and integrated than ever before.

Whether you’re working on RHEL, another Linux distribution, or even macOS or Windows, the new development container offers everything you need to automate with Ansible. As this tooling continues to evolve, we can look forward to even more seamless integrations and enhancements to the Ansible creation experience.

## Next steps and resources

- Upcoming webinar: Unlock your Automation Advantage with Red Hat Ansible Automation Platform 2.5
- Explore the [documentation](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.5)
- Blog: [What's new with Event-Driven Ansible](http://redhat.com/en/blog/whats-new-event-driven-ansible-part-ansible-automation-platform-25)
- Overview Video: [What's new: Red Hat Ansible Automation Platform 2.5](https://youtu.be/x95UPeJVm-E)
- Get started with
  - [Red Hat Ansible Lightspeed with IBM watsonx Code Assistant](https://www.redhat.com/en/technologies/management/ansible/automation-intelligent-assistant)
  - [Ansible development tools](https://www.redhat.com/en/technologies/management/ansible/development-tools)
  - [Ansible plug-ins for Red Hat Developer Hub](https://www.redhat.com/en/technologies/management/ansible/developer-hub-plugins)

---

### About the author

[![Anshul Behl, Principal Technical Marketing Manager, Red Hat](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/wa_profile%20-%20Anshul%20Behl.jpeg?itok=vYDgCAJj)](https://www.redhat.com/en/authors/anshul-behl)

[### Anshul Behl

Principal Technical Marketing Manager](https://www.redhat.com/en/authors/anshul-behl)

Anshul is a Principal Marketing Manager at Red Hat, where he brings his software development and QE experience to increase Ansible Automation Platform's adoption experience for customers by producing technical content on all aspects of the product.

[More from this author](https://www.redhat.com/en/authors/anshul-behl)

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

## Keep exploring

- [Free trial: Red Hat Learning SubscriptionTrial](https://www.redhat.com/en/services/training/learning-subscription?intcmp=7013a000003Sq0iAAC "Red Hat Learning Subscription")
- [Start your no-cost product trialTrial](https://www.redhat.com/en/products/trials?intcmp=7013a000003Sq0iAAC "All Red Hat product trials")
- [Subscribe to Red Hat TV at no costVideo](https://tv.redhat.com/?intcmp=7013a000003Sq0iAAC)
