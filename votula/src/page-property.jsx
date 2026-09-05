// Tokenised property — the flagship programme.

function Property() {
  const { PLACEHOLDER: P, COMPANY } = window.VT_DATA;
  const { WaveRule, ChainStrip, PageHero, SectionHead } = window.VT;

  const offerings = [
    {
      id: "ark-1",
      name: "Ark Village · Phase I",
      kind: "Residential units",
      status: "open",
      statusLabel: "Open",
      blurb: "The first riverside cluster. Units are contributed to a single SPV and split into a fixed supply of interests.",
      placed: P.arkPhaseSold,
      total: P.arkPhaseUnits,
      unit: "units placed",
      facts: [["Vehicle", "Seychelles SPV"], ["Settles in", "Stablecoin"], ["Distribution", "Quarterly, pro rata"]],
    },
    {
      id: "ark-2",
      name: "Ark Village · Phase II",
      kind: "Mixed use",
      status: "pending",
      statusLabel: "Structuring",
      blurb: "Workshops, a dock and the commercial frontage. Documents are being drafted; nothing is being sold yet.",
      placed: "—",
      total: "—",
      unit: "not yet issued",
      facts: [["Vehicle", "In formation"], ["Settles in", "Stablecoin"], ["Distribution", "To be set"]],
    },
    {
      id: "liberland-land",
      name: "Liberland land parcels",
      kind: "Undeveloped land",
      status: "pending",
      statusLabel: "Register first",
      blurb: "Parcels across the territory. These follow the register, not the other way round — we issue nothing until the title is clean.",
      placed: P.parcelsTokenised,
      total: "—",
      unit: "parcels recorded",
      facts: [["Vehicle", "Per-parcel SPV"], ["Settles in", "Stablecoin"], ["Distribution", "On disposal"]],
    },
  ];

  return (
    <React.Fragment>
      <PageHero
        eyebrow="Programme 01 · Property"
        title="Deeds, cut into pieces"
        lede="A parcel goes into a company. The company's economic interest becomes a fixed supply of tokens. You buy one of them."
        actions={
          <React.Fragment>
            <a href="#offerings" className="btn btn--primary">Current offerings <span className="arrow">→</span></a>
            <a href="#risk" className="btn btn--ghost">Read the risks</a>
          </React.Fragment>
        }
        aside={
          <div className="card card--warm card--pad stack stack--lg">
            <div className="eyebrow eyebrow--mute">At a glance</div>
            <div className="grid grid--2" style={{ gap: 20 }}>
              <div className="stack stack--sm">
                <div className="figure" style={{ fontSize: 34 }}>{P.parcelsTokenised}</div>
                <div className="data">parcels recorded</div>
              </div>
              <div className="stack stack--sm">
                <div className="figure" style={{ fontSize: 34 }}>{P.arkPhaseSold}<span style={{ color: "var(--text-4)" }}>/{P.arkPhaseUnits}</span></div>
                <div className="data">Phase I units placed</div>
              </div>
            </div>
            <WaveRule height={16} opacity={0.5} />
            <p className="small">All figures are illustrative until the first audit is published.</p>
          </div>
        }
      />

      {/* ── The thesis ────────────────────────────────────── */}
      <section className="section wrap">
        <SectionHead
          index="01"
          title={{ eyebrow: "Why", head: "Small country, wrong-shaped capital" }}
          note="Property finance was built for cities with long histories and short distances to a bank. Liberland has neither."
        />
        <div className="grid grid--split" style={{ paddingTop: 32 }}>
          <div className="stack stack--lg" data-reveal>
            <p className="body" style={{ fontSize: 17 }}>
              A conventional property syndicate needs a minimum cheque, a local bank, a notary who has heard of
              your jurisdiction, and eighteen months. Ark Village needs the opposite: many small commitments,
              from people scattered across every timezone, most of whom already keep their savings on a chain.
            </p>
            <p className="body">
              Tokenising the interest solves the shape problem and nothing else. It does not make the building
              cheaper, faster or safer. It makes the ownership divisible, transferable, and legible to anyone who
              can read a block explorer — which turns out to be enough.
            </p>
            <div className="flex" style={{ gap: 8 }}>
              <span className="pill pill--yellow">Divisible</span>
              <span className="pill pill--lagoon">Transferable</span>
              <span className="pill">Legible</span>
            </div>
          </div>
          <div className="grid grid--2" style={{ gap: 16 }} data-reveal>
            {[
              ["What changes", "The register. Ownership of the economic interest moves in seconds instead of months."],
              ["What does not", "The deed, the surveyor, the planning permission, and every obligation that attaches to real property."],
              ["What we hold", "Nothing of yours. The SPV holds the asset; you hold the token; we operate the plumbing."],
              ["What you hold", "A recorded interest in one company that owns one thing, with the terms in the offering document."],
            ].map(([t, b]) => (
              <div key={t} className="card card--pad stack stack--sm">
                <h3 className="h4">{t}</h3>
                <p className="small">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mechanism ─────────────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <SectionHead
          index="02"
          title={{ eyebrow: "Mechanism", head: "Title in, tokens out" }}
          note="The last block stays dashed until it is confirmed. A secondary venue is not live."
        />
        <div style={{ paddingTop: 40 }} data-reveal>
          <ChainStrip
            confirmed={3}
            steps={[
              { title: "Title in", body: "The parcel is recorded in the on-chain cadastre and conveyed to a Seychelles SPV formed for that asset alone. One SPV, one thing." },
              { title: "Structure", body: "The SPV's economic interest is divided into a fixed supply. Terms, fees and distribution policy are set in the offering document before issuance." },
              { title: "Issue", body: "Interests are issued to wallets that have cleared identity checks, against the linked identity rather than a bare address." },
              { title: "Distribute", body: "Net income and disposal proceeds flow back pro rata, on the published schedule." },
              { title: "Secondary venue", body: "A regulated venue for resale. Under discussion, not operating. Assume you cannot sell on demand." },
            ]}
          />
        </div>
      </section>

      {/* ── The cadastre ──────────────────────────────────── */}
      <section id="cadastre" className="section wrap section--flush-t">
        <SectionHead
          index="03"
          title={{ eyebrow: "The register", head: "A cadastre, not a spreadsheet" }}
          note="The land layer is part of the protocol Votula operates, and it is deliberately narrower than a land registry needs to be."
          tone="yellow"
        />
        <div className="grid grid--split" style={{ paddingTop: 32 }}>
          <div className="stack stack--lg" data-reveal>
            <p className="body" style={{ fontSize: 17 }}>
              A title is held by a namespaced party — a person, a company or an office — not by a wallet. That one
              decision is what lets a key rotate, a director change or an administrator leave without the title
              moving anywhere. The current signer is resolved by policy at the moment of signing.
            </p>
            <p className="body">
              Transfers are a registrar-submitted dual-consent flow: both sides sign an EIP-712 authorisation
              against a pinned title version, and the registrar finalises before the deadline. Parcel and title
              versions chain their content and source-document hashes, so the lineage of a record is checkable
              rather than asserted.
            </p>
            <div className="flex" style={{ gap: 8 }}>
              <span className="pill pill--yellow">Versioned records</span>
              <span className="pill pill--lagoon">Dual-consent transfer</span>
              <span className="pill">Atomic subdivision</span>
            </div>
            <a href="protocol.html#modules" className="btn btn--ghost btn--sm" style={{ width: "fit-content" }}>
              See the module map <span className="arrow">→</span>
            </a>
          </div>
          <div className="grid grid--2" style={{ gap: 16 }} data-reveal>
            {[
              ["What it stores", "Parcels, titles, parties, encumbrances, disputes and version lineage — the facts a register has to be able to prove."],
              ["What it refuses", "No geometry engine, no fee custody, no insurance fund, no court-order override. Those need law before they need code."],
              ["Who can write", "Clerks may draft. Every live record change is the registrar or the office admin, and the app enforces it rather than the UI."],
              ["What blocks a deal", "Accepted disputes and active encumbrances stop transfers and structural operations. A merely filed dispute does not."],
            ].map(([t, b]) => (
              <div key={t} className="card card--pad stack stack--sm">
                <h3 className="h4">{t}</h3>
                <p className="small">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Offerings ─────────────────────────────────────── */}
      <section id="offerings" className="section wrap section--flush-t">
        <SectionHead
          index="04"
          title={{ eyebrow: "Offerings", head: "What is open right now" }}
          note="Phases open and close. Nothing here is an offer to sell; eligibility depends on where you live."
          tone="yellow"
        />
        <div className="grid grid--3" style={{ paddingTop: 32 }}>
          {offerings.map(o => (
            <div key={o.id} className="card card--clip stack" style={{ gap: 0 }} data-reveal>
              <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid var(--line)" }}>
                <div className="flex" style={{ justifyContent: "space-between", marginBottom: 12 }}>
                  <span className="eyebrow eyebrow--mute">{o.kind}</span>
                  <span className={`status status--${o.status === "open" ? "settled" : "pending"}`}>{o.statusLabel}</span>
                </div>
                <h3 className="h3">{o.name}</h3>
                <p className="small" style={{ marginTop: 10 }}>{o.blurb}</p>
              </div>

              <div style={{ padding: "20px 24px" }} className="stack stack--sm">
                <div className="figure" style={{ fontSize: 30 }}>
                  {o.placed}
                  {o.total !== "—" && <span style={{ color: "var(--text-4)" }}> / {o.total}</span>}
                </div>
                <div className="data">{o.unit}</div>
                {o.total !== "—" && (
                  <div style={{ height: 8, borderRadius: 999, background: "rgba(251,247,236,.1)", overflow: "hidden", marginTop: 6 }}>
                    <div style={{ width: `${(Number(o.placed) / Number(o.total)) * 100 || 0}%`, height: "100%", background: "var(--ramp-depth)" }} />
                  </div>
                )}
              </div>

              <div className="ledger" style={{ borderTop: "1px solid var(--line)" }}>
                {o.facts.map(([k, v]) => (
                  <div key={k} className="ledger-row" style={{ gridTemplateColumns: "1fr auto", padding: "12px 24px" }}>
                    <span style={{ color: "var(--text-4)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 10.5 }}>{k}</span>
                    <span style={{ color: "var(--text-2)" }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ padding: "18px 24px 24px" }}>
                <a href="company.html#contact" className={`btn btn--sm ${o.status === "open" ? "btn--primary" : "btn--quiet"}`}>
                  {o.status === "open" ? "Request the documents" : "Join the waitlist"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Risk ──────────────────────────────────────────── */}
      <section id="risk" className="section wrap section--flush-t">
        <SectionHead
          index="05"
          title={{ eyebrow: "Risk", head: "What can go wrong" }}
          note="On the same page as the returns, because regulators and degens read the same page."
          tone="sunset"
        />
        <div className="grid grid--auto" style={{ paddingTop: 32 }}>
          {[
            ["Total loss", "Early-stage property in a jurisdiction whose recognition is contested. The asset can fail and the interest can go to zero."],
            ["Illiquidity", "There is no secondary venue. Assume you hold until the SPV disposes of the asset, which may be years or never."],
            ["Legal recognition", "Liberland's territorial status is disputed by neighbouring states. That dispute is a live risk to any title held there."],
            ["Execution", "Construction overruns, permitting, weather on a river. Ordinary property risk, undiminished by the ledger."],
            ["Key loss", "Self-custody means self-custody. Lose the key and the recovery path runs through the SPV's registrar, slowly."],
            ["Regulatory change", "Rules covering tokenised assets are moving in every jurisdiction we touch, usually without warning."],
          ].map(([t, b]) => (
            <div key={t} className="card card--pad stack stack--sm" style={{ borderColor: "rgba(255,90,60,.28)", background: "rgba(255,90,60,.05)" }} data-reveal>
              <h3 className="h4" style={{ color: "var(--sunset-soft)" }}>{t}</h3>
              <p className="small" style={{ color: "var(--text-2)" }}>{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="section wrap section--flush-t">
        <div className="card card--pad stack stack--lg" style={{ position: "relative", overflow: "hidden", padding: "clamp(32px, 5vw, 52px)" }} data-reveal>
          <div className="grid-horizon" style={{ height: "55%", opacity: 0.6 }} />
          <div className="eyebrow" style={{ position: "relative" }}>Next step</div>
          <h2 className="h2" style={{ position: "relative", maxWidth: "20ch" }}>Ask for the offering document</h2>
          <p className="small" style={{ position: "relative", maxWidth: "56ch", color: "var(--text-2)" }}>
            It is short, it names every fee, and it tells you what happens if the phase does not fill.
            Identity checks take about a day. Yes, there is paperwork. It is short.
          </p>
          <div className="flex" style={{ position: "relative", gap: 12, marginTop: 6 }}>
            <a href="company.html#contact" className="btn btn--primary">Request documents <span className="arrow">→</span></a>
            <a href={COMPANY.arkUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">See Ark Village ↗</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

window.VT_PAGE = Property;
