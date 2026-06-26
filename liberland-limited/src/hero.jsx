// Hero — full-bleed Swiss layout with split serif/sans, subtle dove silhouette and figure
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

function Hero() {
  const titleRef = useRefHero(null);

  useEffectHero(() => {
    const words = titleRef.current?.querySelectorAll(".word") || [];
    words.forEach((w, i) => { w.style.animationDelay = `${i * 80}ms`; });
  }, []);

  const title = "A members' house for the Liberland community.";

  return (
    <section id="hero" data-screen-label="Hero">
      <DoveSilhouette />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="hero-eyebrow">
          <span className="dot" />
          <span className="label">Liberland Limited · Hong Kong</span>
          <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
          <span className="label" style={{ color: "var(--ink-mute)" }}>Est. MMXXIV</span>
        </div>

        <div className="hero-grid">
          <div>
            <h1 ref={titleRef} className="display h1 hero" style={{ marginBottom: 36 }}>
              {title.split(" ").map((w, i) => (
                <React.Fragment key={i}>
                  <span className="word">{w}</span>
                  <span> </span>
                </React.Fragment>
              ))}
            </h1>

            <p className="lede" style={{ maxWidth: 560, margin: 0 }}>
              We provide membership services, host community gatherings, and broker
              residences at <em>Ark Village</em> on the Danube. One door. One office.
              One members' register.
            </p>

            <div className="hero-actions">
              <a href="#membership" className="btn btn--solid">
                Become a member <span className="arrow">→</span>
              </a>
              <a href="#events" className="btn">
                Upcoming gatherings
              </a>
            </div>

            <div className="hero-meta">
              <div>
                <div className="label">Members</div>
                <div className="v num">1,240+</div>
              </div>
              <div>
                <div className="label">Gatherings / yr</div>
                <div className="v num">6 — 8</div>
              </div>
              <div>
                <div className="label">Residences brokered</div>
                <div className="v num">38</div>
              </div>
            </div>
          </div>

          <figure className="hero-figure" style={{ margin: 0 }}>
            <img
              src="https://ark.ll.land/wp-content/uploads/2022/05/20210814_210647-1024x768.jpg"
              alt="Ark Village on the Danube"
              loading="lazy"
            />
            <figcaption className="caption">
              <span>Ark Village · Apatin</span>
              <span>45.689° N · 18.945° E</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

window.LL_Hero = Hero;
