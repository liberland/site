import type { ReactNode } from 'react';
import { ticketing, ticketsLive } from '../config/ticketing';
import { useLumaCheckout } from '../lib/luma';
import { NewTab } from './Tag';

type Props = { className?: string; ticketTypeId?: string; children: ReactNode; label?: string };

/**
 * Every ticket call-to-action on the page. All of them lead to the same place:
 *  - live + embedded → Luma's official checkout overlay (falls back to the Luma event page if the script is blocked)
 *  - live + external → the Luma event page in a new tab
 *  - not live        → the ticket section (#tickets), which explains the status
 */
export function TicketButton({ className = 'btn btn-primary', ticketTypeId, children, label }: Props) {
  const embedded = ticketsLive && ticketing.checkoutMode === 'embedded';
  const s = useLumaCheckout(embedded);
  if (!ticketsLive) return <a className={className} href="#tickets" aria-label={label}>{children}</a>;
  if (!embedded || s === 'failed')
    return <a className={className} href={ticketing.eventUrl!} target="_blank" rel="noopener" aria-label={label}>{children}<NewTab /></a>;
  return (
    <a
      className={className}
      href={ticketing.eventUrl!}
      aria-label={label}
      aria-haspopup="dialog"
      data-luma-action="checkout"
      data-luma-event-id={ticketing.eventId!}
      data-luma-utm-source="anniversary-site"
      {...(ticketTypeId ? { 'data-luma-ticket-type': ticketTypeId } : {})}
    >
      {children}
    </a>
  );
}
