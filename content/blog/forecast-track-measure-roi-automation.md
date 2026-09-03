---
title: Forecasting and tracking the ROI of automation
slug: forecast-track-measure-roi-automation
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2022-03-02'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/forecast-track-measure-roi-automation
description: Red Hat Insights for Ansible Automation Platform can help CIOs and other
  IT leaders measure their ROI and validate their automation strategy.
topics: []
read_time_minutes: 5
synced_at: '2026-09-03T19:21:49Z'
---

Great ideas start with coffee, but business innovation starts with automation. Just like that morning jolt of warm friendly caffeine, Red Hat Ansible Automation Platform has the ability to enhance, optimize and make your technology stack flow like the beloved beverage most of the world consumes on a daily basis.

It is easy to discuss all the technical benefits that Ansible Automation Platform can bring to organizations, but what about the business benefits? How can you observe the state of your automation and return on investment (ROI)? How can you explain the financial impact of automation to key stakeholders? The answer to all of these questions is Automation Analytics.

Automation Analytics helps you fully measure and understand your automation efforts. It lets your data work for you by proactively identifying and correcting issues. Included as a hosted service offering with Ansible Automation Platform, Automation Analytics provides a visual dashboard to indicate automation performance, health notifications, organizational statistics, and more.

The most relevant features within Automation Analytics for IT business leaders and decision makers  who want to validate their automation strategy are **Reports**, **Savings** **Planner** and **Automation Calculator**. 

## Tracking how automation is used across teams

Reports allow you to observe different aspects of your organization’s automation adoption, and are based on feedback from Red Hat customers who are looking to measure their automation performance. For IT leaders, you can quickly retrieve critical information to help you understand where and how you are automating across the organization. They can be downloaded as a PDF and shared widely to help communicate your findings with your stakeholders.   
  
Reports include:

- Automation run rate
- Changes made to hosts by automation tasks
- Unique hosts per organization
- Automation tasks per organization
- Automation template explorer module usage

