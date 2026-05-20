// "Take action" — the three concrete actions the user asked for:
//   1. Submit your program (for this candidate profile)
//   2. Submit your video spot
//   3. Take part in a debate

const ACTIONS = [
  {
    id: "program",
    eyebrow: "Action 01",
    title: "Submit your program",
    desc:
      "Set your candidate page — the URL voters click from the ballot. Your own site, a Forum thread, or a single-page write-up at liberland.org/elections.",
    bullets: [
      "Up to 32 characters for the URL field",
      "Same place where you set display + legal name",
      "Update anytime — change isn't penalised",
    ],
    cta: "Edit my profile",
    href: "https://blockchain.liberland.org/home/profile",
    iconType: "doc",
  },
  {
    id: "video",
    eyebrow: "Action 02",
    title: "Submit your video spot",
    desc:
      "Upload your 1–3 minute pitch. Embed it on your candidate page, link it in your Forum introduction, share it in Matrix. Pinned for the cycle.",
    bullets: [
      "Phone-quality is fine — be honest, be specific",
      "Embed YouTube / Vimeo / IPFS / Odysee — host wherever you like",
      "We curate submissions on liberland.org/elections",
    ],
    cta: "Send us your spot",
    href: "mailto:elections@liberland.org?subject=Candidate%20video%20submission",
    iconType: "play",
  },
  {
    id: "debate",
    eyebrow: "Action 03",
    title: "Take part in a debate",
    desc:
      "Community-organised debates happen across cycles, in Liberland Chat and on Spaces. Sign up to be invited to the next one.",
    bullets: [
      "Roughly one debate per cycle on the main issues",
      "Format announced 48h in advance",
      "Declining publicly is a strong signal voters notice",
    ],
    cta: "Sign me up",
    href: "https://forum.liberland.org",
    iconType: "mic",
  },
];

const ActionIcon = ({ kind }) => {
  if (kind === "doc") {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 6 H40 L52 18 V58 H16 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M40 6 V18 H52" stroke="currentColor" strokeWidth="2" fill="none"/>
        <line x1="22" y1="28" x2="46" y2="28" stroke="currentColor" strokeWidth="2"/>
        <line x1="22" y1="36" x2="46" y2="36" stroke="currentColor" strokeWidth="2"/>
        <line x1="22" y1="44" x2="38" y2="44" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  }
  if (kind === "play") {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="14" width="52" height="36" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M27 24 L43 32 L27 40 Z" fill="currentColor"/>
      </svg>
    );
  }
  if (kind === "mic") {
    return (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="24" y="6" width="16" height="30" rx="8" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M14 30 Q14 50 32 50 Q50 50 50 30" stroke="currentColor" strokeWidth="2" fill="none"/>
        <line x1="32" y1="50" x2="32" y2="58" stroke="currentColor" strokeWidth="2"/>
        <line x1="22" y1="58" x2="42" y2="58" stroke="currentColor" strokeWidth="2"/>
      </svg>
    );
  }
  return null;
};

const TakeAction = () => (
  <section className="section take-action-section" id="take-action" data-screen-label="05 Take action">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="section-num">§ 04 · Take action</div>
          <h2>Three things<br/><em>to do today.</em></h2>
        </div>
        <p className="lead">
          You've applied — or you're about to. These are the three concrete moves
          that turn an entry on the candidate list into an actual campaign.
        </p>
      </div>

      <div className="action-grid">
        {ACTIONS.map((a) => (
          <article className="action-card" key={a.id} id={`action-${a.id}`}>
            <div className="action-eyebrow">{a.eyebrow}</div>
            <div className="action-icon">
              <ActionIcon kind={a.iconType} />
            </div>
            <h3>{a.title}</h3>
            <p className="action-desc">{a.desc}</p>
            <ul className="action-bullets">
              {a.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <a className="btn btn-primary action-cta" href={a.href} target="_blank" rel="noopener">
              {a.cta}<ArrowRight />
            </a>
          </article>
        ))}
      </div>
    </div>
  </section>
);

window.TakeAction = TakeAction;
