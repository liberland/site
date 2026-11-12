# Deployment handoff — Liberland 12th Anniversary 2027

## Current state

| Where | What | Status |
| --- | --- | --- |
| **https://anniversary.ll.land/** | **The site's home.** Served from the mirror repository `michalptacnik/anniversary` on GitHub Pages, exactly like christmas.ll.land and fasto.ll.land | **Pending three manual steps (below).** Until they are done, the domain still shows the 2026 site on SiteGround |
| **https://liberlandlimited.com/anniversary/** | `.github/workflows/deploy-pages.yml` serves the full site here until anniversary.ll.land answers `/version.txt` with a commit hash. After that, this path becomes a redirect to anniversary.ll.land automatically | Live (preview, `noindex`) |

## Moving anniversary.ll.land to the new site

The repository side is ready. These three steps need GitHub and DNS access:

1. **Archive the 2026 site.** anniversary.ll.land currently points to SiteGround (35.214.195.209). Before changing DNS,
   take a full backup there (Site Tools → Backups, or files + database export). Also make a static copy, e.g.
   `wget --mirror --page-requisites --convert-links https://anniversary.ll.land/`. Decide whether it stays reachable,
   for example at `2026.anniversary.ll.land`.
2. **Create the mirror repository** `michalptacnik/anniversary` (public, like `michalptacnik/christmas`):
   - Add [`deploy/mirror-deploy.yml`](deploy/mirror-deploy.yml) as `.github/workflows/deploy.yml`, and a `CNAME`
     file containing `anniversary.ll.land`.
   - Settings → Pages → Source: **GitHub Actions**. Custom domain: `anniversary.ll.land`.
   - Actions → *Deploy anniversary.ll.land* → **Run workflow**, once.

   From then on it checks `anniversary-2027/` on `master` every 5 minutes and redeploys on change. The deployed
   commit is in `/version.txt`.
3. **DNS:** at the ll.land DNS provider, replace the `anniversary` A record (35.214.195.209) with a
   **CNAME `anniversary` → `michalptacnik.github.io`**, the same as `christmas` and `fasto`. Then, in
   Settings → Pages, tick **Enforce HTTPS** once the certificate has been issued (minutes to an hour).

Within about 5 minutes of the next push to `master` (or a manual run of *Deploy to GitHub Pages*),
liberlandlimited.com/anniversary/ turns into a redirect to anniversary.ll.land.

**Indexing:** the site is still `noindex` (`site.indexable: false` in `src/data/anniversary.ts`), because the dates
are provisional and ticket sales are not open. Set it to `true` when you want search engines to list it. The mirror
picks that up on its next run.

## Before the public launch

1. **Confirm the facts** in `src/data/anniversary.ts`: dates (`event.dates.status: 'confirmed'`), programme and people.
   Ticket sales are activated separately, in `src/config/ticketing.ts`; see [TICKETING.md](TICKETING.md) and
   [BACKEND.md](BACKEND.md).
2. **Confirm photo reuse** where ASSETS.md flags it (Ark Village operators; Drive photographer).
3. Set `site.indexable: true`, rebuild, run `node scripts/og-image.mjs`, rebuild again, and run `npm test`.

## Other hosting (if not GitHub Pages)

The output is a static folder (`dist/`) with no server code, no secrets and no database:

```bash
cd anniversary-2027 && npm install && npm run build
```

Upload `dist/` to any static host (SiteGround document root, Netlify with base directory `anniversary-2027`, etc.).
Note that GitHub Pages cannot send the CSP header below; a meta-tag CSP or a host with header support is needed for it.

## Environment variables (build time only)

| Variable | Default | Use |
| --- | --- | --- |
| `BASE_PATH` | `/` | URL path the site is served under. Must start and end with `/` (preview: `/anniversary/`) |
| `SITE_URL` | `site.url` in `anniversary.ts` (`https://anniversary.ll.land/`) | Canonical, `og:url` and `og:image` base. The preview sets `https://liberlandlimited.com/anniversary/`; the mirror uses the default |
| `VITE_REFERENCE_IMAGES` | unset | `1` builds the local design-review version with uncleared photographs. **Never deploy that build** |

## Recommended response headers (any host)

`Content-Security-Policy: default-src 'self'; img-src 'self' data: https://luma.com https://embed.lu.ma; style-src 'self' 'unsafe-inline' https://embed.lu.ma; script-src 'self' https://embed.lu.ma; frame-src https://luma.com; font-src 'self'; frame-ancestors 'none'`.
The Luma entries are needed only once ticket sales are live.
Inline `style` attributes are used for a few layout tweaks, and the JSON-LD is a non-executing data block.
Add long-lived caching for `/assets/*` (the file names are content-hashed).
