// Company — who Votula is, how it is structured, and how to reach it.

function Company() {
  const { COMPANY, DISCLAIMER } = window.VT_DATA;
  const { Mark, WaveRule, PageHero, SectionHead } = window.VT;

  const tiers = [
    {
      k: "Sovereign layer",
      c: "var(--yellow)",
      name: "Liberland",
      note: "Issues citizenship and e-Residency, and holds every governing power the protocol grants. Not a party to any Votula offering.",
      href: COMPANY.parentUrl,
      external: true,
    },
    {
      k: "Operating layer",
      c: "var(--lagoon)",
      name: "Votula, Ltd.",
      note: `Registered in ${COMPANY.city}. Operates the protocol, structures the vehicles and runs the builder programme. Holds no client assets and no governing power.`,
    },
    {
      k: "Asset layer",
      c: "var(--danube-lift)",
      name: "One SPV per asset",
      note: "Each company owns exactly one parcel or unit. The deed sits here. Tokens record an interest in this company and nothing else.",
    },
  ];

  return (
    <React.Fragment>
      <PageHero
        eyebrow="Company"
        title="Registered in Victoria"
        lede="Votula is Liberland's blockchain and crypto branch — a Seychelles operating company, deliberately boring in structure, at work on the Danube."
        actions={
          <React.Fragment>
            <a href="#contact" className="btn btn--primary">Talk to us <span className="arrow">→</span></a>
            <a href="#compliance" className="btn btn--ghost">Compliance</a>
          </React.Fragment>
        }
        aside={
          <div className="card card--warm card--pad stack stack--lg">
            <div className="eyebrow eyebrow--mute">Registered office</div>
            <div className="stack stack--sm">
              <div className="h3">{COMPANY.name}</div>
              <div className="data">{COMPANY.city}</div>
            </div>
            <WaveRule height={16} opacity={0.5} />
            <div className="flex" style={{ gap: 8 }}>
              <span className="pill pill--yellow">Sub-brand of Liberland</span>
              <span className="pill pill--lagoon">Est. 2025</span>
            </div>
          </div>
        }
      />

      {/* ── Who ──────────────────────────────────────────── */}
      <section className="section wrap">
        <SectionHead
          index="01"
          title={{ eyebrow: "Who we are", head: "A compliance binder on a beach" }}
          note="Two things that never share a room. The company exists to make them share one."
        />
        <div className="grid grid--split" style={{ paddingTop: 32 }}>
          <div className="stack stack--lg" data-reveal>
            <p className="body" style={{ fontSize: 17 }}>
              Liberland is a small country with a large diaspora and an unusually literate one. It has land to
              develop, citizens scattered across every timezone, and a merit token most of them already hold.
              What it lacked was a company willing to do the unglamorous middle: run the chain, keep the
              register, form the vehicles, and answer the bank's questions.
            </p>
            <p className="body">
              That is Votula. We are not a fund, not a bank, and not a custodian. We operate Liberland EVM,
              structure the vehicles that hold real assets, and fund the builders who make the whole thing
              usable by somebody other than us.
            </p>
          </div>
          <div className="grid grid--2" style={{ gap: 16 }} data-reveal>
            {[
              ["We are", "The operator of the Liberland EVM protocol, and a structuring company for tokenised real assets."],
              ["We are not", "A fund manager, a bank, a broker, or a custodian of your keys."],
              ["We hold", "The deployment keys, the SPV registers, and the obligation to publish what the protocol does not already publish itself."],
              ["You hold", "Your keys, and a recorded interest in a company that owns one specific thing."],
            ].map(([t, b]) => (
              <div key={t} className="card card--pad stack stack--sm">
                <h3 className="h4">{t}</h3>
                <p className="small">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Structure ────────────────────────────────────── */}
      <section id="structure" className="section wrap section--flush-t">
        <SectionHead
          index="02"
          title={{ eyebrow: "Structure", head: "Three layers, on purpose" }}
          note="Each layer can fail without taking the others with it. That is the entire reason for the separation."
        />
        <div className="stack stack--lg" style={{ paddingTop: 32 }} data-reveal>
          {tiers.map((t, i) => (
            <React.Fragment key={t.name}>
              <div className="card card--pad grid grid--split" style={{ position: "relative", overflow: "hidden", gap: 28, alignItems: "center" }}>
                <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: t.c, opacity: 0.85 }} />
                <div className="stack stack--sm">
                  <div className="eyebrow" style={{ color: t.c }}>{t.k}</div>
                  <h3 className="h3">
                    {t.href ? (
                      <a href={t.href} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>{t.name} ↗</a>
                    ) : t.name}
                  </h3>
                </div>
                <p className="small" style={{ color: "var(--text-2)" }}>{t.note}</p>
              </div>
              {i < tiers.length - 1 && (
                <div style={{ display: "grid", placeItems: "center", height: 26 }} aria-hidden="true">
                  <span style={{ width: 2, height: "100%", background: "var(--lagoon)", opacity: 0.5 }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="small" style={{ marginTop: 24, maxWidth: "72ch" }}>
          Votula never takes title to an asset and never holds a subscriber's keys. If Votula stops operating
          tomorrow, each SPV still owns its asset and each register still exists — slower to transact against,
          but intact.
        </p>
      </section>

      {/* ── Compliance ───────────────────────────────────── */}
      <section id="compliance" className="section wrap section--flush-t">
        <SectionHead
          index="03"
          title={{ eyebrow: "Compliance", head: "Ask for the file; you get the file" }}
          note="Written for the audience that reads footnotes, which turns out to be most of them."
        />
        <div className="grid grid--auto" style={{ paddingTop: 32 }}>
          {[
            ["Identity checks", "Every wallet receiving an issued interest clears identity and sanctions screening first. e-Residency satisfies part of it, not all of it."],
            ["Source of funds", "Proportionate checks on subscriptions, escalating with size. Short paperwork, but there is paperwork."],
            ["Segregation", "Reserve accounts are kept separate from operating accounts, and the split is published rather than asserted."],
            ["Offering documents", "Every issuance has one. It names the asset, the fees, the distribution policy and what happens if a phase does not fill."],
            ["Jurisdiction limits", "Some offerings are unavailable where you live. The check happens before you spend anything, not after."],
            ["Reporting", "Protocol code, parameters and the internal audit report are published in full at a frozen tag, external review pending — not as a summary with a logo on it."],
          ].map(([t, b]) => (
            <div key={t} className="card card--pad stack stack--sm" data-reveal>
              <h3 className="h4">{t}</h3>
              <p className="small">{b}</p>
            </div>
          ))}
        </div>

        <div className="card card--pad" style={{ marginTop: 20, borderColor: "rgba(255,90,60,.28)", background: "rgba(255,90,60,.05)" }} data-reveal>
          <div className="eyebrow eyebrow--sunset" style={{ marginBottom: 10 }}>Important</div>
          <p className="small" style={{ color: "var(--text-2)", maxWidth: "84ch" }}>{DISCLAIMER}</p>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────── */}
      <section id="contact" className="section wrap section--flush-t">
        <SectionHead
          index="04"
          title={{ eyebrow: "Contact", head: "Reach a person" }}
          note="No ticket queue. Say which of the three programmes you mean and you will reach the right desk."
          tone="yellow"
        />
        <div className="grid grid--3" style={{ paddingTop: 32 }}>
          {[
            ["Property & offerings", "Offering documents, subscription mechanics, eligibility.", `subject=Offering%20documents`],
            ["Builders & grants", "Grant applications, integration help, contract questions.", `subject=Grant%20application`],
            ["Institutions & press", "Structure, audit scope, protocol parameters, and the file you asked for.", `subject=Institutional%20enquiry`],
          ].map(([t, b, q]) => (
            <a key={t} href={`mailto:${COMPANY.email}?${q}`} className="card card--pad card--hover stack stack--lg" data-reveal style={{ color: "inherit" }}>
              <h3 className="h3">{t}</h3>
              <p className="small">{b}</p>
              <div style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--lagoon)" }}>
                {COMPANY.email} →
              </div>
            </a>
          ))}
        </div>

        <div className="card card--pad" style={{ marginTop: 20, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 20 }} data-reveal>
          <div className="flex" style={{ gap: 14 }}>
            <Mark size={44} />
            <div className="stack stack--sm">
              <div className="h4">{COMPANY.name}</div>
              <div className="data">{COMPANY.city}</div>
            </div>
          </div>
          <div className="flex" style={{ gap: 12 }}>
            <a href={COMPANY.parentUrl} target="_blank" rel="noopener noreferrer" className="btn btn--quiet btn--sm">liberland.org ↗</a>
            <a href={COMPANY.arkUrl} target="_blank" rel="noopener noreferrer" className="btn btn--quiet btn--sm">ark.ll.land ↗</a>
            <a href="brand.html" className="btn btn--quiet btn--sm">Brand ↗</a>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}

window.VT_PAGE = Company;
