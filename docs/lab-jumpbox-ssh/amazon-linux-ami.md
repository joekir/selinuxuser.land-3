---
sidebar_position: 3
title: Amazon Linux AMI 
tags:
  - Lab
  - AWS 
---

# Overview

It's based on CentOS6
It still uses yum
selinux is not enabled by default

`yum install selinux-policy selinux-policy-targeted policycoreutils-python`


if you want to be lazy and see what a command looks at, run `strace`
e.g here is what `sestatus` does
```
statfs("/sys/fs/selinux", 0x7ffc7519b5c0) = -1 ENOENT (No such file or directory)
statfs("/selinux", 0x7ffc7519b5c0)      = -1 ENOENT (No such file or directory)
brk(NULL)                               = 0x1e5d000
brk(0x1e7e000)                          = 0x1e7e000
openat(AT_FDCWD, "/proc/filesystems", O_RDONLY) = 3
fstat(3, {st_mode=S_IFREG|0444, st_size=0, ...}) = 0
read(3, "nodev\tsysfs\nnodev\ttmpfs\nnodev\tbd"..., 1024) = 292
read(3, "", 1024)                       = 0
close(3)                                = 0
access("/etc/selinux/config", F_OK)     = 0
write(2, "usage:  setenforce [ Enforcing |"..., 54usage:  setenforce [ Enforcing | Permissive | 1 | 0 ]
) = 54
exit_group(1)                           = ?
+++ exited with 1 +++
```

Once you reboot, after modifying `/etc/selinux/config` to `permissive` you'll see 

```
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