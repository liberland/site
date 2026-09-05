# Sites

Monorepo containing independent static sites, each deployed as its own Netlify site.

- `liberland-limited/` — Liberland Limited landing page and pitch deck.
- `new-site/` — placeholder for a second site (rename when its purpose is decided).
- `votula/` — Votula, Ltd., Liberland's blockchain and crypto branch. Eight pages plus a brand-language reference.

Each subdirectory is self-contained with its own `netlify.toml`. In Netlify, configure each site with **Base directory** set to the matching subfolder.

The GitHub Pages workflow at `.github/workflows/deploy-pages.yml` deploys `liberland-limited/` at the root, with `new-site/` at `/candidate` and `votula/` at `/votula`.

## Votula

No build step: vendored React 18 plus in-browser Babel, the same pattern as `liberland-limited/`. Pages are plain HTML shells that load shared `src/*.jsx` components; `styles.css` holds the design tokens.

```
cd votula
npx serve .        # any static server; do not use -s, this is a multi-page site
npm install && npm test   # Playwright: mount, chrome, links, mobile overflow
```

The design system is documented at `votula/brand.html`.

`votula/src/data.jsx` holds two separate blocks of facts, and the distinction matters:

- `CHAIN` — the protocol Votula operates. Every value is transcribed from the
  [`audit-freeze-2026-08-03`](https://github.com/Balazs091/Liberland-blockchain/releases/tag/audit-freeze-2026-08-03)
  release of the Liberland EVM repository (`docs/Protocol-Parameters.md`, `docs/Architecture.md`,
  `docs/Internal-Audit-Report.md`, `docs/Audit-Scope.md`). When the repository moves, re-transcribe here and
  nowhere else; `tests/site.spec.js` pins the tag so a silent drift fails the suite.
- `PLACEHOLDER` — illustrative property and grant-programme figures. Replace with audited values before launch.

The site states the protocol's real status throughout: frozen for external audit, internally evidenced, and not
approved for Ethereum mainnet launch. Do not soften that copy without a release that changes it.
