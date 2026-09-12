# Evidence publication checklist

Nothing in `assets/` or referenced by an `<image-slot>`/`.image-slot`
placeholder may be replaced with a real image or document until every item
below is checked for that specific file. This is a manual checklist — no
script in this repository can replace human legal and redaction review.

- [ ] Redaction status is explicitly approved for this specific file (not
      inherited from a similar file).
- [ ] Signatures are removed or obscured.
- [ ] Passport numbers, national ID numbers, and dates of birth (unless
      necessary) are removed or obscured.
- [ ] Home addresses and unnecessary vehicle identification numbers are
      removed or obscured.
- [ ] Bank details and payment-card numbers are removed or obscured.
- [ ] Faces of uninvolved private persons and children are blurred.
- [ ] Names of uncharged individual officers are withheld unless counsel
      has approved publication.
- [ ] Phone numbers and private email addresses are removed.
- [ ] Exact sleeping locations or future operational plans are not
      disclosed.
- [ ] EXIF metadata has been stripped from the file.
- [ ] The file has a recorded SHA-256 hash and chain-of-custody note (see
      `DATA-DICTIONARY.md`'s `Source` shape).
- [ ] The image/document has appropriate alt text.
- [ ] The source has an assigned evidence grade (`DATA-DICTIONARY.md`) —
      no source may be published without one.

## Fail-closed rule

If any box above is unchecked, the corresponding record must keep its
placeholder (`image-slot` / `WITHHELD — REDACTION STATUS NOT APPROVED`)
rather than display anything. When in doubt, withhold.

## Documentary photographs are not evidence photographs

Two separate systems, deliberately kept apart:

| | Evidence imagery | Documentary imagery |
|---|---|---|
| Lives in | `srcDocs` / incident galleries | `Data.images` (`src/data.js`) |
| Renders via | `EvidenceSlot` — a placeholder until approved | `Photo` — a placeholder until a file exists |
| Shows | A specific incident, redaction-approved | The land, the river, the floodplain |
| May illustrate an incident? | Yes, that is its purpose | **Never** |

A documentary photograph of the Danube must never be placed on, beside or
in the position of an incident record. The moment a general landscape shot
stands where evidence of an intervention should be, the reader cannot tell
which images are load-bearing — and every other claim on the site inherits
that doubt.

### Provenance rule for documentary imagery

No freely-licensed ground-level photograph of the settlement exists. Commons
holds flags, logos, maps, conference portraits and two NASA satellite frames
and nothing on the ground; liberland.org states no reuse grant. Therefore:

- Only the satellite frame may be captioned as Gornja Siga.
- Every other photograph states its actual location and its distance from
  the site, in the caption, where the reader sees it — not in a source note.
- Every entry carries `author`, `license`, `licenseUrl` and `sourceUrl`. The
  credit line is a licence condition, not decoration.
- CC BY-SA 4.0 is copyleft on the image: reproduce it unmodified and the
  obligation is attribution only. **If you crop or colour-grade one, the
  adaptation must itself be released BY-SA 4.0** — so don't, unless you mean
  to.

To close this gap properly: have a settler photograph the site and upload it
to Commons under CC BY-SA 4.0. That is the only route to a lawful, genuine
picture of the settlement — and it fixes the problem permanently.

## Adding a real source or image (once approved)

1. Place the approved, redacted file only — never the original — under a
   path this site serves (e.g. `assets/evidence/`).
2. Add or update the corresponding `Source` / `ImageEvidence` entry in
   `src/data.js` with its evidence grade, hash, and `supportsClaims`.
3. Update the relevant incident's `srcDocs` / gallery references.
4. Re-run `npm test` and `npm run test:e2e` — the private-field and
   evidence-grade assertions must still pass.
