import { event, gala, photos } from '../data/anniversary';
import { galaDay, galaWeekday } from '../lib/event';
import { Photo } from './Photo';

const RINGS = [490, 430, 370, 310, 250, 190, 130, 70];

/** G · The anniversary gala */
export function Gala() {
  const prov = gala.status === 'provisional' || event.dates.status !== 'confirmed';
  return (
    <section id="gala" className="sec s-gala on-dark" aria-labelledby="gala-title">
      <div className="rings" aria-hidden="true">
        <svg viewBox="0 0 1000 1000" focusable="false">
          {RINGS.map((r) => <circle key={r} cx="500" cy="500" r={r} />)}
          <circle cx="500" cy="10" r="6" />
        </svg>
      </div>
      <div className="wrap grid">
        <div className="gala-txt rv">
          <p className="kick lbl">{galaWeekday} evening{prov ? ' · provisional' : ''}</p>
          <h2 id="gala-title" className="d2">The anniversary gala</h2>
          <p className="body">
            When the conference closes, the anniversary turns ceremonial: formal dress, warm light, recognitions for the
            year’s contributions and a long evening among friends from many countries.
          </p>
          <p className="body">The format, setting and award categories for {event.year} will be announced by the organisers.</p>
          <dl className="gala-dl">
            <div><dt>Date</dt><dd>{galaDay} {prov && <span className="rec">Provisional</span>}</dd></div>
            {gala.details.map((d) => (
              <div key={d.term}><dt>{d.term}</dt><dd>{d.value} {d.note && <span className="rec">{d.note}</span>}</dd></div>
            ))}
          </dl>
        </div>
        <div className="gala-pics rv">
          <Photo photo={photos.galaLarge} className="dark" sizes="(max-width: 1100px) 100vw, 540px" />
          <Photo photo={photos.galaSmall} className="dark" sizes="(max-width: 640px) 70vw, 320px" />
        </div>
      </div>
    </section>
  );
}
