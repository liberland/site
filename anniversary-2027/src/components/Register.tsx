import { event, photos, registration, tiers } from '../data/anniversary';
import { dateRange, datesConfirmed, mailto, registrationOpen } from '../lib/event';
import { Img } from './Photo';
import { Arrow, NewTab, Pill } from './Tag';

/** J · Registration and final invitation. No form, no checkout: an authorised external link only, when configured. */
export function Register() {
  const r = registration;
  const closed = r.status === 'closed';
  const subject = `${event.name} ${event.year}`;
  return (
    <section id="register" className="sec reg" aria-labelledby="reg-title">
      <div className="reg-grid">
        <figure className="reg-ph">
          <Img photo={photos.flagBeach} sizes="(max-width: 1100px) 100vw, 50vw" />
          {photos.flagBeach.caption && <figcaption>{photos.flagBeach.caption}</figcaption>}
        </figure>
        <div className="reg-txt rv">
          <p className="eyebrow">Registration</p>
          <h2 id="reg-title" className="h2">Twelve years. One community. A future to build.</h2>
          <p className="lead">{r.intro}</p>
          <div className="reg-state">
            {registrationOpen ? <Pill ok>Open</Pill> : <Pill prov>{closed ? 'Closed' : 'Not yet open'}</Pill>}
            <p className="reg-msg">{registrationOpen ? 'Registration is open.' : closed ? r.closedMessage : r.message}</p>
            <p>
              {registrationOpen
                ? `Registration is handled on an external booking page${r.provider ? ` (${r.provider})` : ''}. Questions go to the organisers.`
                : r.detail}
            </p>
            <div className="reg-btns">
              {registrationOpen ? (
                <>
                  <a className="btn btn-gold" href={r.url!} target="_blank" rel="noopener">Register <Arrow c="↗" /><NewTab /></a>
                  <a className="btn btn-ghost" href={mailto(subject)}>Write to the organisers</a>
                </>
              ) : (
                <>
                  <a className="btn btn-gold" href={mailto(subject)}>Write to the organisers</a>
                  <span>
                    <button className="btn" type="button" disabled aria-describedby="reg-why">Register</button>
                    <span className="why" id="reg-why">{closed ? 'Closed' : 'Not yet open'}</span>
                  </span>
                </>
              )}
            </div>
          </div>
          <ul className="tiers" aria-label={registrationOpen ? 'Participation categories' : 'Participation categories in preparation'}>
            {tiers.map((t) => {
              const url = t.status === 'open' ? t.url ?? r.url : null;
              return (
                <li key={t.name}>
                  <div>{t.name}<span className="t-desc">{t.description}</span></div>
                  <span>
                    {t.status === 'soldout' ? 'Sold out' : t.price ?? t.priceNote}
                    {url && registrationOpen && <> · <a href={url} target="_blank" rel="noopener">Register<NewTab /></a></>}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="reg-when">{dateRange}{datesConfirmed ? '' : ' · provisional dates'} · {event.venue.name}, {event.venue.city}, {event.venue.country}</p>
        </div>
      </div>
    </section>
  );
}
