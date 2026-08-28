// Brand language — the internal reference. This is the design document
// from the Votula brand session, built as a page.

function Brand() {
  const { COMPANY } = window.VT_DATA;
  const { Mark, Lockup, WaveRule, SectionHead } = window.VT;

  const swatches = [
    ["Liberland Yellow", "#FFD200", "primary"],
    ["Flag Black", "#06090E", "ground"],
    ["Lagoon", "#12D8B0", "signal, links"],
    ["Sunset", "#FF5A3C", "alerts, heat"],
    ["Danube Blue", "#0A6BD6", "from the arms"],
    ["Salt", "#FBF7EC", "text on dark"],
  ];

  return (
    <React.Fragment>

      {/* ── Hero — the original sunset ramp ───────────────── */}
      <section style={{ position: "relative", overflow: "hidden", paddingBottom: "clamp(110px, 14vw, 180px)" }}>
        <div className="page-hero-bg" aria-hidden="true">
          <div style={{ position: "absolute", inset: 0, background: "var(--ramp-sunset)" }} />
          <div className="sun" style={{ left: "50%", top: "34%", transform: "translate(-50%,-50%)", width: "min(560px, 70vw)", aspectRatio: 1 }} />
          <div className="grid-horizon" />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "34%", background: "linear-gradient(180deg, rgba(255,210,0,0) 0%, rgba(255,138,43,.25) 100%)" }} />
        </div>

        <div className="wrap" style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "clamp(96px,12vw,128px) 0 0", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)" }}>
            <div className="flex" style={{ gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--yellow)" }} />
              <span>{COMPANY.name} · {COMPANY.city}</span>
            </div>
            <div>Brand language v1.0</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: "clamp(72px, 10vw, 120px)" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.34em", textTransform: "uppercase", color: "#0B1A2A", background: "var(--yellow)", padding: "7px 14px", borderRadius: 999 }}>
              Liberland · Blockchain &amp; Crypto
            </div>
            <h1 className="h1" style={{ margin: "22px 0 0", fontSize: "clamp(80px,15vw,220px)", lineHeight: 0.84, letterSpacing: "-0.045em", textShadow: "0 0 60px rgba(6,9,14,.45)" }}>
              VOTULA
            </h1>
            <p className="lede" style={{ margin: "26px 0 0", maxWidth: "640px" }}>
              Sovereign money for a country that fits on a sandbar. Built offshore, priced in freedom.
            </p>
          </div>
        </div>
      </section>

      {/* ── 01 · The idea ─────────────────────────────────── */}
      <section className="section wrap">
        <div className="grid grid--split">
          <div>
            <div className="eyebrow">01 — The idea</div>
            <h2 className="h2" style={{ fontSize: "clamp(32px, 3.6vw, 48px)" }}>Tropic maximalism, ledger discipline</h2>
          </div>
          <div className="stack stack--lg" style={{ fontSize: 17, color: "var(--text-2)" }}>
            <p style={{ margin: 0 }}>
              Votula sits between two things that never share a room: a Seychelles beach and a compliance binder.
              The brand keeps both. Liberland's yellow and black hold the flagpole; the Indian Ocean supplies the
              light. Nothing is beige.
            </p>
            <p style={{ margin: 0 }}>
              Three rules run through every asset. Heat at the top, ledger at the bottom. One sun per composition.
              Type does the shouting so the graphics don't have to.
            </p>
            <div className="flex" style={{ gap: 8, paddingTop: 4 }}>
              <span className="pill pill--lagoon">Sub-brand of Liberland</span>
              <span className="pill pill--yellow">Meme-fluent, audit-ready</span>
              <span className="pill pill--sunset">Sun · Wave · Block</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · Marks ────────────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead
          index="02"
          title={{ eyebrow: "Marks", head: "Mark A is the mark" }}
          note="All three are geometric, single-weight and legible at 16px. A was selected; B and C stay here as the record."
        />

        <div className="grid grid--3" style={{ paddingTop: 32 }}>
          {/* Mark A — selected */}
          <div className="card card--clip" style={{ borderColor: "rgba(255,210,0,.45)" }} data-reveal>
            <div style={{ aspectRatio: "4/3", display: "grid", placeItems: "center", background: "radial-gradient(circle at 50% 120%, #12312C, #0B0F15 70%)", position: "relative" }}>
              <span className="status status--pending" style={{ position: "absolute", top: 16, right: 16 }}>Selected</span>
              <Mark size={150} />
            </div>
            <div style={{ padding: "20px 22px 24px" }} className="stack stack--sm">
              <div className="flex" style={{ gap: 10 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em", color: "var(--yellow)" }}>MARK A</span>
                <span className="h4" style={{ fontSize: 20 }}>Sunset V</span>
              </div>
              <p className="small">The V is a setting sun cut by the horizon. Reads as an arrow down into the water and as the first letter of the name.</p>
            </div>
          </div>

          {/* Mark B */}
          <div className="card card--clip" style={{ opacity: 0.75 }} data-reveal>
            <div style={{ aspectRatio: "4/3", display: "grid", placeItems: "center", background: "radial-gradient(circle at 50% 120%, #2A1830, #0B0F15 70%)" }}>
              <svg viewBox="0 0 120 120" width="150" height="150" aria-label="Mark B">
                <g fill="none" stroke="#FFD200" strokeWidth="8">
                  <rect x="18" y="18" width="38" height="38" rx="3" />
                  <rect x="64" y="64" width="38" height="38" rx="3" />
                </g>
                <rect x="64" y="18" width="38" height="38" rx="3" fill="#FF5A3C" />
                <circle cx="37" cy="83" r="19" fill="#12D8B0" />
              </svg>
            </div>
            <div style={{ padding: "20px 22px 24px" }} className="stack stack--sm">
              <div className="flex" style={{ gap: 10 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em", color: "var(--text-4)" }}>MARK B</span>
                <span className="h4" style={{ fontSize: 20 }}>Four Blocks</span>
              </div>
              <p className="small">A 2×2 chain: two open blocks, one sealed, one sun. Scales down to a favicon and tiles into patterns.</p>
            </div>
          </div>

          {/* Mark C */}
          <div className="card card--clip" style={{ opacity: 0.75 }} data-reveal>
            <div style={{ aspectRatio: "4/3", display: "grid", placeItems: "center", background: "radial-gradient(circle at 50% 120%, #33230E, #0B0F15 70%)" }}>
              <svg viewBox="0 0 120 120" width="150" height="150" aria-label="Mark C">
                <circle cx="60" cy="52" r="30" fill="#FFD200" />
                <g stroke="#0B0F15" strokeWidth="7" strokeLinecap="butt">
                  <line x1="30" y1="46" x2="90" y2="46" />
                  <line x1="30" y1="60" x2="90" y2="60" />
                </g>
                <path d="M18 92 q14 -12 28 0 t28 0 t28 0" stroke="#12D8B0" strokeWidth="7" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div style={{ padding: "20px 22px 24px" }} className="stack stack--sm">
              <div className="flex" style={{ gap: 10 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em", color: "var(--text-4)" }}>MARK C</span>
                <span className="h4" style={{ fontSize: 20 }}>Barred Sun</span>
              </div>
              <p className="small">Liberland's sun with two ledger bars struck through it, over one wave. The most heraldic of the three.</p>
            </div>
          </div>
        </div>

        {/* Lockups */}
        <div className="card card--pad" style={{ marginTop: 24, padding: 32 }} data-reveal>
          <div className="flex" style={{ gap: 12, marginBottom: 28 }}>
            <span className="eyebrow">Lockups</span>
            <span className="small">Clear space equals the height of the sun disc on all sides.</span>
          </div>
          <div className="grid grid--3">
            <div style={{ background: "var(--black)", borderRadius: 14, padding: 34, display: "flex", alignItems: "center", minHeight: 120 }}>
              <Lockup markSize={46} type={30} href={null} />
            </div>
            <div style={{ background: "var(--yellow)", borderRadius: 14, padding: 34, display: "flex", alignItems: "center", minHeight: 120 }}>
              <Lockup markSize={42} type={26} tone="solid" href={null} stacked />
            </div>
            <div style={{ background: "var(--black)", border: "1px solid var(--line)", borderRadius: 14, padding: "26px 34px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, minHeight: 120 }}>
              <Lockup markSize={34} type={22} href={null} />
              <div style={{ height: 1, background: "var(--line)" }} />
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)" }}>
                A Liberland company
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · Colour ───────────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead index="03" title={{ eyebrow: "Colour", head: "Flag first, ocean second" }} />
        <div className="grid" style={{ paddingTop: 32, gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
          {swatches.map(([name, hex, role]) => (
            <div key={hex} className="card card--clip" style={{ borderRadius: 16 }} data-reveal>
              <div style={{ height: 120, background: hex }} />
              <div style={{ padding: "14px 16px 16px" }} className="stack stack--sm">
                <div className="h4">{name}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-4)" }}>{hex} · {role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid--3" style={{ marginTop: 18, gap: 14 }}>
          <div className="card card--pad stack" style={{ borderRadius: 16, padding: 20 }} data-reveal>
            <div style={{ height: 56, borderRadius: 10, background: "linear-gradient(90deg,#0B1A2A,#3A1B3C,#8E2A31,#E0562C,#FFD200)" }} />
            <div className="eyebrow eyebrow--mute" style={{ letterSpacing: "0.14em" }}>Sunset ramp · hero backgrounds only</div>
          </div>
          <div className="card card--pad stack" style={{ borderRadius: 16, padding: 20 }} data-reveal>
            <div style={{ height: 56, borderRadius: 10, background: "var(--ramp-depth)" }} />
            <div className="eyebrow eyebrow--mute" style={{ letterSpacing: "0.14em" }}>Depth ramp · charts and data</div>
          </div>
          <div className="card card--pad stack stack--sm" style={{ borderRadius: 16, padding: 20 }} data-reveal>
            <div className="h4">Ratio</div>
            <div style={{ display: "flex", height: 26, borderRadius: 6, overflow: "hidden" }}>
              <div style={{ flex: 60, background: "var(--black)" }} />
              <div style={{ flex: 24, background: "var(--yellow)" }} />
              <div style={{ flex: 10, background: "var(--lagoon)" }} />
              <div style={{ flex: 6, background: "var(--sunset)" }} />
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-4)" }}>60 black · 24 yellow · 10 lagoon · 6 sunset</div>
          </div>
        </div>
      </section>

      {/* ── 04 · Type ─────────────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead index="04" title={{ eyebrow: "Type", head: "Bricolage · Space Grotesk · Space Mono" }} />
        <div className="grid grid--3" style={{ paddingTop: 32 }}>
          <div className="card card--pad stack stack--lg" style={{ padding: 28 }} data-reveal>
            <div className="eyebrow eyebrow--yellow" style={{ letterSpacing: "0.18em" }}>Display · Bricolage Grotesque 700/800</div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 62, lineHeight: 0.9, letterSpacing: "-0.04em" }}>Aa Bb 01</div>
            <p className="small">Headlines, wordmark, numbers over 32px. Tracking −3% to −4.5%. Never below 24px.</p>
          </div>
          <div className="card card--pad stack stack--lg" style={{ padding: 28 }} data-reveal>
            <div className="eyebrow" style={{ letterSpacing: "0.18em" }}>Body · Space Grotesk 400/500/700</div>
            <div style={{ fontSize: 22, lineHeight: 1.4 }}>Registered in Victoria. Settled on-chain. Reviewed by people who read the whole footnote.</div>
            <p className="small">16px base, 1.55 line height, 68ch max measure.</p>
          </div>
          <div className="card card--pad stack stack--lg" style={{ padding: 28 }} data-reveal>
            <div className="eyebrow eyebrow--sunset" style={{ letterSpacing: "0.18em" }}>Data · Space Mono 400/700</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 18, lineHeight: 1.5 }}>
              0x7A3f…9Cd2<br />1 LLM = 4.2019 USDC<br />block 18,442,907
            </div>
            <p className="small">Every hash, amount, label and eyebrow. Letterspacing .14em–.22em when uppercase.</p>
          </div>
        </div>
      </section>

      {/* ── 05 · Motifs ───────────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead index="05" title={{ eyebrow: "Motifs", head: "Five things, used sparingly" }} />
        <div className="grid" style={{ paddingTop: 32, gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
          <div className="card card--clip" data-reveal>
            <div style={{ height: 150, background: "linear-gradient(180deg,#3A1B3C,#E0562C 70%,#FFD200)" }} />
            <div style={{ padding: "16px 18px 20px" }} className="stack stack--sm">
              <div className="h4">Sunset bands</div>
              <p className="small">Vertical gradient, dark at top. Heroes and section breaks.</p>
            </div>
          </div>
          <div className="card card--clip" data-reveal>
            <div style={{ height: 150, background: "var(--black)", position: "relative", overflow: "hidden" }}>
              <div className="grid-horizon grid-horizon--lagoon" style={{ height: "100%" }} />
            </div>
            <div style={{ padding: "16px 18px 20px" }} className="stack stack--sm">
              <div className="h4">Grid horizon</div>
              <p className="small">The ledger under the beach. Fades upward, never full frame.</p>
            </div>
          </div>
          <div className="card card--clip" data-reveal>
            <div style={{ height: 150, background: "#0B1A2A", display: "grid", placeItems: "center" }}>
              <div style={{ width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle,#FFD200 40%,#FF5A3C)", boxShadow: "0 0 60px rgba(255,138,43,.5)" }} />
            </div>
            <div style={{ padding: "16px 18px 20px" }} className="stack stack--sm">
              <div className="h4">The one sun</div>
              <p className="small">Exactly one per composition. It is the light source for shadows.</p>
            </div>
          </div>
          <div className="card card--clip" data-reveal>
            <div style={{ height: 150, background: "var(--black)", display: "grid", placeItems: "center", padding: "0 20px" }}>
              <WaveRule height={40} />
            </div>
            <div style={{ padding: "16px 18px 20px" }} className="stack stack--sm">
              <div className="h4">Double wave rule</div>
              <p className="small">Replaces the horizontal divider. Lagoon over Danube blue.</p>
            </div>
          </div>
          <div className="card card--clip" data-reveal>
            <div style={{ height: 150, background: "var(--black)", display: "grid", placeItems: "center" }}>
              <svg viewBox="0 0 170 60" width="150" height="54" aria-hidden="true">
                <g fill="none" stroke="#FFD200" strokeWidth="4">
                  <rect x="6" y="18" width="30" height="24" rx="3" />
                  <rect x="52" y="18" width="30" height="24" rx="3" />
                  <rect x="98" y="18" width="30" height="24" rx="3" />
                  <rect x="144" y="18" width="20" height="24" rx="3" strokeDasharray="4 4" />
                </g>
                <g stroke="#12D8B0" strokeWidth="4">
                  <line x1="36" y1="30" x2="52" y2="30" />
                  <line x1="82" y1="30" x2="98" y2="30" />
                  <line x1="128" y1="30" x2="144" y2="30" />
                </g>
              </svg>
            </div>
            <div style={{ padding: "16px 18px 20px" }} className="stack stack--sm">
              <div className="h4">Chain strip</div>
              <p className="small">Progress, timelines, steps. Last block dashed until confirmed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 · Voice ────────────────────────────────────── */}
      <section style={{ background: "var(--yellow)", color: "var(--black)", marginTop: "clamp(56px,7vw,88px)", padding: "64px 0", overflow: "hidden" }}>
        <div className="wrap">
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7 }}>06 — Voice</div>
          <h2 className="h2" style={{ marginBottom: 28, fontWeight: 800, fontSize: "clamp(30px,3.6vw,48px)" }}>
            Short sentences. Real numbers. One joke per page.
          </h2>
          <div className="grid grid--3">
            <div style={{ background: "var(--black)", color: "var(--salt)", borderRadius: 18, padding: 24 }} className="stack">
              <div className="eyebrow" style={{ letterSpacing: "0.16em" }}>Say</div>
              {[
                "“Custody in Victoria. Settlement on-chain. Both audited, neither optional.”",
                "“Yes, there is paperwork. It is short.”",
                "“A treasury the size of a sandbar and the discipline of a bank.”",
              ].map(s => <div key={s} style={{ fontSize: 18, lineHeight: 1.35 }}>{s}</div>)}
            </div>
            <div style={{ background: "var(--black)", color: "var(--salt)", borderRadius: 18, padding: 24 }} className="stack">
              <div className="eyebrow eyebrow--sunset" style={{ letterSpacing: "0.16em" }}>Don't say</div>
              {[
                "“Revolutionising the future of decentralised finance.”",
                "“To the moon 🚀🚀”",
                "“Guaranteed returns.”",
              ].map(s => <div key={s} style={{ fontSize: 18, lineHeight: 1.35, opacity: 0.6, textDecoration: "line-through" }}>{s}</div>)}
            </div>
            <div style={{ background: "var(--black)", color: "var(--salt)", borderRadius: 18, padding: 24 }} className="stack stack--lg">
              <div className="eyebrow eyebrow--yellow" style={{ letterSpacing: "0.16em" }}>Rules</div>
              <div className="stack stack--sm" style={{ fontSize: 15, color: "var(--text-2)" }}>
                <div>Never a claim without a figure behind it.</div>
                <div>Wit sits in the noun, not in the punctuation.</div>
                <div>Regulators read the same page as degens. Write once, for both.</div>
                <div>No emoji in product surfaces. Social gets three, total.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="marquee" style={{ marginTop: 44, borderTop: "2px solid var(--black)", borderBottom: "2px solid var(--black)", padding: "12px 0" }} aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map(d => (
              <span key={d}>SUN · WAVE · BLOCK · SUN · WAVE · BLOCK · SUN · WAVE · BLOCK · SUN · WAVE · BLOCK ·</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 · Components ───────────────────────────────── */}
      <section className="section wrap">
        <SectionHead index="07" title={{ eyebrow: "Components", head: "Product surfaces" }} />
        <div className="grid grid--auto" style={{ paddingTop: 32 }}>
          <div className="card card--pad stack stack--lg" data-reveal>
            <div className="eyebrow eyebrow--mute" style={{ letterSpacing: "0.18em" }}>Buttons · 44px min height</div>
            <div className="flex">
              <button type="button" className="btn btn--primary btn--sm">Open an account</button>
              <button type="button" className="btn btn--ghost btn--sm">Read the filings</button>
              <button type="button" className="btn btn--quiet btn--sm">Docs ↗</button>
            </div>
            <div style={{ height: 1, background: "var(--line)" }} />
            <div className="eyebrow eyebrow--mute" style={{ letterSpacing: "0.18em" }}>Status pills</div>
            <div className="flex" style={{ gap: 10 }}>
              <span className="status status--settled">Settled</span>
              <span className="status status--pending">Pending 2/12</span>
              <span className="status status--alert">Reverted</span>
              <span className="status status--kyc">KYC verified</span>
            </div>
          </div>

          <div className="card card--warm card--pad stack stack--lg" data-reveal>
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <div className="eyebrow eyebrow--mute" style={{ letterSpacing: "0.18em" }}>Treasury balance</div>
              <div className="data" style={{ color: "var(--lagoon)" }}>● live</div>
            </div>
            <div className="figure" style={{ fontSize: 48 }}>
              4,201,908<span style={{ fontSize: 22, color: "var(--yellow)", marginLeft: 8, letterSpacing: 0 }}>LLM</span>
            </div>
            <svg viewBox="0 0 300 70" style={{ width: "100%", height: 70 }} preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 58 L30 50 L60 54 L90 38 L120 42 L150 26 L180 30 L210 18 L240 22 L270 10 L300 6 L300 70 L0 70 Z" fill="rgba(18,216,176,.14)" />
              <path d="M0 58 L30 50 L60 54 L90 38 L120 42 L150 26 L180 30 L210 18 L240 22 L270 10 L300 6" fill="none" stroke="var(--lagoon)" strokeWidth="3" />
            </svg>
            <div className="flex" style={{ gap: 20 }}>
              <span className="data">30d +18.4%</span>
              <span className="data">reserve ratio 1.02</span>
            </div>
          </div>

          <div className="card card--clip" data-reveal>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div className="h3">Recent settlement</div>
              <div className="data" style={{ letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-4)" }}>block 18,442,907</div>
            </div>
            <div className="ledger">
              {[
                ["0x7A3f…9Cd2", "+ 12,400.00", "settled", "Settled"],
                ["0x1c88…40Ab", "− 980.55", "pending", "Pending"],
                ["0xBe02…771F", "+ 2,019.00", "settled", "Settled"],
              ].map(([h, a, s, l]) => (
                <div key={h} className="ledger-row" style={{ gridTemplateColumns: "1fr auto auto" }}>
                  <span style={{ color: "var(--text-2)" }}>{h}</span>
                  <span>{a}</span>
                  <span className={`status status--${s}`} style={{ fontSize: 10 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: "var(--r-lg)", background: "var(--yellow)", color: "var(--black)", padding: 26, display: "grid", gap: 16, alignContent: "start", position: "relative", overflow: "hidden" }} data-reveal>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "60%", background: "repeating-linear-gradient(90deg,rgba(6,9,14,.14) 0 1px,transparent 1px 22px)", WebkitMaskImage: "linear-gradient(180deg,transparent,#000)", maskImage: "linear-gradient(180deg,transparent,#000)" }} />
            <div style={{ position: "relative", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7 }}>Citizen card</div>
            <div style={{ position: "relative", fontFamily: "var(--display)", fontWeight: 800, fontSize: 30, lineHeight: 1, letterSpacing: "-0.035em" }}>Liberland e-Residency</div>
            <div style={{ position: "relative", fontSize: 15, maxWidth: "34ch" }}>
              One identity, two jurisdictions. Your citizenship signs the transaction; Seychelles holds the entity.
            </div>
            <div className="flex" style={{ position: "relative", gap: 10, paddingTop: 6 }}>
              <Mark size={28} tone="solid" />
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>Votula · LL-004201</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 08 · Guardrails ───────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead index="08" title={{ eyebrow: "Guardrails", head: "Do, don't" }} />
        <div className="grid grid--3" style={{ paddingTop: 32 }}>
          <div className="card card--pad stack stack--sm" style={{ borderColor: "rgba(18,216,176,.35)", background: "rgba(18,216,176,.06)" }} data-reveal>
            <div className="eyebrow" style={{ letterSpacing: "0.18em" }}>Do</div>
            <div className="stack stack--sm" style={{ fontSize: 15, color: "var(--text-2)" }}>
              <div>Let black carry the page and yellow carry the point.</div>
              <div>Keep the grid horizon below the midline.</div>
              <div>Set data in Space Mono, always.</div>
              <div>Show the Liberland endorsement in every footer.</div>
            </div>
          </div>
          <div className="card card--pad stack stack--sm" style={{ borderColor: "rgba(255,90,60,.35)", background: "rgba(255,90,60,.06)" }} data-reveal>
            <div className="eyebrow eyebrow--sunset" style={{ letterSpacing: "0.18em" }}>Don't</div>
            <div className="stack stack--sm" style={{ fontSize: 15, color: "var(--text-2)" }}>
              <div>Two suns, or a sun behind text.</div>
              <div>Palm-tree clip art, or a beach photo under a headline.</div>
              <div>Yellow text on white, or lagoon on black below 14px.</div>
              <div>Redraw the coat of arms. Link to it instead.</div>
            </div>
          </div>
          <div className="card card--pad stack stack--sm" data-reveal>
            <div className="eyebrow eyebrow--yellow" style={{ letterSpacing: "0.18em" }}>Built on this</div>
            <p className="small" style={{ color: "var(--text-2)" }}>
              The system is live across the whole site. Mark A carries the favicon and every lockup; the sunset
              ramp is reserved for page heroes; the chain strip does every timeline.
            </p>
            <div className="flex" style={{ gap: 10, paddingTop: 4 }}>
              <a href="index.html" className="btn btn--quiet btn--sm">Landing</a>
              <a href="property.html" className="btn btn--quiet btn--sm">Property</a>
              <a href="llm.html" className="btn btn--quiet btn--sm">LLM</a>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

window.VT_PAGE = Brand;
