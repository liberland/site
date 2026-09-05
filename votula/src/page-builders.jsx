// Builders — dApps on Liberland, and the grant programme.

function Builders() {
  const { PLACEHOLDER: P, CHAIN, COMPANY } = window.VT_DATA;
  const { ChainStrip, PageHero, SectionHead } = window.VT;

  // Real calls against the generated ABIs. No proprietary SDK exists,
  // and inventing one on a marketing page would be the wrong first lie.
  const snippet = `import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

import config from "./sepolia-demo.json";
import citizenPolicyAbi from "./abis/CitizenEligibilityPolicy.json";
import votingPowerAbi from "./abis/VotingPowerPolicy.json";

const client = createPublicClient({ chain: sepolia, transport: http() });

// Ask the policy. Never reimplement the rule in your UI.
const isCitizen = await client.readContract({
  address: config.citizenEligibilityPolicy,
  abi: citizenPolicyAbi,
  functionName: "isCitizenInGoodStanding",
  args: [wallet],
});

const weight = await client.readContract({
  address: config.votingPowerPolicy,
  abi: votingPowerAbi,
  functionName: "votingPower",
  args: [wallet],
});`;

  return (
    <React.Fragment>
      <PageHero
        eyebrow="Programme 03 · Builders"
        title="Build the parts we would rather not"
        lede="Contracts, identity and grants for teams shipping on Liberland's chain. We are not precious about who ships what."
        actions={
          <React.Fragment>
            <a href="#grants" className="btn btn--primary">Apply for a grant <span className="arrow">→</span></a>
            <a href="docs.html" className="btn btn--ghost">Read the docs</a>
          </React.Fragment>
        }
        aside={
          <div className="card card--warm card--pad stack stack--lg">
            <div className="eyebrow eyebrow--mute">Programme</div>
            <div className="grid grid--2" style={{ gap: 20 }}>
              <div className="stack stack--sm">
                <div className="figure" style={{ fontSize: 34 }}>{P.buildersShipping}</div>
                <div className="data">teams shipping</div>
              </div>
              <div className="stack stack--sm">
                <div className="figure" style={{ fontSize: 34 }}>{P.grantPool}</div>
                <div className="data">LLM grant pool</div>
              </div>
            </div>
            <p className="small">Milestone-based, paid in LLM, no equity taken.</p>
            <p className="small" style={{ color: "var(--text-4)" }}>
              Programme figures are illustrative until the first budget envelope is enacted.
            </p>
          </div>
        }
      />

      {/* ── What you get ─────────────────────────────────── */}
      <section className="section wrap">
        <SectionHead
          index="01"
          title={{ eyebrow: "The rails", head: "What we hand you" }}
          note="Four primitives. If you need a fifth, that is usually a grant application."
        />
        <div className="grid grid--2" style={{ paddingTop: 32 }}>
          {[
            {
              c: "var(--yellow)",
              k: "Registries",
              t: "Facts you can read directly",
              b: "Identity, stake, land titles, companies, offices, budgets, referenda and seats. Generated ABIs for every one of them ship inside the frozen release.",
            },
            {
              c: "var(--lagoon)",
              k: "Policies",
              t: "Rules you can ask instead of copying",
              b: "Citizenship, voting power, candidate eligibility, election timing, unstake portions, land signers. Ask the policy and your app stays correct after a referendum changes it.",
            },
            {
              c: "var(--danube-lift)",
              k: "Apps",
              t: "Workflows with the checks already in them",
              b: "Write through the app contracts and you inherit the office roles, eligibility gates and timelock discipline instead of reimplementing them and getting one wrong.",
            },
            {
              c: "var(--sunset)",
              k: "Distribution",
              t: "Real users, not an airdrop farm",
              b: "Liberland citizens, Ark Village subscribers and the Votula surfaces themselves. Small, specific, and actually holding assets.",
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

      {/* ── Code ─────────────────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead
          index="02"
          title={{ eyebrow: "Shape of it", head: "Ask the chain, don't copy the rule" }}
          note="There is no proprietary SDK. It is viem, wagmi and the ABIs generated at the frozen tag — like any other contract system."
        />
        <div className="grid grid--wide" style={{ paddingTop: 32 }}>
          <div className="prose" style={{ maxWidth: "none" }} data-reveal>
            <pre><code>{snippet}</code></pre>
          </div>
          <div className="stack stack--lg" data-reveal>
            <p className="body">
              Every constitutional value is governed, which means it can change by referendum without anyone
              touching your frontend. A hardcoded threshold is a bug with a delay fuse on it. Read the policy.
            </p>
            <p className="body">
              The same applies to timelock delays, election windows and unstake portions. If the contract exposes
              it, the contract is the answer — and if the docs and the Solidity disagree, the Solidity wins.
            </p>
            <div className="flex" style={{ gap: 8 }}>
              <span className="pill pill--lagoon">Generated ABIs</span>
              <span className="pill pill--yellow">Frozen tag</span>
              <span className="pill">No equity taken</span>
            </div>
            <div className="flex" style={{ gap: 12 }}>
              <a href="docs.html" className="btn btn--ghost btn--sm">Full documentation <span className="arrow">→</span></a>
              <a href={CHAIN.repo} target="_blank" rel="noopener noreferrer" className="btn btn--quiet btn--sm">Repository ↗</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Grants ───────────────────────────────────────── */}
      <section id="grants" className="section wrap section--flush-t">
        <SectionHead
          index="03"
          title={{ eyebrow: "Grants", head: "How the money arrives" }}
          note="Milestones, in LLM. The last one stays dashed until the thing actually ships."
          tone="yellow"
        />
        <div style={{ paddingTop: 40 }} data-reveal>
          <ChainStrip
            confirmed={2}
            steps={[
              { title: "Apply", body: "One page. What you are building, who it is for, and what you need to finish it." },
              { title: "Scope", body: "We agree three or four milestones and what each is worth. No equity, no token warrant." },
              { title: "Build", body: "Milestone payments land in LLM as each one clears. You keep the repository and the users." },
              { title: "Ship", body: "Live, documented and listed. This one is dashed until it is true, which is the point of the motif." },
            ]}
          />
        </div>

        <div className="grid grid--3" style={{ marginTop: 44 }}>
          {[
            ["What we fund", "Wallets, block explorers, governance and ballot interfaces, cadastre viewers, identity integrations — anything that makes a registry easier to read."],
            ["What we do not", "Yield products dressed as savings accounts, anything promising a return, and forks of things that already work."],
            ["Terms", `Paid in LLM from a ${P.grantPool} LLM pool. Milestone-based. You keep ownership of everything you build.`],
          ].map(([t, b]) => (
            <div key={t} className="card card--pad stack stack--sm" data-reveal>
              <h3 className="h4">{t}</h3>
              <p className="small">{b}</p>
            </div>
          ))}
        </div>

        <div className="card card--pad stack stack--lg" style={{ marginTop: 20, position: "relative", overflow: "hidden", padding: "clamp(28px, 4vw, 44px)" }} data-reveal>
          <div className="grid-horizon grid-horizon--lagoon" style={{ height: "60%", opacity: 0.5 }} />
          <div className="eyebrow" style={{ position: "relative" }}>Apply</div>
          <h2 className="h2" style={{ position: "relative", maxWidth: "22ch" }}>Send one page, get an answer in a week</h2>
          <div className="flex" style={{ position: "relative", gap: 12, marginTop: 6 }}>
            <a href={`mailto:${COMPANY.email}?subject=Grant%20application`} className="btn btn--primary">Email the programme <span className="arrow">→</span></a>
            <a href="company.html#contact" className="btn btn--ghost">Other ways to reach us</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

window.VT_PAGE = Builders;
