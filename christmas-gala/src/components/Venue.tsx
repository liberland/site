import { event, type VenuePhoto } from '../data/event';
import { externalLinkProps } from '../lib/event-helpers';
import { withBase } from '../lib/assets';
import { Arrow, NewTab } from './Arrow';
import { CeilingSketch, FacadeSketch, SkylineSketch } from './Art';

const SKETCH = { facade: FacadeSketch, ceiling: CeilingSketch, skyline: SkylineSketch };

function PhotoSlot({ photo, main }: { photo: VenuePhoto; main: boolean }) {
  const Sketch = SKETCH[photo.art];
  const cls = `photo-slot ${main ? 'photo-main' : 'photo-sub'} reveal`;
  if (photo.src) {
    return (
      <figure className={cls}>
        <img src={withBase(photo.src)} alt={photo.alt} loading="lazy" decoding="async" />
        <figcaption>
          <b>{photo.title}</b>
          <span>{photo.caption}</span>
          {photo.credit && <small>{photo.credit}</small>}
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className={cls}>
      <Sketch aria-hidden="true" />
      <figcaption>
        <b>Photograph pending · {photo.title}</b>
        <span>{photo.caption}</span>
      </figcaption>
    </figure>
  );
}

export function Venue() {
  const v = event.venue;
  return (
    <section className="venue" id="venue" aria-labelledby="venue-title">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <span className="label">The venue</span>
            <h2 className="h2" id="venue-title">
              Le Palais
              <br />
              <em>Art Hotel Prague</em>
            </h2>
          </div>
          <p className="body" style={{ color: 'rgba(248,242,232,.74)' }}>
            {v.intro}
          </p>
        </div>
        <div className="venue-grid">
          {v.photos.map((p, i) => (
            <PhotoSlot key={p.title} photo={p} main={i === 0} />
          ))}
        </div>
        <div className="venue-info">
          <p className="lead reveal">{v.lead}</p>
          <div className="reveal venue-side">
            <dl className="venue-dl">
              <div>
                <dt className="label">Address</dt>
                <dd>
                  {v.street}
                  <br />
                  {v.postcode} {v.district}, {v.country}
                </dd>
              </div>
              {v.facts.map((f) => (
                <div key={f.label}>
                  <dt className="label">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
              <div>
                <dt className="label">Telephone</dt>
                <dd>
                  <a className="mono link-u" href={`tel:${v.telephone.replace(/\s/g, '')}`}>
                    {v.telephone}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="venue-link">
              <a className="btn btn-ghost" href={v.url} {...externalLinkProps}>
                Official hotel website <Arrow />
                <NewTab />
              </a>
              <a className="btn btn-ghost" href={v.mapsUrl} {...externalLinkProps}>
                Open in maps
                <NewTab />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
