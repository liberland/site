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

## Croatia cost entry (`croatiaCosts`)

What the enforcement posture costs the Croatian public. Same discipline as
an incident: a figure enters the headline total only when its basis says it
may. Full editing procedure in `COSTS-DATA-GUIDE.md`.

| Field | Meaning |
|---|---|
| `id` | Public record ID, `CC-01` … |
| `category` | Cost category, e.g. `Storage and custody` |
| `title`, `description` | Public title and neutral description of the cost |
| `period` | Period the cost covers, e.g. `2023–2026`, `Open` |
| `amountCents` | Integer minor units, or `null` when no figure is sourced |
| `basis` | One of the cost-basis enum values below |
| `includeInTotal` | Must be `true` **and** `basis` in `primary_official`/`official_rate` for `amountCents` to enter Sourced Expenditure. Never inferred from the basis alone |
| `documented` | What this site already evidences about the quantity |
| `inputsNeeded` | The specific documents or rates required to publish a figure. Not optional — it is what makes an unsourced row useful |
| `source` | `{ id, title, grade, url }`, or `null` |

## Cost basis enum

| Value | Enters Sourced Expenditure? |
|---|---|
| `primary_official` | Yes — a published budget line, ATI response or official statement |
| `official_rate` | Yes — an official published rate × a quantity documented on this site |
| `estimate_methodology` | No — accumulated and displayed on a separate line, never merged |
| `needs_source` | No — the structure is identified, no figure published |

`Metrics.computeCostTotals` enforces the separation; `tests/metrics.test.js`
fails if an estimate can ever reach the sourced total, or if a
`needs_source` row can be promoted by setting `includeInTotal`.

## Image entry (`images`)

Documentary photography of the territory. Never used to illustrate an
incident — evidence imagery follows `EVIDENCE-PUBLICATION-CHECKLIST.md`.

| Field | Meaning |
|---|---|
| `src` | Direct image URL, or `null` to render the placeholder instead |
| `alt` | Accessible description of what the photograph shows |
| `placeholder` | Text shown when `src` is `null` |
| `caption` | Short caption, e.g. `The Danube` |
| `author`, `license`, `sourceUrl` | Attribution, rendered as a visible credit line beneath the image. Required for any entry with a `src` |

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
