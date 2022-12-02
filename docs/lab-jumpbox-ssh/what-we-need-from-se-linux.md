---
sidebar_position: 5
title: What do we need SELinux to do for us?
description: An overview of the protections we're trying to add to fortify this bastion host.
tags:
  - Lab 
---

## Listing the necessary functions in the Bastion

1. An inbound TCP connection on port 22 (or whatever the Bastion is using for SSH, this is just the default) needs to be allowed.
2. An outbound TCP connection on some ephemeral port range needs to be made to the private network (we don't care what protocol is used).
3. Our sshd (SSH Daemon) needs to be able to create a `SSH_AUTH_SOCK` file in `/tmp/ssh/...` without other processes being able to snoop on it (No matter if they're root or not!).
4. We otherwise don't really want tenants "exploring" around the Bastion host (fortunately with SELinux policy it's default-deny, so if we don't specify those they don't get them).

## Diagram of what this looks like

```mermaid
flowchart LR
    subgraph "Bastion Host (Public Subnet)"
        bash
        sshd
        tmpFile("SSH_AUTH_SOCK")
    end
    UA("User's SSH Client")-->|SSH| sshd
    sshd -.->|Create| tmpFile
    sshd -->|Init| bash
    subgraph "Private Subnet"
        I1("Internal Server 1")
        I2("Internal Server 2")
    end
    bash -->|SSH| I1
    bash -->|HTTPS| I2
```