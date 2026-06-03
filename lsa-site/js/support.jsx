/* ============================================================
   support.jsx — Support & Patrons (voluntary funding only)
   ============================================================ */

const { useReveal, Eyebrow, PageHead } = window;

const SOURCES = [
  { t: "Membership dues", d: "Freely agreed by member federations." },
  { t: "Sponsorship", d: "Commercial partners who choose to back the movement." },
  { t: "Donations & bequests", d: "Gifts from individuals who share the mission." },
  { t: "Broadcasting & licensing", d: "Returns on the movement's own media and marks." },
  { t: "Returns on property", d: "Income from assets the LOS holds." },
  { t: "Patron contributions", d: "Proceeds from honorary and proprietary Patron Titles." },
];

const TIERS = [
  { name: "Supporter", price: "From €25 / year", c: "var(--green)",
    perks: ["Named on the digital recognition wall", "Newsroom & athlete-pathway updates", "Supporter's digital emblem"] },
  { name: "Patron Title — Honorary", price: "From €500", c: "var(--gold-deep)",
    perks: ["A protected, named Honorary Patron Title", "Transferable and inheritable private property", "Invitations to LOS and federation events", "Permanent place on the recognition wall"], feat: true },
  { name: "Patron Title — Proprietary", price: "By arrangement", c: "var(--violet)",
    perks: ["A proprietary Patron Title with defined rights", "Clear protection & anti-dilution terms", "Confers no power to compel anyone", "Fully transferable and inheritable"] },
];

function GiveTabs() {
  const [tab, setTab] = React.useState("donate");
  const [amt, setAmt] = React.useState(50);
  const [freq, setFreq] = React.useState("once");
  const amts = [25, 50, 100, 250];
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="tabs" style={{ margin: 0, padding: "0 30px" }}>
        <button className={tab === "donate" ? "active" : ""} onClick={() => setTab("donate")}>Donate</button>
        <button className={tab === "sponsor" ? "active" : ""} onClick={() => setTab("sponsor")}>Sponsor</button>
        <button className={tab === "patron" ? "active" : ""} onClick={() => setTab("patron")}>Become a Patron</button>
      </div>
      <div style={{ padding: "30px 30px 34px" }}>
        {tab === "donate" && (
          <div>
            <h3>Make a one-off or recurring gift</h3>
            <p style={{ fontFamily: "var(--body)", color: "var(--muted)", marginTop: 4 }}>Every contribution is voluntary and goes to the athlete pathway, clean-sport programmes and a lean administration.</p>
            <div style={{ display: "flex", gap: 8, margin: "18px 0" }}>
              {["once", "monthly", "yearly"].map(f => (
                <button key={f} onClick={() => setFreq(f)} className="tag" style={{ cursor: "pointer", padding: "8px 14px", border: "1px solid var(--line)", textTransform: "capitalize", background: freq === f ? "var(--ink)" : "transparent", color: freq === f ? "var(--gold)" : "var(--muted)" }}>{f}</button>
              ))}
            </div>
            <div className="give-amts">
              {amts.map(a => <button key={a} className={amt === a ? "active" : ""} onClick={() => setAmt(a)}>€{a}</button>)}
              <button className={amts.includes(amt) ? "" : "active"} onClick={() => setAmt(500)} style={{ width: "auto", padding: "0 18px" }}>Other</button>
            </div>
            <a href="#/support" className="btn btn-gold" onClick={e=>e.preventDefault()} style={{ width: "100%", justifyContent: "center" }}>
              Give €{amt}{freq !== "once" ? " / " + (freq === "monthly" ? "mo" : "yr") : ""} <span className="ar">→</span>
            </a>
            <p style={{ fontFamily: "var(--ui)", fontSize: 11.5, color: "var(--muted-2)", marginTop: 14, textAlign: "center" }}>Secured by the shared member identity layer · prototype — no live payment.</p>
          </div>
        )}
        {tab === "sponsor" && (
          <div>
            <h3>Partner with the movement</h3>
            <p style={{ fontFamily: "var(--body)", color: "var(--muted)", marginTop: 4 }}>Commercial partners back a transparent, fast-growing NOC at the ground floor — across the umbrella or a single federation.</p>
            <ul className="checklist" style={{ marginTop: 18 }}>
              <li>Umbrella, federation and event-level packages</li>
              <li>Brand placement governed by our emblem-use rules</li>
              <li>Full transparency — your support appears in audited accounts</li>
            </ul>
            <a href="#/about" className="btn btn-ink" onClick={e=>e.preventDefault()} style={{ marginTop: 8 }}>Request the sponsorship deck <span className="ar">→</span></a>
          </div>
        )}
        {tab === "patron" && (
          <div>
            <h3>Hold a Patron Title</h3>
            <p style={{ fontFamily: "var(--body)", color: "var(--muted)", marginTop: 4 }}>A Patron Title is protected private property — honorary or proprietary — transferable, inheritable, and conferring <strong>no power to compel</strong> anyone. Choose a title below.</p>
            <a href="#patron-tiers" className="btn btn-gold" style={{ marginTop: 16 }}>See Patron Titles <span className="ar">↓</span></a>
          </div>
        )}
      </div>
    </div>
  );
}

