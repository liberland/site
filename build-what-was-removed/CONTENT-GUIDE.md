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

## Writing about Croatia's costs

The cost ledger (`#/costs`) is the most easily abused page on this site. It
reports what enforcement cost the Croatian public. It does not editorialise
about it.

- "Croatia wasted €X hounding settlers." → use "€X recorded in <source> for
  <cost category>, <period>."
- "Millions squandered on harassment." → no unsourced magnitude, ever. If
  there is no figure, the row says `NEEDS SOURCE` and stays empty.
- "Croatian taxpayers are being robbed by their own government." → use
  "This expenditure is borne by Croatian taxpayers." State the fact; the
  reader draws the conclusion.
- Never call any expenditure unlawful, corrupt or wasteful in the data or
  the copy. The page's force comes from itemisation, not adjectives.
- Never add a sourced figure and an estimate together. They render on
  separate lines for a reason.
- A contingent liability is not money spent. Keep exposure (`CC-06`) out of
  any expenditure total.

An empty total is the page working correctly, not a gap to be filled. See
`COSTS-DATA-GUIDE.md`.

## Voice — Liberland State Design Language V2

Optimistic, precise, never salesy. State the fact of record, then say plainly
what is being built.

- Do: "Founded 13 April 2015 on unclaimed land. Governed by consent."
- Do: "Seven square kilometres. Two colours. One rule: to live and let live."
- Don't: "The world's most exciting new country — join the movement!"
- Don't: "Get your citizenship now — limited spots, don't miss out!"

The record outranks the claim: lead with dates, coordinates, article numbers,
tallies and hashes — with what can be checked. This rule outranks any
aesthetic or rhetorical preference.

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
