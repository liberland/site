import { useEffect, useRef, useState } from 'react';
import escutcheon from '../assets/escutcheon-128.webp';
import { event, registration } from '../data/anniversary';
import { galaWeekday } from '../lib/event';
import { range } from '../lib/dates';

const LINKS = [
  ['#about', 'Twelve years'],
  ['#programme', 'Programme'],
  ['#faces', 'Faces'],
  ['#ark', 'Ark Village'],
  ['#gala', 'Gala'],
  ['#visit', 'Visit'],
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const days = range(event.dates.start, event.dates.end, 'short').replace(/ \d{4}$/, '').toUpperCase(); // 9–12 APR
  const regLabel = registration.status === 'open' ? 'OPEN' : registration.status === 'closed' ? 'CLOSED' : 'SOON';
  const MOBILE: [string, string, string][] = [
    ['#about', 'Twelve years', 'B'],
    ['#experience', 'The experience', 'C'],
    ['#programme', 'Programme', days],
    ['#faces', 'Featured faces', 'E'],
    ['#ark', 'Ark Village', event.venue.city.toUpperCase()],
    ['#gala', 'The gala', galaWeekday.slice(0, 3).toUpperCase()],
    ['#story', 'The story so far', `2015–${event.year}`],
    ['#visit', 'Plan your visit', 'I'],
    ['#register', 'Registration', regLabel],
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); }
    };
    // Close if the layout grows past the tablet breakpoint while open.
    const mq = window.matchMedia('(min-width: 1101px)');
    const onMq = () => mq.matches && setOpen(false);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => { document.removeEventListener('keydown', onKey); mq.removeEventListener('change', onMq); };
  }, [open]);

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a className="brand" href="#top" aria-label={`${event.name}, back to top`}>
          <img src={escutcheon} width="24" height="33" alt="" />
          <span className="lbl">Liberland</span>
          <span className="brand-xii" aria-hidden="true">{event.numeral}</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a className="btn btn-y" href="#register">Registration</a>
        <button
          ref={btn}
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="mnav"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      <nav id="mnav" className={open ? 'mnav open' : 'mnav'} aria-label="Sections, mobile">
        {MOBILE.map(([href, label, code]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label} <span>{code}</span>
          </a>
        ))}
      </nav>
    </header>
  );
}