function Support() {
  useReveal();
  return (
    <div>
      <PageHead crumb="Support & Patrons" title="Support the movement"
        sub="The LOS is financed exclusively by voluntary means — no compelled tax, no levy, no claim on the public treasury. Here is exactly how, and how to help." />

      {/* funding model */}
      <section className="section">
        <div className="wrap">
          <div className="grid-2 wide-left" style={{ alignItems: "start", gap: 48 }}>
            <div className="reveal">
              <Eyebrow>Funding model · Bylaws Art. 13</Eyebrow>
              <p className="bignote" style={{ marginTop: 20 }}>
                Financed <em>exclusively by voluntary means</em>. No compelled tax or levy is ever imposed, and no claim is made on the public treasury.
              </p>
              <p style={{ marginTop: 20, maxWidth: "56ch" }}>State support is accepted only if it is voluntarily granted and freely accepted — never demanded (Constitution Art. I §2). The result is an organisation that exists purely by consent.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--line)", border: "1px solid var(--line)", marginTop: 28 }}>
                {SOURCES.map((s, i) => (
                  <div key={i} style={{ background: "var(--paper)", padding: "20px 22px" }}>
                    <h3 style={{ fontSize: 16 }}>{s.t}</h3>
                    <p style={{ fontFamily: "var(--body)", fontSize: 14.5, color: "var(--muted)", margin: 0 }}>{s.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal d2" style={{ position: "sticky", top: 100 }}>
              <Eyebrow>Ways to give</Eyebrow>
              <h2 className="title" style={{ fontSize: "clamp(24px,2.6vw,32px)", marginBottom: 18 }}>Back it your way</h2>
              <GiveTabs />
            </div>
          </div>
        </div>
      </section>

      {/* patron titles */}
      <section className="section paper2" id="patron-tiers">
        <div className="wrap">
          <div className="reveal"><Eyebrow>Patron Titles</Eyebrow>
            <h2 className="title">Support as property</h2>
            <p className="lead" style={{ maxWidth: "64ch" }}>A Patron Title is protected, transferable, inheritable private property (Bylaws Art. 4 & 13; Constitution Art. I §5). It confers honour and standing — but never the power to compel anyone.</p></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginTop: 36 }} className="reveal d1">
            {TIERS.map((t, i) => (
              <div className="patron-tier" key={i} style={{ borderColor: t.feat ? "var(--gold-deep)" : "var(--line)", borderWidth: t.feat ? 2 : 1, borderStyle: "solid" }}>
                <span className="crown">♛</span>
                {t.feat && <span className="tag tag-full" style={{ marginBottom: 14 }}>Most chosen</span>}
                <div className="tname">{t.name}</div>
                <div className="price">{t.price}</div>
                <ul>{t.perks.map((p, j) => <li key={j}>{p}</li>)}</ul>
                <a href="#/support" onClick={e=>e.preventDefault()} className={"btn " + (t.feat ? "btn-gold" : "btn-ink")} style={{ width: "100%", justifyContent: "center" }}>Choose {t.name.split(" ")[0]} <span className="ar">→</span></a>
              </div>
            ))}
          </div>

          <div className="callout reveal d2" style={{ marginTop: 32 }}>
            <span className="l">Tokenised proprietary instruments</span>
            <p>Where the LOS issues any tokenised proprietary instrument, it is described honestly and in full: what right it represents, how it is protected, and the rules against arbitrary dilution (Bylaws Art. 13). A token is property — and is treated like property.</p>
          </div>
        </div>
      </section>

      {/* transparency promise */}
      <section className="section dark tight">
        <div className="wrap grid-2" style={{ alignItems: "center" }}>
          <div className="reveal"><Eyebrow className="light">Transparency promise</Eyebrow>
            <p className="bignote" style={{ color: "var(--paper)", marginTop: 18 }}>
              Every euro is traceable. Our accounts are <em>independently audited</em> and published in full.
            </p>
          </div>
          <div className="reveal d2" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a href="#/about" className="btn btn-gold">View audited accounts <span className="ar">→</span></a>
            <a href="#/about" className="btn btn-ghost">Our governance</a>
          </div>
        </div>
      </section>

      <section className="ctaband">
        <span className="big-l">♛</span>
        <div className="wrap inner">
          <h2>Live free.<br />Respect others. Back sport.</h2>
          <a href="#patron-tiers" className="btn btn-ink">Become a Patron <span className="ar">→</span></a>
        </div>
      </section>
    </div>
  );
}

window.Support = Support;
