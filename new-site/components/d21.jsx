// D21 Janeček voting simulator.
// Three voters with adjustable stakes; each gets up to 4 positive votes and 1 negative.
// Live tally of 5 candidates — top 3 highlighted as winners.

const CANDIDATES = ["A", "B", "C", "D", "E"];

const INITIAL_VOTERS = [
  {
    name: "Alice",
    stake: 10000,
    votes: { A: "+", B: "+", C: "+", D: 0, E: "-" },
  },
  {
    name: "Bob",
    stake: 50000,
    votes: { A: "+", B: "+", C: "-", D: "+", E: 0 },
  },
  {
    name: "Carol",
    stake: 5000,
    votes: { A: "-", B: "+", C: "+", D: "+", E: "+" },
  },
];

const D21 = () => {
  const [voters, setVoters] = React.useState(INITIAL_VOTERS);

  const cycle = (vIdx, candidate) => {
    setVoters((vs) => {
      const v = { ...vs[vIdx] };
      const votes = { ...v.votes };
      const current = votes[candidate] || 0;

      // Count current positives & negatives (excluding this candidate)
      const positives = Object.entries(votes)
        .filter(([k, val]) => k !== candidate && val === "+").length;
      const negatives = Object.entries(votes)
        .filter(([k, val]) => k !== candidate && val === "-").length;

      // Cycle: 0 → + → - → 0
      // but enforce up to 4 positives and up to 1 negative
      let next;
      if (current === 0) {
        next = positives < 4 ? "+" : (negatives < 1 ? "-" : 0);
      } else if (current === "+") {
        next = negatives < 1 ? "-" : 0;
      } else {
        next = 0;
      }
      votes[candidate] = next;
      v.votes = votes;
      const newVs = [...vs];
      newVs[vIdx] = v;
      return newVs;
    });
  };

  const setStake = (vIdx, stake) => {
    setVoters((vs) => {
      const newVs = [...vs];
      newVs[vIdx] = { ...newVs[vIdx], stake };
      return newVs;
    });
  };

  // Compute tally
  const tally = CANDIDATES.map((c) => {
    let pos = 0, neg = 0;
    voters.forEach((v) => {
      if (v.votes[c] === "+") pos += v.stake;
      if (v.votes[c] === "-") neg += v.stake;
    });
    return { candidate: c, pos, neg, score: pos - neg };
  });
  const sorted = [...tally].sort((a, b) => b.score - a.score);
  const maxAbs = Math.max(
    1,
    ...tally.map((t) => Math.max(t.pos, t.neg))
  );

  return (
    <section className="section d21-section" id="voting" data-screen-label="05 D21 simulator">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-num">§ 04 · Voting method</div>
            <h2>Four thumbs up,<br/><em>one thumb down.</em></h2>
          </div>
          <p className="lead">
            Each citizen gets up to four positive votes and one negative — all weighted
            by their politically pooled LLM. Move the sliders below. Watch the
            ranking change in real time.
          </p>
        </div>

        <div className="d21">
          <div className="d21-controls">
            <h3>The voters</h3>
            <p className="lead">Adjust each citizen's stake and which candidates they support or oppose.</p>

            {voters.map((v, i) => {
              const ups = Object.values(v.votes).filter((x) => x === "+").length;
              const downs = Object.values(v.votes).filter((x) => x === "-").length;
              return (
                <div className="voter" key={v.name}>
                  <div className="voter-head">
                    <div className="name">{v.name}</div>
                    <div className="stake">
                      {v.stake.toLocaleString()} <em>LLM</em>
                    </div>
                  </div>
                  <input
                    type="range"
                    className="stake-slider"
                    min={1000}
                    max={80000}
                    step={1000}
                    value={v.stake}
                    onChange={(e) => setStake(i, Number(e.target.value))}
                    aria-label={`${v.name}'s stake`}
                  />
                  <div className="vote-row head">
                    <div></div>
                    {CANDIDATES.map((c) => (
                      <div key={c}>{c}</div>
                    ))}
                  </div>
                  <div className="vote-row">
                    <div className="row-label">vote</div>
                    {CANDIDATES.map((c) => {
                      const val = v.votes[c];
                      const cls =
                        val === "+" ? "up" :
                        val === "-" ? "down" : "";
                      return (
                        <button
                          key={c}
                          className={`vote-cell ${cls}`}
                          onClick={() => cycle(i, c)}
                          aria-label={`${v.name} vote for ${c}`}
                        >
                          {val === "+" ? "↑" : val === "-" ? "↓" : "·"}
                        </button>
                      );
                    })}
                  </div>
                  <div className="vote-count">
                    <span className="up-c">{ups}/4 up</span>
                    {"   ·   "}
                    <span className="down-c">{downs}/1 down</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="d21-results">
            <h3>Live tally</h3>
            <p className="lead">Top 3 in this demo would win seats — in a real election, top 21 sit, next 10 are runners-up.</p>

            <div className="tally">
              {sorted.map((row, idx) => {
                const isWinner = idx < 3;
                const isLast = idx === sorted.length - 1 && row.score < 0;
                const posPct = (row.pos / maxAbs) * 50;
                const negPct = (row.neg / maxAbs) * 50;
                return (
                  <div
                    className={`tally-row ${isWinner ? "winner" : ""} ${isLast ? "eliminated" : ""}`}
                    key={row.candidate}
                  >
                    <div className="rank">{String(idx + 1).padStart(2, "0")}</div>
                    <div className="candidate">{row.candidate}</div>
                    <div className="tally-bar">
                      <div className="neg" style={{ width: `${negPct}%` }} />
                      <div className="center" />
                      <div className="pos" style={{ width: `${posPct}%` }} />
                    </div>
                    <div className={`score ${row.score < 0 ? "neg" : ""}`}>
                      {row.score >= 0 ? "+" : ""}
                      {row.score.toLocaleString()}
                      <em>LLM</em>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="d21-footer-note">
              Note how a single downvote from the largest stakeholder can sink a
              candidate that two smaller voters supported. <strong>Stake matters.
              Decency matters more.</strong> Polarising into a base under D21
              tends to invite the downvotes that bury you.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

window.D21 = D21;
