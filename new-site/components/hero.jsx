// Hero — dark gradient, animated grid + glows, big italic-serif headline,
// live phase ticker, primary CTAs, and a 4-up stat strip.

const Hero = () => {
  // Number animation for the headline stats
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

  const seats = useCount(21);
  const runners = useCount(10);
  const minStake = useCount(5000);

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
          <a href="#how">How it works</a>
          <a href="#timeline">Timeline</a>
          <a href="#voting">D21 voting</a>
          <a href="#conduct">Conduct</a>
          <button className="nav-cta" onClick={() => window.open('#register','_self')}>Register</button>
        </div>
      </nav>

      <div className="hero-inner">
        <div className="phase-ticker" title="Live election state">
          <span className="dot" />
          <span className="label">Phase 1 · Candidacy open</span>
          <span className="sep">/</span>
          <span className="meta">9 days, 14 hrs remaining</span>
          <span className="sep">/</span>
          <span className="meta">Cycle 26·1</span>
        </div>

        <h1>
          Stand <em>for</em><br />
          Congress.
        </h1>
        <p className="sub">
          Twenty-one seats. Stake-weighted votes. The Constitution sets the rules,
          the chain counts the ballots — everything else is on you.
        </p>

        <div className="hero-ctas">
          <a href="#register" className="btn btn-primary">
            Register your candidacy
            <ArrowRight />
          </a>
          <a href="#eligibility" className="btn btn-ghost">
            Am I eligible?
          </a>
          <a href="primer.html" className="btn btn-link" target="_blank" rel="noopener">
            Read the full primer →
          </a>
        </div>

        <div className="stat-strip">
          <div className="stat">
            <div className="v">{seats}</div>
            <div className="l">Congressional seats</div>
          </div>
          <div className="stat">
            <div className="v">{runners}</div>
            <div className="l">Runner-up positions</div>
          </div>
          <div className="stat">
            <div className="v">14<em>+</em>14</div>
            <div className="l">Candidacy + voting days</div>
          </div>
          <div className="stat">
            <div className="v">{minStake.toLocaleString()}<em>+</em></div>
            <div className="l">LLM minimum stake</div>
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

window.Hero = Hero;
