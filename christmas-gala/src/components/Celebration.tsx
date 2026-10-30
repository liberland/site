import { event } from '../data/event';
import { dateLong, resolvePhoto } from '../lib/event-helpers';
import { Photo } from './Photo';
import { CornerSpray, Flourish, Garland, Star } from './Ornaments';
import crestPng from '../assets/liberland-escutcheon-128.png';

export function Celebration() {
  const v = event.venue;
  return (
    <section className="celebration" id="celebration" aria-labelledby="celebration-title">
      <Garland kind="rope" className="seam seam--top" twinkle={false} />
      <div className="wrap celebration-grid">
        <div className="celebration-copy reveal">
          <p className="eyebrow eyebrow--ink">The Celebration</p>
          <h2 id="celebration-title" className="display">
            Christmas at
            <br />
            <em>Le Palais</em>
          </h2>
          <p className="lede">an extraordinary evening with the Liberland community.</p>
          <Flourish className="flourish--ink" />
          <div className="prose">
            {event.editorial.celebration.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <figure className="arch reveal">
          <div className="arch-frame">
            <Photo
              photo={v.portalPhoto}
              sizes="(max-width: 760px) 90vw, 460px"
              className="arch-photo"
              fallback={
                <div className="arch-fallback">
                  <img src={crestPng} width={64} height={89} alt="" />
                  <span>Le Palais</span>
                  <small>U Zvonařky 1 · Prague</small>
                </div>
              }
            />
          </div>
          <CornerSpray side="right" className="arch-spray" />
          <figcaption>{resolvePhoto(v.portalPhoto) ? v.portalPhoto.caption : `${v.name} · ${v.street}, ${v.district}`}</figcaption>
        </figure>
      </div>
      <div className="wrap">
        <dl className="invite-card reveal">
          <div>
            <dt>When</dt>
            <dd>{dateLong()}</dd>
          </div>
          <Star />
          <div>
            <dt>Programme</dt>
            <dd>{event.programme.summary}</dd>
          </div>
          <Star />
          <div>
            <dt>Where</dt>
            <dd>
              {v.name}, {v.district}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
