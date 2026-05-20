// Three tiers — Current-system variant. Same shape as the original, content edited
// to match the current chain's rules (identity fields, candidate page, etc.)

const TIER_DATA_CURRENT = [
  {
    cls: "mandatory",
    priority: "▼ Mandatory",
    num: "I.",
    title: "Get on the chain & apply",
    desc:
      "Without these, your candidacy literally does not exist in the system. The chain checks them at submission.",
    items: [
      "Full citizenship, claimed on-chain",
      "5,000+ Merits in your account",
      "Not currently on welfare",
      "Application submitted via the Congress tab",
      "Display name, legal name and website — 32 chars each",
    ],
  },
  {
    cls: "encouraged",
    priority: "▼ Strongly encouraged",
    num: "II.",
    title: "Be someone voters know",
    desc:
      "The chain doesn't check for them. But skipping these means most citizens have no idea who you are when they pick their selections.",
    items: [
      "1–3 minute campaign video (you, on camera)",
      "Candidate page — your own URL or one at liberland.org/elections",
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
      "Public, named endorsements (especially from sitting Congress)",
      "Documented prior contribution to Liberland",
    ],
  },
];

const Tiers = () => (
  <section className="section" id="how" data-screen-label="04 Three tiers">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="section-num">§ 03 · The work</div>
          <h2>Three tiers,<br/><em>in priority order.</em></h2>
        </div>
        <p className="lead">
          Treat them as priorities, not a menu. Mandatory must be done.
          Encouraged is where serious candidates actually win or lose. Optional separates
          finalists from also-rans.
        </p>
      </div>

      <div className="tiers">
        {TIER_DATA_CURRENT.map((t) => (
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

      <div className="spot-row">
        <div>
          <div className="eyebrow" style={{marginBottom: 20}}>The spot</div>
          <h3 className="spot-heading">
            One short video does more<br/>than a month of posts.
          </h3>
          <p className="spot-lead">
            One to three minutes. You on camera, telling the truth — who you are,
            why you're running, what you would actually do in Congress.
          </p>
          <p className="spot-body">
            Phone-quality is fine. A clear honest take filmed in your kitchen beats
            a polished generic clip every time. Citizens are deciding whether they
            trust you with their Merit-weighted selections — a face and a voice
            make that judgement possible.
          </p>
        </div>
        <PhotoSlot label="Candidate speaking direct to camera" ref_id="PH-CANDIDATE-01" aspect="4 / 5" />
      </div>
    </div>
  </section>
);

window.Tiers = Tiers;
