import { useRef, useState } from 'react';
import { event } from '../data/event';
import { withBase } from '../lib/assets';
import { registrationCta } from '../lib/event-helpers';
import { Flourish, Star } from './Ornaments';

/**
 * Christmas 2025 at Le Palais: the film of last year's gala, a strip of stills
 * and what happened that night. The film loads only when someone presses play
 * (preload none, no autoplay); it plays with sound because they asked for it.
 */
export function LastChristmas() {
  const ly = event.lastYear;
  const [playing, setPlaying] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const cta = registrationCta();

  return (
    <section className="memories" id="last-christmas" aria-labelledby="memories-title">
      <div className="wrap">
        <header className="sec-head sec-head--center reveal">
          <p className="eyebrow">{ly.eyebrow}</p>
          <h2 id="memories-title" className="display">
            Last Christmas <em>at Le Palais</em>
          </h2>
          <Flourish />
          <p className="memories-lead">{ly.lead}</p>
        </header>

        <figure className="cinema reveal">
          <div className="cinema-frame">
            {playing ? (
              <video
                ref={video}
                className="cinema-video"
                src={withBase(ly.film.src)}
                poster={withBase(ly.film.poster)}
                controls
                autoPlay
                playsInline
                preload="auto"
                aria-label={`${ly.film.title} — film, ${ly.film.duration}`}
              />
            ) : (
              <button type="button" className="cinema-play" onClick={() => setPlaying(true)} aria-label={`Play the film “${ly.film.title}” (${ly.film.duration}, ${ly.film.note.toLowerCase()})`}>
                <img src={withBase(ly.film.poster)} alt="" width={695} height={392} loading="lazy" decoding="async" />
                <span className="cinema-shade" aria-hidden="true" />
                <span className="cinema-cta" aria-hidden="true">
                  <span className="play-ring">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5.5v13l10.5-6.5z" />
                    </svg>
                  </span>
                  <span className="cinema-label">
                    <b>Watch the film</b>
                    <i>
                      {ly.film.title} · {ly.film.duration}
                    </i>
                  </span>
                </span>
              </button>
            )}
          </div>
          <figcaption>
            {ly.film.note}. {ly.credit}
          </figcaption>
        </figure>

        <ul className="stills" aria-label="Moments from Christmas 2025">
          {ly.stills.map((s, i) => (
            <li key={s.src} className="still reveal" style={{ transitionDelay: `${i * 70}ms` }}>
              <img src={withBase(s.src)} alt={s.alt} width={582} height={388} loading="lazy" decoding="async" />
            </li>
          ))}
        </ul>

        <ul className="memories-list">
          {ly.highlights.map((h) => (
            <li key={h.title} className="reveal">
              <Star />
              <div>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="memories-cta reveal">
          <span>This year it will be even better.</span>
          <a className="btn btn-gold" href={cta.href}>
            {cta.label}
          </a>
        </p>
      </div>
    </section>
  );
}
