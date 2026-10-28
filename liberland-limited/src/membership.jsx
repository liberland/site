// Membership — an enquiry process, not a price list. No fees or privileges are advertised
// until a package has written terms and real fulfilment behind it.
function Membership() {
  const t = window.LL_T.membership;
  const { Rich, SectionHead } = window.LL_UI;
  const { MAIL } = window.LL_DATA;

  return (
    <section id="membership" className="section section--warm" data-screen-label="Membership">
      <div className="container">
        <SectionHead label={t.label} title={t.title} paragraphs={t.intro} />

        <div className="label" style={{ marginBottom: 8 }}>{t.stepsLabel}</div>
        <ol className="grid-3 steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {t.steps.map(s => (
            <li key={s.n} className="step">
              <span className="n" aria-hidden="true">{s.n}</span>
              <h3 className="h3" style={{ margin: 0 }}>{s.title}</h3>
              <p className="body" style={{ margin: 0 }}>{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="membership-cta">
          <a href={MAIL.membership} className="btn btn--solid">
            {t.cta} <span className="arrow">→</span>
          </a>
          <p className="small" style={{ margin: 0 }}><Rich value={t.ctaHint} /></p>
        </div>

        <div className="note" style={{ marginTop: 40, maxWidth: 880 }}>
          <p className="body" style={{ color: "var(--ink)" }}><Rich value={t.clarification} /></p>
        </div>
      </div>

      <style>{`
        .membership-cta { margin-top: 48px; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
      `}</style>
    </section>
  );
}

window.LL_Membership = Membership;
