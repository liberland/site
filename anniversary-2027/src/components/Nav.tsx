import { useEffect, useRef, useState } from 'react';
import shield from '../assets/shield-64.webp';
import { event, registration } from '../data/anniversary';
import { galaWeekday } from '../lib/event';
import { range } from '../lib/dates';

const LINKS = [
  ['#experience', 'Celebration'],
  ['#programme', 'Programme'],
  ['#faces', 'People'],
  ['#ark', 'Ark Village'],
  ['#gala', 'Gala'],
  ['#visit', 'Visit'],
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const days = range(event.dates.start, event.dates.end, 'short').replace(/ \d{4}$/, ''); // 9–12 Apr
  const regLabel = registration.status === 'open' ? 'Open' : registration.status === 'closed' ? 'Closed' : 'Coming soon';
  const MOBILE: [string, string, string][] = [
    ['#about', 'Twelve years', '2015'],
    ['#experience', 'The celebration', ''],
    ['#programme', 'Programme', days],
    ['#faces', 'The people', ''],
    ['#ark', 'Ark Village', event.venue.city],
    ['#gala', 'The gala', galaWeekday],
    ['#story', 'History', `2015–${event.year}`],
    ['#visit', 'Practical information', ''],
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
          <img src={shield} width="26" height="36" alt="" />
          <span className="brand-t">Liberland</span>
          <span className="brand-xii" aria-hidden="true">{event.numeral}</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {LINKS.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <a className="btn btn-primary" href="#register">Registration</a>
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
            {label} {code && <span>{code}</span>}
          </a>
        ))}
      </nav>
    </header>
  );
}
