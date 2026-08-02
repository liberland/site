function CasePage() {
  return (
    <section className="section section--tight">
      <div className="eyebrow" style={{ marginBottom: 22 }}>The case</div>
      <h1 className="h2" style={{ marginBottom: 24, maxWidth: "20ch" }}>A lawful, peaceful and reviewable settlement</h1>
      <p className="body-text" style={{ fontSize: 20, marginBottom: 64 }}>
        The campaign asserts no adjudicated sovereignty and no unrestricted right to build. It asserts that
        property, process and stewardship obligations survive every territorial disagreement.
      </p>
      {window.Data.casePillars.map((p) => (
        <div key={p.n} style={{ display: "grid", gridTemplateColumns: ".7fr 1.3fr", gap: 56, padding: "40px 0", borderTop: "1px solid var(--rule-strong)", alignItems: "start" }}>
          <div>
            <div className="mono" style={{ color: "var(--accent)", marginBottom: 14, fontSize: 11.5 }}>{p.n}</div>
            <h2 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 31, lineHeight: 1.12, margin: 0 }}>{p.title}</h2>
          </div>
          <p className="body-text" style={{ fontSize: 18.5 }}>{p.body}</p>
        </div>
      ))}
      <div style={{ marginTop: 56, padding: "34px 36px", background: "var(--ink)", color: "var(--body-on-dark)", fontSize: 18.5, lineHeight: 1.64, maxWidth: "80ch" }}>
        <span className="eyebrow eyebrow--accent" style={{ display: "block", marginBottom: 16 }}>COMMITMENT</span>
        The campaign commits to nonviolence, to compliance with applicable law while its lawfulness is tested
        through lawful means, to publishing official responses in full, and to correcting the record whenever it is
        shown to be wrong.
      </div>
    </section>
  );
}

window.BWWR_CasePage = CasePage;
