// About / What we do — three columns, restrained
function About() {
  const cols = [
    {
      label: "Membership",
      title: "A members' register, kept by hand.",
      body: "Four tiers, named members, an address book printed and posted once a year. The same door whether you visit twice a decade or live around the corner.",
      foot: "→ Tiers from €240 / year",
      href: "#membership",
    },
    {
      label: "Gatherings",
      title: "Six to eight events a year.",
      body: "We organise the Anniversary, Floating Man, the Members' Salon in Hong Kong, and a winter retreat at Ark. Members attend at member rates; guests are welcome by invitation.",
      foot: "→ See the calendar",
      href: "#events",
    },
    {
      label: "Residences",
      title: "Brokerage at Ark Village.",
      body: "We are not the developer. We introduce members to cottages and houses available at Ark Village in Apatin, Serbia, and we coordinate the visit, paperwork, and the move-in.",
      foot: "→ Available residences",
      href: "#residences",
    },
  ];

  return (
    <section id="about" className="section" data-screen-label="About">
      <div className="container">
        <div className="section-head">
          <span className="label">01 — What we do</span>
          <h2 className="display h2">
            Three things, well. <em>Membership, gatherings, residences.</em>
          </h2>
        </div>

        <div className="grid-3">
          {cols.map((c, i) => (
            <div key={c.label} style={{
              padding: "32px 0",
              borderTop: "1px solid var(--rule)",
              display: "flex", flexDirection: "column", gap: 20,
            }}>
              <div className="label label--teal">0{i + 1} · {c.label}</div>
              <h3 className="h3" style={{ margin: 0 }}>{c.title}</h3>
              <p className="body" style={{ margin: 0 }}>{c.body}</p>
              <a href={c.href} className="label label--ink" style={{ marginTop: "auto", paddingTop: 24, borderTop: "1px solid var(--rule)" }}>
                {c.foot}
              </a>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 80, padding: "32px 0", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 32 }}
             className="positioning">
          <div className="label">A note</div>
          <div className="body" style={{ maxWidth: 540 }}>
            Liberland Limited is a Hong Kong company. We do not operate a fund, we do not
            hold client money, and we do not sell securities. Membership fees and event
            tickets are paid for the services they describe.
          </div>
          <div className="body" style={{ maxWidth: 540 }}>
            Our work is hospitality and brokerage. The community we serve is private and
            voluntary; the residences we introduce are real estate located in the
            Republic of Serbia, sold by their developer.
          </div>
        </div>

        <style>{`
          @media (max-width: 920px) {
            .positioning { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

window.LL_About = About;
