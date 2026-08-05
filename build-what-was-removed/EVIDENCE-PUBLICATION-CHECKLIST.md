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

## Adding a real source or image (once approved)

1. Place the approved, redacted file only — never the original — under a
   path this site serves (e.g. `assets/evidence/`).
2. Add or update the corresponding `Source` / `ImageEvidence` entry in
   `src/data.js` with its evidence grade, hash, and `supportsClaims`.
3. Update the relevant incident's `srcDocs` / gallery references.
4. Re-run `npm test` and `npm run test:e2e` — the private-field and
   evidence-grade assertions must still pass.
