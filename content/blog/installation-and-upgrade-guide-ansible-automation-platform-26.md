---
title: What to know before you install or upgrade to Red Hat Ansible Automation Platform
  2.6
slug: installation-and-upgrade-guide-ansible-automation-platform-26
authors:
- slug: leonardo-gallego
  name: Leonardo Gallego
published: '2025-10-13'
updated: '2025-11-25'
source: redhat
source_url: https://www.redhat.com/en/blog/installation-and-upgrade-guide-ansible-automation-platform-26
description: Learn about the supported installation methods for Ansible Automation
  Platform 2.6, including containerized and RPM installations on Red Hat Enterprise
  Linux and OpenShift Operator installations. Understand the difference between upgrades
  and migrations, and get guidance on upgrade planning, deployment type migrations,
  and underlying Red Hat Enterprise Linux version and database migrations.
topics:
- Automation and management
read_time_minutes: 4
synced_at: '2026-09-03T19:21:30Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

Red Hat Ansible Automation Platform 2.6 introduces powerful capabilities for managing, scaling, and deploying automation across your enterprise. Whether you're a new user planning your first deployment or an existing customer upgrading from a previous version, understanding the available installation and upgrade methods is critical. This guide provides a high-level overview of the supported paths to Ansible Automation Platform 2.6.

## New installations of Ansible Automation Platform 2.6

Ansible Automation Platform offers flexible installation methods to suit your infrastructure, with support for deployments on Red Hat Enterprise Linux (RHEL) and Red Hat OpenShift.

## Installing on RHEL

On RHEL, there are two primary methods for deploying Ansible Automation Platform, though one of the options is deprecated.

### RHEL containerized installation (recommended)

Containerized installations are the recommended approach for new installations and deployments on RHEL. The Ansible Automation Platform 2.6 containerized installer requires either RHEL 9 or RHEL 10.  [Read the documentation to learn more.](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html/containerized_installation/aap-containerized-installation)

### RHEL RPM installation (deprecated)

The Ansible Automation Platform 2.6 RPM-based install is only available on RHEL 9. We suggest using the RHEL RPM install method only for specific upgrade scenarios, not for net new installations.  [Read the documentation to learn more.](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html-single/rpm_installation/index)

