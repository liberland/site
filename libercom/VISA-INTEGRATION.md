# Linking LiberCom from visa.liberland.org

`https://visa.liberland.org/` is **not part of this repository** (no file here references it), so it has not
been changed. Whoever maintains it can add the link below.

**Label:** LiberCom — Global eSIM Connectivity
**Description:** Enjoy global mobile connectivity and exclusive eSIM benefits for Liberland citizens.
**URL:** `https://liberlandlimited.com/mobile/` during the preview, then `https://libercom.ll.land/`. Once that
domain is live, `/mobile/` will redirect to it, so the preview URL keeps working.

Minimal HTML, to restyle with the visa site's own classes:

```html
<a href="https://liberlandlimited.com/mobile/" target="_blank" rel="noopener">
  <strong>LiberCom — Global eSIM Connectivity</strong>
  <span>Enjoy global mobile connectivity and exclusive eSIM benefits for Liberland citizens.</span>
</a>
```

Good places for it: the post-approval / visa-granted page, and any "Before you travel" section. Travellers
who have just received a visa are the people who need data on arrival.
