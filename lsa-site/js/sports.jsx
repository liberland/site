/* ============================================================
   sports.jsx — Sports & Federations (directory + modal)
   ============================================================ */

const { useReveal, Eyebrow, FEDS, PageHead } = window;

const CRITERIA = [
  "Recognised by, or affiliated to, the relevant International Federation for the sport.",
  "One federation per sport — no competing claims to the same discipline.",
  "A minimum base of clubs and individual members, published and verifiable.",
  "At least one national championship held each year.",
  "Adoption of the LSOOC Bylaws, Code of Ethics and the integrity framework.",
  "Statutes, an elected board and transparent, audited finances of its own.",
];

const STEPS = [
  { n: "1", t: "Self-assess", d: "Check your sport against the published admission criteria below — they are objective and public so you can measure readiness before applying." },
  { n: "2", t: "Submit dossier", d: "Lodge statutes, club & member rolls, IF-affiliation evidence and last accounts with the Secretary General." },
  { n: "3", t: "Review", d: "The Executive Board verifies one-federation-per-sport and criteria; provisional status may be granted while gaps are closed." },
  { n: "4", t: "Assembly vote", d: "The General Assembly admits the federation by meritocratic vote; the result is published with the minutes." },
];

function FedModal({ fed, onClose }) {
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, []);
  const f = fed;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="top" style={{ background: `linear-gradient(135deg, ${f.c === "var(--ink)" ? "var(--ink-3)" : f.c}, var(--ink))` }}>
          <button className="x" onClick={onClose}>✕</button>
          <div className="ab">{f.ab}</div>
          <div className="nm">{f.nm} · {f.body}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <span className="tag" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>{f.olympic ? "Olympic sport" : "IF-recognised"}</span>
            <span className="tag" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}>{f.status === "full" ? "Full member" : "Provisional"}</span>
          </div>
        </div>
        <div className="mbody">
          <p className="lead" style={{ fontSize: 19 }}>{f.tagline}</p>
          <p style={{ color: "var(--muted)", marginTop: 10 }}>{f.extra}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, border: "1px solid var(--line)", borderRadius: "var(--radius)", margin: "24px 0", overflow: "hidden" }}>
            {[["Clubs", f.clubs], ["Members", f.members], ["Status", f.status === "full" ? "Full" : "Prov."]].map((s, i) => (
              <div key={i} style={{ padding: "18px 20px", borderRight: i < 2 ? "1px solid var(--line)" : 0 }}>
                <div style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: 30, lineHeight: 1 }}>{s[1]}</div>
                <div style={{ fontFamily: "var(--ui)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginTop: 4 }}>{s[0]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "var(--paper-2)", borderRadius: "var(--radius)" }}>
            <span style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)" }}>National championship</span>
            <span style={{ fontFamily: "var(--display)", fontWeight: 800 }}>{f.champ}</span>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <a href="#/sports" className="btn btn-gold" onClick={e=>e.preventDefault()}>Visit {f.ab} sub-site <span className="ar">→</span></a>
            <a href="#/sports" className="btn btn-ghost" style={{ color: "var(--ink)" }} onClick={e=>{e.preventDefault();onClose();}}>Find a club</a>
          </div>
          <p style={{ fontFamily: "var(--ui)", fontSize: 11.5, color: "var(--muted-2)", marginTop: 18 }}>
            Each federation runs its own sub-site on the shared template — home, governance, clubs, competitions, athletes, clean sport, news and contact.
          </p>
        </div>
      </div>
    </div>
  );
}

const FILTERS = [
  { k: "all", label: "All sports" },
  { k: "olympic", label: "On the Olympic programme" },
  { k: "recognised", label: "IF-recognised" },
  { k: "provisional", label: "Provisional" },
];

