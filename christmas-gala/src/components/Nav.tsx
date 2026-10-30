import { useEffect, useRef, useState } from 'react';
import { event } from '../data/event';
import { registrationCta, externalLinkProps } from '../lib/event-helpers';
import { Arrow } from './Arrow';
import escutcheonPng from '../assets/liberland-escutcheon-52.png';
import escutcheonWebp from '../assets/liberland-escutcheon-52.webp';

export const SECTIONS = [
  { id: 'programme', label: 'Programme' },
  { id: 'guests', label: 'Guests' },
  { id: 'venue', label: 'Venue' },
  { id: 'evening', label: 'The evening' },
  { id: 'information', label: 'Information' },
] as const;

/** Scroll-spy: the section crossing the middle of the viewport is "current". */
function useCurrentSection() {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    const watched = ['top', 'introduction', ...SECTIONS.map((s) => s.id), 'finale'];
    watched.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return current;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const current = useCurrentSection();
  const btnRef = useRef<HTMLButtonElement>(null);
  const cta = registrationCta();
  const ext = cta.external ? externalLinkProps : {};

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  /** Close the menu first, then scroll — otherwise the collapsing menu shifts the target. */
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = e.currentTarget.getAttribute('href');
    if (!hash?.startsWith('#')) return close();
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
      history.pushState(null, '', hash);
    });
  };

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#top" aria-label={`${event.name} — back to top`}>
          <picture>
            <source srcSet={escutcheonWebp} type="image/webp" />
            <img src={escutcheonPng} width={26} height={36} alt="" />
          </picture>
          <div>
            <b>Liberland</b>
            <span>{event.shortName}</span>
          </div>
        </a>
        <nav className="nav-primary" aria-label="Sections">
          <ul className="nav-links">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={current === s.id ? 'is-current' : undefined}
                  aria-current={current === s.id ? 'location' : undefined}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-gold btn-sm nav-cta" href={cta.href} {...ext}>
          {cta.navLabel}
        </a>
        <button
          ref={btnRef}
          className="menu-btn"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 8h16M4 16h16" />
            </svg>
          )}
        </button>
      </div>
      {open && (
        <nav className="mobile-menu" id="mobile-menu" aria-label="Sections">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={go}>
              {s.label}
            </a>
          ))}
          <a className="btn btn-gold" href={cta.href} onClick={go} {...ext}>
            {cta.label} <Arrow />
          </a>
        </nav>
      )}
    </header>
  );
}
