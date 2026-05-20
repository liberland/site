// Election cycle timeline — 4 phases, horizontal track with active-phase pulsing dot.

const PHASES = [
  {
    phase: "Phase 1",
    duration: "14 days",
    title: "Candidacy registration",
    body:
      "Eligible citizens call registerCandidate() and lock their deposit. Minimum 22 must register, else the window extends by 7 days.",
    youDo:
      "Register early. Publish your video and statement. Introduce yourself on the Forum and Matrix.",
    active: true,
  },
  {
    phase: "Phase 2",
    duration: "14 days",
    title: "Voting",
    body:
      "Citizens cast and revise +/− votes on-chain, weighted by their politically pooled LLM, snapshotted at phase start.",
    youDo:
      "Stay visible. Answer questions. AMA if you can. Stop posting promo material in the last 48 hours.",
  },
  {
    phase: "Phase 3",
    duration: "Automatic",
    title: "Tallying & challenge",
    body:
      "Scores compute automatically. Top 21 → Congress, next 10 → runners-up. 14-day challenge window opens.",
    youDo:
      "Nothing on-chain. Thank supporters. Thank people who debated honestly with you.",
  },
  {
    phase: "Phase 4",
    duration: "After challenge",
    title: "Seating",
    body:
      "Once the challenge window clears, the new Congress is seated. The outgoing Congress remains until that moment — no governance gap. Deposits returned.",
    youDo:
      "Take office. Or, as runner-up: stay engaged. Seats open mid-term and they go to you first.",
  },
];

const Timeline = () => (
  <section className="section timeline-section" id="timeline" data-screen-label="04 Timeline">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="section-num">§ 03 · The cycle</div>
          <h2>What happens,<br/><em>when.</em></h2>
        </div>
        <p className="lead">
          Two weeks to get on the ballot. Two weeks for citizens to vote. Then it's
          on the chain. Here's what you do at each step.
        </p>
      </div>

      <div className="timeline">
        <div className="timeline-track" />
        <div className="timeline-phases">
          {PHASES.map((p, i) => (
            <div className={`tl-phase ${p.active ? "active" : ""}`} key={i}>
              <div className="tag">{p.phase}</div>
              <div className="duration">{p.duration}</div>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
              <div className="you-do">
                <strong>You do</strong>
                {p.youDo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

window.Timeline = Timeline;
