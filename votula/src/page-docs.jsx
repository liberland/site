// Docs — the developer entry point.

function Docs() {
  const { COMPANY } = window.VT_DATA;
  const { PageHero } = window.VT;

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "quickstart", label: "Quick start" },
    { id: "property", label: "Property SPVs" },
    { id: "identity", label: "Identity" },
    { id: "llm", label: "LLM & settlement" },
    { id: "conventions", label: "Conventions" },
    { id: "support", label: "Support" },
  ];

  return (
    <React.Fragment>
      <PageHero
        eyebrow="Documentation"
        title="Read it before you deploy it"
        lede="Enough to get an SPV's supply, holders and distributions into your app in an afternoon."
        actions={
          <React.Fragment>
            <a href="#quickstart" className="btn btn--primary">Quick start <span className="arrow">→</span></a>
            <a href="builders.html#grants" className="btn btn--ghost">Grants</a>
          </React.Fragment>
        }
      />

      <section className="section wrap">
        <div style={{ display: "grid", gridTemplateColumns: "200px minmax(0,1fr)", gap: 56, alignItems: "start" }} className="docs-grid">
          <nav className="docs-nav" aria-label="Documentation sections">
            <div className="eyebrow eyebrow--mute" style={{ marginBottom: 14 }}>On this page</div>
            <div className="stack stack--sm">
              {sections.map(s => (
                <a key={s.id} href={`#${s.id}`} style={{ color: "var(--text-3)", fontSize: 14.5, padding: "3px 0" }}>{s.label}</a>
              ))}
            </div>
          </nav>

          <div className="prose" data-reveal>
            <h2 id="overview">Overview</h2>
            <p>
              Votula exposes three things: a registry of property SPVs, an identity credential derived from
              Liberland e-Residency, and settlement in LLM. Everything else in these docs is a convenience wrapper
              over those three.
            </p>
            <p>
              The design goal is that reading who owns what is one call rather than a records request. Ownership
              of a property interest is a token balance; the offering document is the authority on what that
              balance entitles you to.
            </p>
            <div className="card card--pad" style={{ margin: "24px 0", borderColor: "rgba(255,210,0,.3)", background: "rgba(255,210,0,.05)" }}>
              <p className="small" style={{ margin: 0, color: "var(--text-2)" }}>
                <strong style={{ color: "var(--yellow)" }}>Pre-release.</strong>{" "}
                Package names, contract addresses and endpoints below are placeholders pending the first public
                release. Do not ship against them yet — email{" "}
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> for current details.
              </p>
            </div>

            <h2 id="quickstart">Quick start</h2>
            <p>Install the SDK and point it at the network.</p>
            <pre><code>{`npm install @votula/sdk`}</code></pre>
            <pre><code>{`import { createClient } from "@votula/sdk";

const votula = createClient({
  network: "liberland-mainnet",
  // Read-only calls need no key. Subscriptions do.
});

const spvs = await votula.property.list();
console.log(spvs.map(s => s.id));
// → ["ark-phase-1", "ark-phase-2", ...]`}</code></pre>

            <h2 id="property">Property SPVs</h2>
            <p>
              Each SPV owns exactly one asset and issues one fixed supply. There is no rebasing, no minting after
              issuance closes, and no supply parameter that an operator can change later.
            </p>
            <h3>Reading an SPV</h3>
            <pre><code>{`const spv = await votula.property.get("ark-phase-1");

spv.asset;          // { kind: "residential", location: "Ark Village" }
spv.supply;         // total interests issued (fixed)
spv.holders;        // count of distinct holders
spv.documentUrl;    // the offering document — the authority`}</code></pre>
            <h3>Balances and transfers</h3>
            <pre><code>{`const stake = await spv.balanceOf(address);

// Transfers are gated on the recipient's identity credential.
await spv.transfer({ to, amount });`}</code></pre>
            <p>
              A transfer to an address without a valid credential reverts. This is a property of the contract, not
              a policy applied by our servers, so it holds whether or not Votula is reachable.
            </p>
            <h3>Distributions</h3>
            <pre><code>{`spv.on("distribution", ({ amountLLM, blockNumber, perInterest }) => {
  // Pro rata, in LLM, on the schedule in the offering document.
});

const history = await spv.distributions({ limit: 20 });`}</code></pre>

            <h2 id="identity">Identity</h2>
            <p>
              Liberland e-Residency is available as an on-chain credential. Your app can require one without ever
              handling the underlying documents — you check a claim, we never hand you a passport scan.
            </p>
            <pre><code>{`const id = await votula.identity.of(address);

id.verified;     // boolean
id.citizen;      // Liberland citizen vs. e-Resident
id.jurisdiction; // for offering eligibility checks`}</code></pre>
            <p>
              Treat <code>jurisdiction</code> as advisory for display and authoritative only where the offering
              document says it is. Eligibility rules change more often than credentials do.
            </p>

            <h2 id="llm">LLM &amp; settlement</h2>
            <p>
              LLM is the unit of account across every Votula surface. Quote from the published reference rate so
              your app shows the same number the treasury page does.
            </p>
            <pre><code>{`const rate = await votula.llm.reference();
// { llmPerUsdc, asOfBlock, source: "treasury" }

const ratio = await votula.llm.reserveRatio();
// reserves ÷ issued — the one number we never round`}</code></pre>

            <h2 id="conventions">Conventions</h2>
            <ul>
              <li>Amounts are integers in the smallest unit. Never parse a formatted string back into a number.</li>
              <li>Every response carries <code>asOfBlock</code>. If you cache, cache against that, not against a clock.</li>
              <li>Errors are typed and stable. Match on <code>error.code</code>, never on the message text.</li>
              <li>Breaking changes get a deprecation window measured in months, announced here first.</li>
              <li>Set data in a monospace face when you render it. It is a brand rule and it is also just correct.</li>
            </ul>

            <h2 id="support">Support</h2>
            <p>
              Integration questions, contract questions, and "this document is wrong" reports all go to the same
              place: <a href={`mailto:${COMPANY.email}?subject=Docs`}>{COMPANY.email}</a>. If you are building
              something substantial, apply to the{" "}
              <a href="builders.html#grants">grant programme</a> before you start rather than after.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .docs-nav { position: sticky; top: 96px; }
        @media (max-width: 900px) {
          .docs-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .docs-nav { position: static; border-bottom: 1px solid var(--line); padding-bottom: 20px; }
        }
      `}</style>
    </React.Fragment>
  );
}

window.VT_PAGE = Docs;
