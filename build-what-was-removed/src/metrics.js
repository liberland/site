// Pure metrics logic — money kept in integer minor units (cents) throughout.
// Loaded as a plain script (window.Metrics) in the browser and via require() in tests.
(function (root, factory) {
  const mod = factory();
  if (typeof module === "object" && module.exports) module.exports = mod;
  if (root) root.Metrics = mod;
})(typeof window !== "undefined" ? window : undefined, function () {
  const EXCLUDED_GRADES = ["advocacy_reference", "unverified"];

  function isEligibleGrade(grade) {
    return !EXCLUDED_GRADES.includes(grade);
  }

  function formatEUR(cents) {
    return (
      "€" +
      (cents / 100).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  // Period filtering is always evaluated against the incident's actual date —
  // never an extrapolated "per day" average of historic totals.
  function inPeriod(dateStr, period, nowStr) {
    if (!period || period === "all") return true;
    const d = new Date(dateStr + "T00:00:00");
    const now = new Date(nowStr + "T00:00:00");
    if (period === "y2023") return d.getFullYear() === 2023;
    if (period === "y2024") return d.getFullYear() === 2024;
    if (period === "y2026") return d.getFullYear() === 2026;
    if (period === "r12") return now - d <= 365 * 864e5 && d <= now;
    if (period === "r30") return now - d <= 30 * 864e5 && d <= now;
    return true;
  }

  // Claimed Permanent Loss: only incidents explicitly flagged includeInLoss,
  // with a non-null valuation and an evidence grade that isn't advocacy/unverified.
  // Temporary Administrative Seizure is always kept separate and never promoted
  // into the loss total, regardless of amount.
  function computeMetrics(incidents, items, opts) {
    opts = opts || {};
    const period = opts.period || "all";
    const nowStr = opts.now || "2026-08-02";

    let loss = 0;
    let hasLoss = false;
    let temp = 0;
    let hasTemp = false;

    incidents
      .filter((i) => inPeriod(i.date, period, nowStr))
      .forEach((i) => {
        if (i.includeInLoss && i.claimedCents != null && isEligibleGrade(i.grade)) {
          loss += i.claimedCents;
          hasLoss = true;
        }
        if (i.status === "temporary_administrative_seizure") {
          if (i.valuationScope === "item_total") {
            items
              .filter((x) => x.incidentId === i.id)
              .forEach((x) => {
                temp += x.cents;
                hasTemp = true;
              });
          } else if (i.seizureCents != null) {
            temp += i.seizureCents;
            hasTemp = true;
          }
        }
      });

    return { loss, hasLoss, temp, hasTemp };
  }

  // One row per incident-aggregate (valuationScope === 'incident_total') plus
  // one row per item otherwise — never both for the same incident, so a ledger
  // export can never double count an incident against its own line items.
  function buildLedgerRows(incidents, items) {
    const rows = [];
    incidents.forEach((i) => {
      if (i.valuationScope === "incident_total") {
        rows.push({
          key: i.id,
          incidentId: i.id,
          date: i.date,
          incident: i.title,
          item: "— incident aggregate —",
          category: "Multiple",
          owner: "Settlement residents",
          status: i.status,
          statusLabel: i.statusLabel,
          proc: i.proc,
          cents: i.claimedCents,
          grade: i.grade,
          gradeLabel: i.gradeLabel,
          sources: i.sources,
        });
      }
    });
    items.forEach((it) => {
      const inc = incidents.find((x) => x.id === it.incidentId);
      if (!inc) return;
      rows.push({
        key: it.incidentId + "-" + it.name,
        incidentId: it.incidentId,
        date: inc.date,
        incident: inc.title,
        item: it.name,
        category: it.category,
        owner: it.owner,
        status: inc.status,
        statusLabel: inc.statusLabel,
        proc: inc.proc,
        cents: it.cents,
        grade: inc.grade,
        gradeLabel: inc.gradeLabel,
        sources: inc.sources,
      });
    });
    return rows;
  }

  function filterRows(rows, filters, nowStr) {
    filters = filters || {};
    const q = (filters.q || "").trim().toLowerCase();
    return rows
      .filter(
        (r) =>
          inPeriod(r.date, filters.period, nowStr) &&
          (!filters.status || filters.status === "all" || r.status === filters.status) &&
          (!filters.grade || filters.grade === "all" || r.grade === filters.grade) &&
          (!q ||
            (r.incident + " " + r.item + " " + r.category + " " + r.owner)
              .toLowerCase()
              .includes(q))
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  return {
    isEligibleGrade,
    formatEUR,
    inPeriod,
    computeMetrics,
    buildLedgerRows,
    filterRows,
  };
});
