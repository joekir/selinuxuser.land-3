---
sidebar_position: 6
title: 4. Configuring PAM to use SELinux 
description: Install the SELinux tools, enable SELinux and integrate with PAM and SSH.
tags:
  - Lab
  - AWS
---

## Enabling SELinux on Amazon-Linux-2

On AL2 SELinux is not enabled by default. So we need to do the following steps:

1. Install the tools and policy we need:
  ```
  yum install selinux-policy selinux-policy-targeted policycoreutils-python setools-console
  ```
2. Modify the file `/etc/selinux/config` from `SELINUX=disabled` to `SELINUX=permissive`, this will mean that our subjects under SELinux policy will not be enforced by it, we'll just see violations logged to auditd AVC (more about that in the next step).
3. Reboot the host
4. Once we reboot, run the following command to check everything looks like this:
  ```plain {7}
  $ sestatus
  SELinux status:                 enabled
  SELinuxfs mount:                /sys/fs/selinux
  SELinux root directory:         /etc/selinux
  Loaded policy name:             targeted
  Current mode:                   permissive
  Mode from config file:          permissive
  Policy MLS status:              enabled
  Policy deny_unknown status:     allowed
  Max kernel policy version:      33
  ```
  you will also notice that now you can see SELinux labels on files by using the `-Z` flag with `ls`, for example:
  ```
  $ ls -Z /bin/bash
  -rwxr-xr-x. root root system_u:object_r:shell_exec_t:s0 /bin/bash
  ```
  refer back to [our look at first SELinux policy](/course/foundational-concepts/look-at-a-complete-policy#file-context) for a refresher on what each of these attributes mean.    
  Note, to see the SELinux labels on our `SSH_AUTH_SOCK` we can run the following:
  ```
  # ls -Z /tmp/ssh-s1k9AakYVj/
  srwxr-xr-x. ec2-user ec2-user unconfined_u:object_r:user_tmp_t:s0 agent.3534
  ```

## Setting up SElinux to work with SSH (via PAM)

In /etc/ssh/sshd_config `UsePAM` needs to be set to `yes`
```plain {4}
...
WARNING: 'UsePAM no' is not supported in Red Hat Enterprise Linux and may cause several
# problems.
UsePAM yes

#AllowAgentForwarding yes
X11Forwarding yes
...
```

Next, we need to look at how we have PAM (Priviliged Access Management) configured (`/etc/pam.d/sshd`) to use the [pam_selinux](https://linux.die.net/man/8/pam_selinux) module.

We need to ensure that the lines are present in that file:
```
# pam_selinux.so close should be the first session rule
session    required     pam_selinux.so close verbose
...
...
...
# pam_selinux.so open should only be followed by sessions to be executed in the user context
session    required     pam_selinux.so open verbose
```

If we add the `verbose` tag to `pam_selinux.so` config in `/etc/pam.d/sshd`, then when we first ssh in we'll see the context that we're assigned:
```
Security Context unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 Assigned
Key Creation Context unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023 Assigned
```

At this point we could go one of two ways:
1. If this Bastion has a very limited amount of users we could just define a SELinux role for our user, e.g. if we want to modify the _ec2-user_:    
  `# semanage user -m 'ec2-user' -R 'user_r'`
2. Or in a more common case where we want to be sure that the default user context is always secure:
  ```
  # semanage login -m -S targeted -s "user_u" -r s0 __default__
  ```
  We will now see that from semanage that our default mapping is updated in both places:
  ```
  # semanage login -l

  Login Name           SELinux User         MLS/MCS Range        Service

  __default__          user_u               s0                   *
  root                 unconfined_u         s0-s0:c0.c1023       *
  system_u             system_u             s0-s0:c0.c1023       *
  ```

  and also the auto-generated content in the file `/etc/selinux/targetted/seusers` will also reflect this.

  Note, we chose `user_u` ([details on user_u privilieges here](https://linux.die.net/man/8/user_selinux)) as it has limited priviliges on the system, but unliked `guest_u` or `xguest_u` it is permitted to ssh on to the destination host.

  From the man page:
  > user_u - Generic unprivileged user - Security Enhanced Linux Policy

You will now notice that when we ssh in next time, the banner will display the following:    
```
$ ssh -A -i ~/.ssh/selinux-test-1.pem ec2-user@ec2-34-219-25-124.us-west-2.compute.amazonaws.com
Security Context user_u:user_r:user_t:s0 Assigned
Key Creation Context user_u:user_r:user_t:s0 Assigned
```

We can verify that the ssh-agent propagation is indeed working by doing the following
```
$ ssh ec2-user@ip-172-31-11-157.us-west-2.compute.internal
... succeeds! ...

$ ssh-add -D
All identities removed.

$ ssh ec2-user@ip-172-31-11-157.us-west-2.compute.internal
Permission denied (publickey,gssapi-keyex,gssapi-with-mic).
```