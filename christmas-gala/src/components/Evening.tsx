import { event } from '../data/event';
import { resolvePhoto } from '../lib/event-helpers';
import { Photo } from './Photo';
import { Flourish, Garland, HangingBaubles, Star, Wreath } from './Ornaments';

export function Evening() {
  const ev = event.evening;
  const photo = event.venue.christmasPhoto;
  return (
    <section className="evening" id="evening" aria-labelledby="evening-title">
      <div className="evening-media">
        <Photo photo={photo} sizes="100vw" className="evening-photo" fallback={<Wreath className="evening-wreath" />} />
      </div>
      <div className="evening-shade" aria-hidden="true" />
      <Garland kind="rope" className="seam seam--top" twinkle={false} />
      <HangingBaubles
        items={[
          { x: '47%', len: 150, size: 50, kind: 'burgundy' },
          { x: '55%', len: 240, size: 60, kind: 'gold' },
          { x: '62%', len: 110, size: 40, kind: 'ivory' },
          { x: '93%', len: 180, size: 54, kind: 'red' },
          { x: '86%', len: 90, size: 38, kind: 'gold' },
        ]}
      />
      <div className="wrap evening-inner">
        <div className="evening-copy reveal">
          <p className="eyebrow">The Christmas Evening</p>
          <h2 id="evening-title" className="display">
            A Grand <em>Christmas</em> Gala
          </h2>
          <Flourish />
          <p className="lede lede--light">{ev.lead}</p>
          <ul className="moments">
            {ev.moments.map((m) => (
              <li key={m.title}>
                <Star />
                <div>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="evening-note">{ev.note}</p>
        </div>
      </div>
      {resolvePhoto(photo) && <p className="evening-credit">{photo.caption}</p>}
    </section>
  );
}
