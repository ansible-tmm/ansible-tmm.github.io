---
title: Digitally signing Ansible Content Collections using private automation hub
slug: digitally-signing-ansible-content-collections-using-private-automation-hub
authors:
- slug: anshul-behl
  name: Anshul Behl
published: '2022-06-22'
updated: '2026-03-06'
source: redhat
source_url: https://www.redhat.com/en/blog/digitally-signing-ansible-content-collections-using-private-automation-hub
description: In this blog we will explain how to enable and consume this new digital
  content signing feature using Ansible Automation Platform 2.2.
topics: []
read_time_minutes: 6
synced_at: '2026-09-03T19:20:37Z'
---

[![Digitally signing content in Private Automation Hub](https://www.redhat.com/rhdc/managed-files/ansible/Digitally%20signing%20content%20in%20Private%20Automation%20Hub.png)](https://www.redhat.com/rhdc/managed-files/ansible/Digitally%20signing%20content%20in%20Private%20Automation%20Hub.png)

Red Hat Ansible Automation Platform can manage and execute automation made from many different origins, coming from Red Hat product teams, ISV partners, community and private contributors.

Here is a typical makeup of an automation play that is launched from automation controller:

1. A job template is executed by automation controller and is a playbook.
2. The playbook runs inside of an automation execution environment by the automation controller.
3. The automation execution environment is made using the execution environment builder (`ansible-builder` tool).
4. When `ansible-builder` creates the execution environment, it includes dependencies.
5. The dependencies are Ansible Content Collections and their requirements.
6. Collections and their dependencies can be private, community-based, or supplied by Red Hat or its ISV partners.

Previously, there was no way to verify that a Collection downloaded from either Ansible automation hub ([console.redhat.com](http://console.redhat.com/)) or private automation hub was developed and released by its original Collection maintainer. This is a potential security issue and breaks the supply chain from creator to consumer.

Providing security-focused features in Ansible Automation Platform 2 continues to be a priority, to enable the execution of certified and supported automation anywhere in your hybrid cloud environment. New in Ansible Automation Platform 2.2  is digital content signing in [technology preview](https://access.redhat.com/support/offerings/techpreview), which is the genesis of a more holistic chain-of-custody security feature going forward. It establishes a new framework for a chain of custody for Ansible Content Collections, with a goal for end-to-end digital content signing and distribution. This feature helps ensure that automation being executed in your enterprise is certified and compliant, even if it originates from varied content sources. While this is starting with digitally signing Collections, similar signing capabilities may be available for execution environments in future releases.

In the following sections, we will explain how to enable and consume this new digital content signing feature using Ansible Automation Platform 2.2.

## Ansible Automation Platform installer configuration

To successfully sign and publish Ansible Content Collections, private automation hub needs to be configured for signing. The inventory configuration for the installer with signing enabled requires extra key-value pairs in the `[all:vars]` section like below:

```
[all:vars]
.
.
.
automationhub_create_default_collection_signing_service = True
automationhub_auto_sign_collections = True
automationhub_require_content_approval = True
automationhub_collection_signing_service_key = /abs/path/to/galaxy_signing_service.gpg
automationhub_collection_signing_service_script =  /abs/path/to/collection_signing.sh
```

Notice the two keys called `automationhub_collection_signing_service_key` and `automationhub_collection_signing_service_script`

- `automationhub_collection_signing_service_key`- This represents the absolute path to the  private key file from the GPG keypair.
- `automationhub_collection_signing_service_script`- This represents the absolute path to the signing script that accepts a filename as the only argument. The script needs to generate an ascii-armored detached GPG signature for that file, using the key specified via the `PULP_SIGNING_KEY_FINGERPRINT` environment variable. The script should then print out a JSON structure with the following format.

```
{"file": "filename", "signature": "filename.asc"}
```

### How to generate the GnuPG keypair

Below is a sample set of bash commands to set up a key pair and export the associated public and private keys. You can use these directly or change the individual parameters based on your requirements.

```
cat >gpg.txt <<EOF
%echo Generating a basic OpenPGP key
Key-Type: default
Key-Length: 4096
Subkey-Type: default
Subkey-Length: default
Name-Real: Joe Tester
Name-Comment: with no passphrase
Name-Email: joe@foo.bar
Expire-Date: 0
%no-ask-passphrase
%no-protection
# Do a commit here, so that we can later print "done" :-)
%commit
%echo done
EOF
gpg --batch --gen-key gpg.txt
gpg --output ~/galaxy_signing_service.gpg --armor --export-secret-key
gpg --output ~/galaxy_signing_service.asc --armor --export
rm -rf ~/.gnupg
```

### Sample digital content signing script

Below is a signing script that adheres to the requirements, which you can use as the same script in your setup.

```
#!/usr/bin/env bash
FILE_PATH=$1
SIGNATURE_PATH="$1.asc"
          
ADMIN_ID="$PULP_SIGNING_KEY_FINGERPRINT"
PASSWORD="password"
          
# Create a detached signature
gpg --quiet --batch --yes --passphrase \
   $PASSWORD --homedir ~/.gnupg/ --detach-sign --default-key $ADMIN_ID \
   --armor --output $SIGNATURE_PATH $FILE_PATH
          
# Check the exit status
STATUS=$?
if [ $STATUS -eq 0 ]; then
   echo {\"file\": \"$FILE_PATH\", \"signature\": \"$SIGNATURE_PATH\"}
else
   exit $STATUS
fi
```

You can create the above signing script and key-value pair on the installer node for your Ansible Automation Platform and provide the absolute path of the script and private key to the installer as mentioned in the above section. The public key can be used to verify the downloaded collections to initiate a secure chain of custody from the private automation hub.

With the above changes complete,  you can now run the Ansible Automation Platform installer to install your Ansible Automation Platform cluster with private automation hub and digital content signing enabled.

### Private automation hub UI/UX changes

Once you deploy a private automation hub with signing enabled to your Ansible Automation Platform cluster, you will see some new UI additions when you interact with Collections. We used two new keys in the deployment configuration as explained in the above sections.

```
automationhub_auto_sign_collections = True
automationhub_require_content_approval = True
```

These two configuration parameters solidify that the Collections will get signed and will require approval once they get uploaded to a private automation hub. So, as you upload Collections through the private automation hub UI or via the `ansible-galaxy` CLI, you will see the Collections gettings queued for approval under the “Approval” tab and the button will now say “Sign and Approve”. Below are some screenshots from the UI.

[![](https://www.redhat.com/rhdc/managed-files/ansible/cDq7bDSaevapq2FGf-damnajVFZ9b0Cx7DTT-cdyuyO-f-cu3BA7E_W7NWeMCD1XZjuJrmPQ9JV4eHYSuI6mG0O1tbEvtPqwUfBN-iMjjZGDWgxNtkyX2DYUHU9Qgtgo5WyLCldF7Jpu8_1Spw.png)](https://www.redhat.com/rhdc/managed-files/ansible/cDq7bDSaevapq2FGf-damnajVFZ9b0Cx7DTT-cdyuyO-f-cu3BA7E_W7NWeMCD1XZjuJrmPQ9JV4eHYSuI6mG0O1tbEvtPqwUfBN-iMjjZGDWgxNtkyX2DYUHU9Qgtgo5WyLCldF7Jpu8_1Spw.png)

Once you click the button, you can see the Collection show up with a signed flag on the UI.

[![](https://www.redhat.com/rhdc/managed-files/ansible/krmwujrU3vSPrb48tpFJ1JkjvaTM_UehOXyYKb7TcuxcOHyA2yxWYgd_S7NGYj2NPn8ifDnOmLv5R8GAnMQfFusFVVUmcLdyqV5rpH_AW3e8NF5nirY8Mdan1c5M1B1d_RWMl-nzhLAffTw6-Q.png)](https://www.redhat.com/rhdc/managed-files/ansible/krmwujrU3vSPrb48tpFJ1JkjvaTM_UehOXyYKb7TcuxcOHyA2yxWYgd_S7NGYj2NPn8ifDnOmLv5R8GAnMQfFusFVVUmcLdyqV5rpH_AW3e8NF5nirY8Mdan1c5M1B1d_RWMl-nzhLAffTw6-Q.png)

You can also pull the Red Hat Ansible Certified Content Collections from the Ansible automation hub at [console.redhat.com](http://console.redhat.com/ansible/automation-hub) using the “Repository Management” under the “Collections” tab available on the private automation hub. After a sync, the Collections will show up as unsigned, but you will also get options for Collections and namespaces to sign them from the UI.

[![](https://www.redhat.com/rhdc/managed-files/ansible/hzSM1kKkocV75pMFZ_3PG7gyUsrh60VsYa1NPk-s_sbUSYb0CJIYj0BfqDX9MUpbi9Q2hWyhjjuZvWH68gDHy6bSgKwyAiAblMktBm8Q69kSlH2Y8byxrweQJBSIdVJNQ1T25k4xTS21Q38jtQ.png)](https://www.redhat.com/rhdc/managed-files/ansible/hzSM1kKkocV75pMFZ_3PG7gyUsrh60VsYa1NPk-s_sbUSYb0CJIYj0BfqDX9MUpbi9Q2hWyhjjuZvWH68gDHy6bSgKwyAiAblMktBm8Q69kSlH2Y8byxrweQJBSIdVJNQ1T25k4xTS21Q38jtQ.png)
[![](https://www.redhat.com/rhdc/managed-files/ansible/3JcNShnRnK1bG803UxSEIgmJ7qDc-ynYxwF3KkLqxk4Tm13Hk4dwpNSEDcFynIlTbKmwaimNL6J4gf0fTZEDG9MyUjfhNBSwRh7AxS0q4uSkXbq4C69rrjeRpn7RgCuv-5gmQ0tkTVtUXZ96Pw.png)](https://www.redhat.com/rhdc/managed-files/ansible/3JcNShnRnK1bG803UxSEIgmJ7qDc-ynYxwF3KkLqxk4Tm13Hk4dwpNSEDcFynIlTbKmwaimNL6J4gf0fTZEDG9MyUjfhNBSwRh7AxS0q4uSkXbq4C69rrjeRpn7RgCuv-5gmQ0tkTVtUXZ96Pw.png)
[![](https://www.redhat.com/rhdc/managed-files/ansible/L_N97kCBIK_mVB3-VETnFTl_2wEhAU5eL_5I_BrWEGO7jKL02bDTCeLj9_MVnrTcwXPGRrAm6BTmQ3jMmDNzaOgrKzcgN3ZABao6Lc2u9NaJge0cGvP6NsoPi3zQcwuzxD6_UnDYWuUO46UaQQ.png)](https://www.redhat.com/rhdc/managed-files/ansible/L_N97kCBIK_mVB3-VETnFTl_2wEhAU5eL_5I_BrWEGO7jKL02bDTCeLj9_MVnrTcwXPGRrAm6BTmQ3jMmDNzaOgrKzcgN3ZABao6Lc2u9NaJge0cGvP6NsoPi3zQcwuzxD6_UnDYWuUO46UaQQ.png)

Note: Sign community Collections from [galaxy.ansible.com](http://galaxy.ansible.com/) using a similar method.

## Installing signed Collections from private automation hub

Using the `ansible-galaxy` CLI (available with `ansible-core` v2.13), installed with Ansible Automation Platform 2.2, can now download and verify signed Collections from the private automation hub. You can check the [upstream documentation](https://docs.ansible.com/ansible/devel/user_guide/collections_using.html#signature-verification) for more information on how to use signatures with `ansible-galaxy` CLI.

Using our example above, we will explain how you can use the public key to verify signed Collections from private automation hub.

To add the public key to a local non-default keyring:

```
gpg --import --no-default-keyring --keyring ~/keyring.kbx galaxy_signing_service.asc
```

Use the keyring created in the last step with `ansible-galaxy` CLI to install and verify the signed Collections.

```
ansible-galaxy collection install community.lab_collection --keyring ~/keyring.kbx -c -vvvv
```

You will see the signature verification happening to validate the source of this Collection. Verification can also be done on the installed Collections to check if they have been tampered with. All these features enable a secure content supply chain for Collections from private automation hub to a user’s system. We have also created a [self-paced lab](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218) that explains the digital content signing and verification workflow in more detail.

## Create automation execution environments with signed Collections

With `ansible-builder` version 1.1.0 that comes with Ansible Automation Platform 2.2, it is possible to supply the keyring as explained in the previous section. If this option is not provided, no signature verification will be performed. If it is provided, and the version of Ansible in the base execution environment is not recent enough (`ansible-core` < 2.13), an error will occur in the image build process.

```
ansible-builder create --galaxy-keyring=/path/to/pubring.kbx
ansible-builder build --galaxy-keyring=/path/to/pubring.kbx
```

## Conclusion

- Digital content signing is a technology preview feature in private automation hub in Ansible Automation Platform 2.2
- The `ansible-galaxy` CLI performs Collection signature verification from private automation hub, which helps build a chain-of-custody for automation consumers in your organization.
- The `ansible-builder` tool bundled with Ansible Automation Platform 2.2 can also verify signatures based on the version of Ansible present in the base automation execution environment.
- Execution environment signing and signature verification in the automation controller is anticipated for future platform releases.

## Next Steps

### Collection signing self-paced lab

Try the self-paced lab designed by us on digitally [signing content collections with a private automation hub](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218), which explains the concepts touched upon in this blog in detail by using working examples.

### More Ansible Automation Platform 2.2 resources

Read the [blog on Ansible Automation Platform 2.2](https://www.ansible.com/blog/whats-new-in-ansible-automation-platform-2.2). You can get a rundown of what’s new in this checklist, [What’s new: Ansible Automation Platform 2.2](https://www.redhat.com/en/resources/whats-new-ansible-automation-platform-2-2-checklist). For additional context, including a recap of Ansible Automation Platform 2 releases to date and a look ahead at 2.3, check out the free, on-demand webinar, Ansible Automation Platform 2.2: next generation platform enhancements.

### Take a video tour

This eight-minute [overview video](https://youtu.be/7GJjhZoYEus) highlights the components and features in the latest version of Ansible Automation Platform, and how they come together to deliver a comprehensive enterprise automation experience.

### Try Ansible Automation Platform

Get hands-on with our other [self-paced, on-demand labs](https://www.redhat.com/en/engage/redhat-ansible-automation-202108061218). These interactive learning scenarios provide a preconfigured Ansible Automation Platform environment where you can experiment on how the platform can help you solve real-world challenges.

Sign up for an Ansible Automation Platform [60-day trial](https://www.redhat.com/en/technologies/management/ansible/try-it) to try it in your environment.

### Plan your upgrade

If you are still operating Ansible Automation Platform 1.2, it is time to start planning your upgrade. 

- Get started with this checklist, “5 ways to prepare for migration to Ansible Automation Platform 2.”
- Register for a free webinar, “Migrating to the next generation IT automation platform.”

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
