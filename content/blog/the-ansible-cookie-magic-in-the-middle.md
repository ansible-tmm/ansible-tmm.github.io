---
title: 'The Ansible cookie: Magic in the middle'
slug: the-ansible-cookie-magic-in-the-middle
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2022-03-09'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/the-ansible-cookie-magic-in-the-middle
description: Private automation hub provides organizations with a central location
  for their automation resources.
topics: []
read_time_minutes: 4
synced_at: '2026-09-03T19:21:47Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

If Ansible Automation Platform was compared to the crunchy goodness of a cookie, private automation hub would be the sweet center bringing it all together and making your mouth water!

Private automation hub provides organizations with a central location for their automation resources. Ansible automation hub is part of the hosted services from [console.redhat.com](https://console.redhat.com). This hosted offering provides automation adepts access to Red Hat Ansible Certified Content Collections for several industry-leading technologies and partners.

[![](https://www.redhat.com/rhdc/managed-files/ansible/HVO-iLb2a4n1vdP6YI7oebxvh5hUbUArl__OuIVQ3AnUSQRbGuJlEi03AEyRGUpjZZ2FmDFxGV2ubIlZU3dtS2FA2Ys63lCo3A63boEbBHdnbCBzE8nY1BadVfJB5FJz0TchdYAO.png)](https://www.redhat.com/rhdc/managed-files/ansible/HVO-iLb2a4n1vdP6YI7oebxvh5hUbUArl__OuIVQ3AnUSQRbGuJlEi03AEyRGUpjZZ2FmDFxGV2ubIlZU3dtS2FA2Ys63lCo3A63boEbBHdnbCBzE8nY1BadVfJB5FJz0TchdYAO.png)

Private automation hub brings this functionality on-premises and allows for users to curate their custom automation content with not only Red Hat Ansible Certified Content but with community content from Ansible Galaxy. Private automation hub also acts as a container registry where we can store and distribute the automation execution environments needed for Ansible Automation Platform 2.

How do we get started with building our own private automation hub and use it in our enterprise? How do automation controller and private automation hub interact?

Let’s get cooking and build our mouthwatering automating platform!

To deploy the “magic in the middle,” we are going to use the Ansible Automation Platform installer from our automation controller node. Since we are installing a private automation hub, we should remove the controller hostname from the inventory file.

Our inventory file should contain the relevant information for the private automation hub node.

```
…
[automationhub]
private-hub.demoredhat.com
automationhub_admin_password='my-hub-password'
automationhub_pg_host=''
automationhub_pg_port=''
automationhub_pg_database='automationhub' 
automationhub_pg_username='automationhub'
automationhub_pg_password='hub-postgres-password' 
automationhub_pg_sslmode='prefer'
…
```

With these details in place we can now trigger the setup script for Ansible Automation Platform and watch the wizardry.

If we have run the installer from the hub node itself, we might find that the private automation hub is not connected to our automation controller. If this is the case, we correct this by editing the following file:

```
/etc/pulp/settings.py
…
CONNECTED_ANSIBLE_CONTROLLERS = [
            "https://controller.demoredhat.com/",     
        ]
…
```

Once we have edited the settings.py configuration we can restart the pulpcore services.

```
systemctl restart pulpcore*
```

## Connecting to Ansible automation hub

With the automation controller and private automation hub now deployed, we can start configuring our content for our automation platform.

For us to synchronize our Red Hat Ansible Certified Content, we need to go to [console.redhat.com](https://console.redhat.com) and login with our Red Hat account. Under Ansible Automation Platform we will have access to the Ansible automation hub. Under “Automation Hub”, select “Connect to Hub”, where we are presented with the information we need to put into our private automation hub so we can synchronize the collections we want to curate for our organization.

[![](https://www.redhat.com/rhdc/managed-files/ansible/i8OvtoG7SPx-txFVZO6jOMVY3PNns7pTNekCSLzhPsyM-AODA9k5YRdNFcyvzKSIaJi4X9h3qjYMDrWC-sYNhKUaYUlpggRxODDVJD1_NcjqsMzf4Lg6qyWlmieW7vkjmlQ6UxAi.png)](https://www.redhat.com/rhdc/managed-files/ansible/i8OvtoG7SPx-txFVZO6jOMVY3PNns7pTNekCSLzhPsyM-AODA9k5YRdNFcyvzKSIaJi4X9h3qjYMDrWC-sYNhKUaYUlpggRxODDVJD1_NcjqsMzf4Lg6qyWlmieW7vkjmlQ6UxAi.png)

Moving back to our private automation hub, we can navigate to our repository management under the Collections section and select “Remote”. We are presented with two repositories ready to be configured.

|  |  |
| --- | --- |
|  | **community**: Ansible Galaxy community collections and content.    **rh-certified**: Red Hat certified collections and content |

To edit the `rh-certified` configuration, we will use the token and information provided by the hosted automation hub.

|  |  |
| --- | --- |
|  | **Token**: Our token from cloud.redhat.com Automation Hub    **Username/Password**: Our console.redhat.com credentials |

Once configured, we can now sync the certified content back to our private automation hub.

The community remote repository allows us to configure Ansible Galaxy using a curated `requirements.yml` file as well as our credentials for Ansible Galaxy. We will now be able to synchronize the collections and content from our requirement file from Ansible Galaxy.

We are now able to see the synchronized collections in our private automation hub.

[![](https://www.redhat.com/rhdc/managed-files/ansible/h39undJ84Lw7AiaACIcRmmxyzJ2r6ZiVT1RIAUXPemoKGFYeabxN9aX4cMDsdIFMYzAz6IoFxP8g9D-8NOJEATT6ImziqBB_riQj-AzMoIfwEJYG1ZXpJXtoJM1zpnk9y7-I83eL.png)](https://www.redhat.com/rhdc/managed-files/ansible/h39undJ84Lw7AiaACIcRmmxyzJ2r6ZiVT1RIAUXPemoKGFYeabxN9aX4cMDsdIFMYzAz6IoFxP8g9D-8NOJEATT6ImziqBB_riQj-AzMoIfwEJYG1ZXpJXtoJM1zpnk9y7-I83eL.png)

## Centralizing and managing automation execution environments

Private automation hub allows us to store, manage and push our automation execution environments to our automation controller. We can connect to external container registries and pull the execution environments we want on our platform.

Private automation hub should have the default execution environments, which are deployed in the automation controller when it is installed. If we want to add execution environments from remote repositories, we need to configure the repository first. To configure a remote repository, navigate to “Remote Registries” found under the execution environments menu and select “add remote registry”.

[![](https://www.redhat.com/rhdc/managed-files/ansible/3m_LWx6Auww4hxWaUbVIBkCX0BKIb6r1t1bsouVmuAxvJUNMIQEAAwNXQsHWqrR6eXyRo04uTFH345TzaZM6pjL4nc8rWurzSmHZWZj2eIgIvtC4U4l-xuQFFuQ1oPDR1hzEB6L4.png)](https://www.redhat.com/rhdc/managed-files/ansible/3m_LWx6Auww4hxWaUbVIBkCX0BKIb6r1t1bsouVmuAxvJUNMIQEAAwNXQsHWqrR6eXyRo04uTFH345TzaZM6pjL4nc8rWurzSmHZWZj2eIgIvtC4U4l-xuQFFuQ1oPDR1hzEB6L4.png)

Using Red Hay Quay.io as an example, we have configured the remote registry details and credentials.

We will now be able to add the execution environments we have stored in Quay into the platform.

In addition, we can add [registry.redhat.io](https://registry.redhat.io) as a remote registry and have private automation hub index the images available.

With the registry configured we can now add execution environments that are hosted by the registry.

[![](https://www.redhat.com/rhdc/managed-files/ansible/yhU4niFzGiAq6DMnDjAkNBXxn2K_s6IKMa7Sofh9zXowR790U-Q6K2qUeF8INbdq-b5VjiFnzAsZqP99ccpJTYYobTSNs8nUHNODokr8DMs4v9GMsQyZpeiSzDKVoPFaTmyxpFm2.png)](https://www.redhat.com/rhdc/managed-files/ansible/yhU4niFzGiAq6DMnDjAkNBXxn2K_s6IKMa7Sofh9zXowR790U-Q6K2qUeF8INbdq-b5VjiFnzAsZqP99ccpJTYYobTSNs8nUHNODokr8DMs4v9GMsQyZpeiSzDKVoPFaTmyxpFm2.png)

Select execution environments and click on “Add execution environment”.

We need to specify the upstream name would typically be the project ID and the name of the execution environment.

We can specify tags if we are looking for a specific version of the image. Lastly, we can allocate the user group for access to the execution environment.

[![](https://www.redhat.com/rhdc/managed-files/ansible/j20qbbKhG4EWw8Dggaatu3eTAgj5Hyiips696zJD4mKojKdDiMuJpn0XkmDx2lKorBzaI8gKagvqpwqX305IJ5GhrdFCtFh3RiEArWs1gmyf9-COQiz_nOTibGKZnXS3Bwn8Z4OQ.png)](https://www.redhat.com/rhdc/managed-files/ansible/j20qbbKhG4EWw8Dggaatu3eTAgj5Hyiips696zJD4mKojKdDiMuJpn0XkmDx2lKorBzaI8gKagvqpwqX305IJ5GhrdFCtFh3RiEArWs1gmyf9-COQiz_nOTibGKZnXS3Bwn8Z4OQ.png)

Once we have completed adding the execution environment, we can select the ellipsis and select “sync from the registry”.

This will pull the container image for your execution environment into your private automation hub.

Selecting the execution environment allows you to see the image file as well as the generated `podman` command.

[![](https://www.redhat.com/rhdc/managed-files/ansible/8sYep8W0tPB1G_MHaKcPMCAHgkO1wGUnEyYs9VTxSECb-YQWM2VcGvRHqqkh0MIbYxHCohIoJUA1g03i1R01RDHuFUikeQlbXRkjx94cIKZWbwGOJaWsc_vRwDjRkKp2Ak22pnMe.png)](https://www.redhat.com/rhdc/managed-files/ansible/8sYep8W0tPB1G_MHaKcPMCAHgkO1wGUnEyYs9VTxSECb-YQWM2VcGvRHqqkh0MIbYxHCohIoJUA1g03i1R01RDHuFUikeQlbXRkjx94cIKZWbwGOJaWsc_vRwDjRkKp2Ak22pnMe.png)

Now that we have our execution environment, we can send it to our automation controller. Selecting the ellipsis and choosing “Use in Controller”. Here, we can see all the relevant information regarding our execution environment and select which automation controller to push it to. Once you select your controller you will be redirected to your automation controller to add the execution environment.

[![](https://www.redhat.com/rhdc/managed-files/ansible/4sbkBOyiD7D0fEko8LXNBFedV3Jtbz3t3-nQRzY7jCfvw4COGb5iHS3cpeQhsiIR8iLDawYsLctH6QzM4fb1fldOztz16mXlthd67nVLTa1T3yjDnBjEmciFWD_iFlVo7dXb3Scm.png)](https://www.redhat.com/rhdc/managed-files/ansible/4sbkBOyiD7D0fEko8LXNBFedV3Jtbz3t3-nQRzY7jCfvw4COGb5iHS3cpeQhsiIR8iLDawYsLctH6QzM4fb1fldOztz16mXlthd67nVLTa1T3yjDnBjEmciFWD_iFlVo7dXb3Scm.png)

Now we have our automation cookie up and running, it's time to indulge in our sweet automation!

## Additional resources

- Try [Ansible Automation Platform](https://www.redhat.com/en/technologies/management/ansible/try-it) free for 60 days
- Blog: [How to Activate Insights for Ansible Automation Platform](https://www.ansible.com/blog/activate-insights-for-ansible-automation-platform)
- Blog: [Introducing Ansible Automation Platform 2.1](https://www.ansible.com/blog/introducing-red-hat-ansible-automation-platform-2.1).

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
