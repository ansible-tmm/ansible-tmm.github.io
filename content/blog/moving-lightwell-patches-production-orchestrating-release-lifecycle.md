---
title: Moving Lightwell patches into production by orchestrating the release lifecycle
slug: moving-lightwell-patches-production-orchestrating-release-lifecycle
authors:
- slug: anshul-behl
  name: Anshul Behl
published: '2026-10-26'
updated: '2026-10-29'
source: redhat
source_url: https://www.redhat.com/en/blog/moving-lightwell-patches-production-orchestrating-release-lifecycle
description: Learn how to orchestrate Lightwell patch releases with Ansible Automation
  Platform to automate testing and rollback for production deployments.
topics:
- Automation
- Security
read_time_minutes: 5
synced_at: '2026-11-04T12:37:35Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** Learn how to orchestrate Lightwell patch releases with Ansible Automation Platform to automate testing and rollback for production deployments.

> [!toc]
> **On this page**
>
> - [In this article:](#in-this-article)
> - [The last mile of vulnerability remediation](#the-last-mile-of-vulnerability-remediation)
> - [Balancing security exposures with operational stability](#balancing-security-exposures-with-operational-stability)
> - [Dependency remediation in the build pipeline](#dependency-remediation-in-the-build-pipeline)
> - [Using CI completion to trigger automation](#using-ci-completion-to-trigger-automation)
> - [Orchestrating post-CI operations with automation](#orchestrating-post-ci-operations-with-automation)
> - [Putting Lightwell patches into production with Red Hat](#putting-lightwell-patches-into-production-with-red-hat)
> - [Summary and next steps](#summary-and-next-steps)
> - [Learn more](#learn-more)

<!-- blog-enrichment:end -->

---

## In this article:

- **Vulnerability remediation requires more than just merging code**: While opening a pull request (PR) updates a dependency, that's not the end of the process. Safely moving that change to production requires integration testing, change management, controlled traffic draining, and patch verification.
- **Lightwell provides stable, backported fixes**: Lightwell delivers signed, version-specific binary fixes for eligible application dependencies without forcing major framework or runtime upgrades.
- **Red Hat Ansible Automation Platform orchestrates the release lifecycle**, from continuous integration (CI) webhook triggers to pre-flight snapshots, traffic management, gated approvals, and automated rollback. Ansible Automation Platform provides trusted, repeatable execution across IT operations.

## The last mile of vulnerability remediation

In a recent post,[How to patch application vulnerabilities without upgrading](https://www.redhat.com/en/blog/how-patch-application-vulnerabilities-without-upgrading), we examined why full version upgrades can sometimes introduce regression risk, how[Lightwell](https://www.redhat.com/en/interactive-demo/lightwell-network-demo) provides targeted vulnerability fixes, and the stages of a governed remediation workflow.

But the delivery of a fix by itself solves only one part of the problem. In many organizations, dependency updates face significant challenges after CI tests pass:

- Applications require functional and integration testing beyond isolated unit tests
- Change management requires deployment context, including common vulnerabilities and exposure (CVE) identifiers and build artifacts
- Production deployments require traffic draining, state snapshots, and validation steps
- Operators need an immediate, dependable rollback procedure if something fails

If these steps are executed manually using disjointed tools, internal wikis, and chat channels, your patch deployment lags, extending the period in which your application remains exposed.

In this article, we'll talk about how automation excels at the "last mile of remediation," covering all the operational steps that need to occur once an impacted service has been identified and a remediated dependency is submitted in a PR.

> [!callout type=tmm label="TMM resource" title="Getting started with Event-Driven Ansible" url="/blog/getting-started-with-event-driven-ansible/" cta="Read the guide"]
> Step-by-step guide from the Ansible TMM team.

## Balancing security exposures with operational stability

Security teams and operations teams share common goals of protecting IT services, however:

- **SecOps** focuses on closing the vulnerability exposure window and verifying CVE mitigation
- **ITOps** focuses on service availability and performance
- **Platform engineering** builds repeatable, self-service paths that deliver a verified change to production without breaking services

Using Red Hat Ansible Automation Platform along with Lightwell and your existing CI tools (such as those included in [Red Hat OpenShift](https://www.redhat.com/en/technologies/cloud-computing/openshift/container-platform)) allows you to resolve these often conflicting priorities. Instead of managing the process through ad-hoc communications, teams can integrate the workflow directly into their standard change records and automated pipelines so that patches are applied faster without taking down production systems. Teams can coordinate remediation with the operational steps required to move an application change toward production faster.

## Dependency remediation in the build pipeline

For illustrative purposes, imagine a Python application called `inventory-service`. Like many applications, it relies on libraries—reusable packages that provide functionality developers don’t need to build from scratch. One of its libraries is `aiohttp`, which helps Python applications handle web traffic and serve files.

In this example, `inventory-service` uses `aiohttp` version 3.9.0. A security advisory for[CVE-2024-23334](https://osv.dev/vulnerability/CVE-2024-23334) describes a path traversal vulnerability in `aiohttp`’s static file handling when `follow_symlinks=True`. The upstream fix is available in version 3.9.2. If moving to that version right away creates API changes or dependency conflicts, teams can use a Lightwell-remediated artifact instead.

In our example repository, the pull request updates the package specification to:

```text
aiohttp==3.9.0.rhlw-00001
```

Note: the `.rhlw` suffix identifies the Lightwell-patched version and patch level. This provides direct benefits across teams:

- **ITOps** receives a predictable artifact that can be tested, staged, deployed, and rolled back using standard release procedures
- **SecOps** maintains traceability, as the specific CVE identifier remains linked to the deployment record and build artifact
- **Platform engineering** gets a standard golden path from the dependency change in the PR through CI to approval steps and production deployment so every CVE can follow the same workflow

When the PR is submitted, a corresponding change request (such as a ServiceNow change record) is linked in the metadata. This record tracks the dependency modification, associated CVEs, and deployment lifecycle. Software supply chain and security metadata provided by Lightwell—including package provenance, software bill of materials (SBOM), and (where applicable) Vulnerability Exploitability eXchange (VEX) metadata—attach directly to the record, creating an auditable history as code moves forward.

## Using CI completion to trigger automation

After the PR merges into the target branch, the standard CI pipeline executes:

1. Repository checkout
2. Dependency installation
3. Unit test execution
4. Validation that the vulnerable library version has been replaced

Once tests pass, your CI pipeline (Jenkins, Tekton, OpenShift Pipelines) sends an outbound webhook to Ansible Automation Platform (through [Event-Driven Ansible](https://www.redhat.com/en/technologies/management/ansible/event-driven-ansible)). The payload includes the execution parameters required for deployment:

- Application identifier
- Build version and Git commit hash (SHA)
- CI build URL
- Target CVE identifiers
- Associated change ticket number

This webhook acts as an automated event trigger to initiate the next steps. Rather than waiting for manual handoffs, Ansible Automation Platform ingests the build metadata and initiates the governed deployment process.

## Orchestrating post-CI operations with automation

The [newly released automation orchestrator](https://www.redhat.com/en/technologies/management/ansible/automation-orchestrator) directs the overarching multistep deployment. Automation orchestrator is a dedicated extension to Ansible Automation Platform. While Ansible Automation Platform handles specific, linear tasks through individual playbooks (such as stopping a service or running a health check), the automation orchestrator introduces complex workflows with decision points, branching conditions, and approval gates.

[![A screenshot of the automation orchestrator interface displaying a CI/CD pipeline workflow for 'Dev Test'. The interface shows the project is set to 'default' and its status is 'Published'. It includes action buttons and options to 'Add step', 'Run', 'Save', and 'Publish workflow'.](https://www.redhat.com/rhdc/managed-files/Full%20AO%20Lightwell%20Workflow.png)](https://www.redhat.com/rhdc/managed-files/Full%20AO%20Lightwell%20Workflow.png)

With Lightwell patches, automation orchestrator receives the payload from the PR which kicks off the following process:

1. **Change ticket synchronization**: Ansible Automation Platform receives the webhook payload and appends operational metadata to the open change ticket. Variables such as the service name, Git SHA, deployed port, and target CVE are recorded automatically.
2. **Pre-production deployment and validation**: The platform deploys the updated container or package to a staging environment and executes integration tests against connected dependencies. This verifies application stability in an integrated runtime environment.
3. **Conditional branching**:
   - **If the integration test succeeds**, the workflow updates the change ticket and advances to the production step.
   - **If the test fails**, the workflow stops, attaches test logs to the ticket, and notifies the responsible team.
4. **Context-aware approval gate**: Before touching production systems, the workflow pauses at an approval gate. The approver is presented with the complete context, including: service name, version diff, target CVE, CI build URL, and staging test results. This means operational decisions are made with complete data.
5. **Traffic draining**: Once approved, the production playbook begins by draining active connections from the load balancer pool (e.g., F5, HAProxy, or cloud application load balancers).
6. **System snapshot, deployment, and verification**:
   - **Snapshot**: The automation captures a recovery snapshot (such as a virtual machine (VM) checkpoint, storage volume snapshot, or configuration backup).
   - **Deploy**: The new package is installed, configurations are applied, and services are restarted.
   - **Smoke test**: Post-deployment validation routines query the endpoints to confirm the service is responding and reporting the updated version string.
7. **Completion or automated rollback**
   - **On success**: The load balancer re-enables the node, the change record is updated with verification outputs, and the service ticket is set to Closed.
   - **On failure**: If smoke checks fail, the workflow automatically initiates the rollback branch: restoring the snapshot, restarting the prior version, re-engaging traffic, and marking the change record as Failed with relevant diagnostic details.

This process aligns SecOps, ITOps, and platform engineering to share one trusted, repeatable path. Watch this workflow in action:

> [!callout type=tmm label="TMM resource" title="AAP CVE Report" url="https://ansible-tmm.github.io/aap_cve_report/" cta="Open tool"]
> Explore CVE information relevant to Ansible Automation Platform.

## Putting Lightwell patches into production with Red Hat

Red Hat (along with your existing tools) can help you deliver Lightwell patches at scale, but the process after Lightwell delivers the fix depends on where your application runs:

### Containerized applications running on OpenShift

In this scenario, your existing build and CI workflow incorporates the Lightwell-remediated dependency and validates the resulting application artifact. For applications running on OpenShift, the platform rebuilds and tests the app with the Lightwell dependency. OpenShift GitOps then promotes the updated image into the cluster with Ansible Automation Platform handling the steps around that deployment including updating the service ticket and deploying changes to infrastructure outside the cluster.

### Applications running on VM or bare metal

Here your existing CI tools build and test the remediated dependency. Ansible Automation Platform puts the patch into production with approvals, traffic draining, health checks, and rollback if needed.

In either case, with Lightwell and Red Hat, IT teams can establish predictable, repeatable, auditable remediation workflows.

## Summary and next steps

Effectively addressing application vulnerabilities requires careful coordination of software packaging, deployment, and operational safety checks. You can enable CVE remediation without breaking production systems, reliably roll back changes upon failure, produce audit-ready reporting, and enable operational consistency without replacing existing CI investments.

## Learn more

- Read the [Lightwell documentation](https://docs.redhat.com/en/documentation/lightwell_network/current/whats_new-what_s_new_in_lightwell_network)
- Discover more ways to [automate security risk management across enterprise IT operations](https://www.redhat.com/en/blog/automate-security-risk-management-across-enterprise-it-operations)
- Learn how to [mitigate the PHP CVE with Ansible](https://youtu.be/oYLdoRENcaA?si=JVMoZL6UEA4d3508)
- Talk to a Red Hatter about [Lightwell and Ansible Automation Platform](https://www.redhat.com/en/contact)

---

[![Anshul Behl, Principal Technical Marketing Manager, Red Hat](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/wa_profile%20-%20Anshul%20Behl.jpeg?itok=vYDgCAJj)](https://www.redhat.com/en/authors/anshul-behl)

[### Anshul Behl

Principal Technical Marketing Manager](https://www.redhat.com/en/authors/anshul-behl)

Anshul is a Principal Marketing Manager at Red Hat, where he brings his software development and QE experience to increase Ansible Automation Platform's adoption experience for customers by producing technical content on all aspects of the product.

:host{display:inline-flex;position:relative;z-index:0;align-items:center;max-width:max-content;border-radius:var(--rh-border-radius-default,3px)}::slotted(:is(a,button,input)),a{vertical-align:middle!important;word-break:break-word!important;white-space:normal!important;display:inline!important;color:inherit!important;font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;text-decoration:var(--\_text-decoration)!important;text-underline-offset:var(--\_text-underline-offset)!important;z-index:2!important}::slotted(a):after,a:after{display:block;content:"";position:absolute;inset:0;z-index:3}::slotted(button),::slotted(input){background-color:initial;border:none;margin:0;padding:0;text-align:left}#container{position:relative;white-space:var(--\_rh-cta-white-space,nowrap);color:var(--\_color);font-family:var(--rh-font-family-heading,RedHatDisplay,"Red Hat Display",Helvetica,Arial,sans-serif);font-size:var(--rh-font-size-body-text-lg,1.125rem);font-weight:var(--rh-font-weight-heading-bold,700);line-height:var(--rh-line-height-body-text,1.5);background-color:var(--\_background-color);border-color:var(--\_border-color,#0000);border-radius:var(--rh-border-radius-default,3px);border-width:var(--rh-border-width-sm,1px);--\_icon-size:var(--rh-icon-size,var(--rh-font-size-body-text-lg,1.125rem))}#container:has(rh-icon){padding-inline-end:calc(var(--rh-icon-size) + var(--rh-space-md, 8px) + 2px)}#container{--rh-color-surface:var(--\_background-color)!important;--\_arrow-size:13px;--\_rh-icon-plus-padding:calc(5px + var(--rh-icon-size))}:dir(rtl){text-align:right}rh-icon{vertical-align:middle;margin-inline-start:var(--rh-space-md,8px);display:inline-block;fill:currentcolor;translate:0 0;transition:translate var(--\_trans);--\_trans:var(--rh-animation-speed,0.3s) var(--rh-animation-timing,cubic-bezier(0.465,0.183,0.153,0.946))}#container:dir(rtl) rh-icon{rotate:180deg}::slotted(:focus),:host(:is(:focus,:focus-within)) ::slotted(:is(a,button,input)),a:focus,a:focus-within{outline:none!important}:host(:is(:focus,:focus-within)){outline:var(--rh-border-width-md,2px) solid var(--rh-cta-focus-container-outline-color,var(--rh-cta-focus-outline-color));outline-offset:2px}:host(:is(:focus,:focus-within)) #container{--\_background-color:var(--rh-cta-focus-background-color);--\_color:var(--\_focus-color);--\_text-decoration:var(--rh-cta-focus-text-decoration,var(--\_focus-text-decoration));--\_text-underline-offset:var(--rh-cta-focus-text-underline-offset,var(--rh-cta-hover-text-underline-offset));border-color:var(--\_focus-border-color);background-color:var(--\_focus-container-background-color,var(--\_focus-background-color));color:var(--rh-cta-focus-color,var(--\_color));outline:var(--rh-border-width-sm,1px) solid var(--\_focus-inner-border-color);outline-offset:-3px}:host(:hover) #container{color:var(--\_hover-color);border-color:var(--\_hover-border-color);background-color:var(--rh-cta-hover-background-color,var(--\_hover-background-color));--\_text-decoration:var(--rh-cta-hover-text-decoration,var(--\_hover-text-decoration));--\_text-underline-offset:var(--rh-cta-hover-text-underline-offset)}:host(:hover) #container rh-icon{translate:3px 0}:host(:hover) #container:dir(rtl) rh-icon{translate:-3px 0}:host(:active) #container{background-color:var(--\_background-color);color:var(--\_active-color);--\_background-color:var(--rh-cta-background-color,var(--rh-cta-active-container-background-color,var(--rh-cta-active-background-color)));outline:var(--rh-border-width-sm,1px) solid var(--\_active-inner-border-color);outline-offset:-3px}:host([variant]) #container{font-size:var(--rh-font-size-body-text-md,1rem);border-radius:var(--rh-border-radius-default,3px);border-width:var(--rh-border-width-sm,1px);padding-inline:var(--rh-space-2xl,32px);padding-block:var(--rh-space-lg,16px)}:is(:host([variant]) #container) ::slotted(:is(a,button,input)),:is(:host([variant]) #container) a{display:inline-flex!important;text-align:center!important}.icon:is(:host([variant]) #container) ::slotted(:is(a,button,input)),.icon:is(:host([variant]) #container) a{display:inline!important}.icon:is(:host([variant]) #container) rh-icon{margin-inline-start:var(--rh-space-md,8px)}.svg:is(:host([variant]) #container) ::slotted(:is(a,button,input)),.svg:is(:host([variant]) #container) a{--\_arrow-plus-padding:calc(var(--rh-space-md, 8px) + var(--\_arrow-size));padding-inline-end:calc(var(--\_arrow-plus-padding) + var(--rh-space-xl, 24px))!important}:is(:host([variant$=ary]) #container) ::slotted(:is(a,button,input)),:is(:host([variant$=ary]) #container) a{font-size:var(--rh-cta-font-size-priority,var(--rh-font-size-body-text-md,1rem))}:host(:not([variant])) #container{--\_background-color:var(--rh-cta-background-color,#0000);--\_border-color:var(--rh-cta-border-color,#0000);--\_color:var(--rh-cta-color,var(--rh-color-interactive-primary-default));--\_hover-background-color:var(--rh-cta-hover-background-color,#0000);--\_hover-border-color:var(--rh-cta-hover-border-color,#0000);--\_hover-color:var(--rh-cta-hover-color,var(--rh-color-interactive-primary-hover));--\_hover-text-decoration:var(--rh-cta-hover-text-decoration,none);--\_focus-background-color:var(--rh-cta-focus-background-color,#0000);--\_focus-container-background-color:light-dark(var(--rh-cta-focus-container-background-color,#0066cc1a),var(--rh-cta-focus-container-background-color,#73bcf740));--\_focus-border-color:var(--rh-cta-focus-border-color,#0000);--\_focus-color:var(--rh-cta-focus-color,var(--rh-color-interactive-primary-default));--\_focus-inner-border-color:var(--rh-cta-focus-inner-border-color,#0000);--\_focus-text-decoration:var(--rh-cta-focus-text-decoration,none);--\_active-container-background-color:light-dark(var(--rh-cta-active-container-background-color,#0066cc1a),var(--rh-cta-active-container-background-color,#73bcf740));--\_active-inner-border-color:var(--rh-cta-active-inner-border-color,#0000);--\_active-text-decoration:var(--rh-cta-active-text-decoration,none)}:host([variant=primary]) #container{border-style:solid;--\_background-color:var(--rh-cta-background-color,var(--rh-color-brand-red));--\_border-color:var(--rh-cta-border-color,var(--rh-color-brand-red));--\_color:var(--rh-cta-color,var(--rh-color-text-primary-on-dark,#fff));--\_active-color:var(--rh-cta-color,var(--rh-color-text-primary-on-dark,#fff));--\_hover-background-color:var(--rh-cta-hover-background-color,var(--rh-color-brand-red-dark,#a60000));--\_hover-border-color:var(--rh-cta-hover-border-color,var(--rh-color-brand-red-dark,#a60000));--\_hover-color:var(--rh-cta-hover-color,var(--rh-color-text-primary-on-dark,#fff));--\_focus-background-color:var(--rh-cta-focus-background-color,var(--rh-color-brand-red-dark,#a60000));--\_focus-border-color:var(--rh-cta-focus-border-color,var(--rh-color-brand-red-dark,#a60000));--\_focus-color:var(--rh-cta-focus-color,var(--rh-color-text-primary-on-dark,#fff))!important;--\_focus-inner-border-color:var(--rh-cta-focus-inner-border-color,var(--rh-color-text-primary-on-dark,#fff));--\_focus-text-decoration:var(--rh-cta-focus-text-decoration,none);--\_active-background-color:var(--rh-cta-active-background-color,var(--rh-color-brand-red-dark,#a60000));--\_active-inner-border-color:var(--rh-cta-active-inner-border-color,var(--rh-color-text-primary-on-dark,#fff))}:host([variant=secondary]) #container{border-style:solid;--\_background-color:var(--rh-cta-background-color,#0000);--\_border-color:var(--rh-cta-border-color,var(--rh-color-border-strong));--\_color:light-dark(var(--rh-cta-color,var(--rh-color-text-primary-on-light,#151515)),var(--rh-cta-color,var(--rh-color-text-primary-on-dark,#fff)));--\_hover-background-color:light-dark(var(--rh-cta-hover-background-color,var(--rh-color-surface-darkest,#151515)),var(--rh-cta-hover-background-color,var(--rh-color-surface-lightest,#fff)));--\_hover-border-color:var(--rh-cta-hover-border-color,var(--rh-color-border-strong));--\_hover-color:light-dark(var(--rh-cta-hover-color,var(--rh-color-text-primary-on-dark,#fff)),var(--rh-cta-hover-color,var(--rh-color-text-primary-on-light,#151515)));--\_focus-background-color:light-dark(var(--rh-cta-focus-background-color,var(--rh-color-surface-lighter,#f2f2f2)),var(--rh-cta-focus-background-color,var(--rh-color-surface-dark,#383838)));--\_focus-border-color:var(--rh-cta-focus-border-color,var(--rh-color-border-strong));--\_focus-color:var(--rh-color-text-primary);--\_focus-inner-border-color:var(--rh-cta-focus-inner-border-color,var(--rh-color-border-strong));--\_focus-text-decoration:var(--rh-cta-focus-text-decoration,none);--\_active-color:var(--rh-cta-active-color,var(--rh-color-text-primary));--\_active-background-color:light-dark(var(--rh-cta-active-background-color,var(--rh-color-border-strong)),var(--rh-cta-active-background-color,var(--rh-color-surface-lightest,#fff)));--\_active-inner-border-color:light-dark(var(--rh-cta-active-inner-border-color,var(--rh-color-surface-light,#e0e0e0)),var(--rh-cta-active-inner-border-color,var(--rh-color-border-strong-on-light,#151515)))}:host([variant=brick]){display:inline-block!important;max-width:100%;width:100%}:host([variant=brick]) #container{border-style:solid;font-family:var(--rh-font-family-body-text,RedHatText,"Red Hat Text",Helvetica,Arial,sans-serif);font-weight:var(--rh-font-weight-body-text-regular,400);display:flex;flex-flow:row wrap;gap:var(--rh-space-md,8px);justify-content:center;align-items:center;--\_background-color:var(--rh-cta-background-color,#0000);--\_border-color:var(--rh-cta-border-color,var(--rh-color-border-subtle));--\_color:var(--rh-cta-color,var(--rh-color-interactive-primary-default));--\_hover-background-color:light-dark(var(--rh-cta-hover-background-color,var(--rh-color-surface-lighter,#f2f2f2)),var(--rh-cta-hover-background-color,var(--rh-color-surface-darker,#1f1f1f)));--\_hover-border-color:var(--rh-cta-hover-border-color,var(--rh-color-border-subtle));--\_hover-color:var(--rh-cta-hover-color,var(--rh-color-interactive-primary-hover));--\_hover-text-decoration:light-dark(var(--rh-cta-hover-text-decoration,none),var(--rh-cta-hover-text-decoration,underline));--\_focus-color:var(--rh-cta-focus-color,var(--rh-color-interactive-primary-default));--\_focus-border-color:var(--rh-cta-focus-border-color,var(--rh-color-border-subtle));--\_focus-inner-border-color:var(--rh-cta-focus-inner-border-color,var(--rh-color-border-subtle));--\_focus-text-decoration:light-dark(var(--rh-cta-focus-text-decoration,none),var(--rh-cta-focus-text-decoration,none));--\_active-background-color:light-dark(var(--rh-cta-active-background-color,var(--rh-color-surface-lighter,#f2f2f2)),var(--rh-cta-active-background-color,var(--rh-color-surface-darker,#1f1f1f)));--\_active-inner-border-color:var(--rh-cta-active-inner-border-color,var(--rh-color-border-subtle));--\_active-text-decoration:light-dark(var(--rh-cta-active-text-decoration,none),var(--rh-cta-active-text-decoration,underline))}.icon:is(:host([variant=brick]) #container) rh-icon{margin-inline:0}@supports not (translate:0 0){rh-icon{transform:translate(0);transition:transform var(--\_trans)}#container:dir(rtl) rh-icon{transform:translate(0) rotate(180deg)}:host(:hover) #container rh-icon{transform:translate(3px)}:host(:hover) #container:dir(rtl) rh-icon{transform:translate(-3px) rotate(180deg)}}:host{line-height:0;aspect-ratio:1/1;display:inline-flex;place-content:center}#container{display:contents}svg{width:var(--rh-icon-size,var(--rh-size-icon-01,16px));fill:currentcolor;aspect-ratio:1/1}.standard svg{width:var(--rh-icon-size,var(--rh-size-icon-04,40px))}.microns svg{min-width:8px;max-width:12px;width:var(--rh-icon-size,12px)}[More from this author](https://www.redhat.com/en/authors/anshul-behl)

[![Tricia McConnell](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/Trish%20220x220.jpeg?itok=Q8zTyRqR)](https://www.redhat.com/en/authors/tricia-mcconnell)

[### Tricia McConnell

Principal Product Marketing Manager, Red Hat Ansible Automation Platform](https://www.redhat.com/en/authors/tricia-mcconnell)

Tricia McConnell is Principal Product Marketing Manager, Red Hat Ansible Automation Platform. She brings more than twenty years of experience marketing technical solutions to enterprise IT audiences.

:host{display:inline-flex;position:relative;z-index:0;align-items:center;max-width:max-content;border-radius:var(--rh-border-radius-default,3px)}::slotted(:is(a,button,input)),a{vertical-align:middle!important;word-break:break-word!important;white-space:normal!important;display:inline!important;color:inherit!important;font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;text-decoration:var(--\_text-decoration)!important;text-underline-offset:var(--\_text-underline-offset)!important;z-index:2!important}::slotted(a):after,a:after{display:block;content:"";position:absolute;inset:0;z-index:3}::slotted(button),::slotted(input){background-color:initial;border:none;margin:0;padding:0;text-align:left}#container{position:relative;white-space:var(--\_rh-cta-white-space,nowrap);color:var(--\_color);font-family:var(--rh-font-family-heading,RedHatDisplay,"Red Hat Display",Helvetica,Arial,sans-serif);font-size:var(--rh-font-size-body-text-lg,1.125rem);font-weight:var(--rh-font-weight-heading-bold,700);line-height:var(--rh-line-height-body-text,1.5);background-color:var(--\_background-color);border-color:var(--\_border-color,#0000);border-radius:var(--rh-border-radius-default,3px);border-width:var(--rh-border-width-sm,1px);--\_icon-size:var(--rh-icon-size,var(--rh-font-size-body-text-lg,1.125rem))}#container:has(rh-icon){padding-inline-end:calc(var(--rh-icon-size) + var(--rh-space-md, 8px) + 2px)}#container{--rh-color-surface:var(--\_background-color)!important;--\_arrow-size:13px;--\_rh-icon-plus-padding:calc(5px + var(--rh-icon-size))}:dir(rtl){text-align:right}rh-icon{vertical-align:middle;margin-inline-start:var(--rh-space-md,8px);display:inline-block;fill:currentcolor;translate:0 0;transition:translate var(--\_trans);--\_trans:var(--rh-animation-speed,0.3s) var(--rh-animation-timing,cubic-bezier(0.465,0.183,0.153,0.946))}#container:dir(rtl) rh-icon{rotate:180deg}::slotted(:focus),:host(:is(:focus,:focus-within)) ::slotted(:is(a,button,input)),a:focus,a:focus-within{outline:none!important}:host(:is(:focus,:focus-within)){outline:var(--rh-border-width-md,2px) solid var(--rh-cta-focus-container-outline-color,var(--rh-cta-focus-outline-color));outline-offset:2px}:host(:is(:focus,:focus-within)) #container{--\_background-color:var(--rh-cta-focus-background-color);--\_color:var(--\_focus-color);--\_text-decoration:var(--rh-cta-focus-text-decoration,var(--\_focus-text-decoration));--\_text-underline-offset:var(--rh-cta-focus-text-underline-offset,var(--rh-cta-hover-text-underline-offset));border-color:var(--\_focus-border-color);background-color:var(--\_focus-container-background-color,var(--\_focus-background-color));color:var(--rh-cta-focus-color,var(--\_color));outline:var(--rh-border-width-sm,1px) solid var(--\_focus-inner-border-color);outline-offset:-3px}:host(:hover) #container{color:var(--\_hover-color);border-color:var(--\_hover-border-color);background-color:var(--rh-cta-hover-background-color,var(--\_hover-background-color));--\_text-decoration:var(--rh-cta-hover-text-decoration,var(--\_hover-text-decoration));--\_text-underline-offset:var(--rh-cta-hover-text-underline-offset)}:host(:hover) #container rh-icon{translate:3px 0}:host(:hover) #container:dir(rtl) rh-icon{translate:-3px 0}:host(:active) #container{background-color:var(--\_background-color);color:var(--\_active-color);--\_background-color:var(--rh-cta-background-color,var(--rh-cta-active-container-background-color,var(--rh-cta-active-background-color)));outline:var(--rh-border-width-sm,1px) solid var(--\_active-inner-border-color);outline-offset:-3px}:host([variant]) #container{font-size:var(--rh-font-size-body-text-md,1rem);border-radius:var(--rh-border-radius-default,3px);border-width:var(--rh-border-width-sm,1px);padding-inline:var(--rh-space-2xl,32px);padding-block:var(--rh-space-lg,16px)}:is(:host([variant]) #container) ::slotted(:is(a,button,input)),:is(:host([variant]) #container) a{display:inline-flex!important;text-align:center!important}.icon:is(:host([variant]) #container) ::slotted(:is(a,button,input)),.icon:is(:host([variant]) #container) a{display:inline!important}.icon:is(:host([variant]) #container) rh-icon{margin-inline-start:var(--rh-space-md,8px)}.svg:is(:host([variant]) #container) ::slotted(:is(a,button,input)),.svg:is(:host([variant]) #container) a{--\_arrow-plus-padding:calc(var(--rh-space-md, 8px) + var(--\_arrow-size));padding-inline-end:calc(var(--\_arrow-plus-padding) + var(--rh-space-xl, 24px))!important}:is(:host([variant$=ary]) #container) ::slotted(:is(a,button,input)),:is(:host([variant$=ary]) #container) a{font-size:var(--rh-cta-font-size-priority,var(--rh-font-size-body-text-md,1rem))}:host(:not([variant])) #container{--\_background-color:var(--rh-cta-background-color,#0000);--\_border-color:var(--rh-cta-border-color,#0000);--\_color:var(--rh-cta-color,var(--rh-color-interactive-primary-default));--\_hover-background-color:var(--rh-cta-hover-background-color,#0000);--\_hover-border-color:var(--rh-cta-hover-border-color,#0000);--\_hover-color:var(--rh-cta-hover-color,var(--rh-color-interactive-primary-hover));--\_hover-text-decoration:var(--rh-cta-hover-text-decoration,none);--\_focus-background-color:var(--rh-cta-focus-background-color,#0000);--\_focus-container-background-color:light-dark(var(--rh-cta-focus-container-background-color,#0066cc1a),var(--rh-cta-focus-container-background-color,#73bcf740));--\_focus-border-color:var(--rh-cta-focus-border-color,#0000);--\_focus-color:var(--rh-cta-focus-color,var(--rh-color-interactive-primary-default));--\_focus-inner-border-color:var(--rh-cta-focus-inner-border-color,#0000);--\_focus-text-decoration:var(--rh-cta-focus-text-decoration,none);--\_active-container-background-color:light-dark(var(--rh-cta-active-container-background-color,#0066cc1a),var(--rh-cta-active-container-background-color,#73bcf740));--\_active-inner-border-color:var(--rh-cta-active-inner-border-color,#0000);--\_active-text-decoration:var(--rh-cta-active-text-decoration,none)}:host([variant=primary]) #container{border-style:solid;--\_background-color:var(--rh-cta-background-color,var(--rh-color-brand-red));--\_border-color:var(--rh-cta-border-color,var(--rh-color-brand-red));--\_color:var(--rh-cta-color,var(--rh-color-text-primary-on-dark,#fff));--\_active-color:var(--rh-cta-color,var(--rh-color-text-primary-on-dark,#fff));--\_hover-background-color:var(--rh-cta-hover-background-color,var(--rh-color-brand-red-dark,#a60000));--\_hover-border-color:var(--rh-cta-hover-border-color,var(--rh-color-brand-red-dark,#a60000));--\_hover-color:var(--rh-cta-hover-color,var(--rh-color-text-primary-on-dark,#fff));--\_focus-background-color:var(--rh-cta-focus-background-color,var(--rh-color-brand-red-dark,#a60000));--\_focus-border-color:var(--rh-cta-focus-border-color,var(--rh-color-brand-red-dark,#a60000));--\_focus-color:var(--rh-cta-focus-color,var(--rh-color-text-primary-on-dark,#fff))!important;--\_focus-inner-border-color:var(--rh-cta-focus-inner-border-color,var(--rh-color-text-primary-on-dark,#fff));--\_focus-text-decoration:var(--rh-cta-focus-text-decoration,none);--\_active-background-color:var(--rh-cta-active-background-color,var(--rh-color-brand-red-dark,#a60000));--\_active-inner-border-color:var(--rh-cta-active-inner-border-color,var(--rh-color-text-primary-on-dark,#fff))}:host([variant=secondary]) #container{border-style:solid;--\_background-color:var(--rh-cta-background-color,#0000);--\_border-color:var(--rh-cta-border-color,var(--rh-color-border-strong));--\_color:light-dark(var(--rh-cta-color,var(--rh-color-text-primary-on-light,#151515)),var(--rh-cta-color,var(--rh-color-text-primary-on-dark,#fff)));--\_hover-background-color:light-dark(var(--rh-cta-hover-background-color,var(--rh-color-surface-darkest,#151515)),var(--rh-cta-hover-background-color,var(--rh-color-surface-lightest,#fff)));--\_hover-border-color:var(--rh-cta-hover-border-color,var(--rh-color-border-strong));--\_hover-color:light-dark(var(--rh-cta-hover-color,var(--rh-color-text-primary-on-dark,#fff)),var(--rh-cta-hover-color,var(--rh-color-text-primary-on-light,#151515)));--\_focus-background-color:light-dark(var(--rh-cta-focus-background-color,var(--rh-color-surface-lighter,#f2f2f2)),var(--rh-cta-focus-background-color,var(--rh-color-surface-dark,#383838)));--\_focus-border-color:var(--rh-cta-focus-border-color,var(--rh-color-border-strong));--\_focus-color:var(--rh-color-text-primary);--\_focus-inner-border-color:var(--rh-cta-focus-inner-border-color,var(--rh-color-border-strong));--\_focus-text-decoration:var(--rh-cta-focus-text-decoration,none);--\_active-color:var(--rh-cta-active-color,var(--rh-color-text-primary));--\_active-background-color:light-dark(var(--rh-cta-active-background-color,var(--rh-color-border-strong)),var(--rh-cta-active-background-color,var(--rh-color-surface-lightest,#fff)));--\_active-inner-border-color:light-dark(var(--rh-cta-active-inner-border-color,var(--rh-color-surface-light,#e0e0e0)),var(--rh-cta-active-inner-border-color,var(--rh-color-border-strong-on-light,#151515)))}:host([variant=brick]){display:inline-block!important;max-width:100%;width:100%}:host([variant=brick]) #container{border-style:solid;font-family:var(--rh-font-family-body-text,RedHatText,"Red Hat Text",Helvetica,Arial,sans-serif);font-weight:var(--rh-font-weight-body-text-regular,400);display:flex;flex-flow:row wrap;gap:var(--rh-space-md,8px);justify-content:center;align-items:center;--\_background-color:var(--rh-cta-background-color,#0000);--\_border-color:var(--rh-cta-border-color,var(--rh-color-border-subtle));--\_color:var(--rh-cta-color,var(--rh-color-interactive-primary-default));--\_hover-background-color:light-dark(var(--rh-cta-hover-background-color,var(--rh-color-surface-lighter,#f2f2f2)),var(--rh-cta-hover-background-color,var(--rh-color-surface-darker,#1f1f1f)));--\_hover-border-color:var(--rh-cta-hover-border-color,var(--rh-color-border-subtle));--\_hover-color:var(--rh-cta-hover-color,var(--rh-color-interactive-primary-hover));--\_hover-text-decoration:light-dark(var(--rh-cta-hover-text-decoration,none),var(--rh-cta-hover-text-decoration,underline));--\_focus-color:var(--rh-cta-focus-color,var(--rh-color-interactive-primary-default));--\_focus-border-color:var(--rh-cta-focus-border-color,var(--rh-color-border-subtle));--\_focus-inner-border-color:var(--rh-cta-focus-inner-border-color,var(--rh-color-border-subtle));--\_focus-text-decoration:light-dark(var(--rh-cta-focus-text-decoration,none),var(--rh-cta-focus-text-decoration,none));--\_active-background-color:light-dark(var(--rh-cta-active-background-color,var(--rh-color-surface-lighter,#f2f2f2)),var(--rh-cta-active-background-color,var(--rh-color-surface-darker,#1f1f1f)));--\_active-inner-border-color:var(--rh-cta-active-inner-border-color,var(--rh-color-border-subtle));--\_active-text-decoration:light-dark(var(--rh-cta-active-text-decoration,none),var(--rh-cta-active-text-decoration,underline))}.icon:is(:host([variant=brick]) #container) rh-icon{margin-inline:0}@supports not (translate:0 0){rh-icon{transform:translate(0);transition:transform var(--\_trans)}#container:dir(rtl) rh-icon{transform:translate(0) rotate(180deg)}:host(:hover) #container rh-icon{transform:translate(3px)}:host(:hover) #container:dir(rtl) rh-icon{transform:translate(-3px) rotate(180deg)}}:host{line-height:0;aspect-ratio:1/1;display:inline-flex;place-content:center}#container{display:contents}svg{width:var(--rh-icon-size,var(--rh-size-icon-01,16px));fill:currentcolor;aspect-ratio:1/1}.standard svg{width:var(--rh-icon-size,var(--rh-size-icon-04,40px))}.microns svg{min-width:8px;max-width:12px;width:var(--rh-icon-size,12px)}[More from this author](https://www.redhat.com/en/authors/tricia-mcconnell)

Enter keywords here to search blogs

UI\_Icon-Red\_Hat-Close-A-Black-RGB

Search

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Getting started with Red Hat Ansible Lightspeed with IBM watsonx Code Assistant](/blog/getting-started-red-hat-ansible-lightspeed-ibm-watsonx-code-assistant/)
> - [Automate security risk management across enterprise IT operations](/blog/automate-security-risk-management-across-enterprise-it-operations/)
> - [5 ways to augment security risk management in the AI era](/blog/5-ways-augment-security-risk-management-ai-era/)

<!-- blog-enrichment:related-end -->
