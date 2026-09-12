function Hero() {
  const go = window.BWWR_goTo;
  const Photo = window.BWWR_Photo;
  return (
    <section style={{ background: "var(--void)", color: "var(--chalk)", position: "relative", overflow: "hidden" }}>
      <div
        className="container"
        style={{
          paddingTop: 88,
          paddingBottom: 80,
          display: "grid",
          gridTemplateColumns: "1.1fr .9fr",
          gap: 64,
          alignItems: "end",
        }}
      >
        <div>
          <div className="row gap-14" style={{ marginBottom: 36 }}>
            <span style={{ width: 40, height: 2, background: "var(--yellow)" }} />
            <span className="eyebrow eyebrow--accent">The Gornja Siga Settlement Campaign</span>
          </div>
          <h1 className="h1" style={{ maxWidth: "11ch", marginBottom: 32 }}>
            Foster What We Built
          </h1>
          <p className="lede" style={{ marginBottom: 24 }}>
            Since 2023, residents have maintained a peaceful, permanent settlement at Gornja Siga — and documented
            repeated demolitions, removals and seizures affecting homes, tools, communications equipment and
            personal belongings.
          </p>
          <p className="small" style={{ color: "var(--muted-3)", maxWidth: "62ch", marginBottom: 20, fontSize: 17 }}>
            One Croatian criminal complaint arising from the 21 September 2023 intervention recorded €54,486.22 in
            claimed losses. Other incidents remain under documentation, valuation or legal review.
          </p>
          <p className="small" style={{ color: "var(--muted-3)", maxWidth: "62ch", marginBottom: 36, fontSize: 17 }}>
            We already have a peaceful, permanent settlement at Gornja Siga. We are funding a lawful, transparent
            effort to defend it: preserve the evidence, pursue the return or compensation of property, replace
            essential infrastructure and foster a settlement designed for safety, environmental stewardship and
            open public accountability.
          </p>
          <div className="row-wrap gap-14" style={{ marginBottom: 36 }}>
            <button className="btn btn--solid" onClick={go("fund")}>
              Fund the Settlement
            </button>
            <button className="btn btn--ghost-dark" onClick={go("ledger")}>
              Review the Evidence
            </button>
          </div>
          <div
            className="label-mono"
            style={{ fontSize: 11, paddingTop: 24, borderTop: "1px solid var(--rule-on-dark)", lineHeight: 1.9 }}
          >
            NO&nbsp;VIOLENCE. &nbsp;NO&nbsp;CONCEALMENT. &nbsp;EVERY&nbsp;CLAIM&nbsp;SOURCED.
            &nbsp;EVERY&nbsp;CONTRIBUTION&nbsp;TRACKED.
          </div>
        </div>
        {/* Square: the only freely-licensed image that is actually of Gornja
            Siga is a satellite frame, and it is natively square. Leading with
            the record rather than a stand-in photograph of somewhere else. */}
        <Photo id="hero" aspect="1/1" onDark />
      </div>
    </section>
  );
}

function MetricCards({ cards }) {
  return (
    <div className="card-grid card-grid--4" style={{ background: "var(--rule-on-dark)", border: "1px solid var(--rule-on-dark)" }}>
      {cards.map((m) => (
        <div key={m.label} style={{ background: "var(--carbon)", padding: "32px 28px 30px" }}>
          <div className="eyebrow" style={{ color: "var(--muted-3)", marginBottom: 20, minHeight: 30 }}>
            {m.label}
          </div>
          <div
            style={{
              fontFamily: "var(--display)",
              fontWeight: 400,
              fontSize: 42,
              lineHeight: 1,
              letterSpacing: "-0.015em",
              color: m.color,
              marginBottom: 14,
            }}
          >
            {m.value}
          </div>
          <div className="label-mono" style={{ lineHeight: 1.7, color: "var(--muted-dark)" }}>
            {m.qualifier}
          </div>
        </div>
      ))}
    </div>
  );
}

