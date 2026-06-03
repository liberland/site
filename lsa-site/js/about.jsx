/* ============================================================
   about.jsx — About & Governance (transparency backbone)
   ============================================================ */

const { useReveal, Eyebrow, PH } = window;

const PRINCIPLES = [
  { n: "01", t: "Voluntariness", d: "Membership, funding and participation are by consent — never compelled." },
  { n: "02", t: "Contract & property", d: "Relationships rest on agreements freely made and property freely held." },
  { n: "03", t: "Bodily autonomy", d: "Each athlete owns their body and the choices made with it." },
  { n: "04", t: "Meritocracy", d: "Voice is earned through contribution, on published criteria." },
  { n: "05", t: "Freedom of association", d: "Federations and clubs join, organise and leave freely." },
  { n: "06", t: "Liability without immunity", d: "No office shields anyone from answering for aggression or fraud." },
];

const OFFICERS = [
  { nm: "President", role: "Executive Board", term: "Mandate 2026–2030", c: "var(--gold)" },
  { nm: "Vice-President · Sport", role: "Executive Board", term: "Mandate 2026–2030", c: "var(--green)" },
  { nm: "Vice-President · Integrity", role: "Executive Board", term: "Mandate 2026–2030", c: "var(--blue)" },
  { nm: "Secretary General", role: "Administration", term: "Mandate 2026–2028", c: "var(--red)" },
  { nm: "Chair · Athletes' Commission", role: "Elected by athletes", term: "Mandate 2026–2028", c: "var(--violet)" },
  { nm: "Chair · Ethics Commission", role: "Standing Commission", term: "Mandate 2026–2028", c: "var(--gold-deep)" },
  { nm: "Treasurer", role: "Administration", term: "Mandate 2026–2028", c: "var(--teal)" },
  { nm: "President · Court of Sport Arb.", role: "Independent", term: "Mandate 2026–2031", c: "var(--ink)" },
];

const DOCS = [
  { nm: "LOS Bylaws (current consolidated text)", mt: "PDF · Adopted MMXXVI · rev. 1.0", c: "var(--gold-deep)" },
  { nm: "Code of Ethics & Conduct", mt: "PDF · Article 12 framework", c: "var(--green)" },
  { nm: "Strategic Plan 2026–2030 (with targets)", mt: "PDF · GSSE & recognition milestones", c: "var(--blue)" },
  { nm: "Audited Annual Accounts 2026", mt: "PDF · Independently audited", c: "var(--red)" },
  { nm: "General Assembly — Founding Minutes & Decisions", mt: "PDF · Election results included", c: "var(--violet)" },
  { nm: "Organisational Regulations", mt: "PDF · Internal regulations", c: "var(--teal)" },
];

const MERIT = [
  { k: "tenure", label: "Sustained membership & good standing", w: 0.5 },
  { k: "service", label: "Volunteer service to the movement", w: 0.5 },
  { k: "delivery", label: "Federations / events delivered", w: 0.6 },
  { k: "athletes", label: "Athlete development & results", w: 0.6 },
  { k: "integrity", label: "Clean-sport & integrity record", w: 0.3 },
];

