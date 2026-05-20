// The three tiers: Mandatory / Encouraged / Optional.
// Each is a card with a colour-coded top rule, a short pitch, and a checklist.

const TIER_DATA = [
  {
    cls: "mandatory",
    priority: "▼ Mandatory",
    num: "I.",
    title: "Get on the ballot",
    desc:
      "Without these you literally do not exist in the system. They're enforced by the smart contracts.",
    items: [
      "Verified citizen identity on-chain",
      "5,000+ LLM staked, no active cooldown",
      "No final suspension on record",
      "registerCandidate() called in the 14-day window",
      "Candidacy deposit locked (returned after election)",
    ],
  },
  {
    cls: "encouraged",
    priority: "▼ Strongly encouraged",
    num: "II.",
    title: "Be someone voters know",
    desc:
      "Optional in the strictest sense — but skip these and most citizens will have no idea who you are on election day.",
    items: [
      "1–3 minute campaign video (you, on camera)",
      "Written candidate statement, 300–800 words",
      "Pinned introduction thread on the Forum",
      "Presence in Liberland Chat (Matrix)",
      "Clear positions on 2–3 substantive issues",
    ],
  },
  {
    cls: "optional",
    priority: "▼ Optional differentiators",
    num: "III.",
    title: "Be someone they remember",
    desc:
      "None of these are required. All of them consistently show up in the campaigns of citizens who finish at the top.",
    items: [
      "Long-form policy essay on one issue",
      "Live AMA in Liberland Chat",
      "Candidate debates — show up if they happen",
      "Public, on-chain endorsements",
      "Documented prior contribution to Liberland",
    ],
  },
];

const Tiers = () => (
  <section className="section" id="how" data-screen-label="03 Three tiers">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="section-num">§ 02 · The work</div>
          <h2>Three tiers,<br/><em>in priority order.</em></h2>
        </div>
        <p className="lead">
          Treat them as priorities, not a menu. Mandatory must be done.
          Encouraged is where serious candidates actually win or lose. Optional separates finalists from also-rans.
        </p>
      </div>

      <div className="tiers">
        {TIER_DATA.map((t) => (
          <div className={`tier-card ${t.cls}`} key={t.cls}>
            <div className="priority">{t.priority}</div>
            <div className="num">{t.num}</div>
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
            <ul>
              {t.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr",
        gap: 64,
        marginTop: 32,
        alignItems: "center",
      }} className="intro-grid">
        <div>
          <div className="eyebrow" style={{marginBottom: 20}}>The spot</div>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 36,
            lineHeight: 1.1,
            color: "var(--navy-deep)",
            marginBottom: 18,
            fontWeight: 400,
            letterSpacing: "-0.02em",
          }}>
            One short video does more<br/>than a month of posts.
          </h3>
          <p style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: 20,
            lineHeight: 1.5,
            color: "var(--text-mute)",
            margin: "0 0 16px",
          }}>
            One to three minutes. You on camera, telling the truth — who you are, why you're running, what you would actually do in Congress.
          </p>
          <p style={{color: "var(--text)", fontSize: 15, lineHeight: 1.65, margin: 0}}>
            Phone-quality is fine. A clear honest take filmed in your kitchen
            beats a polished generic clip every time. Citizens are deciding
            whether they trust you with their stake-weighted votes — a face
            and a voice make that judgement possible.
          </p>
        </div>
        <PhotoSlot label="Candidate speaking direct to camera" ref_id="PH-CANDIDATE-01" aspect="4 / 5" />
      </div>
    </div>
  </section>
);

window.Tiers = Tiers;
