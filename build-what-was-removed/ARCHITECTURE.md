# Architecture

## Why not Next.js / TypeScript / Zod, as the handoff document specified

The handoff document's implementation prompt asked for a Next.js App
Router site with TypeScript, Zod schemas, shadcn/ui, Vitest and Playwright.
That stack does not exist anywhere in this repository. This monorepo's
actual convention (`liberland-limited/`, `new-site/`) is: no bundler, no
framework build step, plain `React`/`ReactDOM` global scripts loaded from
`vendor/`, JSX authored directly in `<script type="text/babel">` files
transformed in-browser, deployed as a static folder to its own Netlify
site. Introducing Next.js for a third site in a monorepo that otherwise has
none would mean a different deploy pipeline, a different local dev
workflow, and a different mental model for anyone maintaining all three
sites. This implementation follows the existing convention instead, and
reproduces the handoff document's content, information architecture,
data model, metric rules and safeguards exactly — only the build tooling
differs.

If this project later needs a real backend (a database-backed ledger,
authenticated corrections review, live payments), the natural migration
path is:

1. `src/data.js` → replaced by API calls (its incidents/items/budget shape
   is already the target JSON shape, so this is additive, not a rewrite).
2. `src/metrics.js` → unchanged; it's pure functions with no DOM or
   framework dependency, and already has unit test coverage.
3. `src/submissions-adapter.js` → replaced by a real adapter (email,
   serverless function, or database) implementing the same
   `submit(kind, payload) -> { id, receivedAt }` interface.
4. The JSX components could move into a Next.js app largely as-is; the
   inline-style/className mix would need consolidating, but the component
   boundaries and data flow already match a typical React app.

## Routing

`src/router.js` implements a minimal hash-based router
(`#/ledger`, `#/incidents/:id`, `#/case`, `#/evidence`, `#/fund`,
`#/updates`, `#/right-of-reply`, `#/legal[/:section]`). Hash routing was
chosen deliberately over `history.pushState` with real paths:

- It requires no server-side rewrite rule. A path-based router needs the
  host to serve `index.html` for every nested path (Netlify's `_redirects`
  can do this, but GitHub Pages cannot without a 404.html redirect hack).
- It works identically regardless of where the document is mounted — at a
  domain root (a dedicated Netlify site) or a subpath (a GitHub Pages
  preview at `/build-what-was-removed/`) — because every asset reference
  in `index.html` is relative to the document, not to a route.
- A user can still deep-link and reload any view
  (`#/incidents/GS-2023-09-21`) and get back to the same place, and ledger
  filters are still shareable (`#/ledger?status=...`).

The trade-off is that hash fragments are not sent to the server, so this
site does not get per-route server-side rendering or crawler-visible
distinct URLs without additional work (e.g. a prerendering step). For a
static evidence/fundraising site this was judged an acceptable trade-off
given the deployment-flexibility requirement.

## File layout

```
index.html               entry point, script/link tags in dependency order
styles.css                design tokens + component classes ported from the
                           Claude Design source (Build What Was Removed.dc.html)
src/
  router.js                hash router
  metrics.js                pure aggregation logic (dual Node/browser)
  data.js                   seed data: incidents, items, budget, grades, terms
  submissions-adapter.js    abstract adapter for corrections/right-of-reply
  app.jsx                    route switch + layout (nav, footer, skip link)
  components/*.jsx           one file per page/section
tests/
  metrics.test.js           node:test unit tests
  site.spec.js              Playwright end-to-end tests
```

## Design source

The visual design (charcoal `#17130F` / off-white `#F3EDE2` / gold accent
`#A9834E`; Cormorant Garamond + Space Grotesk + IBM Plex Mono) was ported
directly from the Claude Design project's `Build What Was Removed.dc.html`
component, including its exact copy, view structure and metric/business
logic (`data()`, `metrics()`, `filtered()`, `badge()` methods). The
`.dc.html` format is a design-tool preview format (custom `<x-dc>`,
`sc-for`/`sc-if` template markup, a `DCLogic` preview harness) not meant to
run standalone in production; this implementation is a faithful port of
its content and logic into real React components and CSS.
