---
title: The Windows enterprise in an Ansible galaxy
slug: windows-enterprise-ansible-galaxy
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2024-03-04'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/windows-enterprise-ansible-galaxy
description: Learn how to connect Windows servers with Ansible Automation Platform
  to help simplify, standardize, and scale your IT environment.
topics:
- Automation and management
read_time_minutes: 5
synced_at: '2026-09-03T19:21:39Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** Learn how to connect Windows servers with Ansible Automation Platform to help simplify, standardize, and scale your IT environment.

<!-- blog-enrichment:end -->

“We are the Borg. Lower your shields and surrender your ships. We will add your technological distinctiveness to our own and add it to our Red Hat Ansible Automation Platform inventory.”

Okay, so I added the last part but I am certain that in that sci-fi universe the Borg and Federation would be big users of Ansible.

Spock once said, “Superior ability breeds superior ambition.” One of the biggest benefits of Ansible is that it is use case friendly, meaning that it is able to provide automation to almost every part of the technology stack. Multi-vendor network appliances, hybrid cloud, infrastructure–these are all common projects for Ansible automation. With the latest addition of Event-Driven Ansible to the platform, we have the ability to automate those mission critical platforms and applications. Ansible has the superior ability to your superior ambition.

Now Windows–we all love Windows. We love it even more since it can also be automated with Ansible. Windows automation with Ansible is becoming increasingly popular. In this blog, I hope to add some “technical distinctiveness to our own” and show you how to “assimilate” Windows hosts using Ansible.

Windows administrators around the galaxy have a number of tools they use to manage their enterprise. These tools might serve the purpose for Windows administration but they inherently create a silo and rely on specialized expertise which we want to avoid. Imagine not being able to get the USS Enterprise to bring its shields up because we don’t have the correct tool or a specific engineer to do the job. Using a centralized platform with shared skill sets that can control the shields, the warp drive, the Holodeck, and the captain’s massage chair just makes practical and business sense. In an IT environment, Red Hat Ansible Automation Platform does exactly this.

> [!callout type=tmm label="TMM resource" title="Getting started with Event-Driven Ansible" url="/blog/getting-started-with-event-driven-ansible/" cta="Read the guide"]
> Step-by-step guide from the Ansible TMM team.

## Captains Log: Connecting to Windows

To connect to Windows hosts and automate them, we need to use WinRM (instead of SSH) and create an execution environment to run our automation tasks with the collections we use for Windows. Yes, we have certified and supported content collections for Windows as well as for tools like Chocolatey that can be used to deploy applications on Windows hosts.

If you are new to Ansible Automation Platform, execution environments are purpose-built containers that contain everything you need to automate with Ansible. You create these execution environments with the required collections that Ansible will need to run your job templates.

