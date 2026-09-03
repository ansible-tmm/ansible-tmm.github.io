---
title: Introducing Ansible plug-ins for Red Hat Developer Hub
slug: introducing-ansible-plug-ins-red-hat-developer-hub
authors:
- slug: anshul-behl
  name: Anshul Behl
published: '2024-07-24'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/introducing-ansible-plug-ins-red-hat-developer-hub
description: Discover Ansible plug-ins for Red Hat Developer Hub, a branded internal
  developer portal, purpose-built for automation content creation.
topics:
- Application development and delivery
- Automation and management
read_time_minutes: 3
synced_at: '2026-09-03T19:20:35Z'
---

In today’s fast-paced IT landscape, streamlining automation development workflows is paramount. The Red Hat Developer Hub offers an innovative framework for building internal developer portals (IDPs), providing a unified experience that reduces cognitive load and significantly boosts developer productivity.

Today we're announcing the technical preview of Ansible plug-ins for Red Hat Developer Hub, an integration of Ansible Automation Platform with Developer Hub. These plug-ins herald a new era for Ansible users by enabling a seamless, efficient and powerful automation platform experience for [automation developers](https://developers.redhat.com/articles/2024/06/13/demystifying-role-automation-developer-its-not-what-you-think). This union provides a comprehensive platform that offers self-service workflows, guided enablement and standardized best practices, enabling a robust Community of Practice (COP) for automation in your organization.

## Who benefits from Ansible plug-ins for Red Hat Developer Hub?

### Automation Beginners

Getting started with Ansible can be challenging. You need to grasp various concepts such as YAML, source control, testing and integrated development environments (IDEs). The Ansible plug-ins for Red Hat Developer Hub help address these challenges by providing a centralized UI that collates a curated list of  learning paths, push-button Ansible content creation and more to make onboarding smoother and more intuitive. You can quickly discover existing Ansible content and align with your organizational policies, thus accelerating your journey from novice to proficient.

### Experienced automation developers

Automation specialists and domain experts, who often act on behalf of their organizations, will find immense value in this integration. They need their automation to be easily discoverable, distributable and consistently executable across the organization. Ansible plug-ins for Red Hat Developer Hub help reduce the need to switch between multiple tools, thereby saving time and enhancing the quality of the Ansible content created. This helps standardize and adhere automation to best practices, including  CI/CD and testing, and promotes a consistent approach to automation across the enterprise.

## Addressing core organizational challenges

### Improving time-to-value

One of the principal challenges customers face with automation is realizing time-to-value as quickly as possible. Success with automation hinges on the effective creation of content such as playbooks, roles and collections, then standardizing and sharing this content across different teams. Ansible plug-ins for Red Hat Developer Hub delivers a platform engineering approach to creating, managing and scaling quality Ansible content beyond an individual user to the entire IT organization.

### Streamlining disparate tooling

Creating Ansible content often involves using various tools such as integrated development environments (IDEs) and Git, each with its own interface. The fragmented nature of these tools requires constant context switching, which can slow down development. Ansible plug-ins for Red Hat Developer Hub offer a centralized interface, bringing all necessary tools together. This assists in streamlining the development process and enables documentation that is consistent and easily accessible, reducing the time automation developers spend searching for information.

### Enhancing discoverability and reusability

Organizations often have a wealth of Ansible content that is purpose-built and tested for reuse. With this in mind, Developer Hub provides a centralized catalog that tracks ownership and metadata, making it easier for developers to find and reuse existing automation resources. This promotes the standardization of automation content and discourages the use of untested, one-off automation scripts.

## Key Features

### Customized Ansible interface

The Developer Hub integration features a customized welcome page that offers an Ansible-first UI experience. This provides users with a dedicated space to access Ansible content, tutorials and best practices. The interface is tailored to meet the specific needs of Ansible users, making it easier for them to find and use the tools they need for automation.

[![Landing page of Ansible plug-ins for RHDH](https://www.redhat.com/rhdc/managed-files/image%201_1.png)](https://www.redhat.com/rhdc/managed-files/image%201_1.png)

*Landing page of Ansible plug-ins for RHDH*

### Seamless content creation

The solution includes Developer Hub software templates that facilitate a push-button experience for creating repositories to host Ansible Playbooks, roles and collections. These templates follow our recommended best practices, including testing, linting and support for Ansible execution environments. Users can generate new Ansible Git projects with an intuitive step-by-step UI workflow, and edit it directly with a Red Hat OpenShift Dev Spaces instance preconfigured with the Ansible development tools. (Note: OpenShift Dev Spaces is a separate, optional product and is not required to use the Ansible plug-ins for Red Hat Developer Hub.)

[![Embedded software templates for push-button Ansible creation experience.](https://www.redhat.com/rhdc/managed-files/image%202_1.png)](https://www.redhat.com/rhdc/managed-files/image%202_1.png)

*Embedded software templates for push-button Ansible creation experience.*

[![Linked directly to Ansible devs spaces.](https://www.redhat.com/rhdc/managed-files/image%203.png)](https://www.redhat.com/rhdc/managed-files/image%203.png)

*Linked directly to Ansible devs spaces.*

### Integrated pipelines

Pre-configured pipelines, deployed as part of the template repositories, help make your Ansible content consistent. Integrating ansible-lint, these pipelines automatically run upon any push to the repository, so that content adheres to best practices.

### Integrations with Ansible Automation Platform

The platform provides links to private automation hub and automation controller, making certified, ready-to-use content more visible to help users get started quickly and run their automation.

### Comprehensive learning paths

Developer Hub offers expanded learning paths to guide users in customizing best practices and policies for automation. A dedicated section for Ansible documentation, learning paths, labs and knowledge base articles provides a one-stop shop for all Ansible-related help content.

[![Ansible-specific learning paths and labs](https://www.redhat.com/rhdc/managed-files/image%204.png)](https://www.redhat.com/rhdc/managed-files/image%204.png)

*Ansible-specific learning paths and labs*

## How to get started

To get started using the technical preview of Ansible plug-ins for Red Hat Developer Hub:

- Already an Ansible Automation Platform and Red Hat Developer Hub subscriber? [Download the plug-in](https://access.redhat.com/downloads/content/480).
- Not currently subscribed? Learn how to try it in the [Developer Sandbox](https://developers.redhat.com/learn/ansible/install-and-configure-ansible-plug-ins-red-hat-developer-hub-developer-sandbox-red-hat-openshift?source=sso).
