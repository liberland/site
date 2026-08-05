function Hero() {
  const go = window.BWWR_goTo;
  return (
    <section style={{ background: "var(--ink)", color: "var(--paper)", position: "relative", overflow: "hidden" }}>
      <div
        className="container"
        style={{
          padding: "96px 34px 84px",
          display: "grid",
          gridTemplateColumns: "1.15fr .85fr",
          gap: 64,
          alignItems: "end",
        }}
      >
        <div>
          <div className="row gap-14" style={{ marginBottom: 40 }}>
            <span style={{ width: 40, height: 1, background: "var(--accent-2)" }} />
            <span className="eyebrow eyebrow--accent">The Gornja Siga Settlement Campaign</span>
          </div>
          <h1 className="h1" style={{ maxWidth: "12ch", marginBottom: 34 }}>
            Foster What We Built
          </h1>
          <p className="lede" style={{ marginBottom: 22 }}>
            Since 2023, residents have maintained a peaceful, permanent settlement at Gornja Siga — and documented
            repeated demolitions, removals and seizures affecting homes, tools, communications equipment and
            personal belongings.
          </p>
          <p className="small" style={{ color: "var(--muted-3)", maxWidth: "60ch", marginBottom: 22, fontSize: 18, lineHeight: 1.66 }}>
            One Croatian criminal complaint arising from the 21 September 2023 intervention recorded €54,486.22 in
            claimed losses. Other incidents remain under documentation, valuation or legal review.
          </p>
          <p className="small" style={{ color: "var(--muted-3)", maxWidth: "60ch", marginBottom: 40, fontSize: 18, lineHeight: 1.66 }}>
            We already have a peaceful, permanent settlement at Gornja Siga. We are funding a lawful, transparent
            effort to defend it: preserve the evidence, pursue the return or compensation of property, replace
            essential infrastructure and foster a settlement designed for safety, environmental stewardship and
            open public accountability.
          </p>
          <div className="row-wrap gap-14" style={{ marginBottom: 34 }}>
            <button className="btn btn--solid" onClick={go("fund")}>
              Fund the Settlement
            </button>
            <button className="btn btn--ghost-dark" onClick={go("ledger")}>
              Review the Evidence
            </button>
          </div>
          <div
            className="label-mono"
            style={{ fontSize: 12, paddingTop: 26, borderTop: "1px solid rgba(203,169,110,.24)" }}
          >
            NO&nbsp;VIOLENCE. &nbsp;NO&nbsp;CONCEALMENT. &nbsp;EVERY&nbsp;CLAIM&nbsp;SOURCED.
            &nbsp;EVERY&nbsp;CONTRIBUTION&nbsp;TRACKED.
          </div>
        </div>
        <div>
          <div style={{ aspectRatio: "3/4", border: "1px solid rgba(203,169,110,.3)" }}>
            <div className="image-slot image-slot--on-dark" style={{ width: "100%", height: "100%" }}>
              Documentary photograph — Gornja Siga site, wide, daylight, no persons identifiable
            </div>
          </div>
          <div className="label-mono" style={{ color: "#5F5849", marginTop: 12, fontSize: 10.5 }}>
            FIG. 01 — SITE VIEW. PUBLICATION SUBJECT TO REDACTION APPROVAL.
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCards({ cards }) {
  return (
    <div className="card-grid card-grid--4" style={{ background: "rgba(203,169,110,.22)", border: "1px solid rgba(203,169,110,.22)" }}>
      {cards.map((m) => (
        <div key={m.label} style={{ background: "var(--ink-2)", padding: "32px 28px 30px" }}>
          <div className="eyebrow" style={{ color: "var(--muted-3)", marginBottom: 20, minHeight: 30 }}>
            {m.label}
          </div>
          <div style={{ fontFamily: "var(--serif)", fontWeight: 300, fontSize: 42, lineHeight: 1, color: m.color, marginBottom: 14 }}>
            {m.value}
          </div>
          <div className="label-mono" style={{ lineHeight: 1.7 }}>
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
      color: "var(--paper)",
      qualifier: "CLAIMED IN A FILED CRIMINAL COMPLAINT; NOT A COURT AWARD OR FINAL FINDING.",
    },
    {
      label: "Temporary Administrative Seizure",
      value: m.hasTemp ? eur(m.temp) : "—",
      color: "var(--accent-2)",
      qualifier: "OFFICIALLY ITEMISED. NOT COUNTED AS PERMANENT LOSS. PROCESS NOT FINAL.",
    },
    {
      label: "Returned or Recovered",
      value: "€0.00",
      color: "var(--paper)",
      qualifier: "NO RETURN OR RECOVERY RECORDED IN THIS PERIOD. HISTORIC CLAIMS ARE NOT DELETED.",
    },
    {
      label: "Adjudicated Award",
      value: "€0.00",
      color: "var(--paper)",
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
    <section style={{ background: "var(--ink-2)", color: "var(--paper)" }}>
      <div className="container" style={{ padding: "52px 34px 46px" }}>
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
                  border: `1px solid ${period === v ? "var(--accent)" : "rgba(203,169,110,.35)"}`,
                  background: period === v ? "var(--accent)" : "transparent",
                  color: period === v ? "var(--ink)" : "var(--muted-3)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <MetricCards cards={metricCardsFor(m)} />
        <div className="evidence-notice evidence-notice--compact" style={{ marginTop: 22, background: "none", border: "1px solid rgba(203,169,110,.22)" }}>
          <span className="label-mono" style={{ color: "var(--accent-2)" }}>
            EVIDENCE&nbsp;NOTICE
          </span>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.62, color: "var(--muted-3)", maxWidth: "110ch" }}>
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

function PositionSection() {
  return (
    <section className="section">
      <div style={{ display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: 72, alignItems: "start" }}>
        <div>
          <div className="section-number">
            <span className="mono" style={{ color: "var(--accent)", fontSize: 12 }}>01</span>
            <span className="rule-short" />
            <span className="eyebrow">Position</span>
          </div>
          <h2 className="h2" style={{ fontWeight: 400, maxWidth: "18ch" }}>
            This is not a campaign against the Croatian people
          </h2>
        </div>
        <div className="body-text" style={{ maxWidth: "66ch" }}>
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
          <p style={{ margin: 0, color: "var(--ink)" }}>
            We are funding the peaceful alternative: documentation instead of confrontation, law instead of
            self-help, stewardship instead of waste, and rebuilding instead of surrender.
          </p>
        </div>
      </div>
    </section>
  );
}

function KeyIncident() {
  const go = window.BWWR_goTo;
  const inc = window.Data.incidents[0];
  return (
    <section style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", background: "var(--paper-warm)" }}>
      <div className="container" style={{ padding: "76px 34px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <div className="label-mono" style={{ color: "var(--accent)", marginBottom: 18, fontSize: 11 }}>
            KEY&nbsp;INCIDENT&nbsp;·&nbsp;{inc.id}
          </div>
          <h3 style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: 36, lineHeight: 1.1, margin: "0 0 18px" }}>
            {inc.title}
          </h3>
          <p className="small" style={{ fontSize: 18, lineHeight: 1.65, marginBottom: 26, maxWidth: "56ch" }}>
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
        <div>
          <div style={{ aspectRatio: "4/3", border: "1px solid var(--rule-strong)", background: "var(--paper)" }}>
            <div className="image-slot" style={{ width: "100%", height: "100%" }}>
              Approved redacted evidence photograph — 21 Sept 2023 intervention
            </div>
          </div>
          <div className="label-mono" style={{ marginTop: 12 }}>
            FIG. 02 — PLACEHOLDER. IMAGE PUBLICATION PENDING REDACTION APPROVAL.
          </div>
        </div>
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
        <span className="mono" style={{ color: "var(--accent)", fontSize: 12 }}>02</span>
        <span className="rule-short" />
        <span className="eyebrow">The case for fostering</span>
      </div>
      <h2 className="h2" style={{ marginBottom: 56, maxWidth: "20ch" }}>Why the settlement must endure</h2>
      <div className="card-grid card-grid--4">
        {cards.map((c) => (
          <div key={c.n}>
            <div className="mono" style={{ color: "var(--accent)", marginBottom: 20, fontSize: 11.5 }}>{c.n}</div>
            <h3 className="h3" style={{ marginBottom: 14 }}>{c.title}</h3>
            <p className="small" style={{ margin: 0 }}>{c.body}</p>
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
    <section style={{ background: "var(--ink)", color: "var(--paper)" }}>
      <div className="container" style={{ padding: "96px 34px" }}>
        <div className="row-wrap gap-24" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
          <div>
            <div className="section-number">
              <span className="mono" style={{ color: "var(--accent-2)", fontSize: 12 }}>03</span>
              <span className="rule-short" style={{ background: "rgba(203,169,110,.4)" }} />
              <span className="eyebrow eyebrow--accent">Use of funds</span>
            </div>
            <h2 className="h2" style={{ fontWeight: 300, maxWidth: "18ch" }}>Five categories. Every euro reported.</h2>
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
              borderTop: "1px solid rgba(203,169,110,.2)",
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 25, marginBottom: 8 }}>{b.name}</div>
              <div className="small" style={{ color: "var(--muted-dark)", maxWidth: "60ch" }}>{b.desc}</div>
            </div>
            <div>
              <div className="label-mono" style={{ color: "#5F5849", marginBottom: 8, fontSize: 10 }}>TARGET</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 24, color: "#E4DCCC" }}>{eur(b.targetCents)}</div>
            </div>
            <div>
              <div className="label-mono" style={{ color: "#5F5849", marginBottom: 8, fontSize: 10 }}>RECEIVED</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 24, color: "var(--accent-2)" }}>{eur(b.receivedCents)}</div>
            </div>
            <div>
              <div className="label-mono" style={{ color: "#5F5849", marginBottom: 8, fontSize: 10 }}>SPENT</div>
              <div style={{ fontFamily: "var(--serif)", fontSize: 24, color: "#E4DCCC" }}>{eur(b.spentCents)}</div>
            </div>
          </div>
        ))}
        <div className="label-mono" style={{ borderTop: "1px solid rgba(203,169,110,.2)", paddingTop: 24, marginTop: 4, lineHeight: 1.8, fontSize: 11.5 }}>
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
      <PositionSection />
      <KeyIncident />
      <WhySettlement />
      <FundingUsesTeaser />
    </div>
  );
}

window.BWWR_Home = Home;
