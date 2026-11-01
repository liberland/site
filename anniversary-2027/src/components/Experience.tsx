import { event, photos } from '../data/anniversary';
import { Photo } from './Photo';

const TOPICS = ['Governance', 'Constitutional development', 'Technology & the blockchain', 'Entrepreneurship', 'The years ahead'];

/** C · The anniversary experience */
export function Experience() {
  return (
    <section id="experience" className="sec s-xp" aria-labelledby="xp-title">
      <div className="wrap grid">
        <div className="xp-head rv">
          <p className="kick lbl">The anniversary experience</p>
          <h2 id="xp-title" className="d2">Ceremony, ideas, people and the river.</h2>
        </div>
        <p className="xp-head-r lead rv">
          Four threads run through four days at {event.venue.name}: a formal commemoration, serious conversation, old and
          new friendships, and the landscape of the Danube in spring.
        </p>

        <article className="xp xp-1 rv">
          <Photo photo={photos.celebration} className="warm" sizes="(max-width: 1100px) 100vw, 760px" />
          <div className="shade" />
          <div className="xp-cap">
            <span className="xp-n">01</span>
            <h3>The celebration</h3>
            <p>Ceremonial gatherings, anniversary recognitions, community milestones and the evening gala.</p>
          </div>
        </article>

        <article className="xp xp-2 rv">
          <span className="xp-n">02</span>
          <h3>Ideas &amp; innovation</h3>
          <p>Conversations about technology, governance, constitutional development, entrepreneurship and the future.</p>
          <ul className="topics">
            {TOPICS.map((t) => <li key={t}>{t} <span className="rec">Topic</span></li>)}
          </ul>
        </article>

        <article className="xp xp-3 rv">
          <span className="xp-n">03</span>
          <h3>The people</h3>
          <p>Meet Liberland community members, founders, representatives and international guests.</p>
          <p className="big">Citizens, supporters and the genuinely curious, from many countries, in one place.</p>
        </article>

        <article className="xp xp-4 rv">
          <Photo photo={photos.danube} className="river" sizes="(max-width: 640px) 100vw, (max-width: 1100px) 60vw, 870px" />
          <div className="shade" />
          <div className="xp-cap">
            <span className="xp-n">04</span>
            <h3>The Danube experience</h3>
            <p>{event.venue.name}, riverside activities, excursions and the natural landscape. Specific excursions for {event.year} are to be confirmed.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
