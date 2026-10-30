import { event, type Pillar } from '../data/event';
import { registrationCta } from '../lib/event-helpers';
import { Arrow } from './Arrow';
import { ChainArt, ColonnadeArt, MeritArt } from './Art';

const ART = { colonnade: ColonnadeArt, merit: MeritArt, chain: ChainArt };

function PillarCard({ p }: { p: Pillar }) {
  const Art = ART[p.art];
  const cta = registrationCta();
  return (
    <article className={`pillar pillar--${p.tone} reveal`}>
      <div className="pillar-frame">
        <div className="pillar-top">
          <span className="pillar-num" aria-hidden="true">
            {p.numeral}
          </span>
          <span className="label" style={{ color: 'rgba(248,242,232,.6)' }}>
            {p.tag}
          </span>
        </div>
        <div className="pillar-art" aria-hidden="true">
          <Art />
        </div>
        <h3>
          <small>Programme · {p.numeral}</small>
          {p.title}
        </h3>
        <p>{p.description}</p>
        <div className="pillar-foot">
          <span className="mono">{p.status}</span>
          <a className="more" href={cta.external ? '#register' : cta.href}>
            Follow this session <Arrow />
            <span className="sr-only">: {p.title}</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function Programme() {
  const pr = event.programme;
  return (
    <section className="pillars" id="programme" aria-labelledby="prog-title">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <span className="label">The programme</span>
            <h2 className="h2" id="prog-title">
              {pr.heading.line1}
              <br />
              <em>{pr.heading.line2}</em>
            </h2>
          </div>
          <p className="body">{pr.intro}</p>
        </div>
        <div className="pillar-grid">
          {pr.pillars.map((p) => (
            <PillarCard key={p.numeral} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
