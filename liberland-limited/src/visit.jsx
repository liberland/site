// Visit — visitor information for Ark Village, operated by Ark Village itself.
// The old #residences anchor lands here (see app.jsx).
function Visit() {
  const t = window.LL_T.visit;
  const { Link, SectionHead } = window.LL_UI;
  const { LINKS } = window.LL_DATA;

  return (
    <section id="visit" className="section section--warm" data-screen-label="Visit">
      <div className="container">
        <SectionHead label={t.label} title={t.title} paragraphs={[t.intro]} />

        <div className="visit-grid">
          <div className="stack-4">
            <div className="label">{t.locationLabel}</div>
            <address style={{ fontStyle: "normal" }}>
              {t.location.map((line, i) => (
                <div key={i} className={i === 0 ? "h3" : "body"} style={i === 0 ? { marginBottom: 6 } : { color: "var(--ink)" }}>{line}</div>
              ))}
            </address>
            <Link href={LINKS.arkMap} className="text-link small">{t.map}</Link>
          </div>

          {t.cards.map(c => (
            <article key={c.title} className="card offer">
              <h3 className="h3" style={{ margin: 0 }}>{c.title}</h3>
              <p className="body" style={{ margin: 0 }}>{c.text}</p>
              <Link href={c.href} className="btn btn--sm">{c.button}</Link>
              <div className="provider small">{t.operator}</div>
            </article>
          ))}
        </div>

        <div className="note" style={{ marginTop: 40, maxWidth: 880 }}>
          <div className="label label--teal" style={{ marginBottom: 10 }}>{t.noteLabel}</div>
          <p className="body" style={{ color: "var(--ink)" }}>{t.note}</p>
        </div>
      </div>

      <style>{`
        .visit-grid { display: grid; grid-template-columns: 0.8fr 1fr 1fr; gap: clamp(16px, 2vw, 28px); align-items: stretch; }
        @media (max-width: 920px) { .visit-grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}

window.LL_Visit = Visit;
