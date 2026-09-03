---
title: Importing Ansible Validated Content into Private Automation Hub
slug: importing-ansible-validated-content-into-private-automation-hub
authors:
- slug: hicham-mourad
  name: Hicham Mourad
published: '2023-10-03'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/importing-ansible-validated-content-into-private-automation-hub
description: Ansible validated content addresses common automation use cases. Learn
  how to access it from your cloud deployment to accelerate your automation.
topics:
- Cloud automation
read_time_minutes: 3
synced_at: '2026-09-03T19:21:28Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

## Introduction

Ansible validated content is a set of collections containing pre-built YAML content (such as playbooks or roles) to address the most common automation use cases. You can use Ansible validated content out-of-the-box or as a learning opportunity to develop your automation skills. It's a trusted starting point to bootstrap your automation: use it, customize it and learn from it!

This content is curated by experts like the Red Hat Automation Community of Practice so:

- Use cases are based on successfully deployed customer examples
- Content creators are trusted and verified subject matter experts
- Content itself adheres to the latest best practices and guidelines issued by Red Hat’s engineering team
- Ansible validated content is tested against supported versions of Red Hat Ansible Automation Platform

Ansible Automation Platform is a trusted delivery system to access and leverage Ansible validated content in your organization.

## How can I get this Ansible validated content into my Ansible Automation Platform on clouds (AWS, Azure, Google Cloud) deployment?

To do this there are a few short steps. Let’s walk through these together.

As part of your Ansible Automation Platform on cloud, you will also have a private automation hub. This is your own internal automation content repository. Login to private automation hub. You will have your own internal URL for the private automation hub, depending on your deployment type. Once you are logged in, go to **Collections** -> **Remotes**.

