# Asset manifest — Liberland 12th Anniversary 2027

Every image and font used by the page, where it comes from, who owns it, and whether it is published.
Nothing is hotlinked. The page makes no third-party requests.

**Rule:** a photograph is published only when its entry in `src/data/anniversary.ts` has `cleared: true`.
Only set that flag when the organisers hold written permission. The build refuses `cleared: true` if
the file is missing, and `npm test` fails if `dist/_reference/` (uncleared photographs) is ever present.

## Published (committed, in the production build)

| File | Where on the page | Source | Owner | Licence / permission | Attribution |
| --- | --- | --- | --- | --- | --- |
| `public/images/vit-jedlicka-{400,800}.webp` | Featured faces, P-01 | [Vit Jedlicka by Gage Skidmore.jpg](https://commons.wikimedia.org/wiki/File:Vit_Jedlicka_by_Gage_Skidmore.jpg) (Wikimedia Commons). Cropped to 4:5 by `scripts/photos.py`, no other changes | Gage Skidmore | **CC BY-SA 3.0** | Required. Shown in the page footer. The crop is shared under the same licence |
| `src/assets/escutcheon-128.webp`, `public/favicon-32.png`, `public/apple-touch-icon.png` | Nav, medallion, final invitation, footer, favicon | MARK-01 from the approved design bundle (Liberland Design System). The national symbols are in [liberland/assets](https://github.com/liberland/assets) | Free Republic of Liberland | Cleared state mark (CC0-1.0 in liberland/assets) | None |
| `src/assets/flag-108.webp` | "Twelve years" fact strip | MARK-02 from the approved design bundle, rasterised from the system SVG | Free Republic of Liberland | Cleared state mark | None |
| `public/og-image.jpg` | Social preview (Open Graph / Twitter) | Rendered from the built page by `scripts/og-image.mjs` (medallion + dates) | Original work for this site | — | None |
| Hero illustration (inline SVG, ILL-01) | Hero, while IMG-01 is uncleared | Abstract river-horizon drawing from the approved design. **It does not depict the venue** | Original work | — | None |
| Fonts: Playfair Display, IBM Plex Mono | All display and record text | npm `@fontsource` packages, latin + latin-ext | Claus Eggers Sørensen / IBM | SIL Open Font License 1.1 | None |
| Font: Archivo (variable, wght 100–900) | All body text | `src/assets/fonts/*.woff2`: the exact files embedded in the approved design (Google Fonts, archivo v25) | The Archivo Project Authors | SIL Open Font License 1.1 | None |

## Identified, NOT published: Ark Village photographs

All of these come from the gallery at **https://ark.ll.land/** (page footer: "© 2026 Ark Village. All rights reserved.").
They are the venue's own photographs and match the design's slot briefs closely. They were not supplied to
this project with publication permission, so they appear **only in the local reference build** (`npm run dev:reference`),
each visibly tagged "Reference image · not cleared for publication".

To publish: obtain written permission from Ark Village / Visit Liberland (info@visit.ll.land). Then:

```bash
python3 scripts/photos.py --publish ark-a-frames ark-lodge-dusk   # …the approved names
```

Then set `cleared: true` on those entries in `src/data/anniversary.ts` and rebuild. Use the owner's preferred
credit wording in the entry's `credit` field; it is shown in the footer automatically.

| Slot | Name (`file`) | Where on the page | ark.ll.land image id | Size | Depicts |
| --- | --- | --- | --- | --- | --- |
| IMG-01 | `ark-pier-reflection` | Hero, full bleed | `abba1a49-6255-46bd-b4a5-aec6e1feabd7` | 2048×877 | Pier, barrel sauna and trees reflected in calm water. *Note: bright upper half; the design brief asks for a calm lower 40% for type. A spring photograph per the brief would be better* |
| IMG-02 | `ark-flag-beach` | Twelve years, large | `649e5d97-0598-4d39-a576-05dc75243f49` | 1600×1200 | Visitors with the Liberland flag on the riverbank beach, houseboat behind |
| IMG-04 | `ark-tables-under-trees` | Experience 01 "The celebration" | `d2928a34-89e3-461c-a399-fc2220a73b7c` | 2000×924 | Guests at long tables under the trees. *Not an anniversary ceremony; the alt text says only what is shown* |
| IMG-05 | `ark-canoe` | Experience 04 "The Danube experience" | `d654840e-1a90-4b73-af71-0796622accb2` | 2000×924 | Two people in a canoe, sheep on the far bank |
| IMG-06 | `ark-a-frames` | Ark mosaic, lead | `e2d15220-e0ae-4b22-b6ee-e25d5061302c` | 2000×857 | Row of A-frame cabins among trees |
| IMG-07 | `ark-lodge-dusk` | Ark mosaic, "Cottages and timber architecture" | `d434dd57-8bcb-4812-918c-1b7df3d7b5a1` | 2048×878 | Timber main lodge lit at dusk |
| IMG-08 | `ark-beach` | Ark mosaic, "The beach on the riverbank" | `c87f3878-1708-4c2d-be66-3b0ae5e7cd51` | 1600×686 | Yellow canoe on the sandy beach |
| IMG-09 | `ark-fire-circle` | Ark mosaic, "Gathering by the fire" | `f9970078-b8e8-4950-a2af-5c8388c11899` | 2000×924 | Evening campfire gathering |
| IMG-10 | `ark-paddleboard` | Ark mosaic, "Paddleboard and canoe" | `4dcddb24-d31d-4074-afe9-1b7fb98aa95e` | 1366×768 | Paddleboarder on still water |

Full-size image URL: `https://ark.ll.land/api/images/<id>`.

## Identified, NOT published: portraits

| Slot | Name | Source | Status |
| --- | --- | --- | --- |
| P-02 | `balazs-magyar` | Cropped from the official "8th Liberland Congress elected" graphic (Office of the President, 27 Sept 2026; also used, cropped, by `christmas-gala/`) | Reuse **not confirmed** by the press office, and only ~280 px wide. **Request an authorised 4:5 portrait (≥1000×1250)** |
| P-03 | `jan-schluter` | Same graphic | Same |

## Still required (no candidate image)

| Slot | Brief (from the design handoff) | Suggested source |
| --- | --- | --- |
| IMG-01 (better) | Ark Village in spring: wooden architecture, water, greenery, warm afternoon sun. Lower 40% calm for type. 16:9 → 3:4 crop, ≥2880×1800 | Organizer original |
| IMG-03 | Proclamation, 13 April 2015. 4:3, ≥1200×900 | Liberland archive. Confirm rights |
| IMG-04 (better) | Anniversary ceremony at a past edition, in daylight. 5:4, ≥1800×1440 | 2025/2026 event photographer. Confirm rights |
| IMG-11 | Past anniversary gala: warm light, formal dress. 4:5, ≥1600w | 2025/2026 event photographer |
| IMG-12 | Awards moment, past edition. 3:2, ≥1600w | 2025/2026 event photographer |

Photo rules from the design: natural light, no filters or duotone, horizon in the lower third, people at work
rather than posed. Never use AI-generated or stock imagery presented as Ark Village or as a real person.
