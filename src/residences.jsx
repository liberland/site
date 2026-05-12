// Residences — brokerage section linking to ark.ll.land
function Residences() {
  const items = window.LL_DATA.RESIDENCES;
  return (
    <section id="residences" className="section section--warm" data-screen-label="Residences">
      <div className="container">
        <div className="section-head">
          <span className="label">04 — Residences</span>
          <div>
            <h2 className="display h2" style={{ marginBottom: 18 }}>
              Cottages and houses at <em>Ark Village.</em>
            </h2>
            <p className="lede" style={{ maxWidth: 640, margin: 0 }}>
              We don't develop and we don't own. We introduce members to homes available
              at the eco-village in Apatin, on the Serbian bank of the Danube. The
              developer is <a href="https://ark.ll.land" target="_blank" rel="noreferrer" style={{ color: "var(--teal)", textDecoration: "underline", textUnderlineOffset: 4 }}>ark.ll.land</a>.
            </p>
          </div>
        </div>

        <div className="grid-3">
          {items.map(r => (
            <article key={r.label} className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                <img src={r.image} alt={r.label} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.9)" }} loading="lazy" />
              </div>
              <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="label label--ink">{r.label}</span>
                  <span className="label">{r.size}</span>
                </div>
                <p className="body" style={{ margin: 0, fontSize: 14 }}>{r.blurb}</p>
                <a href="#contact" className="label label--teal" style={{ paddingTop: 12, borderTop: "1px solid var(--rule)" }}>
                  Request an introduction →
                </a>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 56, padding: "32px 36px", border: "1px solid var(--rule)", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center", background: "var(--paper-card)" }}
             className="ark-cta">
          <div>
            <div className="label label--teal" style={{ marginBottom: 8 }}>How it works</div>
            <p className="body" style={{ margin: 0, maxWidth: 720 }}>
              Members request an introduction. We confirm availability with the developer,
              arrange a visit to Apatin, and coordinate the paperwork. The sale is
              concluded directly between the buyer and the Serbian developer; we are
              paid a brokerage fee by the developer on completion.
            </p>
          </div>
          <a href="https://ark.ll.land" target="_blank" rel="noreferrer" className="btn btn--solid">
            Visit ark.ll.land <span className="arrow">→</span>
          </a>
        </div>

        <style>{`
          @media (max-width: 720px) {
            .ark-cta { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

window.LL_Residences = Residences;
