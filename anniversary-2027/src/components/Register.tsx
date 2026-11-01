import { ticketing, ticketsLive } from '../config/ticketing';
import { event, photos } from '../data/anniversary';
import { dateRange, datesConfirmed, mailto } from '../lib/event';
import { Img } from './Photo';
import { Arrow } from './Tag';
import { TicketButton } from './TicketButton';

/** J · Final invitation — the second ticket call-to-action. */
export function Register() {
  return (
    <section id="register" className="sec reg" aria-labelledby="reg-title">
      <div className="reg-grid">
        <figure className="reg-ph">
          <Img photo={photos.flagBeach} sizes="(max-width: 1100px) 100vw, 50vw" />
          {photos.flagBeach.caption && <figcaption>{photos.flagBeach.caption}</figcaption>}
        </figure>
        <div className="reg-txt rv">
          <p className="eyebrow">{event.number}th anniversary</p>
          <h2 id="reg-title" className="h2">Twelve years. One community. A future to build.</h2>
          <p className="lead">
            Join the annual celebration of Liberland at {event.venue.name} on the Danube — citizens, supporters and
            interested visitors are welcome.
          </p>
          <p className="reg-when">{dateRange}{datesConfirmed ? '' : ' · provisional dates'} · {event.venue.name}, {event.venue.city}, {event.venue.country}</p>
          <div className="reg-btns">
            {ticketsLive ? (
              <TicketButton className="btn btn-gold btn-lg">Get tickets <Arrow /></TicketButton>
            ) : (
              <a className="btn btn-gold btn-lg" href="#tickets">{ticketing.soon.title} <Arrow /></a>
            )}
            <a className="btn btn-ghost" href={mailto(`${event.name} ${event.year}`)}>Write to the organisers</a>
          </div>
        </div>
      </div>
    </section>
  );
}