When we released Ansible Automation Platform 2.5, we announced that the RPM install method was being deprecated. 2.6 will be the last version with an RPM installer and will only be available for RHEL 9. There will be no RPM-based installer for RHEL 8 or RHEL 10. Ansible Automation Platform  2.7 will not include the RPM installer for any version of RHEL. [Learn more](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html-single/release_notes/index#rpm_installation).

## Installing on Red Hat OpenShift

For cloud-native and Kubernetes environments, the supported method is the operator-based installation on Red Hat OpenShift Container Platform. This is the recommended path for new installations due to its benefits in simplified maintenance and enterprise scalability.  [Learn more.](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html-single/installing_on_openshift_container_platform/index)

## Upgrade and migration paths to Ansible Automation Platform 2.6

It's important to understand the difference between an upgrade and a migration.

- **Upgrades** occur when changing the Ansible Automation Platform software version in use (for example, upgrading from 2.5 to 2.6)
- **Migrations** involve changing the installation type (for example, moving from RPM to containerized) or the underlying RHEL major version (from RHEL 8 to RHEL 9, for instance). This option requires a backup and restore procedure.

Red Hat supports upgrades to Ansible Automation Platform 2.6 from existing 2.4 and 2.5 deployments. Depending on your current installation's deployment type, some scenarios may require a migration before upgrading to 2.6.

Read the following [upgrade planning guide](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html-single/planning_your_upgrade/index) to learn about new infrastructure requirements, how to handle user and authentication data, and to get guidance on various deployment scenarios to help you successfully plan your upgrade.

### Deployment type migrations: Moving between RPM, container, and operator

The RPM installation method, deprecated since Ansible Automation Platform 2.5 in 2024, will no longer be available in the future 2.7 release. Consequently, users currently relying on an RPM deployment eventually need to migrate to a different installation method (either RHEL containerized or the OpenShift Operator). This is an important consideration when upgrading.

If you plan to change your installation type—for example, moving from an RPM-based deployment to a container-based deployment on RHEL—then you must perform this migration only between deployments running the same major Ansible Automation Platform version. For example, if you're running 2.6 RPM then you must migrate to 2.6 Containerized.

### Migrating Ansible Automation Platform across RHEL versions

When running Ansible Automation Platform 2.4 or 2.5 on RHEL 8, an operating system migration is required because there is no direct upgrade available. The recommended path for this is to migrate to a new install of Ansible Automation Platform on RHEL 9.

Doing a LEAPP in-place upgrade of RHEL 8 is not supported.

The core process involves [migrating](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html/planning_your_upgrade/upgrade-support-matrix#upgrade-scenarios-rpm) Ansible Automation Platform from RHEL 8 using the installation setup script and restoring it on the target RHEL 9 system, then running the 2.6 installer on RHEL 9 to [upgrade](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html-single/rpm_upgrade/index).

Suppose you're migrating from Ansible Automation Platform 2.5 on a RHEL 8 instance called  rhel8-aap-instance to a RHEL 9 instance called rhel9-aap-instance. Here's an example workflow:

1. Backup Ansible Automation Platform 2.5 data on rhel8-aap-instance.
2. Install your new RHEL 9 server (rhel9-aap-instance) and Ansible Automation Platform 2.5.
3. Migrate data (backup and restore) from rhel8-aap-instance to rhel9-aap-instance.
4. Upgrade rhel9-aap-instance from Ansible Automation Platform 2.5 to 2.6 RPM.

### Migrating across PostgreSQL versions

PostgreSQL databases managed by the Ansible Automation Platform installer get upgraded to PostgreSQL 15 automatically.

A strict requirement for a successful upgrade to Ansible Automation Platform 2.6 is that the PostgreSQL database must be running versions 15, 16, or 17. If your current environment is currently using an external PostgreSQL 13 or earlier database, then you must upgrade to version 15, 16, or 17 before attempting an upgrade to Ansible Automation Platform 2.6.  Red Hat recommends using PostgreSQL 15 whenever possible.

## Upgrading from Ansible Automation Platform 2.4 to 2.6

This path spans two major versions, and skips the middle step of upgrading to 2.5. You can upgrade directly from Ansible Automation Platform 2.4 to 2.6 when your current install is based on RPM on RHEL 9 or OpenShift. [Read the release notes to learn more.](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html-single/release_notes/index#upgrade_paths)

|  |  |  |  |
| --- | --- | --- | --- |
|  | To AAP 2.6 RPM on RHEL 9 | To AAP 2.6 container on  RHEL 9 / RHEL 10 | To AAP 2.6 OCP operator |
| From AAP 2.4 RPM on RHEL 8 | Migrate | Migrate | Migrate |
| From AAP 2.4 RPM on RHEL 9 | Upgrade | Migrate | Migrate |
| From AAP 2.4 OCP operator | N/A | N/A | Upgrade |

## Upgrading from Ansible Automation Platform 2.5 to 2.6

If your current Ansible Automation Platform 2.5 install is running on RHEL 9 or RHEL 10, upgrading to Ansible Automation Platform 2.6 is a direct, major version upgrade and is supported while keeping the same installation method of Ansible Automation Platform 2.5.

If your current Ansible Automation Platform 2.5 install is running on RHEL 8, then a direct upgrade to Ansible Automation Platform 2.6 is not possible and you must migrate Ansible Automation Platform to a new RHEL install before upgrading Ansible Automation Platform.

If your current Ansible Automation Platform 2.5 install is running on OCP, then a direct upgrade to Ansible Automation Platform 2.6 is available.

[Read the documentation to learn more about supported upgrade paths](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html-single/release_notes/index#upgrade_paths).

|  |  |  |  |  |
| --- | --- | --- | --- | --- |
|  | To AAP 2.6 RPM on RHEL 9 | To AAP 2.6 container on RHEL 9 | To AAP 2.6 container on RHEL 10 | To AAP 2.6 OCP operator |
| From AAP 2.5 RPM on RHEL 8 | Migrate | Migrate | Migrate | Migrate |
| From AAP 2.5 RPM on RHEL 9 | Upgrade | Migrate | Migrate | Migrate |
| From AAP 2.5 container on RHEL 9 | N/A | Upgrade | Migrate | Migrate |
| From AAP 2.5 container on RHEL 10 | N/A | N/A | Upgrade | Migrate |
| From AAP 2.5 OCP operator | N/A | N/A | N/A | Upgrade |

## Additional resources

Upgrading to Ansible Automation Platform 2.6 represents a significant step forward, with a host of streamlined features and crucial performance enhancements. Upgrading or migrating now enables your organization to leverage new security patches, improved stability, and the latest features and functionality designed to help your entire team be more productive and effective.

Learn more about Ansible Automation Platform 2.6:

- **Release announcement**: [What's new with Ansible Automation Platform 2.6](https://www.redhat.com/en/blog/whats-new-in-ansible-automation-platform-2.6)
- **Release notes**: [Ansible Automation Platform 2.6](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html-single/release_notes/index)
- **Video**: [What's new with Ansible Automation Platform 2.6](https://youtu.be/aHw2qyD9NOY?si=ykUVQhreMtEsGNWu)
- **Documentation**: [Ansible Automation Platform 2.6](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html-single/release_notes/index#platform-introduction)

---

### About the author

[![Leonardo Gallego](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/avatar-leonardo-gallego%20-%20Leonardo%20Gallego.jpeg?itok=h0BdxPl5)](https://www.redhat.com/en/authors/leonardo-gallego)

[### Leonardo Gallego

Senior Technical Marketing Manager](https://www.redhat.com/en/authors/leonardo-gallego)

Leonardo is a Senior Technical Marketing Manager at Red Hat. He drives the adoption of Ansible by developing and promoting technical content, including hands-on workshops, meetups and upstream collaboration. He has been an Open Source enthusiast and professional for over 20 years. He is a Red Hat Certified Engineer and Specialist in Advanced Ansible Automation.

[More from this author](https://www.redhat.com/en/authors/leonardo-gallego)

Enter keywords here to search blogs

UI\_Icon-Red\_Hat-Close-A-Black-RGB

Search

## More like this

Blog post

### [Red Hat Satellite 6.20 limited availability: Early access registration now open](https://www.redhat.com/en/blog/red-hat-satellite-620-limited-availability-early-access-containerized-management-and-post-quantum-cryptographic-enablement)

Blog post

### [Unify IT workflows at scale with the new automation orchestrator for Ansible Automation Platform](https://www.redhat.com/en/blog/unify-it-workflows-scale-new-automation-orchestrator-ansible-automation-platform)

Original podcast

### [Untangling Networks | Compiler](https://www.redhat.com/en/compiler-podcast/untangling-networks)

Original podcast

### [Operating System Management | Compiler](https://www.redhat.com/en/compiler-podcast/operating-system-management)

## Keep exploring

- [The automated enterpriseE-book](https://www.redhat.com/en/engage/automated-enterprise-ebook-20171107?intcmp=7013a000003Sq0iAAC "E-book: The automated enterprise")
- Try Red Hat Ansible Automation Platform with self-paced, hands-on labsInteractive lab
- [Red Hat Ansible Automation Platform: A beginner’s guide](https://www.redhat.com/en/engage/redhat-ansible-automation-20220412 "Red Hat Ansible Automation Platform: A beginner’s guide")[E-book](https://www.redhat.com/en/engage/ansible-automation-platform-beginners-guide-ebook "Red Hat Ansible Automation Platform: A beginner’s guide")
