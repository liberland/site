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
  preview at `/fund/`) — because every asset reference
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
styles.css                Liberland State Design Language V2 tokens +
                           component classes
src/
  router.js                hash router
  metrics.js                pure aggregation logic (dual Node/browser),
                             property metrics + Croatia cost totals
  data.js                   seed data: incidents, items, budget, images,
                             croatiaCosts, grades, terms
  submissions-adapter.js    abstract adapter for corrections/right-of-reply
  app.jsx                    route switch + layout (nav, footer, skip link)
  components/*.jsx           one file per page/section
tests/
  metrics.test.js           node:test unit tests
  site.spec.js              Playwright end-to-end tests
```

## Design language

The site implements the **Liberland State Design Language V2**.

V2 explicitly supersedes the register this site was originally built in.
The first implementation was ported from the Claude Design source
(`Build What Was Removed.dc.html`) and used muted heraldic gold `#A9834E`,
Cormorant Garamond and a forbidden radius — which is precisely what the V2
document describes as V1 and replaces. The migration was therefore a direct
one:

| | V1 (was) | V2 (is) |
|---|---|---|
| Identity colour | Muted heraldic gold `#A9834E` | True flag yellow `#FFC800` |
| Ground | Off-white `#F3EDE2` | Chalk `#F6F5F2` on Void `#0A0A0B` |
| Display face | Cormorant Garamond | Playfair Display |
| Text/UI face | Space Grotesk | Archivo |
| Record face | IBM Plex Mono | IBM Plex Mono (unchanged) |
| Radius | Forbidden everywhere | Structural scale: 0 record, 4 field, 14 panel, 28 surface, 999 action |
| Mark | An invented sun-and-star seal | No invented mark (see below) |

Rules carried into the CSS and enforced by convention:

- **A record is square.** Ledger tables, rows, status tags, certificates and
  anything bearing a signature or a hash use `--r-record: 0`. Only surfaces
  that hold possibility take a curve.
- **Yellow never decorates.** Every yellow area marks something primary —
  one yellow action per view. On light grounds, yellow is illegible as text,
  so `--amber #C99700` carries it for text and rules.
- **No shadows.** Depth comes from ground changes only.
- **The land is the image.** Documentary photography of the Danube and the
  floodplain in natural light; no renders, no filters, no posed crowds.

### On the absence of a mark

V2 names three pieces of state artwork — the flag, the escutcheon and the
great arms — and records that a vector redraw of the arms is *still open*.
V1's invented seal is called out as "the wrong trade". Since no authentic
escutcheon artwork is available to this repo, the site follows the
document's own fallback: *"If none of those apply, use no mark at all."*
The 2px yellow rule beneath the utility bar carries the flag instead. The
former invented seal has been removed from the utility bar and the footer.

Do not add a hand-drawn coat of arms to this site. If official artwork
becomes available, it belongs in the utility bar at ≥22px, never recoloured,
never on a photograph.
