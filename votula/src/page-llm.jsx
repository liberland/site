// LLM — Liberland Merit, and the treasury behind it.

function LLM() {
  const { PLACEHOLDER: P } = window.VT_DATA;
  const { WaveRule, PageHero, SectionHead } = window.VT;

  return (
    <React.Fragment>
      <PageHero
        eyebrow="Programme 02 · The unit"
        title="LLM, and the reserves behind it"
        lede="Liberland Merit is the unit of account across everything Votula issues. We hold the reserves and publish the ratio."
        actions={
          <React.Fragment>
            <a href="#reserves" className="btn btn--primary">See the reserves <span className="arrow">→</span></a>
            <a href="docs.html" className="btn btn--ghost">Integrate it</a>
          </React.Fragment>
        }
        aside={
          <div className="card card--warm card--pad stack stack--lg">
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <div className="eyebrow eyebrow--mute">Treasury balance</div>
              <div className="data" style={{ color: "var(--lagoon)" }}>● live</div>
            </div>
            <div className="figure" style={{ fontSize: 46 }}>
              {P.treasuryLLM}<span style={{ fontSize: 20, color: "var(--yellow)", marginLeft: 8, letterSpacing: 0 }}>LLM</span>
            </div>
            <svg viewBox="0 0 300 60" style={{ width: "100%", height: 60 }} preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 50 L30 44 L60 47 L90 33 L120 36 L150 22 L180 26 L210 15 L240 19 L270 8 L300 5 L300 60 L0 60 Z" fill="rgba(18,216,176,.14)" />
              <path d="M0 50 L30 44 L60 47 L90 33 L120 36 L150 22 L180 26 L210 15 L240 19 L270 8 L300 5" fill="none" stroke="var(--lagoon)" strokeWidth="3" />
            </svg>
            <div className="flex" style={{ gap: 18 }}>
              <span className="data">{P.treasuryChange}</span>
              <span className="data">ratio {P.reserveRatio}</span>
            </div>
          </div>
        }
      />

      {/* ── What it is ───────────────────────────────────── */}
      <section className="section wrap">
        <SectionHead
          index="01"
          title={{ eyebrow: "What it is", head: "One unit, three jobs" }}
          note="LLM is Liberland's own merit token. Votula operates the treasury that sits behind Votula-issued instruments."
        />
        <div className="grid grid--3" style={{ paddingTop: 32 }}>
          {[
            {
              c: "var(--yellow)",
              k: "Unit of account",
              t: "Everything is priced in LLM",
              b: "Property interests, distributions, fees and grants. One unit across the whole surface means one number to reconcile.",
            },
            {
              c: "var(--lagoon)",
              k: "Settlement",
              t: "Transfers clear on Liberland's chain",
              b: "Seconds, not days, and no correspondent bank in the middle deciding whether your jurisdiction exists.",
            },
            {
              c: "var(--danube-lift)",
              k: "Collateral",
              t: "Reserves stand behind issuance",
              b: "The treasury holds reserves against what Votula issues, and publishes the ratio continuously rather than quarterly.",
            },
          ].map(x => (
            <div key={x.k} className="card card--pad stack stack--lg" data-reveal style={{ position: "relative", overflow: "hidden" }}>
              <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: x.c, opacity: 0.85 }} />
              <div className="eyebrow" style={{ color: x.c }}>{x.k}</div>
              <h3 className="h3">{x.t}</h3>
              <p className="small" style={{ color: "var(--text-2)" }}>{x.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reserves ─────────────────────────────────────── */}
      <section id="reserves" className="section wrap section--flush-t">
        <SectionHead
          index="02"
          title={{ eyebrow: "Reserves", head: "The arithmetic, in public" }}
          note="Never a claim without a figure behind it. If a figure is stale, that is a bug — tell us."
        />

        <div className="grid grid--split" style={{ paddingTop: 32 }}>
          <div className="stack stack--lg" data-reveal>
            <div className="card card--pad stack stack--lg">
              <div className="eyebrow eyebrow--mute">Composition of reserves</div>
              {[
                ["Cash and equivalents", 46, "var(--yellow)"],
                ["Property SPV equity", 31, "var(--lagoon)"],
                ["Liquid digital assets", 17, "var(--danube)"],
                ["Operating buffer", 6, "var(--sunset)"],
              ].map(([label, pct, colour]) => (
                <div key={label} className="stack stack--sm">
                  <div className="flex" style={{ justifyContent: "space-between" }}>
                    <span className="small" style={{ color: "var(--text-2)" }}>{label}</span>
                    <span className="data" style={{ color: colour }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: "rgba(251,247,236,.08)", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: colour, opacity: 0.85 }} />
                  </div>
                </div>
              ))}
              <p className="small" style={{ marginTop: 4 }}>
                Illustrative composition. Replace with the audited breakdown before publication.
              </p>
            </div>
          </div>

          <div className="grid grid--2" style={{ gap: 16, alignContent: "start" }} data-reveal>
            {[
              ["Reserve ratio", P.reserveRatio, "reserves ÷ issued"],
              ["Reference price", P.llmPrice, "LLM / USDC"],
              ["Latest block", P.latestBlock, "attestation anchor"],
              ["Audits published", P.audits, "in full, not summaries"],
            ].map(([label, value, note]) => (
              <div key={label} className="card card--pad stack stack--sm">
                <div className="eyebrow eyebrow--mute">{label}</div>
                <div className="figure" style={{ fontSize: 32 }}>{value}</div>
                <div className="data">{note}</div>
              </div>
            ))}
            <div className="card card--pad stack stack--sm" style={{ gridColumn: "1 / -1" }}>
              <WaveRule height={16} opacity={0.5} />
              <p className="small" style={{ color: "var(--text-2)" }}>
                The ratio is the only number that matters and the only one we will never round. Below 1.00 we stop
                issuing and say so on this page before anywhere else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Where it moves ───────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead
          index="03"
          title={{ eyebrow: "Flow", head: "Where LLM actually moves" }}
          note="Four surfaces. Anything that does not appear here does not take LLM from us."
        />
        <div className="grid grid--4" style={{ paddingTop: 32 }}>
          {[
            ["Property subscriptions", "Buying into an SPV's fixed supply."],
            ["Distributions", "Rent and disposal proceeds, pro rata, on schedule."],
            ["Builder grants", "Milestone payments to teams shipping on Liberland."],
            ["Network fees", "Chain fees on transfers and issuance."],
          ].map(([t, b]) => (
            <div key={t} className="card card--pad stack stack--sm" data-reveal>
              <h3 className="h4">{t}</h3>
              <p className="small">{b}</p>
            </div>
          ))}
        </div>

        <div className="card card--clip" style={{ marginTop: 20 }} data-reveal>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <h3 className="h3">Recent treasury movements</h3>
            <div className="data" style={{ letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-4)" }}>block {P.latestBlock}</div>
          </div>
          <div className="ledger">
            {[
              ["0x7A3f…9Cd2", "Phase I subscription", "+ 12,400.00", "settled", "Settled"],
              ["0x1c88…40Ab", "Grant milestone 2/12", "− 980.55", "pending", "Pending"],
              ["0xBe02…771F", "Quarterly distribution", "+ 2,019.00", "settled", "Settled"],
              ["0x44dA…08e1", "Reserve rebalance", "− 4,500.00", "settled", "Settled"],
              ["0x9F10…c3B7", "Subscription (KYC clearing)", "+ 640.00", "kyc", "KYC verified"],
            ].map(([hash, memo, amt, s, label]) => (
              <div key={hash} className="ledger-row" style={{ gridTemplateColumns: "auto 1fr auto auto" }}>
                <span style={{ color: "var(--text-2)" }}>{hash}</span>
                <span style={{ color: "var(--text-4)" }}>{memo}</span>
                <span>{amt}</span>
                <span className={`status status--${s}`} style={{ fontSize: 10 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

window.VT_PAGE = LLM;
