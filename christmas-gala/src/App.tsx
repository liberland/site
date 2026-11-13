import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Celebration } from './components/Celebration';
import { LastChristmas } from './components/LastChristmas';
import { Programme } from './components/Programme';
import { Faces } from './components/Faces';
import { Venue } from './components/Venue';
import { Evening } from './components/Evening';
import { Practical } from './components/Practical';
import { Finale } from './components/Finale';
import { Footer } from './components/Footer';
import { Snowfall } from './components/Snowfall';
import { event } from './data/event';
import { t } from './i18n/ui';

/** Fade-and-rise reveals as sections enter the viewport (content is visible without JS). */
function useReveals() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

export function App() {
  useReveals();
  return (
    <div className="gala">
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Celebration />
        <LastChristmas />
        <Programme />
        <Faces />
        <Venue />
        <Evening />
        <Practical />
        <Finale />
      </main>
      <Footer />
      {event.atmosphere.snow && <Snowfall />}
    </div>
  );
}
