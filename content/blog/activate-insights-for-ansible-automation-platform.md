---
title: How to Activate Automation Analytics and Red Hat Insights
slug: activate-insights-for-ansible-automation-platform
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2022-02-01'
updated: '2026-06-03'
source: redhat
source_url: https://www.redhat.com/en/blog/activate-insights-for-ansible-automation-platform
description: Red Hat Insights for Ansible Automation Platform is an analytics tool
  to help you identify, troubleshoot, and resolve issues across your entire ecosystem.
topics: []
read_time_minutes: 4
synced_at: '2026-09-03T19:21:51Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** Red Hat Insights for Ansible Automation Platform is an analytics tool to help you identify, troubleshoot, and resolve issues across your entire ecosystem.

> [!toc]
> **On this page**
>
> - [What you’ll need to activate Automation Analytics and Insights for Ansible Automation Platform](#what-youll-need-to-activate-automation-analytics-and-insights-for-ansible-automation-platform)
> - [Turning on data collection in Automation Analytics and Insights for automation controller](#turning-on-data-collection-in-automation-analytics-and-insights-for-automation-controller)
> - [Turning on data collection for Red Hat Ansible Tower](#turning-on-data-collection-for-red-hat-ansible-tower)
> - [Manual data collection within Automation Analytics and Insights](#manual-data-collection-within-automation-analytics-and-insights)
> - [Verifying data sync with automation controller](#verifying-data-sync-with-automation-controller)
> - [Putting Automation Analytics and Insights to work in your automation practice](#putting-automation-analytics-and-insights-to-work-in-your-automation-practice)
> - [Additional resources](#additional-resources)

<!-- blog-enrichment:end -->

Two indispensable but sometimes overlooked tools included with an Ansible Automation Platform subscription are the cloud-based services, Automation Analytics and Red Hat Insights for Ansible Automation Platform.

Automation Analytics and Insights form a suite of reporting and analytics tools to help you identify, troubleshoot, and resolve operational, business, and security issues across your entire ecosystem. You can also track the ROI of your automation investment and plan future automation projects to prioritize your efforts where they will have the biggest impact on your business.

Before you can start using these services to better understand your automation estate and make data-driven decisions, you need to set up the flow of information from your enterprise into the Red Hat Hybrid Cloud Console.

## What you’ll need to activate Automation Analytics and Insights for Ansible Automation Platform

In order to turn on data collection, you’ll need:

- A current Red Hat Ansible Automation Platform license
- Automation controller 4.1.0
  - [Ansible Automation Platform Upgrade and Migration Guide](https://docs.ansible.com/automation-controller/latest/html/upgrade-migration-guide/index.html#ansible-automation-platform-upgrade-and-migration-guide)
  - [Automation Controller Quick Setup Guide v4.1.0](https://docs.ansible.com/automation-controller/latest/html/quickstart/index.html)
  - Note: [Automation Analytics and Insights are also supported](https://www.redhat.com/blog/getting-started-with-automation-analytics) with Red Hat Ansible Tower 3.5.3 or newer
- An Ansible controller cluster(s) and an automation controller instance that can access [console.redhat.com](http://console.redhat.com)

## Turning on data collection in Automation Analytics and Insights for automation controller

For Ansible Automation Platform 2.2, integration of Red Hat Insights is done during your initial deployment. The insights-client package responsible for ensuring connected data for your Ansible Automation Platform infrastructure has also been added to the bundled installer on the Red Hat Customer Portal.

Once you have deployed your Ansible Automation Platform and logged into the automation controller, you will be prompted to enroll your platform during setup. Selecting these options will connect your automation controller to both services on [console.redhat.com](http://console.redhat.com).

[![Automation Controller](https://www.redhat.com/rhdc/managed-files/ansible/Automation%20Controller.png)](https://www.redhat.com/rhdc/managed-files/ansible/Automation%20Controller.png)

To connect your automation controller to Automation Analytics and Insights post installation, simply navigate to the controller settings and select the “Miscellaneous System” settings.

From the details page, we select “edit and configure the Insights for Ansible Automation Platform” section. There are three settings you need to set under Settings > Miscellaneous System:

- **GATHER DATA FOR** Insights for Ansible Automation Platform must be set to on.
- **RED HAT CUSTOMER USERNAME** is your cloud.redhat.com username.
- **RED HAT CUSTOMER PASSWORD** is your cloud.redhat.com password for the corresponding username.

[![Edit Details](https://www.redhat.com/rhdc/managed-files/ansible/Edit%20Details.png)](https://www.redhat.com/rhdc/managed-files/ansible/Edit%20Details.png)

> [!callout type=tmm label="TMM resource" title="Solution Guides" url="https://ansible-tmm.github.io/solution-guides/" cta="Browse guides"]
> Outcome-focused guides for infrastructure and IT automation challenges.

## Turning on data collection for Red Hat Ansible Tower

Log in to your Ansible Automation Platform web UI (user interface). The user account must have administrative privileges to turn on data collection. Click on the “Settings” button on the left menu. Note: If the menu is in compact mode, there will only be a small gear representing the settings.

[![Settings](https://www.redhat.com/rhdc/managed-files/ansible/Settings.png)](https://www.redhat.com/rhdc/managed-files/ansible/Settings.png)

Next click on the “System” button:

[![System](https://www.redhat.com/rhdc/managed-files/ansible/System.png)](https://www.redhat.com/rhdc/managed-files/ansible/System.png)

There are three settings you need to update under Settings > System:

- **GATHER DATA FOR AUTOMATION ANALYTICS** must be set to on.
  - You may see “Automation Insights” instead of “Automation Analytics” depending on the version of automation controller or Red Hat Ansible Tower that you’re running.
- **RED HAT CUSTOMER USERNAME** is your cloud.redhat.com username.
- **RED HAT CUSTOMER PASSWORD** is your cloud.redhat.com password for the corresponding username.

Here is an example snippet of the Settings > System page:

[![AA Settings](https://www.redhat.com/rhdc/managed-files/ansible/AA%20Settings.png)](https://www.redhat.com/rhdc/managed-files/ansible/AA%20Settings.png)

Click the “Save” button. Once saved, automation controller will sync to cloud.redhat.com up to four times a day. Currently, this sync frequency setting cannot be adjusted.

> [!callout type=redhat label="Red Hat" title="Ansible Automation Platform documentation" url="https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/" cta="Read the docs"]
> Official product documentation from Red Hat.

## Manual data collection within Automation Analytics and Insights

If you want to register a system and sync to [console.redhat.com](http://console.redhat.com) right away, you can do this using the automation controller command line, which allows you to quickly verify that everything is set up correctly.

Log in as the awx user or an administrative user on the control node and run the following command:

|  |
| --- |
| $ sudo awx-manage gather\_analytics --ship |

This command will provide output similar to the following:

|  |
| --- |
| [student1@ansible ~]$ sudo awx-manage gather\_analytics --ship /tmp/4457cd25-4722-4b62-9ae6-ce8068026bbc\_2019-10-28-155420+0000.tar.gz shipping analytics file: /tmp/4457cd25-4722-4b62-9ae6-ce8068026bbc\_2019-10-28-155420+0000.tar.gz [student1@ansible ~]$ |

Don’t worry about re-running the command multiple times. The syncing tool is non-destructive meaning you will not lose data or upload duplicate data. No matter how many times you run the gather\_analytics command, the data set will remain the same on [console.redhat.com](http://console.redhat.com).

## Verifying data sync with automation controller

Login to the Red Hat Hybrid Cloud Console account at [console.redhat.com](http://console.redhat.com/), and select Ansible Automation Platform.

[![Screen Shot 2022-02-01 at 11.23.46 AM](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-02-01%20at%2011.23.46%20AM.png)](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-02-01%20at%2011.23.46%20AM.png)

Once your automation controller is connected, you should see the number of connected controllers indicated in the “Ansible Automation Platform” overview dashboard.

[![Job Status](https://www.redhat.com/rhdc/managed-files/ansible/Job%20Status.png)](https://www.redhat.com/rhdc/managed-files/ansible/Job%20Status.png)

Clicking on “total clusters” will show you the job status for the clusters that have been registered.

[![Clusters](https://www.redhat.com/rhdc/managed-files/ansible/Clusters.png)](https://www.redhat.com/rhdc/managed-files/ansible/Clusters.png)

Newly registered systems will display very little data for several days. The first time you register a system and turn on data collection, it will upload the last four weeks of activity. The automation controller dashboard will not match the dashboard one-to-one because automation controller jobs are filtered out. Examples of filtered jobs include cleanup activity stream and cleanup job details ([see Management Jobs documentation](https://docs.ansible.com/automation-controller/latest/html/administration/tower-manage.html#cleanup-of-old-data)).

## Putting Automation Analytics and Insights to work in your automation practice

Both tools give you deep analytics to help you understand your automation efforts and let your data work for you by proactively identifying and correcting issues, leading to a [self-healing infrastructure](https://www.redhat.com/en/blog/self-healing-infrastructure-red-hat-insights-and-ansible-automation-platform).

The visibility you gain with the dashboards and reports can also be used to extend more automation into your enterprise, helping you:

- Track and measure the ROI of your automation efforts and share results with stakeholders outside of Ansible Automation Platform.
- Receive proactive notifications of critical issues, such as when nodes are down due to missing data or clusters are approaching end of life.
- See most used workflows, templates, and modules, and pass/fail rates by time period.
- Encourage the use of automation by rewarding a user or an entire team for creating the most automation tasks.

|  |
| --- |
| **Concerned about sharing your data with Red Hat?**  Red Hat does not collect credential secrets, personal data, automation variables, or task output. For more information about which data are collected and stored by Red Hat, check out our [automation analytics data security FAQ](https://www.redhat.com/products/insights-for-ansible/faq). |

## Additional resources

Insights has gone through significant changes in recent months, and additional dashboards, features, and capabilities planned in the months ahead. Check out these new resources to guide you through the latest updates:

- Checklist: [3 ways IT leaders can measure automation performance](https://www.redhat.com/rhdc/managed-files/ma-3-ways-it-leaders-measure-automation-performance-overview-f31060pr-202202-en_1.pdf)
- Webinar: Analyze and expand automation with hosted services
- Graphic: [Automation analytics and Red Hat Insights role-based benefits](https://www.redhat.com/hubfs/RH_INFRA_007862_03_SRC_AnsibleAutomationAnalytics_PersonaBenefitsTable_rh.pdf?hsLang=en-us)

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [5 ways to augment security risk management in the AI era](/blog/5-ways-augment-security-risk-management-ai-era/)
> - [Navigating AI vulnerability discovery and achieving operational resilience with automation](/blog/navigating-ai-vulnerability-discovery-and-achieving-operational-resilience-automation/)
> - [AI threats move fast. Your defenses should too.](/blog/ai-threats-move-fast-your-defenses-should-too/)

<!-- blog-enrichment:related-end -->
