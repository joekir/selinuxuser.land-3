---
sidebar_position: 8
title: 6. Setting phasers to enforce! 
tags:
  - Lab
  - AWS
---

## Recap on where we're at currently?

Connecting into our host through our [AWS Session Manager](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html) (because in this context you'll be outside of the policy we're about to enforce!) that we configured in [Step 1](/course/lab-jumpbox-ssh/configuring-sshd).

To review the current status:

```plain {5,6}
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

To explain the highlighted lines above I'll refer to the definitions in our config file:

```plain {6,10}
$ cat /etc/selinux/config

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

For an SSH Bastion the `targeted` option is quite nice, as the incoming SSH user will be targeted but all other background services/processes won't need their own SELinux policies, while this could be more secure, it's a lot more work!

## Setting to enforce

We have 2 options:
1. Temporary -> this will not persist through a system reboot
2. Permanent -> this will persist through a system reboot

The `Temporary` approach can be really helpful, if while developing and testing you end up locking yourself out of the OS. You can just force reboot the whole thing and get out of that pain.

### Temporary

Using the utility `setenforce` (oddly 1 is true and 0 is false here... not very Unixlike!) we can set this like so:
```plain {1,7}
# setenforce 1
# sestatus
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
Mode from config file:          permissive
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Max kernel policy version:      33
```

_Note, you'll need to be root or sudo to run this as eventually `setenforce` will call `/sys/fs/selinux/enforce` which is owned by root._

### Permanent

This change is quite simple, you go to the well known config file (`/etc/selinux/config`) above and change that setting.
```plain {6}
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=enforcing
# SELINUXTYPE= can take one of three two values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected.
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
```

_Again, you will need to be root to modify this file, even though it's read only to all users._

We will now see the following changes to our SELinux status:
```plain {7}
$ sestatus
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   permissive
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Max kernel policy version:      33
```

Once you reboot the "Current mode" will then become `enforcing` too.

## SSH into an enforced session

_and tailing the logs with our unrestricted SSM Session Manager.._

Recap the info in Step 2 so that you can establish an SSH session with our Bastion host.
Assuming that is done we're going to run the following:
```plain
$ id
uid=1000(ec2-user) gid=1000(ec2-user) groups=1000(ec2-user),4(adm),10(wheel),190(systemd-journal) context=user_u:user_r:user_t:s0
```

we specifically want the SELinux context of our user id, so lets shorten to:
```plain
$ id --context
user_u:user_r:user_t:s0
```

Now we can use the tools we learned about in [Step 5](/course/lab-jumpbox-ssh/where-can-i-find-the-logs) to see what happens when our SSH user tries to do things that they should not be allowed to do. For example if the SSH user tries to sudo, so they can read another SSH user's ssh-agent keys (threat we identified earlier in the course in ["What info can other tenants see?"](/course/lab-jumpbox-ssh/what-info-can-other-tenants-see)):

What the SSH user sees:
```plain {1,6}
$ sudo su
sudo: PERM_SUDOERS: setresuid(-1, 1, -1): Operation not permitted
sudo: no valid sudoers sources found, quitting
sudo: setresuid() [0, 0, 0] -> [1000, -1, -1]: Operation not permitted
sudo: unable to initialize policy plugin
$ seinfo
ERROR: Unable to open policy /sys/fs/selinux/policy.
ERROR: Permission denied
```

What we see as SSM Agent connection in our logs:
```plain {4,7}
# ausearch -m avc,user_avc -sv no --context user_u:user_r:user_t:s0 -ts recent
----
time->Fri Dec  2 20:12:39 2022
type=AVC msg=audit(1670012202.274:264): avc:  denied  { setuid } for  pid=3849 comm="sudo" capability=7
 scontext=user_u:user_r:user_t:s0 tcontext=user_u:user_r:user_t:s0 tclass=capability permissive=0
time->Fri Dec  2 20:12:39 2022
type=AVC msg=audit(1670011959.244:245): avc:  denied  { read_policy } for  pid=3764 comm="seinfo" scontext=user_u:user_r:user_t:s0 tcontext=system_u:object_r:security_t:s0 tclass=security permissive=0----
```

But we can also see that the SSH user can still access their own SSH Agent keys without issue, e.g.
```plain
$ ssh-add -L
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJU01taCOvwJ7xeFVFG7FbgWrVAGcDh/qSQBnZwlAr7J /home/user/.ssh/backend-instance.pem
```

## Lab Conclusion

The above results confirm to us that we have managed to successfully isolate tenants from accessing each other's sensitive ssh-agent key material, and yet we have not added so much enforcement that they cannot access their own key-material to move onward from the Bastion.

This lab was not a comprehensive lockdown of a Bastion, if you wanted to address the additional risk that "the SSM Agent user can read the SSH User's key-material" you would want to author an SELinux policy targetting that process too, currently it's SELinux context is:
```plain
system_u:system_r:unconfined_service_t:s0 ssm-user 3189 0.0  0.3 124208 3408 pts/0 Ss 19:35   0:00 /bin/sh
```

and you would want that to not be an `unconfined*t` type, as those types are exempt from enforcement.

To achieve this however, you would also need to author a policy for
- /usr/bin/amazon-ssm-agent
- /usr/bin/ssm-agent-worker
- /usr/bin/ssm-session-worker

As these 3 processes are used in concert (as root) to broker the SSM session that you are interacting with. It would likely require an SELinux concept called a [`domain transition`](https://selinuxproject.org/page/NB_Domain_and_Object_Transitions), that we will cover later in the course.