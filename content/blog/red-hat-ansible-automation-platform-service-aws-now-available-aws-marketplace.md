---
title: Red Hat Ansible Automation Platform Service on AWS now available in the AWS
  Marketplace
slug: red-hat-ansible-automation-platform-service-aws-now-available-aws-marketplace
authors:
- slug: hicham-mourad
  name: Hicham Mourad
published: '2024-11-20'
updated: '2026-07-29'
source: redhat
source_url: https://www.redhat.com/en/blog/red-hat-ansible-automation-platform-service-aws-now-available-aws-marketplace
description: Red Hat has released the latest cloud offering for Red Hat Ansible Automation
  Platform. Ansible Automation Platform Service on AWS is a Red Hat managed service
  available in AWS Marketplace.
topics:
- Automation and management
read_time_minutes: 4
synced_at: '2026-09-03T19:21:28Z'
---

Red Hat has released the latest cloud offering for [Red Hat Ansible Automation Platform](https://www.redhat.com/en/technologies/management/ansible). Ansible Automation Platform Service on AWS is a Red Hat managed service available in AWS Marketplace. This new offer saves customers time and money by enabling them to focus on innovation through automation instead of managing the platform. The Red Hat Ansible Automation Platform Service on AWS scales to meet the demands of enterprises, simplifies networking, and brings automation closer to workloads. Additionally, when purchased in AWS Marketplace, it applies to committed spend agreements (EDP - AWS Enterprise Discount Program).

As [hybrid cloud](https://www.redhat.com/en/topics/cloud-computing/what-is-hybrid-cloud) environments within organizations grow more complex, the need for greater efficiency and speed intensifies. To address these challenges, organizations can leverage the centralized control plane of the Ansible Automation Platform Service on AWS, enabling them to develop, manage and scale automation initiatives across their entire [IT infrastructure](https://www.redhat.com/en/topics/cloud-computing/what-is-it-infrastructure). Ansible Automation Platform acts as a powerful force multiplier, orchestrating and scaling automation across all IT domains, including directly within your AWS Cloud environment.

## AWS Marketplace deployment

You can launch the new Ansible Automation Platform Service on AWS directly in AWS Marketplace as a managed service. This, offers numerous benefits:

1. The control plane is fully managed by Red Hat, so that upgrades, patches, and maintenance tasks are handled by Red Hat’s Site Reliability Engineers (SREs). This ensures that you are always running the latest version of Ansible Automation Platform with access to new features and capabilities
2. You can seamlessly automate the management of both your AWS infrastructure and hybrid cloud resources
3. The service integrates with the AWS ecosystem you're already familiar with, including AWS billing, and enables you to benefit from any committed spend you have with AWS
4. You get world-class, premium support from Red Hat ensuring expert assistance when you need it

The diagram below shows why this service is powerful in supporting your automation while minimizing the time needed to manage the platform. We have separated the control plane from the execution plane, which means that Red Hat takes responsibility for managing the entire Ansible Automation Platform control plane infrastructure and components, while customers are responsible for configuring and deploying the execution nodes within their own infrastructure, wherever it makes the most sense. This brings the execution of automation closer to workloads and simplifies networking as the execution node just needs to be able to call home (egress to the control plane).

[![AWS Marketplace deployment_img01](https://www.redhat.com/rhdc/managed-files/AWS%20Marketplace%20deployment_img01.png)](https://www.redhat.com/rhdc/managed-files/AWS%20Marketplace%20deployment_img01.png)

How do you get started with Automation Platform Service on AWS? Simply visit the [AWS Marketplace](https://aws.amazon.com/marketplace) and search for “Red Hat Ansible Automation Platform Service on AWS” or visit the [Red Hat landing page](https://www.redhat.com/en/technologies/management/ansible/aws) for more information. Subscribe to the offering, and initiating the deployment will quickly provide you access to the solution.

## AWS integrations

For many organizations using AWS today, there’s a huge benefit in taking advantage of Ansible Automation Platform Service on AWS as noted above. If you have AWS committed spend, this solution will count towards that spend agreement.

You will have access to the Red Hat Ansible Certified Content for [AWS](https://console.redhat.com/ansible/automation-hub/repo/published/amazon/aws/) to automate the management of AWS resources. Red Hat Ansible Certified Content provides the ability to integrate with many different technologies, and simplifies automation against these technologies. Ansible Automation Platform becomes the glue that brings together and centralizes all your automation needs.

Once you’ve deployed Ansible Automation Platform, with a few simple configuration steps, you can integrate with identity providers (like Active Directory and LDAP) to provide single sign-on. In addition to these, you can use Ansible Automation Platform’s role based access control (RBAC) capabilities.

## Automation content

When using the Ansible Automation Platform Service on AWS, you will definitely want to use the Red Hat Ansible Certified Collection for AWS. With your Ansible Automation Platform subscription, you have access to all the Red Hat Certified Content available on Ansible [automation hub](https://console.redhat.com/ansible/automation-hub) from the Red Hat Hybrid Cloud Console.

[![Automation content](https://www.redhat.com/rhdc/managed-files/Automation%20content_0.png)](https://www.redhat.com/rhdc/managed-files/Automation%20content_0.png)

The AWS Collection includes over 130 + modules to interrogate, manage and automate numerous AWS resource types, such as networking, databases, AWS Kubernetes services, storage, backup, virtual machines, security groups, Identity and Access Management (IAM) and so much more.

[![Ansible automation hub](https://www.redhat.com/rhdc/managed-files/Ansible%20automation%20hub.png)](https://www.redhat.com/rhdc/managed-files/Ansible%20automation%20hub.png)

See the full list of modules on [Ansible automation hub](https://console.redhat.com/ansible/automation-hub/repo/published/amazon/aws/content/).

There’s some great automation content from Red Hat with examples to learn from if you're new to using Ansible Automation Platform Service on AWS. Here’s a GitHub repository that has automation content for automating some AWS network resources, like creating VPC networking that includes peer networks or transit networks.

<https://github.com/ansible-content-lab/aws.infrastructure_config_demos.git>

Remember to take advantage of the many Red Hat Ansible Certified Content Collections you can find on the [Red Hat Hybrid Cloud Console](https://console.redhat.com/ansible/automation-hub). There’s a high probability that the technologies you use today have certified collections here that will enable you to automate many use cases.

<https://console.redhat.com/ansible/automation-hub>

The image below shows a small subset of what’s available.

[![Red Hat Hybrid Cloud Console](https://www.redhat.com/rhdc/managed-files/Red%20Hat%20Hybrid%20Cloud%20Console.png)](https://www.redhat.com/rhdc/managed-files/Red%20Hat%20Hybrid%20Cloud%20Console.png)

## 

## Is Ansible Automation Platform just for automating in AWS?

The great thing about Ansible Automation Platform is that it doesn’t matter where you’re running it from. You’re able to automate public cloud, private cloud, physical and virtual environments, and edge resources. Obviously, one of the requirements is having proper networking configuration and connectivity. Deploy Ansible Automation Platform Service on AWS, and automate anywhere!

The automation use cases are endless, and there are so many efficiencies and savings to gain by using Ansible Automation Platform, not to mention the reduction in human errors, and the increased collaboration amongst the different IT domain teams.

## What can I do next?

To learn more about Ansible Automation Platform Service on AWS, visit the page [here](https://www.redhat.com/en/technologies/management/ansible/aws). You can watch the [demo video](https://youtu.be/yT9hGlGvBhs) covering this core automation use case for AWS - deploying and retiring cloud resources.

Experience the simple deployment of Ansible Automation Platform Service on AWS via the click-through demo [here](https://demo.arcade.software/Xe9tI8rUVc2JrEI5LprL).

Try the hands on self-paced Ansible Automation Platform on AWS labs. There’s multiple labs covering these topics:

- Cloud Operations (Day-2 operations on AWS)
- Infrastructure Optimization (Cloud control on AWS)
- Infrastructure Visibility (Infrastructure awareness and reporting on AWS)

For hands-on self-paced labs on Ansible Automation Platform, you can [visit here](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218). You can also take a look at the Ansible Automation Platform Service on AWS [documentation](https://docs.redhat.com/en/documentation/ansible_on_clouds/2.x/html/red_hat_ansible_automation_platform_service_on_aws/saas-intro).
