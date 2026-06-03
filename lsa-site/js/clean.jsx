/* ============================================================
   clean.jsx — Clean Sport & Integrity
   ============================================================ */

const { useReveal, Eyebrow, PageHead } = window;

function Accordion({ items }) {
  const [open, setOpen] = React.useState(0);
  return (
    <div className="accordion">
      {items.map((it, i) => (
        <div className={"acc-item" + (open === i ? " open" : "")} key={i}>
          <div className="acc-head" onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="q">{it.q}</span>
            <span className="pm">+</span>
          </div>
          <div className="acc-body" style={{ maxHeight: open === i ? 460 : 0 }}>
            <div className="inner">{it.a}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const ELIGIBILITY = [
  { t: "Bodily autonomy affirmed", d: "Each athlete owns their body. The LOS imposes no coercive prohibition on private consumption — what you do with your own body is your own." },
  { t: "Eligibility is a voluntary acceptance", d: "To enter sanctioned competition, an athlete freely and in writing accepts the relevant International Federation rules, the World Anti-Doping Code and the anti-manipulation codes." },
  { t: "Consequences confined to eligibility", d: "A breach affects eligibility to compete under LOS sanction — nothing more. There is no punishment of private conduct, no coercive sanction beyond the agreement entered." },
  { t: "Freedom to decline", d: "An athlete may decline the conditions and simply not enter sanctioned competition. The choice is always the athlete's." },
];

const ARB = [
  { n: "1", t: "Internal good-faith resolution", d: "Disputes are first addressed directly and in good faith within the federation or the LOS." },
  { n: "2", t: "Arbitration", d: "Unresolved matters go to the independent Court of Sport Arbitration of Liberland, which follows settled reasoning and higher authority." },
  { n: "3", t: "Public courts — last resort", d: "Only where arbitration cannot resolve a matter do the public courts of Liberland come into play." },
];

const DUE = [
  "Clear notice of any allegation",
  "The right to confront the evidence",
  "Time to secure counsel",
  "Proportionate sanctions only",
  "No cruel, humiliating, corporal or capital measures",
  "Reasoned decisions, published (anonymised as appropriate)",
];

const FAQ = [
  { q: "Does the LOS test for and ban substances?", a: <><p>For <strong>sanctioned competition</strong>, yes — through the rules an athlete voluntarily accepts on entry, aligned with the World Anti-Doping Code and the relevant International Federation. What is different is the framing: this is a <em>condition of entry you agree to</em>, not a coercive prohibition on what you may do with your own body in private.</p></> },
  { q: "What happens if an athlete breaches the accepted rules?", a: <><p>The consequence is confined to <strong>eligibility</strong> — the ability to compete under LOS sanction. There is no further punishment of private conduct. Any process follows the due-process guarantees set out above and may be appealed to the Court of Sport Arbitration.</p></> },
  { q: "How is combat sport compatible with the Non-Aggression Principle?", a: <><p>Combat is NAP-compatible because each contestant <strong>freely and informedly consents</strong> within published rules — consent that is revocable and never authorises harm beyond what was agreed. The MMA federation publishes its medical and safety standards in full.</p></> },
  { q: "How are minors and vulnerable participants protected?", a: <><p>A dedicated safeguarding policy governs the protection of minors and vulnerable participants across every federation, with clear, confidential reporting channels routed through the Integrity hub.</p></> },
  { q: "Where do anti-corruption and match-fixing rules sit?", a: <><p>Fraud and competition manipulation are treated as violations of <strong>property and contract</strong> — among the gravest breaches in a movement built on consent. They are prohibited under the integrity framework and reportable confidentially.</p></> },
];

function CleanSport() {
  useReveal();
  return (
    <div>
      <PageHead crumb="Clean Sport & Integrity" title="Clean Sport & Integrity"
        sub="The most distinctively Liberland part of our movement: clean sport built on consent and the Non-Aggression Principle, not coercion." />

      {/* big statement */}
      <section className="section">
        <div className="wrap">
          <div className="reveal" style={{ maxWidth: "20ch" }}><Eyebrow>The principle</Eyebrow></div>
          <p className="bignote reveal d1" style={{ marginTop: 22, maxWidth: "24ch" }}>
            Clean sport, here, is something an athlete <em>agrees to</em> — never something done <em>to</em> them.
          </p>
        </div>
      </section>

      {/* consent framework */}
      <section className="section paper2">
        <div className="wrap">
          <div className="reveal"><Eyebrow>Consent-based eligibility framework</Eyebrow>
            <h2 className="title">How eligibility works</h2>
            <p className="lead" style={{ maxWidth: "62ch" }}>The framework treats anti-doping and anti-manipulation rules as voluntarily accepted conditions of entry — never as coercive punishment of private conduct (Bylaws Art. 12).</p></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, background: "var(--line)", border: "1px solid var(--line)", marginTop: 34 }} className="reveal d1">
            {ELIGIBILITY.map((e, i) => (
              <div key={i} style={{ background: "var(--white)", padding: "30px 30px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontFamily: "var(--display)", fontWeight: 900, color: "var(--gold-deep)", fontSize: 15 }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ margin: 0 }}>{e.t}</h3>
                </div>
                <p style={{ fontFamily: "var(--body)", color: "var(--muted)", margin: "12px 0 0" }}>{e.d}</p>
              </div>
            ))}
          </div>
          <div className="callout green reveal d2" style={{ marginTop: 28 }}>
            <span className="l">The Non-Aggression Principle</span>
            <p>The NAP is the interpretive thread through eligibility, discipline and combat-sport consent: no force or fraud against person or property, and no rule that punishes a freely-made private choice.</p>
          </div>
        </div>
      </section>

      {/* arbitration ladder + due process */}
      <section className="section">
        <div className="wrap grid-2" style={{ alignItems: "start", gap: 48 }}>
          <div className="reveal">
            <Eyebrow>Court of Sport Arbitration of Liberland</Eyebrow>
            <h2 className="title" style={{ fontSize: "clamp(26px,3vw,38px)" }}>Order of resolution</h2>
            <p className="lead" style={{ maxWidth: "46ch" }}>Disputes follow a fixed ladder (Bylaws Art. 14) — the public courts are the last resort, never the first.</p>
            <div style={{ marginTop: 24 }}>
              {ARB.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 20, paddingBottom: 24, position: "relative" }}>
                  <div style={{ flex: "none", width: 42, height: 42, borderRadius: "50%", background: "var(--gold)", color: "var(--ink)", fontFamily: "var(--display)", fontWeight: 900, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>{s.n}</div>
                  {i < ARB.length - 1 && <div style={{ position: "absolute", left: 20, top: 42, bottom: 0, width: 2, background: "var(--line)" }}></div>}
                  <div><h3 style={{ marginBottom: 4 }}>{s.t}</h3><p style={{ fontFamily: "var(--body)", color: "var(--muted)", margin: 0 }}>{s.d}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal d2" style={{ position: "sticky", top: 100 }}>
            <div className="card" style={{ padding: "32px 34px" }}>
              <Eyebrow>Due-process guarantees</Eyebrow>
              <h3 style={{ marginTop: 14, fontSize: 24 }}>What every participant is owed</h3>
              <ul className="checklist" style={{ marginTop: 18 }}>
                {DUE.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
              <a href="#/about" className="btn btn-ink" style={{ marginTop: 12 }}>How to file a complaint <span className="ar">→</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section paper2">
        <div className="wrap grid-2 wide-left" style={{ alignItems: "start", gap: 48 }}>
          <div className="reveal" style={{ position: "sticky", top: 100 }}>
            <Eyebrow>Athlete FAQ</Eyebrow>
            <h2 className="title" style={{ fontSize: "clamp(26px,3vw,38px)" }}>Straight answers</h2>
            <p className="lead">The questions athletes ask most about how clean sport works at the LOS.</p>
            <div style={{ marginTop: 24 }}>
              <p style={{ fontFamily: "var(--ui)", fontWeight: 700, fontSize: 11.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 12 }}>Authoritative codes</p>
              <div className="linklist">
                <a href="#/clean-sport" onClick={e=>e.preventDefault()}>World Anti-Doping Code <span className="ar">↗</span></a>
                <a href="#/clean-sport" onClick={e=>e.preventDefault()}>WADA Prohibited List <span className="ar">↗</span></a>
                <a href="#/clean-sport" onClick={e=>e.preventDefault()}>Code on competition manipulation <span className="ar">↗</span></a>
                <a href="#/clean-sport" onClick={e=>e.preventDefault()}>Safeguarding policy <span className="ar">↗</span></a>
              </div>
            </div>
          </div>
          <div className="reveal d2"><Accordion items={FAQ} /></div>
        </div>
      </section>

      <section className="ctaband">
        <span className="big-l">✓</span>
        <div className="wrap inner">
          <h2>Report a concern,<br />in confidence.</h2>
          <a href="#/about" className="btn btn-ink">Integrity reporting channel <span className="ar">→</span></a>
        </div>
      </section>
    </div>
  );
}

window.CleanSport = CleanSport;
window.Accordion = Accordion;
