import { event } from '../data/event';
import { dateDayMonthYear, registrationCta, externalLinkProps } from '../lib/event-helpers';
import { Garland, Star, Wreath } from './Ornaments';
import crestPng from '../assets/liberland-escutcheon-128.png';
import crestWebp from '../assets/liberland-escutcheon-128.webp';

export function Finale() {
  const f = event.editorial.finale;
  const cta = registrationCta();
  return (
    <section className="finale" id="invitation" aria-labelledby="finale-title">
      <Garland kind="swag" className="finale-garland" />
      <div className="finale-stage">
        <Wreath className="finale-wreath" />
        <div className="finale-copy reveal">
          <p className="eyebrow">
            {event.city} <Star /> {dateDayMonthYear()}
          </p>
          <h2 id="finale-title" className="display">
            {f.title}
          </h2>
          <p className="finale-lead">{f.lead}</p>
        </div>
      </div>
      <div className="wrap finale-ctas">
        <a className="btn btn-gold" href={cta.href} {...(cta.external ? externalLinkProps : {})}>
          {cta.label}
        </a>
        <a className="btn btn-ivory" href="#programme">
          View Programme
        </a>
      </div>
      <div className="finale-mark">
        <picture>
          <source srcSet={crestWebp} type="image/webp" />
          <img src={crestPng} width={52} height={72} alt="Coat of arms of the Free Republic of Liberland" decoding="async" />
        </picture>
        <span className="motto">{f.motto}</span>
      </div>
    </section>
  );
}
