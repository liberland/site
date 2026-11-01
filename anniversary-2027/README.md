# Liberland 12th Anniversary 2027

Event website for the Liberland 12th Anniversary, planned for **9–12 April 2027** (provisional) at **Ark Village,
Mirni Dunav 3, 25260 Apatin, Serbia**. Intended address: **https://anniversary.ll.land/**.

- **Design:** "Liberland XII — a celebration on the Danube". The layout is light and warm and led by real photography: the
  2026 anniversary, the Liberland press kit and Ark Village's own pictures. The palette is ivory, spring green,
  evergreen and ceremonial gold, with an evening section for the gala. Playfair Display is used for headings and
  Archivo for reading. All styling is in `src/styles/anniversary.css` (breakpoints ≤1100px and ≤640px).
- **Stack:** Vite + React 18 + TypeScript, prerendered to static HTML and hydrated. No forms, no analytics,
  no cookies, no third-party requests. Fonts are self-hosted.
- **Not deployed.** See [DEPLOYMENT.md](DEPLOYMENT.md).

## Page sequence

1. **Hero:** a compact 43/57 composition. On the left are the shield, "Liberland / 12th Anniversary" (62px), the
   tagline, the dates and venue, the provisional note and one call to action. On the right is the 2026 anniversary
   group photograph with the small XII seal.
2. **Twelve years of Liberland:** the founding on 13 April 2015 beside a photograph of the President with guests.
3. **Join the Celebration (tickets):** an invitation card with the dates. It shows "Tickets on sale soon" until the
   Luma checkout is activated ([TICKETING.md](TICKETING.md)).
4. **The celebration:** three editorial features:
   - ideas and conversation (talk with the flag),
   - friends old and new (community dinner),
   - a wide Danube image (boat with the flag).
5. **The programme:** four day tabs (arrow keys, Home, End) and one schedule panel. Every item shows "Time TBC" and
   "Provisional".
6. **The people:** official round portraits of Vít Jedlička, Balázs Magyar and Jan Schlüter as featured community
   figures, then faces from the 2026 anniversary.
7. **Ark Village:** five photographs of the actual venue, the facilities, and the address bar.
8. **The anniversary gala:** an evening section with the 2026 Order of Merit ceremony photographs.
9. **Twelve years of history:** a compact timeline with the official badge. No invented archive photographs.
10. **Practical information:** address, directions, the Serbia/Gornja Siga notice, accommodation, travel and the FAQ.
11. **Final invitation:** the flag-on-the-beach photograph with the second ticket call-to-action.
12. **Footer:** with photo credits.

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
| Add a person | Add an entry to `people`. With `portrait: null` the person is shown as a typographic profile (never an empty frame) |
| Open ticket sales | `src/config/ticketing.ts`: the 2027 Luma event, ticket types, seller, policy links and approvals. See [TICKETING.md](TICKETING.md) |
| Add or swap a photograph | Add its source to `scripts/photos.py`, run `python3 scripts/photos.py --publish <name>`, then reference it in `photos` (see [ASSETS.md](ASSETS.md)) |
| Withdraw a photograph | Set its `cleared: false`. It disappears and the layout closes up around it |
| Allow search indexing | `site.indexable: true` (at launch) |

The historical founding date (`event.founding.date`, 13 April 2015) is a separate fact from the event dates, and
the build refuses any change to it.

## Photographs

All 19 photographs are real, local and credited. Sources and reuse status are in [ASSETS.md](ASSETS.md).

- **No placeholder state.** A photo component renders nothing when its photo is not cleared, and its section
  recomposes around the photos that remain.
- **Build checks.** The build refuses a missing file, a missing source or credit, and the same photograph used twice.
- **Test checks.** `npm test` audits the rendered page for placeholder wording, empty frames, broken images and
  repeated photos.

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
npm run test:tickets   # live-sales mechanics with a fake fixture event (see TICKETING.md)
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
- **Content integrity:** founding 13 April 2015 versus event 9–12 April 2027, Tuesday 13 April 2027, the address, the Serbia/Gornja Siga notice, "Tickets on sale soon" with no checkout widget or Luma script, no prices, scarcity or forms, nobody marked as a confirmed speaker or guest, no `Event` structured data while dates are provisional, and the venue in `RS`.
- **Zero placeholders:** no IMG-/P- codes or placeholder wording, no empty frames, at least 18 distinct photographs, none repeated, and captions present.
- **Hero size:** headline ≤64px at 1440px and 34–42px at 375px, and the hero fits within 85% of a 900px viewport.

## Motion

- The XII seal's text ring turns once per 240 s.
- Scroll reveals use a CSS-only `animation-timeline: view()`.
- The programme panel and FAQ answers fade in.

All of it stops under `prefers-reduced-motion` or with `site.motion: false`. There is no audio.