function metricCardsFor(m) {
  const eur = window.Metrics.formatEUR;
  return [
    {
      label: "Claimed Permanent Loss",
      value: m.hasLoss ? eur(m.loss) : "—",
      color: "var(--chalk)",
      qualifier: "CLAIMED IN A FILED CRIMINAL COMPLAINT; NOT A COURT AWARD OR FINAL FINDING.",
    },
    {
      label: "Temporary Administrative Seizure",
      value: m.hasTemp ? eur(m.temp) : "—",
      color: "var(--yellow)",
      qualifier: "OFFICIALLY ITEMISED. NOT COUNTED AS PERMANENT LOSS. PROCESS NOT FINAL.",
    },
    {
      label: "Returned or Recovered",
      value: "€0.00",
      color: "var(--chalk)",
      qualifier: "NO RETURN OR RECOVERY RECORDED IN THIS PERIOD. HISTORIC CLAIMS ARE NOT DELETED.",
    },
    {
      label: "Adjudicated Award",
      value: "€0.00",
      color: "var(--chalk)",
      qualifier: "FINAL DECISIONS ONLY. NONE RECORDED.",
    },
  ];
}

function MetricBand() {
  const [period, setPeriod] = React.useState("all");
  const periods = [
    ["all", "All time"],
    ["y2026", "2026"],
    ["y2024", "2024"],
    ["y2023", "2023"],
  ];
  const m = window.Metrics.computeMetrics(window.Data.incidents, window.Data.items, { period });
  const go = window.BWWR_goTo;

  return (
    <section style={{ background: "var(--carbon)", color: "var(--chalk)" }}>
      <div className="container" style={{ paddingTop: 52, paddingBottom: 46 }}>
        <div className="row-wrap gap-24" style={{ justifyContent: "space-between", marginBottom: 34 }}>
          <div className="eyebrow eyebrow--accent">Settlement position — qualified aggregates</div>
          <div className="row-wrap gap-8">
            {periods.map(([v, label]) => (
              <button
                key={v}
                onClick={() => setPeriod(v)}
                className="label-mono"
                style={{
                  padding: "8px 13px",
                  border: `1px solid ${period === v ? "var(--yellow)" : "var(--rule-on-dark)"}`,
                  background: period === v ? "var(--yellow)" : "transparent",
                  color: period === v ? "var(--void)" : "var(--muted-3)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <MetricCards cards={metricCardsFor(m)} />
        <div
          className="evidence-notice evidence-notice--compact"
          style={{ marginTop: 22, background: "none", border: "1px solid var(--rule-on-dark)" }}
        >
          <span className="label-mono" style={{ color: "var(--yellow)" }}>
            EVIDENCE&nbsp;NOTICE
          </span>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: "var(--muted-3)", maxWidth: "110ch" }}>
            Claimed values are allegations contained in identified complaints or witness accounts unless expressly
            marked as adjudicated. A claimed value is not a court award. Temporary seizures are never counted as
            permanent losses.{" "}
            <a href={window.Router.pathFor("evidence")} onClick={go("evidence")}>
              Read the full evidence notice →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

// The other side of the ledger: what the enforcement posture costs the
// Croatian public. Placed directly under the settlement's own position so
// the two totals are read together.
function CostsTeaser() {
  const go = window.BWWR_goTo;
  const eur = window.Metrics.formatEUR;
  const costs = window.Data.croatiaCosts;
  const t = window.Metrics.computeCostTotals(costs);

  return (
    <section style={{ background: "var(--yellow)", color: "var(--void)" }}>
      <div className="container" style={{ paddingTop: 84, paddingBottom: 84 }}>
        <div className="row-wrap gap-24" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44 }}>
          <div>
            <div className="row gap-14" style={{ marginBottom: 26 }}>
              <span style={{ width: 40, height: 2, background: "var(--void)" }} />
              <span
                className="eyebrow"
                style={{ color: "var(--void)" }}
              >
                The cost of enforcement
              </span>
            </div>
            <h2 className="h2" style={{ maxWidth: "17ch" }}>
              What this has cost Croatia
            </h2>
          </div>
          <p className="small" style={{ maxWidth: "44ch", color: "rgba(10,10,11,.78)", fontSize: 17 }}>
            Every patrol, removal, storage month and court file is paid for by Croatian taxpayers. We publish that
            expenditure to the same standard we hold ourselves to — sourced, or plainly marked as not yet sourced.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(10,10,11,.18)", border: "1px solid rgba(10,10,11,.18)" }}>
          <div style={{ background: "var(--yellow)", padding: "30px 28px" }}>
            <div className="eyebrow" style={{ color: "rgba(10,10,11,.62)", marginBottom: 16 }}>
              Sourced expenditure
            </div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: 46, lineHeight: 1, letterSpacing: "-0.015em" }}>
              {t.hasSourced ? eur(t.sourcedCents) : "—"}
            </div>
          </div>
          <div style={{ background: "var(--yellow)", padding: "30px 28px" }}>
            <div className="eyebrow" style={{ color: "rgba(10,10,11,.62)", marginBottom: 16 }}>
              Cost structures identified
            </div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: 46, lineHeight: 1, letterSpacing: "-0.015em" }}>
              {t.totalCount}
            </div>
          </div>
          <div style={{ background: "var(--yellow)", padding: "30px 28px" }}>
            <div className="eyebrow" style={{ color: "rgba(10,10,11,.62)", marginBottom: 16 }}>
              Awaiting a source
            </div>
            <div style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: 46, lineHeight: 1, letterSpacing: "-0.015em" }}>
              {t.pendingCount}
            </div>
          </div>
        </div>

        <div
          className="label-mono"
          style={{ color: "rgba(10,10,11,.72)", marginTop: 20, lineHeight: 1.8 }}
        >
          POLICING · INSPECTION · REMOVAL AND TRANSPORT · STORAGE AND CUSTODY · PROSECUTION · LEGAL EXPOSURE
        </div>

        <div style={{ marginTop: 36 }}>
          <button className="btn btn--dark" onClick={go("costs")}>
            Open the cost ledger
          </button>
        </div>
      </div>
    </section>
  );
}

