import escutcheon from '../assets/escutcheon-128.webp';
import { event } from '../data/anniversary';
import { dateRange, datesConfirmed, mailto } from '../lib/event';
import { Arrow } from './Tag';

/** K · Final invitation */
export function Final() {
  return (
    <section className="s-final" aria-labelledby="final-title">
      <div className="wrap rv">
        <img src={escutcheon} width="56" height="78" alt="Escutcheon of the Free Republic of Liberland" loading="lazy" />
        <h2 id="final-title" className="d1">Twelve years. One community. A future to build.</h2>
        <p className="lead">Join the annual celebration of Liberland at {event.venue.name} on the Danube.</p>
        <p className="rec">{dateRange}{datesConfirmed ? '' : ' · Provisional dates'} · {event.venue.city}, {event.venue.country}</p>
        <div className="ctas">
          <a className="btn btn-v" href="#programme">See the programme <Arrow /></a>
          <a className="btn btn-ov" href={mailto()}>{event.contact.email}</a>
        </div>
      </div>
    </section>
  );
}
