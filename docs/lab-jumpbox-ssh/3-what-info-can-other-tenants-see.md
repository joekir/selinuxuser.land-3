---
sidebar_position: 4
title: 3. What info can adjacent SSH tenants access?
tags:
  - Lab 
---

## Threat Context

Recall that this is a jumpbox/bastion-host, so it's reasonable to make an assumption that everyone on here is authenticated (via SSH) to be on the box. However due to differing levels of authorization within an organization/company it's likely that where they can connect to after that will vary a lot based on their privilege levels.

Hence the primary threats[^1] are:
1. Spoofing -> using forwarded credentials from another tenant to access a server as them.
2. Denial of Service (via Tampering) -> modifying their agent credentials so they cannot access downstream hosts.
3. Information Disclosure -> observing any sensitive data in their SSH session that you should not have access to.

## How you can perform the attack on yourself to learn

Once you're connected to the host with your SSH client, in your other SSM console (the one in the browser on console.aws.amazon.com) run the following:
```
# ps -u ec2-user
  PID TTY          TIME CMD
 8973 ?        00:00:00 sshd
 8974 pts/1    00:00:00 bash
```

We can then get that bash process ID (PID) and dump the environment variables for the process:    
`cat /proc/8974/environ`

we are looking for the _SSH_AUTH_SOCK_ environment variable, which will look something like this:    
`SSH_AUTH_SOCK=/tmp/ssh-423TlzrQBq/agent.8973`

This is a [socket file](https://en.wikipedia.org/wiki/Unix_domain_socket) that allows the key sharing between the remote client and the ssh-agent on this server.

So for the users available to us from the SSM console (`ssm-user` or `root`) we don't have any ssh-agent identities:
```
(root)# ssh-add -L
The agent has no identities.
```

However now if we use the environment variable we found for the SSH_AUTH_SOCK we can dump out what the `ec2-user` forwarded to the host:
```
(root)# SSH_AUTH_SOCK=/tmp/ssh-423TlzrQBq/agent.8973 ssh-add -L
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP+Zj68BITqTICXyjdyzLoBlwbNrPoGEVbB7gsJJ93UW secret-example-key
```

:scream: we see the ssh key I had forwarded from my laptop agent that I was going to use to connect to _THE FINANCE DATABASE HOST_ (for example).
This is how any observer on the Bastion could also do the same if they knew how to find and use the same `SSH_AUTH_SOCK` as me.

## But does this actually happen much in the real world?

Yes, yes it does. For example, in 2019 matrix.org had a [security incident](https://matrix.org/blog/2019/05/08/post-mortem-and-remediations-for-apr-11-security-incident) caused directly from their usage of SSH Agent forwarding.

There are of course some [other measures](https://medium.com/kernel-space/why-using-ssh-agent-forwarding-is-a-bad-idea-6cbdff31bbee) one could take to defend against this, but for the purpose of this lab lets ignore their existence and use SELinux to defend against the issue.

[^1]: I was intentionally using terms from the [STRIDE threat-modeling framework](https://en.wikipedia.org/wiki/STRIDE_(security)) here for internal consistency when describing threats.