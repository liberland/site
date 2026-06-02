/* ============================================================
   home.jsx — LSOOC Home (Stadium Dark)
   ============================================================ */

const { useReveal, Eyebrow, PH, FEDS, NEWS, EVENTS, go } = window;

function CountUp({ to, suffix = "", dur = 1100 }) {
  const [n, setN] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    let raf, started = false;
    const el = ref.current;
    const run = () => {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        setN(Math.round(to * e));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting && !started) { started = true; run(); io.disconnect(); } });
    }, { threshold: 0.5 });
    if (el) io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

function Home() {
  useReveal();
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="photo">
          <div className="glow"></div>
          <div className="pl">▢ Athlete photography</div>
        </div>
        <div className="wrap inner">
          <Eyebrow className="light">National Olympic Committee of Liberland</Eyebrow>
          <h1>One Nation.<br />Every Sport.<br /><em>One Movement.</em></h1>
          <p className="sub">The voluntary confederation uniting Liberland's six founding federations — built, from day one, to the good-governance standard of the Olympic movement.</p>
          <div className="cta">
            <a href="#/sports" className="btn btn-gold">Find your sport <span className="ar">→</span></a>
            <a href="#/about" className="btn btn-ghost">How we govern</a>
          </div>
          <div className="statbar">
            <div className="stat"><div className="n"><CountUp to={6} /></div><div className="l">Founding federations</div></div>
            <div className="stat"><div className="n"><CountUp to={100} suffix="%" /></div><div className="l">Voluntarily funded</div></div>
            <div className="stat"><div className="n"><em>MMXXVI</em></div><div className="l">Founded · 2026</div></div>
            <div className="stat"><div className="n"><em>GSSE</em></div><div className="l">Near-term stage</div></div>
          </div>
        </div>
        <div className="fedstrip">
          {FEDS.map(f => (
            <div className="f" key={f.ab} onClick={() => go("/sports")}>
              <span className="dot" style={{ background: f.c }}></span>
              <div><div className="ab">{f.ab}</div><div className="nm">{f.nm}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== POSITIONING ===== */}
      <section className="section">
        <div className="wrap">
          <div className="grid-2 wide-left" style={{ alignItems: "center" }}>
            <div className="reveal">
              <Eyebrow>Who we are</Eyebrow>
              <p className="bignote" style={{ marginTop: 22 }}>
                A <em>private, voluntary association</em> serving as Liberland's Olympic Committee and the confederation of its national sports federations — transparent by charter, meritocratic by design, financed only by consent.
              </p>
            </div>
            <div className="reveal d2">
              <p className="lead">We unite autonomous federations under one umbrella and one standard of clean, transparent sport — the model proven by Europe's smallest successful sporting nations.</p>
              <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
                <a href="#/about" className="btn btn-ink">Read our charter <span className="ar">→</span></a>
                <a href="#/sports" className="btn btn-ghost" style={{ color: "var(--ink)" }}>Become a member</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEDERATIONS GRID ===== */}
      <section className="section paper2">
        <div className="wrap">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }} className="reveal">
            <div>
              <Eyebrow>Sports & Federations</Eyebrow>
              <h2 className="title" style={{ marginBottom: 0 }}>One movement,<br />six federations</h2>
            </div>
            <a href="#/sports" className="btn btn-ghost" style={{ color: "var(--ink)" }}>Full directory <span className="ar">→</span></a>
          </div>
          <div className="fedgrid reveal d1" style={{ marginTop: 36 }}>
            {FEDS.map(f => (
              <div className="fedcard" key={f.ab} onClick={() => go("/sports")}>
                <span className="bar" style={{ background: f.c }}></span>
                <div className="ab" style={{ color: f.c === "var(--ink)" ? "var(--ink)" : f.c }}>{f.ab}</div>
                <div className="nm">{f.nm}</div>
                <div className="desc">{f.tagline}</div>
                <div className="foot">
                  <span className="meta">{f.body} · {f.olympic ? "Olympic sport" : "Recognised"}</span>
                  <span className="go">↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GOVERNANCE RIBBON ===== */}
      <section className="section">
        <div className="wrap">
          <div className="grid-2" style={{ alignItems: "center", marginBottom: 40 }}>
            <div className="reveal">
              <Eyebrow>Recognition-grade governance</Eyebrow>
              <h2 className="title" style={{ marginBottom: 0 }}>Transparent<br />by charter</h2>
            </div>
            <p className="lead reveal d1">Every benchmark of the Olympic movement — the IOC's Basic Universal Principles, IPACS, the UK Code — converges on one rule: publish your statutes, structure, officials and finances. We do, openly.</p>
          </div>
          <div className="ribbon reveal d2">
            <div className="it"><b>Art. 1</b><div className="t">Voluntary association</div><div className="d">Member-based, not a state organ.</div></div>
            <div className="it"><b>Open</b><div className="t">Audited accounts</div><div className="d">Approved by the Assembly, published.</div></div>
            <div className="it"><b>Art. 7</b><div className="t">Meritocratic voting</div><div className="d">Base vote + published merit weighting.</div></div>
            <div className="it"><b>NAP</b><div className="t">Non-aggression</div><div className="d">The thread through every rule.</div></div>
          </div>
        </div>
      </section>

      {/* ===== NEWS ===== */}
      <section className="section paper2">
        <div className="wrap">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }} className="reveal">
            <div><Eyebrow>Newsroom</Eyebrow><h2 className="title" style={{ marginBottom: 0 }}>Latest from the movement</h2></div>
            <a href="#/" className="btn btn-ghost" style={{ color: "var(--ink)" }} onClick={e=>e.preventDefault()}>All news <span className="ar">→</span></a>
          </div>
          <div className="newsgrid reveal d1" style={{ marginTop: 36 }}>
            {NEWS.map((n, i) => (
              <div className={"newscard" + (i === 0 ? " lead" : "")} key={i} onClick={e=>e.preventDefault()}>
                <PH className="img" label={n.tag} style={{ "--ph": n.img, background: `linear-gradient(160deg, ${n.img}, var(--ink))` }} />
                <div className="body">
                  <div className="meta">{n.date} <span className="fd">· {n.fed}</span></div>
                  <h3>{n.title}</h3>
                  <p>{n.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EVENTS ===== */}
      <section className="section dark">
        <div className="wrap">
          <div className="grid-2" style={{ alignItems: "flex-end", marginBottom: 14 }}>
            <div><Eyebrow className="light">Games & Events</Eyebrow><h2 className="title" style={{ marginBottom: 0 }}>The road ahead</h2></div>
            <p className="lead" style={{ alignSelf: "center" }}>Our realistic near-term stage is the Games of the Small States of Europe — with the continental ladder and the Olympic Games as the long-term goal.</p>
          </div>
          <div className="events">
            {EVENTS.map((e, i) => (
              <div className="eventrow" key={i}>
                <div className="date"><span className="d">{e.d}</span> <span className="m">{e.m}</span></div>
                <div><div className="ev">{e.ev}</div><div className="loc">{e.loc}</div></div>
                <div></div>
                <div className="tier">{e.tier}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BAND ===== */}
      <section className="ctaband">
        <span className="big-l">L</span>
        <div className="wrap inner">
          <h2>Back the movement.<br />Live free, respect others.</h2>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#/support" className="btn btn-ink">Become a Patron <span className="ar">→</span></a>
            <a href="#/support" className="btn btn-ghost" style={{ color: "var(--ink)", borderColor: "var(--ink)" }}>Ways to give</a>
          </div>
        </div>
      </section>
    </div>
  );
}

window.Home = Home;
