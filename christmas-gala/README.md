# Liberland Grand Christmas Gala 2026 — "Christmas at Le Palais"

Landing page for the Liberland Grand Christmas Gala, Friday 18 December 2026, Le Palais Art Hotel Prague.

- **Preview:** https://liberlandlimited.com/christmas/ (served `noindex` until launch). Merging to `master` deploys it.
- **Stack:** Vite + React 18 + TypeScript, prerendered to static HTML and hydrated. No third-party requests,
  no analytics, no forms.
- **Design:** a Belle Époque Christmas invitation. Evergreen, burgundy, champagne gold and warm ivory.
  Cormorant Garamond for display type, Cinzel for engraved small capitals, Source Serif 4 for reading.
  The fonts are self-hosted (SIL OFL). All styling is in `src/styles/gala.css`.
- **Christmas ornamentation:** fir garlands, a wreath, baubles, holly and a velvet bow, drawn procedurally
  needle by needle by `scripts/ornaments/` and committed as WebP. This is original artwork with no
  third-party rights.

## Page sequence

1. The grand invitation (hero) is the Le Palais façade at dusk under a lit garland.
2. The Celebration is the editorial introduction, with an arched photograph of the hotel entrance.
3. The Programme is the planned 15:00 / 17:00 / evening schedule and the three themes.
4. Faces of the Evening shows medallion portraits. Attendance is shown only as configured.
5. Le Palais is a photographic mosaic with a lightbox (a swipeable carousel on phones).
6. The Christmas Evening shows the hotel's own Christmas photograph with hanging baubles.
7. Practical information is the information table and the registration card.
8. The final invitation is the wreath and closing call to action.

## Everything editable is in `src/data/event.ts`

The file is commented for non-programmers. After an edit, run `npm run build`, or merge to `master`.
A mistyped value stops the build with a plain-English message.

- **Date.** `date.iso` sets the day; the weekday is worked out automatically. Set `date.status` to
  `'confirmed'` or `'tentative'`. Confirmed publishes `schema.org/Event` data. Tentative shows "proposed"
  markers everywhere and withholds the structured data. It is currently `'confirmed'`, for Friday
  18 December 2026 at 15:00, as instructed.
- **Programme.** `programme.schedule` holds the times and items, and `programme.themes` the three
  themes. The page always says the schedule is planned until you change `programme.note`.
- **Faces.** `faces.people` sets each person's `attendance`:
  - `'featured'` makes no attendance claim.
  - `'programme'` means named in the planned programme.
  - `'anticipated'` means participation is to be confirmed.
  - `'confirmed'` must only be used after written confirmation.

  Each portrait needs a `credit`, which is shown in the footer.
- **Registration.** There is deliberately no form. Set `registration.url` to an authorised registration
  page and `registration.status` to `'open'`. Every call to action then points there.
- **Launch.** Set `site.indexable: true`.

## Hotel photography: what is published, and how to clear it

The design is built around Le Palais's own photography: the façade, entrance canopy, lobby, Marold
salon, corridor, library, Artista, staircase, and the hotel's own Christmas lobby photograph. These are
**© Le Palais Art Hotel Prague** and are **not yet cleared**. In `event.ts` every photo has
`cleared: false`.

- **Production build** (`npm run build`, the deployed page) contains **no hotel photographs**. Each
  slot shows a designed fallback instead: the wreath in the hero, a crest arch, a "photographs to
  follow" panel linking to the hotel's own gallery, and a festive evening scene.
- **Local reference build:** this shows the real photographs, each visibly tagged
  *"Reference image · not cleared for publication"*. It is for design review only.

  ```bash
  python3 scripts/reference-images.py   # downloads into public/_reference/ (git-ignored)
  ```
  ```bash
  npm run dev:reference                 # or: npm run build:reference && npm run preview
  ```

  The prerender step deletes `dist/_reference` from every non-reference build, and `npm test`
  fails if it is ever present.
- **When Le Palais grants written permission:** put each approved file in
  `public/images/venue/<id>.webp`, plus `<id>-800.webp` at 800px wide. Then set `cleared: true` for
  that photo. The ids and source files are listed in `ASSETS.md` and `scripts/reference-images.py`.
  Ask the hotel for larger originals if possible: the façade on its website is only 1200px wide.

## Portraits

`python3 scripts/portraits/build.py` downloads each portrait from its documented source, crops it,
applies the same warm grade, and writes `public/images/faces/*.webp` (560×560). To add a person,
add an entry there and in `faces.people`.

## Ornaments

```bash
python3 scripts/ornaments/generate.py   # SVG, deterministic seeds
```
```bash
node scripts/ornaments/render.mjs       # PNG (Playwright + Chromium)
```
```bash
python3 scripts/ornaments/encode.py     # WebP + light positions → src/assets/ornaments/
```

## Commands

```bash
npm install
```
```bash
npm run dev            # http://localhost:5173/christmas/
```
```bash
npm run build          # typecheck + build + prerender → dist/ (production: no hotel photos)
```
```bash
npm test               # end-to-end checks against dist/ (needs Playwright + Chromium)
```
```bash
npm test -- --shots    # also writes full-page screenshots to tests/screenshots/
```
```bash
node scripts/og-image.mjs   # regenerate the 1200×630 social image (after a production build)
```

`npm test` covers the following:
- **Layout:** no horizontal overflow or clipped labels from 320 to 2560px, the hero title and header fit, and touch targets are large enough.
- **Structure:** a single `h1`, no skipped heading levels, every anchor has a target, and every image has `alt` text and loads.
- **Network and errors:** no third-party requests and no console errors.
- **Interaction:** the skip link, the mobile menu (Escape closes it), and reduced motion.
- **Content integrity:** the new date everywhere and no trace of 19 December, Event JSON-LD present, the programme marked as planned, the V2 wording, the four faces with Roger Ver as anticipated and none marked confirmed, no form, no reference images, and `noindex`.

## Motion

- Gold shimmer on "Christmas".
- Twinkling garland lights.
- A light sweep across gold buttons.
- Swaying baubles.
- Fine snow, moved with a compositor-only transform.
- Fade-up reveals.
- A slow settle and parallax on the hero photograph.

`prefers-reduced-motion` turns all of it off. There is no audio.