function MeritExplainer() {
  const [on, setOn] = React.useState({ tenure: true, delivery: true });
  const merit = MERIT.reduce((s, m) => s + (on[m.k] ? m.w : 0), 0);
  const total = 1 + merit;
  return (
    <div className="card" style={{ padding: "32px 34px" }}>
      <h3>How meritocratic voting works</h3>
      <p style={{ fontFamily: "var(--body)", fontSize: 16.5, color: "var(--muted)", marginTop: 4 }}>
        Every member carries a <strong style={{ color: "var(--ink)" }}>base vote of 1</strong>. A <strong style={{ color: "var(--ink)" }}>supplemental weight</strong> is added on five published, challengeable criteria (Bylaws Art. 7). Toggle the criteria to see how a member's weight is built — <em>illustrative only.</em>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, margin: "22px 0" }}>
        {MERIT.map(m => (
          <label key={m.k} style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer", fontFamily: "var(--ui)", fontSize: 14.5, fontWeight: 600 }}>
            <span onClick={() => setOn(o => ({ ...o, [m.k]: !o[m.k] }))}
              style={{ width: 42, height: 24, borderRadius: 20, background: on[m.k] ? "var(--gold)" : "var(--paper-3)", position: "relative", transition: ".18s", flex: "none" }}>
              <span style={{ position: "absolute", top: 2, left: on[m.k] ? 20 : 2, width: 20, height: 20, borderRadius: "50%", background: on[m.k] ? "var(--ink)" : "var(--white)", transition: ".18s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }}></span>
            </span>
            <span style={{ flex: 1 }}>{m.label}</span>
            <span style={{ fontFamily: "var(--display)", fontWeight: 800, color: on[m.k] ? "var(--gold-deep)" : "var(--muted-2)" }}>+{m.w.toFixed(1)}</span>
          </label>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, borderTop: "1px solid var(--line)", paddingTop: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: 14, borderRadius: 8, background: "var(--paper-2)", overflow: "hidden", display: "flex" }}>
            <div style={{ width: (1 / 3) * 100 + "%", background: "var(--ink)" }}></div>
            <div style={{ width: (merit / 3) * 100 + "%", background: "var(--gold)", transition: ".3s" }}></div>
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 8, fontFamily: "var(--ui)", fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--ink)", borderRadius: 2, marginRight: 6 }}></span>Base 1.0</span>
            <span><span style={{ display: "inline-block", width: 10, height: 10, background: "var(--gold)", borderRadius: 2, marginRight: 6 }}></span>Merit {merit.toFixed(1)}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--display)", fontWeight: 900, fontSize: 44, lineHeight: 1, color: "var(--ink)" }}>{total.toFixed(1)}</div>
          <div style={{ fontFamily: "var(--ui)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)" }}>Vote weight</div>
        </div>
      </div>
    </div>
  );
}

function PageHead({ crumb, title, sub }) {
  return (
    <section className="pagehead">
      <div className="glow"></div>
      <div className="wrap inner">
        <div className="crumbs"><a href="#/">Home</a> <span>/</span> <span style={{ color: "var(--gold)" }}>{crumb}</span></div>
        <h1>{title}</h1>
        <p className="sub">{sub}</p>
      </div>
    </section>
  );
}

function About() {
  useReveal();
  return (
    <div>
      <PageHead crumb="About & Governance" title="About & Governance"
        sub="Who we are, how we are run, and every document a recognition reviewer — or any member — should be able to find in two clicks." />

      {/* who we are */}
      <section className="section">
        <div className="wrap grid-2 wide-left" style={{ alignItems: "start" }}>
          <div className="reveal">
            <Eyebrow>Who we are</Eyebrow>
            <p className="bignote" style={{ marginTop: 20 }}>
              The LOS is a <em>private, voluntary, member-based association</em>. It acts as the National Olympic Committee of Liberland and as the confederation of its national sports federations.
            </p>
            <p style={{ marginTop: 22, maxWidth: "60ch" }}>
              It is <strong>not</strong> a tax-funded state organ. It exercises no compulsion over anyone, holds no claim on the public treasury, and exists only for as long as its members choose to sustain it (Bylaws Art. 1).
            </p>
          </div>
          <div className="reveal d2">
            <div className="callout green">
              <span className="l">Constitutional basis</span>
              <p>The Bylaws operate under, and are subordinate to, the Constitution of the Free Republic of Liberland. Where they are silent, the Constitution governs.</p>
            </div>
            <div className="callout" style={{ marginTop: 16 }}>
              <span className="l">Personal liability, no immunity</span>
              <p>No officer is shielded from liability for aggression or fraud by holding office (Bylaws Art. 3 & 14).</p>
            </div>
          </div>
        </div>
      </section>

      {/* principles */}
      <section className="section paper2">
        <div className="wrap">
          <div className="reveal"><Eyebrow>Mission, objects & values</Eyebrow>
            <h2 className="title">The foundational principles</h2>
            <p className="lead" style={{ maxWidth: "62ch" }}>Seven commitments shape every rule we write and every decision we take (Bylaws Art. 2–3).</p>
          </div>
          <div className="valuegrid reveal d1" style={{ marginTop: 34 }}>
            {PRINCIPLES.map(p => (
              <div className="valuecard" key={p.n}>
                <div className="n">{p.n}</div><h4>{p.t}</h4><p>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* org chart */}
      <section className="section">
        <div className="wrap">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 44 }}>
            <Eyebrow className="center">Governance organs</Eyebrow>
            <h2 className="title">How the LOS is structured</h2>
          </div>
          <div className="org reveal d1">
            <div className="orgnode gold"><div className="t">General Assembly</div><div className="s">Sovereign body · all member federations</div></div>
            <div className="connector"></div>
            <div className="orgnode"><div className="t">Executive Board</div><div className="s">President · Vice-Presidents</div></div>
            <div className="connector"></div>
            <div className="orgrow">
              <div className="orgnode"><div className="t">Secretary General</div><div className="s">Lean administration</div></div>
              <div className="orgnode"><div className="t">Standing Commissions</div><div className="s">Athletes · Ethics · Finance</div></div>
              <div className="orgnode"><div className="t">Court of Sport Arbitration</div><div className="s">Independent</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* people */}
      <section className="section paper2">
        <div className="wrap">
          <div className="reveal"><Eyebrow>People</Eyebrow>
            <h2 className="title">Officers & commission chairs</h2>
            <p className="lead" style={{ maxWidth: "60ch" }}>Every office, its holder and its mandate dates — alongside the published election and appointment results.</p>
          </div>
          <div className="people reveal d1" style={{ marginTop: 34 }}>
            {OFFICERS.map((o, i) => (
              <div className="person" key={i}>
                <PH className="av" label="Portrait" style={{ background: `linear-gradient(155deg, ${o.c}, var(--ink))` }} />
                <div className="nm">{o.nm}</div>
                <div className="role">{o.role}</div>
                <div className="term">{o.term}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* documents + voting */}
      <section className="section">
        <div className="wrap grid-2" style={{ alignItems: "start", gap: 48 }}>
          <div className="reveal">
            <Eyebrow>Documents library</Eyebrow>
            <h2 className="title" style={{ fontSize: "clamp(26px,3vw,36px)" }}>Everything, published</h2>
            <div className="doclist" style={{ marginTop: 20 }}>
              {DOCS.map((d, i) => (
                <div className="docrow" key={i} onClick={e=>e.preventDefault()}>
                  <span className="ic" style={{ borderColor: d.c }}></span>
                  <div><div className="nm">{d.nm}</div><div className="mt">{d.mt}</div></div>
                  <span className="dl">Download ↓</span>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal d2" style={{ position: "sticky", top: 100 }}>
            <Eyebrow>Meritocratic, not egalitarian</Eyebrow>
            <h2 className="title" style={{ fontSize: "clamp(26px,3vw,36px)" }}>Voice you earn</h2>
            <div style={{ marginTop: 20 }}><MeritExplainer /></div>
          </div>
        </div>
      </section>

      <section className="ctaband">
        <span className="big-l">§</span>
        <div className="wrap inner">
          <h2>Questions for the<br />Secretary General?</h2>
          <a href="#/clean-sport" className="btn btn-ink">Disputes & arbitration <span className="ar">→</span></a>
        </div>
      </section>
    </div>
  );
}

window.About = About;
window.PageHead = PageHead;
