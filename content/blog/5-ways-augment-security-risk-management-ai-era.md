---
title: 5 ways to augment security risk management in the AI era
slug: 5-ways-augment-security-risk-management-ai-era
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2026-08-19'
updated: '2026-09-01'
source: redhat
source_url: https://www.redhat.com/en/blog/5-ways-augment-security-risk-management-ai-era
description: Implement enterprise-wide automation for proactive vulnerability management
  with Ansible Automation Platform.
topics:
- Artificial intelligence
- Security
read_time_minutes: 6
synced_at: '2026-09-03T19:21:31Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

IT operations and security teams receive thousands of alerts every day from threat intelligence sources, such as vulnerability scanners, observability tools, Red Hat Lightspeed, and more. The challenge is identifying, correlating, and addressing impactful alerts from an ongoing, high-volume stream of information as quickly as possible, especially now that vulnerabilities can be exploited in a matter of hours.

Consider IBM's [X-Force Threat Intelligence Index 2026](https://www.ibm.com/think/premium/threat-intelligence-report-security-101-still-lacking#605511086), where researchers found that scanning for vulnerable software is a common attack vector–second only to exploiting incorrectly configured access controls. With powerful AI models exposing identification of new vulnerabilities, manual remediation steps can no longer keep pace with exploitation speed. This is where automation can uniquely strengthen overall defenses and limit the impact of vulnerabilities on IT operations.

## Building proactive automated approaches to IT vulnerabilities

What's required of IT operations and security teams now is a comprehensive security strategy, implementing a multi-layered approach to contain, patch, and limit impact across your enterprise. The threat landscape will continue to evolve, so establishing perimeter defenses with proactive vulnerability management techniques can help effectively thwart exploitation attempts.

Here are 5 steps you can employ to mitigate vulnerabilities being exploited:

## 1. Accelerated patching cycles

Scanning for and exploiting vulnerabilities is a common attack method. While industry statistics vary, it is clear that many organizations do not have a fully patched environment at all times. As a result, IT leaders have begun accelerating patching cycles. Red Hat Ansible Automation Platform allows teams to patch faster and more consistently across a wide array of IT technologies, allowing these actions to be completed in minutes across your systems.

