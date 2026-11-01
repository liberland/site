import { event, photos } from '../data/anniversary';
import { Figure } from './Photo';

const TOPICS = ['Governance', 'Constitutional development', 'Technology & the blockchain', 'Entrepreneurship', 'The years ahead'];

/** C · The celebration — three editorial features. The ceremonial thread continues in the gala section. */
export function Celebration() {
  return (
    <section id="experience" className="sec sec-paper" aria-labelledby="xp-title">
      <div className="wrap">
        <div className="sec-head rv">
          <h2 id="xp-title" className="h2">Ceremony, ideas, people and the river</h2>
          <p className="lead">
            Four days at {event.venue.name}: a formal commemoration and <a href="#gala">anniversary gala</a>, serious
            conversation, old and new friendships, and the landscape of the Danube in spring.
          </p>
        </div>

        <article className="feature rv">
          <Figure photo={photos.conference} sizes="(max-width: 1100px) 100vw, 720px" />
          <div>
            <h3 className="h3">Ideas &amp; conversation</h3>
            <p className="body">
              Talks and discussions about technology, governance, constitutional development, entrepreneurship and the
              future, held in the timber halls of {event.venue.name}.
            </p>
            <ul className="topics" aria-label="Topics">
              {TOPICS.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>
        </article>

        <article className="feature rev rv">
          <Figure photo={photos.dinner} sizes="(max-width: 1100px) 100vw, 720px" />
          <div>
            <h3 className="h3">Friends, old and new</h3>
            <p className="body">
              Meet Liberland community members, founders, representatives and international guests, over long dinners and
              late evenings in the main building.
            </p>
            <p className="quote">Citizens, supporters and the genuinely curious, from many countries, in one place.</p>
          </div>
        </article>

        <article className="cine rv">
          <Figure photo={photos.danube} sizes="(max-width: 1240px) 100vw, 1240px" />
          <div className="cine-card">
            <h3 className="h3">The Danube</h3>
            <p className="body">
              {event.venue.name}, riverside activities, excursions and the natural landscape of the river. Specific
              excursions for {event.year} are to be confirmed.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
