// Hero — full-bleed aerial photo of the Danube with a slow drift, serif headline on top
const { useEffect: useEffectHero, useRef: useRefHero } = React;

// Words rise in one after another; a phrase without spaces (Chinese) rises as one piece
// and is not followed by a space.
const CJK = /[　-鿿＀-￯]/;

function HeroTitle({ phrases }) {
  const ref = useRefHero(null);
  useEffectHero(() => {
    const words = ref.current?.querySelectorAll(".word") || [];
    words.forEach((w, i) => { w.style.animationDelay = `${300 + i * 80}ms`; });
  }, []);

  return (
    <h1 ref={ref} className="display h1 hero" style={{ margin: "0 0 32px" }}>
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

// The photo drifts slower than the page while the hero is on screen.
function useParallax(ref) {
  useEffectHero(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight * 1.2);
        if (ref.current) ref.current.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(frame); };
  }, []);
}

function Hero() {
  const t = window.LL_T.hero;
  const { PHOTOS } = window.LL_DATA;
  const bg = useRefHero(null);
  useParallax(bg);

  return (
    <section id="hero" className="hero--photo" data-screen-label="Hero">
      <div className="hero-bg" ref={bg}>
        <img src={window.LL_ROOT + PHOTOS.hero} alt={t.figure.alt} width="1500" height="890" fetchpriority="high" />
      </div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-eyebrow">
          <span className="dot" />
          <span className="label">{t.eyebrow}</span>
          <span className="rule" />
          <span className="label eyebrow-right">{t.eyebrowRight}</span>
        </div>

        <HeroTitle phrases={t.title} />

        <p className="lede hero-lede">{t.lede}</p>

        <div className="hero-actions">
          <a href="#membership" className="btn btn--solid">
            {t.primary} <span className="arrow">→</span>
          </a>
          <a href="#visit" className="btn">{t.secondary}</a>
        </div>

        <div className="hero-foot">
          <div className="hero-meta">
            {t.meta.map(m => (
              <div key={m.label}>
                <div className="label">{m.label}</div>
                <div className="v">{m.value}</div>
              </div>
            ))}
          </div>
          <p className="hero-credit" aria-hidden="true">{t.figure.place}</p>
        </div>
      </div>
    </section>
  );
}

window.LL_Hero = Hero;
