# The claims register — how to add damages

The register at `#/claims` lists every piece of property on record, one
entry at a time, with its photograph where one exists. This is the page a
reader scrolls to see what was actually taken.

It ships deliberately incomplete, and says so on its face: 12 entries, 5
carrying a value, 0 photographed, 6 still a category rather than a thing.
Those counters are computed, not written — they drop as you fill the
register in.

## Where the data lives

One array, in `src/data.js`:

```js
const items = [ … ];
```

The claims page, the ledger table, the per-incident item lists and the
totals all read from it. There is no second place to edit.

## Adding a claim

```js
{
  id: "CL-2023-09-21-06",      // stable public reference, never reused
  incidentId: "GS-2023-09-21", // must match an existing incident
  name: "Makita circular saw",
  description: "Serial 7731A. Purchased 2022, invoice on file as SRC-0xx.",
  category: "Tools",
  owner: "Settlement residents", // public label only — never a real name
  cents: 18500,                  // €185.00, integer minor units, or null
  imageId: "claim-saw",          // key in `images`, or null for a slot
  informational: false,
  itemisationPending: false,
}
```

### The two flags that matter

**`informational: true`** means this entry's value is already inside its
incident's aggregate figure. Set it for anything belonging to an incident
whose `valuationScope` is `incident_total` — today that is everything under
`GS-2023-09-21`, whose €54,486.22 complaint total is the counted number.

Such an entry renders "Inside the incident total", never carries a euro
figure of its own, and is excluded from ledger rows and every aggregate.
This is the rule that stops the same loss being counted twice, once whole
and once in pieces. `tests/metrics.test.js` fails if it is ever bypassed —
including if someone gives an informational line a value.

**`itemisationPending: true`** marks a line that is still a category rather
than a thing: "Hand and power tools" instead of each tool. It renders a
`NOT YET ITEMISED` badge and counts toward the gap counter in the header.

## Breaking the 2023 complaint into real items

This is the biggest outstanding piece of work on the site, and
`LEGAL-REVIEW-CHECKLIST.md` already lists it: an item-by-item
reconciliation of the €54,486.22 total.

The five entries under `GS-2023-09-21` are categories inherited from the
complaint. To itemise properly:

1. Work from the complaint's own schedule, not from memory.
2. Replace each category entry with one entry per actual item, each with a
   description specific enough to identify it — make, model, serial where
   known, and the source that evidences ownership.
3. Keep `informational: true` on every one of them while the incident's
   `valuationScope` stays `incident_total`. You may record each item's
   `cents` for the record; it still will not be summed.
4. Only once the itemised values are complete **and** reconcile to the
   complaint total should the incident switch to `valuationScope:
   "item_total"` with `includeInLoss` moved onto the items. Do not do this
   halfway — a partial switch silently shrinks the headline figure.

## Adding a photograph

Claim photographs are **evidence**, not documentary landscape imagery, and
go through `EVIDENCE-PUBLICATION-CHECKLIST.md` first — redaction approved,
faces blurred, EXIF stripped, identity and payment numbers removed.

Once approved:

1. Put the file in `img/`.
2. Add an entry to `images` in `src/data.js` with `alt`, `author`,
   `license` and `sourceUrl`. For a resident's own photograph the author is
   the owner's public label and the licence is whatever they granted.
3. Point the claim's `imageId` at that key.

The slot on the card already names the reference to attach — "ADD ONE TO
CL-2026-07-02-01" — so the page tells you what it is waiting for.

## What not to do

- Do not invent a value to make an entry look finished. `null` renders
  honestly as "Not valued"; a fabricated figure is the one thing that would
  discredit the whole register.
- Do not put a real person's name in `owner`. Public labels only.
- Do not describe an item as stolen. The register records what is reported
  removed, destroyed, seized or not returned — see `CONTENT-GUIDE.md`.
- Do not reuse an `id`. References are cited; they must stay stable.