[![Automation ROI Reports](https://www.redhat.com/rhdc/managed-files/ansible/Measure%20Automation%20ROI%20Reports.png)](https://www.redhat.com/rhdc/managed-files/ansible/Measure%20Automation%20ROI%20Reports.png)

## Plan and predict your automation savings

One of the most important factors of automating your workloads with Ansible Automation Platform is the ability to reduce costs or reduce the amount of time needed for tasks across the organization. Savings Planner provides the mechanism for planning and tracking potential improvements that automation can bring to your organization.   
  
Savings Planner allows you to define criteria of common tasks performed without automation, and then connect this information back to automation templates on automation controller. With a plan in place, you can quickly make decisions based on which automation jobs will yield the best results for saving time and money

[![Measure Automation ROI Savings](https://www.redhat.com/rhdc/managed-files/ansible/Measure%20Automation%20ROI%20Savings.png)](https://www.redhat.com/rhdc/managed-files/ansible/Measure%20Automation%20ROI%20Savings.png)

### How Red Hat calculates automation savings

We use risk-adjusted factors to create the 3-year projection of cost and savings related to automation. While we aim to provide as accurate an account of the cost and savings as possible, actual values may differ in practice. The following information breaks down where we get the data, the risk-adjustment factors we use, the assumptions we make, and the formula used to compute the values as displayed in the chart.

#### The cost of automation

The cost includes the hours spent in implementation, deployment, training and other expenditures for creating, maintaining and running the automation. These hours (cost of investment) are usually higher at the onset to create the automation and then decline greatly once only maintenance is required.  
  
For the initial period and the first year, we forecast approximately 10 hours will be spent on each host along with some buffer time, and a 40% risk adjustment to account for unforeseen situations.  
  
For the two years following, we assume 4 hours spent on each host, as well as a 40% risk adjustment to account for unforeseen situations.  
  
The formula used to calculate cost for the initial period and year 1 is:

|  |
| --- |
| C1 = (time for a manual run on one host in hours \* 10) + buffer time C2 = C1 \* 40% risk adjustment initial cost = (C1 + C2) \* (cost per hour in USD if applicable, based on display) year 1 cost = (C1 + C2) \* (cost per hour in USD if applicable, based on display) |

The formula used to calculate the cost for years 2 and 3 is:

|  |
| --- |
| C1 = (time for a manual run on one host in hours \* 4) C2 = C1 \* 40% risk adjustment year 2 cost = (C1 + C2) \* (cost per hour in USD if applicable, based on display) year 3 cost = (C1 + C2) \* (cost per hour in USD if applicable, based on display) |

#### Automation savings calculation

The savings indicate the time and money saved as a result of automating the plan.  
  
We assume 50% productivity recapture to account for the productivity that is usually gained by the repeated manual implementation of a task over a period of time. We also add a -5% risk adjustment for unforeseen situations that may arise and need to be handled. We also assume a 15% year-over-year growth in savings.  
  
There is no monetary savings for the initial period, so there is no formula necessary.  
  
The formula used to calculate savings for year 0 is:

|  |
| --- |
| initial period savings = 0 - initial cost |

The formula used for savings for year 1 is:

|  |
| --- |
| S1 = (number of hosts \* (manual time in minutes / 60) \* yearly frequency of automation) S2 = S1 \* 50% productivity recapture S3 = S2 \* 5% risk adjustment \* (cost per hour in USD if applicable, based on display) year 1 savings = S2 - S3 - year 1 cost |

The formula used to calculate savings for year 2 is:

|  |
| --- |
| S1 = year 1 savings \* 15% growth year 2 savings = year 1 savings + S1 - year 2 cost |

The formula used to calculate savings for year 3 is:

|  |
| --- |
| S2 = year 2 savings \* 15% growth year 3 savings = year 2 savings + S2 - year 3 cost |

## Measuring the ROI of automation

Another dashboard, Automation Calculator, creates savings calculations based on the automation templates currently being used by your organization. By selecting a template, you can specify the costs of a manual process against the cost of an automated process. With this information in place, Automation Calculator is able to estimate the total savings for that specific template or task.   
  
Automation Calculator uses the following formula to calculate the estimated cost savings:

|  |
| --- |
| Manual cost for Template = (time of manual process on one host in hours \*(sum of all hosts all job runs) \* cost per hour  Automated cost for Template = cost of automation per hour \* sum of total elapsed hours for template  Savings = sum of (manual cost - automation cost) across all templates |

## How does your automation ROI compare?

According to an IDC report1, “By improving overall IT infrastructure and application development performance with Ansible Automation Platform, study participants were better able to meet business demand, and deliver higher-quality and more timely applications and features to lines of business and customers”. Ansible Automation Platform as the foundation for automation realized a variety of additional benefits including cost savings, greater operational efficiency, and reduced downtime.

[![Business Value of Automation](https://www.redhat.com/rhdc/managed-files/ansible/Business%20Value%20of%20Automation.png)](https://www.redhat.com/rhdc/managed-files/ansible/Business%20Value%20of%20Automation.png)

While your automation performance may vary, Automation Analytics provides the tools to help you observe and make decisions for your organization’s automation journey using these statistics as a benchmark. Now you can sit back and enjoy your coffee while discovering knowledge into your organization’s innovation.   
  
Additional resources:

- [Try Ansible Automation Platform free for 60 days](https://www.redhat.com/en/technologies/management/ansible/try-it)
- Blog: [How to Activate Automation Analytics and Insights for Ansible Automation Platform](https://www.redhat.com/blog/activate-insights-for-ansible-automation-platform)
- Blog: [Introducing Ansible Automation Platform 2.1](https://www.redhat.com/blog/introducing-red-hat-ansible-automation-platform-2.1)

1IDC, [The business value of Red Hat Ansible Automation Platform](https://www.redhat.com/rhdc/managed-files/idc-business-value-red-hat-ansible-tower-summary-analyst-paper-f18073-201906-en_0.pdf), Doc #US48678022, Oct. 2021