See how [Glen Raven uses Ansible Automation Platform to accelerate patching frequency](https://www.redhat.com/rhdc/managed-files/rh-glenraven-case-study-customer-1296269-202407-en.pdf)

## 2. Deploy automated responses to vulnerabilities

As more vulnerabilities are uncovered at machine speed, teams need ways to quickly triage the urgent ones, then take fast action. [Event-Driven Ansible](https://www.redhat.com/en/technologies/management/ansible/event-driven-ansible) can respond to alerts from your SIEM (Security Information & Event Management) systems as soon as they are received, with either a remediation step or a human-in-the-loop review. User-defined and flexible, automated responses can include fact and context gathering, containment steps, patch application and validation as well as ticket generation into your ITSM systems and more.

## 3. Initiate workarounds prior to patch availability to mitigate impacts

When a vulnerability is so new that a fix is not yet available, you can use [AIOps automation techniques](https://www.redhat.com/en/technologies/management/ansible/ai-automation) to assist with workarounds, such as implementing expanded monitoring, tightening firewall rules, disabling features, system hardening to reduce attack surfaces and backing up critical resources. Ansible Automation Platform’s AI capabilities and MCP server integration can help you determine and execute the best actions quickly.

## 4. Establish strong perimeter defenses

Given the risks of vulnerabilities, a good perimeter defense helps limit the impact of threats. By implementing a policy-driven approach, you can include multiple automated policy checkpoints before actions are permitted. The integration of secrets management solutions to rotate and validate credentials is crucial to this workflow so that flaws are not as easily exploited.

## 5. Explore enterprise-wide risk management

This new vulnerability landscape reaches across enterprise systems, but a single automation platform can help you manage it, including:

- Red Hat Enterprise Linux (RHEL)
- Microsoft Windows servers
- Multivendor networks
- Storage systems
- Clouds
- Applications

Organizational barriers often slow response times, but a single automation platform can expedite management and unifies teams. This improves the ability to stop multi-factor attacks, such as gaining server access through a vulnerability and transiting the network to find sensitive data stores.

## Getting started

How can you get started with automation to address these risks? Let's break things down into short, medium, and long term approaches.

### Assess and prioritize initial actions

Begin by understanding your present operational state. For example, you can use Ansible Automation Platform to:

- Understand which platforms host your most critical data and applications and what risks are present.
- Document patching levels in percentages for resources, especially critical ones.
- Address high-severity Common Vulnerabilities and Exposures (CVEs) by applying available patches.
- Implement workarounds for high-impact CVEs without available patches.
- Create ITSM tickets inside appropriate change windows to patch systems and get approvals.

Consider accelerating patching cycles across your operation, especially for vital systems with critical open CVEs. Generate an impacted system inventory, then apply patches at scale in minutes.

For RHEL environments, Red Hat Lightspeed provides specific information on which of your systems need patches. Ansible Playbooks are available in Red Hat Lightspeed to help you complete the patching process quickly. For other platforms such as Microsoft Windows or network devices, you can use Ansible Automation Platform's coding assistant to generate automation, then test and roll it out across your enterprise to patch at scale.

From a people and process perspective, assess the level of Ansible Automation Platform skills in your organization and establish a centralized methodology to help share and expand automation practices. Centralization of automation makes it easier to review and streamline processes so you can move quickly, for example by updating change approval processes to match the current urgency of the vulnerabilities. This also helps identify areas where teams face manual, slow coordination that lengthens remediation cycles and begin addressing them with automated workflows.

### Your journey to fully-automated security risk management

The path to automation for security is a matter of closing the gap between mitigation, patching, validation, and verification, as shown in figure 1. It doesn't happen all at once, but in phases:

#### Short term: Assess and prioritize

- Understand threats
- Accelerate patching
- Create an automation community of practice
- Begin building automation skills

#### Medium term: Scale for velocity

- Event-driven automated triage and containment
- Automate non-patched CVE workarounds
- Expand and accelerate patching
- Design and implement policy checks
- Automated workflows for advanced needs

#### Long term: Solidify and govern

- Automate compliance and hardening steps
- Expand to multi-layer policy checking
- Automate reporting
- Implement cross-functional automated workflows
- Expand to automation maturity

[![Flowchart of a security automation journey: Mitigate, Patch, Validate, and Verify across three phases](https://www.redhat.com/rhdc/managed-files/security-automation-ai-era.png)](https://www.redhat.com/rhdc/managed-files/security-automation-ai-era.png)

Figure 1: An overview of the 3 phases to transform to vulnerability and security automation that keeps pace with the AI era.

### Scale for velocity

With key risks addressed, focus on expanding scope and maturity around security automation. For example, use Ansible Automation Platform to:

- Expand the patching focus across more of your operation including resources in multiple domains (infrastructure, network, and so on)
- Extend approved mitigation approaches for CVEs to more of your infrastructure
- Implement event-driven automation to expedite triage and containment of new vulnerabilities so you continue to focus on the top risks
- Create automated workflows to bridge across teams for fast response, for example security, Site Reliability Engineering (SRE) and IT teams.
- Design and begin implementing multi-layer policy checks as part of an augmented perimeter defense
- Automate service restoration and recovery workflows so that once a vulnerability is patched or a threat is contained, affected systems and services can be brought back to a known-good state quickly and consistently

Create a strategic approach to deliver automation with speed and control. Move faster without excessive fire-fighting and with the right level and pace of approvals. Keep in mind Ansible Automation Platform includes features that make it trusted automation such as role based access control (RBAC), approval workflows, complete audit trails, automation policy enforcement, and flexible reporting.  Use all of these capabilities to optimize your organization's ability to act fast and with control.

From a people and process standpoint, you should continue to build user skills and celebrate successes to foster an automation-first culture. Review processes periodically to address velocity with control.

### Solidify and govern new processes

Finally, solidify and fine-tune this new level of security risk automation. For example, you can use Ansible Automation Platform to:

- Govern automation using the full set of trust capabilities in the platform
- Extend perimeter defenses to multi-layer automated checkpoints that control what actions can be taken across your organization
- Automate compliance scanning and reporting
- Complete regular hardening steps and ongoing scans to lower risks
- Continue extending automation across operational domains
- Rotate keys, passwords and certificates on all systems regularly

## Automation for security threats in the AI era

By focusing on these 5 practices and growing the use of security automation across your enterprise, your organization can improve its security and compliance posture to handle an AI-driven threat landscape. Teams will understand the most impactful vulnerabilities and will have the tools and processes to address them. By using controls around automation, teams can act faster and with governance. [Red Hat Services](https://www.redhat.com/en/services) can help you get started or expand your automation to help you stay more secure in this accelerated era of AI.

## Additional resources

Read our blog series:

- [Managing IT Operations when AI outpaces your patching cycle](https://www.redhat.com/en/blog/managing-it-operations-when-ai-outpaces-your-patching-cycle)
- [AI threats move fast. Your defenses should too.](https://www.redhat.com/en/blog/ai-threats-move-fast-your-defenses-should-too)
- [Build security into ITOps from the start](https://www.redhat.com/en/blog/build-security-itops-start-automation)

Watch an interactive demo: [Automate security with AIOPs](https://app.arcade.software/share/IPZDfNcMdl10jjSpHIdN?ref=share-link)

Join our webinar: [Security automation in the age of AI: Responding to threats at scale](https://www.redhat.com/en/events/webinar/security-automation-in-the-age-of-ai-responding-to-threats-at-scale)

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

### [The last mile problem in agentic AI: Why tool calling reliability is harder than it looks](https://www.redhat.com/en/blog/last-mile-problem-agentic-ai-why-tool-calling-reliability-harder-it-looks)

Blog post

### [What risk-aware model deployment looks like in regulated industries](https://www.redhat.com/en/blog/what-risk-aware-model-deployment-looks-regulated-industries)

Original podcast

### [How Red Hat cleared IT debt for scalable AI](https://www.redhat.com/en/technically-speaking/ai-ready-data-cleanup)

Original podcast

### [Can Compliance Be A Piece Of Cake? | Compiler](https://www.redhat.com/en/compiler-podcast/compliance)
