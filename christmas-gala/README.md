# Liberland Grand Christmas Gala 2026

Landing page for the Liberland Grand Christmas Gala 2026, built from the approved Claude Design
("Palace & Ledger", developer handoff v1, 30 Oct 2026).

- **Test preview:** https://liberlandlimited.com/christmas/ (served `noindex` until launch)
- **Stack:** Vite + React 18 + TypeScript. The page is prerendered to static HTML at build time and
  hydrated in the browser, so the content, headings and links are there without JavaScript.
- **Styling:** `src/styles/gala.css` is a direct port of the design's stylesheet (container queries
  on `.gala`, tokens on `.gala`). `src/styles/additions.css` holds production additions and fixes.
  Tailwind was not used: re-expressing the approved stylesheet as utilities would only add room
  for drift from the design.
- **Motion:** CSS only (hero entrance, scroll-linked reveals, turning rings, two-layer snow) plus a
  few lines of JS for the hero parallax and the nav scroll-spy. No animation library or WebGL.
  `prefers-reduced-motion` switches all of it off.
- **Fonts:** Cormorant Garamond, Archivo and IBM Plex Mono, self-hosted from `@fontsource`
  (SIL OFL 1.1). The page makes no third-party requests.

## Everything editable is in one file

**`src/data/event.ts`** contains every date, name, status, link and paragraph on the page. It is
commented for non-programmers. After an edit, run `npm run build` (or push to `master`; the deploy
workflow builds the page). If a value is mistyped, the build stops with a plain-English message.

### Confirm the date

```ts
date: {
  iso: '2026-12-19',          // YYYY-MM-DD
  status: 'confirmed',        // was 'tentative'
  startTime: '18:00',         // optional, 24 h Prague time, or null
  endTime: null,
```

While `status` is `'tentative'`, every place that shows the date also says "Proposed · not yet
confirmed", and no Event structured data is published. Once it is `'confirmed'`, the markers go
away, the introduction's closing paragraph changes, and `schema.org/Event` JSON-LD is added to
the page head automatically. The weekday is worked out from the date.

### Add, change or confirm a guest

Guests are in `guests.featured`. To confirm a guest, change `status: 'anticipated'` to
`status: 'confirmed'`, but **only after written confirmation and approval of the wording**.
Until then the card shows "Anticipated · subject to confirmation".

Portraits are optional. Put a rights-cleared 4:5 image (at least 800 × 1000, ideally `.webp`) in
`public/images/` and set `portrait: 'images/your-file.webp'`. You also have to set
`portraitCredit`, or the build refuses. With no portrait, the designed monogram placeholder is shown.

To add a guest, copy the `{ … }` block of an existing guest and edit it. The dashed
"to be announced" tiles are `guests.slots`; remove them as the line-up fills.

### Open registration

There is deliberately **no form** on the page: nothing collects personal data. When an authorised
registration system exists (ticketing provider, organiser's own page):

```ts
registration: {
  status: 'open',                                  // was 'coming-soon'
  url: 'https://tickets.example.org/liberland-gala', // the official page, https only
  openLabel: 'Register now',
```

Every call to action on the page (nav, hero, mobile menu, finale) then goes straight to that URL,
and the registration card and information table say that registration is open. Set
`status: 'closed'` afterwards. If the organisers want an interest list hosted on this site
instead, that needs a backend, a published privacy notice and double opt-in first (see the
design's handoff notes). Do not add a form without those.

### Venue photographs

`venue.photos` holds three slots: exterior, interior and Artista. They show designed
"Photograph pending" sketches until a licensed image is supplied. Add a file to `public/images/`,
then set `src`, `alt` and `credit`. **Do not use hotel photography without Le Palais's written
permission**, and never substitute generated "interiors".

### Launch checklist

1. Set `site.indexable: true` (removes `noindex`) and check `site.url`.
2. Replace the introduction copy with the official announcement text if it differs
   (`editorial.introParagraphs`).
3. Fill `practical.dressCode` and `practical.contact` (shown as "pending" while `null`).
4. Regenerate the social image if the hero changed: `npm run build && node scripts/og-image.mjs`,
   then build again.

## Commands

```bash
npm install
npm run dev          # http://localhost:5173/christmas/
npm run build        # typecheck + client build + prerender → dist/
npm run preview      # serve dist/ at http://localhost:4173/christmas/
npm test             # end-to-end checks against dist/ (needs Playwright + Chromium)
npm test -- --shots  # also writes full-page screenshots to tests/screenshots/
```

`npm test` checks: no horizontal overflow or clipped labels at 320–2560 px; header and hero fit;
one `h1` and no skipped heading levels; every anchor has a target; no broken images, failed or
third-party requests; no console errors; skip link and mobile menu (Escape closes it); reduced
motion; and the integrity rules (tentative date marked, no Event JSON-LD, no confirmed guest, no
form, `noindex`).

The build uses base path `/christmas/`. For another location: `BASE_PATH=/ npm run build`.

## Deployment

`.github/workflows/deploy-pages.yml` builds this folder and publishes `dist/` at
`liberlandlimited.com/christmas/` with the rest of the site. Nothing else is deployed, and no
payment, analytics or data collection is active.

## Assets

See [`ASSETS.md`](ASSETS.md) for provenance, licences and what is still missing.

## Unconfirmed content (as of 30 Oct 2026)

| Item | State on the page |
| --- | --- |
| Date, Saturday 19 December 2026 | "Proposed · not yet confirmed" everywhere |
| Roger Ver | "Anticipated · subject to confirmation"; bio needs his approval; no portrait |
| Other speakers, hosts, panellists | Dashed "to be announced" slots |
| Programme formats, running order, times | "To be announced" |
| Liberland Blockchain V2 | Described as *planned*, presentation *anticipated*, release timing not announced. Technical team to review the wording |
| LLM copy | Technical team to review |
| Registration, admission, tickets | "Registration details coming soon"; no form |
| Dress code, event contact, travel guidance, room block | Marked pending |
| Introduction copy | Drafted from the brief. The announcement article was not supplied, so replace it if the official text differs |
| Venue facts (five-star, 72 rooms, Marold ceilings, Artista, spa/sauna/fitness, phone) | Checked against lepalaishotel.eu on 30 Oct 2026 |
