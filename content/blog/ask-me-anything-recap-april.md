---
title: Ask me Anything Recap - April
slug: ask-me-anything-recap-april
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2022-05-16'
updated: '2026-03-02'
source: redhat
source_url: https://www.redhat.com/en/blog/ask-me-anything-recap-april
description: For this webinar, we had an awesome group of individuals with a diverse
  talent range across multiple skill sets from Product Management, Technical Marketing
  and Engineering.
topics: []
read_time_minutes: 6
synced_at: '2026-09-03T19:20:56Z'
---

[![ask me anything](https://www.redhat.com/rhdc/managed-files/ansible/ask%20me%20anything.png)](https://www.redhat.com/rhdc/managed-files/ansible/ask%20me%20anything.png)

I recently had the opportunity to emcee an Ask me Anything webinar in April 12, These sessions are a good opportunity for the community, customers, partners and more to talk directly to Red Hat employees about what is happening on Red Hat Ansible Automation Platform and beyond. For this webinar, we had an awesome group of individuals with a diverse talent range across multiple skill sets from Product Management, Technical Marketing and Engineering:

- **Richard Henshall** - based in England, Richard is head of Product Management for Ansible Automation Platform
- **Hicham Mourad** - based in Canada, Hicham is a Technical Marketing manager for Ansible Automation Platform on Microsoft Azure
- **Anshul Behl** - also in Canada, Anshul is a Technical Marketing manager for Ansible Automation Platform
- **Mike Graves -** joining us from North Carolina, Mike is a senior software engineer working on Ansible for public clouds and Ansible for cloud native
- **Shane McDonald -** senior principal software engineer working on automation controller, automation execution environments and Podman as well as Kubernetes and Red Hat OpenShift Integration

To watch the webinar on-demand check it out here.

As it turns out, we can’t get to every question that comes in, so we had some time to review and will try to provide the Q&A right here! We also answered a series of questions in email after the event. If you still have questions, we will be doing future Ask Me Anything webinars. Once the date and registration link become available, we will update this blog with the information.

## Questions and Answers:

### How do we convince other teams to shift over to Ansible in an extremely complex environment?

You can do communities of practice, lunch and learns, offer to do demos, curate jumpstart content and use Red Hat Ansible Certified Content Collections and more. Check out this [e-book](https://www.redhat.com/en/resources/automation-architect-handbook-ebook)!

From a purely technical perspective: the new tools that are available with the Ansible Automation Platform help you with just that, like with `ansible-navigator` you can test your automation against the execution environment that you can directly use in complex and production deployment.

With private automation hub, you can set up a place to provide automation execution environments inside your organizations, so it’s used by the your automation controller as well as the automation developers providing reliable automation.

With automation mesh, you can take automation closer to where it’s needed and use execution environment to execute distributed automation for your organization. Essentially, Ansible automation on developer machines can be taken to a global server and provide the same level of reliability.

### What gotchas/caveats do you need to look for when automating Windows related tasks?

We recommend this talk that covers some common use cases and a discussion on the difference between Linux and Windows automation: [Manage Windows like Linux with Ansible](https://www.youtube.com/watch?v=FEdXUv02Dbg).

### How is network automation different from automating server administration?

Network operating systems often don’t have the ability to install software, so they cannot run an agent. This is where Ansible Automation Platform is an ideal solution with an agentless design.  As you get more and more edge devices to manage, you can see that this is an important consideration.

### How/Where can I learn more about ansible-navigator?

Check out the following links:

<https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/ansible_navigator_creator_guide/index>

<https://ansible-navigator.readthedocs.io/en/latest/>

- There are also multiple [blogs](https://www.ansible.com/blog/topic/ansible-navigator) and an [self-learning lab](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) on this topic
- Check out our Red Hat training! <https://www.ansible.com/products/ansible-training>

### I hear all the time, "anything can be automated". How do I learn more modules that I can leverage for such automation? I know how to do this with Bash scripts but how do I translate the scripts to Ansible Playbooks?

If you are a subscribing customer, go to console.redhat.com to log in and then look for Ansible automation hub under Ansible Automation Platform. There are numerous, fully supported Red Hat Ansible Certified Content Collections that are continually updated.

### How do we start to automate a simple scenario, a RHEL Server, a Cisco Switch or/and a Win10 client?

Check out our free workshop content on <https://aap2.demoredhat.com/> or our [Self-Paced Labs](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218).

### I want to populate automation controller (previously known as Ansible Tower) multiple selection survey questions with the hostnames from an inventory. How can this be done?

Not quite the same, but [check this out](https://github.com/network-automation/toolkit/blob/master/playbooks/network_backup.yml#L52) where I dynamically create a survey using the timestamps of backups.  It is really easy to programmatically change the surveys for automation controller for job templates and workflows.

### ​​Are there any docs out there for getting up and running with Ansible Automation Platform 2 using a windows only environment using Windows Services for Linux WSL?

We only support Ansible Automation Platform installed on Red Hat Enterprise Linux. For connection specifics and options, we do have a [Windows guide](https://docs.ansible.com/ansible/latest/user_guide/windows.html),: and you can check out [this blog](https://www.ansible.com/blog/connecting-to-a-windows-host).

### Does Red Hat intend to offer a redundant database configuration in Ansible Automation Platform?

Check out the following [knowledge base article](https://access.redhat.com/articles/4010491) for more information about high availability (HA) and Disaster Recovery (DR). Also, check out this blog post [New reference architecture: Deploying Red Hat Ansible Automation Platform 2.1](https://www.ansible.com/blog/new-reference-architecture-deploying-red-hat-ansible-automation-platform-2.1) for an opinionated reference architecture.

### Where can I get more examples of usage of ansible-navigator?

The `ansible-navigator` tool is an upstream project as well, if there is something you feel is not working. Please file a bug on <https://github.com/ansible/ansible-navigator> and someone should be able to answer that.

Also, you can file a customer ticket if you are a customer on <https://support.redhat.com/>.

### Collections: are the community Collections safe or should we stick with Red Hat Ansible Certified Content Collections?

Community Galaxy is free for all, so any user can publish there ideally, hence we cannot provide governance if something can work or not if downloaded from there.

But the Red Hat Ansible Certified Content Collections go through the testing and certification process, and Red Hat is ready to provide support if customers face any issues on those. Check out supported and certified content on console.redhat.com.

### Can you share a link to the Azure hosted option?

Please [fill out this form](https://www.redhat.com/en/engage/ansible-microsoft-azure-e-202110220735), and we'd be happy to reach out and work with you, and provide more information or details.

### I have been trying to convert my Bash scripts to Ansible. A problem I have come across is the output I get from Ansible plays as it is in json/yaml when filtered. Is there another way to output "register" variable to another format other than json or yaml? Perhaps something like the output you get on the terminal?

YAML/JSON actually provide you the capability to basically filter the output as you need, and there is tooling build into Ansible Automation Platform to filter the output and if you are able to use the filter plugins like `json_query` correctly, Ansible can be quite powerful and useful compared to Bash, where you might need to build things in. Check out the following [documentation](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html).

### Where can I learn more about using Ansible for managing my F5 solutions?

One great way to learn about this is through hands-on workshops. F5 built an Ansible automation workshop. You can find these at [bit.ly/F5automation](https://bit.ly/F5automation)

### Where can I find Ansible Tower documentation for a secure deployment in AWS?

Ansible Tower has been replaced by automation controller as part of Ansible Automation Platform.

I would highly recommend that you deploy Ansible Automation Platform, and take advantage of its many capabilities.  We have great documentation on how to deploy this if you want to do a self-managed implementation.

Here is [the installation guide](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/red_hat_ansible_automation_platform_installation_guide/index).

Red Hat currently also has a managed application implementation of Red Hat Ansible Automation Platform on Microsoft Azure if that’s of interest to you. You can get more [details on that here](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/red_hat_ansible_automation_platform_on_microsoft_azure_guide/index).

## ​​What can I do next?

Whether you are beginning your automation journey or are a seasoned veteran, there are a variety of resources to enhance your automation knowledge:

- [Self-paced exercises](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) - We have interactive, in-browser exercises to learn and dive into Ansible Automation Platform.
- [Trial subscription](http://red.ht/try_ansible) - Are you ready to install on-premises? Get your own trial subscription for unlimited access to all the components of Ansible Automation Platform.
- [Developer license](https://developers.redhat.com/about) - Did you know that you can get a free developer license to learn in your home lab? Register and get access to all the latest tools, technologies and community that Red Hat has to offer.
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel.](https://www.youtube.com/ansibleautomation) Be sure to check out our new web series, [Automated Live hosted by Colin McNaughton.](https://www.redhat.com/en/technologies/management/ansible/automated-live-videos)
- [Follow Red Hat Ansible](https://twitter.com/ansible) [Automation Platform](https://www.youtube.com/ansibleautomation) [on Twitter](https://twitter.com/ansible) - Do you have questions or an automation project you want to show off? Tweet at us!
