import { useCallback, useEffect, useRef, useState } from 'react';
import { event } from '../data/event';
import { externalLinkProps, resolvePhoto } from '../lib/event-helpers';
import { NewTab } from './Arrow';
import { Photo, RefTag } from './Photo';
import { Flourish, Wreath } from './Ornaments';

/** Accessible lightbox on a native <dialog>: Esc closes, ←/→ browse. */
function Lightbox({ index, onClose, onMove }: { index: number | null; onClose: () => void; onMove: (d: number) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const photos = event.venue.gallery;
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === 'ArrowRight') onMove(1);
      if (e.key === 'ArrowLeft') onMove(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, onMove]);
  const p = index === null ? null : photos[index];
  const r = p ? resolvePhoto(p) : null;
  return (
    <dialog ref={ref} className="lightbox" aria-label="Le Palais photographs" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      {p && r && (
        <figure>
          <img src={r.src} alt={p.alt} />
          <figcaption>
            <b>{p.title}</b> {p.caption} <small>{p.credit}</small>
          </figcaption>
          {r.reference && <RefTag />}
        </figure>
      )}
      <button className="lb-btn lb-prev" type="button" onClick={() => onMove(-1)} aria-label="Previous photograph">
        ‹
      </button>
      <button className="lb-btn lb-next" type="button" onClick={() => onMove(1)} aria-label="Next photograph">
        ›
      </button>
      <button className="lb-btn lb-close" type="button" onClick={onClose} aria-label="Close">
        ×
      </button>
    </dialog>
  );
}

export function Venue() {
  const v = event.venue;
  const shown = v.gallery.filter((p) => resolvePhoto(p));
  const [open, setOpen] = useState<number | null>(null);
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + v.gallery.length) % v.gallery.length)), [v.gallery.length]);

  return (
    <section className="venue" id="venue" aria-labelledby="venue-title">
      <div className="wrap">
        <header className="venue-head reveal">
          <div>
            <p className="eyebrow">The Venue</p>
            <h2 id="venue-title" className="display">
              Le Palais <em>Art Hotel</em> Prague
            </h2>
          </div>
          <p className="venue-intro">{v.intro}</p>
        </header>
        {shown.some((p) => resolvePhoto(p)?.reference) && (
          <p className="venue-ref-note">
            Design reference: these photographs are © Le Palais Art Hotel Prague and are not yet cleared for publication.
          </p>
        )}
      </div>

      {shown.length > 0 ? (
        <div className="wrap wrap--wide">
          <ul className="mosaic" aria-label="Photographs of Le Palais Art Hotel Prague">
            {v.gallery.map((p, i) =>
              resolvePhoto(p) ? (
                <li key={p.id} className={`tile tile--${i}`}>
                  <button type="button" className="tile-btn" onClick={() => setOpen(i)} aria-label={`Enlarge: ${p.title}`}>
                    <Photo photo={p} sizes="(max-width: 760px) 84vw, (max-width: 1180px) 50vw, 900px" className="tile-img" showTag={false} />
                  </button>
                  <div className="tile-cap">
                    <b>{p.title}</b>
                    <span>{p.caption}</span>
                  </div>
                  {resolvePhoto(p)?.reference && <RefTag />}
                </li>
              ) : null,
            )}
          </ul>
          <Lightbox index={open} onClose={() => setOpen(null)} onMove={move} />
        </div>
      ) : (
        <div className="wrap">
          <div className="venue-await reveal">
            <Wreath className="venue-await-wreath" />
            <div>
              <h3>Photographs of Le Palais to follow</h3>
              <p>
                Our photographic tour of the hotel — its lobby, painted salons, library and Artista restaurant — will appear here once
                the hotel has approved the use of its photography. Until then, the hotel’s own gallery shows the house beautifully.
              </p>
              <a className="btn btn-gold" href={v.galleryUrl} {...externalLinkProps}>
                View the hotel’s gallery
                <NewTab />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="wrap venue-foot">
        <Flourish className="venue-flourish" />
        <dl className="venue-facts reveal">
          {v.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
          <div>
            <dt>Address</dt>
            <dd>
              {v.street}, {v.postcode} {v.district}, {v.country}
            </dd>
          </div>
        </dl>
        <div className="venue-links reveal">
          <a className="btn btn-gold" href={v.url} {...externalLinkProps}>
            The hotel’s website
            <NewTab />
          </a>
          <a className="btn btn-ivory" href={v.mapsUrl} {...externalLinkProps}>
            Open in maps
            <NewTab />
          </a>
        </div>
      </div>
    </section>
  );
}
