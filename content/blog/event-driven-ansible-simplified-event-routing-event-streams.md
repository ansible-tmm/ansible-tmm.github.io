---
title: 'Event-Driven Ansible: Simplified event routing with Event Streams'
slug: event-driven-ansible-simplified-event-routing-event-streams
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2026-01-13'
updated: '2026-01-20'
source: redhat
source_url: https://www.redhat.com/en/blog/event-driven-ansible-simplified-event-routing-event-streams
description: Learn how Event-Driven Ansible's simplified event routing with Event
  Streams improves flexibility in setting up event-driven automation scenarios. Discover
  new enhancements to Kafka for event source connections and additional content updates.
  Take your event-driven automation to the next level with AIOps.
topics:
- Automation and management
read_time_minutes: 7
synced_at: '2026-09-03T19:21:35Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

The systems running an organization's infrastructure and applications are interconnected, creating an environment of controlled chaos where events in one area can ripple unpredictably through others. Red Hat Ansible Automation Platform features Event-Driven Ansible as an automation mechanism for reacting to these ripples. Event-Driven Ansible listens to external event or alert sources so you can design automated responses for these events, enabling faster response to problems with consistency and accuracy.

A foundational use case that can be used almost anywhere to provide a great deal of value to the technical team is ticket enrichment. With Event-Driven Ansible, an alert from an observability or monitoring tool can drive a workflow of automated troubleshooting, fact gathering and reporting with ticket creation in an IT service management (ITSM) solution. This places valuable data in the hands of the support teams, saving them time and reducing mean time to resolution (MTTR).  Event-Driven Ansible automates remediation for known low severity issues, such as restarting a container or rotating expired certificates from a pending expiration alert. This not only lets you sleep more, but can help enable resilient systems through automated response and remediation.

Event-Driven Ansible enables integration into your technology ecosystem as well, transforming Ansible Automation Platform into an active participant in your infrastructure. Responses can be much more than issue remediation and can include proactive scenarios. For example, as you make changes to systems, you can trigger Event-Driven Ansible to run compliance checks and update a configuration management database (CMDB) and ITSM records for you. If systems are found to be out of compliance, Event-Driven Ansible could create an ITSM ticket and restore configurations from the source of truth.

## Webhooks, Kafka, and event bus connection methods

Before I get into our new Event Streams feature, I want to emphasize that when looking at event-driven automation as a mechanism to improve your environment, you need to ensure that you're using the correct integration methods and plug-ins.

Webhooks are recommended for simple and direct integrations with low-to-moderate event volumes. Apache Kafka is best for high-volume, mission-critical event streams that require durability.

- Event volume
  - **Webhooks**: Low to moderate (hundreds to thousands a day).
  - **Kafka**: High volume (thousands to millions a day).
- Reliability
  - **Webhooks**: If the receiver is down, events may be lost.
  - **Kafka**: Persistent storage, so events are retained and can be replayed.
- Complexity
  - **Webhooks**: Minimal setup (just expose an endpoint).
  - **Kafka**: Requires Kafka infrastructure, topics, and consumer management.
- Ordering guarantees
  - **Webhooks**: No guaranteed ordering.
  - **Kafka**: Strong ordering guarantees within partitions.
- Backpressure handling
  - **Webhooks**: Limited. Sender may fail or timeout.
  - **Kafka**: Built-in buffering and consumer group management.
- Event replay
  - **Webhooks**: Not possible. Events are ephemeral.
  - **Kafka**: Full replay capability from any point in time.
- Latency
  - **Webhooks**: Near real-time (milliseconds).
  - **Kafka**: Near real-time, but may have slight delay due to batching.
- Security
  - **Webhooks**: HTTPS, API keys, token authentication (Event-Streams).
  - **Kafka**: SASL, SSL/TLS, ACLs, encryption at rest.
- Operational overhead
  - **Webhooks**: Very low. No infrastructure to manage.
  - **Kafka**: Requires Kafka cluster maintenance.
- Use cases
  - **Webhooks**: CI/CD triggers, ticketing systems, monitoring alerts, simple integrations.
  - **Kafka**: High transaction loads, IoT streams, audit logs, multi-consumer scenarios.

My recommended path for adoption is the following:

- Start with webhooks if you're integrating with SaaS tools, have moderate volumes, and need quick time-to-value in development or testing environments. Later, move to Event Streams for production and to integrate security into your events coming from webhooks.
- Migrate to event buses such as Apache Kafka, AWS SQS, Azure Service Bus, when you need guaranteed delivery, event persistence and replay capabilities, multiple consumers, or handle critical high-volume streams.

## Simplified event routing with Event Streams

