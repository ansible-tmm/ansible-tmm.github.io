---
title: Build a quick CI system using Red Hat Ansible Tower with GitHub Actions
slug: build-a-quick-ci-system-using-red-hat-ansible-tower-with-github-actions
authors:
- slug: sean-cavanaugh
  name: Sean Cavanaugh
published: '2019-05-16'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/build-a-quick-ci-system-using-red-hat-ansible-tower-with-github-actions
description: This blog post from Sean Cavanaugh covers his journey of getting Github
  Actions to work with Red Hat Ansible Tower.
topics: []
read_time_minutes: 5
synced_at: '2026-09-03T19:21:14Z'
---

- [Back to all posts](https://www.redhat.com/en/blog)

---

[![RH-Ansible-TowerAPI-with-Github-Actions-Blog](https://www.redhat.com/rhdc/managed-files/ansible/RH-Ansible-TowerAPI-with-Github-Actions-Blog.jpg)](https://www.redhat.com/rhdc/managed-files/ansible/RH-Ansible-TowerAPI-with-Github-Actions-Blog.jpg)

Red Hat Ansible Tower can be considered the API (Application Programmatic Interface) for your Ansible Playbooks. Even if you don’t take advantage of the Web UI (User Interface) many Ansible users still benefit from using Ansible Tower because they can fit it in their existing ecosystem of tools. Are you new to using the API on Ansible Tower and want to learn how to get started? This blog post will cover my own journey of getting Github Actions to work with Red Hat Ansible Tower. My goal was to be able to have Github PRs (Pull Requests) to trigger a workflow template to perform some automated testing using an Ansible [Tower workflow](https://docs.ansible.com/ansible-tower/latest/html/userguide/workflows.html). The popularity of [some Ansible Playbooks I wrote](https://github.com/network-automation/linklight) is on the rise, so I thought I’d add some automated testing – just to make sure I didn’t accidentally break something the community was using.

I created a workflow in Red Hat Ansible Tower to provision instances into AWS (Amazon Web Services), run some Ansible Playbooks on the provisioned Red Hat Enterprise Linux control nodes, then perform a teardown and remove the instances, VPCs and any other artifacts from AWS. This provisioning, testing and teardown allows me to help ensure changes to my Github repo are tested methodically before anything is merged into the master branch. This also helps save time, and that is what automation is all about.

I think the best approach to building an automated workflow is to reduce the test cases to discrete items and test each one to make sure they work repeatedly before adding the next. This blog post won’t cover my existing Ansible Tower workflow, but we will assume that the workflow works before I start using the API. The second thing I want to do is make sure the API requests are working before I start using Github Actions. I can use the browsable API on Ansible Tower to figure out the exact command I need. I will navigate to https://<my\_tower>.<testing>.com/api and find exactly what I want to do. In my case I want to kick off a job template launch, which makes Ansible Tower run the entire workflow.

[![image4](https://www.redhat.com/rhdc/managed-files/ansible/image4.png)](https://www.redhat.com/rhdc/managed-files/ansible/image4.png)

There is an example of using curl to talk to the Ansible Tower API located in the documentation: <https://docs.ansible.com/ansible-tower/latest/html/administration/tipsandtricks.html#launching-jobs-with-curl>

## HTTPie

There is another popular open source command line HTTP client called HTTPie. Its goal is to make CLI interaction with web services as human-friendly as possible. For example, this is what an API request to Ansible Tower could look like using HTTPie:

```
~ http POST https://ansible.io/api/v2/job_templates/84/launch/ --auth seanc:password123!
```

The above HTTPie command will launch job 84, which is a unique identifier for my workflow job template. You can see what job id represents your job by using the browsable API and listing the jobs out or using the Web UI and looking at the browser window address bar.

> **Quick note on authentication:** HTTPie supports a variety of authentication plugins including OAuth. In the simple example, we are showing a fake password in plain text. More details on authentication can be found here: <https://github.com/jakubroztocil/httpie#11authentication>

## GitHub Actions

I bring up HTTPie because it is already an available Action within Github Actions, so I needed to make sure I knew how HTTPie worked, what parameters I needed, and how to authenticate my requests. It is simple to use and even worked on my older MacOS laptop. It is not because curl is better or worse, I was just trying to use something that had clear examples working in Github Actions. I am sure there are numerous ways I could accomplish the same task.  
  
Now that I have HTTPie working I can start building my Github Actions workflow. When you first click on the Github Actions tab on a repo, you will get a blank page with a “Create a new workflow” green button:

[![image3-1](https://www.redhat.com/rhdc/managed-files/ansible/image3-1.png)](https://www.redhat.com/rhdc/managed-files/ansible/image3-1.png)

Click the green button and name your workflow file (I just used the default). Then click on the blue text “create a new workflow”. This will default you into the Visual editor. You can name the workflow here. For this blog post I am not going to use the Visual editor any further, and preferred to use the <> Edit file tab at the top.

When creating a Github Action you create a workflow file, if using the Visual editor it will be creating this workflow file for you. For my use case I only want to trigger something on a Pull Request. A Pull Request is how someone from the community will try to merge a change into the Github repository. As soon as this Github Pull Request comes in I want it to kick off an API request to Ansible Tower, and then launch the workflow job template.

After reading the Github Actions documents and going through the available Actions and deciding to use the HTTPie Github Action ([that can be found here](https://github.com/swinton/httpie.action)) I came up with the following Github Action workflow file:

```
workflow "Linklight Test Workflow" {  
 on = "pull_request"  
 resolves = ["Call httpbin"]  
}  
  
action "Call httpbin" {  
 uses = "swinton/httpie.action@master"  
 args = ["POST", "https://ansible.io/api/v2/job_templates/84/launch/", "--auth=$USER_PASSWORD"]  
 secrets = ["USER_PASSWORD"]  
}
```

As you can see my Github Action workflow file is pretty simple. If I receive a Pull Request on any branch I will initiate a HTTPie request to my Red Hat Ansible Tower job for the workflow template. The only major ‘gotcha’ I had with the process was storing my credentials. This seemed very simple in the Visual Editor, you can click on the Action and add secrets. In my case I create a variable (as seen above) called USER\_PASSWORD and put my username and password in there. The SECRET\_KEY is USER\_PASSWORD and the Secret value is simply my password (e.g. seanc:password123!)

[![image1-1](https://www.redhat.com/rhdc/managed-files/ansible/image1-1.png)](https://www.redhat.com/rhdc/managed-files/ansible/image1-1.png)

Now I simply created a test repo in my organization to play around with my new Github Action workflow. I submitted a test PR from one test branch to another one and it shows up after only 4-5 seconds!

[![image2-2](https://www.redhat.com/rhdc/managed-files/ansible/image2-2.png)](https://www.redhat.com/rhdc/managed-files/ansible/image2-2.png)

The call httpbin is the name from my Github Action workflow file. You can click on the Details link and see API request and how Red Hat Ansible Tower responded. I hope to show a more feature complete demonstration in the future, but I was able to accomplish my original goal pretty easily after just looking at a few examples! Super big thanks to [Chris Short](https://www.redhat.com/blog/author/chris-short) who educated me about Github Actions and encouraged me to sign up for the beta.

## AnsibleFest 2019

Want to talk to the folks writing the blog posts? Come join us in Atlanta, GA September 24-26 at [AnsibleFest 2019](https://www.redhat.com/ansiblefest)!

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

### [The architecture of autonomy: How ING built a future-proof tech strategy](https://www.redhat.com/en/blog/architecture-autonomy-how-ing-built-future-proof-tech-strategy)

Blog post

### [The last mile problem in agentic AI: Why tool calling reliability is harder than it looks](https://www.redhat.com/en/blog/last-mile-problem-agentic-ai-why-tool-calling-reliability-harder-it-looks)

Original podcast

### [How Red Hat cleared IT debt for scalable AI](https://www.redhat.com/en/technically-speaking/ai-ready-data-cleanup)

Original podcast

### [Virtualization Is (Still) King | Compiler](https://www.redhat.com/en/compiler-podcast/virtualization-ai)
