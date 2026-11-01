import shield from '../assets/shield-64.webp';
import { formatPrice, ticketing, ticketsEnded, ticketsLive } from '../config/ticketing';
import { event } from '../data/anniversary';
import { dateRange, datesConfirmed, mailto } from '../lib/event';
import { useLumaCheckout } from '../lib/luma';
import { Arrow, NewTab, Pill } from './Tag';
import { TicketButton } from './TicketButton';

/** C · Join the Celebration — the ticket invitation. Prices and ticket types come only from src/config/ticketing.ts. */
export function Tickets() {
  const t = ticketing;
  const s = useLumaCheckout(ticketsLive && t.checkoutMode === 'embedded');
  const legal = [
    t.termsUrl && { href: t.termsUrl, label: 'Terms & conditions' },
    t.refundPolicyUrl && { href: t.refundPolicyUrl, label: 'Refund & cancellation policy' },
    t.privacyPolicyUrl && { href: t.privacyPolicyUrl, label: 'Privacy policy' },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <section id="tickets" className="sec tix-sec" aria-labelledby="tix-title">
      <div className="wrap">
        <div className="invite rv">
          <img className="invite-mark" src={shield} width="34" height="47" alt="" />
          <p className="eyebrow">Tickets</p>
          <h2 id="tix-title" className="h2">Join the Celebration</h2>
          <p className="lead invite-sub">Celebrate twelve years of Liberland at {event.venue.name} on the Danube.</p>
          <p className="invite-when">
            <span>{dateRange}</span>
            <span aria-hidden="true">·</span>
            <span>{event.venue.city}, {event.venue.country}</span>
          </p>
          {!datesConfirmed && <p className="invite-prov"><Pill prov>Provisional dates</Pill></p>}

          {ticketsLive ? (
            <>
              {t.ticketTypes.length > 0 ? (
                <ul className="tix" aria-label="Ticket types">
                  {t.ticketTypes.map((tt) => (
                    <li key={tt.id} className={tt.featured ? 'tix-row feat' : 'tix-row'}>
                      <div className="tix-main">
                        <h3 className="tix-name">{tt.name}</h3>
                        {tt.includes.length > 0 && <ul className="tix-inc">{tt.includes.map((i) => <li key={i}>{i}</li>)}</ul>}
                        {tt.conditions && <p className="tix-cond">{tt.conditions}</p>}
                      </div>
                      <div className="tix-buy">
                        <p className="tix-price">{formatPrice(tt.price)}</p>
                        {tt.availability && <p className="tix-avail">{tt.availability}</p>}
                        <TicketButton className={tt.featured ? 'btn btn-primary' : 'btn btn-line'} ticketTypeId={tt.id} label={`Select ${tt.name}`}>Select</TicketButton>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="invite-text">Choose your ticket in the secure checkout — current categories and prices are shown there.</p>
              )}
              <div className="invite-cta">
                <TicketButton className="btn btn-primary btn-lg">Get tickets <Arrow /></TicketButton>
              </div>
              {s === 'failed' && (
                <p className="invite-note" role="status">The embedded checkout could not load in this browser, so the buttons open the event on Luma instead.</p>
              )}
              <p className="invite-note">
                Prefer Apple Pay, or a full page?{' '}
                <a href={t.eventUrl!} target="_blank" rel="noopener">Open the checkout on Luma <Arrow c="↗" /><NewTab /></a>
              </p>
              <p className="invite-legal">
                Tickets are sold by {t.sellerLegalName}. Checkout and payment are handled securely by Luma and Stripe — this
                website never sees your card details. Your confirmation and ticket are sent by Luma by e-mail.
              </p>
            </>
          ) : ticketsEnded ? (
            <>
              <p className="invite-state">{t.status === 'soldOut' ? 'Sold out' : 'Ticket sales have closed'}</p>
              <p className="invite-text">{t.status === 'soldOut' ? 'You can join the waitlist on the event page.' : 'Questions go to the organisers.'}</p>
              <div className="invite-cta">
                <a className="btn btn-line" href={t.eventUrl!} target="_blank" rel="noopener">Event page on Luma <Arrow c="↗" /><NewTab /></a>
              </div>
            </>
          ) : (
            <>
              <p className="invite-state">{t.soon.title}</p>
              <p className="invite-text">{t.soon.text}</p>
              <div className="invite-cta">
                <a className="btn btn-line" href={mailto(`${event.name} ${event.year} — tickets`)}>Ask the organisers</a>
                <a className="tlink" href="#programme">See the programme</a>
              </div>
            </>
          )}

          <p className="invite-foot">
            {legal.map((l) => (
              <span key={l.href}><a href={l.href} target="_blank" rel="noopener">{l.label}<NewTab /></a></span>
            ))}
            <span>Questions: <a href={mailto()}>{t.contactEmail}</a></span>
          </p>
        </div>
      </div>
    </section>
  );
}