function PositionSection() {
  return (
    <section className="section">
      <div style={{ display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: 72, alignItems: "start" }}>
        <div>
          <div className="section-number">
            <span className="mono" style={{ color: "var(--amber)", fontSize: 12 }}>
              01
            </span>
            <span className="rule-short" />
            <span className="eyebrow">Position</span>
          </div>
          <h2 className="h2" style={{ maxWidth: "18ch" }}>
            This is not a campaign against the Croatian people
          </h2>
        </div>
        <div className="body-text">
          <p style={{ margin: "0 0 22px" }}>
            Croatia has legitimate interests in border security, navigation, environmental protection and public
            safety. We recognise those interests.
          </p>
          <p style={{ margin: "0 0 22px" }}>
            We ask for the same standards that legitimate public authority should apply everywhere: a clear legal
            basis, a competent decision-maker, written reasons, an accurate property inventory, proportionate action
            and an effective opportunity to challenge mistakes.
          </p>
          <p style={{ margin: "0 0 22px" }}>
            An environmental mandate should protect a forest. It should not create a procedural black hole in which
            a home, laptop, generator, camera or family photograph can disappear without a traceable decision.
          </p>
          <p style={{ margin: 0, color: "var(--void)" }}>
            We are funding the peaceful alternative: documentation instead of confrontation, law instead of
            self-help, stewardship instead of waste, and rebuilding instead of surrender.
          </p>
        </div>
      </div>
    </section>
  );
}

