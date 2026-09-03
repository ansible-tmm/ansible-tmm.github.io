---
title: Introducing Red Hat Ansible Automation Platform 2.1
slug: introducing-red-hat-ansible-automation-platform-2.1
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2021-12-02'
updated: '2026-03-05'
source: redhat
source_url: https://www.redhat.com/en/blog/introducing-red-hat-ansible-automation-platform-2.1
description: Red Hat Ansible Automation Platform 2.1 is available now! Create, manage
  and scale automation with more ease and efficiency than ever before.
topics: []
read_time_minutes: 8
synced_at: '2026-09-03T19:20:59Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** Red Hat Ansible Automation Platform 2.1 is available now! Create, manage and scale automation with more ease and efficiency than ever before.

<!-- blog-enrichment:end -->

[![](https://www.redhat.com/rhdc/managed-files/ansible/YgQ-g6F0LaaLWI9-f9K6lnd2TVCleZw1ILN_vBEOBqOxmAjkHfVjX9KiwhH8JwOIS976Wnow7uG7sbJ4lFB-FVCRA0b98woBPzsJilys5JVu2uGkcZOyP30tNWh73CU1DSLK3o1k.png)](https://www.redhat.com/rhdc/managed-files/ansible/YgQ-g6F0LaaLWI9-f9K6lnd2TVCleZw1ILN_vBEOBqOxmAjkHfVjX9KiwhH8JwOIS976Wnow7uG7sbJ4lFB-FVCRA0b98woBPzsJilys5JVu2uGkcZOyP30tNWh73CU1DSLK3o1k.png)

We are thrilled to announce the general availability of Red Hat Ansible Automation Platform 2.1. This is the follow-on to the Ansible Automation Platform 2.0 Early Access released this summer, and [announced](https://www.redhat.com/en/about/press-releases/red-hat-ansible-automation-platform-2-drives-cloud-native-automation-and-helps-developers-become-automators) at AnsibleFest 2021. Red Ansible Automation Platform 2.1 introduces major features that allow customers to onboard more easily with even more flexible automation architectures and use cases. Ansible Automation Platform 2.1 is the culmination of many years of reimagining how enterprise automators automate for today and tomorrow.

You can download the latest version directly from the [Red Hat Customer Portal](https://access.redhat.com/downloads/content/480/), or sign up for a free trial at [red.ht/try\_ansible](http://red.ht/try_ansible). Ansible Automation Platform is the Ansible you know and love, designed for the enterprise. I am going to summarize [Andrius Benokraitis’ blog post](https://www.ansible.com/blog/introducing-ansible-automation-platform-2) from September, when Ansible Automation Platform 2 was announced, and expand on some key developments from 2.0 to 2.1.

> [!callout type=tmm label="TMM resource" title="Solution Guides" url="https://ansible-tmm.github.io/solution-guides/" cta="Browse guides"]
> Outcome-focused guides for infrastructure and IT automation challenges.

[[![aap 2 ebook copy](https://www.redhat.com/rhdc/managed-files/ansible/aap%202%20ebook%20copy.png)](https://www.redhat.com/rhdc/managed-files/ansible/aap%202%20ebook%20copy.png)](https://www.redhat.com/en/resources/ansible-automation-platform-2-ebook)

*Take a look at our latest e-book to learn what common automation roles you can expect from Red Hat Ansible Automation Platform 2.*

**First, some general information**:

- The Ansible Automation Platform [life cycle page](https://access.redhat.com/support/policy/updates/ansible-automation-platform) has been updated.
- Moving forward, every Ansible Automation Platform minor release will now have its own unique Red Hat Subscription Management repo, which requires an Ansible Automation Platform subscription.

**Now, some official product documentation updates:**

- The following are the new guides developed and released in 2.1:  
  - [Installing and Configuring Central Authentication Guide](http://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html-single/installing_and_configuring_central_authentication_for_the_ansible_automation_platform/)
  - [Automation mesh Guide](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/red_hat_ansible_automation_platform_automation_mesh_guide)
  - [Ansible Platform Operator Installation Guide](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/red_hat_ansible_automation_platform_operator_installation_guide)
- The following are the existing guides with major additions:
  - [Ansible automation hub: How to deploy a high availability automation hub](http://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html-single/deploying_a_high_availability_automation_hub/)
  - [Red Hat Insights for Ansible Automation Platform: Introduction to Reports](http://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html-single/viewing_reports_about_your_ansible_automation_environment/)
  - [Ansible Security Automation Guide: How to automate network intrusion detection and prevention systems](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/red_hat_ansible_security_automation_guide)
- All Documentation updates can also be found [online](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/), including the updated release notes.

#### New to Ansible Automation Platform 2.1: automation mesh

[Automation mesh](https://www.ansible.com/products/automation-mesh) ([documentation)](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/red_hat_ansible_automation_platform_automation_mesh_guide/index): This is the newest addition to Ansible Automation Platform, and replaces the isolated nodes feature in 1.2. By combining automation execution environments in version 2.0 with automation mesh in version 2.1, the automation control plane and execution plane are fully decoupled, making it easier to scale automation across the globe. You can now run your automation as close to the source as possible, without being bound to running automation in a single data center. With automation mesh, you can create execution nodes right next to the source (for example, a branch office in Johannesburg, South Africa) while execution is deployed on our automation controller in Durham, NC.

> [!callout type=tmm label="TMM resource" title="Workshops and Labs" url="https://labs.demoredhat.com/" cta="Launch a lab"]
> Launch guided lab environments for Ansible and Red Hat technologies.

[![](https://www.redhat.com/rhdc/managed-files/ansible/HlT3VHI5pW_NCbwu_NAKVi8OhCG74ZX54X7fJXiJti1rF8Aije_HHp3I3KZ29mPccCSFXbOOjDbTkGO4HT2YnRZ2WyYuB6rRKLbSmmX7TXPeMKI8fWn7-Q8pMoC3RcAFZnG-7kqs.png)](https://www.redhat.com/rhdc/managed-files/ansible/HlT3VHI5pW_NCbwu_NAKVi8OhCG74ZX54X7fJXiJti1rF8Aije_HHp3I3KZ29mPccCSFXbOOjDbTkGO4HT2YnRZ2WyYuB6rRKLbSmmX7TXPeMKI8fWn7-Q8pMoC3RcAFZnG-7kqs.png)

Automation mesh adds:

- **Dynamic cluster capacity**. You can increase the amount of execution capacity as you need it.
- **Global scalability**. The execution plane is now resilient to network latency and connection interruptions and improves communications.
- **Secure automation**. Bi-directional communication between execution nodes and control nodes that include full TLS authentication and end-to-end encryption.

Check out this [automation mesh demo](https://events.ansiblefest.redhat.com/widget/redhat/ansible21/sessioncatalog/session/1627933288858001bAH4) by Shane McDonald and Craig Brandt performed at AnsibleFest 2021 (skip to 22:38). Also, stay tuned for a forthcoming blog that will explore automation mesh in greater depth.

#### Updated automation execution environments

Recently, [automation execution environments](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2-automation-execution-environments) replaced Ansible Engine in 1.2 in a much more portable and flexible package.

In Ansible Automation Platform 2.1, there is an updated set of prebuilt, supported automation execution environments now available in the Red Hat container registry. These images can be used in different capacities in your environment and are provided as part of the Ansible Automation Platform subscription. All supported automation execution environments are hosted in a parent repository called [ansible-automation-platform-2](https://catalog.redhat.com/software/containers/search?q=ansible&p=1&build_categories_list=Automation%20Execution%20Environment). For convenience, all three automation execution environments are now included as part of the bundled 2.1 installer.

**The following pre-built environments have been updated:**

- Minimal (ee-minimal-rhel8) - Contains Ansible Core 2.12 built on top of UBI8 and python-3.8. This image doesn’t contain any Collections; you can use this as the base image to build additional automation execution environments with your custom Collections or the Red Hat Ansible Certified Content Collections available on Ansible automation hub.
- Supported (ee-supported-rhel8) - This is the default image available with the automation controller. It is built on top of the minimal image and contains all updated Ansible Content Collections officially supported by Red Hat.
- Ansible 2.9 (ee-29-rhel8) - Contains Ansible-2.9 and all the required Ansible dependencies. This image is best for customers who are planning to migrate to Ansible Automation Platform 2.1 from Ansible Automation Platform 1.2.

#### Updated for disconnected environments

With the Ansible Automation Platform 2.1 release, installation in a disconnected environment now supports the Red Hat Ansible Automation Platform Operator for Red Hat OpenShift. For more information on this, please refer to the [official product documentation](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/).

#### Added central authentication functionality

With any enterprise software solution, the need for single sign-on (SSO) becomes increasingly important. As Ansible Automation Platform 2 continues to release additional related components, so is the need to easily authenticate between them in a standardized way. The first of many components to leverage SSO is private automation hub, including the Red Hat Ansible Automation Platform Operator. This enhancement lays the groundwork for additional parts of Ansible Automation Platform to also be SSO-enabled in future releases.

#### A recap: Ansible Automation Platform 2 component overview

Ansible Automation Platform 2 introduced an entire suite of tools and components that enables enterprises to scale automation across their organizations. Ansible Automation Platform is no longer just an upstream command line Ansible package with support, nor is the platform simply just a graphical user interface for Ansible. Let's look at a high level diagram that details the different components available:

[![](https://www.redhat.com/rhdc/managed-files/ansible/QmISgEecN9su4FHpnfPBvcXlwrzz7la8KsUaFlVQmX_TPd_2Sn2Q5CLVukilgWINUF6c3F467z78fyIbMF2GN8rx0ez0l6MWXdp-4xJQRvxcJv3_0Tjq67s61chjNQXGL1rJ2OuQ.png)](https://www.redhat.com/rhdc/managed-files/ansible/QmISgEecN9su4FHpnfPBvcXlwrzz7la8KsUaFlVQmX_TPd_2Sn2Q5CLVukilgWINUF6c3F467z78fyIbMF2GN8rx0ez0l6MWXdp-4xJQRvxcJv3_0Tjq67s61chjNQXGL1rJ2OuQ.png)

There are a lot of components besides just the well known “ansible-\*” binary command line tools. Red Hat has developed multiple components to help customers create, manage and scale their automation. Let’s break these down and highlight what has been released!

**Execution environment builder** ([documentation](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/ansible_builder_guide))**:** This is a command line tool that helps automation creators quickly package together their automation into containerized images called automation execution environments .

**Ansible content tools:** This refers to fully supported components that help people create automation content. For example, the command line tool “ansible-test” helps IT automators test their automation content ([documentation](https://docs.ansible.com/ansible/latest/dev_guide/testing.html#developing-testing)). We’re working towards adding full support for the [Ansible VS code extension](https://www.ansible.com/resources/webinars-training/using-new-vs-code-extension-for-ansible), as well as other creator tools.

**Ansible Content Collections:** With Ansible Automation Platform 2, we have disaggregated automation content (roles, playbooks, modules, plugins, etc.) from the execution component ansible-core (e.g. ansible-playbook, etc). A good analogy for this is that I don’t have to upgrade my phone to grab the newest version of my favorite mobile game. By disaggregating automation content, it allows us to asynchronously release Ansible Content Collection updates and continually improve automation. If you need help on understanding what a Collection is, check out this [YouTube video](https://www.youtube.com/watch?v=WOcqhk7TdYc). We have continually added new automation content for multiple domains, including:

- Infrastructure ([Red Hat](https://console.redhat.com/ansible/automation-hub/repo/published/redhat/), [Windows](https://console.redhat.com/ansible/automation-hub/repo/published/ansible/windows))
- Cloud Native ([Kubernetes](https://console.redhat.com/ansible/automation-hub/repo/published/kubernetes/core) and [Red Hat OpenShift](https://console.redhat.com/ansible/automation-hub/repo/published/redhat/openshift))
- Public Cloud ([AWS](https://console.redhat.com/ansible/automation-hub/repo/published/amazon/aws), [Azure](https://console.redhat.com/ansible/automation-hub/repo/published/azure), [GCP](https://console.redhat.com/ansible/automation-hub/repo/published/google/cloud))
- Private Cloud ([VMware](https://console.redhat.com/ansible/automation-hub/repo/published/vmware))
- Network Automation ([Arista, Cisco, Juniper, Vyos](https://console.redhat.com/ansible/automation-hub/repo/published/ansible/network))
- Security Automation ([Checkpoint](https://console.redhat.com/ansible/automation-hub/repo/published/check_point), [Cisco](https://console.redhat.com/ansible/automation-hub/repo/published/cisco/asa), [IBM](https://console.redhat.com/ansible/automation-hub/repo/published/ibm/qradar))

You can check out all the certified and fully supported Collections on [Ansible automation hub on console.redhat.com](https://console.redhat.com/ansible/automation-hub).

**Automation content navigator** ([documentation](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/ansible_navigator_creator_guide/index)): A new command-line component for automation creators that includes an interactive text-based user interface (TUI).  Automation content navigator (ansible-navigator) allows Ansible experts to easily reuse their operational knowledge of traditional Ansible commands and methodologies (e.g. ansible-playbook) with support for automation execution environments. Automation content navigator also allows the ability to quickly zoom in and out of plays and filter output on the fly, enhancing the play recap experience that automation engineers have come to know and love.  I also highly recommend watching my colleague’s YouTube video [Authoring content quickly using ansible-navigator](https://youtu.be/Upisw3Pv294).

**Automation controller** ([documentation](https://docs.ansible.com/automation-controller/latest/html/administration/index.html)): the Web User Interface (webUI) and API (Application Programming Interface) for Ansible Automation Platform. This replaces the component formerly known as Red Hat Ansible Tower. However, it goes above and beyond the old architecture by decoupling the control plane and execution plane so the execution capacity is no longer tied to the same node as the graphical interface. For more information on this architectural change, I recommend reading Craig Brandt’s blog post, [What's new in Ansible Automation Platform 2: automation controller](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2-automation-controller).

**Automation execution environments** ([documentation](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/)): Simply put, these are container images that can be utilized as Ansible control nodes. They contain the Python package dependencies (e.g. boto3 for Amazon Web Services), [system level dependencies](https://docs.opendev.org/opendev/bindep/latest/readme.html) (e.g. Linux packages gcc, jq) and Ansible Content Collections bundled with a version of ansible-core to create a self-contained runtime environment for your Ansible Playbooks. Both command-line ansible-navigator and the WebUI/API driven automation controller can perform execution environments, making it easier to go from creating and testing your automation playbooks to operatilizing and putting them into production quicker and more effortlessly. For more information on automation execution environments, please check out the blog post, [What’s new in Ansible Automation Platform 2: automation execution environments](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2-automation-execution-environments).

**Private automation hub** ([documentation](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/managing_red_hat_certified_and_ansible_galaxy_collections_in_automation_hub/index)): Allows automation creators to collaborate and publish their own automation content and streamline Ansible code within their own organizations. Organizations can now manage and control the lifecycle of their Ansible content as their needs scale across the hybrid cloud. This component is completely self-hosted and can service both Ansible Content Collections and execution environments to automation creators and operators. I encourage you to read [my blog on private automation hub](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2-private-automation-hub) for a deep dive.

**Automation hub** ([console](https://console.redhat.com/ansible/ansible-dashboard)): This is the counterpart to private automation hub. This is a publicly hosted and curated automation content repository on console.redhat.com for all the fully supported and certified Ansible Content Collections. IT Operators can sync specific Collections from Ansible automation hub to their on-premises private automation hub and control which content they want to use.

**Red Hat Insights for Ansible Automation Platform** ([console](https://console.redhat.com/ansible/insights/reports) and [product page](https://www.redhat.com/products/insights-for-ansible)): This optional hosted service is available on console.redhat.com. It allows automation architects to aggregate data from multiple Ansible Automation Platform clusters to a single visual dashboard, so architects can analyze and discover trends across multiple automation initiatives. Red Hat Insights for Ansible Automation Platform is a hosted service constantly adding new features and abilities asynchronous from Ansible Automation Platform. However, there is a new feature coinciding with 2.1, called reports. Reports offer analytical data and downloadable PDFs for consumption. For example, you can see which hosts were changed by which job template over time, hosts broken down by organizations, jobs and tasks broken out by organization, and more.

**Automation services catalog** ([console](https://console.redhat.com/ansible/catalog/products)): Another hosted service on console.redhat.com included in your Ansible Automation Platform subscription. Automation services catalog acts as a lightweight IT service management, where automation consumers can order automation as catalog items. Automation services catalog allows you to aggregate multiple automation controllers into a single push-button WebUI abstracting any site-specific complexity. This allows new personas to adopt automation in a consumable turn-key fashion across your organization.  It also has approvals and checkout systems, adding a level of governance to your enterprise automation.

**Ansible Automation Platform Operator** ([documentation](https://access.redhat.com/documentation/en-us/red_hat_ansible_automation_platform/2.1/html/red_hat_ansible_automation_platform_operator_installation_guide/index)): A native and fully supported Operator for Red Hat OpenShift, allowing easy installation of Ansible components onto Red Hat OpenShift through Operator Hub. Both automation controller and private automation hub are included in a single consumable operator.  Watch this in action in our light hearted series, [Automated Live, Episode 03](https://youtu.be/nl9Wc6kw8qc?t=327) (skip to 5:29).

[![Screen Shot 2021-12-01 at 3.07.21 PM](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202021-12-01%20at%203.07.21%20PM.png)](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202021-12-01%20at%203.07.21%20PM.png)

#### What can I do next?

Whether you are beginning your automation journey or a seasoned veteran, there are a variety of resources to enhance your automation knowledge:

- [Self-paced exercises](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) - We have interactive in-browser exercises to learn and dive into Ansible Automation Platform.
- [Trial subscription](http://red.ht/try_ansible) - Are you ready to install on-premises? Get your own trial subscription for unlimited access to all the components of Ansible Automation Platform.
- [Developer license](https://developers.redhat.com/about) - Did you know that you can get a free developer license to learn in your home lab? Register and get access to all the latest tools, technologies and community that Red Hat has to offer.
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel .](https://www.youtube.com/ansibleautomation) Be sure to check out our new web series, [Automated Live hosted by Colin McNaughton](https://www.redhat.com/en/technologies/management/ansible/automated-live-videos)
- [Follow Red Hat Ansible](https://twitter.com/ansible) [Automation Platform](https://www.youtube.com/ansibleautomation) [on Twitter](https://twitter.com/ansible) - Do you have questions or an automation project you want to show off? Tweet at us!

*The following is a command line snippet example of disabling the Ansible Automation Platform 2.0 Early Access repository, and enabling the Ansible Automation Platform 2.1 subscription management repository.*

|  |
| --- |
| subscription-manager repos  --disable=ansible-automation-platform-2.0-early-access-for-rhel-8-x86\_64-rpms  subscription-manager repos --enable=ansible-automation-platform-2.1-for-rhel-8-x86\_64-rpms |

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Learn why Red Hat customer MAPFRE chose Red Hat Ansible Automation Platform](/blog/learn-why-red-hat-customer-mapfre-chose-red-hat-ansible-automation-platform/)
> - [Using Ansible and Packer, From Provisioning to Orchestration](/blog/ansible-and-packer-why-they-are-better-together/)
> - [Ansible Tips and Tricks, Dealing with Unreliable Connections and Services](/blog/ansible-tips-and-tricks-dealing-with-unreliable-connections-and-services/)

<!-- blog-enrichment:related-end -->
