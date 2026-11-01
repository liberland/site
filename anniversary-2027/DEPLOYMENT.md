# Deployment handoff — Liberland 12th Anniversary 2027

## Current state

| Where | What | Status |
| --- | --- | --- |
| **https://liberlandlimited.com/anniversary/** | Test preview, built by `.github/workflows/deploy-pages.yml` on every push to `master` (`BASE_PATH=/anniversary/`, `SITE_URL=https://liberlandlimited.com/anniversary/`) | `noindex, nofollow`. Production build (no uncleared photographs) |
| **https://anniversary.ll.land/** | The historical **2026** site, on separate SiteGround hosting (nginx, 35.214.195.209), **not in this repository** | **Untouched.** Nothing in this repository deploys there |

## Before production at anniversary.ll.land (needs explicit authorisation)

1. **Preserve the 2026 site.** Take a full static archive of the current anniversary.ll.land (files and database
   export from SiteGround, plus a crawl, e.g. `wget --mirror --page-requisites --convert-links`). Decide where it lives
   afterwards, for example `2026.anniversary.ll.land` or `anniversary.ll.land/2026/`.
2. **Confirm the facts** in `src/data/anniversary.ts`: dates (`event.dates.status: 'confirmed'`), programme, people,
   registration URL and prices.
3. **Clear the photographs** (see `ASSETS.md`), or set `site.showAssetLabels: false` to launch with clean fallback panels.
4. Set `site.indexable: true`, rebuild, run `node scripts/og-image.mjs`, rebuild again, and run `npm test`.

## Production options

The output is a static folder (`dist/`) with no server code, no environment secrets, and no database.

**A. SiteGround (where anniversary.ll.land already points).** Build with the defaults and upload `dist/` to the
domain's document root (SFTP or SiteGround File Manager), after step 1 above.

```bash
cd anniversary-2027 && npm install && npm run build
```

**B. Netlify.** A new site with **Base directory** `anniversary-2027` (the folder's `netlify.toml` sets the build command
and `dist`). Then point `anniversary.ll.land` at it with a DNS CNAME at the ll.land DNS provider. This moves the domain
away from SiteGround, so step 1 must come first.

**C. GitHub Pages (custom domain).** Pages serves one custom domain per repository, and this repository's Pages
site is liberlandlimited.com, so this option needs a separate repository mirroring this folder. That is how fasto.ll.land
works (`michalptacnik/fasto`).

## Environment variables (build time only)

| Variable | Default | Use |
| --- | --- | --- |
| `BASE_PATH` | `/` | URL path the site is served under. Must start and end with `/` (preview: `/anniversary/`) |
| `SITE_URL` | `site.url` in `anniversary.ts` (`https://anniversary.ll.land/`) | Canonical, `og:url` and `og:image` base for a preview deployment |
| `VITE_REFERENCE_IMAGES` | unset | `1` builds the local design-review version with uncleared photographs. **Never deploy that build** |

## Recommended response headers (any host)

`Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; frame-ancestors 'none'`.
Inline `style` attributes are used for a few layout tweaks, and the JSON-LD is a non-executing data block.
Add long-lived caching for `/assets/*` (the file names are content-hashed).
