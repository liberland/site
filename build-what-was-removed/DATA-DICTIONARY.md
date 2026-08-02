# Data dictionary

`src/data.js` is the v1 static data source (no database — see
`ARCHITECTURE.md` for the migration path). Money is always stored in
integer minor units (cents) — never binary floating point — and formatted
only at render time via `Metrics.formatEUR`.

## Incident

| Field | Meaning |
|---|---|
| `id` | Public record ID, e.g. `GS-2023-09-21` |
| `date` | ISO date the incident occurred |
| `title`, `summary` | Public title and neutral factual summary |
| `status` | One of the incident-status enum values below |
| `statusLabel` | Human-readable status badge text |
| `proc` | Procedural status (criminal complaint filed, etc.) |
| `grade` / `gradeLabel` | Evidence grade backing this incident's own claim |
| `valuationScope` | `incident_total` (the aggregate counts, item values are informational) or `item_total` (item values count, no aggregate exists) — never both for the same incident |
| `claimedCents` | Claimed permanent-loss value, or `null` if not valued |
| `seizureCents` | Temporary-seizure value when `valuationScope` is `incident_total`, or `null` |
| `includeInLoss` | Must be `true` **and** `grade` not in `advocacy_reference`/`unverified` for `claimedCents` to enter the Claimed Permanent Loss metric |
| `sources` | Count of source documents on file |
| `banner`, `claimant`, `official`, `questions`, `itemNote`, `items`, `srcDocs`, `timeline` | Incident detail page content — see `IncidentDetail.jsx` for how each is rendered |

## Item

Belongs to an incident (`incidentId`). Used both for the informational
item list on `incident_total`-scoped incidents, and as the actual valued
rows for `item_total`-scoped incidents (only `GS-2026-07-02` currently).
`cents` is always the per-item value in minor units.

## Incident status enum

`claimed_unreturned_or_destroyed`, `disputed_removal`,
`disputed_demolition`, `temporary_administrative_seizure`, `returned`. (The
handoff document's fuller enum — `reported`, `documented`,
`recovered`, `finally_forfeited`, `adjudicated_loss`, `closed_no_loss`,
`documentation_incomplete` — is reserved for future incidents; add values
as needed, not speculatively.)

## Evidence grade enum

`primary_official`, `primary_legal_filing`, `primary_private`,
`corroborated_witness`, `single_witness`, `advocacy_reference`,
`unverified`. Only the first four may back a monetary total (see
`src/metrics.js`'s `isEligibleGrade`).

## Budget category

`id`, `name`, `desc`, `targetCents`, `receivedCents`, `spentCents`,
`report` (a report reference string, or `"PENDING"`).

## Fields that must never render publicly (from the handoff document's
full schema, reserved for when a real backend exists)

`locationPrivate`, `ownerPrivateId`, `notesPrivate`, `privateOriginalPath`.
`tests/metrics.test.js` asserts these never appear on a built ledger row.

## Money

All amounts are integer cents. `Metrics.formatEUR(cents)` is the only
place formatting happens. CZK amounts (e.g. a Starlink invoice mentioned
in the handoff document) are never added to a EUR total — see
`EvidencePage.jsx`'s currency policy and the handoff document's currency
rules. No CZK-denominated incident is in the current seed data; if one is
added, keep its total separate and do not convert without stating the
rate, date and source.
