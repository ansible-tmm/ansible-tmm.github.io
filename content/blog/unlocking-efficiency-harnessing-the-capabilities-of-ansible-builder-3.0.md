---
title: 'Unlocking efficiency: Harnessing the capabilities of ansible-builder 3.0'
slug: unlocking-efficiency-harnessing-the-capabilities-of-ansible-builder-3.0
authors:
- slug: anshul-behl
  name: Anshul Behl
published: '2023-07-19'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/unlocking-efficiency-harnessing-the-capabilities-of-ansible-builder-3.0
description: This blog outlines the features of execution environment builder (ansible-builder)
  3.0 that was included with Red Hat Ansible Automation Platform 2.4.
topics: []
read_time_minutes: 7
synced_at: '2026-09-03T19:20:36Z'
---

- [Back to all posts](/blog/)

---

[![image (1)](https://www.redhat.com/rhdc/managed-files/ansible/image%20%281%29.png)](https://www.redhat.com/rhdc/managed-files/ansible/image%20%281%29.png)

We recently announced the general availability of [Red Hat Ansible Automation Platform 2.4](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2.4), This blog outlines the features of execution environment builder (ansible-builder) 3.0 that was included with this latest release.

With the introduction of Ansible Automation Platform 2, we introduced the concept of [automation execution environments](https://www.ansible.com/blog/the-anatomy-of-automation-execution-environments). A key part of enabling our customers to create, manage, and scale their automation, they are portable Ansible runtime environments which enable us to truly decouple the control and execution planes in Ansible Automation Platform. Automation execution environments replace the traditional virtual environments in Ansible Tower by providing a powerful dependency management solution. Customers can also improve their automation run efficiency, as they are lightweight Ansible runtime environments.

In general, an automation execution environment includes:

- Base [UBI 8/9](https://www.redhat.com/en/blog/introducing-red-hat-universal-base-image) image.
- A version of Python
- A version of ansible-core
- Python modules/dependencies
- Ansible Content Collections (optional)

The execution environment builder tool was built to aid in the creation of execution environments for Ansible customers and users. It provides a definition schema that is based on the above execution environment requirements.

## Ansible-builder 3.0 enhancements

ansible-builder version 3.0 introduces some major changes in the definition schema to help customers create execution environments with more efficiency. There were a few design principles that were kept in mind while working on this latest release, some of which came through feedback from users and customers who worked with ansible-builder v1 (included with the initial release of Ansible Automation Platform 2.)

Let’s talk about these design principles:

- **Fix common issues of build context hacking** - We wanted to fix the common causes of things that require people to hack the builder context that ansible-builder generates. It is hard to achieve any complex or advanced execution environment images without touching the Containerfile that gets generated in the builder context. We want users to version the builder definition file instead of the Containerfile or the builder context.
- **Single-file definition** - We offer optional file definition. You can still refer to the other files such as requirements.yml or requirements.txt if you have them or need them, but you should be able to define everything inline as well.
- **Consolidate ansible-builder components** - ansible-builder 1.x required two sets of images in combination with matching Python and Ansible versions to complete an execution environment build, so we consolidated all the build steps starting from a single base image. This will simplify the builds and result in fewer images to maintain as a side-effect.

## How to install ansible-builder version 3

As with all projects at Red Hat, ansible-builder follows an open development model and an upstream-first approach. The upstream project for [ansible-builder](https://github.com/ansible/ansible-builder) is distributed as a Python package, then packaged into an RPM for Ansible Automation Platform downstream. This also means that there are different ways to install the upstream package and the downstream ansible-builder.

**NOTE:** To get the downstream package for ansible-builder v3, you must subscribe to Ansible Automation Platform 2.4 repos from Red Hat.

Upstream Community:

```
pip3 install ansible-builder==3.0.0
```

**NOTE:** ansible-builder requires python>=3.9

Downstream [Ansible Automation Platform product](https://access.redhat.com/downloads/content/480/):

```
dnf install ansible-builder
```

The only difference between the upstream and downstream packages is the default base image. The downstream one points to the ee-minimal-rhel8 for Ansible Automation Platform 2.4 in Red Hat container registry while the upstream one points to the latest ansible-runner image from quay.io.

Ansible-builder version 3 allows you to specify any base image, any architecture, any Python version or any platform. As an Ansible Automation Platform customer, we want you to use the ee-minimal-rhel8 one as the recommended base image to build your execution environments.

## Changes to the definition schema

The execution environment definition format has changed with ansible-builder version 3, so I want to highlight the important things that you need to consider while building an execution environment with ansible-builder v3. All the items below should be part of a definition file. In the editor of your choosing, you can open a new file called execution-environment.yml, which is the default name that the builder will search for. You can also declare another name, but you will need to direct ansible-builder to look for that execution environment definition.

Different sections in the definition file include:

### Version

```
version: 3
```

This version of the execution environment definition file offers substantially more configurability and functionality over the previous versions. To use all the new features of ansible-builder v3 , you need to specify the version in the definition as “3”, otherwise you will encounter JSON schema errors. Just as a rule of thumb, if you are using ansible-builder v3, please start with this line as the first one in your execution environment definition.

### Images

This section is a dictionary that lists the definitions of the base images. In a simple scenario, if you are using the upstream/pip install of ansible-builder where you need to use ee-minimal-rhel8 as the base image, the section would look like this:

```
images:
  base_image:
    name: registry.redhat.io/ansible-automation-platform-24/ee-minimal-rhel8:latest
```

**NOTE:** As an Ansible Automation Platform customer, you will need to authenticate with [Red Hat Container Registry](https://access.redhat.com/RegistryAuthentication) before building your execution environment with ee-minimal-rhel8 as the base image.

If you are using the downstream package, you don’t need to specify this section - the default base image for the downstream package is the one specified.

### Options

This section is a dictionary that contains keywords/options that can affect ansible-builder runtime functionality. You can set the default package manager path in this section. If you are using the ee-minimal-rhel8 image as the base image, you will need to specify the package manager path differently. This is important as the minimal base images have microdnf as the package manager instead of dnf.

```
options:
  package_manager_path: /usr/bin/microdnf
```

### Dependencies

This section allows you to describe any dependencies that need to be installed into the final image. This is another big advantage of ansible-builder v3 as you can now specify all dependencies inline. For example, if you want to build an execution environment with the ansible.netcommon collection from Ansible Galaxy (default source), you would specify the section like this:

```
dependencies:
  galaxy:
    collections:
      - ansible.netcommon
```

Specifying collections inline is optional. You can also specify Python and system dependencies in the definition. An example from ansible-builder [documentation](https://ansible.readthedocs.io/projects/builder/en/stable/) looks like this:

```
dependencies:
  galaxy: requirements.yml
  python:
    - six
    - psutil
  system: bindep.txt
```

This example includes a combination of inline and file-based dependencies, where collection/role and system requirements come from different files that are adjacent to the definition file while the Python dependencies are declared inline.

### Combining above sections

The following example is how your execution-environment.yml file should appear after combining the above sections to create a simple execution environment with the ansible.netcommon collection:

```
version: 3
  

images:
  base_image:
    name: registry.redhat.io/ansible-automation-platform-24/ee-minimal-rhel8:latest
  

  
dependencies:
  galaxy:
    collections:
      - ansible.netcommon
  
  

options:
  package_manager_path: /usr/bin/microdnf
```

Pretty straightforward, right? The only step left is to run the build using the below command in the directory that includes this definition file and you will have your new execution environment:

```
ansible-builder build
```

## Using collections in Ansible automation hub

What if you want to pull collections from Ansible automation hub instead of Ansible Galaxy? You will need an ansible.cfg file that points to Ansible automation hub. The following sections explain how to include the anisble.cfg file in the execution environment definition with a few more sections:

### additional\_build\_files

This section allows you to add any file to the build context directory. These can then be referenced or copied by additional\_build\_steps during any build stage. The format is a list of dictionary values, each with a src and dest key and value.

For this scenario, we will add the ansible.cfg file to the files/ directory and it will act as our source directory. The destination directory gets created in the build context.

The directory tree would look something like this:

```
|--execution-environment.yml
|--files/
|   |--ansible.cfg
```

### additional\_build\_steps

In previous versions of ansible-builder, you were limited to one prepend and one append section which restricted where you could add different pieces into the container file. With ansible-builder 3.0, these sections have been expanded and are now associated with the different build phases. This means you can execute commands at specific points in your execution environment build process. For instance, you can add in additional repositories, copy arbitrary files, pull Python packages from specific Python repositories, or add custom root certificates during various stages of the build. This gives you a much finer level of control over the build process, allowing for more customization and flexibility.

This section enables you to specify custom build commands for any build phase. These commands will be inserted directly into the instruction file for the container runtime (e.g., Containerfile or Dockerfile). There are [different build phases](https://ansible.readthedocs.io/projects/builder/en/stable/definition/#additional-build-steps) that you can specify in this section. For this scenario, as we are working with the Ansible Galaxy stage (download build dependencies stage), we will specify the command in prepend\_galaxy stage.

After combining the two sections, we can append this to our original execution environment definition:

```
additional_build_files:
  - src: files # copy contents from files to configs dir in build context
    dest: configs

additional_build_steps:
  prepend_galaxy:
    # reference the file from build context like this
    - COPY _build/configs/ansible.cfg /etc/ansible/ansible.cfg
```

**NOTE:** Check the COPY command in prepend\_galaxy section. Whenever you want to copy files, you need to copy then from the build context or the \_build directory.

You can run the build command again as mentioned above to create your execution environment which will pull the ansible.netcommon collection from Ansible automation hub.

## Conclusion

Ansible-builder v3 provides you with a rich API to create custom execution environments with improved efficiency. The feature now provides options to cover any and all scenarios so you should never need to hack the Containerfile in the build context.

You can find detailed information on ansible-builder v3 in the [latest builder documentation](https://ansible.readthedocs.io/projects/builder/en/stable/). We also have a hands-on, self-paced lab, "Get started with ansible-builder", which you can find on the [Red Hat interactive labs page for Ansible Automation Platform](https://www.redhat.com/en/interactive-labs/ansible).

---

### About the author

[![Anshul Behl, Principal Technical Marketing Manager, Red Hat](https://www.redhat.com/rhdc/managed-files/styles/media_thumbnail/private/wa_profile%20-%20Anshul%20Behl.jpeg?itok=vYDgCAJj)](https://www.redhat.com/en/authors/anshul-behl)

[### Anshul Behl

Principal Technical Marketing Manager](https://www.redhat.com/en/authors/anshul-behl)

Anshul is a Principal Marketing Manager at Red Hat, where he brings his software development and QE experience to increase Ansible Automation Platform's adoption experience for customers by producing technical content on all aspects of the product.

[More from this author](https://www.redhat.com/en/authors/anshul-behl)

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
