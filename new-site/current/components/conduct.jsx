// Conduct — Phragmén-aware copy (no downvote; cost of being disliked is being dropped).

const DO_ITEMS_C = [
  "Be the candidate a broad set of voters are comfortable adding to their selection — not just their first choice.",
  "Substantive positions on real issues. Voters who select many candidates skim hard; specificity catches them.",
  "Reach beyond your base. Even a marginal addition to a voter's selection can swing Phragmén your way.",
  "Disclose any commercial conflict that touches Liberland policy on your candidate page.",
  "Stay visible across the full 90 days. Votes persist; attention is continuous, not seasonal.",
];

const DONT_ITEMS_C = [
  "Polarising positions. There's no formal downvote — citizens who dislike you simply leave you off their list.",
  "Attacking other candidates by name. Their supporters tend to drop you from their list rather than convert.",
  "Vague platitudes. Voters evaluating ten candidates have no patience for slogans.",
  "Sockpuppet endorsements. Anonymous accounts are easy to spot and uniformly counterproductive.",
  "Going dark after applying. Disappearing for 80 of 90 days is the strongest signal voters have about how you'd serve.",
];

const Conduct = () => (
  <section className="section" id="conduct" data-screen-label="08 Conduct">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="section-num">§ 07 · Conduct &amp; integrity</div>
          <h2>What earns trust.<br/><em>What loses it permanently.</em></h2>
        </div>
        <p className="lead">
          The community is small. Bad-faith conduct is remembered across cycles —
          and because votes persist across cycles, it follows you literally.
        </p>
      </div>

      <div className="conduct-grid">
        <div className="conduct-side do">
          <h3>↑ What works under Phragmén</h3>
          <ul>
            {DO_ITEMS_C.map((t, i) => (
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
            {DONT_ITEMS_C.map((t, i) => (
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
