import { site } from './data/anniversary';
import { About } from './components/About';
import { Ark } from './components/Ark';
import { Celebration } from './components/Celebration';
import { Footer } from './components/Footer';
import { Gala } from './components/Gala';
import { Hero } from './components/Hero';
import { History } from './components/History';
import { Nav } from './components/Nav';
import { People } from './components/People';
import { Programme } from './components/Programme';
import { Register } from './components/Register';
import { StickyTickets } from './components/StickyTickets';
import { Tickets } from './components/Tickets';
import { Visit } from './components/Visit';

export function App() {
  return (
    <div className={site.motion ? 'lla' : 'lla still'}>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="top">
        <span id="main" tabIndex={-1} />
        <Hero />
        <About />
        <Tickets />
        <Celebration />
        <Programme />
        <People />
        <Ark />
        <Gala />
        <History />
        <Visit />
        <Register />
      </main>
      <Footer />
      <StickyTickets />
    </div>
  );
}
