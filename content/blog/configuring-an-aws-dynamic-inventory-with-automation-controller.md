---
title: Configuring an AWS dynamic inventory with Automation controller
slug: configuring-an-aws-dynamic-inventory-with-automation-controller
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2022-03-30'
updated: '2025-11-19'
source: redhat
source_url: https://www.redhat.com/en/blog/configuring-an-aws-dynamic-inventory-with-automation-controller
description: Automation controller, the control plane and webUI for Red Hat Ansible
  Automation Platform, uses this IAM credential to build an inventory and execute
  automated tasks on your AWS account.
topics: []
read_time_minutes: 4
synced_at: '2026-09-03T19:21:47Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

One of the core components of Ansible is [inventories](https://docs.ansible.com/automation-controller/latest/html/userguide/inventories.html). In its most basic form, an inventory provides host information to Ansible so it can trigger the tasks on the right host or system. In most environments, the static inventory is sufficient for the Ansible control node to work from, however as we expand our use of automation, we need to transition to more effective methods of gathering ever-changing environment details.

This is where the use of a [dynamic inventory](https://docs.ansible.com/ansible/latest/user_guide/intro_dynamic_inventory.html) is beneficial. This allows the platform to gather information for the inventory from environments that are not static sources. A prime example of this is using a dynamic inventory plugin to gather inventory information from a cloud provider or hypervisor, enabling you to keep an inventory up to date with instance details.

Amazon Web Services (AWS) is one of the biggest public cloud providers used around the world. Organizations use their Elastic Compute Cloud services (EC2) for their workflows, however managing an inventory for your instances running on AWS would typically have to be done manually, which is problematic and time consuming. Using the AWS Identity and Access Management interface (IAM), we are able to get programmatic access to the AWS account. Automation controller, the control plane and webUI for Red Hat Ansible Automation Platform, uses this IAM credential to build an inventory and execute automated tasks on your AWS account.

So let's dive in!

## Preparing Amazon Web Services

To be able to access AWS instance information for our dynamic inventory, we will need to create an IAM user on our AWS account. Navigate to the IAM section of your AWS account and select “users” followed by the “add users” button.

[![](https://www.redhat.com/rhdc/managed-files/ansible/WW3jW9sW0TqPjcMLUEAtDQ9RiV1vscuhAlSs6j4R9ZiCo2w_np5AOQo-5cZlVsS0n6P6VUH3YdgXXJL04JJiUtsliEaa6kqGq26cte0rCY9GeQlgNWPNk5chQO-7yUD2noxfJs1q.png)](https://www.redhat.com/rhdc/managed-files/ansible/WW3jW9sW0TqPjcMLUEAtDQ9RiV1vscuhAlSs6j4R9ZiCo2w_np5AOQo-5cZlVsS0n6P6VUH3YdgXXJL04JJiUtsliEaa6kqGq26cte0rCY9GeQlgNWPNk5chQO-7yUD2noxfJs1q.png)

The account should be configured to have programmatic access to create the keys needed for automation controller.

[![](https://www.redhat.com/rhdc/managed-files/ansible/STttu8481MEhaDxvGsY6tkv3X2Hl3-o4-9PyX2lpY_Huuy3VJolvMLAf1t4WyweLg65MwP0WAfDsPjYvFfBxDaB2UM6dYUf2aMErMO9s-qt_EK03IqswwrzjQK3irtwZtBG3P6d9.png)](https://www.redhat.com/rhdc/managed-files/ansible/STttu8481MEhaDxvGsY6tkv3X2Hl3-o4-9PyX2lpY_Huuy3VJolvMLAf1t4WyweLg65MwP0WAfDsPjYvFfBxDaB2UM6dYUf2aMErMO9s-qt_EK03IqswwrzjQK3irtwZtBG3P6d9.png)

Next we need to set permissions for this user account. Set the permissions policy to “Attach existing policies directly” and select "AmazonEC2ReadOnlyAccess” as your permission policy.

You can also add tags to this credential for better management.

Once the credential has been created, you will receive a token and secret key to use in our automation controller.

## Configuring Automation Controller

Automation controller has support for AWS credentials. For us to add the IAM credentials to our controller we will first create a credential for AWS. Under “Resources” on the controller, we select “Credentials” and under “Credential Type”, we select “Amazon Web Services”.

[![](https://www.redhat.com/rhdc/managed-files/ansible/zh7S4IMZs4Jd6TzvuNboXBge3AeX8jX5bo1GFKfbmmylWUYMY7nGoF_pb-d2HAqh4eRQkRWBFY8xPLWO20bzVfZwXTOvsF8-q8PCZEX6BkfEItzdyzSTVVWA_wvTwFI46MKo1ep8.png)](https://www.redhat.com/rhdc/managed-files/ansible/zh7S4IMZs4Jd6TzvuNboXBge3AeX8jX5bo1GFKfbmmylWUYMY7nGoF_pb-d2HAqh4eRQkRWBFY8xPLWO20bzVfZwXTOvsF8-q8PCZEX6BkfEItzdyzSTVVWA_wvTwFI46MKo1ep8.png)

Once we have populated the details with the previously provided token and secret key, we are ready to configure the dynamic inventory.

We can navigate back to the resources on our automation controller and select “Inventories”. To add an inventory, we need to provide a name and organization. Navigating to the “details” of this inventory we have created, we can edit the sources for our inventory.

[![](https://www.redhat.com/rhdc/managed-files/ansible/ZMmT5cWpONm2NiUmjN-2JAorGPlou-dsDSwZKcnRCLqBz3ogh_tCeu268hbdwzkGGh75qXlKrWkpn3wRdUODji-JCAtG-HCYy_0CLQYlantd42Yf-A2r1BNUzo0vrD4a56fVx0Fp.png)](https://www.redhat.com/rhdc/managed-files/ansible/ZMmT5cWpONm2NiUmjN-2JAorGPlou-dsDSwZKcnRCLqBz3ogh_tCeu268hbdwzkGGh75qXlKrWkpn3wRdUODji-JCAtG-HCYy_0CLQYlantd42Yf-A2r1BNUzo0vrD4a56fVx0Fp.png)

Automation controller lists a number of available inventory sources that can be used for dynamic inventories. We are going to select the “Amazon EC2” source.

In addition to selecting the source, we need to select a default automation execution environment for the dynamic inventory plugin.

[![](https://www.redhat.com/rhdc/managed-files/ansible/w-V7HWNamB9OcuUZBCE_WJPd5yyr0chh1lFUvH4hN3aJ5RDV5kl-x-_M1I3tMbz0yqMDYjxHGwH9wGMqqtoxd7QYGeSu-UzqCVS8T35__xXwCj49rUUWszu_hi0xyVWazweACaFK.png)](https://www.redhat.com/rhdc/managed-files/ansible/w-V7HWNamB9OcuUZBCE_WJPd5yyr0chh1lFUvH4hN3aJ5RDV5kl-x-_M1I3tMbz0yqMDYjxHGwH9wGMqqtoxd7QYGeSu-UzqCVS8T35__xXwCj49rUUWszu_hi0xyVWazweACaFK.png)

To configure the source details for the dynamic inventory, we need to supply the credentials we had previously configured in the automation controller.

We may also want to specify update options for the inventory and additional variables to assist in filtering the results the controller will retrieve with source variables.

If we want to group instances based on regions, we can use something like the following under source variables:

```
keyed_groups:
 - key: placement.region
    prefix: aws_region
```

This will tell the automation controller to create groups in the inventory based on the AWS regions.

There are additional settings here that are pretty powerful should you wish to use them:

**Host Filter**: Specifies matching hostnames to be imported.

**Enabled Variable**: Specifies the automation controller to retrieve the enabled state from the given dictionary of host variables.

**Enabled Value**: The value to enable on import with the specified Enabled Variable.

Once we have submitted these changes, we can synchronize the inventory that will allow the automation controller to look up the instances and populate the inventory.

[![](https://www.redhat.com/rhdc/managed-files/ansible/U9PMybcIFP-O6mLpbNUKFhi3SRGpayBdafQCRW6-R9vooUAtkYlUWi_193WrEWjejTc5Z3IBWvEu7uJFpNq5UkPMORIp11Z_UWT4V3cPbrVFD91sTOHL98IW9zUnsgWZIkr1LGaO.png)](https://www.redhat.com/rhdc/managed-files/ansible/U9PMybcIFP-O6mLpbNUKFhi3SRGpayBdafQCRW6-R9vooUAtkYlUWi_193WrEWjejTc5Z3IBWvEu7uJFpNq5UkPMORIp11Z_UWT4V3cPbrVFD91sTOHL98IW9zUnsgWZIkr1LGaO.png)

We are now ready to use our dynamic inventory and trigger our templates and workflows against AWS instances. 

## What can I do next?

Whether you are beginning your automation journey or a seasoned veteran, there are a variety of resources to enhance your automation knowledge:

- [Self-paced exercises](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) - We have interactive, in-browser exercises to learn and dive into Ansible Automation Platform.
- [Trial subscription](http://red.ht/try_ansible) - Are you ready to install on-premises? Get your own trial subscription for unlimited access to all the components of Ansible Automation Platform.
- [Developer license](https://developers.redhat.com/about) - Did you know that you can get a free developer license to learn in your home lab? Register and get access to all the latest tools, technologies and community that Red Hat has to offer.
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel.](https://www.youtube.com/ansibleautomation) Be sure to check out our new web series, [Automated Live hosted by Colin McNaughton.](https://www.redhat.com/en/technologies/management/ansible/automated-live-videos)
- [Follow Red Hat Ansible](https://twitter.com/ansible) [Automation Platform](https://www.youtube.com/ansibleautomation) [on Twitter](https://twitter.com/ansible) - Do you have questions or an automation project you want to show off? Tweet at us!

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

### [The architecture of autonomy: How ING built a future-proof tech strategy](https://www.redhat.com/en/blog/architecture-autonomy-how-ing-built-future-proof-tech-strategy)

Blog post

### [The last mile problem in agentic AI: Why tool calling reliability is harder than it looks](https://www.redhat.com/en/blog/last-mile-problem-agentic-ai-why-tool-calling-reliability-harder-it-looks)

Original podcast

### [How Red Hat cleared IT debt for scalable AI](https://www.redhat.com/en/technically-speaking/ai-ready-data-cleanup)

Original podcast

### [Virtualization Is (Still) King | Compiler](https://www.redhat.com/en/compiler-podcast/virtualization-ai)
