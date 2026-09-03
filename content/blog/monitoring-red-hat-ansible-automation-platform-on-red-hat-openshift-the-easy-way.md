---
title: Monitoring Red Hat Ansible Automation Platform on Red Hat OpenShift - The Easy
  Way
slug: monitoring-red-hat-ansible-automation-platform-on-red-hat-openshift-the-easy-way
authors:
- slug: roger-lopez
  name: Roger Lopez
published: '2022-08-29'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/monitoring-red-hat-ansible-automation-platform-on-red-hat-openshift-the-easy-way
description: This blog post demonstrates how to monitor the API metrics provided by
  an Ansible Automation Platform environment when deployed within Red Hat OpenShift.
topics: []
read_time_minutes: 8
synced_at: '2026-09-03T19:21:57Z'
---

<!-- blog-enrichment:start -->

> [!callout type=summary]
> **Summary:** This blog post demonstrates how to monitor the API metrics provided by an Ansible Automation Platform environment when deployed within Red Hat OpenShift.

> [!toc]
> **On this page**
>
> - [What will we use to monitor the API metrics?](#what-will-we-use-to-monitor-the-api-metrics)
> - [What can we expect?](#what-can-we-expect)
> - [What metrics can I expect to see in the pre-built dashboard?](#what-metrics-can-i-expect-to-see-in-the-pre-built-dashboard)
> - [Automating with an Ansible Playbook](#automating-with-an-ansible-playbook)
> - [Prerequisites](#prerequisites)
> - [Prerequisites](#prerequisites-2)
> - [Installing & configuring Grafana](#installing-configuring-grafana)
> - [What can I do next?](#what-can-i-do-next)

<!-- blog-enrichment:end -->

[![monitoring ansible on ocp blog](https://www.redhat.com/rhdc/managed-files/ansible/monitoring%20ansible%20on%20ocp%20blog.png)](https://www.redhat.com/rhdc/managed-files/ansible/monitoring%20ansible%20on%20ocp%20blog.png)

As Red Hat Ansible Automation Platform enables teams and organizations to drive their automation from across the cloud and on-premise, keeping Ansible Automation Platform healthy with the ability to monitor key metrics becomes paramount.

This blog post demonstrates how to monitor the API metrics provided by an Ansible Automation Platform environment when deployed within Red Hat OpenShift.

## What will we use to monitor the API metrics?

### Prometheus and Grafana.

Prometheus is an open source monitoring solution for collecting and aggregating metrics. Partner Prometheus’ monitoring capabilities with Grafana, an open source solution for running data analytics and pulling up metrics in customizable dashboards, and you get a real-time visualization of metrics to track the status and health of your Ansible Automation Platform.

## What can we expect?

Expect to be fast-tracked to a deployment of Ansible Automation Platform that is monitored by Prometheus paired with a Grafana Ansible Automation Platform dashboard showing those metrics in real time.

This blog will guide you through:

- The deployment of Prometheus using an operator.
- Configuring your Prometheus deployment to capture Ansible Automation Platform metrics.
- The deployment of Grafana using an operator.
- Configuring Grafana with a pre-built dashboard that displays the Ansible Automation Platform metrics.

## What metrics can I expect to see in the pre-built dashboard?

The Grafana pre-built dashboard displays:

- Ansible Automation Platform version
- Number of controller nodes
- Number of hosts available in the license
- Number of hosts used
- Total users
- Jobs successful
- Jobs failed
- Quantity by type of job execution
- Graphics showing the number of jobs running and pending jobs
- Graph showing the growth of the tool showing the amount of workflow, hosts, inventories, jobs, projects, organizations, etc.

Of course, this Grafana dashboard can be customized to capture other metrics you may be interested in.

Let’s dive in.

## Automating with an Ansible Playbook

Why type all of these CLI commands when you can automate it with an Ansible playbook? That is the beauty of Ansible. Everything that has been written in this blog has already been automated for you. Using the following [Git repository](https://github.com/rlopez133/demos) and setting the values of a few optional variables will enable Prometheus to monitor Ansible Automation Platform with a customized Grafana dashboard in a matter of minutes.

## Prerequisites

The steps performed in this blog require access to an OpenShift cluster that has deployed the Red Hat Ansible Automation Platform Operator and you can access your automation controller dashboard.

### Create a custom credential type

Within your Ansible Automation Platform dashboard,

1. Under **Administration****→** **Credential Types** click the blue **Add** button.
2. Provide a **Name**, e.g. Kubeconfig.
3. Within the input configuration, input the following YAML:

```
fields:
  - id: kube_config
    type: string
    label: kubeconfig
    secret: true
    multiline: true
```

                       4. Within the injector configuration, input the following YAML:

```
env:
  K8S_AUTH_KUBECONFIG: '{{ tower.filename.kubeconfig }}'
file:
  template.kubeconfig: '{{ kube_config }}'
```

                      5. Click **Save**.

### 

### Create a kubeconfig credential

Within your Ansible Automation Platform dashboard,

1. Under **Resources****→** **Credentials** click the blue **Add** button.
2. Provide a **Name**, e.g. OpenShift-Kubeconfig.
3. Within the **Credential Type** dropdown, select **Kubeconfig.**
4. Within the Type **Details** text box, insert your kubeconfig file for your OpenShift cluster.
5. Click **Save**.

#### 

### Create a project

Within your Ansible Automation Platform dashboard,

1. Under **Resources**→ **Projects** click the blue **Add** button.
2. Provide a **Name**, e.g. Monitoring AAP Project.
3. Select **Default** as the Organization.
4. Select **Default execution environment** as the **Execution Environment.**
5. Select **Git** as the **Source Control Credential Type.**
6. Within **Type Details**,

1. Add the **Source Control URL** (<https://github.com/rlopez133/demos>).

7. Within **Options,**

1. Select **Clean**, **Delete**, **Update Revision on Launch.**

8. Click **Save**.

### Create a job template & run the Ansible Playbook

Within your Ansible Automation Platform dashboard,

1. Under **Resources**→ **Templates** click the blue **Add** → **Add job template**.
2. Provide a **Name**, e.g. Monitor AAP Job.
3. Select **Run** as the **Job Type.**
4. Select **Demo Inventory** as the **Inventory.**
5. Select **Monitoring AAP Project** as the **Project.**
6. Select **Default execution environment** as the **Execution Environment.**
7. Select *aap-prometheus-grafana*/*playbook.yml* as the **Playbook.**
8. Select **Credentials** and switch the category from **Machine** to **Kubeconfig.**
9. Select the appropriate *kubeconfig* for access to the Kubernetes cluster e.g. OpenShift-Kubeconfig.
10. **Optional Step:** Within the **Variables,** the following variables may be modified:

1. prometheus\_namespace: <your-specified-value>
2. ansible\_namespace: <your-specified-value>

11. Click **Save**.
12. Click **Launch** to run the Ansible Playbook.

For completeness and understanding of the entire process, the manual steps are captured in the following sections.

> [!callout type=tmm label="TMM resource" title="Ansible Product Demos" url="https://ansible.github.io/product-demos/" cta="Browse demos"]
> Reusable demos that showcase Ansible Automation Platform capabilities.

## Prerequisites

The steps performed in this blog require access to an OpenShift cluster that has deployed the Ansible Automation Platform Operator and you can access your automation controller dashboard.

### Create Bearer Token to capture metrics

In order to capture the /api/v2/metrics from an Ansible Automation Platform install, you need credentials to access them. An OAuth2 token allows us to authenticate Prometheus with Ansible Automation Platform.

1. Login to your Ansible Automation Platform dashboard.
2. Under **Access**, select **Users** and click on the appropriate user, e.g. admin.
3. Within the **Details** window, select **Tokens.**

[![](https://www.redhat.com/rhdc/managed-files/ansible/rtPU6k1sYjDV4vo4AJd0CWQvsOA3FeUFHMCJCIcN7x5q_byyCT8xQWxWghwkDs1iZoaiEiJJGn8T5k1oRTMH464jsQ7FUOu9AoSJWo8_ywIXweZo-jgS3KNx_LGwkHD6wn4EToSl_tr7JDdxcYFevys.png)](https://www.redhat.com/rhdc/managed-files/ansible/rtPU6k1sYjDV4vo4AJd0CWQvsOA3FeUFHMCJCIcN7x5q_byyCT8xQWxWghwkDs1iZoaiEiJJGn8T5k1oRTMH464jsQ7FUOu9AoSJWo8_ywIXweZo-jgS3KNx_LGwkHD6wn4EToSl_tr7JDdxcYFevys.png)

1. Click the blue **Add** button.
2. Leaving everything else empty, under **Scope**, select **Read** from the dropdown and click **Save**.
3. Write down the token; you will need it in a future step and it will no longer be displayable after you see the **Token information** pop-up.

[![](https://www.redhat.com/rhdc/managed-files/ansible/kJGCt78mw3TzHFK2MRtIHn6xfhR_wwY_JF-ImIKx54otpDZkd7mnt7kTVzEBjUjn1835o74cDM95ilucLDLecm7wbNZXVPZ_KRDMKxpLtkeUhHJIhjdwfDRfcL7h2yfyPVyHz2oohYsjVa9iTxZXzTc.png)](https://www.redhat.com/rhdc/managed-files/ansible/kJGCt78mw3TzHFK2MRtIHn6xfhR_wwY_JF-ImIKx54otpDZkd7mnt7kTVzEBjUjn1835o74cDM95ilucLDLecm7wbNZXVPZ_KRDMKxpLtkeUhHJIhjdwfDRfcL7h2yfyPVyHz2oohYsjVa9iTxZXzTc.png)

### Installing & configuring Prometheus

1. Via a terminal, login to your OpenShift environment.

```
oc login
```

2. Create a new namespace for our Prometheus Operator deployment.

```
oc new-project prometheus-operator
```

3. Via the OpenShift Container Platform web console, Click on Operators →  OperatorHub. Search for *prometheus* and install the operator within the newly    created namespace, *prometheus-operator*. 

[![](https://www.redhat.com/rhdc/managed-files/ansible/tIt6taPSQgnYXcsZhAlMzZQU0H7_vKqDKISUM7cXvZQQrCXDCOYDb3w329EP3iHO85zxI-5R-1fAfnFLXf8PA6OZCqDzVlcL07i5sFhPhP9zJ5lpPZBBfY-nw-MQkoHa4oEGZEFWHHcNxytaLBjCOL0.png)](https://www.redhat.com/rhdc/managed-files/ansible/tIt6taPSQgnYXcsZhAlMzZQU0H7_vKqDKISUM7cXvZQQrCXDCOYDb3w329EP3iHO85zxI-5R-1fAfnFLXf8PA6OZCqDzVlcL07i5sFhPhP9zJ5lpPZBBfY-nw-MQkoHa4oEGZEFWHHcNxytaLBjCOL0.png)

4. Create a generic secret labeled **bearertoken** with the bearer token that will reside within the prometheus-operator namespace.

```
oc create secret generic bearertoken --from-literal=secret=2lnh5HIWeLx5aBbxngaCz3rr3c0Aob -n prometheus-operator
```

**NOTE:** Replace the literal-secret value with your Ansible Automation Platform bearer token.

5. Create a label for the automation controller service that will be used for monitoring the API metrics. The name of the service will vary based upon what you named your automation controller during installation. For this blog post, the service is called **my-automation-controller-service.**

```
oc label svc my-automation-controller-service -n ansible-automation-platform monitor=metrics
```

**NOTE:** You can find your service name via:

```
oc get svc -n ansible-automation-platform
```

**NOTE:** Feel free to change the label to something more specific based on your needs than **monitor=metrics.**

6. Create a [service-monitor.yaml](https://raw.githubusercontent.com/rlopez133/demos/main/aap-prometheus-grafana/service-monitor.yaml) file that defines a ServiceMonitor. The ServiceMonitor defines a service endpoint that needs to be monitored by the Prometheus instance.

```
<Snippet of service-monitor.yaml>
  selector:
    matchLabels:
      monitor: metrics
  endpoints:
    - interval: 5s
      path: /api/v2/metrics
      scheme: http
      bearerTokenSecret:
        name: bearertoken
        key: secret
```

**NOTE:** Notice how the endpoint contains the appropriate path, scheme and the bearer token to allow Prometheus access to capture the metrics from Ansible Automation Platform. Also, the selector uses the match label **monitor: metrics** which is the label we previously created that we wanted to track against.

7. Apply the service-monitor.yaml file:

```
oc apply -f service-monitor.yaml
```

8. Create a [service-account.yaml](https://raw.githubusercontent.com/rlopez133/demos/main/aap-prometheus-grafana/service-account.yaml) file, which creates a service account with cluster role and cluster role bindings to ensure you have permissions to list nodes and pods in other namespaces at the cluster scope.

9. Apply the service-account.yaml file:

```
oc apply -f service-account.yaml
```

10. Install Prometheus using the [prometheus.yaml](https://raw.githubusercontent.com/rlopez133/demos/main/aap-prometheus-grafana/prometheus.yaml) file, where ***metadata.namespace*** is the prometheus-operator and ***spec.serviceAccountName*** is the service account’s name you applied (Prometheus).

11. Apply the prometheus.yaml file:

```
oc apply -f prometheus.yaml
```

12. Verify the Prometheus service started successfully.

```
oc get svc -n prometheus-operator
NAME                  TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)          AGE
prometheus            NodePort    10.217.4.5   <none>        9090:31093/TCP   2m7s
prometheus-operated   ClusterIP   None         <none>        9090/TCP         34s
```

13. Check all the Pods are running.

```
oc get pods -n  prometheus-operator
NAME                                  READY   STATUS    RESTARTS   AGE
prometheus-operator-6dd6645fc-q9cbj   1/1     Running   0          24m
prometheus-prometheus-0               2/2     Running   0          63s
prometheus-prometheus-1               2/2     Running   0          62s
```

14. Expose the prometheus-operated service to use Prometheus console externally on your web browser.

```
oc expose svc/prometheus-operated -n prometheus-operator
```

15. Get the route to access via browser.

```
oc get routes -n prometheus-operator
```

16. Visit the URL from the provided route command and check the **Target** page of Prometheus (Status →Target). The /api/v2/metrics target should be UP.

[![](https://www.redhat.com/rhdc/managed-files/ansible/V3IVj6xa1-wEl5VjTSxLaIALGa2l-lawF3lz316E6wBmV-JzfQGXvSsjfbbk8D8Y_glz1rarlvYKS3hyOGYSJ_4lXID2wSKsPX0kMKmCppjN3-Nk26ZvhG5IkUrfHbMGSxkMJq9PnWYiM2tB-1Ha184.png)](https://www.redhat.com/rhdc/managed-files/ansible/V3IVj6xa1-wEl5VjTSxLaIALGa2l-lawF3lz316E6wBmV-JzfQGXvSsjfbbk8D8Y_glz1rarlvYKS3hyOGYSJ_4lXID2wSKsPX0kMKmCppjN3-Nk26ZvhG5IkUrfHbMGSxkMJq9PnWYiM2tB-1Ha184.png)

## Installing & configuring Grafana

1. Via the OpenShift Container Platform web console, Click on Operators → OperatorHub. Search for *grafana* and install the operator within the newly created namespace, *prometheus-operator*.

[![](https://www.redhat.com/rhdc/managed-files/ansible/O-A4lNdVawc98KJ3A8L7dQAAFlYf4Zj4LZLI5yH4avhl6iv1z9VWXSCiUmkFu3RSIlkkSv0snC4r0jxEsOo9FMNVCac0DeEFfbDVD6ppo9cZHYnoqkPn01CDxyFjmx1dvksDNOTXRujmjatqcxd0n_A.png)](https://www.redhat.com/rhdc/managed-files/ansible/O-A4lNdVawc98KJ3A8L7dQAAFlYf4Zj4LZLI5yH4avhl6iv1z9VWXSCiUmkFu3RSIlkkSv0snC4r0jxEsOo9FMNVCac0DeEFfbDVD6ppo9cZHYnoqkPn01CDxyFjmx1dvksDNOTXRujmjatqcxd0n_A.png)

2. With the installation of the Grafana operator complete, provide the Prometheus service and port as shown in the [*grafana-datasources.yaml*](https://raw.githubusercontent.com/rlopez133/demos/main/aap-prometheus-grafana/grafana-datasources.yaml) file.  

3. Apply the *grafana-datasources.yaml* file:

```
oc apply -f grafana-datasources.yaml -n prometheus-operator
```

4. With the datasource in place, install the Grafana instance using the [grafana.yaml](https://raw.githubusercontent.com/rlopez133/demos/main/aap-prometheus-grafana/grafana.yaml).

5. Apply the *grafana.yaml* file:

```
oc apply -f grafana-instance.yaml -n prometheus-operator
```

6. Use the pre-built Grafana dashboard, [grafana-dashboard.yaml](https://raw.githubusercontent.com/rlopez133/demos/main/aap-prometheus-grafana/grafana-dashboard.yaml), that displays the different automation controller metrics.  

**NOTE:** This Grafana dashboard may be customized to better fit your needs on the metrics you wish to capture.

7. Apply the *grafana-dashboard.yaml* file:

```
oc apply -f grafana-dashboard.yaml -n prometheus-operator
```

8. Get the Grafana route to access the dashboard.

```
oc get route grafana-route -n prometheus-operator
```

9. Get the password to login to the Grafana dashboard as the admin user.

```
oc get secret grafana-admin-credentials -o custom-columns=PASSWORD:.data.GF_SECURITY_ADMIN_PASSWORD --no-headers | base64 -D
```

10. Once logged into Grafana, access the dashboards and select the pre-populated Ansible Automation Platform dashboard, which will provide a display as shown below.

[![](https://www.redhat.com/rhdc/managed-files/ansible/fd-QcNPXxbAx-olwWSjz51kfJ6wcX0Oefm6sGgkRXNEWA86YlEJ__zMBXX9oZAy6vmXRko3QQuOdO6TAPXiQyFe7qPvx1Y6j93j9Nk85nS_N_dqqdpweGejL1XXsHe0iXk_cRL_JIlUhu9Mpq6M3R7M.png)](https://www.redhat.com/rhdc/managed-files/ansible/fd-QcNPXxbAx-olwWSjz51kfJ6wcX0Oefm6sGgkRXNEWA86YlEJ__zMBXX9oZAy6vmXRko3QQuOdO6TAPXiQyFe7qPvx1Y6j93j9Nk85nS_N_dqqdpweGejL1XXsHe0iXk_cRL_JIlUhu9Mpq6M3R7M.png)

And there you have it! With just a few YAML files, you can have a fully monitored Ansible Automation Platform in minutes so you can keep track of the key metrics for a healthy Ansible Automation Platform cluster.

## What can I do next?

If you want to try these steps for yourself, go check out our [Self-paced exercises](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218). In there, you will find a self-paced exercise that assists in Deploying Ansible Automation Platform on OpenShift. Take it a step further and use the playground time to add Prometheus and Grafana, just as I have here!

And remember, no matter where you are in your automation journey, we have a variety of resources available to enhance your automation knowledge:

- [AnsibleFest 2022](https://www.ansible.com/ansiblefest) - Come hang out and learn about all the new automation tools and features being added to Ansible Automation Platform! This year it will be held in the windy city of Chicago on October 18-19, 2022.
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel.](https://www.youtube.com/ansibleautomation) Be sure to check out our web series, [Automated Live hosted by Colin McNaughton.](https://www.redhat.com/en/technologies/management/ansible/automated-live-videos)
- [Follow Red Hat Ansible](https://twitter.com/ansible) [Automation Platform](https://www.youtube.com/ansibleautomation) [on Twitter](https://twitter.com/ansible) - Do you have questions or an automation project you want to show off? Tweet at us!

<!-- blog-enrichment:related -->

> [!related]
> **More from the team**
>
> - [Using Ansible and GitOps to Manage the Lifecycle of a Containerized Application](/blog/taking-automation-to-the-next-level-using-ansible-gitops-to-manage-the-lifecycle-of-a-containerized-app/)
> - [Ansible Automation Platform … You’re using it wrong.](/blog/ansible-automation-platform-youre-using-it-wrong/)
> - [New reference architecture: Deploying Ansible Automation Platform 2 on Red Hat OpenShift](/blog/new-reference-architecture-deploying-ansible-automation-platform-2-on-red-hat-openshift/)

<!-- blog-enrichment:related-end -->
