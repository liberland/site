// Chronological updates, built only from the same seeded, sourced timeline
// entries shown on incident pages — never from unsourced narrative.
function UpdatesPage() {
  const go = window.BWWR_goTo;
  const entries = [];
  window.Data.incidents.forEach((inc) => {
    inc.timeline.forEach((t) => {
      entries.push({ date: t.date, text: t.text, incidentId: inc.id, incidentTitle: inc.title });
    });
  });
  entries.sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="section section--tight">
      <div className="eyebrow" style={{ marginBottom: 22 }}>Campaign record</div>
      <h1 className="h2" style={{ marginBottom: 24, maxWidth: "20ch" }}>Updates</h1>
      <p className="body-text" style={{ fontSize: 19.5, marginBottom: 48 }}>
        Every update here is drawn directly from a sourced incident record. Nothing is added here that is not
        already published, attributed and dated on the corresponding incident page.
      </p>
      {entries.map((e, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 24, padding: "20px 0", borderTop: "1px solid var(--rule-strong)" }}>
          <div className="mono" style={{ color: "var(--accent)", fontSize: 12 }}>{e.date}</div>
          <div>
            <p style={{ fontSize: 17.5, lineHeight: 1.6, color: "#3C372F", margin: "0 0 8px" }}>{e.text}</p>
            <button
              className="mono"
              style={{ background: "none", border: 0, padding: 0, color: "var(--accent)", fontSize: 11.5 }}
              onClick={go("incident", { incidentId: e.incidentId })}
            >
              {e.incidentId} · {e.incidentTitle.toUpperCase()} →
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

window.BWWR_UpdatesPage = UpdatesPage;
