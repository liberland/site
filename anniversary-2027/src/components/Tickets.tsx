import { formatPrice, ticketing, ticketsEnded, ticketsLive } from '../config/ticketing';
import { event } from '../data/anniversary';
import { dateRange, datesConfirmed, mailto } from '../lib/event';
import { useLumaCheckout } from '../lib/luma';
import { Arrow, NewTab, Pill } from './Tag';
import { TicketButton } from './TicketButton';

/** Join the Celebration — a compact ticket band. Prices and ticket types come only from src/config/ticketing.ts. */
export function Tickets() {
  const t = ticketing;
  const s = useLumaCheckout(ticketsLive && t.checkoutMode === 'embedded');
  const legal = [
    t.termsUrl && { href: t.termsUrl, label: 'Terms' },
    t.refundPolicyUrl && { href: t.refundPolicyUrl, label: 'Refunds' },
    t.privacyPolicyUrl && { href: t.privacyPolicyUrl, label: 'Privacy' },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <section id="tickets" className="tix-sec" aria-labelledby="tix-title">
      <div className="wrap">
        <div className="band rv">
          <div className="band-l">
            <h2 id="tix-title" className="h2">Join the Celebration</h2>
            <p className="band-sub">Celebrate twelve years of Liberland at {event.venue.name} on the Danube.</p>
            <p className="band-when">
              {dateRange} · {event.venue.city}, {event.venue.country}
              {!datesConfirmed && <Pill prov>Provisional dates</Pill>}
            </p>
          </div>

          <div className="band-r">
            {ticketsLive ? (
              <>
                {t.ticketTypes.length > 0 && (
                  <ul className="tix" aria-label="Ticket types">
                    {t.ticketTypes.map((tt) => (
                      <li key={tt.id} className="tix-row">
                        <div>
                          <h3 className="tix-name">{tt.name}</h3>
                          {(tt.includes.length > 0 || tt.conditions || tt.availability) && (
                            <p className="tix-inc">{[...tt.includes, tt.conditions, tt.availability].filter(Boolean).join(' · ')}</p>
                          )}
                        </div>
                        <p className="tix-price">{formatPrice(tt.price)}</p>
                        <TicketButton className="btn btn-line btn-sm" ticketTypeId={tt.id} label={`Select ${tt.name}`}>Select</TicketButton>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="band-cta">
                  <TicketButton className="btn btn-primary">Get tickets <Arrow /></TicketButton>
                  <a className="tlink" href={t.eventUrl!} target="_blank" rel="noopener">Open on Luma (Apple Pay) <Arrow c="↗" /><NewTab /></a>
                </div>
                {s === 'failed' && <p className="band-note" role="status">The embedded checkout could not load here, so the buttons open the event on Luma.</p>}
                <p className="band-note">
                  Sold by {t.sellerLegalName}. Payment is handled securely by Luma and Stripe; this website never sees your card
                  details.
                </p>
              </>
            ) : ticketsEnded ? (
              <>
                <p className="band-state">{t.status === 'soldOut' ? 'Sold out' : 'Ticket sales have closed'}</p>
                <div className="band-cta">
                  <a className="btn btn-line" href={t.eventUrl!} target="_blank" rel="noopener">{t.status === 'soldOut' ? 'Join the waitlist' : 'Event page'} <Arrow c="↗" /><NewTab /></a>
                </div>
              </>
            ) : (
              <>
                <p className="band-state">{t.soon.title}</p>
                <p className="band-text">{t.soon.text}</p>
                <div className="band-cta">
                  <a className="btn btn-line" href={mailto(`${event.name} ${event.year} — tickets`)}>Ask the organisers</a>
                </div>
              </>
            )}
            {legal.length > 0 && (
              <p className="band-legal">
                {legal.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}<NewTab /></a>)}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
