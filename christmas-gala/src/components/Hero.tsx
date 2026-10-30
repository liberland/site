import { useEffect, useRef } from 'react';
import { event } from '../data/event';
import { dateConfirmed, dateDayMonthYear, dateLong, resolvePhoto } from '../lib/event-helpers';
import { Photo } from './Photo';
import { Flourish, Garland, Star, Wreath } from './Ornaments';

/** Slow drift of the photograph while scrolling; skipped for reduced-motion users. */
function useParallax(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.min(window.scrollY, el.offsetHeight);
      el.style.setProperty('--py', `${(y * 0.18).toFixed(1)}px`);
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
  const v = event.venue;

  return (
    <section className="hero" id="top" aria-labelledby="hero-title" ref={ref}>
      <div className="hero-media">
        <Photo
          photo={v.heroPhoto}
          sizes="100vw"
          eager
          className="hero-photo"
          fallback={<Wreath className="hero-wreath" />}
        />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <Garland kind="swag" className="hero-garland" eager />

      <div className="wrap hero-inner">
        <p className="eyebrow hero-eyebrow">
          {event.city} <Star /> {dateConfirmed ? dateDayMonthYear() : `${dateDayMonthYear()} · proposed`}
        </p>
        <h1 id="hero-title" className="hero-title">
          <span className="hero-liberland">Liberland</span>
          <span className="hero-grand">
            Grand <em>Christmas</em> Gala
          </span>
          <span className="sr-only"> 2026</span>
        </h1>
        <Flourish className="hero-flourish" />
        <p className="hero-sub">{event.tagline}</p>
        <p className="hero-details">
          <span>{dateLong()}</span>
          <Star />
          <span>{v.name}</span>
        </p>
        {!dateConfirmed && <p className="hero-pending">Proposed date · not yet confirmed</p>}
        <div className="hero-ctas">
          <a className="btn btn-gold" href="#celebration">
            Discover the Gala
          </a>
          <a className="btn btn-ivory" href="#programme">
            View Programme
          </a>
        </div>
      </div>
      {resolvePhoto(v.heroPhoto) && (
        <p className="hero-credit">
          {v.heroPhoto.title} · {v.street}, {v.district}
        </p>
      )}
    </section>
  );
}
