import { event } from '../data/event';
import { Title } from './Title';
import { t } from '../i18n/ui';
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
          <p className="eyebrow eyebrow--ink">{t.celebration.eyebrow}</p>
          <h2 id="celebration-title" className="display">
            <Title parts={t.celebration.title} breakBefore={t.celebration.titleBreak} />
          </h2>
          <p className="lede">{t.celebration.lede}</p>
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
                  <small>
                    {v.street} · {event.city}
                  </small>
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
            <dt>{t.celebration.when}</dt>
            <dd>{dateLong()}</dd>
          </div>
          <Star />
          <div>
            <dt>{t.celebration.programme}</dt>
            <dd>{event.programme.summary}</dd>
          </div>
          <Star />
          <div>
            <dt>{t.celebration.where}</dt>
            <dd>
              {v.name}, {v.district}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
