import { useState } from 'react';
import { event, faq, visit } from '../data/anniversary';
import { mailto } from '../lib/event';
import { Arrow, Linkify } from './Tag';

const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const NEW_TAB = <span className="vh"> (opens in a new tab)</span>;

/** I · Plan your visit — address, practical information and the travel FAQ. */
export function Visit() {
  const [open, setOpen] = useState(0);
  const v = event.venue;
  return (
    <section id="visit" className="sec s-visit" aria-labelledby="visit-title">
      <div className="wrap grid">
        <div className="visit-l rv">
          <p className="kick lbl">Plan your visit</p>
          <h2 id="visit-title" className="d2">Getting to {v.name}</h2>
          <div className="addr">
            <div><span className="rec">Venue</span><span className="v">{v.name}</span></div>
            <div><span className="rec">Address</span><address className="v" style={{ fontStyle: 'normal' }}>{v.street}<br />{v.postcode} {v.city}<br />{v.country}</address></div>
            <div><span className="rec">Event contact</span><span className="v"><a href={mailto()}>{event.contact.email}</a></span></div>
            <div><span className="rec">Venue site</span><span className="v"><a href={v.url} target="_blank" rel="noopener">{host(v.url)}{NEW_TAB}</a></span></div>
          </div>
          <div className="visit-btns">
            <a className="btn btn-v" href={v.mapsUrl} target="_blank" rel="noopener">Get directions <Arrow c="↗" />{NEW_TAB}</a>
            <a className="btn btn-ov" href={v.url} target="_blank" rel="noopener">{v.name} website{NEW_TAB}</a>
          </div>
          <div className="notice">
            <span className="rec">The venue is in {v.country}</span>
            {visit.notice}
          </div>
        </div>
        <div className="visit-r">
          <div className="info-blk rv">
            <h3>Accommodation</h3>
            <p className="body">{visit.accommodation} <a href={mailto()}>{event.contact.email}</a>.</p>
          </div>
          <div className="info-blk rv">
            <h3>Travel</h3>
            <p className="body">{visit.travel}</p>
          </div>
          <h3 className="d3 rv" style={{ marginBottom: 18 }}>Travel questions</h3>
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
