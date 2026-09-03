---
title: Creating Kubernetes Dynamic Inventories with kubernetes.core Modules
slug: creating-kubernetes-dynamic-inventories-with-kubernetes.core-modules
authors:
- slug: roger-lopez
  name: Roger Lopez
published: '2022-08-10'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/creating-kubernetes-dynamic-inventories-with-kubernetes.core-modules
description: A quick start guide on how you can create an Ansible Playbook to retrieve
  your pods within a namespace and generate a Kubernetes dynamic inventory.
topics: []
read_time_minutes: 2
synced_at: '2026-09-03T19:21:58Z'
---

[![roger kube.core blog aug 5 22](https://www.redhat.com/rhdc/managed-files/ansible/roger%20kube.core%20blog%20aug%205%2022.png)](https://www.redhat.com/rhdc/managed-files/ansible/roger%20kube.core%20blog%20aug%205%2022.png)

When managing infrastructure, there are times when a dynamic inventory is essential. Kubernetes is a perfect example of this where you may create multiple applications within a namespace but you will not be able to create a static inventory due to Kubernetes appending a systems-generated string to uniquely identify objects.

Recently, I decided to play with using a Kubernetes dynamic inventory to manage pods, but finding the details on how to use and apply it was a bit scarce. As such, I wanted to write a quick start guide on how you can create an Ansible Playbook to retrieve your pods within a namespace and generate a Kubernetes dynamic inventory.

This is much easier to do when you take advantage of the `kubernetes.core.k8s_info` module.

In my example, I’m going to take advantage of using my existing `ansible-automation-platform` namespace that has a list of pods to create my dynamic inventory. In your scenario, you’d apply this to any namespace you wish to capture a pod inventory from.

When creating your inventory, the first step is to register the pods found within a particular namespace. Here’s an example of a task creating an inventory within the `ansible-automation-platform` namespace:

[![Screen Shot 2022-08-05 at 3.23.23 PM](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-08-05%20at%203.23.23%20PM.png)](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-08-05%20at%203.23.23%20PM.png)

While this task would capture every pod within that namespace, you could further target specific pods using the `label_selectors` as such:

[![Screen Shot 2022-08-05 at 3.24.24 PM](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-08-05%20at%203.24.24%20PM.png)](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-08-05%20at%203.24.24%20PM.png)

This would target only the automation controller pods from within my `ansible-automation-platform` namespace.

Once the pods are registered, take your list and use the `add_host` module to dynamically add those pods to your inventory. One key piece from this `add_host` module is that I’ve included the `ansible_kubectl_namespace` var within the task. When adding pods to your host list, you need to provide their namespace, because without adding this variable it assumes the namespace is the default namespace.  
  
**NOTE**: If you want to use [kubernetes connection plugin parameters](https://docs.ansible.com/ansible/latest/collections/kubernetes/core/kubectl_connection.html), you need to prefix `ansible_` to them. In this example, I used the `kubectl_namespace` and prefixed ansible to get `ansible_kubectl_namespace`.

[![Screen Shot 2022-08-05 at 3.26.09 PM](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-08-05%20at%203.26.09%20PM.png)](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-08-05%20at%203.26.09%20PM.png)

And there you have it! Now your pods have been added to your inventory dynamically in a group labeled “pods”.

Now with your dynamically built inventory, you can run tasks against this pod inventory. Since this inventory is built at run-time, you’d want to have a playbook with multi plays similar to this example:

[![Screen Shot 2022-08-05 at 3.27.37 PM](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-08-05%20at%203.27.37%20PM.png)](https://www.redhat.com/rhdc/managed-files/ansible/Screen%20Shot%202022-08-05%20at%203.27.37%20PM.png)

**NOTE**: In the second play labeled "New Play using the pod inventory" there is a `connection: kubernetes.core.kubectl`. This allows for the run of command on the pods and for that you need this connection plugin.

And there it is! One method of creating an inventory of your pods that you can then run tasks against.

## What can I do next?

Whether you are beginning your automation journey or are a seasoned veteran, there are a variety of resources to enhance your automation knowledge:

- [AnsibleFest 2022](https://www.ansible.com/ansiblefest) - Come hang out with myself, and more importantly the automation mesh guru Craig Brandt, my friend and colleague who knows everything there is to know about automation mesh in Chicago October 18-19, 2022.
- [Self-paced exercises](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) - Check out our interactive, in-browser exercises to learn and dive into Ansible Automation Platform
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel.](https://www.youtube.com/ansibleautomation) Be sure to check out our web series, [Automated Live hosted by Colin McNaughton.](https://www.redhat.com/en/technologies/management/ansible/automated-live-videos)
- [Follow Red Hat Ansible](https://twitter.com/ansible) [Automation Platform](https://www.youtube.com/ansibleautomation) [on Twitter](https://twitter.com/ansible) and myself [@Lopez](https://twitter.com/Lopez) - Do you have questions or an automation project you want to show off? Tweet at us!
