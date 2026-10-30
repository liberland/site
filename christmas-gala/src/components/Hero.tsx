import { useEffect, useRef } from 'react';
import { event } from '../data/event';
import { dateConfirmed, dateMono, registrationCta, externalLinkProps } from '../lib/event-helpers';
import { Arrow } from './Arrow';
import { HeroFacade } from './Art';

/** Very light parallax on the hero drawing; skipped for reduced-motion users. */
function useParallax(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, el.offsetHeight);
      el.style.setProperty('--py', `${(y * 0.14).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useParallax(ref);
  const cta = registrationCta();
  const ext = cta.external ? externalLinkProps : {};

  return (
    <section className="hero" id="top" aria-labelledby="hero-title" ref={ref}>
      <div className="hero-art" aria-hidden="true">
        <HeroFacade />
      </div>
      <div className="hero-vignette" aria-hidden="true" />
      {event.atmosphere.snow && <div className="snow" aria-hidden="true" />}

      <div className="wrap">
        <div className="hero-copy">
          <p className="hero-kicker label" style={{ margin: 0 }}>
            {event.city} · {event.date.monthLabel} · {event.venue.shortName}
          </p>
          <h1 id="hero-title">
            <span className="pre">Liberland</span>
            <span className="big">
              Grand
              <br />
              <em>Christmas</em>
              <br />
              Gala
            </span>
            <span className="sr-only"> 2026</span>
          </h1>
          <p className="sub">{event.tagline}</p>
          <dl className="hero-meta" style={{ marginBottom: 0 }}>
            <div>
              <dt className="label">City</dt>
              <dd>
                {event.city.toUpperCase()}, {event.countryCode}
              </dd>
            </div>
            <div>
              <dt className="label">Date</dt>
              <dd>
                {dateMono()}
                {!dateConfirmed && <small>Proposed · not yet confirmed</small>}
              </dd>
            </div>
            <div>
              <dt className="label">Venue</dt>
              <dd>{event.venue.shortName.toUpperCase()}</dd>
            </div>
          </dl>
          <div className="hero-ctas">
            <a className="btn btn-gold" href={cta.href} {...ext}>
              {cta.label} <Arrow />
            </a>
            <a className="btn btn-ghost" href="#programme">
              Discover the Programme
            </a>
          </div>
        </div>
      </div>
      <div className="wrap hero-foot">
        <a className="scroll-cue label" href="#introduction">
          <i aria-hidden="true" />
          Scroll
        </a>
        <p className="art-credit" style={{ margin: 0 }}>
          {event.editorial.heroArtCredit}
        </p>
      </div>
    </section>
  );
}
