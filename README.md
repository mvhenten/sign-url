sign-url
========

### Simple url signing - sign urls to protect someone from tampering with it.

This is a very cheap way of protecting the data inside an url from tampering, so you
may rely on it actually being trusted. For example, the expiry in some kind of reset link
could be encoded in the url, and then signed, meaning you do not have to keep track
of the actual expiry server-side. The value for expiry cannot be changed without messing up
the signature.

Of course, you'll need to keep track of the `<secret>` used to sign your urls yourself.

The url parameters, once signed, maybe re-ordered or mangled, internally, they are always
normalized, and sorted before signing/signing checks.

Example:

```
   var url = "http://my.superproject.io?confirm=username@somewhwere.com&expiry=' + Date.now() + 3600000;
   var signed = Sign.url(url, '@#ES@#@#$@#$#@$DFWE' );

   // gets you somethign like
   "http://my.superproject.io?confirm=username@somewhere.com&expiry=1392305771282&signature=SrO0X9p27LHFIe7xITBOpetZSpM%3D'

```
