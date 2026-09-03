---
title: Unleashing the Potential of Multi-Cloud Automation with Ansible and Terraform
slug: unleashing-the-potential-of-multi-cloud-automation-with-ansible-and-terraform
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2023-07-27'
updated: '2026-07-29'
source: redhat
source_url: https://www.redhat.com/en/blog/unleashing-the-potential-of-multi-cloud-automation-with-ansible-and-terraform
description: In this blog, we will look at how to employ Ansible, a powerful automation
  tool, to tap into the immense potential of multi-cloud environments.
topics:
- Cloud automation
read_time_minutes: 4
synced_at: '2026-09-03T19:20:52Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

[![](https://www.redhat.com/rhdc/managed-files/ansible/K16eLSpf-OiuYmYSkshiYKFiA2OtHa4jAZv-ces2vmkphiLSdv8OkgWInyg6-7dWfHT164OTugpZ9qyLcG3Ey9pC28ty1bMiAPy_5paBTEzWZvSEIfp5_I_GvYugu1ikTXX0liBv_u8SeBzwp441Xdc_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/K16eLSpf-OiuYmYSkshiYKFiA2OtHa4jAZv-ces2vmkphiLSdv8OkgWInyg6-7dWfHT164OTugpZ9qyLcG3Ey9pC28ty1bMiAPy_5paBTEzWZvSEIfp5_I_GvYugu1ikTXX0liBv_u8SeBzwp441Xdc_0.png)

In today's rapidly evolving digital landscape, businesses are dependent on streamlined processes and efficient systems more than ever. One such revolutionary pathway towards a more efficient and flexible IT infrastructure is multi-cloud automation. In this blog, we will look at how to employ Ansible, a powerful automation tool, to tap into the immense potential of multi-cloud environments. We take you on a journey behind the scenes of our interactive labs, where our customers and prospects acquire hands-on experience with Ansible while exploring its newest features. In our labs, public clouds such as Google Cloud, AWS, and Microsoft Azure are showcased. Using Ansible we can orchestrate a symphony of seamless provisioning and optimal multi-cloud management. So, buckle up for a deep dive into the realm of multi-cloud automation, where complexity is simplified, and potential is unleashed.

The Ansible Technical Marketing team uses a variety of tools to create training labs and technical sales workshops for our field teams and customers. One of our training platforms includes Instruqt, an as-a-service learning platform, to help us create [sandbox environments that can be run in your browser window](https://www.redhat.com/en/interactive-labs/ansible). For technical tools behind the scenes, we use a combination of Ansible and Packer to build cloud images, while we use Terraform to help provision images and containers onto Google Cloud, then use Ansible to customize our labs on a per-lab basis. You might be wondering, Ansible **and** Terraform? Ansible and Terraform are two very powerful but unique open source IT tools that are often compared. I have [wrote about them before in a previous blog](https://www.ansible.com/blog/ansible-vs.-terraform-demystified), but it is sufficient to say that the two tools are better together and can work in harmony to create a better experience for developers and operations teams. We also employ GitHub as our source of truth, so you can look at our secret sauce [online here](https://github.com/ansible/instruqt).

[![](https://www.redhat.com/rhdc/managed-files/ansible/E_GEh9A03CPVhCkgJDG-LyMrf_c_ox0xCbVOV2y7PaBbpWJewcSYwRABL6rf9J5RkFxJruKaUzHqwtZeyhJpvU2gR0lQbIZni7HHYtAy6A2-Q-p8NPjZdU-75otbTbrUmPYaFyMBFaRMNkeModDg6Eg_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/E_GEh9A03CPVhCkgJDG-LyMrf_c_ox0xCbVOV2y7PaBbpWJewcSYwRABL6rf9J5RkFxJruKaUzHqwtZeyhJpvU2gR0lQbIZni7HHYtAy6A2-Q-p8NPjZdU-75otbTbrUmPYaFyMBFaRMNkeModDg6Eg_0.png)

One of the first things we do for a lab is talk about the environment. What are we trying to showcase? What virtual machines or containers do we need to run to showcase the demo? For example, if I want to showcase a network automation lab, I will need a Cisco router or an Arista switch. If I want to showcase Windows automation, I am going to need a Windows server virtual server. Even more interesting for this blog, how do we showcase cloud automation itself? How do I show multi-cloud? Instruqt actually has a built-in way to create ephemeral public cloud credentials. This means for any given lab session, we can create a Google Cloud, AWS or Microsoft Azure cloud account, with credentials for the duration of that lab. As soon as the lab is finished, it will delete the cloud and it will cease to exist.

To illustrate how this works, let's go ahead and look at a lab. One of the labs I love to showcase is [hybrid cloud automation: AWS infrastructure visibility](https://play.instruqt.com/embed/redhat/tracks/cloud-visibility?token=em_IYvE6P3BoPg-Fo50).

[![](https://www.redhat.com/rhdc/managed-files/ansible/qXNYyHWpzIrLmB1adDNt7hO6FjIDtPqVFxiLrqaOtZXo5zSuA5tE0HfDrekynqlUll3Fw4ouXJzaU7n5mT9BLIWsT8gPaSJBajQA_WT8JQD_A_PB2bZvbjxdEj_p4UX9vnnmScE03I4NgkELezRoerI_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/qXNYyHWpzIrLmB1adDNt7hO6FjIDtPqVFxiLrqaOtZXo5zSuA5tE0HfDrekynqlUll3Fw4ouXJzaU7n5mT9BLIWsT8gPaSJBajQA_WT8JQD_A_PB2bZvbjxdEj_p4UX9vnnmScE03I4NgkELezRoerI_0.png)

In this lab you get access to three tabs. The first tab includes automation controller. This is the webUI for Red Hat Ansible Automation Platform and is running on Red Hat Enterprise Linux (RHEL) 9. For this lab we pre-built RHEL 9 with Ansible Automation Platform pre-installed so that the lab can boot up in minutes versus a normal fifteen minute installation.  To do this we ran a combination of packer and Ansible automation. Back in October, I wrote a blog post: [Using Ansible and Packer, From Provisioning to Orchestration](https://www.ansible.com/blog/ansible-and-packer-why-they-are-better-together) that shows how I can use the best of Packer and Ansible together to achieve really easy pipelines for creating virtual machine images. In our labs, we use a combination of Ansible (to install, set up and customize our controller image) and Packer (to publish the customized Google Cloud image).

[![](https://www.redhat.com/rhdc/managed-files/ansible/Y1yOg8eYtFg6vm91S-_zKuJOQXTPC6v0AhnI1IAFAPWBByrVYl10WT01XUBtWUypFlcAYVKWexUx1jw2MT4bh-i6GEwUCCft3MiGhGVqluVjvxuDMsymClU5uxlESEi-EqtuS9S6bLApgrW00UGhp_Y_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/Y1yOg8eYtFg6vm91S-_zKuJOQXTPC6v0AhnI1IAFAPWBByrVYl10WT01XUBtWUypFlcAYVKWexUx1jw2MT4bh-i6GEwUCCft3MiGhGVqluVjvxuDMsymClU5uxlESEi-EqtuS9S6bLApgrW00UGhp_Y_0.png)

When you launch the hybrid cloud automation: AWS infrastructure visibility lab, you are launching this pre-built automation controller image onto Google Cloud.

In the second tab we have access to an ephemeral AWS public cloud account. Instruqt will set environment variables for automation controller for us to use how we see fit. As soon as a lab launches, we launch an Ansible Playbook to further customize the lab. Let’s see an example of how we can immediately take advantage of these environment variables:

```
- name: add aws credential to automation controller
  awx.awx.credential:
    name: aws_credential
    description: Amazon Web Services
    organization: "Default"
    state: present
    credential_type: "Amazon Web Services"
    controller_username: "{{ username }}"
    controller_password: "{{ admin_password }}"
    controller_host: "https://{{ ansible_host }}"
    validate_certs: false  
    inputs:
      username: "{{ lookup('env','INSTRUQT_AWS_ACCOUNT_AWSACCOUNT_AWS_ACCESS_KEY_ID') }}"
      password: "{{ lookup('env','INSTRUQT_AWS_ACCOUNT_AWSACCOUNT_AWS_SECRET_ACCESS_KEY') }}"
  register: controller_try
  retries: 5
  until: controller_try is not failed
```

When a student goes through the lab, they can see the credential is already pre-setup for them in automation controller:

[![](https://www.redhat.com/rhdc/managed-files/ansible/ctPqsW_31t0NfZbirSq4H9B6xPkDlU_fzKJg5eZj-NPKb1i-DVf8pXctBdXGeJFwCYfHA9baXPuXZXlDwj074GOpy2LdHxWJyPDz5r5Wvs1TTUDXGXdl4-QXAz1gERhNhFdnEsCumidts910WWp4s5A_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/ctPqsW_31t0NfZbirSq4H9B6xPkDlU_fzKJg5eZj-NPKb1i-DVf8pXctBdXGeJFwCYfHA9baXPuXZXlDwj074GOpy2LdHxWJyPDz5r5Wvs1TTUDXGXdl4-QXAz1gERhNhFdnEsCumidts910WWp4s5A_0.png)

In addition, Ansible Automation Platform will auto-provision two RHEL instances into AWS cloud. This effectively means, although we don’t advertise it, you are performing multi-cloud automation every time one of our hybrid cloud demos is performed. Automation controller is running on RHEL 9 on Google Cloud, but the virtual machines we are automating, as well as some operational cloud automation, are all on AWS. Here is a look at a simple diagram illustrating this point:

[![](https://www.redhat.com/rhdc/managed-files/ansible/d6ePOz5z6FF0bD780TdvsjQYdVj7i6li-QhD411ShfxriX-unmLpc4Vm6B4RaB2LZQoLho78RffhS23TfbWG5YYV77WmIUbmbZhOhNP4BGpljbDZpn1Fq3AECMAz2CaPDDAc4ijyR384Pl-Lalj5C0o_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/d6ePOz5z6FF0bD780TdvsjQYdVj7i6li-QhD411ShfxriX-unmLpc4Vm6B4RaB2LZQoLho78RffhS23TfbWG5YYV77WmIUbmbZhOhNP4BGpljbDZpn1Fq3AECMAz2CaPDDAc4ijyR384Pl-Lalj5C0o_0.png)

Now the lab simply walks the student through how to create automation jobs in automation controller to create some dynamic documentation:

[![](https://www.redhat.com/rhdc/managed-files/ansible/B8JdaG6PK-vB_eMpaaQ5ExKOmRwbVcJISv7BjGjlRpPjC2HmYcmJSVTSStH6nImWvqdqf-eWCNpUM2QluWWMyZ5js6QxCS2YRnlt9vx8KrXM4BAZGIGzYn6CBwG1gaTJ9KMz8xOVp40C6NQGsczDm0A_0.png)](https://www.redhat.com/rhdc/managed-files/ansible/B8JdaG6PK-vB_eMpaaQ5ExKOmRwbVcJISv7BjGjlRpPjC2HmYcmJSVTSStH6nImWvqdqf-eWCNpUM2QluWWMyZ5js6QxCS2YRnlt9vx8KrXM4BAZGIGzYn6CBwG1gaTJ9KMz8xOVp40C6NQGsczDm0A_0.png)

Using Ansible Automation Platform, your organization can enact read-only operations that provide insight into what is running on your clouds and deliver immediate value without the risk of use cases that require production changes. Ansible Automation Platform makes it possible to aggregate information from your various environments and cloud services into a single, customizable management interface to help you understand your entire cloud environment. Through this unified management interface, you can use that information to create inventories and data reports to better inform your hybrid cloud management decisions.

## Where do I go next?

Check out these resources to learn more:

- This 2 page datasheet: Get started with infrastructure visibility for your hybrid cloud
- This IDC spotlight sponsored by Red Hat: Cloud automation delivers business value, Doc #US49289622, June 2022
- Red Hat Ansible Interactive Labs: <https://red.ht/ansible_labs>

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

### [Stop searching, start operating: Scale hybrid clusters with Red Hat Advanced Cluster Management for Kubernetes 2.16](https://www.redhat.com/en/blog/stop-searching-start-operating-scale-hybrid-clusters-red-hat-advanced-cluster-management-kubernetes-216)

Blog post

### [Red Hat OpenShift 4.21: Smarter scaling, faster migration, and AI-powered efficiency](https://www.redhat.com/en/blog/red-hat-openshift-421-smarter-scaling-faster-migration-and-ai-powered-efficiency)
