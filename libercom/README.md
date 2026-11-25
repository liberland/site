# LiberCom — Liberland mobile connectivity, in partnership with Atli

One landing page: **Stay connected. Wherever freedom takes you.** It sends visitors to Atli's eSIM
platform with two Liberland offers and embeds Atli's plan finder. LiberCom is a promotional gateway, not
a network operator: plans, checkout, eSIM delivery and support are Atli's.

- Preview: `https://liberlandlimited.com/mobile/` (once merged to `master`, see Deployment)
- Future home: `https://libercom.ll.land/`

Plain static files, no build step: `index.html`, `styles.css`, `app.js` and **`config.js`**. Every path is
relative, so the same files work at `/mobile/` and at the root of a domain.

## Configuration — `config.js`

All codes, links and launch states are in `config.js`. `index.html` and `app.js` contain none of them,
and a test fails if one is copied there.

| Field | Now | What it controls |
| --- | --- | --- |
| `brand.name`, `brand.partnerName` | `LiberCom`, `Atli` | Wordmark and partner name in the header, hero and footer |
| `brand.partnerUrl`, `partnerTermsUrl`, `partnerPrivacyUrl`, `liberlandUrl` | heyatli.com, /terms, /privacy, liberland.org | Footer links |
| `globalPlus.productUrl` | `https://heyatli.com/esim-global-plus` | Global Plus button. The link is `productUrl?referral=<code>` |
| `globalPlus.code` | `LIBERLANDGLOBAL` | Code on the card, copy button and the link's `referral` parameter |
| `globalPlus.discountPercent` | `20` | "20% OFF", "Get Global Plus — 20% Off", the feature line |
| `globalPlus.dataGb`, `validityDays`, `destinations` | `30`, `365`, `113` | Plan facts on the card and the hero eSIM card |
| `citizenData.status` | `coming-soon` | `available` enables the 1 GB buttons, together with ↓ |
| `citizenData.redemptionUrl` | empty | Atli's citizen redemption link. Must be `https://` |
| `widget.scriptUrl`, `widget.cssUrl` | `embed.heyatli.com/embed.js`, `/themes/liberty.css` | The widget loader and Atli's "Liberty" theme |
| `widget.referral` | `LIBERLAND` | The widget's own referral code, separate from the Global Plus code |
| `widget.theme`, `themePriority` | `light`, `widget` | As in Atli's sample embed |
| `widget.fallbackAfterMs` | `15000` | How long the widget may stay silent in view before the fallback link shows |
| `site.basePath`, `previewUrl`, `productionUrl` | `/mobile/`, …, `https://libercom.ll.land/` | Reference only. The page uses relative paths |
| `site.canonicalUrl` | `null` | Set only when libercom.ll.land serves this site |

Common changes:

- **Atli changes the public code to `LIBERLAND`:** set `globalPlus.code: 'LIBERLAND'`. The link, card and
  copy button follow. Check first that heyatli.com treats it as a voucher (see below).
- **Atli sends the citizen link:** test it, then set `citizenData.redemptionUrl` and
  `citizenData.status: 'available'`. The hero and card buttons go live. The "Coming soon" panel disappears.
- **Different discount:** change `globalPlus.discountPercent`.

## What was verified, and how (25 Nov 2026)

- **Global Plus link** `https://heyatli.com/esim-global-plus?referral=LIBERLANDGLOBAL` answers 200. In a
  browser, heyatli.com stores the code as `{"code":"LIBERLANDGLOBAL","kind":"voucher"}` and shows
  "Code LIBERLANDGLOBAL will apply at checkout". The page lists a **30 GB · 365 days** plan and **113**
  destinations, matching the card.
- **Not verified:** that the discount is 20%. That only shows at checkout, and no purchase was made. The
  banner also appears for any made-up code, so it proves nothing about the discount. The card asks
  visitors to check the discount at checkout before paying, and the page states no price.
