function EvidencePage() {
  const toneClass = { ok: "badge--ok", warn: "badge--warn", bad: "badge--bad" };
  return (
    <section className="section section--tight">
      <div className="eyebrow" style={{ marginBottom: 22 }}>Methodology</div>
      <h1 className="h2" style={{ marginBottom: 24, maxWidth: "20ch" }}>How evidence is graded, redacted and published</h1>
      <div className="evidence-notice" style={{ maxWidth: "88ch", marginBottom: 64, fontSize: 18 }}>
        {window.Data.EVIDENCE_NOTICE}
      </div>

      <div className="eyebrow" style={{ marginBottom: 18 }}>Evidence grades</div>
      <div style={{ border: "1px solid var(--rule-strong)", background: "#fff", marginBottom: 64 }}>
        {window.Data.grades.map((g) => (
          <div key={g.key} style={{ display: "grid", gridTemplateColumns: ".8fr 1.6fr .6fr", gap: 24, padding: "18px 22px", borderBottom: "1px solid rgba(23,19,15,.09)", alignItems: "baseline" }}>
            <div className="mono" style={{ fontSize: 11.5 }}>{g.key}</div>
            <div className="small" style={{ fontSize: 17 }}>{g.desc}</div>
            <div style={{ textAlign: "right" }}>
              <span className={`badge ${toneClass[g.tone]}`}>{g.totals}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card-grid card-grid--3" style={{ marginBottom: 64 }}>
        {window.Data.policies.map((p) => (
          <div key={p.title}>
            <h3 className="h3" style={{ marginBottom: 14 }}>{p.title}</h3>
            <p className="small" style={{ margin: 0 }}>{p.body}</p>
          </div>
        ))}
      </div>

      <div className="eyebrow" style={{ marginBottom: 18 }}>Terminology we use — and terminology we do not</div>
      <div className="card-grid card-grid--2">
        <div>
          <div className="label-mono" style={{ color: "var(--ok-fg)", marginBottom: 18 }}>APPROVED</div>
          {window.Data.approvedTerms.map((t) => (
            <div key={t} style={{ fontFamily: "var(--sans)", fontSize: 14, padding: "9px 0", borderTop: "1px solid rgba(23,19,15,.1)" }}>{t}</div>
          ))}
        </div>
        <div>
          <div className="label-mono" style={{ color: "var(--bad-fg)", marginBottom: 18 }}>PROHIBITED WITHOUT A FINAL JUDGMENT</div>
          {window.Data.prohibitedTerms.map((t) => (
            <div key={t} style={{ fontFamily: "var(--sans)", fontSize: 14, padding: "9px 0", borderTop: "1px solid rgba(23,19,15,.1)", color: "var(--muted-2)", textDecoration: "line-through" }}>{t}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.BWWR_EvidencePage = EvidencePage;
