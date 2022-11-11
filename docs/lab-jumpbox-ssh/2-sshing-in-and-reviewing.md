---
sidebar_position: 3
title: 2. Reviewing the config of the Bastion
description: We SSH in and briefly review the state of SELinux on the host.
tags:
  - Lab
  - AWS
---

## SSH Client

1. In [Step 1](/course/lab-jumpbox-ssh/configuring-sshd) of the lab we obtained the private part of an SSH keypair, it will be named as `{name-you-called-your-ec2-instance-on-aws}.pem` you can now move that to the directory `~/.ssh` and also `chmod 0400` the key so that it's only readable and writable by an administrator on your OS.
2. You should now be able to ssh into the host with something like:
  ```
  $ ssh -i "~/.ssh/selinuxuserland-course.pem" ec2-user@ec2-54-213-130-85.us-west-2.compute.amazonaws.com
  ```
  Note, `ec2-user` is a default user that is provisioned and you can use either the DNS of `ec2-54-211-130-85.us-west-2.compute.amazonaws.com` or just the raw IP address itself `54.211.130.85` (yours will obviously be a different IP that AWS will allocate to you).
3. As mentioned in [Step 1](/course/lab-jumpbox-ssh/configuring-sshd), the watcher command that you were running via the SSM Agent should show that you have a new SSH connection established.

## Reviewing the host defaults

If we take a look at the distro information we see:
```
$ cat /etc/*release
NAME="Amazon Linux"
VERSION="2"
ID="amzn"
ID_LIKE="centos rhel fedora"
VERSION_ID="2"
PRETTY_NAME="Amazon Linux 2"
ANSI_COLOR="0;33"
CPE_NAME="cpe:2.3:o:amazon:amazon_linux:2"
HOME_URL="https://amazonlinux.com/"
Amazon Linux release 2 (Karoo)
```
We know we're working with a CentOS derivative here, due to the above and the _yum_ package manager.
This is good for us as all the Redhat distros are well tested for SELinux compatibility.

We can also see where we're at with SELinux via:
```
$ sestatus
SELinux status:                 disabled
```

and more details in
```
$ cat /etc/selinux/config

# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=disabled
# SELINUXTYPE= can take one of three two values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected.
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
```
we will be modifying this to "permissive".