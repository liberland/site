// Landing page.

function Home() {
  const { PLACEHOLDER: P, CHAIN, COMPANY, MARQUEE } = window.VT_DATA;
  const { Mark, WaveRule, ChainStrip, SunsetBackdrop, SectionHead, Stat } = window.VT;
  const E = CHAIN.evidence;

  return (
    <React.Fragment>

      {/* ── Hero ──────────────────────────────────────────── */}
      {/* Composition rule: all copy sits on the dark half. The lower band is
          left to the ramp, the sun and the grid horizon — nothing reads over
          the heat. */}
      <section style={{ position: "relative", overflow: "hidden", paddingBottom: "clamp(150px, 19vw, 260px)" }}>
        <SunsetBackdrop full />

        <div className="wrap" style={{ position: "relative" }}>
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
              padding: "clamp(96px, 12vw, 132px) 0 0",
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.18em",
              textTransform: "uppercase", color: "var(--text-3)",
            }}
          >
            <div className="flex" style={{ gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--yellow)" }} />
              <span>{COMPANY.name} · {COMPANY.city}</span>
            </div>
            <div style={{ opacity: 0.8 }}>Est. on the Danube</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: "clamp(56px, 9vw, 104px)" }}>
            <div
              style={{
                fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.34em", textTransform: "uppercase",
                color: "#0B1A2A", background: "var(--yellow)", padding: "7px 14px", borderRadius: 999,
              }}
            >
              Liberland · Blockchain &amp; Crypto
            </div>

            <h1 className="h1" style={{ margin: "22px 0 0", fontSize: "clamp(80px, 15vw, 220px)", lineHeight: 0.84, letterSpacing: "-0.045em", textShadow: "0 0 60px rgba(6,9,14,.45)" }}>
              VOTULA
            </h1>

            <p className="lede" style={{ margin: "26px 0 0", maxWidth: "24ch", fontSize: "clamp(20px, 2.4vw, 30px)" }}>
              We run the chain a country governs itself on.
            </p>

            <p className="body" style={{ margin: "18px auto 0", maxWidth: "62ch", color: "var(--text-2)" }}>
              Votula is Liberland's blockchain and crypto branch. We operate Liberland EVM — constitution-aligned
              contracts covering identity, elections, treasury, a land cadastre and a company registry — and we build
              the property and merit rails on top of it. Registered in Victoria. Frozen for audit on {CHAIN.frozen}.
            </p>

            <div className="flex" style={{ justifyContent: "center", gap: 12, marginTop: 34 }}>
              <a href="protocol.html" className="btn btn--primary">
                Read the protocol <span className="arrow">→</span>
              </a>
              <a href="property.html#offerings" className="btn btn--ghost">View offerings</a>
              <a href="docs.html" className="btn btn--quiet">Docs ↗</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stat strip — the ground the sun sets into ─────── */}
      <section style={{ background: "var(--yellow)", color: "var(--black)", position: "relative", overflow: "hidden" }}>
        <div className="wrap" style={{ position: "relative", padding: "clamp(36px, 5vw, 52px) var(--gutter)" }}>
          <div className="grid grid--4" style={{ gap: 28 }} data-reveal>
            {[
              { label: "Tests passing", value: E.testsPassed, note: `${E.testsFailed} failing, ${E.invariants} invariants` },
              { label: "LLM hard cap", value: "70,000,000", note: "no mint in treasury custody" },
              { label: "Congress seats", value: "7", note: "90-day cycles, 17:00 UTC" },
              { label: "Audit status", value: "Frozen", note: "external review pending" },
            ].map(s => (
              <div key={s.label} className="stack stack--sm">
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.65 }}>
                  {s.label}
                </div>
                <div className="figure" style={{ fontSize: "clamp(30px, 3.4vw, 42px)" }}>
                  {s.value}
                  {s.unit && <span style={{ fontSize: "0.45em", marginLeft: 8, letterSpacing: 0, opacity: 0.7 }}>{s.unit}</span>}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, opacity: 0.6 }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────── */}
      <div className="marquee" style={{ borderTop: "2px solid var(--yellow)", borderBottom: "1px solid var(--line)", padding: "14px 0", background: "var(--black)" }} aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map(dup => (
            <span key={dup} style={{ display: "inline-flex", gap: 32 }}>
              {MARQUEE.concat(MARQUEE).map((w, i) => (
                <span key={i} style={{ color: w === "·" ? "var(--lagoon)" : "var(--salt)" }}>{w}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── 01 · What we do ──────────────────────────────── */}
      <section className="section wrap">
        <SectionHead
          index="01"
          title={{ eyebrow: "What we do", head: "Four things, one ledger" }}
          note="The protocol is the foundation. Everything else is something useful standing on it."
        />

        {/* Two-up, not auto-fit: four cards this wordy read better as 2x2 than
            as three across with an orphan underneath. */}
        <div className="grid grid--2" style={{ paddingTop: 32 }}>
          {[
            {
              href: "protocol.html",
              eyebrow: "Foundation",
              tone: "eyebrow eyebrow--yellow",
              title: "Liberland EVM",
              body: "Constitution-aligned governance in Solidity: identity, stake, referenda, Congress elections, Senate powers, treasury, land and companies. No super-admin, no arbitrary executor.",
              cta: "Read the protocol",
              accent: "var(--yellow)",
            },
            {
              href: "property.html",
              eyebrow: "Programme",
              tone: "eyebrow eyebrow--yellow",
              title: "Land and property",
              body: "A versioned on-chain cadastre with dual-consent transfers, and Seychelles vehicles that cut a deed into a fixed supply of interests. Ark Village first, then the rest of the build-out.",
              cta: "See current offerings",
              accent: "var(--yellow)",
            },
            {
              href: "llm.html",
              eyebrow: "The unit",
              tone: "eyebrow",
              title: "LLM, stake & lending",
              body: "Liberland Merit is governance collateral: an 18-decimal ERC-20 with a 70,000,000 hard cap, staked for citizenship, bonded for candidacy, and borrowable against at 30% LTV.",
              cta: "Read the merit page",
              accent: "var(--lagoon)",
            },
            {
              href: "builders.html",
              eyebrow: "The rails",
              tone: "eyebrow eyebrow--sunset",
              title: "Builder programme",
              body: "Generated ABIs, identity primitives, and grants for teams shipping on Liberland — including the apps we would rather not build ourselves.",
              cta: "Start building",
              accent: "var(--sunset)",
            },
          ].map(c => (
            <a key={c.title} href={c.href} className="card card--pad card--hover stack stack--lg" data-reveal style={{ position: "relative", overflow: "hidden", color: "inherit" }}>
              <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: c.accent, opacity: 0.85 }} />
              <div className={c.tone}>{c.eyebrow}</div>
              <h3 className="h3">{c.title}</h3>
              <p className="small" style={{ color: "var(--text-2)" }}>{c.body}</p>
              <div style={{ color: c.accent, fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>
                {c.cta} →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── 02 · Ark Village ─────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead
          index="02"
          title={{ eyebrow: "Ark Village", head: "Above all, land" }}
          note="The first and largest programme. A settlement on the Danube, financed by the people who intend to live in it."
          tone="yellow"
        />

        <div className="grid grid--split" style={{ paddingTop: 32 }}>
          <div className="stack stack--lg" data-reveal>
            <p className="body" style={{ fontSize: 17 }}>
              Ark Village is Liberland's settlement project on the Danube. Building it needs capital, and capital
              has always arrived in the wrong shape for a country this size: too slow, too large, too attached
              to a bank in another jurisdiction.
            </p>
            <p className="body">
              So we changed the shape. A unit is contributed to a Seychelles SPV. The SPV's economic interest is
              split into a fixed supply of tokens. You buy one token or four hundred, hold them in the wallet you
              already have, and receive your share of whatever the unit earns. The deed does not move. The register does.
            </p>
            <div className="flex" style={{ gap: 8 }}>
              <span className="pill pill--yellow">Fixed supply per SPV</span>
              <span className="pill pill--lagoon">Pro-rata distributions</span>
              <span className="pill">Deed held by the SPV</span>
            </div>
            <div className="flex" style={{ gap: 12, marginTop: 6 }}>
              <a href="property.html" className="btn btn--primary btn--sm">How the vehicle works <span className="arrow">→</span></a>
              <a href={COMPANY.arkUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">ark.ll.land ↗</a>
            </div>
          </div>

          <div className="stack" data-reveal>
            <div className="card card--warm card--pad stack stack--lg" style={{ position: "relative", overflow: "hidden" }}>
              <div className="flex" style={{ justifyContent: "space-between" }}>
                <div className="eyebrow eyebrow--mute">Ark Village · Phase I</div>
                <div className="data" style={{ color: "var(--lagoon)" }}>● open</div>
              </div>
              <div className="figure">
                {P.arkPhaseSold}<span style={{ color: "var(--text-4)" }}> / {P.arkPhaseUnits}</span>
                <span style={{ fontSize: "0.4em", color: "var(--yellow)", marginLeft: 10, letterSpacing: 0 }}>units placed</span>
              </div>
              <div style={{ height: 10, borderRadius: 999, background: "rgba(251,247,236,.1)", overflow: "hidden" }}>
                <div style={{ width: `${(Number(P.arkPhaseSold) / Number(P.arkPhaseUnits)) * 100}%`, height: "100%", background: "var(--ramp-depth)" }} />
              </div>
              <WaveRule height={16} opacity={0.5} />
              <div className="flex" style={{ justifyContent: "space-between" }}>
                <div className="data">Riverside · Liberland</div>
                <div className="data">Settles in stablecoin</div>
              </div>
            </div>

            <div className="card card--pad stack stack--sm">
              <div className="eyebrow eyebrow--mute">The honest part</div>
              <p className="small" style={{ color: "var(--text-2)" }}>
                Early-stage property in a young jurisdiction. Illiquid, unfinished, and priced accordingly.
                We publish the risks on the same page as the returns, because regulators and degens read the same page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · How it works ────────────────────────────── */}
      <section id="how" className="section wrap section--flush-t">
        <SectionHead
          index="03"
          title={{ eyebrow: "Mechanism", head: "How a deed becomes a token" }}
          note="Five steps. The last one stays dashed until it is confirmed — on the diagram and in real life."
        />
        <div style={{ paddingTop: 40 }} data-reveal>
          <ChainStrip
            confirmed={3}
            steps={[
              { title: "Title in", body: "A parcel or unit is contributed to a Seychelles SPV. The deed sits with the SPV, never with Votula." },
              { title: "Structure", body: "The SPV's economic interest is split into a fixed supply. One token is one share of exactly the same thing." },
              { title: "Issue", body: "Interests are issued to wallets that have cleared identity checks, against a linked identity." },
              { title: "Distribute", body: "Rent and proceeds flow back pro rata, on a published schedule." },
              { title: "Secondary venue", body: "Listing on a regulated secondary market. Not live. We will not pretend otherwise." },
            ]}
          />
        </div>
      </section>

      {/* ── 04 · Audiences ───────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead
          index="04"
          title={{ eyebrow: "Who it is for", head: "Three rooms, one page" }}
          note="Write once, for all of them. It is harder and it is the whole job."
        />
        <div className="grid grid--3" style={{ paddingTop: 32 }}>
          {[
            {
              k: "Crypto-native",
              t: "You already have the wallet",
              b: "Same keys, same chain, same two-second settlement. The difference is that this one has a roof on it.",
              c: "var(--lagoon)",
            },
            {
              k: "Liberland citizens",
              t: "Your citizenship signs it",
              b: "e-Residency is the identity layer. You are buying into the country you already joined, in the unit it already uses.",
              c: "var(--yellow)",
            },
            {
              k: "Regulators & banks",
              t: "Ask for the file",
              b: "Contracts, parameters, audit scope and every SPV in one place. Short paperwork, but there is paperwork.",
              c: "var(--danube-lift)",
            },
          ].map(a => (
            <div key={a.k} className="card card--pad stack stack--lg" data-reveal>
              <div className="eyebrow" style={{ color: a.c }}>{a.k}</div>
              <h3 className="h3">{a.t}</h3>
              <p className="small" style={{ color: "var(--text-2)" }}>{a.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05 · Live numbers ────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead
          index="05"
          title={{ eyebrow: "Proof", head: "Frozen, evidenced, unfinished" }}
          note="The whole point of a public chain is that you do not have to take our word for any of this."
        />

        <div className="grid grid--2" style={{ paddingTop: 32 }}>
          <div className="card card--warm card--pad stack stack--lg" style={{ position: "relative", overflow: "hidden" }} data-reveal>
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <div className="eyebrow eyebrow--mute">Audit freeze</div>
              <div className="data" style={{ color: "var(--yellow)" }}>◼ frozen</div>
            </div>
            <div className="data" style={{ fontSize: 15, color: "var(--text)" }}>{CHAIN.tag}</div>

            {[
              ["Statements", E.coverageStatements],
              ["Lines", E.coverageLines],
              ["Functions", E.coverageFunctions],
              ["Branches", E.coverageBranches],
            ].map(([label, pct]) => (
              <div key={label} className="stack stack--sm">
                <div className="flex" style={{ justifyContent: "space-between" }}>
                  <span className="small" style={{ color: "var(--text-2)" }}>{label}</span>
                  <span className="data" style={{ color: "var(--lagoon)" }}>{pct}</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: "rgba(251,247,236,.1)", overflow: "hidden" }}>
                  <div style={{ width: pct, height: "100%", background: "var(--ramp-depth)" }} />
                </div>
              </div>
            ))}

            <p className="small">
              {E.testsPassed} tests, {E.testsFailed} failing. Branch coverage is the weak one, and pretending
              otherwise would be the fastest way to lose the argument with an auditor.
            </p>
          </div>

          <div className="card card--clip" data-reveal>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <h3 className="h3">Module classes</h3>
              <div className="data" style={{ letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-4)" }}>
                kernel registry
              </div>
            </div>
            <div className="ledger">
              {[
                { m: "GovernanceRouter", c: "Core", s: "alert", l: "Not repointable" },
                { m: "IdentityRegistry", c: "State", s: "pending", l: "Double threshold" },
                { m: "VotingPowerPolicy", c: "Policy", s: "pending", l: "Double threshold" },
                { m: "ReferendumApp", c: "Authority", s: "pending", l: "Double threshold" },
                { m: "DecisionApp", c: "Application", s: "settled", l: "Ordinary" },
              ].map(r => (
                <div key={r.m} className="ledger-row" style={{ gridTemplateColumns: "1fr auto auto" }}>
                  <div style={{ color: "var(--text-2)" }}>{r.m}</div>
                  <div style={{ color: "var(--text-4)" }}>{r.c}</div>
                  <div className={`status status--${r.s}`} style={{ fontSize: 10 }}>{r.l}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "16px 24px 20px", borderTop: "1px solid var(--line-soft)" }}>
              <p className="small">
                A module's class decides how hard it is to replace. Router origins and the review hook are
                authorities, so no protocol-wide power changes on an ordinary vote.
              </p>
            </div>
          </div>
        </div>

        <div className="flex" style={{ gap: 12, marginTop: 20 }} data-reveal>
          <a href="protocol.html#audit" className="btn btn--ghost btn--sm">See the audit status <span className="arrow">→</span></a>
          <a href={CHAIN.release} target="_blank" rel="noopener noreferrer" className="btn btn--quiet btn--sm">The frozen release ↗</a>
        </div>
      </section>

      {/* ── 06 · Liberland tie ───────────────────────────── */}
      <section style={{ background: "var(--yellow)", color: "var(--black)", marginTop: "clamp(56px, 7vw, 88px)", padding: "clamp(56px, 7vw, 88px) 0", position: "relative", overflow: "hidden" }}>
        <div className="wrap" style={{ position: "relative" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.7 }}>
            06 — The tie
          </div>
          <h2 className="h2" style={{ marginBottom: 28, fontWeight: 800 }}>
            One identity, two jurisdictions
          </h2>

          <div className="grid grid--split">
            <div className="stack stack--lg">
              <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0, maxWidth: "48ch" }}>
                Liberland issues the citizenship and the merit. Seychelles holds the entity and the deeds.
                Your key signs across both. That is the whole trick, and it is the reason a country the size
                of a sandbar can hold a property register at all.
              </p>
              <div className="flex" style={{ gap: 12 }}>
                <a href="company.html#structure" className="btn btn--onYellow btn--sm">See the structure <span className="arrow">→</span></a>
                <a href={COMPANY.parentUrl} target="_blank" rel="noopener noreferrer" className="btn btn--sm" style={{ border: "1.5px solid rgba(6,9,14,.35)", color: "var(--black)" }}>
                  liberland.org ↗
                </a>
              </div>
            </div>

            {/* Citizen card */}
            <div style={{ background: "var(--black)", color: "var(--salt)", borderRadius: "var(--r-lg)", padding: 26, display: "grid", gap: 16, alignContent: "start", position: "relative", overflow: "hidden" }}>
              <div className="grid-horizon grid-horizon--lagoon" style={{ height: "60%" }} />
              <div className="eyebrow eyebrow--mute" style={{ position: "relative" }}>Citizen card</div>
              <div style={{ position: "relative", fontFamily: "var(--display)", fontWeight: 800, fontSize: 30, lineHeight: 1, letterSpacing: "-0.035em" }}>
                Liberland e-Residency
              </div>
              <p className="small" style={{ position: "relative", color: "var(--text-2)", maxWidth: "34ch" }}>
                Your citizenship signs the transaction; Seychelles holds the entity; the token records the share.
              </p>
              <div className="flex" style={{ position: "relative", gap: 10, paddingTop: 6 }}>
                <Mark size={28} tone="light" />
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--text-3)" }}>
                  Votula · LL-004201
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────── */}
      <section className="section wrap" style={{ position: "relative", overflow: "hidden" }}>
        <div className="card card--pad stack stack--lg" style={{ position: "relative", overflow: "hidden", padding: "clamp(32px, 5vw, 56px)", textAlign: "center", alignItems: "center", justifyItems: "center" }} data-reveal>
          <div className="grid-horizon" style={{ height: "55%", opacity: 0.6 }} />
          <div className="eyebrow" style={{ position: "relative" }}>Next</div>
          <h2 className="h2" style={{ position: "relative", maxWidth: "18ch" }}>Own a piece of the smallest country that will have you</h2>
          <p className="small" style={{ position: "relative", maxWidth: "52ch", color: "var(--text-2)" }}>
            Offerings open in phases and close when they fill. Identity checks take a day; the paperwork is short.
          </p>
          <div className="flex" style={{ position: "relative", justifyContent: "center", gap: 12, marginTop: 6 }}>
            <a href="property.html#offerings" className="btn btn--primary">View offerings <span className="arrow">→</span></a>
            <a href="company.html#contact" className="btn btn--ghost">Talk to us</a>
          </div>
        </div>
      </section>

    </React.Fragment>
  );
}

window.VT_PAGE = Home;
