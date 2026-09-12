# Foster What We Built

The Gornja Siga Settlement Campaign — a public, evidence-based
fundraising and accountability site for the existing, permanent Gornja Siga
settlement. See `ARCHITECTURE.md`,
`CONTENT-GUIDE.md`, `EVIDENCE-PUBLICATION-CHECKLIST.md`,
`DATA-DICTIONARY.md`, `COSTS-DATA-GUIDE.md`, `LEGAL-REVIEW-CHECKLIST.md` and
`DEPLOYMENT.md` before changing content or publishing evidence.

**No live payment method is enabled.** See `LEGAL-REVIEW-CHECKLIST.md` for
what must happen before this site is used for real fundraising.

**The Croatia cost ledger ships with no figures.** `#/costs` identifies six
cost structures and publishes none of them, because none has been sourced
yet. The headline total is empty by design and stays empty until an official
source carries a number — see `COSTS-DATA-GUIDE.md` for how to add one and
where to obtain it.

**Documentary images are third-party works.** Every photograph in
`Data.images` carries its author, licence and source page, rendered as a
credit line beneath the image. Do not add one without those fields, and do
not use a documentary photograph to illustrate an incident — evidence
imagery is held to `EVIDENCE-PUBLICATION-CHECKLIST.md` instead.

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

## Fonts

Playfair Display, Archivo and IBM Plex Mono are **self-hosted** in `fonts/`
(latin woff2 subsets, 156 KB total) and declared with `@font-face` at the
top of `styles.css`. There is no Google Fonts request.

This is deliberate on three counts: the V2 design language is carried almost
entirely by its typography, so a blocked or slow third-party request drops
the whole identity to Georgia and Helvetica; the site promises no
third-party analytics, and a font-CDN request hands every visitor's IP to a
third party on page load; and React is already vendored locally for the same
reason.

To update a weight, pull the file from the matching `@fontsource` package
and drop it in — the packages are not a runtime dependency:

```
npm install --no-save @fontsource/playfair-display @fontsource/archivo @fontsource/ibm-plex-mono
cp node_modules/@fontsource/archivo/files/archivo-latin-600-normal.woff2 fonts/
```

Adding a weight means adding its `@font-face` block too.

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