[![](https://www.redhat.com/rhdc/managed-files/ansible/P4cSxzwEBd4VkCzQQX3bkZRS1zYBeVNTbZKXbqq8_b0b2xAwa6SQP2CSRpzTg2h0aGucy_f1PWPqbjS8FT4myTAqgdNpf60Plm692Nxy4XLqAnu89GIcBWpXJkzoLfyKUpF2kk8HVle9719jjgdpjHI_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/P4cSxzwEBd4VkCzQQX3bkZRS1zYBeVNTbZKXbqq8_b0b2xAwa6SQP2CSRpzTg2h0aGucy_f1PWPqbjS8FT4myTAqgdNpf60Plm692Nxy4XLqAnu89GIcBWpXJkzoLfyKUpF2kk8HVle9719jjgdpjHI_0.png)

Let’s define the remote configuration for where we want to pull in the validated content from.  Select **Add Remote** and provide the following configuration details.

For the Name provide: **validated**

For the URL provide: **<https://console.redhat.com/api/automation-hub/content/validated/>**

For the SSO URL provide:  **[https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-conn…](https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token)**

For the token, you will need to **login to the** **Red Hat Hybrid Cloud Console** and grab the token from there. **Here’s exactly where you need to go to get the token**:  **<https://console.redhat.com/ansible/automation-hub/token>**

[![](https://www.redhat.com/rhdc/managed-files/ansible/HWrT2QLdVrye544xDJpdSWnmVn5kybakqlh7cPbFzyw-R3AMhgEp-aoRTZTS4vikN4R2qX_zSTGq0g58oGxaNJDJNjA_DG8eqmhP0JboeeG0oxgF8G96OMqPnVZm-zjZyMHyQjL3M2vKuDRnQdUwTFE_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/HWrT2QLdVrye544xDJpdSWnmVn5kybakqlh7cPbFzyw-R3AMhgEp-aoRTZTS4vikN4R2qX_zSTGq0g58oGxaNJDJNjA_DG8eqmhP0JboeeG0oxgF8G96OMqPnVZm-zjZyMHyQjL3M2vKuDRnQdUwTFE_0.png)

After you **Save** this remote configuration, you will have an additional entry in the remotes pane called **validated**.

[![](https://www.redhat.com/rhdc/managed-files/ansible/5iQuXwT-02GUuiRt-_xHDyhxxsYo3dK6hGBAI4NMJbQ664vWGCKYN_xraIMCvYsweqvYkUmTrpi1TQ-7sJxb85G25pbsxP4J9XWo8WzOA6AXkkNvZvnRAwuscJvDYyDUQKYSrvF9WXGWTnJJM-lKkqs_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/5iQuXwT-02GUuiRt-_xHDyhxxsYo3dK6hGBAI4NMJbQ664vWGCKYN_xraIMCvYsweqvYkUmTrpi1TQ-7sJxb85G25pbsxP4J9XWo8WzOA6AXkkNvZvnRAwuscJvDYyDUQKYSrvF9WXGWTnJJM-lKkqs_0.png)

Moving to the **Collections** -> **Repositories** menu, we need to **edit** the **validated** repository configuration and trigger a synchronization of the validated content.

[![](https://www.redhat.com/rhdc/managed-files/ansible/UtZdshACO7mbTKZU3hObX6GRsfZyRNL3lG6NjcVBaUTQ0awTU3NKT-MsQ-ics6I314nTbGyS-qnXMDymk2FTwC39OM0FuGeGhaOkeuAqytz6pPA9EEL4RFSqWGt400LPvXcO6ypLx4BdlK629p081IA_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/UtZdshACO7mbTKZU3hObX6GRsfZyRNL3lG6NjcVBaUTQ0awTU3NKT-MsQ-ics6I314nTbGyS-qnXMDymk2FTwC39OM0FuGeGhaOkeuAqytz6pPA9EEL4RFSqWGt400LPvXcO6ypLx4BdlK629p081IA_0.png)

Click on the **validated** repository name. This will give you the opportunity to go into edit mode.  Click **edit**. Once you are editing the **validated** repository, there are a few necessary configuration changes needed.

For the **Pipeline**, from the drop-down select **None.**

For the **Remote**, from the drop-down select **validated**. Then click on **Save**.

[![image-4](https://www.redhat.com/rhdc/managed-files/ansible/image-4.png)](https://www.redhat.com/rhdc/managed-files/ansible/image-4.png)

At this point, you are able to trigger the synchronization of the validated content to your private automation hub. This can be done in a couple of ways: One is from the **Repositories** menu, select the **ellipsis** at the far right of the **validated** row. Then click on **Sync**. The **Sync status** will change to **running**, and after a few minutes it will move to **Completed**.

[![](https://www.redhat.com/rhdc/managed-files/ansible/GmbjqX178endfREaWxZypMC_AFE1_ZjdwNoVwwZ5vyiI4tZwrWUjSEz0zO9-SJ5-5ZKIUdp87pg5oQ8q2Tdybk0rBJsz69J6GpJ0OdoCEJD20g6buHidrc0UfLgC-AVJddzHga-eYhsJzzMJScFdP4A_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/GmbjqX178endfREaWxZypMC_AFE1_ZjdwNoVwwZ5vyiI4tZwrWUjSEz0zO9-SJ5-5ZKIUdp87pg5oQ8q2Tdybk0rBJsz69J6GpJ0OdoCEJD20g6buHidrc0UfLgC-AVJddzHga-eYhsJzzMJScFdP4A_0.png)

[![](https://www.redhat.com/rhdc/managed-files/ansible/XhX2OWT9Rb7eJHPuQ6OtJ7GzmAHBDxwnH2d-9_DfvVBzuzaUG0xs09si5M4pHYllzh6SLJzoCaeRh3I9z6l_VI5X9t3sMEfDZ8PutkYSYMp9EIC5uFMsy8g9_JZ06PVIg1n9dhyKkcZgyVFn5nm07t4_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/XhX2OWT9Rb7eJHPuQ6OtJ7GzmAHBDxwnH2d-9_DfvVBzuzaUG0xs09si5M4pHYllzh6SLJzoCaeRh3I9z6l_VI5X9t3sMEfDZ8PutkYSYMp9EIC5uFMsy8g9_JZ06PVIg1n9dhyKkcZgyVFn5nm07t4_0.png)

Once completed go back to the **Collections** menu option (1), and modify the filter. From the filter drop-down (2) change from **Keywords** to **Repository (3)**.

[![](https://www.redhat.com/rhdc/managed-files/ansible/wdZ2W6_9qoQXYyQOx9P5rGB02nEVEcm79CsHH5rlAptoKSd8pTmQflwypcg0e4vxKK5z6V7CK5jUhXgY11Y1ZTt0OpE8k8sMYBqErJswbHqpRJUkwI2baRDYnsaRg74aXqR6Q0t2vS896_snodpwNW0_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/wdZ2W6_9qoQXYyQOx9P5rGB02nEVEcm79CsHH5rlAptoKSd8pTmQflwypcg0e4vxKK5z6V7CK5jUhXgY11Y1ZTt0OpE8k8sMYBqErJswbHqpRJUkwI2baRDYnsaRg74aXqR6Q0t2vS896_snodpwNW0_0.png)

Then for the **Filter by repository** drop-down, select **validated**.

[![](https://www.redhat.com/rhdc/managed-files/ansible/ZTclnohOutXjYCjdKS9zQmg25mVWDbmUKd6_vlu5_6GxD-uBr2uUc4Hn-ndL_mWZuQi9VdC5X4KmsVyJcbh8nA3xUqKq_NR-7bzNTimMh4WAx6uZK1atA1tf1Wr4jMUWvG4iZY8m0xGQkyNOOHyGnsE_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/ZTclnohOutXjYCjdKS9zQmg25mVWDbmUKd6_vlu5_6GxD-uBr2uUc4Hn-ndL_mWZuQi9VdC5X4KmsVyJcbh8nA3xUqKq_NR-7bzNTimMh4WAx6uZK1atA1tf1Wr4jMUWvG4iZY8m0xGQkyNOOHyGnsE_0.png)

At this point you will be able to see all the available validated content, and you can start to explore this content and ways you can use this within your organization.

[![](https://www.redhat.com/rhdc/managed-files/ansible/eynbo7VF9oaLFHKh-KP9ZSZh4uNIJJrgFT6YiGVncnI5V6pi01p4BKXr2rf20T9P-lcWQgDKxLJ5Fvqa9YNh_vzq1D7vWYJlFqB5m6v3dFaXq51Vy8hZwb0CxOMfdFM4tZQzgKs3PQEqUdD_vO1Vsjw_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/eynbo7VF9oaLFHKh-KP9ZSZh4uNIJJrgFT6YiGVncnI5V6pi01p4BKXr2rf20T9P-lcWQgDKxLJ5Fvqa9YNh_vzq1D7vWYJlFqB5m6v3dFaXq51Vy8hZwb0CxOMfdFM4tZQzgKs3PQEqUdD_vO1Vsjw_0.png)

## What can I do next?

To learn more about Ansible Automation Platform on hyperscaler clouds, please visit the page [here](https://www.redhat.com/en/technologies/management/ansible).

Read a brief covering the use cases for validated content for each cloud provider:

- [Azure validated content](https://www.redhat.com/en/engage/migrate-microsoft-azure-using-redhat-ansible-automation-platform-20230921)
- [AWS validated content](https://www.redhat.com/en/engage/migrate-aws-ansible-20230926)
- [Google Cloud validated content](https://www.redhat.com/en/engage/migrate-google-cloud-using-red-hat-ansible-automation-platform-20230921)

For hands-on self-paced lab(s) on Ansible Automation Platform, you can [visit here](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218).

---

### About the author

[![Hicham Mourad](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/ansible/hicham%20%281%29_0.jpeg?itok=bbvELvbE)](https://www.redhat.com/en/authors/hicham-mourad)

[### Hicham Mourad](https://www.redhat.com/en/authors/hicham-mourad)

Hicham is responsible for technical marketing of the Red Hat Ansible Automation Platform on Clouds. Hicham has been in the software industry for over 20 years and for many of them focused on cloud management.
Hicham has been a frequent presenter at events and conferences like VMworld, vForum, VMUG, VMLive, Gartner, Dell Technology World, AWS re:Invent, HPE Discover, Cloud Field Day, Red Hat Summit, AnsibleFest, in addition to Customer events.

[More from this author](https://www.redhat.com/en/authors/hicham-mourad)

Enter keywords here to search blogs

UI\_Icon-Red\_Hat-Close-A-Black-RGB

Search

## More like this

Blog post

### [Stop searching, start operating: Scale hybrid clusters with Red Hat Advanced Cluster Management for Kubernetes 2.16](https://www.redhat.com/en/blog/stop-searching-start-operating-scale-hybrid-clusters-red-hat-advanced-cluster-management-kubernetes-216)

Blog post

### [Red Hat OpenShift 4.21: Smarter scaling, faster migration, and AI-powered efficiency](https://www.redhat.com/en/blog/red-hat-openshift-421-smarter-scaling-faster-migration-and-ai-powered-efficiency)
