---
title: What's new in Ansible Automation Platform 2.2
slug: whats-new-in-ansible-automation-platform-2.2
authors:
- slug: andrius-benokraitis
  name: Andrius Benokraitis
published: '2022-05-26'
updated: '2026-02-27'
source: redhat
source_url: https://www.redhat.com/en/blog/whats-new-in-ansible-automation-platform-2.2
description: An overview of the new features found in the Ansible Automation Platform
  2.2 release
topics: []
read_time_minutes: 8
synced_at: '2026-09-03T19:20:31Z'
---

- [Back to all posts](/blog/)

---

[![aap2.2](https://www.redhat.com/rhdc/managed-files/ansible/aap2.2.png)](https://www.redhat.com/rhdc/managed-files/ansible/aap2.2.png)

The Ansible product team at Red Hat is thrilled to announce the general availability of Red Hat Ansible Automation Platform 2.2, which includes numerous features and bug fixes that further solidify Ansible Automation Platform as the *de facto* enterprise IT automation solution for developers to operations teams in data centers, clouds, and at the edge. A few of the most noteworthy features in this release include:

- New automation topology viewer in automation controller
- Red Hat Ansible Certified Content Collections to be digitally signed in Ansible automation hub
- Updated Ansible developer and creator tooling: ansible-navigator, ansible-lint, and [VSCode](https://marketplace.visualstudio.com/items?itemName=redhat.ansible) language server support
- Enhanced network automation Collections
- Automation services catalog now available on-premise
- Reporting and analytics of automation data are now further integrated and streamlined
- Red Hat Enterprise Linux 9 support

Don’t forget to check out the [product documentation](https://docs.ansible.com/) including the [release notes](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.2/html/red_hat_ansible_automation_platform_release_notes/index)!

## Automation topology viewer

Let’s face it, automating at enterprise scale is really hard. Although many features were added for the content creator and developer in Ansible Automation Platform 2, the automation operations teams are typically responsible for making sure automation is up and running as it should across all inventories, worldwide, with 24/7 availability and uptime. As enterprise automation operations teams continue to implement strategies from IT leaders and architects, their need to troubleshoot complex automation topologies continues to grow as well. With the introduction of [automation mesh](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2.1-automation-mesh) in Ansible Automation Platform 2, automation execution can now be decentralized, running closer to where the automation needs to run (in the cloud, at the edge, etc.) while still managed by a single operations team. This operations team now must support multiple environments that span different locations, each with niche automation requirements that they may not have intimate knowledge of at any given moment.

Enter automation topology viewer, included as part of automation controller. This new addition allows operators to graphically visualize how automation nodes are connected to each other. You can find **Topology View** under the **Administration** section of the left menu bar within the automation controller graphical user interface.

[![](https://www.redhat.com/rhdc/managed-files/ansible/YF_2iRcBgFrOMwClIqCCDEd4LZ-64gWFQfelnEyqgi3NZJGQi6J2DfGFYYxgNMpb1v5nlJvG_pcQCJkC-6H6WIxKkVqYoNxiuvb9liUgzOcmCarrmConHzpjrW3lcNjtEIlwGFWvfExVwnLyRg.png)](https://www.redhat.com/rhdc/managed-files/ansible/YF_2iRcBgFrOMwClIqCCDEd4LZ-64gWFQfelnEyqgi3NZJGQi6J2DfGFYYxgNMpb1v5nlJvG_pcQCJkC-6H6WIxKkVqYoNxiuvb9liUgzOcmCarrmConHzpjrW3lcNjtEIlwGFWvfExVwnLyRg.png)

Refer to the following simple example view taken from topology viewer in automation controller:

[![](https://www.redhat.com/rhdc/managed-files/ansible/aRJc_F0W71fgUF4WR02HTnWgYqXpn-tXyvmUFCYkBkL_xTlrUSfJu_CCPufsZUkrTYdbrvghL1THyOKQ48XFB_xe_ApGGKWeAuHqBRgnCDi-4o9u_59SKCRRkYpEfPnsZoPsanvUDFH40f1Mjw.png)](https://www.redhat.com/rhdc/managed-files/ansible/aRJc_F0W71fgUF4WR02HTnWgYqXpn-tXyvmUFCYkBkL_xTlrUSfJu_CCPufsZUkrTYdbrvghL1THyOKQ48XFB_xe_ApGGKWeAuHqBRgnCDi-4o9u_59SKCRRkYpEfPnsZoPsanvUDFH40f1Mjw.png)

You’ll notice two of the four types of automation mesh worker nodes illustrated, along with their accompanying connection status. This simple automation topology contains hybrid nodes (Hy) and execution nodes (Ex). Additional information can be found by hovering over a node, which will highlight its connections to the other automation mesh nodes, giving you instant visibility into how they are connected together. The hybrid nodes could have just as easily been controller-only nodes (C) (without any automation execution) and interconnecting hop nodes (h) (jump or relay nodes) would be included in more complex automation topologies (see next example below).

As automation continues to scale, the topology viewer becomes more useful, as shown in the following example, which contains three of the four node types (controller, execution, hop):

[![](https://www.redhat.com/rhdc/managed-files/ansible/0IBVf2itri31peHd1UFaUNQjnAKh-b6rS6vltX9dFdJQeu0fYmyQEDUXNqyNY9RrVmgHvsIOFW7eu7RiqFn4HX1RDbBF4G4CnOuEDnwcC1Ay6PWwjlVEwIOZiqXvwatazC_3KncmrD_fN1a1Xg.png)](https://www.redhat.com/rhdc/managed-files/ansible/0IBVf2itri31peHd1UFaUNQjnAKh-b6rS6vltX9dFdJQeu0fYmyQEDUXNqyNY9RrVmgHvsIOFW7eu7RiqFn4HX1RDbBF4G4CnOuEDnwcC1Ay6PWwjlVEwIOZiqXvwatazC_3KncmrD_fN1a1Xg.png)

For more information on automation mesh, and how the automation topology viewer works with it, check out [Phil Griffiths’ on-demand Summit 2022 breakout session entitled: “OD1512 - Ansible Automation Platform 2 automation mesh—starting locally, scaling globally](https://events.experiences.redhat.com/widget/redhat/sum22/SessionCatalog22/session/1641398142450001vmkJ).”

## Digitally signed Red Hat Ansible Certified Content Collections

The increased focus on information security and how software is run in enterprise production environments has never been greater. Providing security-focused features in Ansible Automation Platform 2 continues to be a priority, with the ability to execute certified and compliant automation anywhere in your enterprise. New in this release is collection signing, which is the genesis of a more holistic chain-of-custody security feature going forward. The following two use cases are of note:

1. **Digitally signed Red Hat Ansible Certified Content Collections on Ansible automation hub**  
   All new and updated Red Hat Ansible Certified Content Collections will be signed by Red Hat as part of the normal certified content submission process. The public key for verifying signed content will be made available on the Red Hat Customer Portal for on-demand use, or offline use with a private/local keyring.
2. **Digitally sign your user-built, community, or third-party Ansible Content Collections on private automation hub**  
   For any Collections that are not already signed by Red Hat, automation teams can configure a signing service to private automation hub to auto-sign published Collections or host requests for approval before publishing. Developers and content creators may upload their own Collections via the private automation hub GUI or the CLI, and an approver can then sign and approve them for publishing and use across the organization.

Digital signing for Ansible Content Collections is only the beginning. Since the running of automation occurs in automation execution environments, it’s only natural that the next area of content signing would be at this level, the container level. Stay tuned for more on this in coming releases!

For more information, check out the [project upstream documentation](https://github.com/ansible/galaxy_ng/blob/master/docs/config/collection_signing.md).

NOTE: *This feature is included as a* [*technology preview*](https://access.redhat.com/solutions/21101) *supported feature, and may be made fully supported in a future release.*

## Updated developer and creator tooling

[![Screen Shot 2022-05-24 at 2.12.15 PM](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-05-24%20at%202.12.15%20PM.png)](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-05-24%20at%202.12.15%20PM.png)

As Ansible Playbooks and roles are written by more people across teams that want to automate in their organization, there becomes a need to provide standardized tools to help developers along the way.

### Added ansible-lint package

In this release the newly bundled `ansible-lint` command-line tool promotes proven practices, patterns, and behaviors for writing Ansible content. Key benefits include:

- A consistent creator experience across teams due to opinionated strategy and supported tools.
- Integration with other common CI tools, which allows custom Ansible content to be easily tested and integrated into larger business workflows.
- Helps users upgrade their playbooks to work with newer versions of Ansible Core, which is useful for migration ahead of end of life for Ansible Automation Platform 1.2 (Ansible Tower 3.8)  in September 2023.

For more information, checkout the [project upstream documentation](https://ansible-lint.readthedocs.io/en/latest/).

NOTE: *This feature (ansible-lint)  is included as a* [*technology preview*](https://access.redhat.com/solutions/21101) *supported feature, and may be made fully supported in a future release.*

### Updated ansible-navigator

First released in Ansible Automation Platform 2.0, `ansible-navigator` now includes more features to create content more easily, including:

- Native pass-through control of both `ansible-builder` and `ansible-lint`.
- Native support for execution of “ad-hoc” ansible commands in an automation execution environment.
- Simple settings management for `ansible-navigator` installations. Settings that are active or have been modified are clearly identified with Visual Studio Code (VS Code).

For more information, check out the [upstream project documentation](https://ansible-navigator.readthedocs.io/en/latest/).

### Added VS Code extension

Finally, a newly bundled VS Code extension provides language support for creating Ansible content, including smart auto-completion of related playbook content, syntax highlighting, jinja helpers, and direct integrations with supported tooling.

For more information, check out the [VS Code extension download](https://marketplace.visualstudio.com/items?itemName=redhat.ansible), as well as a [recent blog post that covers a deep dive](https://www.ansible.com/blog/deep-dive-on-ansible-vscode-extension).

## Enhanced Collections for network automation

We don’t typically highlight Collections as part of an Ansible Automation Platform release because they’re developed and released asynchronously from the product and they’re already available on Ansible automation hub. New in Ansible Automation Platform 2.2, supported execution environments that are built by Red Hat are now included by default with the Ansible Automation Platform bundled installer (thanks to Skopeo). Because of this, The latest version of the [ee-supported-rhel8 automation execution environment](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2-automation-execution-environments), which comes bundled with Ansible Automation Platform 2.2, includes many improvements for network automation, most notably:

[![Screen Shot 2022-05-24 at 2.01.43 PM](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-05-24%20at%202.01.43%20PM.png)](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-05-24%20at%202.01.43%20PM.png)

### Increased performance and resiliency

- [LibSSH](https://docs.ansible.com/ansible/latest/collections/ansible/netcommon/libssh_connection.html) (using pylibSSH Python library) is now the default Secure Shell (SSH) connection, with fallback to paramiko if needed.
- [Direct execution is enabled by default.](https://docs.ansible.com/ansible/latest/collections/ansible/netcommon/network_cli_connection.html#parameter-import_modules) Instead of the shell executing and packaging network modules, they will be directly executed by the Ansible control node. This results in a much faster execution performance and reduced execution node central processing unit (CPU).

### Additional network use-cases

- New Red Hat-supported `ansible.yang` 1.0.0 Collection (was `community.yang` Collection) includes Ansible plugins to help support YANG data models with network devices.
- New resource modules, including `snmp_server` and `hostname` modules for supported network operating systems for Arista, Cisco, Juniper and VyOS.
- Built-in support for manipulation of IPv4 and IPv6 addresses, subnets, masks and prefixes, the `ipaddr` filter plugin has been added to the `ansible.utils` Collection.
- The new consolidate filter plugin simplifies Ansible facts manipulation. This plugin presents collective structured data, including all supplied facts grouping on common attributes. It has also been added to the ansible.utils collection.

### Continued asynchronous releases

- Continued enhancements for Arista EOS, Cisco IOS XE, Cisco NX-OS, Cisco IOS XR, Juniper JunOS and VyOS.
- Major releases of ansible.netcommon and [supported network platform](https://access.redhat.com/articles/4993781) Collections.

## Automation services catalog is now on-premise

With Ansible Automation Platform 2.2, the automation services catalog evolves from a hosted service on console.redhat.com to a self-hosted, on-premises version that gives automation creators and business users self-service access to their Ansible automation across physical, virtual, cloud, container, and edge environments.

[![Screen Shot 2022-05-24 at 2.07.19 PM](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-05-24%20at%202.07.19%20PM.png)](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-05-24%20at%202.07.19%20PM.png)

This new iteration of the automation services catalog helps organizations extend the value of their automation to the business user by presenting access to Ansible Automation Platform in a catalog-style format. With multilevel approval and role-based access control (RBAC), administrators can deploy projects more quickly, with the governance they need to meet compliance and procurement requirements.

NOTE: *This feature is included as a* [*technology preview*](https://access.redhat.com/solutions/21101) *supported feature, and may be made fully supported in a future release.*

## Automation reporting and analytics more integrated

Ansible Automation Platform 2.2 includes a simpler, more intuitive way to connect your automation data with Red Hat Insights. The `insights-client` package responsible for ensuring connected data for your Ansible Automation Platform infrastructure is a part of the bundled installer on the Red Hat Customer Portal.

[![Screen Shot 2022-05-24 at 2.24.06 PM](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-05-24%20at%202.24.06%20PM.png)](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-05-24%20at%202.24.06%20PM.png)

With Red Hat Insights, you get actionable metrics and dashboards to help identify, troubleshoot, and resolve operational, business, and security issues across your entire ecosystem. You gain full visibility into the performance and return on investment (ROI) of your efforts, enabling more informed decisions to optimize and expand your automation.

Insights for Ansible Automation Platform includes:

- **Automation calculator** to calculate automation ROI.
- **Savings planner** to help predict and prioritize future automation based on time or cost savings.
- **Reports** for visibility into automation performance and adoption across teams.
- **Drift** to establish consistent configuration across systems.
- **Advisor** to identify issues and remediations to generate playbooks to resolve issues quickly.

## Red Hat Enterprise Linux 9 support

[![rhel9_banner](https://www.redhat.com/rhdc/managed-files/ansible/rhel9_banner.png)](https://www.redhat.com/rhdc/managed-files/ansible/rhel9_banner.png)

The automation and management capabilities of Ansible Automation Platform 2.2 are now supported on Red Hat Enterprise Linux 9:

- **Components now available for Red Hat Enterprise Linux 9.** Ansible Automation Platform components, including automation controller, private automation hub, automation services catalog, and many developer and creator tools, are now available as Red Hat Enterprise Linux 8 or 9 Red Hat Package Manager (RPM) packages in the Red Hat Customer Portal.
- **Support for PostgresDB 13.** Red Hat Enterprise Linux 9 now includes PostgresDB version 13, which can be used by automation controller, private automation hub, and the automation services catalog for improved compatibility and performance.
- **An updated Red Hat Ansible Certified Content Collection for Red Hat Enterprise Linux system roles to automate Red Hat Enterprise Linux 9 instances.** The `redhat.rhel_system_roles` Collection on Ansible automation hub supports the ability to automate Red Hat Enterprise Linux 9.

New additions to the `rhel_system_roles` Collection, available on Ansible automation hub, include system roles for [Postfix, Intelligence Platform Management Interface (IPMI) management, Cockpit, Firewalld, and Red Hat Enterprise Linux high-availability cluster solutions](https://access.redhat.com/articles/3050101). For more information on the release of Red Hat Enterprise Linux 9, please refer to [the official press release](https://www.redhat.com/en/about/press-releases/red-hat-defines-new-epicenter-innovation-red-hat-enterprise-linux-9).

## Next Steps

**More Ansible Automation Platform 2.2 Resources**

You can get a rundown of what’s new in this checklist, [What’s new: Ansible Automation Platform 2.2](https://www.redhat.com/en/resources/whats-new-ansible-automation-platform-2-2-checklist). For even more context, including a recap of Ansible Automation Platform 2 releases to date, and a look ahead at 2.3, check out the free, on-demand webinar, Ansible Automation Platform 2.2: next generation platform enhancements.

**Take a video tour**

This eight-minute [overview video](https://youtu.be/7GJjhZoYEus) highlights the components and features in the latest version of Ansible Automation Platform—and how they come together to deliver a comprehensive enterprise automation experience.

**Try Ansible Automation Platform**

Get hands-on with our [self-paced, on-demand labs](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218). These interactive learning scenarios provide a preconfigured Ansible Automation Platform environment where you can experiment on how the platform can help you solve real-world challenges.

Sign up for an Ansible Automation Platform [60-day trial](https://www.redhat.com/en/technologies/management/ansible/try-it) to try it in your environment.

**Plan your upgrade**

If you are still operating Ansible Automation Platform 1.2, it is time to start planning your upgrade. Get started with this checklist, “5 ways to prepare for migration to Ansible Automation Platform 2.” You can also register for a free webinar, “Migrating to the next generation IT automation platform.”

---

### About the author

[![Andrius Benokraitis](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/Andrius-Benokraitis.jpg?itok=bGBYkaZb)](https://www.redhat.com/en/authors/andrius-benokraitis)

[### Andrius Benokraitis

Senior Manager, Technical Marketing for Ansible Automation Platform](https://www.redhat.com/en/authors/andrius-benokraitis)

Andrius is a Senior Manager, Technical Marketing for Ansible Automation Platform. He brings over 20 years in the computer software industry from companies such as IBM, Nortel, and Cumulus Networks. Andrius is skilled in Network Automation, Enterprise Linux, Business Analytics, Technical Writing, and Strategic Alliances.

[More from this author](https://www.redhat.com/en/authors/andrius-benokraitis)

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
