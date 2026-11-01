# Liberland 12th Anniversary 2027

Event website for the Liberland 12th Anniversary, planned for **9–12 April 2027** (provisional) at **Ark Village,
Mirni Dunav 3, 25260 Apatin, Serbia**. Intended address: **https://anniversary.ll.land/**.

- **Design:** the approved Claude Design prototype "The Spring Republic". This is the Liberland Design System
  (State Design Language v2) with a spring-on-the-Danube event palette. Class names and CSS are ported from the
  prototype with the handoff's one change: container queries become media queries at the same thresholds
  (≤1100px tablet, ≤640px mobile). All styling is in `src/styles/anniversary.css`.
- **Stack:** Vite + React 18 + TypeScript, prerendered to static HTML and hydrated. No forms, no analytics,
  no cookies, no third-party requests. Fonts are self-hosted.
- **Not deployed.** See [DEPLOYMENT.md](DEPLOYMENT.md).

## Page sequence (as designed)

1. **Hero:** the "Liberland / 12th Anniversary" invitation with the XII medallion, the dates, the venue and
   the founding date.
2. **Twelve years:** the founding on 13 April 2015, with a fact strip.
3. **The experience:** celebration, ideas, people and the Danube.
4. **The programme:** four days as accessible tabs (arrow keys, Home, End). Every item shows "Time TBC" and "Provisional".
5. **Featured faces:** filter chips by participation status. Nobody is shown as confirmed.
6. **Ark Village:** a photo mosaic, facilities, and the address strip.
7. **The gala:** Saturday evening, provisional.
8. **The story so far:** a timeline from 2015 to 2027, with its source and the disputed-status note.
9. **Plan your visit:** address, directions, accommodation, travel, the Serbia/Gornja Siga notice, and the FAQ.
10. **Registration:** "Registration details coming soon." with a disabled Register button and categories in preparation.
11. **Final invitation** and **footer**.

## Everything editable is in `src/data/anniversary.ts`

The file is commented for non-programmers. After an edit, run `npm run build`. If a value is mistyped, the build
stops with a plain-English message (`src/lib/validate.ts`).

| To… | Change |
| --- | --- |
| Confirm the dates | Set `event.dates.status: 'confirmed'`. This removes every "Provisional dates" tag and publishes `schema.org/Event` data |
| Move the dates | `event.dates.start` / `end` (ISO). Weekdays, "9–12 April 2027", and the 13 April footnote are computed |
| Set session times | Each session's `start` / `end` (`'14:00'`). `null` shows "Time TBC" |
| Confirm a session | `status: 'confirmed'`. `'cancelled'` hides it |
| Name a speaker on a session | Add the person's id to `speakerIds`. Their status must be `'speaker'`, or the build refuses |
| Confirm a person | `status: 'speaker'` or `'guest'`, **only with written confirmation for 2027** |
| Add a person | Add an entry to `people` with a `portrait` (use `file: null` until a cleared portrait exists) |
| Open registration | `registration.status: 'open'` and `registration.url: 'https://…'` (the authorised booking page) |
| Publish prices | Each tier's `price` (e.g. `'€120'`), only once approved |
| Publish a photograph | See [ASSETS.md](ASSETS.md): `python3 scripts/photos.py --publish <name>`, then `cleared: true` |
| Hide the slot labels | `site.showAssetLabels: false` (photo slots still waiting for an image become clean panels) |
| Allow search indexing | `site.indexable: true` (at launch) |

The historical founding date (`event.founding.date`, 13 April 2015) is a separate fact from the event dates, and
the build refuses any change to it.

## Photographs: what is published

| Build | Photos shown |
| --- | --- |
| **Production** (`npm run build`) | Only cleared photographs: currently the CC BY-SA portrait of Vít Jedlička. Every other slot shows the design's labelled, art-directed fallback |
| **Reference** (`npm run build:reference`) | The Ark Village photographs identified on ark.ll.land, and the two Congress portrait crops. Each is tagged "Reference image · not cleared for publication". For design review on your own machine only |

```bash
python3 scripts/photos.py        # downloads and optimises reference photos → public/_reference/ (git-ignored)
```
```bash
npm run dev:reference            # or: npm run build:reference && npm run preview
```

The prerender step deletes `dist/_reference` from every non-reference build.

## Commands

```bash
npm install
```
```bash
npm run dev            # http://localhost:5173/
```
```bash
npm run build          # typecheck + validate data + build + prerender → dist/
```
```bash
npm test               # end-to-end checks against dist/ (Playwright + Chromium)
```
```bash
npm test -- --shots    # also writes full-page screenshots (375/768/1440) to tests/screenshots/
```
```bash
node scripts/og-image.mjs   # regenerate public/og-image.jpg after changing dates (then build again)
```

`npm test` checks the following:
- **Layout:** no horizontal overflow from 320 to 2560 px, the hero title fits, and controls are large enough.
- **Mobile menu:** it opens, Escape closes it, focus returns, and choosing a link closes it.
- **Structure:** one `h1`, no skipped heading levels, labelled sections, every anchor has a target, every image has `alt` and loads, and `noopener` on external links.
- **Network:** no console errors, no failed requests, no third-party requests.
- **Keyboard:** programme tabs (arrows, Home, End, roving tabindex), the FAQ accordion, faces filter chips, the skip link, and the yellow focus ring.
- **Reduced motion:** every animation stops.
- **Content integrity:** founding 13 April 2015 versus event 9–12 April 2027, Tuesday 13 April 2027, the address, the Serbia/Gornja Siga notice, "Registration details coming soon.", a disabled Register button, no prices, scarcity or forms, nobody marked as a confirmed speaker or guest, no `Event` structured data while dates are provisional, and the venue in `RS`.

## Motion

Taken from the design, and all off under `prefers-reduced-motion` or with `site.motion: false`:
- The medallion text ring and the gala ring field each turn once per 260 s.
- The hero sun glow breathes over 14 s (illustration only).
- Scroll reveals use a CSS-only `animation-timeline: view()`.
- In the gallery, the caption lifts and the image scales 1.02 on hover.
- The programme panel and FAQ answers fade in over 120 ms.

There is no audio and no autoplay.

## Deviations from the prototype (deliberate, minimal)

- **Mosaic rows can grow.** The "At Ark Village" list overflowed its fixed 260px grid row in the prototype.
- **Venue strip side bars removed.** Its 1px gap colour bled into the wrapper padding as olive bars.
- **Hero caption narrowed on phones.** The "photograph pending" caption ran under the medallion at 375px.
- **Extra accessibility markup.** A skip link, visually hidden "(opens in a new tab)" hints, FAQ headings and regions,
  and `aria-describedby` on the disabled Register button.
- **Page credits.** A photo credits line in the footer, shown only when a published photograph needs attribution.
