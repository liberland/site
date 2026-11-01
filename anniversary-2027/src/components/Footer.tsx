import shield from '../assets/shield-64.webp';
import { event, people, photos, site } from '../data/anniversary';
import { dateRangeShort, foundingShort, mailto } from '../lib/event';
import { resolve } from '../lib/photo';

/** Credits for every photograph actually shown on the page. */
function credits() {
  const shown = [...Object.values(photos), ...people.map((p) => p.portrait)].filter((p) => p && resolve(p));
  return [...new Set(shown.map((p) => p!.credit))];
}

export function Footer() {
  const c = credits();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-g">
          <div className="foot-brand">
            <img src={shield} width="40" height="56" alt="" loading="lazy" />
            <div>
              <p>{site.organiser.name}</p>
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
            <small>Founded {foundingShort} · {event.number}th anniversary {dateRangeShort}</small>
            <p style={{ marginTop: 12 }}>
              Dates, programme, participants and services shown here are provisional and subject to confirmation by the organisers.
            </p>
            <p style={{ marginTop: 12 }}><a href={mailto()}>{event.contact.email}</a></p>
          </div>
        </div>
        <div className="foot-base">
          <span>{event.name} {event.year}</span>
          <span>{event.venue.name} · {event.venue.street} · {event.venue.postcode} {event.venue.city} · {event.venue.country}</span>
        </div>
        {c.length > 0 && <p className="credits">Photographs: {c.join(' · ')}.</p>}
      </div>
    </footer>
  );
}
