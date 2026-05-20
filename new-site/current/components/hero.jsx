// Hero — Current-system variant.
// Differences from original: 90-day cycle facts, "election moment" ticker copy,
// 5h/week job badge, no countdown (because the cycle is continuous).

const HeroCurrent = () => {
  // Toggle nav between "over dark hero" and "over paper" based on scroll
  React.useEffect(() => {
    const nav = document.querySelector(".nav");
    if (!nav) return;
    const hero = document.querySelector(".hero");
    const onScroll = () => {
      if (!hero) return;
      const overHero = window.scrollY < hero.offsetHeight - 80;
      nav.classList.toggle("over-dark", overHero);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const useCount = (target, duration = 1400) => {
    const [n, setN] = React.useState(0);
    React.useEffect(() => {
      const start = performance.now();
      let raf;
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(target * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }, [target]);
    return n;
  };

  const minStake = useCount(5000);
  const cycle = useCount(90);

  return (
    <section className="hero" data-screen-label="01 Hero">
      <div className="hero-grid" />
      <div className="hero-glow g1" />
      <div className="hero-glow g2" />
      <div className="hero-noise" />

      <nav className="nav over-dark">
        <div className="nav-brand">
          <Crest className="crest" size={22} />
          Liberland <em>·</em> Candidate
        </div>
        <div className="nav-links">
          <a href="#eligibility">Eligibility</a>
          <a href="#onboard">Get on chain</a>
          <a href="#how">How it works</a>
          <a href="#take-action">Take action</a>
          <a href="#voting">Phragmén</a>
          <button className="nav-cta" onClick={() => window.open('https://blockchain.liberland.org','_blank')}>Apply</button>
        </div>
      </nav>

      <div className="hero-inner">
        <div className="phase-ticker" title="Continuous election state">
          <span className="dot" />
          <span className="label">Election in progress</span>
          <span className="sep">/</span>
          <span className="meta">Cycle resolves every 90 days</span>
          <span className="sep">/</span>
          <span className="meta">Votes carry forward</span>
        </div>

        <h1>
          Stand <em>for</em><br />
          Congress.
        </h1>
        <p className="sub">
          Five thousand Merits. Five hours a week. The Constitution sets the rules,
          the chain counts the ballots — everything else is on you.
        </p>

        <div className="hero-ctas">
          <a href="https://blockchain.liberland.org" target="_blank" rel="noopener" className="btn btn-primary">
            Apply via the dApp
            <ArrowRight />
          </a>
          <a href="#eligibility" className="btn btn-ghost">
            Am I eligible?
          </a>
          <a href="primer-current.html" className="btn btn-link" target="_blank" rel="noopener">
            Read the full primer →
          </a>
        </div>

        <div className="stat-strip">
          <div className="stat">
            <div className="v">{cycle}<em>d</em></div>
            <div className="l">Continuous cycle</div>
          </div>
          <div className="stat">
            <div className="v">{minStake.toLocaleString()}<em>+</em></div>
            <div className="l">Merits required</div>
          </div>
          <div className="stat">
            <div className="v">5<em>h</em></div>
            <div className="l">Per week, the job</div>
          </div>
          <div className="stat">
            <div className="v">32<em>c</em></div>
            <div className="l">Char limit per profile field</div>
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <span>Scroll</span>
        <div className="bar" />
      </div>
    </section>
  );
};

window.HeroCurrent = HeroCurrent;
