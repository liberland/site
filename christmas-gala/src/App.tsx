import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Introduction } from './components/Introduction';
import { Programme } from './components/Programme';
import { Guests } from './components/Guests';
import { Venue } from './components/Venue';
import { Evening } from './components/Evening';
import { Practical } from './components/Practical';
import { Finale } from './components/Finale';
import { Footer } from './components/Footer';

export function App() {
  return (
    <div className="gala">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <Hero />
        <Introduction />
        <Programme />
        <Guests />
        <Venue />
        <Evening />
        <Practical />
        <Finale />
      </main>
      <Footer />
    </div>
  );
}
