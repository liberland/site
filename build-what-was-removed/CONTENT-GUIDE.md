# Content guide

This site makes serious allegations against identifiable public authorities
in connection with a live, disputed territorial claim. Every contributor —
human or AI — must follow these rules before editing copy or adding data.

## Prohibited formulations (never publish without a final judgment)

- "Croatia stole/robbed..." → use "...claimed losses of €X in a filed
  criminal complaint."
- "The police are thieves." → use "The complaint alleges theft and
  robbery; no final criminal finding is asserted."
- "Hrvatske Šume illegally destroyed..." → use "Residents dispute the legal
  basis and procedure used to..."
- "Everything in this table was stolen." → use "Property reported removed,
  destroyed, temporarily seized or not returned."
- "Croatia has no jurisdiction." → use "The extent and legal basis of
  Croatia's jurisdiction over particular non-border activities remain
  disputed."
- "Liberland has an absolute right to build." → use "The campaign defends
  the existing, peaceful settlement and seeks a reviewable legal framework
  for it to continue and grow."
- "Police violence." → use "Reported or recorded use of force, pending
  legal assessment."
- "Robbery clock" / "Total Stolen" as an unqualified metric → use the
  approved metric names below.
- Allegations of corruption, illegal hunting, planted evidence, or
  political conspiracy, and naming individual (uncharged) officers, must
  never be published without independently verified evidence and specific
  legal-counsel approval.

## Approved metric names

`Documented Recovery Value`, `Claimed Permanent Loss`,
`Property Reported Removed or Destroyed`, `Value Alleged in Filed
Complaints`, `Temporary Administrative Seizure`, `Returned or Recovered`,
`Adjudicated Award`.

## Attribution is mandatory

Every criminal characterisation must be attributed to its source: "The
criminal complaint alleges...", "The owner reports...", "Witnesses
state...", "The legality remains disputed...", "No final criminal finding
is asserted...". Never state an allegation as an established fact.

## Allegation vs. adjudication

- **Claimed** — asserted by an owner or witness, not independently
  verified.
- **Documented** — supported by a contemporaneous photo, video, invoice,
  official record or filing.
- **Officially recorded** — acknowledged in an authority's decision,
  certificate or correspondence.
- **Disputed** — parties disagree about facts, competence, classification
  or proportionality.
- **Adjudicated** — finally determined by a court or competent authority.

Only "adjudicated" facts may be stated without qualification. Everything
else needs one of the attribution phrases above.

## Temporary seizure vs. permanent loss

A temporary administrative seizure (e.g. `GS-2026-07-02`, €120) is never
described as theft or a permanent loss, and must never be added to the
`Claimed Permanent Loss` metric — see `src/metrics.js` and its tests. It
moves to a permanent-loss classification only if the property is finally
forfeited, destroyed, or remains unreturned after the applicable process
concludes.

## Corrections and right-of-reply workflow

Nothing submitted through `/right-of-reply` (correction requests or
replies) is published automatically. Every request and the decision on it
(including a refusal) must be recorded in the affected record's corrections
history, with the fields that changed. See `src/submissions-adapter.js`.

## Image and privacy rules

Before any image is published: remove or obscure passport/ID numbers,
dates of birth (unless necessary), home addresses, bank/payment-card
numbers, signatures, unnecessary VINs, faces of uninvolved private persons
and children, phone numbers, private email addresses, exact sleeping
locations or future operational plans, and the names of uncharged
individual officers (unless counsel approves). Strip EXIF metadata. See
`EVIDENCE-PUBLICATION-CHECKLIST.md`.

## Adding or editing incidents

Every field in `src/data.js` must trace to a source with an evidence grade
of `primary_official`, `primary_legal_filing`, `primary_private`, or
`corroborated_witness` before it can affect any total (see
`DATA-DICTIONARY.md`). `single_witness`, `advocacy_reference` and
`unverified` grades are excluded from aggregates by `src/metrics.js` — do
not work around this exclusion in new code.
