// Protocol — Liberland EVM, the thing Votula actually operates.
// Every figure on this page comes from the frozen release named in
// VT_DATA.CHAIN. If the repository moves, edit data.jsx, not this file.

function Protocol() {
  const { CHAIN, COMPANY } = window.VT_DATA;
  const { PageHero, SectionHead, ParamTable, LayerCard, WaveRule, ChainStrip } = window.VT;
  const E = CHAIN.evidence;
  const P = CHAIN.params;

  const systems = [
    {
      c: "var(--yellow)",
      k: "Identity",
      t: "One person, one active wallet",
      b: "Citizenship, e-Residency, delayed wallet migration and self-renunciation. Political authority follows the person, not the address, so a migrated key keeps its seat and its candidacy.",
    },
    {
      c: "var(--lagoon)",
      k: "Stake",
      t: "Custody with an arithmetic floor",
      b: "LLMStakingVault is the sole custody boundary for redeemable political stake. Total active stake can never exceed the vault's LLM balance — that is an invariant, not a policy.",
    },
    {
      c: "var(--danube-lift)",
      k: "Referenda",
      t: "Stake-weighted, with a double threshold",
      b: "Ordinary votes are stake-proportional. Constitutional changes need half the electorate by headcount and 65% of weighted turnout. Both are snapshotted when the referendum is created.",
    },
    {
      c: "var(--yellow)",
      k: "Elections",
      t: "Congress on a cadence that cannot drift",
      b: "Weighted, cycle-scoped ballots and deterministic recurring windows anchored to 17:00 UTC. Late finalization advances to the next boundary rather than to the hour someone happened to send the transaction.",
    },
    {
      c: "var(--sunset-soft)",
      k: "Senate",
      t: "Negative powers only",
      b: "Cancellation, veto, sub-legal repeal and documented disbursement suspension. The current Senate app exposes no positive execution function at all.",
    },
    {
      c: "var(--lagoon)",
      k: "Treasury",
      t: "Budgets are laws",
      b: "Assets leave only through an allowlisted ERC-20 path against an exact active budget commitment. There is no mint function anywhere in treasury custody.",
    },
    {
      c: "var(--yellow)",
      k: "Land cadastre",
      t: "Titles held by parties, not addresses",
      b: "Versioned parcels and titles with chained content hashes, dual-consent EIP-712 transfers, and atomic subdivision, merge and boundary adjustment.",
    },
    {
      c: "var(--danube-lift)",
      k: "Companies",
      t: "A registry with real filings",
      b: "Official directors, share classes, share ledgers and filings — and no child state at all while a company is pending, so a rejected application cannot inherit hidden approval.",
    },
    {
      c: "var(--sunset-soft)",
      k: "Lending",
      t: "Stake-backed USDC, conservatively",
      b: "30% maximum LTV against staked LLM at a fixed launch price, one global RAY-scaled borrow index, and liens that raise the retained-stake floor rather than bypassing it.",
    },
  ];

  return (
    <React.Fragment>
      <PageHero
        eyebrow="Programme 01 · Protocol"
        title="A constitution you can compile"
        lede="Votula operates Liberland EVM: bounded governance contracts where the rule is the code, and the code is public."
        actions={
          <React.Fragment>
            <a href={CHAIN.release} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
              The frozen release <span className="arrow">↗</span>
            </a>
            <a href="docs.html" className="btn btn--ghost">Integrate it</a>
            <a href="#audit" className="btn btn--quiet">Audit status</a>
          </React.Fragment>
        }
        aside={
          <div className="card card--warm card--pad stack stack--lg">
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <div className="eyebrow eyebrow--mute">Release</div>
              <div className="data" style={{ color: "var(--yellow)" }}>◼ frozen</div>
            </div>
            <div className="stack stack--sm">
              <div className="data" style={{ fontSize: 15, color: "var(--text)" }}>{CHAIN.tag}</div>
              <div className="data">{CHAIN.frozen} · pending external audit</div>
            </div>
            <WaveRule height={16} opacity={0.5} />
            <div className="grid grid--2" style={{ gap: 16 }}>
              <div className="stack stack--sm">
                <div className="figure" style={{ fontSize: 30 }}>{E.testsPassed}</div>
                <div className="data">tests passing</div>
              </div>
              <div className="stack stack--sm">
                <div className="figure" style={{ fontSize: 30 }}>{E.invariants}</div>
                <div className="data">stateful invariants</div>
              </div>
            </div>
            <p className="small">
              Solidity {CHAIN.build.solidity} · EVM {CHAIN.build.evm} · optimizer {CHAIN.build.optimizer}.
            </p>
          </div>
        }
      />

      {/* ── 01 · Not a DAO ───────────────────────────────── */}
      <section className="section wrap">
        <SectionHead
          index="01"
          title={{ eyebrow: "What it is", head: "It is not a generic DAO" }}
          note="A DAO is a treasury with a vote attached. This is a state: branches, terms, thresholds, and a timelock that does not care who you are."
        />
        <div className="grid grid--split" style={{ paddingTop: 32 }}>
          <div className="stack stack--lg" data-reveal>
            <p className="body" style={{ fontSize: 17 }}>
              Liberland EVM is a modular, constitution-aligned governance protocol in Solidity. Registries hold the
              facts. Policies decide the rules over those facts. Apps run bounded workflows. A non-repointable router
              and timelock sit underneath all three and are the only execution trust root.
            </p>
            <p className="body">
              The design constraint that shaped everything else: no contract in the system may hold a power that the
              constitution does not grant it. That rules out the shortcuts most governance codebases take — the
              emergency multisig, the arbitrary-call executor, the upgrade key held by whoever deployed it.
            </p>
            <p className="body">
              What is left is slower and considerably harder to write. It is also the only version where reading the
              code tells you who can actually do what.
            </p>
            <div className="flex" style={{ gap: 8 }}>
              <span className="pill pill--yellow">Bounded action types</span>
              <span className="pill pill--lagoon">Pinned targets</span>
              <span className="pill">Person-bound authority</span>
            </div>
          </div>

          <div className="card card--pad stack stack--lg" data-reveal>
            <div className="eyebrow eyebrow--sunset">Deliberate constraints</div>
            <div className="stack stack--sm">
              {CHAIN.constraints.map(c => (
                <div key={c} className="flex" style={{ gap: 10, alignItems: "flex-start", flexWrap: "nowrap" }}>
                  <span aria-hidden="true" style={{ color: "var(--sunset-soft)", fontFamily: "var(--mono)", fontSize: 13, lineHeight: "1.55", flex: "none" }}>—</span>
                  <span className="small" style={{ color: "var(--text-2)" }}>{c}</span>
                </div>
              ))}
            </div>
            <p className="small" style={{ color: "var(--text-4)" }}>
              Each of these is a thing the code refuses to do, verified in the test suite rather than promised in a
              blog post.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 · Module map ──────────────────────────────── */}
      <section id="modules" className="section wrap section--flush-t">
        <SectionHead
          index="02"
          title={{ eyebrow: "Module map", head: "Four layers, one kernel" }}
          note="Every module has a class, and its class decides how hard it is to replace. Core cannot be replaced at all."
          tone="yellow"
        />
        <div className="stack stack--lg" style={{ paddingTop: 32 }} data-reveal>
          {CHAIN.layers.map((layer, i) => (
            <React.Fragment key={layer.id}>
              <LayerCard
                name={layer.name}
                note={layer.note}
                modules={layer.modules}
                colour={layer.colour}
                badge={`${layer.modules.length} ${layer.modules.length === 1 ? "module" : "modules"}`}
              />
              {i < CHAIN.layers.length - 1 && (
                <div style={{ display: "grid", placeItems: "center", height: 22 }} aria-hidden="true">
                  <span style={{ width: 2, height: "100%", background: "var(--lagoon)", opacity: 0.45 }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid--3" style={{ marginTop: 24 }}>
          {[
            ["Core", "Router and timelock. Never repointable, by construction."],
            ["State, Policy, Authority", "Replaceable only through the constitutional double threshold, and only with a separately reviewed migration."],
            ["Application", "Bounded workflow pointers with no routing or review power. Ordinary module threshold."],
          ].map(([t, b]) => (
            <div key={t} className="card card--pad stack stack--sm" data-reveal>
              <h3 className="h4">{t}</h3>
              <p className="small">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 03 · Systems ─────────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead
          index="03"
          title={{ eyebrow: "Systems", head: "What the chain actually does" }}
          note="Nine systems, all implemented and all in the audit scope. None of them are a roadmap item."
        />
        <div className="grid grid--auto" style={{ paddingTop: 32 }}>
          {systems.map(x => (
            <div key={x.k} className="card card--pad stack stack--lg" data-reveal style={{ position: "relative", overflow: "hidden" }}>
              <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: x.c, opacity: 0.85 }} />
              <div className="eyebrow" style={{ color: x.c }}>{x.k}</div>
              <h3 className="h3">{x.t}</h3>
              <p className="small" style={{ color: "var(--text-2)" }}>{x.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 04 · How a change lands ──────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead
          index="04"
          title={{ eyebrow: "Mechanism", head: "How a rule change reaches the chain" }}
          note="Five steps, each of which can stop the change. The last one stays dashed because nothing executes on time by itself."
        />
        <div style={{ paddingTop: 40 }} data-reveal>
          <ChainStrip
            confirmed={3}
            steps={[
              { title: "Propose", body: "A citizen or Congress creates a referendum against an exact target address. A citizen proposal posts a 6,000 LLM bond." },
              { title: "Vote", body: "Stake-weighted, minimum seven days, against an electorate snapshotted at the last completed block when the referendum was created." },
              { title: "Queue", body: "Adoption delay, then a bounded typed action in the timelock with a pinned target, an earliest execution time and an expiry." },
              { title: "Object", body: "The Senate may cancel, and citizens may public-veto. Both are negative powers with published, hashed reasons." },
              { title: "Execute", body: "Anyone may execute once it is executable. The EVM cannot wake itself at a timestamp, so this step waits for a human with gas." },
            ]}
          />
        </div>
      </section>

      {/* ── 05 · Parameters ──────────────────────────────── */}
      <section id="parameters" className="section wrap section--flush-t">
        <SectionHead
          index="05"
          title={{ eyebrow: "Parameters", head: "The whole manifest, in public" }}
          note="Transcribed from docs/Protocol-Parameters.md at the frozen tag. The Solidity manifests remain authoritative."
          tone="yellow"
        />
        <div className="grid grid--2" style={{ paddingTop: 32 }}>
          <div className="stack stack--lg" data-reveal>
            <ParamTable {...P.network} note="Both networks anchor election ends to 17:00 UTC — 18:00 in fixed CET, deliberately not daylight-saving CEST." />
            <ParamTable {...P.thresholds} />
            <ParamTable {...P.timelocks} />
          </div>
          <div className="stack stack--lg" data-reveal>
            <ParamTable {...P.llm} note="LLM is not minted by the Treasury. Contribution rewards spend a reserve that already exists in the vault." />
            <ParamTable {...P.senate} />
            <ParamTable {...P.lending} note="The fixed oracle is a launch decision, not a market feed. Until it is repriced, a falling external LLM price does not move on-chain health factors." />
          </div>
        </div>
      </section>

      {/* ── 06 · Audit status ────────────────────────────── */}
      <section id="audit" className="section wrap section--flush-t">
        <SectionHead
          index="06"
          title={{ eyebrow: "Audit", head: "Where the code honestly stands" }}
          note="Frozen, evidenced, and not yet independently reviewed. Saying so is cheaper than being caught not saying so."
          tone="sunset"
        />

        <div className="grid grid--4" style={{ paddingTop: 32 }} data-reveal>
          {[
            { label: "Tests", value: E.testsPassed, note: `${E.testsFailed} failing` },
            { label: "Statement coverage", value: E.coverageStatements, note: `lines ${E.coverageLines}` },
            { label: "Branch coverage", value: E.coverageBranches, note: `functions ${E.coverageFunctions}` },
            { label: "Slither results", value: E.slitherReviewed, note: `of ${E.slitherRaw} raw, triaged` },
          ].map(s => (
            <div key={s.label} className="card card--pad stack stack--sm">
              <div className="eyebrow eyebrow--mute">{s.label}</div>
              <div className="figure" style={{ fontSize: 34 }}>{s.value}</div>
              <div className="data">{s.note}</div>
            </div>
          ))}
        </div>

        <div className="grid grid--split" style={{ marginTop: 20 }}>
          <div className="card card--pad stack stack--lg" style={{ borderColor: "rgba(255,90,60,.3)", background: "rgba(255,90,60,.05)" }} data-reveal>
            <div className="eyebrow eyebrow--sunset">What this is not</div>
            <p className="small" style={{ color: "var(--text-2)" }}>
              The report at the frozen tag is internal engineering evidence. It is not an independent audit, not a
              lending-economic certification, and not mainnet approval. Its own verdict says so in as many words:
            </p>
            <p className="body" style={{ fontSize: 15, color: "var(--text)", borderLeft: "2px solid var(--sunset)", paddingLeft: 14 }}>
              “{E.verdict}”
            </p>
            <p className="small">
              An external auditor is expected to rerun every command against the exact commit rather than to trust
              that table. The scope they are being handed is published alongside it.
            </p>
          </div>

          <div className="stack stack--lg" data-reveal>
            <div className="card card--pad stack stack--sm">
              <div className="eyebrow eyebrow--mute">Invariants</div>
              <p className="small" style={{ color: "var(--text-2)" }}>
                {E.invariants} stateful invariant suites, {E.invariantRuns}, zero handler reverts. These are the
                properties that must hold no matter what order anyone calls things in — stake never exceeding vault
                custody, debt never surviving repayment, seats never exceeding capacity.
              </p>
            </div>
            <div className="card card--pad stack stack--sm">
              <div className="eyebrow eyebrow--mute">Runtime size</div>
              <p className="small" style={{ color: "var(--text-2)" }}>
                The EIP-170 limit is {E.sizeLimit} bytes. {E.largestContract} compiles to {E.largestSize}, leaving{" "}
                {E.largestMargin} bytes of headroom — room for roughly one more good idea, and a standing reason to
                decompose it before the next one.
              </p>
            </div>
            <div className="flex" style={{ gap: 12 }}>
              <a href={CHAIN.release} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">
                Read the release ↗
              </a>
              <a href={CHAIN.repo} target="_blank" rel="noopener noreferrer" className="btn btn--quiet btn--sm">
                Repository ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 · Who holds what ──────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead
          index="07"
          title={{ eyebrow: "Operator", head: "We run it. We do not own it." }}
          note="The distinction matters more here than in most places, because the code enforces it."
        />
        <div className="grid grid--3" style={{ paddingTop: 32 }}>
          {[
            {
              c: "var(--yellow)",
              k: "Liberland",
              t: "Holds the authority",
              b: "Citizens, Congress, Senate and the President hold every power the protocol grants. Votula holds none of them and cannot vote your stake.",
            },
            {
              c: "var(--lagoon)",
              k: "Votula",
              t: "Holds the pager",
              b: "Deployment, parameter manifests, the audit handoff, the frontends, and the operational work of keeping a public chain answerable to people who did not write it.",
            },
            {
              c: "var(--danube-lift)",
              k: "You",
              t: "Hold the keys",
              b: "Self-custody, one active wallet per person, and a migration path that takes two days and your own signature. Nobody here can move your stake.",
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

        <div className="card card--pad stack stack--lg" style={{ marginTop: 20, position: "relative", overflow: "hidden", padding: "clamp(28px, 4vw, 44px)" }} data-reveal>
          <div className="grid-horizon grid-horizon--lagoon" style={{ height: "60%", opacity: 0.5 }} />
          <div className="eyebrow" style={{ position: "relative" }}>Next</div>
          <h2 className="h2" style={{ position: "relative", maxWidth: "24ch" }}>Read the contracts before you trust the summary</h2>
          <p className="small" style={{ position: "relative", maxWidth: "58ch", color: "var(--text-2)" }}>
            Everything on this page is transcribed from the frozen tag. Where this page and the Solidity disagree,
            the Solidity is right and this page is a bug — tell us at {COMPANY.email}.
          </p>
          <div className="flex" style={{ position: "relative", gap: 12, marginTop: 6 }}>
            <a href="docs.html" className="btn btn--primary">Integration docs <span className="arrow">→</span></a>
            <a href={`mailto:${COMPANY.email}?subject=Protocol`} className="btn btn--ghost">Ask about the protocol</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

window.VT_PAGE = Protocol;
