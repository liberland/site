import { useEffect, useRef, useState } from 'react';
import { event } from '../data/event';
import { registrationCta, externalLinkProps } from '../lib/event-helpers';
import crestPng from '../assets/liberland-escutcheon-128.png';
import crestWebp from '../assets/liberland-escutcheon-128.webp';

export const SECTIONS = [
  { id: 'celebration', label: 'The Celebration' },
  { id: 'programme', label: 'Programme' },
  { id: 'faces', label: 'Faces' },
  { id: 'venue', label: 'Le Palais' },
  { id: 'evening', label: 'The Evening' },
  { id: 'information', label: 'Information' },
] as const;

/** Scroll-spy: the section crossing the middle of the viewport is "current". */
function useCurrentSection() {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['top', ...SECTIONS.map((s) => s.id), 'invitation'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return current;
}

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);
  return scrolled;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const current = useCurrentSection();
  const scrolled = useScrolled();
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

  /** Close the menu first, then scroll — otherwise the collapsing menu shifts the target. */
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hash = e.currentTarget.getAttribute('href');
    if (!hash?.startsWith('#')) return setOpen(false);
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
    <header className={`nav${scrolled || open ? ' is-solid' : ''}${open ? ' is-open' : ''}`}>
      <div className="wrap nav-inner">
        <a className="brand" href="#top" aria-label={`${event.name} — back to top`}>
          <picture>
            <source srcSet={crestWebp} type="image/webp" />
            <img src={crestPng} width={24} height={33} alt="" />
          </picture>
          <span>
            <b>Liberland</b>
            <i>{event.shortName}</i>
          </span>
        </a>
        <nav className="nav-primary" aria-label="Sections">
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={current === s.id ? 'is-current' : undefined} aria-current={current === s.id ? 'location' : undefined}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-outline btn-sm nav-cta" href={cta.href} {...ext}>
          {cta.external ? cta.label : 'Registration'}
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
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
            {cta.label}
          </a>
        </nav>
      )}
    </header>
  );
}
