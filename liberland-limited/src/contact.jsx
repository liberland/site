// Company identification and contact. The Hong Kong address is the registered office only.
function Facts({ rows }) {
  const { Rich } = window.LL_UI;
  return (
    <dl className="facts">
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="label">{k}</dt>
          <dd>
            {Array.isArray(v) && v.every(s => typeof s === "string")
              ? v.map((line, i) => <div key={i}>{line}</div>)
              : <Rich value={v} />}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

function Company() {
  const t = window.LL_T.company;
  const { Link, Rich, SectionHead } = window.LL_UI;
  const { LINKS } = window.LL_DATA;

  return (
    <section id="company" className="section" data-screen-label="Company">
      <div className="container">
        <SectionHead label={t.label} title={t.title} paragraphs={t.text} />

        <div className="grid-2" style={{ alignItems: "start" }}>
          <div className="card" style={{ padding: "28px 28px 12px" }}>
            <div className="label label--teal" style={{ marginBottom: 8 }}>{t.panelLabel}</div>
            <Facts rows={t.rows} />
          </div>

          <div className="stack-4" style={{ gap: 20 }}>
            <Link href={LINKS.registryInfo} className="btn btn--solid" style={{ alignSelf: "flex-start", whiteSpace: "normal" }}>
              {t.verify}
            </Link>
            <p className="body" style={{ margin: 0 }}><Rich value={t.verifyHint} /></p>
            <p className="small" style={{ margin: 0, paddingTop: 16, borderTop: "1px solid var(--rule)" }}>{t.disambiguation}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const t = window.LL_T.contact;
  const { Link, SectionHead } = window.LL_UI;
  const { MAIL, LINKS } = window.LL_DATA;

  return (
    <section id="contact" className="section section--warm" data-screen-label="Contact">
      <div className="container">
        <SectionHead label={t.label} title={t.title} paragraphs={[t.intro]} />

        <div className="grid-2" style={{ alignItems: "start" }}>
          <div>
            <Facts rows={t.rows} />
            <p className="small" style={{ margin: "16px 0 0" }}>{t.footnote}</p>
          </div>

          <div className="stack-4" style={{ gap: 28 }}>
            <a href={MAIL.general} className="btn btn--solid" style={{ alignSelf: "flex-start" }}>
              {t.button} <span className="arrow">→</span>
            </a>
            <div className="card" style={{ padding: 24 }}>
              <div className="label" style={{ marginBottom: 8 }}>{t.arkLabel}</div>
              <p className="body" style={{ margin: "0 0 16px" }}>{t.arkText}</p>
              <Link href={LINKS.arkContact} className="text-link">{t.arkLink}</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.LL_Company = Company;
window.LL_Contact = Contact;
