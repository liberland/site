// Interactive eligibility checker.
// Five gating questions enforced by CandidateEligibilityPolicy on-chain.
// User answers yes / no / not sure → live verdict.

const ELIG_QUESTIONS = [
  {
    id: "citizen",
    title: "Are you a verified citizen of Liberland?",
    help: "E-residents and pending applicants can't run. KYC must be complete and your citizen ID linked to your EVM wallet in IdentityRegistry.",
  },
  {
    id: "adult",
    title: "Are you an adult on the registry?",
    help: "Constitution-level requirement. The registry tracks this from your KYC record.",
  },
  {
    id: "stake",
    title: "Do you have at least 5,000 LLM staked (politically pooled)?",
    help: "Liquid LLM doesn't count. The merit must be politically pooled — i.e. actively staked — at the moment you register.",
  },
  {
    id: "cooldown",
    title: "Is your stake free of any active unstaking cooldown?",
    help: "If you've started to unstake and the cooldown hasn't elapsed, you're locked out for this cycle. If unsure, leave your stake alone.",
  },
  {
    id: "clean",
    title: "Are you free of any final suspension?",
    help: "Citizens under final judicial suspension cannot stand. Check your status in DigiID before registering.",
  },
];

const Eligibility = () => {
  const [answers, setAnswers] = React.useState({});

  const answer = (qid, val) => setAnswers((a) => ({ ...a, [qid]: val }));

  const total = ELIG_QUESTIONS.length;
  const answered = Object.keys(answers).length;
  const allYes = ELIG_QUESTIONS.every((q) => answers[q.id] === "yes");
  const anyNo = ELIG_QUESTIONS.some((q) => answers[q.id] === "no");
  const anyUnsure = ELIG_QUESTIONS.some((q) => answers[q.id] === "unsure");

  const currentIdx = ELIG_QUESTIONS.findIndex((q) => !answers[q.id]);
  const current = currentIdx === -1 ? null : ELIG_QUESTIONS[currentIdx];

  const reset = () => setAnswers({});

  const progress = (answered / total) * 100;

  let result = null;
  if (!current) {
    if (allYes) {
      result = {
        kind: "pass",
        icon: "✓",
        title: "You're eligible to stand.",
        body:
          "On-chain checks should pass at registration. Lock your deposit during the 14-day candidacy window — earlier is better, it breaks ties in your favour.",
      };
    } else if (anyNo) {
      const blocking = ELIG_QUESTIONS.filter((q) => answers[q.id] === "no")
        .map((q) => q.id);
      const labels = {
        citizen: "complete citizenship verification",
        adult: "wait until adulthood per the registry",
        stake: "stake at least 5,000 LLM",
        cooldown: "let your unstaking cooldown elapse",
        clean: "resolve your suspension status",
      };
      result = {
        kind: "fail",
        icon: "—",
        title: "Not eligible — yet.",
        body:
          "You'll need to " +
          blocking.map((b) => labels[b]).join(", ") +
          " before the system will accept registerCandidate(). None of these are deal-breakers in the long run.",
      };
    } else {
      result = {
        kind: "unsure",
        icon: "?",
        title: "Probably eligible — but verify.",
        body:
          "You're not sure about one or more checks. Open your DigiID dashboard, confirm citizen status, stake balance and any active suspension before registering.",
      };
    }
  }

  return (
    <section className="section elig-section" id="eligibility" data-screen-label="02 Eligibility">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="section-num">§ 01 · Pre-flight</div>
            <h2>Can you<br/><em>actually</em> run?</h2>
          </div>
          <p className="lead">
            Five on-chain conditions are checked the moment you submit. None can be waived.
            Walk through them in 30 seconds.
          </p>
        </div>

        <div className="elig">
          <div className="elig-head">
            <h3>{current ? `Question ${currentIdx + 1} of ${total}` : "Result"}</h3>
            <div className="elig-progress">
              <b>{answered}</b> / {total} answered
            </div>
          </div>
          <div className="elig-bar"><span style={{ width: `${progress}%` }} /></div>

          {current ? (
            <div className="elig-q" key={current.id}>
              <div className="q-num">▼ Check {currentIdx + 1}</div>
              <div className="q-text">{current.title}</div>
              <div className="q-help">{current.help}</div>
              <div className="elig-options">
                <button className="yes" onClick={() => answer(current.id, "yes")}>Yes</button>
                <button className="no" onClick={() => answer(current.id, "no")}>No</button>
                <button className="unsure" onClick={() => answer(current.id, "unsure")}>Not sure</button>
              </div>
            </div>
          ) : (
            <div className={`elig-result ${result.kind}`}>
              <div className="icon">{result.icon}</div>
              <div>
                <h4>{result.title}</h4>
                <p>{result.body}</p>
              </div>
              <button className="reset" onClick={reset}>Start over</button>
            </div>
          )}

          <div className="elig-summary">
            {ELIG_QUESTIONS.map((q, i) => {
              const v = answers[q.id];
              const cls = v === "yes" ? "yes" : v === "no" ? "no" : "pending";
              const glyph = v === "yes" ? "✓" : v === "no" ? "×" : v === "unsure" ? "?" : (i + 1);
              const titles = {
                citizen: "Citizen",
                adult: "Adult",
                stake: "5k+ staked",
                cooldown: "No cooldown",
                clean: "Clean status",
              };
              return (
                <div className={`item ${cls}`} key={q.id}>
                  <span className="badge">{glyph}</span>
                  {titles[q.id]}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

window.Eligibility = Eligibility;