- **The link opens Global Plus with a different plan pre-selected** (45 days · unlimited). Visitors must pick
  the 30 GB · 365 days plan. The fine print under the button says so. A deep link to that plan would be better
  (see Outstanding).
- **`LIBERLAND` vs `LIBERLANDGLOBAL`:** heyatli.com stores `LIBERLAND` as `"kind":"referral"`, the same as an
  invented code, and `LIBERLANDGLOBAL` as `"kind":"voucher"`. They are not interchangeable today, so the
  page keeps them apart.
- **Widget:** the real `embed.js` loads once and mounts one sandboxed iframe at
  `https://embed.heyatli.com/embed/?theme=light&theme_priority=widget&referral=LIBERLAND&css=…liberty.css`.
  The iframe renders Atli's plan list with the `LIBERLAND` banner, resizes itself, and fits phone widths.
  When the script fails or stays silent, a link to `https://heyatli.com/?referral=LIBERLAND` replaces it.
- **Atli terms and privacy:** `https://heyatli.com/terms` and `https://heyatli.com/privacy` answer 200.

## Assets

| File | Source |
| --- | --- |
| `assets/shield-64.webp`, `shield-160.webp`, `favicon-32.png`, `apple-touch-icon.png` | Copied from `anniversary-2027/`, rasterised from the official [Liberland_Shield.svg](https://raw.githubusercontent.com/liberland/docs/master/media/Liberland_Shield.svg) |
| `assets/atli-logo-on-dark.svg` | Atli media kit (atlitravel.notion.site), "Atli Horizontal - Light.svg", unmodified |
| `assets/fonts/*` | Playfair Display and Archivo, copied from `build-what-was-removed/fonts` (SIL OFL 1.1) |

The globe is an original inline SVG. The page loads no third-party resources except Atli's widget.

## Run and test

```bash
cd libercom
npm start                 # http://localhost:3747/mobile/ (also served at /)
npm install && npm test   # Playwright, desktop + Pixel 7
```

`tests/server.js` acts like GitHub Pages: `/mobile` redirects to `/mobile/`, and missing files return 404s.
The suite checks:

- assets under the base path and at a domain root
- the Global Plus link, code and `rel` attributes
- that a code change propagates everywhere
- the copy button
- the citizen states: default, invalid URLs and live
- the widget fallback when it is blocked or silent
- the real widget: loads once, correct parameters, fits the screen
- outbound links, keyboard access and reduced motion
- an axe accessibility audit

`OFFLINE=1 npm test` skips the one networked test.

## Deployment

`.github/workflows/deploy-pages.yml` copies this folder to `/mobile` (`cp -r libercom _site/mobile`). That
workflow runs on pushes to `master` (and two older listed branches), so **merging to `master` publishes
`/mobile`**. Nothing is deployed from feature branches.

## Launch checklist (moving to libercom.ll.land)

1. Point `libercom.ll.land` at a host serving this folder, the same way as the other `*.ll.land` sites.
   DNS is not touched here.
2. In `config.js`, set `site.canonicalUrl: 'https://libercom.ll.land/'`.
3. In `index.html`, remove `<meta name="robots" content="noindex, follow">`. Optionally add
   `og:url`/`og:image` with absolute URLs.
4. Turn `/mobile` into a redirect, as the workflow already does for `/christmas` and `/fasto`.
5. Update the visa.liberland.org link (see `VISA-INTEGRATION.md`).

## Outstanding — needed from Atli

1. **Citizen 1 GB redemption link**, and how eligibility is checked (on Atli's side; this page collects nothing).
2. **Final public code:** `LIBERLANDGLOBAL` or `LIBERLAND`. If `LIBERLAND`, confirm that it carries the
   20% voucher. Today heyatli.com classes it as a plain referral.
3. **Written confirmation that `LIBERLANDGLOBAL` gives 20% off** the 30 GB · 365-day plan. Optionally, a deep
   link that pre-selects that plan.
4. **Confirmation that the widget referral `LIBERLAND` is intended.** Optionally, a widget `destination`
   that pre-selects Global Plus.
