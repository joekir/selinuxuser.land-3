---
title: Bugs when with SE Linux file system labelling when using aliases 
slug: labelling-bugs-when-using-aliases 
authors: [joek]
tags: [labelling, bug]
---
_**This is a repost from [https://www.josephkirwin.com/2018/04/15/selinux-labelling-aliases](https://www.josephkirwin.com/2018/04/15/selinux-labelling-aliases)**_

## What?

For those unfamiliar with SELinux (I'd recommend reviewing the [workshop materials](https://github.com/joekir/selinux-workshop) 😉) there is a file in the set of SELinux policy files called the file contexts (.fc). This is used by the various SELinux file labelling tools to tag files with their `user_type`, `role_type` and `context_type` (sometimes called `domain_type`) 

Here is an example agnostic of common Linux directories so as not to distract from the issue:

```
/citrus/lemon/.*        --       gen_context(system_u:object_r:lemon_domain_t,s0)
/banana/.*              --       gen_context(system_u:object_r:banana_domain_t,s0)
```

Around 2015-ish SELinux developers tried to get a bit #crafty with filepath aliasing so that some rules could be applied to many paths, e.g. `/usr/bin` vs `/bin`, however the aliasing didn't stop at sym/hardlinked directories, you could (and they did) alias things that were totally different contents! 😕

The aliases mostly live in the files: 
`"/etc/selinux/{targeted,default}/contexts/files/file_contexts.subs_dist"`

Following the above example if we then update that file to map the aliases
```
# alias origin
/citrus /banana
```

When running one of the labelling tools to check which is matched:
```
$ ./libselinux/utils/selabel_lookup_best_match -p /citrus/lemon/foo
Best match context: system_u:object_r:banana_domain_t:s0
```

Surely the user's expectation is that the `lemon_domain_t` would be returned as that is a "**more-specific**" match pattern. Don't worry the design isn't so crazy to be the "least-specific" match wins, that would be maddening! (cough "`/*`")

## Why?

In the userland libselinux source code I found the function that was responsible for this decision logic: [libselinux/src/label_file.c](https://github.com/SELinuxProject/selinux/blob/abe410aa86a4c26e196a92edd2eb5461c8519192/libselinux/src/label_file.c#L998)

```c
lookup_common(struct selabel_handle *rec, const char *key, int type, bool partial) {
```

we encounter a call to
```c
selabel_sub_key(struct saved_data *data, const char *key)
```

In the example above the candidate path we're trying to match (referred to as the key in the code) is "canonicalized" to the /banana alias but the regex being evaluated is not. 

## Fix?

My colleague [Travis Szucs](https://twitter.com/travisszucs) and I submitted a patch to the SELinux-mailing-list for this issue:


```diff
diff --git a/libselinux/src/label_file.c b/libselinux/src/label_file.c
index 560d8c3..98a8d1b 100644
--- a/libselinux/src/label_file.c
+++ b/libselinux/src/label_file.c
@@ -848,7 +848,7 @@ static struct spec *lookup_common(struct selabel_handle *rec,
 {
    struct saved_data *data = (struct saved_data *)rec->data;
    struct spec *spec_arr = data->spec_arr;
-   int i, rc, file_stem;
+   int i, rc, file_stem, orig_file_stem;
    mode_t mode = (mode_t)type;
    const char *buf;
    struct spec *ret = NULL;
@@ -879,8 +879,12 @@ static struct spec *lookup_common(struct selabel_handle *rec,
    }   
 
    sub = selabel_sub_key(data, key);
-   if (sub)
+   orig_file_stem = -1; 
+   if (sub) {
+      orig_file_stem = find_stem_from_file(data, &key);
        key = sub;
+   }   
 
    buf = key;
    file_stem = find_stem_from_file(data, &buf);
@@ -896,7 +900,8 @@ static struct spec *lookup_common(struct selabel_handle *rec,
         * stem as the file AND if the spec in question has no mode
         * specified or if the mode matches the file mode then we do
         * a regex check        */  
-       if ((spec->stem_id == -1 || spec->stem_id == file_stem) &&
+       if ((spec->stem_id == -1 || spec->stem_id == file_stem ||  
+            spec->stem_id == orig_file_stem) &&
            (!mode || !spec->mode || mode == spec->mode)) {
            if (compile_regex(data, spec, NULL) < 0)
                goto finish;
```

I think there is still some simplification that could be done with aliases. They really shouldn't have a direction (e.g. alias → original) instead they should go both ways and if there is a tie it should go by the ordering of the global combined contexts list.

Seemingly this "*implicit*" behaviour is dangerous from a security perspective as a developer of an SELinux policy, may not know the contents or directionality of the file_contexts.subs_dist file ahead of time or when it might change.

Eagerly awaiting this fix to be accepted, but nothing from RedHat as of yet...

