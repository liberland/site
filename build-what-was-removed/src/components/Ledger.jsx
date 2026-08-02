function badgeClass(status) {
  if (status === "claimed_unreturned_or_destroyed") return "badge badge--bad";
  if (status === "temporary_administrative_seizure") return "badge badge--warn";
  if (status === "returned") return "badge badge--ok";
  return "badge badge--neutral";
}

function toCSV(rows) {
  const cols = ["date", "incident", "item", "category", "owner", "statusLabel", "proc", "cents", "gradeLabel", "sources"];
  const header = ["Date", "Incident", "Item", "Category", "Owner label", "Status", "Procedural status", "Value (cents, EUR)", "Evidence grade", "Sources"];
  const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
  const lines = [header.map(esc).join(",")];
  rows.forEach((r) => lines.push(cols.map((c) => esc(r[c])).join(",")));
  return lines.join("\r\n");
}

function downloadCSV(rows) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "build-what-was-removed-ledger.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Ledger({ initialParams }) {
  const [q, setQ] = React.useState(initialParams.get("q") || "");
  const [status, setStatus] = React.useState(initialParams.get("status") || "all");
  const [grade, setGrade] = React.useState(initialParams.get("grade") || "all");
  const [period, setPeriod] = React.useState(initialParams.get("period") || "all");
  const [copied, setCopied] = React.useState(false);
  const go = window.BWWR_goTo;

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status !== "all") params.set("status", status);
    if (grade !== "all") params.set("grade", grade);
    if (period !== "all") params.set("period", period);
    const search = params.toString();
    const hash = window.Router.pathFor("ledger", { search });
    // replaceState (not location.hash =) so typing in the search box doesn't
    // spam hashchange events or add history entries.
    window.history.replaceState({}, "", hash);
  }, [q, status, grade, period]);

  const allRows = window.Metrics.buildLedgerRows(window.Data.incidents, window.Data.items);
  const rows = window.Metrics.filterRows(allRows, { q, status, grade, period });
  const m = window.Metrics.computeMetrics(window.Data.incidents, window.Data.items, { period });
  const eur = window.Metrics.formatEUR;

  const statusOptions = [
    ["all", "All statuses"],
    ["claimed_unreturned_or_destroyed", "Claimed unreturned / destroyed"],
    ["disputed_removal", "Disputed removal"],
    ["disputed_demolition", "Disputed demolition"],
    ["temporary_administrative_seizure", "Temporary administrative seizure"],
    ["returned", "Returned"],
  ];
  const gradeOptions = [
    ["all", "All grades"],
    ["primary_official", "Primary official"],
    ["primary_legal_filing", "Primary legal filing"],
    ["primary_private", "Primary private"],
    ["corroborated_witness", "Corroborated witness"],
    ["single_witness", "Single witness"],
    ["unverified", "Unverified"],
  ];
  const periodOptions = [
    ["all", "All time"],
    ["y2026", "2026"],
    ["y2024", "2024"],
    ["y2023", "2023"],
    ["r12", "Rolling 12 months"],
    ["r30", "Rolling 30 days"],
  ];

  const metricCards = [
    { label: "Claimed Permanent Loss", value: m.hasLoss ? eur(m.loss) : "—", qualifier: "CLAIMED IN A FILED CRIMINAL COMPLAINT; NOT A COURT AWARD OR FINAL FINDING." },
    { label: "Temporary Administrative Seizure", value: m.hasTemp ? eur(m.temp) : "—", qualifier: "OFFICIALLY ITEMISED. NOT A PERMANENT LOSS." },
    { label: "Returned or Recovered", value: "€0.00", qualifier: "NONE RECORDED IN THIS PERIOD." },
    { label: "Adjudicated Award", value: "€0.00", qualifier: "FINAL DECISIONS ONLY. NONE RECORDED." },
  ];

  const columns = ["Date", "Incident", "Item", "Category", "Owner label", "Status", "Procedural status", "Value", "Evidence grade", "Src"];

  function resetFilters() {
    setQ("");
    setStatus("all");
    setGrade("all");
    setPeriod("all");
  }

  function copyLink() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  }

  return (
    <section className="section section--tight container--wide" style={{ maxWidth: "var(--maxw-wide)" }}>
      <div className="section-number">
        <span className="mono" style={{ color: "var(--accent)", fontSize: 12 }}>LDG</span>
        <span className="rule-short" />
        <span className="eyebrow">Public evidence ledger</span>
      </div>
      <h1 className="h2" style={{ marginBottom: 18, maxWidth: "22ch" }}>Incidents and items on record</h1>
      <p className="small" style={{ fontSize: 18, lineHeight: 1.62, maxWidth: "74ch", marginBottom: 40 }}>
        Every row states its status, procedural posture, evidence grade and source count. Values are shown in native
        currency and never silently converted. Private fields are never exported.
      </p>

      <div style={{ border: "1px solid var(--rule-strong)", background: "var(--paper-card)", padding: "22px 24px", display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-end", marginBottom: 26 }}>
        <label className="field" style={{ flex: "1 1 260px" }}>
          <span className="field-label">Full-text search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Item, incident, owner label…" />
        </label>
        <label className="field" style={{ flex: "0 1 210px" }}>
          <span className="field-label">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusOptions.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
        <label className="field" style={{ flex: "0 1 210px" }}>
          <span className="field-label">Evidence grade</span>
          <select value={grade} onChange={(e) => setGrade(e.target.value)}>
            {gradeOptions.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
        <label className="field" style={{ flex: "0 1 210px" }}>
          <span className="field-label">Period (by incident date)</span>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            {periodOptions.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
        <button className="btn" onClick={resetFilters}>Reset</button>
      </div>

      <div className="card-grid card-grid--4" style={{ marginBottom: 14 }}>
        {metricCards.map((c) => (
          <div key={c.label} style={{ padding: "22px 22px 20px" }}>
            <div className="field-label" style={{ marginBottom: 12, minHeight: 26 }}>{c.label}</div>
            <div style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 31, lineHeight: 1, marginBottom: 9 }}>{c.value}</div>
            <div className="label-mono" style={{ lineHeight: 1.65 }}>{c.qualifier}</div>
          </div>
        ))}
      </div>
      <div className="label-mono" style={{ marginBottom: 32, fontSize: 11 }}>
        SHOWING {rows.length} ROWS · NATIVE CURRENCY ONLY · INCIDENT AGGREGATES AND THEIR ITEM COMPONENTS ARE NEVER
        BOTH COUNTED.
      </div>

      <div className="table-wrap" role="region" aria-label="Ledger table" tabIndex="0">
        <table className="ledger">
          <caption>PUBLIC LEDGER — INCIDENT AND ITEM RECORDS</caption>
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={c} scope="col" style={i === 7 || i === 9 ? { textAlign: "right" } : undefined}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.key}
                tabIndex="0"
                role="button"
                aria-label={`Open incident record: ${r.incident}`}
                onClick={go("incident", { incidentId: r.incidentId })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") window.Router.navigate("incident", { incidentId: r.incidentId });
                }}
              >
                <td className="mono">{r.date}</td>
                <td>{r.incident}</td>
                <td>{r.item}</td>
                <td>{r.category}</td>
                <td>{r.owner}</td>
                <td><span className={badgeClass(r.status)}>{r.statusLabel}</span></td>
                <td className="mono">{r.proc}</td>
                <td className="num-right">{r.cents == null ? "not valued" : window.Metrics.formatEUR(r.cents)}</td>
                <td className="mono">{r.gradeLabel}</td>
                <td className="num-right">{r.sources}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ledger-cards" style={{ marginTop: 14 }}>
        {rows.map((r) => (
          <div key={r.key} className="ledger-card" onClick={go("incident", { incidentId: r.incidentId })}>
            <div className="row-wrap gap-8" style={{ justifyContent: "space-between", marginBottom: 8 }}>
              <span className="mono small">{r.date}</span>
              <span className={badgeClass(r.status)}>{r.statusLabel}</span>
            </div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 18, marginBottom: 4 }}>{r.incident}</div>
            <div className="small">{r.item} · {r.category}</div>
            <div className="row-wrap gap-8" style={{ justifyContent: "space-between", marginTop: 10 }}>
              <span className="mono small">{r.gradeLabel}</span>
              <span className="mono">{r.cents == null ? "not valued" : window.Metrics.formatEUR(r.cents)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="row-wrap gap-12 no-print" style={{ marginTop: 20 }}>
        <button className="label-mono" style={{ padding: "10px 16px", border: "1px solid var(--rule-strong)", background: "none" }} onClick={() => downloadCSV(rows)}>
          CSV EXPORT — PUBLIC FIELDS ONLY
        </button>
        <button className="label-mono" style={{ padding: "10px 16px", border: "1px solid var(--rule-strong)", background: "none" }} onClick={copyLink}>
          {copied ? "LINK COPIED" : "COPY SHAREABLE FILTER URL"}
        </button>
        <button className="label-mono" style={{ padding: "10px 16px", border: "1px solid var(--rule-strong)", background: "none" }} onClick={() => window.print()}>
          PRINT VIEW
        </button>
      </div>
    </section>
  );
}

window.BWWR_Ledger = Ledger;
