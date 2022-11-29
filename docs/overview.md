---
sidebar_position: 1
title: Course Overview 
---

_The left-hand-side navigation of this course is in order and the course is intended to be consumed from top-to-bottom. Throughout the course you can always click the 'previous' or 'next' buttons at the bottom of the page to navigate the material in the correct order._

### [Foundational concepts](/course/category/foundational-concepts-and-policy-building-blocks)     
The attempt of this introductory section is to expose you to all the parts of SELinux without overwhelming with intricacies that you would encounter if Googling "how to SELinux?".

### Lab: [Using SELinux to secure a Bastion Host](/course/category/lab-1-using-selinux-to-secure-a-bastion-host)      
Sometimes, before getting deep into documentation and theoretical it's better to learn by doing. That is exactly the intention of this section!
A jumpbox (or bastion host[^1]) is a hardened point of entry into a larger, private network. Usually this is used by many users simultaneously, hence one should consider how to isolate user's from each other. As a bastion-host is already a well-covered subject matter the addition of SELinux is the only _new_ moving part here.

### [Beyond the basics](/course/category/beyond-the-basics)    
Now that we have had some practical exposure, we will dive deeper into auditd, tooling and more components of the SELinux ecosystem.

### Lab: [Defending a vulnerable application](/course/category/lab-2-defending-a-vulnerable-application)   
I wrote some horrendous application in c (the start to all good stories) called Shellcode Eater. It's a web application that will execute any shellcode[^2] that you give it. The idea is that if you can secure this vulnerable-by-design application then a any other application should be easier.

### [Productionizing SELinux](/course/category/productionizing-selinux-deployments)    
In this final section we wrap up by learning how to add polish to the policies that we write so that they can be consumed by others that are not as familiar with SELinux. Also this section will cover some testing rigour and how to be operationally secure when managing policies.

[^1]: https://en.wikipedia.org/wiki/Bastion_host
[^2]: https://en.wikipedia.org/wiki/Shellcode
