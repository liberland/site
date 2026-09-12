# Croatia's costs — how to put a figure in

The cost ledger at `#/costs` records what the enforcement posture toward the
settlement costs the Croatian public. It ships with six cost structures
identified and **no figures**, because no figure has been sourced yet.

This is deliberate. The headline total stays empty until an official source
carries a number. That is the same rule the property ledger applies to our own
losses, and it is the reason the comparison is worth publishing at all: we do
not get to demand itemised records from an authority while estimating its
budget from the air.

## Where the data lives

One array, in `src/data.js`:

```js
const croatiaCosts = [ … ];
```

Everything on the page — the three summary figures, the six rows, the CSV
export, the "awaiting a source" counter — is computed from that array. There is
no other place to edit.

## Adding a figure to an existing row

Find the row by `id` (`CC-01` … `CC-06`) and set three fields:

```js
{
  id: "CC-04",
  …
  amountCents: 184000,          // €1,840.00 — integer minor units, never a float
  basis: "primary_official",     // must be a basis whose `totals` is "COUNTS"
  includeInTotal: true,          // explicit opt-in; never inferred
  source: {
    id: "CC-SRC-001",
    title: "MUP response to access-to-information request, 12 March 2026",
    grade: "PRIMARY OFFICIAL",
    url: null,                   // link once the document is published
  },
}
```

The figure appears in **Sourced expenditure** immediately, the "awaiting a
source" counter drops by one, and the row's tag changes from `NEEDS SOURCE` to
`COUNTS TOWARD TOTAL`.

### Money is integer cents

`€1,840.00` is `184000`, not `1840.00`. Floats are never used for money
anywhere in this codebase — see `DATA-DICTIONARY.md`.

## The four bases

| `basis` | Enters the headline total? | Use when |
|---|---|---|
| `primary_official` | **Yes** | A published budget line, an access-to-information response, or an official statement of what was spent. |
| `official_rate` | **Yes** | An officially published unit rate × a quantity documented on this site. State both in `source`. |
| `estimate_methodology` | No — shown on its own line | A calculation from public inputs. Publish the method and the inputs. |
| `needs_source` | No | The cost structure is real but no figure is available. |

`includeInTotal: true` on an `estimate_methodology` or `needs_source` row does
nothing — `computeCostTotals` checks the basis as well as the flag, and there is
a unit test (`tests/metrics.test.js`) that fails if that check is ever removed.
This is intentional: a mis-set flag must not be able to promote an estimate into
a sourced total.

## Publishing an estimate

Estimates are legitimate and sometimes the only thing available. They are just
never merged into sourced expenditure. To publish one:

1. Set `basis: "estimate_methodology"` and `amountCents`.
2. Put the full calculation in `description` — inputs, rates, arithmetic, and
   where each input came from. A reader must be able to redo it.
3. Leave `includeInTotal: false`.

It renders under **Estimated, shown separately**, clearly labelled.

## Adding a new cost structure

Append an object with every field the existing rows carry. `inputsNeeded` is
not optional — it is what makes an empty row useful rather than merely empty,
and the page renders it as the row's call to action.

```js
{
  id: "CC-07",
  category: "Border and access control",
  title: "Signage, barriers and access restriction",
  description: "…",
  period: "2024–",
  amountCents: null,
  basis: "needs_source",
  includeInTotal: false,
  documented: "What this site already evidences about the quantity.",
  inputsNeeded: ["The specific document or rate required", "…"],
  source: null,
}
```

## Getting the sources

The realistic routes to an official figure:

- **Access to information (Zakon o pravu na pristup informacijama).** Croatia's
  ATI law covers operational costs held by MUP, the inspectorates and the
  relevant ministries. A request naming a date and an operation is far more
  likely to be answered than a general one.
- **Published budget lines.** Ministry and county budgets are published
  annually and sometimes itemise enforcement and plant hire.
- **Official price lists.** Storage, towing and plant-hire rates are frequently
  published as schedules, which is what `official_rate` exists for.
- **Court and misdemeanour cost schedules.** Published per-file costs, applied
  to a documented count of files.

## What not to do

- Do not fill a row with a plausible number to make the page look finished. An
  empty total is the page working correctly.
- Do not convert currencies silently. If a source is in another currency,
  record the rate, date and source of the conversion.
- Do not describe any expenditure as unlawful, wasteful or corrupt in this
  data. The ledger reports what was spent; the argument is the reader's to make.
- Do not move a contingent liability (`CC-06`) into spent money. An allegation
  is not an award, and exposure is not expenditure.
