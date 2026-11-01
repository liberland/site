# Asset manifest — Liberland 12th Anniversary 2027

Every image on the page, where it comes from, and its reuse status. All files are local (`public/images/`,
`src/assets/`). Nothing is hotlinked, and the page makes no third-party requests. `scripts/photos.py` rebuilds
every photograph from the source URLs below.

The organisers supplied these sources on 1 Nov 2026 as Liberland's own media (official press kit, the
official 11th-anniversary report, Ark Village's website and the project Drive) and directed their use on the
anniversary site. The status column records what is documented beyond that instruction.

## Photographs (19 on the page, none repeated)

| File (`public/images/`) | Section | Depicts (verified by inspection) | Source URL | Reuse status |
| --- | --- | --- | --- | --- |
| `a26-group-*` | Hero | Liberlanders with the Liberland flag. President Vít Jedlička shakes hands in front. | https://liberland-forum-uploads.s3.dualstack.eu-central-1.amazonaws.com/original/1X/a664c7743311d06a3c20b376ae6129015573d642.jpeg | Liberland's official 11th-anniversary report ([forum](https://forum.liberland.org/t/liberland-honors-its-brightest-stars-with-the-order-of-merit-at-its-11th-anniversary/1411)). Directed by organisers |
| `a26-honoured-*` | Twelve years | President Vít Jedlička with two guests, 11th-anniversary backdrop | …/4c246496562745a25dc3143da8e354028099d0f0.jpeg | Same |
| `a26-speaker-*` | People ("Last year's anniversary") | Panellist with microphone in an armchair | …/45bea2c5fa8f4ef42d4953a3cab403f2a053dec3.jpeg | Same |
| `a26-recipient-*` | People | Guest holding up a medal | …/18601085627985a864d2c8e07addf695ea482d57.jpeg | Same |
| `a26-awards-*` | Gala | Award at the "11 Liberland Anniversary" podium, in front of the Ark Village stone fireplace (the same interior as press-kit IMG_3898) | …/af091dad5c8ac00fa0855b6191fe7f605c3600cc.jpeg | Same |
| `a26-federico-*` | Gala | Federico Hu (identified by the organisers) in front of the 11th-anniversary backdrop. No 2027 participation implied | …/2921ba70e234ad066fcdb946e541b62c147931f4.jpeg | Same |
| `a26-formal-*` | Gala | Three guests at the ceremony, one with a microphone | …/dba98d36ba9248f3e1fe714fc0cd9ad24125dac3.jpeg | Same |
| `ark-conference-*` | Celebration | Audience at a talk in an Ark Village timber hall, with the Liberland flag | https://raw.githubusercontent.com/liberland/docs/master/media/IMG_4008.jpeg | Official Liberland press kit (docs.liberland.org/media/press-kit) |
| `ark-dinner-*` | Celebration | Guests dining inside the main wooden building. *Not labelled as a gala* | …/media/IMG_3938.jpeg | Press kit |
| `ark-lounge-*` | Ark Village | Timber-framed lounge with sofas and windows | …/media/IMG_3897.jpeg | Press kit |
| `ark-lawn-*` | Ark Village | Event lawn among trees, dome and festival canopy | …/media/IMG_3902.jpeg | Press kit |
| `danube-boat-*` | Celebration ("The Danube") | Aerial view of a boat with the Liberland flag on deck | https://ark.ll.land/hero-poster.webp | Ark Village website ("© Ark Village"). Directed by organisers; **written confirmation from the Ark Village operators recommended** |
| `ark-lodge-dusk-*` | Ark Village | Timber main lodge lit at dusk | https://ark.ll.land/api/images/d434dd57-8bcb-4812-918c-1b7df3d7b5a1 (gallery) | Same as above |
| `ark-a-frames-*` | Ark Village | Row of A-frame cabins | https://ark.ll.land/api/images/e2d15220-e0ae-4b22-b6ee-e25d5061302c | Same as above |
| `ark-flag-beach-*` | Registration / invitation | Visitors with the Liberland flag on the riverbank beach, houseboat behind | https://ark.ll.land/api/images/649e5d97-0598-4d39-a576-05dc75243f49 | Same as above |
| `ark-boardwalk-*` | Ark Village | Curving boardwalk to the floating barrel sauna | Project Google Drive, `ark.jpg` (id `17SV5VN86VKr123abTeIKtYwO1TnwLXDY`, owner vanyaremporium@gmail.com, July 2023) | Project archive. To rebuild, place it at `scripts/.cache/drive-ark.jpg` |
| `vit-jedlicka-*` | People | Official portrait | https://raw.githubusercontent.com/liberland/docs/master/media/vit-jedlicka.png | Official Liberland media repository |
| `balazs-magyar-*` | People | Round crop from the official "6th Liberland Congress elected" graphic, where he is named | https://pbs.twimg.com/media/HEv2KxdasAADi39.jpg ([post](https://x.com/Liberland_org/status/2038994526539317653)) | Official Liberland graphic. Source circle is about 390 px; it is used at 176 px |
| `jan-schluter-*` | People | Round crop from the official "8th Liberland Congress elected" graphic, where he is named | [Congress results](https://liberland.org/news/801-official-announcement-congressional-election-results) graphic on cdn.liberland.org | Official Liberland graphic. Source circle is about 410 px |

Captions say only what is known. Photos from the 2026 report say "11th anniversary, April 2026". Ark Village
photos carry no date or event claim. The awards photo is placed at Ark Village because the fireplace matches
press-kit IMG_3898.

## Brand

| File | Source | Notes |
| --- | --- | --- |
| `src/assets/shield-160.webp`, `shield-64.webp`, `public/favicon-32.png`, `public/apple-touch-icon.png` | [Liberland_Shield.svg](https://raw.githubusercontent.com/liberland/docs/master/media/Liberland_Shield.svg) | Rasterised unchanged (the 1 MB SVG is too heavy to ship) |
| `src/assets/flag-120.webp` | [Liberland_Flag.svg](https://raw.githubusercontent.com/liberland/docs/master/media/Liberland_Flag.svg) | Rasterised unchanged |
| `src/assets/badge-280.webp` | [Badge_LL.png](https://raw.githubusercontent.com/liberland/docs/master/media/Badge_LL.png) | History section |
| XII seal (inline SVG, `Seal.tsx`) | Original decorative device with the official shield | Not a state emblem |
| `public/og-image.jpg` | `scripts/og-image.mjs` (hero photograph + seal) | |
| Fonts: Playfair Display, Archivo | @fontsource / Google Fonts files | SIL Open Font License 1.1 |

## Considered and not used

| Source | Why |
| --- | --- |
| Press kit IMG_3898 (empty fireplace room), IMG_3900 (wooded yard), IMG_3899 (room mid-setup), IMG_4029 (bar) | Documentary shots, weaker than the alternatives. The fireplace appears in the awards photo |
| ark.ll.land paddleboard and other gallery photos | Not needed. Every role is filled without repeats |
| Airbnb listing photos | Not licensed for reuse |
| Sofia report photos (liberland.org/news/Liberland_Sofia_Bulgaria) | The report does not name Jan Schlüter, so he can't be identified in its group photos |
| 2015 proclamation | No archival photograph with documented provenance was supplied. The history section is typographic, with the official badge |

## Could not be fully verified

- **Ark Village website photos:** reuse confirmation from the Ark Village operators (info@visit.ll.land). They are the venue's own photos, used at the organisers' direction.
- **Drive `ark.jpg`:** the photographer is not recorded. The file owner is vanyaremporium@gmail.com.
- **Balázs Magyar and Jan Schlüter:** better-resolution originals would help. Their identities are verified by the name captions in the official graphics.
- **Federico Hu:** identified from the organisers' description only.
