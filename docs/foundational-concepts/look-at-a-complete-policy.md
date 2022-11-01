---
sidebar_position: 4
title: First look at a complete SE Linux policy 
---

_This content can all be found after installing [policycoreutils-devel](https://rpmfind.net/linux/rpm2html/search.php?query=policycoreutils-devel) and looking in the directory `/usr/share/selinux/devel/` however <u>**I've also added my own comments inline to explain each piece for you.**</u>_

<!-- // TODO need syntax highlighting for SELinux in PrismJS https://prismjs.com/#supported-languages -->

### Type Enforcement

This is the main policy definition, where you can say what various `types` in a given `domain` may interact with one another.

<details>
<summary>/usr/share/selinux/devel/example.te</summary>

```yml
# Note:
#       Any line in here not ending in a semi-colon (;) is going to be a GNU m4 macro.
#       You can define these yourself, which I will cover below but the inbuilt ones can be found by grepping in`/usr/share/selinux/devel/include/`.

# Macro defined in `/usr/share/selinux/devel/include/support/loadable_module.spt`
# Name of policy and version
policy_module(myapp, 1.0.0)  

# The keyword `type` is how you define a type, the `_t` suffix is merely a convention in naming
type myapp_t;
type myapp_exec_t;
type myapp_log_t;
type myapp_tmp_t;

# Macro defined in `/usr/share/selinux/devel/include/kernel/domain.if`
# This function has a simple purpose, to let the type be used as a "domain", we will get into what a "domain" is in SELinux shortly!
domain_type(myapp_t)

# Macro defined in `/usr/share/selinux/devel/include/kernel/domain.if`
# Lets the type (2nd argument) be an entrypoint to the domain we just declared above.
domain_entry_file(myapp_t, myapp_exec_t)

# Macro defined in `/usr/share/selinux/devel/include/system/logging.if`
# Make the specified type usable for log files.
logging_log_file(myapp_log_t)

# Macro defined in `/usr/share/selinux/devel/include/kernel/files.if`
# Make the specified type a file used for tmp files
files_tmp_file(myapp_tmp_t)

# Macro defined in `/usr/share/selinux/devel/include/kernel/files.if`
# Creates an object in tmp directories with the type provided, params in order are:
#       - domain
#       - type that the object will be created as
#       - class that the object will be created as
#       - (optional) name of object being created
files_tmp_filetrans(myapp_t,myapp_tmp_t,file)

# The following (FINALLY) aren't macros! this is actual type enforcement policy syntax
# The structure is:
#
#       (allow|deny) <source type> <target type>:<target class> {[]<permissions>}
#
# We'll go more into what these permissions are in future tutorials
allow myapp_t myapp_log_t:file { read_file_perms append_file_perms };
allow myapp_t myapp_tmp_t:file manage_file_perms;
```
</details>

### File Context

This file is run when the OS first boots or if you manually run the lableller.
Thanks to the extended-attribute file system, SELinux can add attributes to files in the OS to that they are codified with a format of `<user>:<role>:<type>,<level>` (we will go into those concepts more in depth later in the course!) 

<details>
<summary>/usr/share/selinux/devel/example.fc</summary>

```yml
# myapp executable will have:
# label: system_u:object_r:myapp_exec_t
# MLS sensitivity: s0
# MCS categories: <none>

/usr/sbin/myapp         --      gen_context(system_u:object_r:myapp_exec_t,s0)
```
</details>

### Interfaces

If this looks super weird, it's because it's OG Unix macro processor called [GNU m4](https://www.gnu.org/software/m4/). You can get by without authoring any of these yourself, but if you want to make reusable functions or abstract Type Enforcement files then you will need to study this.

<details>
<summary>/usr/share/selinux/devel/example.if</summary>

```yml
# <summary>Myapp example policy</summary>
## <desc>
##      <p>
##              More descriptive text about myapp.  The desc
##              tag can also use p, ul, and ol
##              html tags for formatting.
##      </p>
##      <p>
##              This policy supports the following myapp features:
##              <ul>
##              <li>Feature A</li>
##              <li>Feature B</li>
##              <li>Feature C</li>
##              </ul>
##      </p>
## </desc>
#

########################################
## <summary>
##      Execute a domain transition to run myapp.
## </summary>
## <param name="domain">
##      <summary>
##      Domain allowed to transition.
##      </summary>
## </param>
#
interface(`myapp_domtrans',`
        gen_require(`
                type myapp_t, myapp_exec_t;
        ')

        domtrans_pattern($1,myapp_exec_t,myapp_t)
')

########################################
## <summary>
##      Read myapp log files.
## </summary>
## <param name="domain">
##      <summary>
##      Domain allowed to read the log files.
##      </summary>
## </param>
#
interface(`myapp_read_log',`
        gen_require(`
                type myapp_log_t;
        ')

        logging_search_logs($1)
        allow $1 myapp_log_t:file read_file_perms;
')
```
</details>