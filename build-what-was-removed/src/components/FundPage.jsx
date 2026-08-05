function FundPage() {
  const [amount, setAmount] = React.useState("50");
  const eur = window.Metrics.formatEUR;
  const amounts = ["25", "50", "100", "250"];
  const methods = [
    { name: "CARD", state: "DISABLED — PROVIDER PENDING" },
    { name: "BANK TRANSFER", state: "DISABLED — ENTITY PENDING" },
    { name: "CRYPTOCURRENCY", state: "DISABLED — COMPLIANCE PENDING" },
  ];

  return (
    <section className="section section--tight">
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr .75fr", gap: 64, alignItems: "start" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 22 }}>The settlement fund</div>
          <h1 className="h2" style={{ marginBottom: 24, maxWidth: "18ch" }}>Fund the settlement</h1>
          <p className="body-text" style={{ fontSize: 19.5, marginBottom: 44 }}>
            Contributions defend and foster our existing settlement: they preserve evidence, pursue lawful recovery
            of property taken in Croatian proceedings, sustain essential infrastructure and pay for independent
            review of our own accounts.
          </p>
          <div className="evidence-notice" style={{ marginBottom: 48, fontSize: 17 }}>{window.Data.EVIDENCE_NOTICE}</div>

          <div className="eyebrow" style={{ marginBottom: 18 }}>Budget categories</div>
          {window.Data.budget.map((b) => {
            const pct = Math.round((b.receivedCents / b.targetCents) * 100);
            return (
              <div key={b.id} style={{ padding: "24px 0", borderTop: "1px solid var(--rule-strong)" }}>
                <div className="row-wrap gap-24" style={{ justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 26 }}>{b.name}</div>
                  <div className="mono small" style={{ whiteSpace: "nowrap" }}>{eur(b.receivedCents)} / {eur(b.targetCents)}</div>
                </div>
                <div className="small" style={{ maxWidth: "66ch", marginBottom: 14 }}>{b.desc}</div>
                <div className="progress">
                  <div className="progress__fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="row-wrap" style={{ justifyContent: "space-between", marginTop: 9 }}>
                  <span className="label-mono">SPENT {eur(b.spentCents)}</span>
                  <span className="label-mono">{b.report}</span>
                </div>
              </div>
            );
          })}
        </div>

        <aside>
          <div style={{ border: "1px solid var(--rule-strong)", background: "var(--paper-card)", padding: "30px 28px" }}>
            <div className="field-label" style={{ marginBottom: 22 }}>Contribution</div>
            <div className="row-wrap gap-8" style={{ marginBottom: 18 }}>
              {amounts.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  style={{
                    flex: "1 1 60px",
                    padding: "13px 6px",
                    fontFamily: "var(--mono)",
                    fontSize: 12.5,
                    border: `1px solid ${amount === a ? "var(--ink)" : "rgba(23,19,15,.25)"}`,
                    background: amount === a ? "var(--ink)" : "#fff",
                    color: amount === a ? "var(--paper)" : "var(--ink)",
                  }}
                >
                  €{a}
                </button>
              ))}
            </div>
            <label className="field" style={{ marginBottom: 16 }}>
              <span className="field-label">Amount · EUR</span>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} />
            </label>
            <label className="field" style={{ marginBottom: 16 }}>
              <span className="field-label">Restriction</span>
              <select>
                <option>General campaign use</option>
                <option>Evidence preservation</option>
                <option>Croatian legal recovery</option>
                <option>Essential infrastructure</option>
                <option>Safety and environmental compliance</option>
                <option>Public accounting and review</option>
              </select>
            </label>
            <label className="field" style={{ marginBottom: 16 }}>
              <span className="field-label">Acknowledgement</span>
              <select>
                <option>Anonymous</option>
                <option>Public alias in contribution ledger</option>
              </select>
            </label>
            <label className="field" style={{ marginBottom: 20 }}>
              <span className="field-label">Email for receipt (optional)</span>
              <input type="email" />
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
              {methods.map((m) => (
                <div key={m.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "13px 15px", border: "1px dashed rgba(23,19,15,.3)" }}>
                  <span className="label-mono">{m.name}</span>
                  <span className="label-mono" style={{ color: "var(--bad-fg)" }}>{m.state}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-full" disabled>Payment provider pending approval</button>
            <p className="label-mono" style={{ marginTop: 16, lineHeight: 1.75, fontSize: 10 }}>
              TODO — RECIPIENT LEGAL ENTITY, PAYMENT PROVIDER, WALLET VERIFICATION PROCEDURE AND DONATION TERMS
              REQUIRED BEFORE ENABLING. DONATIONS CONFER NO OWNERSHIP, FINANCIAL RETURN, CITIZENSHIP RIGHT, LAND
              TITLE OR INVESTMENT INTEREST.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

window.BWWR_FundPage = FundPage;
