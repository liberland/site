import { site } from './data/anniversary';
import { About } from './components/About';
import { Ark } from './components/Ark';
import { Experience } from './components/Experience';
import { Faces } from './components/Faces';
import { Final } from './components/Final';
import { Footer } from './components/Footer';
import { Gala } from './components/Gala';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { Programme } from './components/Programme';
import { Registration } from './components/Registration';
import { Story } from './components/Story';
import { Visit } from './components/Visit';

export function App() {
  const cls = ['lla', site.showAssetLabels ? '' : 'nolabel', site.motion ? '' : 'still'].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="top">
        <span id="main" tabIndex={-1} />
        <Hero />
        <About />
        <Experience />
        <Programme />
        <Faces />
        <Ark />
        <Gala />
        <Story />
        <Visit />
        <Registration />
        <Final />
      </main>
      <Footer />
    </div>
  );
}
