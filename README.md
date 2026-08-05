# Sites

Monorepo containing independent static sites, each deployed as its own Netlify site.

- `liberland-limited/` — Liberland Limited landing page and pitch deck.
- `new-site/` — placeholder for a second site (rename when its purpose is decided).
- `build-what-was-removed/` — the Gornja Siga Settlement Recovery Campaign. See its own `README.md` before touching content; it makes attributed allegations against named public authorities under strict editorial and evidence-publication rules.

Each subdirectory is self-contained with its own `netlify.toml`. In Netlify, configure each site with **Base directory** set to the matching subfolder.

The GitHub Pages workflow at `.github/workflows/deploy-pages.yml` deploys `liberland-limited/` at the root, `new-site/` at `/candidate/`, and `build-what-was-removed/` at `/build-what-was-removed/` — a preview surface for sites that don't yet have their own Netlify site.
