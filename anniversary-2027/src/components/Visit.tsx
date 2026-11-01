import { useState } from 'react';
import { event, faq, visit } from '../data/anniversary';
import { mailto } from '../lib/event';
import { Arrow, Linkify, NewTab } from './Tag';

const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const NEW_TAB = <NewTab />;

/** I · Plan your visit — address, practical information and the travel FAQ. */
export function Visit() {
  const [open, setOpen] = useState(0);
  const v = event.venue;
  return (
    <section id="visit" className="sec sec-spring" aria-labelledby="visit-title">
      <div className="wrap visit-grid">
        <div className="rv">
          <h2 id="visit-title" className="h2">Practical information</h2>
          <dl className="addr">
            <div><dt>Venue</dt><dd>{v.name}</dd></div>
            <div><dt>Address</dt><dd><address>{v.street}<br />{v.postcode} {v.city}<br />{v.country}</address></dd></div>
            <div><dt>Contact</dt><dd><a href={mailto()}>{event.contact.email}</a></dd></div>
            <div><dt>Venue site</dt><dd><a href={v.url} target="_blank" rel="noopener">{host(v.url)}{NEW_TAB}</a></dd></div>
          </dl>
          <div className="visit-btns">
            <a className="btn btn-primary" href={v.mapsUrl} target="_blank" rel="noopener">Get directions <Arrow c="↗" />{NEW_TAB}</a>
            <a className="btn btn-line" href={v.url} target="_blank" rel="noopener">{v.name} website{NEW_TAB}</a>
          </div>
          <p className="notice"><strong>The venue is in {v.country}</strong>{visit.notice}</p>
        </div>
        <div className="rv">
          <div className="info">
            <div>
              <h3>Accommodation</h3>
              <p className="body">{visit.accommodation} <a href={mailto()}>{event.contact.email}</a>.</p>
            </div>
            <div>
              <h3>Travel</h3>
              <p className="body">{visit.travel}</p>
            </div>
          </div>
          <h3 className="faq-h">Questions</h3>
          <div className="faq">
            {faq.map((f, i) => (
              <div key={f.q}>
                <h4 style={{ margin: 0, font: 'inherit' }}>
                  <button
                    type="button"
                    className="faq-q"
                    id={`faq-q-${i}`}
                    aria-expanded={open === i}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(open === i ? -1 : i)}
                  >
                    <span>{f.q}</span>
                    <span className="faq-ic" aria-hidden="true">{open === i ? '−' : '+'}</span>
                  </button>
                </h4>
                <p className="faq-a fade-in" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} hidden={open !== i}>
                  <Linkify text={f.a} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
