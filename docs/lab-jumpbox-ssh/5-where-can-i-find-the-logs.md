---
sidebar_position: 7
title: 5. Where can I find the logs?
tags:
  - Lab 
---

## auditd

> The Linux audit framework provides a CAPP-compliant ([Controlled Access Protection Profile](https://en.wikipedia.org/wiki/Controlled_Access_Protection_Profile)) auditing system that reliably collects information about any security-relevant (or non-security-relevant) event on a system.[^1]

**auditd** is the **audit**ing **d**aemon, and it logs (in nearly all cases I know of) to `/var/log/audit/audit.log`.
auditd is not exclusively used by SELinux, many security-critical services output to this, so it will be necessary for us to filter the messages related to our concerns.

## Examining the logs on our Lab host

With what we have setup in the previous steps we should now have
1. A system running SELinux in permissive mode (where it logs the violations but does not block them from occuring yet)
2. A remote shell connected in via SSH, with the following SELinux context applied:
  ```plain {4}
  [ec2-user ~]$ secon
  user: user_u
  role: user_r
  type: user_t
  sensitivity: s0
  clearance: s0
  mls-range: s0
  ```
3. A reverse-shell connected to the host through the AWS SSM agent, with the following SELinux context applied:
  ```plain {4}
  [ssm-user ~]$ secon
  user: system_u
  role: system_r
  type: unconfined_service_t
  sensitivity: s0
  clearance: s0
  mls-range: s0
  ```
  _note, that we can see there are no constraints on this process (as is seen by highlighted rows above), as we have not entered the host via SSH, this is intentional._

If we now run the following command in the shell that SSH has facilitated for us (you'll need to _sudo su_ to become root before tailing this):
```
[root ~]# tail -n0 -f /var/log/audit/audit.log
```

At first here we'll see nothing as the `-n0` argument is saying we don't want any trailing information, just new stuff. The `-f` argument tails that file for new changes and will output them.

In the other shell we have, if you now try to assume root via something like
```
[ec2-user ~]$ sudo su
```

We will see all the following lines in auditd logs:

<details>
<summary>Output of tailing /var/log/audit/audit.log when we type sudo su</summary>

```plain {1,19,22,25,41,45,49,53,57,65,69,71}
type=AVC msg=audit(1668988444.803:150): avc:  denied  { setuid } for  pid=3543 comm="sudo" capability=7
 scontext=user_u:user_r:user_t:s0 tcontext=user_u:user_r:user_t:s0 tclass=capability permissive=1

type=USER_ACCT msg=audit(1668988444.843:151): pid=3543 uid=1000 auid=1000 ses=2 subj=user_u:user_r:user_
t:s0 msg='op=PAM:accounting grantors=pam_unix acct="ec2-user" exe="/usr/bin/sudo" hostname=? addr=? term
inal=/dev/pts/1 res=success'

type=USER_CMD msg=audit(1668988444.843:152): pid=3543 uid=1000 auid=1000 ses=2 subj=user_u:user_r:user_t
:s0 msg='cwd="/home/ec2-user" cmd="su" terminal=pts/1 res=success'

type=CRED_REFR msg=audit(1668988444.843:153): pid=3543 uid=0 auid=1000 ses=2 subj=user_u:user_r:user_t:s
0 msg='op=PAM:setcred grantors=pam_env,pam_unix acct="root" exe="/usr/bin/sudo" hostname=? addr=? termin
al=/dev/pts/1 res=success'

type=USER_START msg=audit(1668988444.847:154): pid=3543 uid=0 auid=1000 ses=2 subj=user_u:user_r:user_t:
s0 msg='op=PAM:session_open grantors=pam_keyinit,pam_keyinit,pam_limits,pam_systemd,pam_unix acct="root"
 exe="/usr/bin/sudo" hostname=? addr=? terminal=/dev/pts/1 res=success'

type=AVC msg=audit(1668988444.851:155): avc:  denied  { create } for  pid=3545 comm="su" scontext=user_u
:user_r:user_t:s0 tcontext=user_u:user_r:user_t:s0 tclass=netlink_selinux_socket permissive=1

type=AVC msg=audit(1668988444.851:156): avc:  denied  { bind } for  pid=3545 comm="su" scontext=user_u:u
ser_r:user_t:s0 tcontext=user_u:user_r:user_t:s0 tclass=netlink_selinux_socket permissive=1

type=USER_AVC msg=audit(1668988444.855:157): pid=3545 uid=0 auid=1000 ses=2 subj=user_u:user_r:user_t:s0
 msg='avc:  denied  { passwd } for  scontext=user_u:user_r:user_t:s0 tcontext=user_u:user_r:user_t:s0 tc
lass=passwd  exe="/usr/bin/su" sauid=0 hostname=? addr=? terminal=pts/1'

type=USER_AUTH msg=audit(1668988444.855:158): pid=3545 uid=0 auid=1000 ses=2 subj=user_u:user_r:user_t:s
0 msg='op=PAM:authentication grantors=pam_rootok acct="root" exe="/usr/bin/su" hostname=ip-172-31-5-255.
us-west-2.compute.internal addr=? terminal=pts/1 res=success'

type=USER_ACCT msg=audit(1668988444.855:159): pid=3545 uid=0 auid=1000 ses=2 subj=user_u:user_r:user_t:s
0 msg='op=PAM:accounting grantors=pam_succeed_if acct="root" exe="/usr/bin/su" hostname=ip-172-31-5-255.
us-west-2.compute.internal addr=? terminal=pts/1 res=success'

type=CRED_ACQ msg=audit(1668988444.855:160): pid=3545 uid=0 auid=1000 ses=2 subj=user_u:user_r:user_t:s0
 msg='op=PAM:setcred grantors=pam_rootok acct="root" exe="/usr/bin/su" hostname=ip-172-31-5-255.us-west-
2.compute.internal addr=? terminal=pts/1 res=success'

type=AVC msg=audit(1668988444.855:161): avc:  denied  { read write } for  pid=3545 comm="su" name="lastl
og" dev="xvda1" ino=12918534 scontext=user_u:user_r:user_t:s0 tcontext=system_u:object_r:lastlog_t:s0 tc
lass=file permissive=1

type=AVC msg=audit(1668988444.855:161): avc:  denied  { open } for  pid=3545 comm="su" path="/var/log/la
stlog" dev="xvda1" ino=12918534 scontext=user_u:user_r:user_t:s0 tcontext=system_u:object_r:lastlog_t:s0
 tclass=file permissive=1

type=AVC msg=audit(1668988444.855:162): avc:  denied  { lock } for  pid=3545 comm="su" path="/var/log/la
stlog" dev="xvda1" ino=12918534 scontext=user_u:user_r:user_t:s0 tcontext=system_u:object_r:lastlog_t:s0
 tclass=file permissive=1

type=AVC msg=audit(1668988444.855:163): avc:  denied  { read } for  pid=3545 comm="su" name="btmp" dev="
xvda1" ino=12940222 scontext=user_u:user_r:user_t:s0 tcontext=system_u:object_r:faillog_t:s0 tclass=file
 permissive=1

type=AVC msg=audit(1668988444.855:163): avc:  denied  { open } for  pid=3545 comm="su" path="/var/log/bt
mp" dev="xvda1" ino=12940222 scontext=user_u:user_r:user_t:s0 tcontext=system_u:object_r:faillog_t:s0 tc
lass=file permissive=1

type=USER_START msg=audit(1668988444.855:164): pid=3545 uid=0 auid=1000 ses=2 subj=user_u:user_r:user_t:
s0 msg='op=PAM:session_open grantors=pam_keyinit,pam_limits,pam_systemd,pam_unix,pam_xauth acct="root" e
xe="/usr/bin/su" hostname=ip-172-31-5-255.us-west-2.compute.internal addr=? terminal=pts/1 res=success'

type=AVC msg=audit(1668988444.859:165): avc:  denied  { dac_read_search } for  pid=3546 comm="bash" capa
bility=2  scontext=user_u:user_r:user_t:s0 tcontext=user_u:user_r:user_t:s0 tclass=capability permissive
=1

type=AVC msg=audit(1668988444.859:166): avc:  denied  { read } for  pid=3546 comm="bash" name=".bashrc"dev="xvda1" ino=302930 scontext=user_u:user_r:user_t:s0 tcontext=system_u:object_r:admin_home_t:s0 tclass=file permissive=1

type=AVC msg=audit(1668988444.859:166): avc:  denied  { open } for  pid=3546 comm="bash" path="/root/.bashrc" dev="xvda1" ino=302930 scontext=user_u:user_r:user_t:s0 tcontext=system_u:object_r:admin_home_t:s0 tclass=file permissive=1
```
</details>

The types of log lines that are of interest to us here are `AVC` and `USER_AVC` (highlighted above), AVC stands for **A**ccess **V**ector **C**ache, and we will [go into more details](/course/beyond-the-basics/auditd-and-access-vector-cache) on this in the following section of the course. The former type is for kernel-land events, and the later type is for user-land events.[^2]

We're running in `permissive` moded currently so we see all the levels of blocks that would occur, but if we were running in `enforcing` mode it would not get past the attempt to use the `setuid` syscall[^3].

## Filtering just to AVC events with ausearch

The auditd search tool is called `ausearch` you can filter for the SELinux AVC events via:
```
# ausearch -m avc,user_avc
```

and if we want to filter even further for just our `setuid` denial,  we could do something like:
```
# ausearch -m avc,user_avc -sv no | grep setuid
```
which is looking for AVC denials and then grepping for setuid[^4].

[^1]: https://wiki.archlinux.org/title/Audit_framework
[^2]: https://selinuxproject.org/page/NB_AL
[^3]: [setuid(2)](https://man7.org/linux/man-pages/man2/setuid.2.html)
[^4]: Note, there is a flag `-sc` that is supposed to filter `ausearch` by SysCall name or number, I've tried the name, decimal and hex and not had success with it.