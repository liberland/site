function costBasisTone(basis) {
  const b = (window.Data.costBases || []).find((x) => x.key === basis);
  return b ? b.tone : "neutral";
}

function costBasisLabel(basis) {
  const b = (window.Data.costBases || []).find((x) => x.key === basis);
  return b ? b.label.toUpperCase() : String(basis || "").toUpperCase();
}

function downloadCostsCSV(costs) {
  const csv = window.Metrics.costsToCsv(costs);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "croatia-enforcement-costs.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function CostRow({ cost, open, onToggle }) {
  const eur = window.Metrics.formatEUR;
  const counts =
    cost.amountCents != null && cost.includeInTotal && window.Metrics.isCountingBasis(cost.basis);

  return (
    <div style={{ borderTop: "1px solid var(--rule)" }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: "100%",
          background: "none",
          border: 0,
          padding: "22px 0",
          display: "grid",
          gridTemplateColumns: "minmax(0,2.4fr) minmax(0,1fr) minmax(0,1fr)",
          gap: 24,
          alignItems: "baseline",
          textAlign: "left",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div className="label-mono" style={{ marginBottom: 8, color: "var(--stone)" }}>
            {cost.id} · {cost.category}
          </div>
          <div style={{ fontFamily: "var(--display)", fontWeight: 500, fontSize: 22, lineHeight: 1.25 }}>
            {cost.title}
          </div>
        </div>
        <div className="label-mono" style={{ whiteSpace: "nowrap" }}>
          {cost.period}
        </div>
        <div style={{ textAlign: "right" }}>
          {cost.amountCents != null ? (
            <div style={{ fontFamily: "var(--mono)", fontSize: 19 }}>{eur(cost.amountCents)}</div>
          ) : (
            <span className={"badge badge--" + costBasisTone(cost.basis)}>NEEDS SOURCE</span>
          )}
          <div className="label-mono" style={{ marginTop: 8, fontSize: 10 }}>
            {counts ? "COUNTS TOWARD TOTAL" : "NOT IN TOTAL"}
          </div>
        </div>
      </button>

      {open && (
        <div style={{ paddingBottom: 30, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          <div>
            <div className="label-mono" style={{ marginBottom: 10 }}>
              WHAT THIS COST IS
            </div>
            <p className="small" style={{ margin: "0 0 20px" }}>
              {cost.description}
            </p>
            <div className="label-mono" style={{ marginBottom: 10 }}>
              DOCUMENTED ON THIS SITE
            </div>
            <p className="small" style={{ margin: 0 }}>
              {cost.documented}
            </p>
          </div>
          <div>
            <div className="label-mono" style={{ marginBottom: 10 }}>
              INPUTS REQUIRED TO PUBLISH A FIGURE
            </div>
            <ul className="small" style={{ margin: "0 0 20px", paddingLeft: 20 }}>
              {cost.inputsNeeded.map((s, i) => (
                <li key={i} style={{ marginBottom: 7 }}>
                  {s}
                </li>
              ))}
            </ul>
            <div className="label-mono" style={{ marginBottom: 10 }}>
              BASIS
            </div>
            <span className={"badge badge--" + costBasisTone(cost.basis)}>{costBasisLabel(cost.basis)}</span>
            {cost.source && (
              <p className="small" style={{ margin: "14px 0 0" }}>
                Source: {cost.source.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CostsPage() {
  const [openId, setOpenId] = React.useState(null);
  const costs = window.Data.croatiaCosts;
  const t = window.Metrics.computeCostTotals(costs);
  const eur = window.Metrics.formatEUR;
  const go = window.BWWR_goTo;

  return (
    <div>
      <section style={{ background: "var(--void)", color: "var(--chalk)" }}>
        <div className="container" style={{ paddingTop: 72, paddingBottom: 64 }}>
          <div className="row gap-14" style={{ marginBottom: 32 }}>
            <span style={{ width: 40, height: 2, background: "var(--yellow)" }} />
            <span className="eyebrow eyebrow--accent">The cost of enforcement</span>
          </div>
          <h1 className="h2" style={{ maxWidth: "22ch", marginBottom: 26 }}>
            What this has cost Croatia
          </h1>
          <p className="lede" style={{ marginBottom: 30 }}>
            Every removal, patrol, inspection, storage month and court file is paid for by Croatian taxpayers.
            This ledger records that expenditure to the same standard we hold ourselves to.
          </p>
          <div
            className="evidence-notice evidence-notice--compact"
            style={{ background: "none", border: "1px solid var(--rule-on-dark)", maxWidth: "110ch" }}
          >
            <span className="label-mono" style={{ color: "var(--yellow)" }}>
              METHOD
            </span>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--muted-3)" }}>
              {window.Data.COSTS_NOTICE}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tight" id="cost-summary">
        <div className="card-grid card-grid--3" style={{ marginBottom: 48 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Sourced expenditure
            </div>
            <p className="cost-total__figure" style={{ marginBottom: 14 }}>
              {t.hasSourced ? eur(t.sourcedCents) : "—"}
            </p>
            <div className="label-mono" style={{ lineHeight: 1.7 }}>
              {t.hasSourced
                ? t.sourcedCount + " ENTRIES BACKED BY AN OFFICIAL SOURCE."
                : "NO OFFICIAL FIGURE PUBLISHED YET. THIS TOTAL STAYS EMPTY UNTIL ONE IS."}
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Estimated, shown separately
            </div>
            <p className="cost-total__figure" style={{ marginBottom: 14, color: "var(--amber)" }}>
              {t.hasEstimated ? eur(t.estimatedCents) : "—"}
            </p>
            <div className="label-mono" style={{ lineHeight: 1.7 }}>
              CALCULATED FROM A STATED METHOD. NEVER ADDED TO SOURCED EXPENDITURE.
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Awaiting a source
            </div>
            <p className="cost-total__figure" style={{ marginBottom: 14 }}>
              {t.pendingCount}
            </p>
            <div className="label-mono" style={{ lineHeight: 1.7 }}>
              OF {t.totalCount} COST STRUCTURES IDENTIFIED. EACH ROW LISTS WHAT IS REQUIRED.
            </div>
          </div>
        </div>

        <div className="row-wrap gap-24" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
          <div>
            <div className="section-number">
              <span className="mono" style={{ color: "var(--amber)", fontSize: 12 }}>
                01
              </span>
              <span className="rule-short" />
              <span className="eyebrow">The cost ledger</span>
            </div>
            <h2 className="h3" style={{ maxWidth: "30ch" }}>
              Six cost structures, itemised
            </h2>
          </div>
          <button className="btn" onClick={() => downloadCostsCSV(costs)}>
            Export CSV
          </button>
        </div>

        <div style={{ borderBottom: "1px solid var(--rule)", marginTop: 24 }}>
          {costs.map((c) => (
            <CostRow
              key={c.id}
              cost={c}
              open={openId === c.id}
              onToggle={() => setOpenId(openId === c.id ? null : c.id)}
            />
          ))}
        </div>

        <div className="cost-pending" style={{ marginTop: 24 }}>
          {t.pendingCount} of {t.totalCount} rows are awaiting an official figure. Open a row to see exactly which
          inputs are required.
        </div>
      </section>

      <section style={{ background: "var(--concrete)" }}>
        <div className="container" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="section-number">
            <span className="mono" style={{ color: "var(--amber)", fontSize: 12 }}>
              02
            </span>
            <span className="rule-short" />
            <span className="eyebrow">How a figure qualifies</span>
          </div>
          <h2 className="h3" style={{ marginBottom: 32, maxWidth: "34ch" }}>
            A number enters the total only when a source carries it
          </h2>
          <div className="card-grid card-grid--4">
            {window.Data.costBases.map((b) => (
              <div key={b.key}>
                <span className={"badge badge--" + b.tone} style={{ marginBottom: 16, display: "inline-block" }}>
                  {b.totals}
                </span>
                <h3 style={{ fontFamily: "var(--display)", fontWeight: 500, fontSize: 19, margin: "0 0 12px" }}>
                  {b.label}
                </h3>
                <p className="small" style={{ margin: 0, fontSize: 15 }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="small" style={{ marginTop: 32, maxWidth: "66ch" }}>
            The same rule governs the property ledger: an unverified figure never enters an aggregate. Applying it
            to Croatia's costs as strictly as to our own losses is what makes the comparison worth publishing.{" "}
            <a href={window.Router.pathFor("evidence")} onClick={go("evidence")}>
              Read the evidence methodology →
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

window.BWWR_CostsPage = CostsPage;
