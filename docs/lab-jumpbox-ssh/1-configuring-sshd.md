---
sidebar_position: 2
title: 1. Setting up our Bastion Host
description: We launch our Bastion Host and connect to it independent of SSH.
tags:
  - Lab
  - AWS 
---

## Intro

As one of the most popular Infrastructure-as-a-service platforms, AWS is a good choice to experiment with this.
Additionally, everything we're wanting to do here will fit within the bounds of [AWS Free Tier](https://aws.amazon.com/free).

With a few tweaks we will be able to use the [AWS Systems Manager Connect](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-sessions-start.html#start-ec2-console) to access the machine in case we accidentally lock ourselves out with SSH during our experimentation!


## Setting up the lab in AWS

_I'm assuming at this stage you have a free account and can login to [console.aws.amazon.com](https://console.aws.amazon.com/), if not that's the pre-task._

1. [Create and launch a new EC2 instance](https://docs.aws.amazon.com/efs/latest/ug/gs-step-one-create-ec2-resources.html) you can choose most of the default settings, you can generate an SSH keypair and allow public access via it, but we will not be using that to connect in this first phase. This guide also assumes you're be selecting the default AMI (Amazon Machine Image), which is "[Amazon Linux 2](https://aws.amazon.com/amazon-linux-2/faqs/)" and I have a separate page detailing some of what that is.
2. In IAM (Identity and Access Management) create a new [IAM Role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) called something like "EC2 SSM Connect" with the following policy
    ```json
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
3. Then add the permission [`AmazonSSMManagedEC2InstanceDefaultPolicy`](https://docs.aws.amazon.com/systems-manager/latest/userguide/security-iam-awsmanpol.html) to this role.
4. [Assign this role](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html) to your newly created EC2 instance from step 1.
5. (assuming your EC2 instance is running) wait for about 15 minutes. Why? For the SSM to connect to an instance the instance is waiting for something called the **I**nstance **M**eta**D**ata **S**ervice ([IMDS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html)) API to be locally available to register with, once this is available we will be able to connect in using our browser.
6. To connect, you'll need to visit the following URL replacing the `{YOUR INSTANCE ID}` with your id that begins in `i-`:     
   "ht<span>tps://</span>console.aws.amazon.com/ec2/home?#ConnectToInstance:instanceId=`{YOUR INSTANCE ID}`"

   If you haven't waited long enough (step 5) **OR** you haven't configured IAM correctly (step 4) then you will see this message:
    > We weren't able to connect to your instance. Common reasons for this include:    
    >   1. SSM Agent isn't installed on the instance. You can install the agent on both Windows instances and Linux instances.    
    >   2. The required IAM instance profile isn't attached to the instance. You can attach a profile using AWS Systems Manager Quick Setup.
7. If it's ready to connect you should see the following

    ![EC2 connect to instance from browser](/img/ready_to_connect.png)
8. Once you're in you can now run a command like (order by most recently started process descending):
    ```
    watch -n 1 'ps -eo pid,ppid,cmd,lstart --sort=-lstart | head'
    ```
   Then we will see our new SSH connection when we connect to our bastion in the next part of the lab!
