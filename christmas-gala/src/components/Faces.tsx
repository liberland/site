import { event, type Person } from '../data/event';
import { Title } from './Title';
import { t } from '../i18n/ui';
import { withBase } from '../lib/assets';
import { Flourish } from './Ornaments';
import bow from '../assets/ornaments/bauble-gold.webp';

const STATUS: Record<Person['attendance'], string | null> = { featured: null, ...t.faces.status };

function Medallion({ p }: { p: Person }) {
  return (
    <div className="medallion">
      <img className="medallion-bauble" src={bow} alt="" aria-hidden="true" width={34} height={38} loading="lazy" />
      <div className="medallion-ring">
        {p.portrait ? (
          <img src={withBase(p.portrait)} alt={t.faces.portrait(p.name)} width={280} height={280} loading="lazy" decoding="async" />
        ) : (
          <span className="medallion-mono" role="img" aria-label={t.faces.portraitToFollow(p.name)}>
            {p.initials}
          </span>
        )}
      </div>
    </div>
  );
}

/** A confirmed speaker: portrait, name, role and the talk. */
function Speaker({ p, i }: { p: Person; i: number }) {
  return (
    <li className="speaker reveal" style={{ transitionDelay: `${i * 90}ms` }}>
      <Medallion p={p} />
      <div className="speaker-body">
        <p className="speaker-tag">{p.talk?.keynote ? t.faces.keynote : t.faces.speaker}</p>
        <h3>{p.name}</h3>
        <p className="face-role">{p.role}</p>
        {p.talk ? (
          <>
            <p className="speaker-talk">{p.talk.keynote ? `“${p.talk.title}”` : p.talk.title}</p>
            <p className="speaker-text">{p.talk.text}</p>
          </>
        ) : (
          <p className="speaker-talk speaker-talk--tba">{t.faces.topicTba}</p>
        )}
      </div>
    </li>
  );
}

function Face({ p, i }: { p: Person; i: number }) {
  const status = p.attendance === 'programme' && p.note ? p.note : STATUS[p.attendance];
  return (
    <li className="face reveal" style={{ transitionDelay: `${i * 90}ms` }}>
      <Medallion p={p} />
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
          <p className="eyebrow eyebrow--ink">{t.faces.eyebrow}</p>
          <h2 id="faces-title" className="display">
            <Title parts={t.faces.title} />
          </h2>
          <Flourish className="flourish--ink" />
          <p className="sec-note">{f.intro}</p>
        </header>
        <ul className="speaker-grid">
          {f.speakers.map((p, i) => (
            <Speaker key={p.name} p={p} i={i} />
          ))}
        </ul>
        {f.people.length > 0 && (
          <>
            <h3 className="themes-title faces-others reveal">
              <span>{t.faces.others}</span>
            </h3>
            <ul className="face-grid">
              {f.people.map((p, i) => (
                <Face key={p.name} p={p} i={i} />
              ))}
            </ul>
            <p className="faces-note reveal">{f.note}</p>
          </>
        )}
      </div>
    </section>
  );
}