function TheLand() {
  const Photo = window.BWWR_Photo;
  return (
    <section style={{ background: "var(--concrete)" }}>
      <div className="container" style={{ paddingTop: 84, paddingBottom: 84 }}>
        <div className="section-number">
          <span className="mono" style={{ color: "var(--amber)", fontSize: 12 }}>
            02
          </span>
          <span className="rule-short" />
          <span className="eyebrow">The land</span>
        </div>
        <div className="row-wrap gap-24" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44 }}>
          <h2 className="h2" style={{ maxWidth: "20ch" }}>
            Seven square kilometres on the Danube's left bank
          </h2>
          <p className="small" style={{ maxWidth: "46ch", fontSize: 17 }}>
            Croatia's border claim follows the river's western bank; Serbia's follows the main channel. The gap
            between the two arguments is where the settlement stands.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
          <Photo id="land" aspect="16/10" />
          {/* 8/7 so this image's base lines up with the wider one beside it:
              at columns 1.4fr/1fr, 1.6 × (1 / 1.4) = 8/7 regardless of width. */}
          <Photo id="river" aspect="8/7" />
        </div>
        <p className="label-mono" style={{ marginTop: 18, lineHeight: 1.8, maxWidth: "88ch" }}>
          ON THESE PHOTOGRAPHS — NO FREELY LICENSED PHOTOGRAPH OF THE SETTLEMENT ITSELF EXISTS. THE TWO ABOVE SHOW
          THE SAME DANUBE FLOODPLAIN AT THE STATED DISTANCE, NOT GORNJA SIGA. ONLY THE SATELLITE FRAME ON THIS PAGE
          IS THE TERRITORY.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginTop: 44,
            paddingTop: 32,
            borderTop: "1px solid var(--rule)",
          }}
        >
          <div>
            <div style={{ fontFamily: "var(--display)", fontSize: 34, letterSpacing: "-0.015em", marginBottom: 8 }}>
              7 km²
            </div>
            <div className="label-mono">CLAIMED TERRITORY, DANUBE LEFT BANK</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--display)", fontSize: 34, letterSpacing: "-0.015em", marginBottom: 8 }}>
              13 Apr 2015
            </div>
            <div className="label-mono">PROCLAIMED AT GORNJA SIGA</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--display)", fontSize: 34, letterSpacing: "-0.015em", marginBottom: 8 }}>
              45°46′N 18°53′E
            </div>
            <div className="label-mono">SETTLEMENT COORDINATES</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function KeyIncident() {
  const go = window.BWWR_goTo;
  const inc = window.Data.incidents[0];
  const EvidenceSlot = window.BWWR_EvidenceSlot;
  return (
    <section style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
      <div
        className="container"
        style={{ paddingTop: 76, paddingBottom: 76, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}
      >
        <div>
          <div className="label-mono" style={{ color: "var(--amber)", marginBottom: 18 }}>
            KEY&nbsp;INCIDENT&nbsp;·&nbsp;{inc.id}
          </div>
          <h3 className="h2" style={{ fontSize: 38, marginBottom: 18 }}>
            {inc.title}
          </h3>
          <p className="small" style={{ fontSize: 17, marginBottom: 26, maxWidth: "56ch" }}>
            {inc.summary}
          </p>
          <div className="row-wrap gap-8" style={{ marginBottom: 28 }}>
            <span className="badge badge--warn">DISPUTED</span>
            <span className="badge badge--neutral">CRIMINAL COMPLAINT FILED</span>
            <span className="badge badge--neutral">NO FINAL FINDING</span>
          </div>
          <button className="btn" onClick={go("incident", { incidentId: inc.id })}>
            Open the incident record
          </button>
        </div>
        <EvidenceSlot
          aspect="4/3"
          caption="Approved redacted evidence photograph — 21 Sept 2023 intervention"
          figure="FIG. 02 — PLACEHOLDER. IMAGE PUBLICATION PENDING REDACTION APPROVAL."
        />
      </div>
    </section>
  );
}

function WhySettlement() {
  const cards = [
    { n: "C.01", title: "Peaceful presence", body: "Our permanent, nonviolent community already exists as a practical alternative to recurring confrontation and unmanaged uncertainty." },
    { n: "C.02", title: "Environmental stewardship", body: "The project will publish waste, sanitation, fire, safety and visitor protocols and will seek independent environmental review." },
    { n: "C.03", title: "Regional opportunity", body: "Lawful low-impact accommodation, boating, cycling, education, cultural exchange, local purchasing and cooperation with neighbouring communities." },
    { n: "C.04", title: "Property and process", body: "Difficult territorial questions do not eliminate the need to document, preserve and account for private property." },
  ];
  return (
    <section className="section">
      <div className="section-number">
        <span className="mono" style={{ color: "var(--amber)", fontSize: 12 }}>
          03
        </span>
        <span className="rule-short" />
        <span className="eyebrow">The case for fostering</span>
      </div>
      <h2 className="h2" style={{ marginBottom: 56, maxWidth: "20ch" }}>
        Why the settlement must endure
      </h2>
      <div className="card-grid card-grid--4">
        {cards.map((c) => (
          <div key={c.n}>
            <div className="mono" style={{ color: "var(--amber)", marginBottom: 20, fontSize: 11.5 }}>
              {c.n}
            </div>
            <h3 className="h3" style={{ marginBottom: 14, fontSize: 22 }}>
              {c.title}
            </h3>
            <p className="small" style={{ margin: 0 }}>
              {c.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FundingUsesTeaser() {
  const go = window.BWWR_goTo;
  const eur = window.Metrics.formatEUR;
  return (
    <section style={{ background: "var(--void)", color: "var(--chalk)" }}>
      <div className="container" style={{ paddingTop: 96, paddingBottom: 96 }}>
        <div className="row-wrap gap-24" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
          <div>
            <div className="section-number">
              <span className="mono" style={{ color: "var(--yellow)", fontSize: 12 }}>
                04
              </span>
              <span className="rule-short" style={{ background: "var(--rule-on-dark)" }} />
              <span className="eyebrow eyebrow--accent">Use of funds</span>
            </div>
            <h2 className="h2" style={{ maxWidth: "18ch" }}>
              Five categories. Every euro reported.
            </h2>
          </div>
          <button className="btn btn--ghost-dark" onClick={go("fund")}>
            Open the fund page
          </button>
        </div>
        {window.Data.budget.map((b) => (
          <div
            key={b.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2.2fr 1fr 1fr 1fr",
              gap: 32,
              alignItems: "center",
              padding: "26px 0",
              borderTop: "1px solid var(--rule-on-dark)",
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 500, fontSize: 24, marginBottom: 8 }}>{b.name}</div>
              <div className="small" style={{ color: "var(--muted-dark)", maxWidth: "60ch", fontSize: 15 }}>
                {b.desc}
              </div>
            </div>
            <div>
              <div className="label-mono" style={{ color: "#6b6962", marginBottom: 8, fontSize: 10 }}>
                TARGET
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 19, color: "var(--on-dark)" }}>{eur(b.targetCents)}</div>
            </div>
            <div>
              <div className="label-mono" style={{ color: "#6b6962", marginBottom: 8, fontSize: 10 }}>
                RECEIVED
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 19, color: "var(--yellow)" }}>{eur(b.receivedCents)}</div>
            </div>
            <div>
              <div className="label-mono" style={{ color: "#6b6962", marginBottom: 8, fontSize: 10 }}>
                SPENT
              </div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 19, color: "var(--on-dark)" }}>{eur(b.spentCents)}</div>
            </div>
          </div>
        ))}
        <div
          className="label-mono"
          style={{ borderTop: "1px solid var(--rule-on-dark)", paddingTop: 24, marginTop: 4, lineHeight: 1.8 }}
        >
          DONATIONS CONFER NO OWNERSHIP, FINANCIAL RETURN, CITIZENSHIP RIGHT, LAND TITLE OR INVESTMENT INTEREST.
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <div>
      <Hero />
      <MetricBand />
      <CostsTeaser />
      <PositionSection />
      <TheLand />
      <KeyIncident />
      <WhySettlement />
      <FundingUsesTeaser />
    </div>
  );
}

window.BWWR_Home = Home;
