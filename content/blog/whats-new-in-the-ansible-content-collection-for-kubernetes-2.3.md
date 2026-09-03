---
title: What’s New in the Ansible Content Collection for Kubernetes 2.3
slug: whats-new-in-the-ansible-content-collection-for-kubernetes-2.3
authors:
- slug: roger-lopez
  name: Roger Lopez
published: '2022-03-21'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/whats-new-in-the-ansible-content-collection-for-kubernetes-2.3
description: In this blog post, we’ll go over what’s new and what’s different in this
  release of our Kubernetes Collection.
topics: []
read_time_minutes: 4
synced_at: '2026-09-03T19:22:00Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** In this blog post, we’ll go over what’s new and what’s different in this release of our Kubernetes Collection.

> [!toc]
> **On this page**
>
> - [New Module - k8s\_taint](#new-module-k8s-taint)
> - [Enablement of Server-Side Apply](#enablement-of-server-side-apply)
> - [Incremental Improvements](#incremental-improvements)
> - [Summary](#summary)

<!-- blog-enrichment:end -->

With increased adoption of container automation, IT organizations continue to expand their requirements when it comes to deploying and managing their Kubernetes clusters. As such, we at Red Hat continue to add new features and capabilities to meet those demands by announcing the availability of `kubernetes.core` version 2.3, our Red Hat Ansible Certified Content Collection for Kubernetes and Helm.

In this blog post, we’ll go over what’s new and what’s different in this release of our Kubernetes Collection.

## New Module - k8s\_taint

With the release of `kubernetes.core` 2.3, we introduce the `k8s_taint` module. This module provides the ability for a Kuberentes node to repel a pod or set of pods from being scheduled unless they have a matching toleration. This establishes that with taints and tolerations in place, pods are not scheduled onto inappropriate nodes.

This feature is quite useful when you are trying to ensure exclusivity of a particular set of nodes (only allow a particular group of users access) or you want to provide particular nodes with special hardware (such as GPUs) to only run pods that require the use of the specialized hardware and keep out the pods that don’t require it.

An example of using the `k8s_taint` module where the toleration key has a value of `key1` and its effect is to not execute `NoExecute`. This means that no pod will be able to execute onto node `foo` unless it has a matching toleration.

```
- name: Taint node "foo"
  kubernetes.core.k8s_taint:
    state: present
    name: foo
    taints:
    - effect: NoExecute
      key: "key1"
```

Additionally, more than one effect can be provided to apply additional effects:

```
- name: Taint node "foo"
  kubernetes.core.k8s_taint:
    state: present
    name: foo
    taints:
    - effect: NoExecute
      key: "key1"
      value: "value1"
    - effect: NoSchedule
      key: "key1"
      value: "value1"
```

This means that no pod will be able to execute nor schedule onto node `foo` unless it has a matching toleration.  

**NOTE**: The available effects of the taint on pods are: `NoSchedule`, `NoExecute` and `PreferNoSchedule`.

Lastly, a taint can be removed by changing the state from present to absent:

```
- name: Remove taint from "foo".
  kubernetes.core.k8s_taint:
    state: absent
    name: foo
    taints:
    - effect: NoExecute
      key: "key1"
      value: "value1"
      value: "value1"
```

## Enablement of Server-Side Apply

Server Side Apply assists users and controllers in managing their resources via declarative configurations. One of the goals of Server Side Apply is to provide more robust handling of conflicts that might arise when a resource is modified by multiple agents concurrently. Client Side Apply works by first fetching the existing resource, then determining the difference between the existing state of resource and the desired state of the resource. If they differ, a patch is applied to the resource for the difference. When resources are modified concurrently, this can lead to race conditions where the same fields are being changed. Server Side Apply assigns ownership of individual fields, preventing unintended changes from being applied in situations where there is contention.

To take advantage of Server Side Apply within `kubernetes.core.k8s`, a user can use the `server_side_apply` field that declare a `field_manager` as follows:

```
- name: Create configmap using server side apply
  kubernetes.core.k8s:
    namespace: testing
    definition:
      apiVersion: v1
      kind: ConfigMap
      metadata:
        name: my-configmap
    apply: yes
    server_side_apply:
      field_manager: ansible
```

**NOTE**: This option requires Kubernetes Python Client 19.15.0 or higher.

## Incremental Improvements

In this release, we have replaced the client side implementation of dry run with server side dry run. With this switch, we can make sure that admission controllers are run and schema validation occurs, providing a more accurate representation of the changes. This feature requires a Kubernetes Python Client version >= 18.20.0, and is used automatically when running the `kubernetes.core.k8s` module in `check` mode.

We have also added the ability to impersonate users and groups through the new `impersonate_user` and `impersonate_groups` parameters in the `kubernetes.core.k8s` module. To use this feature, the authenticating user must have the ability to perform the `impersonate` verb. This can be configured using Kubernetes RBAC.

There have been a number of small improvements to our Helm modules. The `kubernetes.core.helm_info` module now has a `release_state` parameter that gives you expanded control over filtering releases. The default behavior of returning only releases in the failed or deployed state remains the same. Additional release states are now supported, as well.

A new `plugin_version` parameter has been added to the `kubernetes.core.helm_plugin` module. In addition to being able to install a specific version of Helm plugin, a new latest state was added. This state verifies that the requested plugin is always at the latest version. This differs from the default present state in that with `state: present`, the latest version will only be installed if the plugin is not currently installed.

Finally, the `wait` parameter on the `kubernetes.core.helm` module will now work when deleting releases. Previously, this only worked when installing or upgrading a release due to limitations in helm itself. This functionality requires a helm version >= 3.7.0.

> [!callout type=tmm label="Team resource" title="Kubernetes automation content" url="/blog/creating-kubernetes-dynamic-inventories-with-kubernetes.core-modules/" cta="Read the guide"]
> Collections, inventories, and patterns from the Ansible TMM team.

## Summary

With the newest release of Ansible Content Collection for `kubernetes.core`, users now have:

- the flexibility to set taints and tolerations to repel a pod or set of pods from being scheduled unless they have a matching toleration.
- the ability to implement Server Side Apply to manage their resources via declarative configurations.
- the ability to impersonate users and groups through the new `impersonate_user` and `impersonate_groups` parameters in the `kubernetes.core.k8s` module.
- additional improvements to various Helm modules.

If you want to dive deeper into Ansible and Kubernetes, check out the following resources:

- The [Ansible Content Collection](https://github.com/ansible-collections/kubernetes.core) for [Kubernetes](https://github.com/ansible-collections/kubernetes.core) project repo
- [Ansible Content Collection for OpenShift](https://console.redhat.com/ansible/automation-hub/repo/published/redhat/openshift)
- [Automating Helm Using Ansible](https://www.ansible.com/blog/automating-helm-using-ansible)
- [What's New in the Ansible Content Collection for Kubernetes - 2.0](https://www.ansible.com/blog/whats-new-in-the-ansible-content-collection-for-kubernetes-2.0)
- [Introducing the Ansible Content Collection for Red Hat OpenShift](https://www.ansible.com/blog/introducing-the-ansible-content-collection-for-red-hat-openshift)
- [Ansible e-books](https://www.ansible.com/resources/ebooks) with topic-specific insights

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Using Ansible and GitOps to Manage the Lifecycle of a Containerized Application](/blog/taking-automation-to-the-next-level-using-ansible-gitops-to-manage-the-lifecycle-of-a-containerized-app/)
> - [Ansible Automation Platform … You’re using it wrong.](/blog/ansible-automation-platform-youre-using-it-wrong/)
> - [New reference architecture: Deploying Ansible Automation Platform 2 on Red Hat OpenShift](/blog/new-reference-architecture-deploying-ansible-automation-platform-2-on-red-hat-openshift/)

<!-- blog-enrichment:related-end -->
