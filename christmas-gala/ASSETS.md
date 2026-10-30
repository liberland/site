# Asset manifest

Every file shipped with the page, where it came from, and its licence. Nothing is hotlinked; the
page makes no third-party requests.

| File | Source | Licence / rights | Status |
| --- | --- | --- | --- |
| `src/assets/liberland-escutcheon-52.{png,webp}`, `-128.{png,webp}` | `liberland-escutcheon-256.png` from the approved Claude Design bundle (copied there from the Liberland Design System). Original national symbols: [github.com/liberland/assets](https://github.com/liberland/assets). Resized only; proportions and colours unchanged. | liberland/assets is CC0-1.0 ("(c) 2015 Liberland … CC0 Universal") | In use: nav mark (26 px), finale mark (64 px) |
| `public/favicon-32.png`, `public/apple-touch-icon.png` | Same escutcheon, centred (apple-touch on navy `#090F1C`) | CC0-1.0 | In use |
| `public/og-image.jpg` (1200×630) | Screenshot of this page's own hero, made by `scripts/og-image.mjs` | Original work | In use |
| Hero façade, pillar drawings, venue sketches, chandelier, finale rings (`src/components/Art.tsx`) | Original inline SVG from the approved design. The façade is labelled on the page as "illustrative … not a photograph of the venue" | Original work for Liberland; no third-party rights | In use |
| Fonts: Cormorant Garamond, Archivo, IBM Plex Mono | npm `@fontsource/*` packages (bundled at build, latin + latin-ext subsets) | SIL Open Font License 1.1 | In use |

## Missing — placeholders shown on the page

| Asset | Placeholder | What is needed |
| --- | --- | --- |
| Venue exterior photo | "Photograph pending · Exterior" sketch | Written permission from Le Palais Art Hotel Prague. Design candidate: the hotel's slide image `le_palais_slide_01.jpg` on lepalaishotel.eu. Store locally in `public/images/`, don't hotlink |
| Venue interior photo (Marold ceilings) | "Photograph pending · Interior" | As above, or the hotel's press kit |
| Artista restaurant photo | "Photograph pending · Artista" | As above |
| Roger Ver portrait | "RV" monogram + "portrait pending" note | A photo from the guest or a licensed source with publication rights, after his attendance is confirmed |

Image specs: WebP (AVIF optional) at about 2× display size. Exterior about 1600×1280 (shown
8 columns × 640 px on desktop, 4:5 on mobile), sub-photos about 800×620, portrait 800×1000 (4:5).
Photos are drawn with `object-fit: cover` and lazy-loaded.
