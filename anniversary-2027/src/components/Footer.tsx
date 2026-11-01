import escutcheon from '../assets/escutcheon-128.webp';
import { event, people, photos, site } from '../data/anniversary';
import { dateRangeShort, foundingShort, mailto } from '../lib/event';
import { resolve } from '../lib/photo';

/** Credits for every photograph actually shown on the page. */
function credits() {
  const shown = [...Object.values(photos), ...people.map((p) => p.portrait)].filter((p) => resolve(p));
  return [...new Set(shown.map((p) => p.credit))];
}

export function Footer() {
  const c = credits();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-g">
          <div className="foot-brand">
            <img src={escutcheon} width="40" height="56" alt="" loading="lazy" />
            <div>
              <p className="lbl" style={{ color: 'var(--chalk)' }}>{site.organiser.name}</p>
              <p className="motto">{event.motto}</p>
            </div>
          </div>
          <nav aria-label="Footer">
            <ul>
              <li><a href="#programme">Programme</a></li>
              <li><a href="#ark">{event.venue.name}</a></li>
              <li><a href="#visit">Plan your visit</a></li>
              <li><a href="#register">Registration</a></li>
              <li><a href={site.organiser.url} target="_blank" rel="noopener">liberland.org<span className="vh"> (opens in a new tab)</span></a></li>
            </ul>
          </nav>
          <div>
            <p className="rec">Founded {foundingShort}</p>
            <p className="rec" style={{ marginTop: 4 }}>{event.number}th anniversary · {dateRangeShort}</p>
            <p style={{ marginTop: 16, color: '#B8B6AE', fontSize: 14.5 }}>
              Dates, programme, participants and services shown here are provisional and subject to confirmation by the organisers.
            </p>
            <p style={{ marginTop: 12 }}><a href={mailto()}>{event.contact.email}</a></p>
          </div>
        </div>
        <div className="foot-base">
          <span>{event.name} {event.year}</span>
          <span className="rec">{event.venue.name} · {event.venue.street} · {event.venue.postcode} {event.venue.city} · {event.venue.country}</span>
        </div>
        {c.length > 0 && (
          <p className="credits">
            Photographs: {c.join(' · ')}.{' '}
            {c.some((x) => x.includes('CC BY-SA')) && (
              <>Licence: <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noopener license">CC BY-SA 3.0</a>.</>
            )}
          </p>
        )}
      </div>
    </footer>
  );
}