function Sports() {
  useReveal();
  const [filter, setFilter] = React.useState("all");
  const [open, setOpen] = React.useState(null);
  const list = FEDS.filter(f =>
    filter === "all" ? true :
    filter === "olympic" ? f.olympic :
    filter === "recognised" ? !f.olympic :
    filter === "provisional" ? f.status === "provisional" : true
  );
  return (
    <div>
      <PageHead crumb="Sports & Federations" title="Sports & Federations"
        sub="Six founding federations under one umbrella — each autonomous, each held to one shared standard. Plus the open, objective pathway to join them." />

      <section className="section">
        <div className="wrap">
          <div className="reveal" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 32 }}>
            <span style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginRight: 6 }}>Filter</span>
            {FILTERS.map(fl => (
              <button key={fl.k} onClick={() => setFilter(fl.k)}
                className="tag" style={{
                  cursor: "pointer", border: "1px solid var(--line)",
                  background: filter === fl.k ? "var(--ink)" : "transparent",
                  color: filter === fl.k ? "var(--gold)" : "var(--muted)", padding: "8px 14px"
                }}>{fl.label}</button>
            ))}
            <span style={{ marginLeft: "auto", fontFamily: "var(--ui)", fontSize: 13, color: "var(--muted)" }}>{list.length} of {FEDS.length} federations</span>
          </div>

          <div className="fedgrid reveal d1">
            {list.map(f => (
              <div className="fedcard" key={f.ab} onClick={() => setOpen(f)}>
                <span className="bar" style={{ background: f.c }}></span>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                  <div className="ab" style={{ color: f.c === "var(--ink)" ? "var(--ink)" : f.c }}>{f.ab}</div>
                  {f.status === "provisional" && <span className="tag tag-prov">Provisional</span>}
                </div>
                <div className="nm">{f.nm}</div>
                <div className="desc">{f.tagline}</div>
                <div className="foot">
                  <span className="meta">{f.body} · {f.olympic ? "Olympic" : "Recognised"}</span>
                  <span className="go">↗</span>
                </div>
              </div>
            ))}
          </div>
          {list.length === 0 && <p className="muted" style={{ marginTop: 24 }}>No federations match that filter yet.</p>}
        </div>
      </section>

      {/* strategy note */}
      <section className="section dark tight">
        <div className="wrap grid-2" style={{ alignItems: "center" }}>
          <div className="reveal"><Eyebrow className="light">Strategy</Eyebrow>
            <p className="bignote" style={{ color: "var(--paper)", marginTop: 18 }}>
              A wide, welcoming base everywhere — with visible <em>focus and depth</em> on athletics and archery as near-term podium bets.
            </p>
          </div>
          <p className="lead reveal d2">Europe's smallest successful sporting nations concentrate scarce resources on a few realistic medal disciplines while keeping participation broad. San Marino found a podium in a precision sport; we plan the same.</p>
        </div>
      </section>

      {/* admission */}
      <section className="section paper2">
        <div className="wrap grid-2" style={{ alignItems: "start", gap: 48 }}>
          <div className="reveal">
            <Eyebrow>Admission criteria</Eyebrow>
            <h2 className="title" style={{ fontSize: "clamp(26px,3vw,38px)" }}>One federation per sport</h2>
            <p className="lead" style={{ maxWidth: "50ch" }}>The criteria are objective and public (Bylaws Art. 4) so any prospective federation can self-assess before applying.</p>
            <ul className="checklist" style={{ marginTop: 24 }}>
              {CRITERIA.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
          <div className="reveal d2">
            <Eyebrow>The pathway</Eyebrow>
            <h2 className="title" style={{ fontSize: "clamp(26px,3vw,38px)" }}>Apply to be recognised</h2>
            <div style={{ marginTop: 20 }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 20, paddingBottom: 26, position: "relative" }}>
                  <div style={{ flex: "none", width: 42, height: 42, borderRadius: "50%", background: "var(--ink)", color: "var(--gold)", fontFamily: "var(--display)", fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>{s.n}</div>
                  {i < STEPS.length - 1 && <div style={{ position: "absolute", left: 20, top: 42, bottom: 0, width: 2, background: "var(--line)" }}></div>}
                  <div><h3 style={{ marginBottom: 4 }}>{s.t}</h3><p style={{ fontFamily: "var(--body)", color: "var(--muted)", margin: 0 }}>{s.d}</p></div>
                </div>
              ))}
            </div>
            <a href="#/about" className="btn btn-gold" style={{ marginTop: 4 }}>Start an application <span className="ar">→</span></a>
          </div>
        </div>
      </section>

      {open && <FedModal fed={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

window.Sports = Sports;
