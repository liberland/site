// What we do — four routes in, each labelled with who actually provides it
function About() {
  const t = window.LL_T.about;
  const { Link, SectionHead } = window.LL_UI;

  return (
    <section id="about" className="section" data-screen-label="About">
      <div className="container">
        <SectionHead label={t.label} title={t.title} paragraphs={[t.intro]} />

        <div className="grid-4">
          {t.cards.map(c => (
            <article key={c.title} className={"card offer" + (c.external ? " card--external" : "")}>
              <div className={"label " + (c.external ? "" : "label--teal")}>{c.label}</div>
              <h3 className="h3" style={{ margin: 0, fontSize: 26 }}>{c.title}</h3>
              <p className="body" style={{ margin: 0, fontSize: 15 }}>{c.text}</p>
              <Link href={c.href} className={"btn btn--sm " + (c.external ? "btn--ghost" : "")}>
                {c.button}
              </Link>
              <div className="provider small">{c.provider}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

window.LL_About = About;
