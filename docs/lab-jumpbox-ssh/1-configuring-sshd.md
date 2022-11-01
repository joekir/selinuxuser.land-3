---
sidebar_position: 2
title: 1. configuring sshd
tags:
  - Lab
  - AWS 
---

# Overview



My notes
- should use SSM Connect so we have a separate channel to work with while we configure ssh, the instance IAM role you need is
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "ec2.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

With `AmazonSSMManagedEC2InstanceDefaultPolicy`


Also talk about how connecting takes a while because if you look at SSM agent logs it's waiting for IMDS metadata service to be up so it can connect to System Manager outbound, you get that info like 
```
We weren't able to connect to your instance. Common reasons for this include:
SSM Agent isn't installed on the instance. You can install the agent on both Windows instances and Linux instances.
The required IAM instance profile isn't attached to the instance. You can attach a profile using AWS Systems Manager Quick Setup.
Session Manager setup is incomplete. For more information, see Session Manager Prerequisites.
```


`/etc/selinux/config`
```
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=permissive
# SELINUXTYPE= can take one of three two values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected.
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
```