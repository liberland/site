# Sites

Monorepo containing independent static sites, each deployed as its own Netlify site.

- `liberland-limited/` — Liberland Limited landing page and pitch deck.
- `new-site/` — placeholder for a second site (rename when its purpose is decided).
- `votula/` — Votula, Ltd., Liberland's blockchain and crypto branch. Seven pages plus a brand-language reference.

Each subdirectory is self-contained with its own `netlify.toml`. In Netlify, configure each site with **Base directory** set to the matching subfolder.

The GitHub Pages workflow at `.github/workflows/deploy-pages.yml` deploys `liberland-limited/` at the root, with `new-site/` at `/candidate` and `votula/` at `/votula`.

## Votula

No build step: vendored React 18 plus in-browser Babel, the same pattern as `liberland-limited/`. Pages are plain HTML shells that load shared `src/*.jsx` components; `styles.css` holds the design tokens.

```
cd votula
npx serve .        # any static server; do not use -s, this is a multi-page site
npm install && npm test   # Playwright: mount, chrome, links, mobile overflow
```

The design system is documented at `votula/brand.html`. Illustrative figures live in one block at the top of `votula/src/data.jsx` — replace them with audited values before launch.
