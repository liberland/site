import { event } from '../data/event';
import { registrationCta, externalLinkProps } from '../lib/event-helpers';
import { Arrow } from './Arrow';
import { FinaleRings } from './Art';
import escutcheonPng from '../assets/liberland-escutcheon-128.png';
import escutcheonWebp from '../assets/liberland-escutcheon-128.webp';

export function Finale() {
  const f = event.editorial.finale;
  const cta = registrationCta();
  return (
    <section className="finale" id="finale" aria-labelledby="finale-title">
      <div className="finale-rings" aria-hidden="true">
        <FinaleRings />
      </div>
      <div className="wrap">
        <span className="label reveal">
          {event.city} · {event.date.monthLabel}
        </span>
        <h2 id="finale-title" className="reveal">
          {f.line1}
          <br />
          <em>{f.line2}</em>
        </h2>
        <p className="lead reveal">{f.lead}</p>
        <a className="btn btn-gold reveal" href={cta.href} {...(cta.external ? externalLinkProps : {})}>
          {f.cta} <Arrow />
        </a>
        <div className="finale-mark">
          <picture>
            <source srcSet={escutcheonWebp} type="image/webp" />
            <img
              src={escutcheonPng}
              width={64}
              height={89}
              alt="Coat of arms of the Free Republic of Liberland"
              decoding="async"
            />
          </picture>
          <div className="rule-orn" style={{ width: 220 }}>
            <i />
          </div>
          <span className="motto">{f.motto}</span>
        </div>
      </div>
    </section>
  );
}