**Note:** To find out more about execution environments, have a look at: [The anatomy of automation execution environments](https://www.ansible.com/blog/the-anatomy-of-automation-execution-environments)

The execution environment I'm using for my Windows automation has the following requirement.yml:

|  |  |
| --- | --- |

```yaml
requirements.yml
--- collections:
- ansible.windows
- community.windows
- community.general
- ansible.utils
- ansible.posix
- chocolatey.chocolatey
- microsoft.ad
```

```text
requirements.txt    requests-credssp > 2.2.0
```

Once the execution environment ready, you can push it into a container registry like Quay.io or to your private automation hub which is part of Ansible Automation Platform. Next, I can add it to my automation controller and use it for all my Windows related automation templates.

![](https://lh7-us.googleusercontent.com/fiqI0Cs1ACy-dcIe0eJbFOBqmcdY2DcB435IFPVmVtGtxcN7zXkPHxAka9UPlrxSB4ZTP_d8pCjuDrnumYmylsVm1KQFAe8hRJiYtwYvVQZY-2BIbl6qOBOPq0yjHnDucYpC3nLX2F8JQQhtsbxfZ0A)

To prepare your Windows systems for Ansible assimilation, you can grab the latest copy of the [ConfigureRemotingForAnsible](https://github.com/ansible/ansible-documentation/blob/devel/examples/scripts/ConfigureRemotingForAnsible.ps1) PowerShell script and run it on your hosts. This is a quick baseline that you can use to customize and configure your host.

In my example, I will be using the following script to configure my hosts. I have a https listener configured, and I'm planning to use NTLM authentication since I am not running Kerberos. It is always recommended to run at least NTLM authentication. I am also enabling PowerShell remote protocol to give me a slight speed improvement.

```powershell
## Enable PowerShell Remote protocol
Enable-PSRemoting -Force
$certParams = @{    DnsName           = $env:COMPUTERNAME    CertStoreLocation = "Cert:\LocalMachine\My" }
$cert =
New-SelfSignedCertificate @certParams
## Configure HTTPS transport
$wsmanParams = @{    ResourceURI = "winrm/config/Listener"    SelectorSet = @{        Transport = "HTTPS"        Address = "*"    }    ValueSet    = @{        CertificateThumbprint = $cert.Thumbprint        Enabled               = $true    } }
New-WSManInstance @wsmanParams
## Configure Firewall Rules
$firewallParams = @{    DisplayName = "Windows Remote Management (HTTPS-In)"    Direction   = "Inbound"    LocalPort   = 5986    Protocol    = "TCP"    Action      = "Allow" }
New-NetFirewallRule @firewallParams
## Regedit to filter access tokens
$regInfo = @{    Path         = "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System"    Name         = "LocalAccountTokenFilterPolicy"    Value        = 1    PropertyType = "DWord"    Force        = $true }
New-ItemProperty @regInfo
```

## Windows: Engage!

We have our execution environment with our Windows collections and we have our hosts configured with WinRM. Now We need to configure these hosts in our inventory on Ansible Automation Platform and, since it's Windows, a bit more information around these hosts is needed. In my inventory, I have Windows hosts managed within a group and I have used group variables to define some of the details.

![](https://lh7-us.googleusercontent.com/zXNoRpQtZZlt2DETgf8E8iXFksOz1SDdAM4UsOrIGYSMmL7MfkZXFb6mrnQPnhKuEK1KVg_7JbCxbWXGGWwZNQG8D7C7HObyFO_y_sHvw1_dgI2CWFLlqXQUYjV6nsk_TioLYKI2HpQP36jOgIW8U34)

We will use these details when we attempt to connect to the Windows systems. We can now add our hosts to this group so they inherit the inventory variables we have defined at the group level. In my example, just like a totally logical Vulcan, my host is called windows.

![](https://lh7-us.googleusercontent.com/qKfyYQ-zqUz7XTk1nl00v-aYUDgBbbYbHLDGvpRSb19St5sME4W20HCaJC-hICqnIamp0_m7SkZ9XgjuQbTRfXBMxI5NTxwGIeiystrm2WWzC2zDn2yuitgpRigwQgEC5l_MAY8PCvmq_gHdearg_yo)

With our hosts in our inventory, we just need to create a credential to authenticate on our hosts. In this example I will use a standard machine credential with the local administrator account details.

Note: There is a great blog about the new [Active Directory Inventory plugin](https://www.redhat.com/en/blog/introducing-microsoft-active-directory-inventory-plug-ansible)which looks at how you can use Active Directory as a source of truth and credentials for your Windows hosts.

Lastly, I like to check that my connectivity is working. So we can go back into our inventory on our controller and navigate to our host that we have just added. In the automation controller, we have the ability to run commands or ad-hoc modules to test or gather information from our inventory hosts. We will select the host and then select: `run command`.

![](https://lh7-us.googleusercontent.com/TOXhFy84qVIHPDIbmr-H9_Zgu-Bsr3x7XYIMuumGIbMu4Ffke2Z_P2w5xKZzNT4U0K2c1CET7SbydHsMn_ORq5JAVKoqzVA1bgnS40jTSULUoINsJcav3njUyl9OqivMSZo_jE_c-X2x0QApBmw0acM)

We can use the `win_ping` module, which is used to check connectivity on Windows hosts with Ansible and not an ICMP ping.

![](https://lh7-us.googleusercontent.com/vLrKYaX0zufKWn3PPV6lBhhNPZHM8VEZA4-wA8mMdEbQeYG-gLTDVE5dxoovq3veZ5-QclFs6EztIR3jRNyqSue8cdkNE-8uADb6AOfY-en1pKi3p8fKgbs0DU4Bi49x9XhNOUU6l1RFoFZmaXT0gcQ)

Next we need to make sure that we execute this module in our Windows execution environment.

![](https://lh7-us.googleusercontent.com/HRfTfcpUBrS6-22CqPcA8SxXymOtH1mH94AXZX4eEpVCg-szbE9PtPE7GGqSTCjO7ZJ27OtIhUI6qiMZpbAV80YDXa0QyPYOFTr5AHxhBUfzoipcLdATp2dPDLAXbA1u424QOa4TMv-kKRKSoldyiQk)

We can then choose the desired credentials:

![](https://lh7-us.googleusercontent.com/npMNqctHShXolaN-T57VXbPyBjxu-iz9OQtSfyAhHeNEUIgm8V0TYjntYbDigDOG0ckZEEVkFs29CSlzMhRbhEDFRUCDOPHDoM8cpKt5A5AANnUFgOhvr0nP87xFxdChrHfLpK_WUtoi70D19933SgU)

We can then engage, I mean, launch. Our module should return a ”pong” for our “ping” if connectivity is successful. This means we are ready to automate!

![](https://lh7-us.googleusercontent.com/zilR81etZWSy0GgrYbv0VbYfgKBuHMG6WWJW2TQWr9zLRFdS0f9OPTbiLUP0dpDHEx25rJRHCrF23T1A6kX7d-EcPDctaA5az8W4iCv9ont9GAMSceptLDSh7ymot-uNDStzPW-vy9841xd2gDUXz9A)

We are ready to automate!

## What can I do next?

Whether you are beginning your automation journey or a seasoned veteran, there are a variety of resources to enhance your automation knowledge:

- Self-paced exercises - We have interactive, in-browser exercises to learn and dive into Ansible Automation Platform.
- [Trial subscription](http://red.ht/try_ansible) - Are you ready to install on-premises? Get 60 days of unlimited access to all the components of Ansible Automation Platform.
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel.](https://www.youtube.com/ansibleautomation)
- [Follow Red Hat Ansible Automation Platform on Twitter](https://twitter.com/ansible) - Do you have questions or an automation project you want to show off? Tweet at us!

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [AI threats move fast. Your defenses should too.](/blog/ai-threats-move-fast-your-defenses-should-too/)
> - [Event-Driven Ansible: Simplified event routing with Event Streams](/blog/event-driven-ansible-simplified-event-routing-event-streams/)
> - [Automating Microsoft Endpoint Configuration Manager with Red Hat Ansible Automation Platform](/blog/automating-microsoft-endpoint-configuration-manager-red-hat-ansible-automation-platform/)

<!-- blog-enrichment:related-end -->
