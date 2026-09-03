---
title: Event-driven remediation with systemd and Red Hat Ansible Automation Platform
slug: event-driven-remediation-with-systemd-and-red-hat-ansible-automation-platform
authors:
- slug: nuno-martins
  name: Nuno Martins
published: '2022-04-25'
updated: '2025-11-24'
source: redhat
source_url: https://www.redhat.com/en/blog/event-driven-remediation-with-systemd-and-red-hat-ansible-automation-platform
description: Red Hat Ansible Automation Platform can assist you here with not only
  keeping your infrastructure in check, but also giving your teams the peace of mind
  that systems are running as they should.
topics: []
read_time_minutes: 7
synced_at: '2026-09-03T19:21:45Z'
---

[![](https://www.redhat.com/rhdc/managed-files/ansible/6irqaHobfUU02G7Z8V0DiCYPGub92sK6UeKSl-Wep_teiIjeAwJ4Ip8ekLzzoGUNrusx0eU1nFtXfs2v6HiC5_KCL1O4_knpTAzdwzK3xiyRGLGFpwISmvUaNZKJ1OQaNKEz_WXv.png)](https://www.redhat.com/rhdc/managed-files/ansible/6irqaHobfUU02G7Z8V0DiCYPGub92sK6UeKSl-Wep_teiIjeAwJ4Ip8ekLzzoGUNrusx0eU1nFtXfs2v6HiC5_KCL1O4_knpTAzdwzK3xiyRGLGFpwISmvUaNZKJ1OQaNKEz_WXv.png)

Over the many years of working as an engineer and architect with a particular interest in storage, I have learned that donuts and energy drinks can really bring you some joy in trying situations. When it seems that your infrastructure is on fire and you need an exorcist to help you find the ghost in the machine, a humble box of glazed donuts can give you and your team a much-needed break and allow you to refocus.

Now, the issue with this habit is that it might help you in the moment, but over time this can become a real health issue. Configuration drift, technical issues, and technical debt can all have similar effects on your health, increasing your heart rate and causing sleepless nights. Red Hat Ansible Automation Platform can assist you here with not only keeping your infrastructure in check, but also giving your teams the peace of mind that systems are running as they should.

Being able to schedule compliance checks on your systems with Ansible Automation Platform enables you to preserve configuration and system states, and keep them running the way you prefer. But sometimes this is not proactive enough. What if you have a security breach? Or if your application data is removed in error? In some instances, you cannot afford to wait for the regular maintenance schedule to trigger remediation. Enabling your systems to self-remediate or trigger self-compliance is an awesome way of keeping you cozy in your bed dreaming about the next Ansible Automation Platform release with all its magic and wizardry.

## Event-driven automation with systemd

Systemd is the service and system manager for Red Hat Enterprise Linux, and it uses unit files to read the configuration of daemons. With the use of systemd path units, you are able to monitor files and directories for events. Leveraging path units enables us to trigger a service to execute an action.

Automation controller uses callback provisioning on templates. This allows hosts to trigger an API request back to the automation controller, and the controller runs the specified template on that host. Using systemd and the callback provisioning features, we can build an event-driven trigger for automation.

## Starting with a simple use case

Say I would like to prevent changes to my user accounts on my Linux systems. We are going to watch the /etc/passwd and /etc/shadow files respectively. To do this, we need to create a system path unit and service to configure a remediation template with a callback.

For this example I have a very simple playbook that restores the /etc/passwd and /etc/shadow files. I have a set of these files that I have stored in a private repository on GitHub, which is my single source of truth. These are the standardized accounts I want to maintain on all my systems in my environment.

From the automation controller, I setup my template and I enable Callback Provisioning:

[![](https://www.redhat.com/rhdc/managed-files/ansible/mHNmloF0gLRhgJ7vEz0oFVMBHXD_JxE7-VRzO2f0Aq03HKiohIv3OVO2hKaG0to_b_yniY7YhbzNJ_4FqsFTu7fH3KQhWyFjOgjayPvPojwrP06kj_Vr2nXYI1xtDtmmhH5h_4Rl.png)](https://www.redhat.com/rhdc/managed-files/ansible/mHNmloF0gLRhgJ7vEz0oFVMBHXD_JxE7-VRzO2f0Aq03HKiohIv3OVO2hKaG0to_b_yniY7YhbzNJ_4FqsFTu7fH3KQhWyFjOgjayPvPojwrP06kj_Vr2nXYI1xtDtmmhH5h_4Rl.png)

The host config key allows the callback to be validated with Automation controller and triggers the template for the host. We will use the callback URL as an API call in conjunction with the host config key.

Now, we need to configure our systemd units. We will create a path unit and service unit and place both in /etc/systemd/system on our hosts. These systemd [path units](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/assembly_working-with-systemd-unit-files_configuring-basic-system-settings) are what we will use to monitor file changes.

```
accounts-mon.path

[Unit]
Description=Monitor the file for changes

[Path]
PathModified=/etc/passwd
Unit=accounts-mon.service

[Install]
WantedBy=multi-user.target
```

```
accounts-mon.service

[Unit]
Description="Call back to Ansible Controller for Rescue"

[Service]
ExecStart=/usr/bin/curl -v -k -s -i -X POST -H 'Content-Type:application/json' --data '{"host_config_key": "{{ host_config_key }}"}' {{ callback_url }}

[Install]
WantedBy=multi-user.target
```

Once you have created these you can enable them and start your path unit.

```
sudo systemctl enable accounts-mon.{path,service}
sudo systemctl start accounts-mon.path

sudo systemctl status accounts-mon.path

accounts-mon.path - Monitor the file for changes
   Loaded: loaded (/etc/systemd/system/accounts-mon.path; enabled; vendor preset: disabled)
   Active: active (waiting) since Fri 2022-03-25 13:41:35 UTC; 47min ago

systemd[1]: Started Monitor the file for changes.
```

If any changes are attempted now on the files that systemd is watching it will trigger the service unit which will issue the callback.

[![](https://www.redhat.com/rhdc/managed-files/ansible/mzxLqD9ONGqu8IY-6KkB4N_STPumq7aJHYztPhsGizxgTY8E_zPRm22fxtpQIQkgDwjwCtkQ6P4_0Na7kJK_az24q1JrY4cioev6M3saSZAU78GRTXeyS5UkAFesBYAs0hi2OCwR.png)](https://www.redhat.com/rhdc/managed-files/ansible/mzxLqD9ONGqu8IY-6KkB4N_STPumq7aJHYztPhsGizxgTY8E_zPRm22fxtpQIQkgDwjwCtkQ6P4_0Na7kJK_az24q1JrY4cioev6M3saSZAU78GRTXeyS5UkAFesBYAs0hi2OCwR.png)

## 

## Taking it to another level

So far this mechanism is fairly simple and works quickly to resolve most issues. Let’s consider a possible security or compliance situation where we would like to know how many times the automation controller has had to execute a specific job template in order to remediate a particular situation on one or more hosts in a day. Multiple remediation jobs being triggered in a short amount of time could indicate a bigger issue or perhaps a malicious attempt at damaging a host. As much as the self remediation is beneficial, if the host is compromised or has become the target of an attack we would want further action to be taken sooner rather than later.

We can use the API on the automation controller to retrieve a job summary for the host and sum up the number of remediation tasks that have taken place over the last day. Based on this we use conditionals to trigger additional tasks.

[![](https://www.redhat.com/rhdc/managed-files/ansible/mW88s2tCwtHRamPoNqD1tXNbvRY8wksXAdnq2sZ30nM0Ubb-hTynZfc--QuzrVh8CBwC-Lr-pSGtY3wqDETgiexqFp8CnWfpNgygOQCOtaEGTAEv3TvAnYPYLMEf0hFFx9TlzCJ1.png)](https://www.redhat.com/rhdc/managed-files/ansible/mW88s2tCwtHRamPoNqD1tXNbvRY8wksXAdnq2sZ30nM0Ubb-hTynZfc--QuzrVh8CBwC-Lr-pSGtY3wqDETgiexqFp8CnWfpNgygOQCOtaEGTAEv3TvAnYPYLMEf0hFFx9TlzCJ1.png)

Using the browsable API on the Automation controller we can filter out what we are looking for. In this example, I am looking at a specific host which is host 3 and the job template 20.

```
https://controller/api/v2/hosts/3/job_host_summaries/?job__job_template_id=20
```

Furthermore, I would like to find out how many times this job ran today. To do so,  I can add a regex search to this API call and include it in my Ansible Playbook. This way I can count the number of remediations that have run today, and use this information to drive further automation based on conditionals. In the following example, you can see that I am calling the API for the job summary on a host for that day, and then filtering that to see how many times the template has been processed. This will be the basis of my counter.

```
  - name: Ansible fact - ansible_date_time
     set_fact:
      todays_date: "{{ ansible_date_time.date }}"

   - name: Retrieve Job Summaries
     uri:
      url:
https://controller/api/v2/hosts/3/job_host_summaries/?job__job_template_id=20&created__regex={{ todays_date }}
       user: "{{ myuser }}"
       password: "{{ mypass }}"
       force_basic_auth: true
       method: "GET"
       status_code: "200"
       validate_certs: no
     register: "job_details"  
       
   - name: Counter value
      set_fact:
       counter: "{{ job_details | regex_findall('processed') | length }}"
```

Now that I can get an idea on how many times my system has had to be remediated I can start to expand possible outcomes based on the accumulated remediation count.

[![](https://www.redhat.com/rhdc/managed-files/ansible/6b6c8QG6UJjibTyt6U0rzgwPdVTyasuwHqFYTbtyy_CxcvLQLIpbs5H2hb_-5vjWi2IVVUFg62kCukQTqLa3Sug51NtSNXgZVB05MgZuyeT9vJn-Sxu32YbDVRamLLSLGEpSPLeJ.png)](https://www.redhat.com/rhdc/managed-files/ansible/6b6c8QG6UJjibTyt6U0rzgwPdVTyasuwHqFYTbtyy_CxcvLQLIpbs5H2hb_-5vjWi2IVVUFg62kCukQTqLa3Sug51NtSNXgZVB05MgZuyeT9vJn-Sxu32YbDVRamLLSLGEpSPLeJ.png)

Possible actions based on the number of remediation attempts could include the following:

|  |  |
| --- | --- |
| Remediation counter = 1 | Automation controller runs remediation task - restoring user accounts |
| Remediation counter = 3 | Automation controller remediates and triggers a compliance check |
| Remediation counter >= 4 | Automation controller remediates, triggers an AIDE intrusion check and logs a ticket for human intervention |

It is important to note that this example is fairly simple, however, you could have multiple files and folders being monitored by systemd, with each of them having their own remediation callbacks and ultimately you can accumulate the total number of remediation jobs that have taken place on a host. With Ansible the options are endless, we could automate network changes and responses to possible compromised systems, redeploy infrastructure or applications or just drive event-driven notifications.

```
   - name: count number of remediation attempts
     set_fact:
      counter: "{{ job_details | regex_findall('processed') | length }}"

   - name: run compliance checks on host and check AIDE
     include_role:
       name: ../roles/compliance_check
     when: counter|int == 3

   - name: run AIDE check and log support ticket for escalation
     include_role:
      name: ../roles/raise_ticket
     when: counter|int >= 4
```

With this example, once a host has had  three attempts at remediation from Automation controller, it will run a compliance check on the system to ensure SElinux, the firewall settings and any other service configurations have not changed from the organization’s configuration profile. If another remediation attempt is triggered then we will generate an AIDE  report to check for possible intrusion and system changes, which we attach to a support ticket that is logged on ServiceNow for human intervention.

[![](https://www.redhat.com/rhdc/managed-files/ansible/ho8zKEzq-pbPxGD78YcQBuRxGUkT18ZGT2REywI8Jgd2TU3giLVKF3HlOdAC1F9fzG13KSSoSy9VDPzdvo1Y4GMKqsUAVDYqr0plKWB8eDbWh8uzGXtbF_UIrnobhIVaqDIVLyHX.png)](https://www.redhat.com/rhdc/managed-files/ansible/ho8zKEzq-pbPxGD78YcQBuRxGUkT18ZGT2REywI8Jgd2TU3giLVKF3HlOdAC1F9fzG13KSSoSy9VDPzdvo1Y4GMKqsUAVDYqr0plKWB8eDbWh8uzGXtbF_UIrnobhIVaqDIVLyHX.png)

[![](https://www.redhat.com/rhdc/managed-files/ansible/Uc-vK5KnhflalTtYhShCS51XjCcwE6upR_HzEoCvEVVX_HDulytfz8KHEmpLp6UzvjZ2InTL-ataPg54acwHCuICxYcnufoV4Il9Vx67WygboGe3xoMrxJ5SdVygmMimtAe2CePQ.png)](https://www.redhat.com/rhdc/managed-files/ansible/Uc-vK5KnhflalTtYhShCS51XjCcwE6upR_HzEoCvEVVX_HDulytfz8KHEmpLp6UzvjZ2InTL-ataPg54acwHCuICxYcnufoV4Il9Vx67WygboGe3xoMrxJ5SdVygmMimtAe2CePQ.png)

In this blog post, I intended to show that with the use of an event trigger we are able to take  remediation actions in a proactive manner allowing systems to repair configuration mistakes or from possible early malicious attack attempts.

Ansible can take over the nightshift and offer your support teams a break until your teams are really needed!  They can now train for that decathlon with all this free time - No more energy drinks, no more high blood pressure and heart palpitations, and perhaps just one or two donuts.

The following demo video will be monitoring components with systemd and use the automation controller to configure and build these systemd units.

## 

## What can I do next?

Whether you are beginning your automation journey or a seasoned veteran, there are a variety of resources to enhance your automation knowledge:

- [Self-paced exercises](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) - We have interactive, in-browser exercises to learn and dive into Ansible Automation Platform.
- [Trial subscription](http://red.ht/try_ansible) - Are you ready to install on-premises? Get your own trial subscription for unlimited access to all the components of Ansible Automation Platform.
- [Subscribe to the Red Hat Ansible Automation Platform YouTube channel.](https://www.youtube.com/ansibleautomation) Be sure to check out our new web series, [Automated Live hosted by Colin McNaughton.](https://www.redhat.com/en/technologies/management/ansible/automated-live-videos)
- [Follow Red Hat Ansible](https://twitter.com/ansible) [Automation Platform](https://www.youtube.com/ansibleautomation) [on Twitter](https://twitter.com/ansible) - Do you have questions or an automation project you want to show off? Tweet at us!
