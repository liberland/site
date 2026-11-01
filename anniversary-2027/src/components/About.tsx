import flag from '../assets/flag-108.webp';
import { event, photos } from '../data/anniversary';
import { foundingLong } from '../lib/event';
import { Photo } from './Photo';

/** B · Twelve years of Liberland */
export function About() {
  return (
    <section id="about" className="sec s-about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="grid">
          <div className="about-txt rv">
            <p className="kick lbl">Twelve years of Liberland</p>
            <p className="date-big">{foundingLong}</p>
            <h2 id="about-title" className="d2">Proclaimed on the banks of the Danube.</h2>
            <p className="lead" style={{ marginTop: 28 }}>
              On {foundingLong}, Liberland was proclaimed on the banks of the Danube. Twelve years later, its community
              continues to bring together people interested in individual liberty, innovation, voluntary cooperation and
              new approaches to governance.
            </p>
            <p className="body" style={{ marginTop: 20 }}>
              For the annual anniversary celebration, Liberlanders and friends gather at {event.venue.name} to commemorate
              the project’s founding, reconnect, exchange ideas and celebrate together.
            </p>
          </div>
          <div className="about-pics rv">
            <Photo photo={photos.aboutLarge} className="big warm" sizes="(max-width: 640px) 100vw, (max-width: 1100px) 86vw, 560px" />
            <Photo photo={photos.aboutSmall} className="small" kind="Archive" sizes="(max-width: 640px) 72vw, 300px" />
          </div>
        </div>
        <div className="facts rv">
          <div><span className="rec">Proclaimed</span><p className="v">{foundingLong}</p></div>
          <div><span className="rec">Place of proclamation</span><p className="v">{event.founding.place}</p></div>
          <div><span className="rec">Anniversary</span><p className="v">№ {event.number}</p></div>
          <div>
            <span className="rec">Motto</span><p className="v">{event.motto}</p>
            <img className="flag" src={flag} width="54" height="36" alt="Flag of Liberland" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
