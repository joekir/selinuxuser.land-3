---
sidebar_position: 3
title: SE Linux glossary
description: Jargon Deluxe!
---

## Components

* `object` — usually a file (but could also be a special file like a socket) within the Linux userland OS.
* `class` — this is what _class_ of object it is, e.g. a file, a directory as each of these subset the available actions that a given object is able to take.
* `type` — a label that is assigned to an `object` (SELinux policy only works with the labels assigned via the [extended attribute file system](https://man7.org/linux/man-pages/man7/xattr.7.html))
* `domain` — a label assigned to a process that is interacting with `types`.
* `permissions` — the subset of (all possible) actions that a given `class` is able to perform e.g. `read`, `append`, `open`.
* `attributes` — tags that can be added to `types` to allow for easy grouping when applying constraints to many types at once.

## File extensions

* `.pp` — "Policy Package", a compiled SELinux policy module.
* `.te` — "Type Enforcement", the main SELinux policy file, where you define how _types_ interact.
* `.fc` — "File Context", the list of paths and SELinux contexts that this policy will apply to each of them. 
* `.if` — "Interface", GNU m4 macros that are usable across policies and can be used to simplify your `te` definition file.

## The common utilities

* `sestatus` — aggregates the state of the OS in relation to SELinux, it'll check through various files and settings to summarize.
* `semanage` — "SELinux Policy Management tool".
* `semodule` — primary command for adding and removing policy modules to SELinux.
    * Want to see what modules are installed in your system? `semodule -l`.
* `setenforce`/`getenforce` — modify the mode that SELinux is running in, this can be achieved by just editing files manually too.
* `setsebool`/`getsebool` — Toggle various boolean settings if an SELinux policy exposes them.
* `restorecon`/ #TODO
* `seinfo` — Policy query tool.
* `secon` — See an SELinux context, from a file, program or user input.

## SELinux policy development tools

* `sepolgen` — SELinux policy generator, use this instead of crafting your policy from scratch.
* `checkpolicy` — SELinux policy compiler

## Specific to _policycoreutils-devel_ package

* `semodule_unpackage` — extracts a non human-readable policy representation from a Policy Package file (`.pp`)
* `sedismod` (it was called `dismod` at some time or other...) — disasembles the module file that you get from `semodule_unpackage`, it's a bit odd compared to the others as it's an interactive CUI. But you can set an output file then just run all the options and get pretty close to the original `policy.te` definition.