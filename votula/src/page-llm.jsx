// LLM — Liberland Merit: what it is for, and what it is not.
// Figures come from VT_DATA.CHAIN, transcribed from the frozen release.

function LLM() {
  const { CHAIN } = window.VT_DATA;
  const { WaveRule, ChainStrip, PageHero, SectionHead, ParamTable } = window.VT;

  return (
    <React.Fragment>
      <PageHero
        eyebrow="Programme 03 · The unit"
        title="Merit is collateral, not currency"
        lede="LLM buys you a say, not a coffee. It is the stake behind citizenship, voting weight and candidacy — and the collateral behind a conservative USDC loan."
        actions={
          <React.Fragment>
            <a href="#stake" className="btn btn--primary">How staking works <span className="arrow">→</span></a>
            <a href="#lending" className="btn btn--ghost">Borrowing against it</a>
            <a href="docs.html#identity" className="btn btn--quiet">Integrate it</a>
          </React.Fragment>
        }
        aside={
          <div className="card card--warm card--pad stack stack--lg">
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <div className="eyebrow eyebrow--mute">Liberland Merit</div>
              <div className="data" style={{ color: "var(--yellow)" }}>ERC-20 · 18 dp</div>
            </div>
            <div className="figure" style={{ fontSize: 42 }}>
              70,000,000<span style={{ fontSize: 18, color: "var(--yellow)", marginLeft: 8, letterSpacing: 0 }}>LLM</span>
            </div>
            <div className="data">hard cap, enforced by the token</div>
            <WaveRule height={16} opacity={0.5} />
            <div className="grid grid--2" style={{ gap: 16 }}>
              <div className="stack stack--sm">
                <div className="figure" style={{ fontSize: 26 }}>5,000</div>
                <div className="data">LLM minimum citizen stake</div>
              </div>
              <div className="stack stack--sm">
                <div className="figure" style={{ fontSize: 26 }}>6,000</div>
                <div className="data">LLM candidate bond</div>
              </div>
            </div>
          </div>
        }
      />

      {/* ── 01 · What it is ──────────────────────────────── */}
      <section className="section wrap">
        <SectionHead
          index="01"
          title={{ eyebrow: "What it is", head: "One token, three jobs" }}
          note="None of the three is “spending money”. Stablecoins do that job, and the protocol keeps the two apart on purpose."
        />
        <div className="grid grid--3" style={{ paddingTop: 32 }}>
          {[
            {
              c: "var(--yellow)",
              k: "Political stake",
              t: "It buys standing, not goods",
              b: "5,000 LLM staked is the citizenship floor. Voting weight is proportional to active stake at a snapshot block — no equal base vote, no merit cap.",
            },
            {
              c: "var(--lagoon)",
              k: "Bond",
              t: "It makes a proposal cost something",
              b: "6,000 LLM to stand for Congress, and the same to put a citizen referendum on the ballot. Cheap enough to be usable, expensive enough to mean it.",
            },
            {
              c: "var(--danube-lift)",
              k: "Collateral",
              t: "It borrows without being sold",
              b: "Staked merit backs a USDC loan at 30% maximum LTV. Your stake stays political while it is lent against; a lien raises the floor rather than releasing it.",
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

        <div className="card card--pad stack stack--lg" style={{ marginTop: 20 }} data-reveal>
          <div className="eyebrow eyebrow--sunset">The hard cap is real</div>
          <p className="body">
            LLM has an exact 70,000,000-token cap at 18 decimals, and the production deployment script checks the
            external token's <code style={{ fontFamily: "var(--mono)", fontSize: 13 }}>cap()</code> and current
            supply before it will proceed. Treasury custody has no mint function and no arbitrary token call.
            Issuance and spending are separate systems, so contribution rewards can only pay out merit that is
            already sitting in the vault.
          </p>
          <p className="small">
            That is the whole anti-inflation mechanism. It is not a promise about monetary policy; it is an absence
            of the function that would break one.
          </p>
        </div>
      </section>

      {/* ── 02 · Staking ─────────────────────────────────── */}
      <section id="stake" className="section wrap section--flush-t">
        <SectionHead
          index="02"
          title={{ eyebrow: "Staking", head: "In fast, out slowly" }}
          note="Staking is one transaction. Leaving is twelve, spread over a year, and that asymmetry is the design."
          tone="yellow"
        />
        <div style={{ paddingTop: 40 }} data-reveal>
          <ChainStrip
            confirmed={3}
            steps={[
              { title: "Register", body: "An identity is created and confirmed by the identity office. One person holds one active wallet at a time." },
              { title: "Stake", body: "Approve, then stake through the app. The vault takes exact ERC-20 receipt before any accounting is credited." },
              { title: "Stand", body: "Above the 5,000 LLM floor you are a citizen in good standing: you can vote, propose with a bond, and stand for Congress at 6,000." },
              { title: "Unstake", body: "One discrete portion of the current balance is released immediately, and a 30-day welfare period begins. Voting is suspended; citizenship is not." },
              { title: "Exit", body: "Repeat. Twelve operations release roughly 10% of the original stake, because each one applies to what is left." },
            ]}
          />
        </div>

        <div className="grid grid--split" style={{ marginTop: 44 }}>
          <div className="stack stack--lg" data-reveal>
            <p className="body" style={{ fontSize: 17 }}>
              The staking vault is the only custody boundary for redeemable political stake, and one invariant holds
              across every path into and out of it: the registry's total active stake can never exceed the LLM the
              vault actually holds. Unstaking reduces the aggregate before the transfer, not after.
            </p>
            <p className="body">
              Liquidation moves active stake between people. It does not release liquid LLM, which means a
              liquidator inherits a political position rather than cashing one out.
            </p>
            <div className="flex" style={{ gap: 8 }}>
              <span className="pill pill--yellow">Exact ERC-20 receipt</span>
              <span className="pill pill--lagoon">Aggregate reduced first</span>
              <span className="pill">Person-bound</span>
            </div>
          </div>
          <div className="grid grid--2" style={{ gap: 16 }} data-reveal>
            {[
              ["Welfare, not a penalty", "The 30-day period after an unstake suspends voting but keeps you on the constitutional civic roll. You are still a citizen; you are just not deciding this one."],
              ["Wallet migration", "Two days, your own signature, and your seat, candidacy and land signing authority follow the person rather than the address."],
              ["The floor is snapshotted", "A lending lien captures the citizenship floor when it begins, so a later policy increase cannot retroactively freeze your liquidation."],
              ["No rebasing", "Stake accounting is exact integers in base units. Nothing about your balance changes while you are asleep."],
            ].map(([t, b]) => (
              <div key={t} className="card card--pad stack stack--sm">
                <h3 className="h4">{t}</h3>
                <p className="small">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · Lending ─────────────────────────────────── */}
      <section id="lending" className="section wrap section--flush-t">
        <SectionHead
          index="03"
          title={{ eyebrow: "Lending", head: "Borrow against merit, conservatively" }}
          note="A stake-backed USDC pool at launch parameters chosen to be dull. Dull is the feature."
        />
        <div className="grid grid--split" style={{ paddingTop: 32 }}>
          <div className="stack stack--lg" data-reveal>
            <p className="body" style={{ fontSize: 17 }}>
              30% maximum LTV is roughly 333% collateralisation at the moment you borrow; the 40% liquidation
              threshold is 250%. Interest compounds through one global RAY-scaled borrow index, and the effective
              rate for each elapsed interval is checkpointed — so no later donation or policy change can reprice
              time that has already passed.
            </p>
            <div className="card card--pad stack stack--sm" style={{ borderColor: "rgba(255,90,60,.3)", background: "rgba(255,90,60,.05)" }}>
              <div className="eyebrow eyebrow--sunset">Read this before you borrow</div>
              <p className="small" style={{ color: "var(--text-2)" }}>
                The launch oracle is a fixed price of 1 LLM = 2 USDC. It has no market feed and no staleness
                mechanism, which also means it does not react to a falling external LLM price: until governance
                reprices or replaces it, health factors do not move. A liquidation breaks even around 1.74 USDC
                before gas. We would rather write that down than have you discover it.
              </p>
            </div>
          </div>
          <div data-reveal>
            <ParamTable {...CHAIN.params.lending} />
          </div>
        </div>
      </section>

      {/* ── 04 · Treasury ────────────────────────────────── */}
      <section id="treasury" className="section wrap section--flush-t">
        <SectionHead
          index="04"
          title={{ eyebrow: "Treasury", head: "Where merit actually moves" }}
          note="Four routes out of the vault, each one gated by something that is not a person's discretion."
          tone="yellow"
        />
        <div className="grid grid--4" style={{ paddingTop: 32 }}>
          {[
            ["Approved budgets", "A referendum enacts a budget envelope. The vault matches request, budget, amount and asset at execution or refuses."],
            ["Office payouts", "Routed through the office executor, revalidated against current permissions, then queued in the timelock."],
            ["Contribution rewards", "LLM only, Finance-admin only, against an approved budget, with a nonzero evidence hash and a real URI."],
            ["Ministry decisions", "Bounded ERC-20 movements keyed by office, where an allowance alone is never treated as consent."],
          ].map(([t, b]) => (
            <div key={t} className="card card--pad stack stack--sm" data-reveal>
              <h3 className="h4">{t}</h3>
              <p className="small">{b}</p>
            </div>
          ))}
        </div>

        <div className="card card--pad stack stack--lg" style={{ marginTop: 20, position: "relative", overflow: "hidden", padding: "clamp(28px, 4vw, 44px)" }} data-reveal>
          <div className="grid-horizon grid-horizon--lagoon" style={{ height: "60%", opacity: 0.5 }} />
          <div className="eyebrow" style={{ position: "relative" }}>The parameters</div>
          <h2 className="h2" style={{ position: "relative", maxWidth: "24ch" }}>Every threshold, published as one table</h2>
          <p className="small" style={{ position: "relative", maxWidth: "56ch", color: "var(--text-2)" }}>
            Stake floors, bonds, quorums, timelocks and lending risk — all of it transcribed from the frozen
            release, with the Solidity manifests as the authority.
          </p>
          <div className="flex" style={{ position: "relative", gap: 12, marginTop: 6 }}>
            <a href="protocol.html#parameters" className="btn btn--primary">See the parameters <span className="arrow">→</span></a>
            <a href={CHAIN.release} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">The frozen release ↗</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

window.VT_PAGE = LLM;
