// Hero — split serif/sans layout, subtle dove silhouette and the company identity card
const { useEffect: useEffectHero, useRef: useRefHero } = React;

function DoveSilhouette() {
  // a gentle silhouette behind the hero — derived from the logo dove direction
  return (
    <div className="dove-bg" aria-hidden="true">
      <svg viewBox="0 0 600 600" fill="none">
        <circle cx="300" cy="300" r="280" fill="var(--teal)" opacity="0.18"/>
        <path
          d="M170 320 C 220 270, 280 250, 340 270 C 360 240, 400 230, 440 250 C 410 260, 400 290, 410 310 C 380 305, 360 320, 350 350 C 340 330, 320 325, 300 335 C 270 320, 220 330, 170 320 Z"
          fill="var(--teal)"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

// Words rise in one after another; a phrase without spaces (Chinese) rises as one piece
// and is not followed by a space.
const CJK = /[　-鿿＀-￯]/;

function HeroTitle({ phrases }) {
  const ref = useRefHero(null);
  useEffectHero(() => {
    const words = ref.current?.querySelectorAll(".word") || [];
    words.forEach((w, i) => { w.style.animationDelay = `${i * 80}ms`; });
  }, []);

  return (
    <h1 ref={ref} className="display h1 hero" style={{ margin: "0 0 36px" }}>
      {phrases.map((p, i) => {
        const words = p.text.split(" ").map((w, j) => (
          <React.Fragment key={j}>
            <span className="word">{w}</span>{CJK.test(w) ? "" : " "}
          </React.Fragment>
        ));
        return p.em ? <em key={i}>{words}</em> : <React.Fragment key={i}>{words}</React.Fragment>;
      })}
    </h1>
  );
}

function Hero() {
  const t = window.LL_T.hero;
  const { Link } = window.LL_UI;

  return (
    <section id="hero" data-screen-label="Hero">
      <DoveSilhouette />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-eyebrow">
          <span className="dot" />
          <span className="label label--ink">{t.eyebrow}</span>
          <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
        </div>

        <div className="hero-grid">
          <div>
            <HeroTitle phrases={t.title} />

            <p className="lede" style={{ maxWidth: 600, margin: 0 }}>{t.lede}</p>

            <div className="hero-actions">
              <a href="#membership" className="btn btn--solid">
                {t.primary} <span className="arrow">→</span>
              </a>
              <a href="#visit" className="btn">{t.secondary}</a>
            </div>

            <div className="hero-meta">
              {t.meta.map(m => (
                <div key={m.label}>
                  <div className="label">{m.label}</div>
                  <div className="v">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="id-card" aria-label={t.card.label}>
            <div className="id-head">
              <img src={`${window.LL_ROOT}assets/liberland-limited-logo.png`} alt="" />
              <div className="label label--teal">{t.card.label}</div>
            </div>
            <dl className="facts">
              {t.card.rows.map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt className="label">{k}</dt>
                  <dd>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
            <Link href={window.LL_T.registry} className="btn btn--ghost btn--sm" style={{ marginTop: 20, whiteSpace: "normal" }}>
              {t.card.verify}
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

window.LL_Hero = Hero;
