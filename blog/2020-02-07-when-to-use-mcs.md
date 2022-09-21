---
slug: when-to-use-mcs
title: When to use MCS - Never
authors: [joek]
tags: [MCS]
---
The aim of this post is to save you some Googling-Time™, skip ahead to the conclusion [here](#tldr---dont-bother-with-mcs)

SELinux has a component that isn't too applicable to businesess called "Multi-Level Security" ([MLS](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/selinux_users_and_administrators_guide/mls)). Most businesses don't have document classifications like "_top-secret_", "_for your eyes only_" or "_a view to a kill_".

Due to this there was some [efforts](https://marc.info/?l=selinux&m=112130545202445&w=2) to repurpose this feature for use as "Multi-Categories Security" (MCS) where the the sensitivity field is ignored and set to a fixed value `s0` and the levels are repurposed as categories.

If we take the proposed [RedHat toy example](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/5/html/deployment_guide/sec-mcs-getstarted)  

> In a corporate environment, categories could be used to identify documents confidential to specific departments. Categories could be established for "Finance", "Payroll", "Marketing", and "Personnel". Only users assigned to those categories can access resources labeled with the same category.

![venn diagram](/img/mcs_venn.png)

This could be reasonable, except that MCS requires you to be in **ALL** the categories to be able to perform an action on the object, so in the above example that isn't helpful as when is someone in Marketing also in Finance?! Surely that intersect is extremely rare. If there was some way to allow for *m of n* categories then that would be useful, but as it stands I can't think of a good use case. 

I tried to think more generically about security problems that lend themselves to that intersect set. But only ones I could think of were heirarchical 

  ...if there is some killer use case for MCS let me know [@josephkirwin](https://twitter.com/josephkirwin) I'd like to be wrong with this one!

I did a lot of reading to find out how to use MCS and then later try to find why anyone would use it, here's some of the most useful reads I came across:
- [https://james-morris.livejournal.com/5583.html](https://james-morris.livejournal.com/5583.html)
- [http://www.cse.psu.edu/~trj1/cse543-f07/papers/SELinux-MLS.pdf](http://www.cse.psu.edu/~trj1/cse543-f07/papers/SELinux-MLS.pdf)
- [https://marc.info/?l=selinux&m=112130545202445&w=2](https://marc.info/?l=selinux&m=112130545202445&w=2)

*TL;DR* - Don't bother with MCS
