---
title: Fact-Gathering with Event-Driven Ansible for Microsoft Windows ITSM
slug: fact-gathering-with-event-driven-ansible-and-ai
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2023-11-02'
updated: '2025-11-19'
source: redhat
source_url: https://www.redhat.com/en/blog/fact-gathering-with-event-driven-ansible-and-ai
description: Event-Driven Ansible is changing the automation landscape and AI is changing
  how we work with technology. What happens when we use both for fact gathering ?
topics: []
read_time_minutes: 5
synced_at: '2026-09-03T19:21:40Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** Event-Driven Ansible is changing the automation landscape and AI is changing how we work with technology. What happens when we use both for fact gathering ?

<!-- blog-enrichment:end -->

[![](https://www.redhat.com/rhdc/managed-files/ansible/o5ujQcjRbm0d-yVoHFcY2UZeQrF1CihIz5oFCcWeh4gryMjFoXsSiiXM2gt3nIgb3tkRrqvN0smg7LRagd6imYzfLa7CZccN8W_sRUrvLh3TtuXkAHN4Um4cqqGvbpAtQpeATAIEmLTbHqpBf6Ld4kU_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/o5ujQcjRbm0d-yVoHFcY2UZeQrF1CihIz5oFCcWeh4gryMjFoXsSiiXM2gt3nIgb3tkRrqvN0smg7LRagd6imYzfLa7CZccN8W_sRUrvLh3TtuXkAHN4Um4cqqGvbpAtQpeATAIEmLTbHqpBf6Ld4kU_0.png)

The use of Event-Driven Ansible to enable fact gathering from events is considered a “Getting Started” type of use case, but it can be extremely powerful. This use case is simple and it is what we consider a “Read Only” type of action, meaning that we are not making any changes, but we are using the event to trigger a fact gathering process which we can later publish to the IT Service Management system.

The benefit with this is we are able to provide consistent automated troubleshooting and fact gathering which is used to enrich the ticketing systems, so when our engineers have a look at the incident, they have all the information they need to decide on the next steps to resolve the issue or situation. This can potentially save many hours of toil and ultimately save an organization money from reduced down time and faster resolutions. But, we are assuming that our technical teams will know what to do with this event data.

What if we could assist with filling the gap when an incident takes place, and we could receive information or even options on how to resolve the issues? This is where we could use Event-Driven Ansible with the power of AI to enhance our team's approach to an incident.

> [!callout type=tmm label="Team resource" title="Getting started with Event-Driven Ansible" url="/blog/getting-started-with-event-driven-ansible/" cta="Read the guide"]
> Step-by-step guide from the Ansible TMM team.

## Event - Condition - Action!

My environment is simple: I have a few Windows systems, an Event-Driven Ansible controller listening to events from these Windows systems and an automation controller. Windows has a verbose event logging system and this is beneficial for this type of use case. Working with Active Directory, a common task is to create and remove users or manage users in general. In my first example of fact gathering, I create a new user on the Active Directory and the event payload I receive in my Event-Driven Ansible controller looks like this: (Formatted Json)

[![](https://www.redhat.com/rhdc/managed-files/ansible/ebvZyDMBMN-UZuxwH420GXEDowhitLKDNRU1J_ZxdvGQg8bLJpIwee2UVoIIiaHRZjZZnldbzdvezK1ogpkTLZQv006OYYGBwfBaAbSyVOGKaNmqFOA-mY4DM03zEtFv5wjsLHewPl0XmhRmYnbcWp8_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/ebvZyDMBMN-UZuxwH420GXEDowhitLKDNRU1J_ZxdvGQg8bLJpIwee2UVoIIiaHRZjZZnldbzdvezK1ogpkTLZQv006OYYGBwfBaAbSyVOGKaNmqFOA-mY4DM03zEtFv5wjsLHewPl0XmhRmYnbcWp8_0.png)

The payload provides a wealth of information, and for a task like adding a user account to the Active Directory, this event-id can be used in a condition since I already know what the course of action should be when new users are added in my organization. I want to gather the information and post the account data into a ServiceNow ticket.

[![](https://www.redhat.com/rhdc/managed-files/ansible/8HMd71JU6fgz4Q9aDKy-bizxHHHU-rCYy30dwQCMfFqthxb2O3-LxrDLjKiuVDW6yiEB8aviX01ZwrrIXNrr6ywyQL-hBIfBP8-mmG7Y21hID9V8zf8hciNyuTr5iZp5KQbZ9LpNloFzRBkhXC0xNrE_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/8HMd71JU6fgz4Q9aDKy-bizxHHHU-rCYy30dwQCMfFqthxb2O3-LxrDLjKiuVDW6yiEB8aviX01ZwrrIXNrr6ywyQL-hBIfBP8-mmG7Y21hID9V8zf8hciNyuTr5iZp5KQbZ9LpNloFzRBkhXC0xNrE_0.png)

The rulebook below references the specific event-id 4722 and triggers the appropriate job template to create a ServiceNow ticket with the account details. Now, remember what the payload looks like, any key could potentially be used as a condition, but the event-id is most accurate for this event with new user creation.

```
---
- name: Events from Windows AD

  hosts: all
  sources:
   - ansible.eda.kafka:
       host: 192.168.89.155
       port: 9092
       topic: logs

  rules:
   - name: AD Account Change
     condition: event.body.winlog.event_id == "4722"
     action:
       run_job_template:
        organization: "Default"
        name: "AD Event Fact Gathering"
```

We now have a ticket that gets created in ServiceNow when a new user is added to Active Directory. The ticket contains data from the event itself:

```
…output_omitted…

short_description: "{{ ansible_eda.event.body.event.action }}"
Details: {{ ansible_eda.event.body.message | default("") }}
Event-ID: {{ ansible_eda.event.body.winlog.event_id | default("") }}
Event-Outcome: {{ ansible_eda.event.body.event.outcome | default("")
```

## Time to enrich that data for our technical team:

What about events that we might not know how to resolve or what they even mean? Sure, I can log the details by harvesting the event payload data, but that still leaves my engineers with the task of trying to figure out the next steps. This is where we can introduce AI technologies like ChatGPT.

For this example, we are going to use the simple Windows firewall change as an event. I modify my rulebook to listen to events that could occur with firewall changes, by searching for a string in the message key of my payload.

```
…Output omitted…

 rules:
   - name: AD Account Change
     condition: event.body.winlog.event_id == "4722"
     action:
       run_job_template:
        organization: "Default"
        name: "AD Event Fact Gathering"

   - name: Firewall security Event
     condition: event.body.message is search("The Windows Firewall service")
     action:
       run_job_template:
        organization: "Default"
        name: "Windows AI Enhanced Ticket"
```

Now, the fun part here is that in my Windows AI Enhanced Ticket template I am going to use the event-id from my event payload and embed them in an API request to ChatGPT:

```
…output_omitted…

---
- name: Make API Call to ChatGPT
  hosts: localhost
  vars:
    _url_: https://api.openai.com/v1/completions
    api_key: MYAPIKEY
    gpt_model: "gpt-3.5-turbo-instruct"
    gpt_prompt: "Please explain this Windows Event: {{ ansible_eda.event.body.winlog.event_id }} “

  tasks:
    - name: Send API request to ChatGPT
      uri:
        url: "{{ _url_ }}"
        method: POST
        headers: 
         Content-Type: application/json
         Authorization: Bearer {{ api_key }}
        body_format: json
        body:
          model: "{{ gpt_model }}"
          prompt: "{{ gpt_prompt }}"
          max_tokens: 100  # Adjust the max_tokens as needed
      register: api_response
```

Once I query ChatGPT with the specific event-id, I filter the response for the actual content I would like:

```
…output_omitted…   

    - name: Extract text from API response
      set_fact:
        response_text: "{{ api_response.json.choices[0].text }}"
```

And then continue to create my ServiceNow ticket with the relevant information that I want to provide my technical team:

```
…output_omitted…   

    - name: Create Enhanced incident Ticket
      servicenow.itsm.incident:
       instance:
        host: "{{ SN_HOST }}"
        username: "{{ SN_USERNAME }}"
        password: "{{ SN_PASSWORD }}"
       state: new
       short_description: "{{ ansible_eda.event.body.event.action }}"
       description: |-
        Details: {{ ansible_eda.event.body.message | default("") }}
        AI Generated Description: {{ response_text | default("") }}
```

My team can now login and look at the incident, which will provide them with details from the event log out of Windows but also an explanation from AI around that type of event and what that specific event-id actually means. If you wanted to, you could use another query and ask for the top 5 recommended solutions for the specific event.

[![](https://www.redhat.com/rhdc/managed-files/ansible/oxq0AHOxyOyaXMfXhxDbYfwIYf_vwG1Flm2S0RTylBBdJUut9Ax99W7Jmsj8qZOCjP1hLdiUZrOswzjCz6Yf2DQ42mwv2D7fARHI6GcYBm1r2eisfk2G_zCS3RlzxJCl1DsRSX4sYXs6cHI91we0wIg_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/oxq0AHOxyOyaXMfXhxDbYfwIYf_vwG1Flm2S0RTylBBdJUut9Ax99W7Jmsj8qZOCjP1hLdiUZrOswzjCz6Yf2DQ42mwv2D7fARHI6GcYBm1r2eisfk2G_zCS3RlzxJCl1DsRSX4sYXs6cHI91we0wIg_0.png)

This is a simple example of how we can not only use Event-Driven Ansible to fact gather and create tickets using the event payload, but it also shows us that using technologies like AI in conjunction with Event-Driven Ansible could be extremely beneficial by using event data to generate suggestions and descriptions of issues for our teams which might not have the experience or skills to resolve.

To see these examples in action please click on the demo below!

- Demo: [Windows and Event-Driven Ansible w/ ServiceNow](https://youtu.be/0vQACe3shW0?si=yzQF84YWSbakFLjj)

> [!callout type=tmm label="Team resource" title="Event-Driven Ansible ChatOps" url="/blog/event-driven-ansible-chatops-from-chat-to-action/" cta="Read the guide"]
> From chat message to automated action with the TMM team walkthrough.

## Additional resources and next steps

**Want to learn more about Event-Driven Ansible?**

- Self-paced labs: [Hands-on experience with ServiceNow, Event-Driven Ansible and more](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218)
- Video: [NetOps, ChatOps, and Event-Driven Ansible](https://youtu.be/Dj7dhZdnRIY?si=hXS7cb3otvnYFezo)
- Event-Driven Ansible [web page](http://ansible.com/event-driven)
- Follow Nuno @<https://twitter.com/NunoMart11>

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [5 ways to augment security risk management in the AI era](/blog/5-ways-augment-security-risk-management-ai-era/)
> - [Navigating AI vulnerability discovery and achieving operational resilience with automation](/blog/navigating-ai-vulnerability-discovery-and-achieving-operational-resilience-automation/)
> - [AI threats move fast. Your defenses should too.](/blog/ai-threats-move-fast-your-defenses-should-too/)

<!-- blog-enrichment:related-end -->
