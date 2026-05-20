// Eligibility checker — Current-system variant.
// Gate-first design: Q1 is "Are you a citizen?" — if NO, we route the user
// to an onboarding panel ("complete your dashboard first") instead of continuing.
// If YES, the rest of the checks proceed normally.

const ELIG_QUESTIONS_CURRENT = [
  {
    id: "citizen",
    title: "Are you a full citizen of Liberland?",
    help: "E-residents and pending applicants can't run. If your citizenship isn't active yet, finish that on liberland.org before anything else.",
    gating: true, // If "no", route to onboarding
  },
  {
    id: "onchain",
    title: "Is your citizenship claimed on-chain with an identity set?",
    help: "You need a wallet, you need to claim citizenship at blockchain.liberland.org, and you need to set at least a display name on your on-chain profile.",
  },
  {
    id: "merits",
    title: "Do you hold at least 5,000 Merits (LLM)?",
    help: "Hard threshold for political rights. Check the balance in your wallet. Merits typically arrive about one business day after claiming.",
  },
  {
    id: "welfare",
    title: "Are you currently off welfare?",
    help: "Citizens on welfare cannot vote or stand for Congress. If you're unsure of your status, check on liberland.org before applying.",
  },
  {
    id: "time",
    title: "Can you commit at least 5 hours per week to the role?",
    help: "The current docs are explicit: this is the minimum to do the job properly. Citizens read absent Congress members as bad faith — and remember it next cycle.",
  },
];

const Eligibility = () => {
  const [answers, setAnswers] = React.useState({});

  const answer = (qid, val) => setAnswers((a) => ({ ...a, [qid]: val }));
  const reset = () => setAnswers({});

  const total = ELIG_QUESTIONS_CURRENT.length;
  const answered = Object.keys(answers).length;
  const allYes = ELIG_QUESTIONS_CURRENT.every((q) => answers[q.id] === "yes");
  const anyNo = ELIG_QUESTIONS_CURRENT.some((q) => answers[q.id] === "no");
  const anyUnsure = ELIG_QUESTIONS_CURRENT.some((q) => answers[q.id] === "unsure");

  // Special: did they fail the citizenship gate?
  const citizenshipNo = answers.citizen === "no";

  const currentIdx = ELIG_QUESTIONS_CURRENT.findIndex((q) => !answers[q.id]);
  const current = currentIdx === -1 ? null : ELIG_QUESTIONS_CURRENT[currentIdx];
  const progress = (answered / total) * 100;

  // ---- Branch 1: citizenship failed → route to onboarding ----
  if (citizenshipNo) {
    return (
      <section className="section elig-section" id="eligibility" data-screen-label="02 Eligibility">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-num">§ 01 · Pre-flight</div>
              <h2>Can you<br/><em>actually</em> run?</h2>
            </div>
            <p className="lead">
              The blockchain checks three things before it'll accept your application. If
              you aren't a citizen yet, the rest doesn't matter — start there.
            </p>
          </div>

          <div className="elig elig-redirect">
            <div className="redirect-icon">
              <Crest size={48} />
            </div>
            <div className="redirect-body">
              <div className="redirect-eyebrow">First things first</div>
              <h3>Complete your citizenship dashboard.</h3>
              <p>
                You can't stand for Congress until you're a full Liberland citizen.
                Open your dashboard on liberland.org, finish whatever's still pending
                (KYC, residency confirmation, citizenship claim), then come back here.
              </p>
              <p className="redirect-note">
                Already a citizen but it isn't showing in the chain yet? You probably need
                to <strong>claim on-chain</strong> via the dApp — see <a href="#onboard">Get on the chain</a> below.
              </p>
              <div className="redirect-ctas">
                <a href="https://liberland.org/profile" target="_blank" rel="noopener" className="btn btn-primary">
                  Open my dashboard
                  <ArrowRight />
                </a>
                <a href="#onboard" className="btn btn-ghost">
                  Skip to on-chain onboarding
                </a>
                <button className="btn btn-link" onClick={reset}>
                  ← Re-check eligibility
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ---- Result construction for all-answered states ----
  let result = null;
  if (!current) {
    if (allYes) {
      result = {
        kind: "pass",
        icon: "✓",
        title: "You're eligible to stand.",
        body:
          "All five gates pass. Open the dApp, go to the Congress tab, click Apply for Congress, and sign the transaction. Don't forget your display name, legal name, and website — 32 characters each.",
        cta: { href: "https://blockchain.liberland.org", label: "Open the Congress tab" },
      };
    } else if (anyNo) {
      const labels = {
        onchain: "claim your citizenship on-chain and set your identity",
        merits: "hold at least 5,000 Merits in your account",
        welfare: "come off welfare before applying",
        time: "block out the five-hours-a-week minimum",
      };
      const blocking = ELIG_QUESTIONS_CURRENT
        .filter((q) => answers[q.id] === "no" && q.id !== "citizen")
        .map((q) => q.id);
      result = {
        kind: "fail",
        icon: "—",
        title: "Not eligible — yet.",
        body:
          "Before the chain will accept your application, you'll need to " +
          blocking.map((b) => labels[b]).join(", ") +
          ". None of these are deal-breakers in the long run.",
      };
    } else {
      result = {
        kind: "unsure",
        icon: "?",
        title: "Probably eligible — but verify.",
        body:
          "You're not sure about one or more checks. Confirm in your liberland.org profile and in the dApp before submitting an application.",
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
            Five questions. Thirty seconds. The first one gates everything else —
            if you're not a citizen yet, the rest doesn't matter.
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
              <div className="q-num">
                ▼ Check {currentIdx + 1}{current.gating ? "  ·  gating question" : ""}
              </div>
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
                {result.cta && (
                  <div style={{marginTop: 16}}>
                    <a href={result.cta.href} target="_blank" rel="noopener" className="btn btn-primary">
                      {result.cta.label}<ArrowRight />
                    </a>
                  </div>
                )}
              </div>
              <button className="reset" onClick={reset}>Start over</button>
            </div>
          )}

          <div className="elig-summary">
            {ELIG_QUESTIONS_CURRENT.map((q, i) => {
              const v = answers[q.id];
              const cls = v === "yes" ? "yes" : v === "no" ? "no" : "pending";
              const glyph = v === "yes" ? "✓" : v === "no" ? "×" : v === "unsure" ? "?" : (i + 1);
              const titles = {
                citizen: "Citizen",
                onchain: "On-chain",
                merits: "5k Merits",
                welfare: "Off welfare",
                time: "5h / wk",
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
