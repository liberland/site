// Conduct & integrity: Do / Don't side-by-side, plus the "things candidates lose campaigns over" callout.

const DO_ITEMS = [
  "Be a candidate broadly acceptable voters can spend one of their four positive votes on.",
  "State clear positions calmly. Citizens reward specificity over slogans.",
  "Reach beyond your base. The marginal positive vote comes from someone who agrees with you on one issue out of three.",
  "Disclose any commercial conflict that touches Liberland policy in your statement.",
  "Show visible decency throughout the cycle — including toward candidates you disagree with.",
];

const DONT_ITEMS = [
  "Polarising positions designed to excite a base — under D21, who you repel matters as much as who you energise.",
  "Attacking other candidates by name. It mobilises their supporters' downvotes against you.",
  "Vague platitudes. With only four positive votes to allocate, voters skip candidates with nothing specific to say.",
  "Sockpuppet endorsements from anonymous or new accounts — uniformly counterproductive and easy to spot.",
  "Going dark after registration. Silence reads as either bad faith or lack of commitment.",
];

const Conduct = () => (
  <section className="section" id="conduct" data-screen-label="06 Conduct">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="section-num">§ 05 · Conduct &amp; integrity</div>
          <h2>What earns trust.<br/><em>What loses it permanently.</em></h2>
        </div>
        <p className="lead">
          The community is small. Bad-faith conduct is remembered across cycles.
          Almost every damaged reputation traces back to the same handful of mistakes.
        </p>
      </div>

      <div className="conduct-grid">
        <div className="conduct-side do">
          <h3>↑ What works under D21</h3>
          <ul>
            {DO_ITEMS.map((t, i) => (
              <li key={i}>
                <span className="glyph">+</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="conduct-side dont">
          <h3>↓ What backfires</h3>
          <ul>
            {DONT_ITEMS.map((t, i) => (
              <li key={i}>
                <span className="glyph">−</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

window.Conduct = Conduct;
