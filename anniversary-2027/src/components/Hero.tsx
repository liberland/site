import { event, photos } from '../data/anniversary';
import { dateRange, datesConfirmed, foundingDayMonth, foundingLong, foundingYear, venueLine } from '../lib/event';
import { resolve } from '../lib/photo';
import { Landscape } from './Landscape';
import { Medallion } from './Medallion';
import { Arrow, Tag } from './Tag';

/** A · The grand invitation */
export function Hero() {
  const hero = resolve(photos.hero);
  return (
    <section className="hero" aria-labelledby="hero-title">
      {hero ? (
        <>
          <img
            className="hero-photo"
            src={hero.src}
            srcSet={hero.srcSet}
            sizes="100vw"
            alt={photos.hero.alt}
            width={photos.hero.width}
            height={photos.hero.height}
            decoding="async"
            {...{ fetchpriority: 'high' }}
            style={photos.hero.focus ? { objectPosition: photos.hero.focus } : undefined}
          />
          {hero.reference && <span className="ref-tag">Reference image · not cleared for publication</span>}
        </>
      ) : (
        <Landscape />
      )}
      <div className="hero-shade" />
      <div className="wrap grid hero-in">
        <div className="hero-med">
          <Medallion />
        </div>
        <div className="hero-copy">
          <p className="kick lbl">Free Republic of Liberland · Founded {foundingLong}</p>
          <h1 id="hero-title" className="d1">
            <span className="h-ll">Liberland</span>
            <span className="h-12">{event.number}th Anniversary</span>
          </h1>
          <p className="h-sub">Twelve years of freedom, community &amp; the future</p>
          <div className="h-meta">
            <div>
              <span className="rec">Dates</span>
              <p className="v">{dateRange}</p>
              {!datesConfirmed && <Tag prov>Provisional dates</Tag>}
            </div>
            <div>
              <span className="rec">Venue</span>
              <p className="v">{venueLine}</p>
            </div>
            <div>
              <span className="rec">Founding anniversary</span>
              <p className="v">{foundingDayMonth} · since {foundingYear}</p>
            </div>
          </div>
          <div className="h-cta">
            <a className="btn btn-y" href="#experience">Discover the celebration <Arrow /></a>
            <a className="btn btn-ow" href="#ark">Explore Ark Village</a>
          </div>
        </div>
      </div>
      {!hero && <p className="h-cap rec">{photos.hero.id} · Hero photograph pending · Illustrative fallback</p>}
    </section>
  );
}
