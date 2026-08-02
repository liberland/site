# Build What Was Removed

The Gornja Siga Settlement Recovery Campaign — a public, evidence-based
fundraising and accountability site. See `ARCHITECTURE.md`,
`CONTENT-GUIDE.md`, `EVIDENCE-PUBLICATION-CHECKLIST.md`,
`DATA-DICTIONARY.md`, `LEGAL-REVIEW-CHECKLIST.md` and `DEPLOYMENT.md` before
changing content or publishing evidence.

**No live payment method is enabled.** See `LEGAL-REVIEW-CHECKLIST.md` for
what must happen before this site is used for real fundraising.

## Stack

Static, no-bundler site matching this monorepo's existing convention (see
`../liberland-limited` and `../new-site`): plain React + ReactDOM + Babel
standalone loaded from `vendor/`, `<script type="text/babel">` component
files, no build step. Routing is client-side and hash-based
(`#/incidents/GS-2023-09-21`), so the site works unmodified whether it's
deployed as its own Netlify site (base directory = this folder) or mounted
at a subpath on another static host — no server-side rewrites required.

The handoff document's own technology section asked for Next.js App
Router / TypeScript / Zod / shadcn. That stack was not used here because it
doesn't match how this repository actually ships sites — see
`ARCHITECTURE.md` for the reasoning and the migration path if this project
later needs a real backend (submissions, payments, CMS-backed content).

## Local development

No build step. Serve the folder statically:

```
npx serve . -l 3738 -s
```

Then open `http://localhost:3738/`.

## Tests

```
npm test        # unit tests for the metrics/aggregation logic (node:test)
npm run test:e2e  # Playwright end-to-end tests
```

The unit tests specifically assert the two invariants required by the
handoff document: a temporary seizure never inflates the claimed
permanent-loss metric, and an unverified item can never enter an aggregate
total.

## Deployment

See `DEPLOYMENT.md`. In production this folder is meant to be its own
Netlify site (`netlify.toml` already sets `publish = "."`, no build
command), matching `liberland-limited/` and `new-site/`. It is currently
also published read-only at `/build-what-was-removed/` in this repo's
GitHub Pages preview for review before a dedicated Netlify site exists.
