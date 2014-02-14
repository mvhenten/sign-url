sign-url
========

Sign urls to protect someone from tampering with it.

[![Build Status](https://drone.io/github.com/mvhenten/sign-url/status.png)](https://drone.io/github.com/mvhenten/sign-url/latest)

This module is a wrapper around `crypto.createHmac` and simplifies the process of signing
urls with dynamic query parameters.

A signed url provides you with the certainty of the origin of that url. For example, a malicious
user may try some url hacking in order to discover resources, or even DoS your application by forcing
it to unneeded processing and io.

Of course, you'll need to keep track of the `<secret>` used to sign your urls yourself.

The url parameters, once signed, maybe re-ordered or mangled, internally, they are always
normalized, and sorted before signing/signing checks.

Example:

```
   var url = "http://my.superproject.io?confirm=username@somewhwere.com&expiry=' + Date.now() + 3600000;
   var signed = Sign.url(url, '<SECRET>' );

   // gets you somethign like
   "http://my.superproject.io?confirm=username@somewhere.com&expiry=1392305771282&signature=SrO0X9p27LHFIe7xITBOpetZSpM%3D'

```
