---
title: 'What''s new in Ansible Automation Platform 2: private automation hub'
slug: whats-new-in-ansible-automation-platform-2-private-automation-hub
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2021-10-06'
updated: '2026-02-27'
source: redhat
source_url: https://www.redhat.com/en/blog/whats-new-in-ansible-automation-platform-2-private-automation-hub
description: Ansible Automation Platform 2 includes private automation hub 4.3, which
  makes it easier to collaborate on,  publish, and deliver automation content.
topics: []
read_time_minutes: 5
synced_at: '2026-09-03T19:21:01Z'
---

[![AAP 2 gray rising a](https://www.redhat.com/rhdc/managed-files/ansible/AAP%202%20gray%20rising%20a.png)](https://www.redhat.com/rhdc/managed-files/ansible/AAP%202%20gray%20rising%20a.png)

We are excited to announce that the Ansible Automation Platform 2 release includes [private automation hub 4.3](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.0/html/installing_and_upgrading_private_automation_hub/index). Private automation hub provides automation developers the ability to collaborate and publish their own automation content and streamline delivery of Ansible code within their organization.

Private automation hub in Ansible Automation Platform 2 primarily delivers support for automation execution environments. Execution environments are a standardized way to define, build and distribute the environments that the automation runs in. In a nutshell, automation execution environments are container images that allow for easier administration of Ansible by the platform administrator. If you are unfamiliar with execution environments, please [refer to this blog](https://www.redhat.com/blog/whats-new-in-ansible-automation-platform-2-automation-execution-environments?hs_preview=batunIYu-56182547470) written by Technical Marketing manager Anshul Behl.

Private automation hub will serve as the on-premises execution environment container image repository for customers who wish to use this feature, aimed at customers who run the platform on physical or virtual environments. Ansible Automation Platform will seamlessly integrate with private automation hub for publishing and pulling execution environment container images.

#### **Who uses private automation hub?**

Private automation hub is intended for curating automation content from creators and making it seamlessly accessible to operators. It makes it easy to share these execution environments, which make it simple to package everything into turnkey automation, to other developers or operators for production use cases across your organization. [Automation controller](https://www.redhat.com/products/controller) can sync directly to private automation hub, pull curated execution environments to use and provide governance around what is available.

The intended persona is the administrator or operator that is in charge of curating and distributing automation content across an organization. This is commonly referred to as a distribution engineer or a release engineer. Picture a Venn diagram between your content creator and your operator/administrator; private automation hub is geared for the person that interacts with both circles (or could sit in either box, depending on your organizational structure).

- Automation creators develop Ansible Playbooks, roles and modules.
- Automation architects elevate automation across teams to align with IT processes and streamline adoption.
- Automation operators ensure the automation platform and framework are operational.

These roles are not necessarily dedicated to a person or team. Many organizations assign multiple roles to people or outsource specific automation tasks based on their needs.

[![](https://www.redhat.com/rhdc/managed-files/ansible/%5BDRAFT%5D%20MBU%20%7C%20Blog%20%7C%20Ansible%20Automation%20Platform%202.0%20New%20and%20improved%20Private%20Automation%20Hub.png)](https://www.redhat.com/rhdc/managed-files/ansible/%5BDRAFT%5D%20MBU%20%7C%20Blog%20%7C%20Ansible%20Automation%20Platform%202.0%20New%20and%20improved%20Private%20Automation%20Hub.png)

#### **Using private automation hub**

In the high level diagram above, you can see that automation developers will still create content like they did before this release. The command line utility execution environment builder ansible-builder creates an execution environment based on your execution-enviornment.yml definition file as outlined [in this blog](https://access.redhat.com/articles/6177982). Automation creators can publish content to private automation hub.

*Practical Example***:**

For this example, we will pull a supported automation execution environment from the Red Hat Ecosystem Catalog ([registry.redhat.io](http://registry.redhat.io/)), tag it locally and then push it to private automation hub.  First we need to authenticate to [registry.redhat.io](http://registry.redhat.io/).

For example, on Red Hat Enterprise Linux 8:

$ podman login registry.redhat.io

Username: [seanc@redhat.com](mailto:seanc@redhat.com)

Password: \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*

Login Succeeded!

$

We can now download one of the supplied execution environments with Ansible Automation Platform 2. At launch, there are three fully supported execution environments:

- Minimal ([ee-minimal-rhel8](https://catalog.redhat.com/software/containers/ansible-automation-platform-20-early-access/ee-minimal-rhel8/60e4bd0fdb72db7d0fadcf31)) - Contains Ansible Core 2.11 built on top of UBI8 and Python 3.8. This image doesn’t contain any Collections. You can use this image as the base image to build additional execution environments with your custom Collections or the certified Collections available on Ansible automation hub.
- Supported ([ee-supported-rhel8](https://catalog.redhat.com/software/containers/ansible-automation-platform-20-early-access/ee-supported-rhel8/60e4bc63c1af85c3015b8588?container-tabs=overview)) - This is the default image available with the automation controller. It is built on top of the minimal image and contains Ansible Content Collections developed, maintained and supported by Red Hat.
- Compatibility ([ee-29-rhel8](http://ansible-automation-platform-20-early-access/ee-29-rhel8)) - Contains Ansible 2.9 and all the required Ansible dependencies. This image is best for customers who are planning to migrate from Ansible Automation Platform 1.2  to 2.0.

For this example, we will download the **ee-minimal-rhel8** execution environment. However, private automation hub can host multiple execution environments, and automation developers can create their own using the command line tool ansible-builder,[as documented here](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.0-ea/html-single/ansible_builder_guide/index?lb_target=production).

$ podman pull registry.redhat.io/<container image name>:<tag>

$ podman pull registry.redhat.io/ansible-automation-platform-20-early-access/ee-supported-rhel8:2.0.0-11

Trying to pull registry.redhat.io/ansible-automation-platform-20-early-access/ee-supported-rhel8:2.0.0-11...

Getting image source signatures

Checking if image destination supports signatures

Copying blob 4644f822544e skipped: already exists

Copying blob 4d0d850cd4ad skipped: already exists

Copying blob 96965a3a8424 skipped: already exists

Copying blob 3bbba07a88b0 skipped: already exists

Copying blob 895c54e89fd8 [--------------------------------------] 0.0b / 0.0b

Copying config 408bd0e3a5 done

Writing manifest to image destination

Storing signatures

408bd0e3a56123cabe76a5afaa16c7487173e74f745f6051a139813d702a0c

To list all downloaded automation execution environments, use the podman images command.

$ podman images

REPOSITORY TAG IMAGE ID CREATED SIZE

registry.redhat.io/ansible-automation-platform-20 early-access/ee-supported-rhel8 latest 408bd0e3a561 6 days ago 920 MB

After you pull images from a registry, tag them for use in your private automation hub container registry:

$ podman tag registry.redhat.io/[container image name]:[tag] [automation hub URL]/[container image name]

For this environment, the private automation hub instance does not have a DNS setup yet. I will use the IP address of the host instead:

$ podman tag registry.redhat.io/ansible-automation-platform-20-early-access/ee-supported-rhel8 192.168.1.5/example\_ee

We will now see the new container image tag example\_ee:

$ podman tag registry.redhat.io/ansible-automation-platform-20-early-access/ee-supported-rhel8 192.168.1.5/example\_ee

Use the credentials you set up during the installation to authenticate to private automation hub:

$ podman login -u=[username] -p=[password] [automation-hub-url]

For this environment, it would look like this:

$ podman login --tls-verify=false -u="admin" -p="mypassword" 192.168.1.5

Login Succeeded!

The --tls-verify=false flag was used because DNS and TLS certificates were not set up yet.

Finally, we can publish using the follow command:

$ podman push [automation-hub-url]/[container image name]

For this environment, it would look like this:

$ podman push --tls-verify=false 192.168.1.5/example\_ee

Getting image source signatures

Copying blob d7ecef9dcc97 done

Copying blob 9132e95b7c1b done

Copying blob bc7bdf0ec1b9 done

Copying blob 0122cc8a95bd done

Copying blob 12a68283d0e0 done

Copying config 408bd0e3a5 done

Writing manifest to image destination

Storing signatures

$ podman --version

podman version 3.2.2

Logging into the Web UI, you will notice there is a new Container Registry and the example\_ee is displayed:

[![](https://www.redhat.com/rhdc/managed-files/ansible/%5BDRAFT%5D%20MBU%20%7C%20Blog%20%7C%20Ansible%20Automation%20Platform%202.0%20New%20and%20improved%20Private%20Automation%20Hub-2.png)](https://www.redhat.com/rhdc/managed-files/ansible/%5BDRAFT%5D%20MBU%20%7C%20Blog%20%7C%20Ansible%20Automation%20Platform%202.0%20New%20and%20improved%20Private%20Automation%20Hub-2.png)

#### **Synchronize private automation hub with automation controller**

To synchronize execution environments with automation controller, create a Container Registry credential.

[![](https://www.redhat.com/rhdc/managed-files/ansible/%5BDRAFT%5D%20MBU%20%7C%20Blog%20%7C%20Ansible%20Automation%20Platform%202.0%20New%20and%20improved%20Private%20Automation%20Hub-3.png)](https://www.redhat.com/rhdc/managed-files/ansible/%5BDRAFT%5D%20MBU%20%7C%20Blog%20%7C%20Ansible%20Automation%20Platform%202.0%20New%20and%20improved%20Private%20Automation%20Hub-3.png)

The authentication URL is just the DNS name or IP address of your private automation hub host (no https header).

Next, under “Execution Environments” create a new execution environment and source the credential you just created. Refer to the [documentation for additional information.](https://docs.ansible.com/automation-controller/latest/html/userguide/execution_environments.html#use-an-ee-in-jobs)

[![](https://www.redhat.com/rhdc/managed-files/ansible/%5BDRAFT%5D%20MBU%20%7C%20Blog%20%7C%20Ansible%20Automation%20Platform%202.0%20New%20and%20improved%20Private%20Automation%20Hub-1.png)](https://www.redhat.com/rhdc/managed-files/ansible/%5BDRAFT%5D%20MBU%20%7C%20Blog%20%7C%20Ansible%20Automation%20Platform%202.0%20New%20and%20improved%20Private%20Automation%20Hub-1.png)

Finally on the job template (under templates) assign the execution environment as highlighted in the red square below:

[![](https://www.redhat.com/rhdc/managed-files/ansible/%5BDRAFT%5D%20MBU%20%7C%20Blog%20%7C%20Ansible%20Automation%20Platform%202.0%20New%20and%20improved%20Private%20Automation%20Hub-4.png)](https://www.redhat.com/rhdc/managed-files/ansible/%5BDRAFT%5D%20MBU%20%7C%20Blog%20%7C%20Ansible%20Automation%20Platform%202.0%20New%20and%20improved%20Private%20Automation%20Hub-4.png)

Want to learn more about automation controller? Read the blog: [What’s New in Ansible Automation Platform 2: automation controller](https://www.redhat.com/blog/whats-new-in-ansible-automation-platform-2-automation-controller?hs_preview=LPfWTeMm-56159544176) by Technical Marketing Manager Craig Brandt.

Documentation references:

- [Automation controller - Use an execution environment in jobs](https://docs.ansible.com/automation-controller/latest/html/userguide/execution_environments.html#use-an-ee-in-jobs)
- [Private automation hub - Managing containers in private automation hub](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.0-ea/html-single/managing_containers_in_private_automation_hub/index?lb_target=production)

#### **What's****next?**

- If you’re ready to get hands on, we have [self-paced interactive labs available](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) to explore Ansible Automation Platform 2.
- If you are a Red Hat customer, you can visit the [Ansible Automation Platform 2 landing page](https://red.ht/AAP-20) in the Red Hat Customer Portal that consolidates all of the documentation and guidance available to you.
- To learn more about new Ansible Automation Platform features and components, check out the [updated product overview page on ansible.com](https://www.ansible.com/products/automation-platform). You can also consult our new interactive features guide.
- Make sure to catch up on announcements, demos, keynotes and more great content from [AnsibleFest 2021](http://ansiblefest.com), which is now available on-demand.
- [Please reach out to your local Red Hat representative](https://www.ansible.com/contact-us) to assist your organization in getting started with Ansible Automation Platform 2.

---

### About the author

[![Sean Cavanaugh](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/sean_profile.jpg?itok=6yG8an6S)](https://www.redhat.com/en/authors/sean-cavanaugh)

[### Sean Cavanaugh

Principal Technical Marketing Manager](https://www.redhat.com/en/authors/sean-cavanaugh)

Sean is a Principal Technical Marketing Manager, Ansible, where he brings over 10 years of experience building and automating computer networks. Sean previously worked for both Cumulus Networks (acquired by Nvidia) and Cisco Systems where he helped customers deploy, manage and automate their network infrastructure. He resides in Chapel Hill, NC with his wife and children and tweets from [@IPvSean](https://twitter.com/ipvsean).

[More from this author](https://www.redhat.com/en/authors/sean-cavanaugh)

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
