function SectionLabel({ n, children }) {
  return (
    <div style={{ fontFamily: "var(--sans)", fontSize: 10.5, fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>
      {n} — {children}
    </div>
  );
}

function IncidentDetail({ incidentId }) {
  const go = window.BWWR_goTo;
  const incidents = window.Data.incidents;
  const inc = incidents.find((i) => i.id === incidentId) || incidents[0];
  const eur = window.Metrics.formatEUR;
  const dateLong = new Date(inc.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const valueOnRecord =
    inc.claimedCents != null
      ? eur(inc.claimedCents) + " claimed"
      : inc.seizureCents != null
      ? eur(inc.seizureCents) + " temporary seizure"
      : "Not valued";

  const facts = [
    { k: "RECORD ID", v: inc.id },
    { k: "STATUS", v: inc.statusLabel },
    { k: "PROCEDURAL STATUS", v: inc.proc },
    { k: "EVIDENCE GRADE", v: inc.gradeLabel },
    { k: "VALUATION SCOPE", v: inc.valuationScope },
    { k: "VALUE ON RECORD", v: valueOnRecord },
    { k: "LOCATION (PUBLIC)", v: "Gornja Siga, Danube left bank" },
    { k: "SOURCES ON FILE", v: String(inc.sources) },
  ];

  return (
    <div>
      <div style={{ background: "var(--ink-2)", color: "var(--paper)" }}>
        <div className="container" style={{ padding: "20px 34px" }}>
          <span className="label-mono" style={{ color: "var(--accent-2)", fontSize: 11.5 }}>{inc.banner}</span>
        </div>
      </div>
      <section className="section section--tight">
        <button
          onClick={go("ledger")}
          className="label-mono"
          style={{ background: "none", border: 0, padding: 0, marginBottom: 26, color: "var(--accent)", fontSize: 11.5 }}
        >
          ← BACK TO LEDGER
        </button>
        <div className="label-mono" style={{ marginBottom: 16, fontSize: 12 }}>{inc.id} · {dateLong}</div>
        <h1 className="h2" style={{ marginBottom: 40, maxWidth: "24ch" }}>{inc.title}</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr .6fr", gap: 64, alignItems: "start" }}>
          <div>
            <div style={{ marginBottom: 48 }}>
              <SectionLabel n="02">Neutral factual summary</SectionLabel>
              <p className="body-text" style={{ fontSize: 19 }}>{inc.summary}</p>
            </div>

            <div style={{ marginBottom: 48, padding: "26px 28px", background: "var(--paper-card)", borderLeft: "2px solid var(--accent)" }}>
              <SectionLabel n="03">Claimant account (allegation)</SectionLabel>
              <p className="body-text">{inc.claimant}</p>
            </div>

            <div style={{ marginBottom: 48, padding: "26px 28px", background: "var(--paper-warm)" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 10.5, fontWeight: 600, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--muted-2)", marginBottom: 14 }}>
                04 — Known official basis
              </div>
              <p className="body-text">{inc.official}</p>
            </div>

            <div style={{ marginBottom: 48 }}>
              <SectionLabel n="05">Questions requiring determination</SectionLabel>
              {inc.questions.map((q, i) => (
                <div key={i} className="row gap-14" style={{ padding: "15px 0", borderTop: "1px solid var(--rule)", fontSize: 17.5, lineHeight: 1.6, alignItems: "flex-start" }}>
                  <span className="mono" style={{ color: "var(--accent)", fontSize: 11.5, paddingTop: 4 }}>Q{i + 1}</span>
                  <span style={{ color: "#3C372F" }}>{q}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 48 }}>
              <SectionLabel n="06">Item ledger</SectionLabel>
              <div style={{ border: "1px solid var(--rule-strong)", background: "#fff" }}>
                {inc.items.map((it, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1.6fr .9fr .7fr", gap: 20, padding: "16px 20px", borderBottom: "1px solid rgba(23,19,15,.09)", alignItems: "center" }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 14 }}>{it.name}</div>
                    <div className="mono" style={{ fontSize: 10.5, letterSpacing: ".06em", color: "var(--muted-2)" }}>{it.statusLabel}</div>
                    <div className="mono" style={{ textAlign: "right", fontSize: 13 }}>{it.value}</div>
                  </div>
                ))}
                <div className="label-mono" style={{ padding: "16px 20px", lineHeight: 1.7, background: "var(--paper-card)" }}>{inc.itemNote}</div>
              </div>
            </div>

            <div style={{ marginBottom: 48 }}>
              <SectionLabel n="07">Evidence gallery</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                <div style={{ aspectRatio: "4/3", border: "1px solid var(--rule-strong)", background: "var(--paper-warm)" }}>
                  <div className="image-slot" style={{ width: "100%", height: "100%" }}>Approved redacted photo A</div>
                </div>
                <div style={{ aspectRatio: "4/3", border: "1px solid var(--rule-strong)", background: "var(--paper-warm)" }}>
                  <div className="image-slot" style={{ width: "100%", height: "100%" }}>Approved redacted photo B</div>
                </div>
                <div style={{ aspectRatio: "4/3" }}>
                  <div className="image-slot image-slot--withheld" style={{ width: "100%", height: "100%" }}>
                    WITHHELD — REDACTION STATUS NOT APPROVED
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 48 }}>
              <SectionLabel n="08">Source documents</SectionLabel>
              {inc.srcDocs.map((s) => (
                <div key={s.id} style={{ display: "grid", gridTemplateColumns: ".9fr 2fr .9fr", gap: 20, padding: "16px 0", borderTop: "1px solid var(--rule)", alignItems: "baseline" }}>
                  <div className="mono small">{s.id}</div>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 14.5, marginBottom: 5 }}>{s.title}</div>
                    <div className="small" style={{ fontSize: 16 }}>{s.limits}</div>
                  </div>
                  <div className="mono" style={{ textAlign: "right", fontSize: 10.5, color: "var(--accent)" }}>{s.grade}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 48 }}>
              <SectionLabel n="09">Procedural timeline</SectionLabel>
              {inc.timeline.map((t, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 24, padding: "16px 0", borderTop: "1px solid var(--rule)" }}>
                  <div className="mono" style={{ color: "var(--accent)", fontSize: 11.5 }}>{t.date}</div>
                  <div style={{ fontSize: 17.5, lineHeight: 1.6, color: "#3C372F" }}>{t.text}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 48 }}>
              <SectionLabel n="10">Corrections and responses</SectionLabel>
              <div style={{ padding: "22px 24px", border: "1px solid var(--rule-strong)", fontSize: 17, lineHeight: 1.62, color: "var(--muted-2)" }}>
                No corrections have been requested for this record. All correction requests, and the decision on
                each, are published here with the fields changed.
              </div>
            </div>

            <div style={{ marginBottom: 48, padding: "32px 34px", background: "var(--ink)", color: "var(--paper)" }}>
              <div className="eyebrow eyebrow--accent" style={{ marginBottom: 16 }}>11 — Right of reply</div>
              <p style={{ fontSize: 18.5, lineHeight: 1.62, color: "var(--body-on-dark)", marginBottom: 24, maxWidth: "64ch" }}>
                Croatian authorities, Hrvatske Šume, witnesses and any affected person may submit a response.
                Submissions are published unedited, subject only to privacy redaction.
              </p>
              <button className="btn btn--ghost-dark" onClick={go("reply")}>Submit a right of reply</button>
            </div>

            <div style={{ padding: "22px 24px", border: "1px solid var(--rule-strong)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <div className="small" style={{ fontSize: 17 }}>Support the settlement.</div>
              <button className="btn" onClick={go("fund")}>Fund the settlement</button>
            </div>
          </div>

          <aside>
            <div style={{ border: "1px solid var(--rule-strong)", background: "var(--paper-card)", padding: "26px 24px", marginBottom: 20 }}>
              <div className="field-label" style={{ marginBottom: 20 }}>Record facts</div>
              {facts.map((f) => (
                <div key={f.k} style={{ padding: "13px 0", borderTop: "1px solid rgba(23,19,15,.12)" }}>
                  <div className="label-mono" style={{ marginBottom: 6, fontSize: 10 }}>{f.k}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, lineHeight: 1.5 }}>{f.v}</div>
                </div>
              ))}
            </div>
            <window.BWWR_EvidenceStatusNotice variant="full" />
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              {incidents.map((i) => (
                <button
                  key={i.id}
                  onClick={go("incident", { incidentId: i.id })}
                  className="mono"
                  style={{
                    textAlign: "left",
                    background: i.id === inc.id ? "var(--paper-warm)" : "transparent",
                    border: "1px solid var(--rule-strong)",
                    padding: "13px 16px",
                    fontSize: 10.5,
                    letterSpacing: ".08em",
                    color: i.id === inc.id ? "var(--ink)" : "var(--muted)",
                  }}
                >
                  {i.id} · {i.title.toUpperCase()}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

window.BWWR_IncidentDetail = IncidentDetail;
