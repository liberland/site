// Weighted Phragmén explainer + simple simulator.
// Each voter has a Merit weight and picks a subset of candidates (multi-select).
// Voter weight splits across their selections; candidates ranked by total assigned weight.
// Top N elected.

const CANDIDATES_P = ["A", "B", "C", "D", "E", "F"];
const SEATS = 3; // For the demo

const INITIAL_VOTERS_P = [
  { name: "Alice", weight: 8000, picks: new Set(["A", "B", "C"]) },
  { name: "Bob",   weight: 25000, picks: new Set(["B", "D"]) },
  { name: "Carol", weight: 6000, picks: new Set(["A", "C", "E", "F"]) },
  { name: "Dan",   weight: 15000, picks: new Set(["B", "C", "D"]) },
];

const Phragmen = () => {
  const [voters, setVoters] = React.useState(INITIAL_VOTERS_P);

  const togglePick = (vi, c) => {
    setVoters((vs) => {
      const newVs = vs.slice();
      const v = { ...newVs[vi] };
      const picks = new Set(v.picks);
      if (picks.has(c)) picks.delete(c); else picks.add(c);
      v.picks = picks;
      newVs[vi] = v;
      return newVs;
    });
  };

  const setWeight = (vi, w) => {
    setVoters((vs) => {
      const newVs = vs.slice();
      newVs[vi] = { ...newVs[vi], weight: w };
      return newVs;
    });
  };

  // Score each candidate = sum over voters of (voter.weight / num_picks) for voters who selected them.
  // (This is the simplified "approval with split weight" — captures the Phragmén spirit
  // without implementing the full sequential algorithm.)
  const scores = CANDIDATES_P.map((c) => {
    let s = 0;
    voters.forEach((v) => {
      if (v.picks.has(c) && v.picks.size > 0) {
        s += v.weight / v.picks.size;
      }
    });
    return { candidate: c, score: Math.round(s) };
  });
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(1, ...scores.map((s) => s.score));

  return (
    <section className="section phragmen-section" id="voting" data-screen-label="07 Phragmen">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-num">§ 06 · Voting method</div>
            <h2>Approve everyone<br/>you'd <em>be happy</em> with.</h2>
          </div>
          <p className="lead">
            Voters pick every candidate they'd be glad to see seated — no fixed limit, no
            downvote. Weighted Phragmén redistributes Merit-weight to where it matters
            so almost no vote is wasted.
          </p>
        </div>

        <div className="phragmen">
          <div className="phragmen-controls">
            <h3>The voters</h3>
            <p className="lead">Drag each citizen's stake. Click candidates to add or remove them from a voter's selection.</p>

            {voters.map((v, i) => (
              <div className="voter" key={v.name}>
                <div className="voter-head">
                  <div className="name">{v.name}</div>
                  <div className="stake">
                    {v.weight.toLocaleString()} <em>Merits</em>
                  </div>
                </div>
                <input
                  type="range"
                  className="stake-slider"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={v.weight}
                  onChange={(e) => setWeight(i, Number(e.target.value))}
                  aria-label={`${v.name}'s Merit weight`}
                />
                <div className="pick-row">
                  {CANDIDATES_P.map((c) => (
                    <button
                      key={c}
                      className={`pick-cell ${v.picks.has(c) ? "on" : ""}`}
                      onClick={() => togglePick(i, c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="pick-meta">
                  Selected <b>{v.picks.size}</b> · each gets {v.picks.size ? Math.round(v.weight / v.picks.size).toLocaleString() : 0} Merits
                </div>
              </div>
            ))}
          </div>

          <div className="phragmen-results">
            <h3>Effective weight per candidate</h3>
            <p className="lead">Top {SEATS} in this demo would win seats — in a real cycle, every candidate with enough effective weight is elected.</p>

            <div className="tally">
              {sorted.map((row, idx) => {
                const isWinner = idx < SEATS;
                const pct = (row.score / maxScore) * 100;
                return (
                  <div
                    className={`tally-row ${isWinner ? "winner" : ""}`}
                    key={row.candidate}
                  >
                    <div className="rank">{String(idx + 1).padStart(2, "0")}</div>
                    <div className="candidate">{row.candidate}</div>
                    <div className="tally-bar approval">
                      <div className="pos" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="score">
                      {row.score.toLocaleString()}<em>w</em>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="d21-footer-note">
              The real Phragmén is more sophisticated — it picks seats sequentially and
              shifts each voter's <em>remaining</em> weight to candidates who still need
              support. The shape is the same: <strong>broad approval beats narrow
              enthusiasm</strong>, and being a defensible second choice for many is
              worth more than being the first choice of a few.
            </div>
          </div>
        </div>

        <div className="phragmen-callout">
          <div className="pc-glyph">⇄</div>
          <div>
            <h4>Delegation: it persists, silently.</h4>
            <p>
              Voters can delegate their Merit weight to a sitting Congress member.
              That member's selections then apply with the delegator's weight added.
              A respected sitting member who includes you in their picks moves
              significant weight your way — and dropping you moves it the other way,
              quietly, without anyone announcing it. <strong>Cultivate those
              relationships across the full cycle, not the last week.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

window.Phragmen = Phragmen;
