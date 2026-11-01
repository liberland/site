import { event, photos } from '../data/anniversary';
import { Photo } from './Photo';
import { Arrow } from './Tag';

const FACILITIES = [
  'Cottages and A-frame cabins',
  'Camping by the river',
  'Beach on the riverbank',
  'Fishing, paddleboard and canoe',
  'Outdoor cooking',
  'EuroVelo 6 cycle-route checkpoint',
];

const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

/** F · The beauty of Ark Village — photo mosaic. */
export function Ark() {
  const v = event.venue;
  const tiles = [
    ['m-a', photos.arkLead, 'warm', 'A-frame cabins among the trees', '(max-width: 1100px) 100vw, 760px'],
    ['m-b', photos.arkTimber, '', 'Cottages and timber architecture', '(max-width: 1100px) 50vw, 540px'],
    ['m-c', photos.arkBeach, 'river', 'The beach on the riverbank', '(max-width: 1100px) 50vw, 540px'],
    ['m-d', photos.arkGathering, 'warm', 'Gathering by the fire', '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 430px'],
    ['m-e', photos.arkPaddle, 'river', 'Paddleboard and canoe', '(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 430px'],
  ] as const;
  return (
    <section id="ark" className="sec s-ark" aria-labelledby="ark-title">
      <div className="wrap">
        <div className="ark-head rv">
          <div>
            <p className="kick lbl">The venue</p>
            <h2 id="ark-title" className="d1 ark-title">{v.name}, on the Danube.</h2>
          </div>
          <div>
            <p className="lead">
              An adventure eco-resort outside {v.city}, in northwestern {v.country}, on the river. Cottages, A-frame cabins,
              camping and a beach on the riverbank, among mature trees.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              For the anniversary it is both meeting hall and village green: the place to talk, to eat outdoors, to go out on
              the water and to stay up late with friends.
            </p>
          </div>
        </div>
        <div className="mosaic">
          {tiles.map(([cls, photo, variant, caption, sizes]) => (
            <figure className={`${cls} rv`} key={cls}>
              <Photo photo={photo} className={variant} sizes={sizes} />
              <figcaption>{caption}</figcaption>
            </figure>
          ))}
          <div className="m-f rv">
            <p className="lbl" style={{ color: 'var(--forest)', marginBottom: 14 }}>At {v.name}</p>
            <ul>{FACILITIES.map((f) => <li key={f}>{f}</li>)}</ul>
            <a href={v.url} target="_blank" rel="noopener">
              Explore {v.name} · {host(v.url)} <Arrow c="↗" /><span className="vh"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
      <div className="ark-strip">
        <div className="wrap">
          <div><span className="rec">Venue</span><p className="v">{v.name}</p></div>
          <div><span className="rec">Address</span><p className="v">{v.street}, {v.postcode} {v.city}, {v.country}</p></div>
          <div><span className="rec">Country</span><p className="v">{v.country} · on the Danube</p></div>
          <div>
            <span className="rec">Website</span>
            <p className="v"><a href={v.url} target="_blank" rel="noopener">{host(v.url)}<span className="vh"> (opens in a new tab)</span></a></p>
          </div>
        </div>
      </div>
    </section>
  );
}