Now let's talk about what's new. We initially released event-driven automation with webhooks and Kafka for connecting external sources of alerts to the decision engine in Event-Driven Ansible. Event Streams is an Event-Driven Ansible enhancement to webhook events that makes it a good choice for production environments. As an alert-pushing solution, it has the ability to:

- Automatically route an event source to one or many configured rulebook activations, so this enables a single event stream endpoint to more flexibly serve multiple event-driven activations.
- Deliver events to horizontally-scaled rulebook activations, such as certificate rotation across geographically organized operations or high-volume alerts that require multiple activations to execute at scale.
- Require credentials, making the automated action a more secure option for connecting your alerts to Ansible Automation Platform’s Event-Driven Ansible, for example through integration with secrets management solutions like Hashicorp Vault or CyberArk.

Figure 1 provides a summary:

[![Figure 1: Event-Driven Ansible’s simplified event routing with Event Streams improves flexibility in setting up event-driven automation scenarios.  ](https://www.redhat.com/rhdc/managed-files/image1_261.png)](https://www.redhat.com/rhdc/managed-files/image1_261.png)

I have created a [video demo](https://www.youtube.com/watch?v=n_fJ_G0_3JI) on Event Streams, and we also covered it on this recent [webinar](https://www.redhat.com/en/events/webinar/whats-new-ansible-automation-platforms-event-driven-ansible). These resources can help you take your learning to the next level.

## Enhancements to Kafka for event source connections

Recommendations for the design and architecture of your Kafka infrastructure are beyond the scope of this blog, but Kafka is the recommended enterprise-class method of getting events to Event-Driven Ansible to take action. Kafka brings added reliability, scale, performance as well as other enterprise class features.

Enhancements to the Event-Driven Ansible Kafka solution include support for Generic Security Services Application Program Interface (GSSAPI). There are also design and control enhancements, such as support for multiple topics, extended regular expressions, and wildcard support. These better support you as you expand event-driven automation across your operations and intro production.

## Ease of use enhancements

Over the past several months, there have been a series of enhancements to support automation in your production environments or otherwise at scale. Here are a few of the noteworthy enhancements:

- Integration of Event-Driven Ansible  into the Ansible Automation Platform unified UI.
- Copy and edit capabilities have been added for rulebooks, making it easier to maintain existing and create new activations.
- [Enhanced logging](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.5/html/using_automation_decisions/eda-rulebook-troubleshooting) is now also available to help you troubleshoot problems with your activations.
- There is now a local timezone feature for logs which can help apply event-driven automation across the globe for different users.
- Labels have been added to event-driven automation jobs for better tracking and smoother operations at scale.
- Secrets management is now enhanced across the entire platform. Particularly in Event-Driven Ansible, there is support for Hashicorp Vault, CyberArk, AWS, Azure, [and more](https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.6/html/using_automation_decisions/eda-credential-types).
- Rulebook concurrency is now available to allow you to run multiple rulebook actions (or rules) at the same time, boosting rulebook control and performance in processing alerts.
- Mutual Transport Layer Security (mTLS) for Event Streams is now supported in Event-Driven Ansible to improve the security of communication across automated response scenarios.
- Pull policy parity for decision environments (DE) so you can customize the behavior to pull your DEs from your defined registries.

## New Ansible Content Collections and Plugins

Across the entire platform, automation is always being added or enhanced to help you jumpstart event-driven automation for use with multivendor technologies. For Event-Driven Ansible, these are some new and exciting ones:

- **Splunk**: A new add-on available on [Splunkbase](https://splunkbase.splunk.com/app/7868). It  integrates alerts from Splunk ITSI and Splunk ES with the Event-Driven Ansible decisioning capability.  It allows you to automate responses to Splunk alerts. Learn more in this [blog](https://www.redhat.com/en/blog/splunk-redhat-collaborate-automate-response-observability-alerts-for-improved-aiops) or watch this [webinar](https://www.brighttalk.com/webcast/18106/652718?utm_source=brighttalk-portal&utm_medium=web&utm_content=recorded&utm_campaign=all-series&channel_id=18106).  While not focused on event-driven automation, an additional new Ansible Content Collection is a [Splunk Enterprise Security collection](https://catalog.redhat.com/en/software/collection/splunk/es) for closed-loop automation with even more collections on the way.
- **Nautobot**: A network source of truth solution that now also integrates with Event-Driven Ansible through a new Red Hat Ansible Certified Content Collection. As you move toward greater automation maturity, this can be a key technology that enables your environment to automatically adjust.  Learn more in this [blog](https://networktocode.com/blog/event-driven-ansible/) and access the content collection [here](https://catalog.redhat.com/en/software/collection/networktocode/nautobot#documentation).
- **Hashicorp Vault**: A robust secrets management solution that can help you protect sensitive data and more securely operate mission-critical automation. Read more in this [blog](https://www.redhat.com/en/blog/new-ansible-certified-content-hashicorp-terraformvault) and also access it in the Ansible Content Collection [here](https://catalog.redhat.com/en/software/containers/hashicorp/vault/5fda55bd2937386820429e0c).
- **Microsoft SCOM**: Can be used with  Event-Driven Ansible through a new Red Hat Ansible Certified Content Collection. This collection allows you to automate response to Windows Server alerts that come from Microsoft Systems Center Operations Manager (SCOM), and you can find details and assets on this [microsoft.scom](https://console.redhat.com/ansible/automation-hub/repo/published/microsoft/scom/) certified collection.
- **Microsoft Azure**: The Azure servicebus Event-Driven Ansible plug-in is now in the [azure.azcollection](https://catalog.redhat.com/en/software/collection/azure/azcollection#documentation), enabling alerts to be sent from Azure servicebus to Event-Driven Ansible for automated response.
- **Juniper**: Two new Red Hat Ansible Certified Content Collections. The [juniper.eda](https://catalog.redhat.com/en/software/collection/juniper/eda#documentation) collection is a new plug-in for Kubernetes and Red Hat OpenShift that automates response to kubernetes events for provisioning. There is also a new [juniper.apstra](https://catalog.redhat.com/en/software/collection/juniper/apstra#documentation)collection to provision network resources in coordination with OpenShift network changes.

Additional content updates include: Dynatrace has created [updates](https://docs.dynatrace.com/docs/analyze-explore-automate/workflows/actions/red-hat/redhat-even-driven-ansible) to integrate to Red Hat Ansible Automation Platform using Event Streams, and the [ServiceNow integration](https://www.redhat.com/en/blog/evolving-our-servicenow-integration-sunsetting-notification-service-more-capable-alternatives) adds polling support as a pull method for AIOps scenarios.

## Take it to the next level with AIOps

Ansible Automation Platform's Event-Driven Ansible can connect the changing conditions that are occurring in your environment and the way you would like to automatically respond. By forwarding unknown events and conditions generated from third party tools to AI for analysis, Event-Driven Ansible can close the loop, for example by logging the insights.

## Learn more

In case you are new to event-driven automation using Red Hat Ansible Automation Platform, this is a brief summary of how it works. The three main components you should be aware of are:

1. **Event sources**: Third-party data about changing conditions across your environment.  These can be observability tools, monitoring tools, or perhaps even log data aggregated through a solution like Kafka or Grafana.
2. **Rulebooks with rules**: While Ansible Automation Platform can use playbooks to specify sequential actions, you should use rulebooks to integrate with events.  Rulebooks are conditions that are evaluated for the alert to determine if the alert should receive the specified action.
3. **Event-Driven Ansible controller**: Part of Ansible Automation Platform subscription, this component is a decisioning engine that receives alerts, matches to the right rulebook and executes decisioning (through the rules in the rulebook) to determine whether an action is warranted.
4. **Automation controller**: Finally, when the decision process is complete an action is required, the rulebook action request is sent to automation controller for action. The action can be a playbook that is called, or a workflow to orchestrate a sequence of jobs.

Figure 2 provides an overview of how the process works.  It shows a Splunk alert, but can be from any event source you choose.

[![Figure 2: How Event-Driven Ansible works as an additional automation mode in Ansible Automation Platform. ](https://www.redhat.com/rhdc/managed-files/image2_164.png)](https://www.redhat.com/rhdc/managed-files/image2_164.png)

Enhanced event-driven automation capabilities have been added to Ansible Automation Platform. It's something to consider, whether you're looking for enhanced operational control for production operations, expanding event-driven automation at scale, or making your move to AIOps.

I have provided additional learning and how-to information throughout this blog, but there is an additional on demand webinar that I strongly recommend you watch. [This webinar](https://www.redhat.com/en/events/webinar/whats-new-ansible-automation-platforms-event-driven-ansible) covers these features and includes a demo by yours truly.  We also had a customer guest on this webinar. He is an early adopter of Event-Driven automation with Ansible Automation Platform and talked about his very advanced fact gathering and smoke-test response for issues. You can also further your learning journey on the [Event-Driven Ansible web page](http://redhat.com/event-driven-ansible) that contains a series of resources.

 [Watch the webinar](https://www.redhat.com/en/events/webinar/whats-new-ansible-automation-platforms-event-driven-ansible)

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
