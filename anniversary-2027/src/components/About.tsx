import flag from '../assets/flag-120.webp';
import { event, photos } from '../data/anniversary';
import { foundingLong } from '../lib/event';
import { Figure } from './Photo';

/** B · Twelve years of Liberland */
export function About() {
  return (
    <section id="about" className="sec" aria-labelledby="about-title">
      <div className="wrap about-grid">
        <Figure photo={photos.presidentGuests} className="rv" sizes="(max-width: 1100px) 100vw, 640px" />
        <div className="about-txt rv">
          <h2 id="about-title" className="h2">Twelve years of Liberland</h2>
          <p className="about-date">Proclaimed {foundingLong}, on the banks of the Danube</p>
          <p className="lead">
            On {foundingLong}, Liberland was proclaimed on the banks of the Danube. Twelve years later, its community
            continues to bring together people interested in individual liberty, innovation, voluntary cooperation and new
            approaches to governance.
          </p>
          <p className="body">
            For the annual anniversary celebration, Liberlanders and friends gather at {event.venue.name} to commemorate the
            project’s founding, reconnect, exchange ideas and celebrate together.
          </p>
          <dl className="facts">
            <div><dt>Proclaimed</dt><dd>{foundingLong}</dd></div>
            <div><dt>Place</dt><dd>{event.founding.place}</dd></div>
            <div><dt>Motto</dt><dd><img src={flag} width="30" height="20" alt="Flag of Liberland" loading="lazy" />{event.motto}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
