import { event, type Person } from '../data/event';
import { withBase } from '../lib/assets';
import { Flourish } from './Ornaments';
import bow from '../assets/ornaments/bauble-gold.webp';

const STATUS: Record<Person['attendance'], string | null> = {
  featured: null,
  programme: 'In the planned programme',
  anticipated: 'Anticipated guest — participation to be confirmed',
  confirmed: 'Confirmed',
};

function Face({ p, i }: { p: Person; i: number }) {
  const status = p.attendance === 'programme' && p.note ? p.note : STATUS[p.attendance];
  return (
    <li className="face reveal" style={{ transitionDelay: `${i * 90}ms` }}>
      <div className="medallion">
        <img className="medallion-bauble" src={bow} alt="" aria-hidden="true" width={34} height={38} loading="lazy" />
        <div className="medallion-ring">
          {p.portrait ? (
            <img src={withBase(p.portrait)} alt={`Portrait of ${p.name}`} width={280} height={280} loading="lazy" decoding="async" />
          ) : (
            <span className="medallion-mono" role="img" aria-label={`Portrait of ${p.name} to follow`}>
              {p.initials}
            </span>
          )}
        </div>
      </div>
      <h3>{p.name}</h3>
      <p className="face-role">{p.role}</p>
      {status && <p className={`face-status face-status--${p.attendance}`}>{status}</p>}
      {p.note && p.attendance !== 'programme' && <p className="face-note">{p.note}</p>}
    </li>
  );
}

export function Faces() {
  const f = event.faces;
  return (
    <section className="faces" id="faces" aria-labelledby="faces-title">
      <div className="wrap">
        <header className="sec-head sec-head--center reveal">
          <p className="eyebrow eyebrow--ink">The Faces of the Evening</p>
          <h2 id="faces-title" className="display">
            Liberland <em>personalities</em>
          </h2>
          <Flourish className="flourish--ink" />
          <p className="sec-note">{f.intro}</p>
        </header>
        <ul className="face-grid">
          {f.people.map((p, i) => (
            <Face key={p.name} p={p} i={i} />
          ))}
        </ul>
        <p className="faces-note reveal">{f.note}</p>
      </div>
    </section>
  );
}
