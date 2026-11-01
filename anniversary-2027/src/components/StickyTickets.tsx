import { useEffect, useState } from 'react';
import { ticketsLive } from '../config/ticketing';
import { dateRangeShort, datesConfirmed } from '../lib/event';
import { TicketButton } from './TicketButton';

/**
 * Compact bottom bar on phones and tablets — only while tickets are actually on sale. It appears after the hero
 * and hides whenever the ticket section, the final invitation or the footer is on screen, so it never covers them.
 */
export function StickyTickets() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!ticketsLive) return;
    const watch = ['.hero', '#tickets', '#register', '.foot'].map((s) => document.querySelector(s)).filter(Boolean) as Element[];
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target));
      setShow(visible.size === 0);
    });
    watch.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('has-sticky', show);
  }, [show]);
  if (!ticketsLive) return null;
  return (
    <div className={show ? 'sticky-tix on' : 'sticky-tix'} aria-hidden={!show} {...(!show ? { inert: '' } : {})}>
      <p><strong>Liberland XII</strong><span>{dateRangeShort}{datesConfirmed ? '' : ' · provisional'}</span></p>
      <TicketButton className="btn btn-gold">Get tickets</TicketButton>
    </div>
  );
}
