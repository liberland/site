import shield from '../assets/shield-160.webp';
import { photos, site } from '../data/anniversary';
import { dateRange, datesConfirmed, foundingLong } from '../lib/event';
import { event } from '../data/anniversary';
import { Figure } from './Photo';
import { Seal } from './Seal';
import { Arrow } from './Tag';

/** A · Photographic hero — a compact 43/57 editorial composition. */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-text">
          <div className="hero-mark">
            <img src={shield} width="38" height="53" alt="" />
            <span>{site.organiser.name} · since {foundingLong}</span>
          </div>
          <h1 id="hero-title">
            <span className="h1-a">Liberland</span>
            <span className="h1-b">{event.number}th Anniversary</span>
          </h1>
          <p className="hero-tag">Twelve Years of Freedom, Community &amp; the Future</p>
          <dl className="hero-facts">
            <div><dt>Dates</dt><dd>{dateRange}</dd></div>
            <div><dt>Venue</dt><dd>{event.venue.name} · {event.venue.city}, {event.venue.country}</dd></div>
          </dl>
          {!datesConfirmed && <p className="hero-note">Provisional dates — subject to confirmation</p>}
          <div className="hero-cta">
            <a className="btn btn-primary" href="#experience">Explore the celebration <Arrow /></a>
            <a className="tlink" href="#programme">See the programme</a>
          </div>
        </div>
        <Figure photo={photos.heroGroup} className="hero-fig" sizes="(max-width: 1100px) 100vw, 700px" eager>
          <Seal />
        </Figure>
      </div>
    </section>
  );
}
