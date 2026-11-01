import { event, gala, photos } from '../data/anniversary';
import { galaDay, galaWeekday } from '../lib/event';
import { Figure } from './Photo';

/** G · The anniversary gala — an evening section with photographs of the 2026 ceremony. */
export function Gala() {
  const prov = gala.status === 'provisional' || event.dates.status !== 'confirmed';
  return (
    <section id="gala" className="sec gala" aria-labelledby="gala-title">
      <div className="wrap gala-grid">
        <div className="rv">
          <p className="eyebrow">{galaWeekday} evening{prov ? ' · provisional' : ''}</p>
          <h2 id="gala-title" className="h2">The anniversary gala</h2>
          <p className="body">
            When the conference closes, the anniversary turns ceremonial: formal dress, warm light, recognitions for the
            year’s contributions and a long evening among friends from many countries.
          </p>
          <p className="body">
            The 11th anniversary in 2026 included the presentation of Liberland’s Order of Merit. The format, setting and award categories for{' '}
            {event.year} will be announced by the organisers.
          </p>
          <dl className="gala-dl">
            <div><dt>Date</dt><dd>{galaDay}{prov && <small>Provisional</small>}</dd></div>
            {gala.details.map((d) => (
              <div key={d.term}><dt>{d.term}</dt><dd>{d.value}{d.note && <small>{d.note}</small>}</dd></div>
            ))}
          </dl>
        </div>
        <div className="gala-pics rv">
          <Figure photo={photos.awards} className="p1" sizes="(max-width: 1100px) 50vw, 360px" />
          <Figure photo={photos.federico} className="p2" sizes="(max-width: 1100px) 50vw, 360px" />
          <Figure photo={photos.formal} className="p3" sizes="(max-width: 1100px) 50vw, 360px" />
        </div>
      </div>
    </section>
  );
}
