# Sites

Monorepo containing two independent static sites, each deployed as its own Netlify site.

- `liberland-limited/` — Liberland Limited landing page and pitch deck.
- `new-site/` — placeholder for a second site (rename when its purpose is decided).

Each subdirectory is self-contained with its own `netlify.toml`. In Netlify, configure each site with **Base directory** set to the matching subfolder.

The GitHub Pages workflow at `.github/workflows/deploy-pages.yml` deploys `liberland-limited/` only.
