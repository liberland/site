const test = require("node:test");
const assert = require("node:assert/strict");
const Metrics = require("../src/metrics.js");
const Data = require("../src/data.js");

test("EUR 120 temporary seizure does not increase the claimed permanent-loss metric", () => {
  const m = Metrics.computeMetrics(Data.incidents, Data.items);
  assert.equal(m.loss, 5448622, "claimed permanent loss must equal the 2023 complaint total only");
  assert.equal(m.temp, 12000, "temporary seizure total must equal the five itemised camping items");
});

test("an unverified item cannot enter aggregate totals", () => {
  const unverifiedIncidents = Data.incidents.filter((i) => i.grade === "unverified");
  assert.ok(unverifiedIncidents.length >= 2, "fixture should contain unverified incidents to exercise this rule");
  unverifiedIncidents.forEach((i) => assert.equal(i.includeInLoss, false));

  const m = Metrics.computeMetrics(Data.incidents, Data.items);
  // Even if an unverified incident's includeInLoss flag were mistakenly set,
  // the grade check must still exclude it.
  const tampered = Data.incidents.map((i) =>
    i.grade === "unverified" ? { ...i, includeInLoss: true, claimedCents: 999999 } : i
  );
  const mTampered = Metrics.computeMetrics(tampered, Data.items);
  assert.equal(mTampered.loss, m.loss, "grade check must override a mistaken includeInLoss flag");
});

test("incident aggregates and item components are never both counted", () => {
  const rows = Metrics.buildLedgerRows(Data.incidents, Data.items);
  const incidentAggregateRows = rows.filter((r) => r.item === "— incident aggregate —");
  const itemRows = rows.filter((r) => r.item !== "— incident aggregate —");

  // GS-2023-09-21 is incident_total scope: one aggregate row, zero item rows in the ledger.
  assert.ok(incidentAggregateRows.some((r) => r.incidentId === "GS-2023-09-21"));
  assert.ok(!itemRows.some((r) => r.incidentId === "GS-2023-09-21"));

  // GS-2026-07-02 is item_total scope: item rows only, no aggregate row.
  assert.ok(!incidentAggregateRows.some((r) => r.incidentId === "GS-2026-07-02"));
  assert.ok(itemRows.some((r) => r.incidentId === "GS-2026-07-02"));
});

test("date filtering aggregates by actual incident date, not an extrapolated rate", () => {
  const m2023 = Metrics.computeMetrics(Data.incidents, Data.items, { period: "y2023" });
  assert.equal(m2023.loss, 5448622);
  assert.equal(m2023.hasTemp, false, "the 2026 seizure must not appear in a 2023 filter");

  const m2026 = Metrics.computeMetrics(Data.incidents, Data.items, { period: "y2026" });
  assert.equal(m2026.hasLoss, false, "the 2023 complaint must not appear in a 2026 filter");
  assert.equal(m2026.temp, 12000);
});

test("currency values are never silently combined across incidents of different scopes", () => {
  // Sanity check on the seed data itself: exactly one incident_total loss source
  // and one item_total temporary-seizure source, so no code path can accidentally
  // sum a scope against itself twice.
  const lossScopes = Data.incidents.filter((i) => i.includeInLoss).map((i) => i.valuationScope);
  assert.deepEqual(lossScopes, ["incident_total"]);
});

test("formatEUR renders decimal-safe amounts from integer cents", () => {
  assert.equal(Metrics.formatEUR(5448622), "€54,486.22");
  assert.equal(Metrics.formatEUR(12000), "€120.00");
  assert.equal(Metrics.formatEUR(0), "€0.00");
});

test("an unsourced cost never contributes to the headline Croatia total", () => {
  const t = Metrics.computeCostTotals(Data.croatiaCosts);
  assert.equal(t.sourcedCents, 0, "no official figure is published yet, so the total must be empty");
  assert.equal(t.hasSourced, false);
  assert.equal(t.pendingCount, Data.croatiaCosts.length, "every seeded row is awaiting a source");

  // A figure alone is not enough: the basis must also be one that counts.
  const tampered = Data.croatiaCosts.map((c) => ({ ...c, amountCents: 500000, includeInTotal: true }));
  const tTampered = Metrics.computeCostTotals(tampered);
  assert.equal(tTampered.sourcedCents, 0, "needs_source rows must stay out of the total even when given an amount");
  assert.equal(tTampered.pendingCount, Data.croatiaCosts.length);
});

test("an estimated cost is reported separately and never merged into sourced expenditure", () => {
  const costs = [
    { id: "A", basis: "primary_official", amountCents: 100000, includeInTotal: true },
    { id: "B", basis: "estimate_methodology", amountCents: 250000, includeInTotal: true },
    { id: "C", basis: "needs_source", amountCents: null, includeInTotal: false },
  ];
  const t = Metrics.computeCostTotals(costs);
  assert.equal(t.sourcedCents, 100000, "only the officially sourced figure counts");
  assert.equal(t.estimatedCents, 250000, "the estimate is tracked on its own line");
  assert.equal(t.sourcedCount, 1);
  assert.equal(t.estimatedCount, 1);
  assert.equal(t.pendingCount, 1);
  assert.notEqual(t.sourcedCents, t.sourcedCents + t.estimatedCents);
});

test("an official rate times a documented quantity counts toward the total", () => {
  const costs = [{ id: "A", basis: "official_rate", amountCents: 42000, includeInTotal: true }];
  assert.equal(Metrics.computeCostTotals(costs).sourcedCents, 42000);

  // includeInTotal is still an explicit opt-in, never inferred from the basis.
  const optedOut = [{ id: "A", basis: "official_rate", amountCents: 42000, includeInTotal: false }];
  assert.equal(Metrics.computeCostTotals(optedOut).sourcedCents, 0);
});

test("the cost CSV marks which rows count and leaves unsourced amounts blank", () => {
  const csv = Metrics.costsToCsv(Data.croatiaCosts);
  const lines = csv.split("\n");
  assert.match(lines[0], /counts_toward_total/);
  assert.equal(lines.length, Data.croatiaCosts.length + 1);
  lines.slice(1).forEach((l) => {
    assert.match(l, /"no"/, "no seeded row may be marked as counting");
    assert.match(l, /,"",/, "an unsourced row exports an empty amount rather than a zero");
  });
});

test("private fields are never present in ledger rows", () => {
  const rows = Metrics.buildLedgerRows(Data.incidents, Data.items);
  const forbidden = ["locationPrivate", "ownerPrivateId", "notesPrivate", "privateOriginalPath"];
  rows.forEach((r) => {
    forbidden.forEach((f) => assert.equal(r[f], undefined));
  });
});
