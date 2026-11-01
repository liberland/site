import { event, photos } from '../data/anniversary';
import { Figure } from './Photo';
import { Arrow, NewTab } from './Tag';

const FACILITIES = [
  'Cottages and A-frame cabins',
  'Camping by the river',
  'Beach on the riverbank',
  'Fishing, paddleboard and canoe',
  'Outdoor cooking',
  'EuroVelo 6 cycle-route checkpoint',
];
const host = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

/** F · Ark Village — a photography-led showcase of the actual venue. */
export function Ark() {
  const v = event.venue;
  return (
    <section id="ark" className="sec sec-paper" aria-labelledby="ark-title">
      <div className="wrap">
        <div className="ark-head rv">
          <div>
            <h2 id="ark-title" className="h2">{v.name}, on the Danube</h2>
            <p className="lead">
              An adventure eco-resort outside {v.city}, in northwestern {v.country}, on the river: timber buildings,
              A-frame cabins, camping and a beach on the riverbank, among mature trees. For the anniversary it is both
              meeting hall and village green — the place to talk, to eat outdoors, to go out on the water and to stay up
              late with friends.
            </p>
          </div>
          <div>
            <ul className="ark-facts">{FACILITIES.map((f) => <li key={f}>{f}</li>)}</ul>
            <a className="ark-link tlink" href={v.url} target="_blank" rel="noopener">Explore {host(v.url)} <Arrow c="↗" /><NewTab /></a>
          </div>
        </div>
        <div className="gallery">
          <Figure photo={photos.lodge} className="g-a rv" sizes="(max-width: 1100px) 100vw, 720px" />
          <Figure photo={photos.boardwalk} className="g-b rv" sizes="(max-width: 1100px) 100vw, 520px" />
          <Figure photo={photos.aFrames} className="g-c rv" sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 410px" />
          <Figure photo={photos.lounge} className="g-d rv" sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 410px" />
          <Figure photo={photos.lawn} className="g-e rv" sizes="(max-width: 640px) 100vw, (max-width: 1100px) 33vw, 410px" />
        </div>
        <dl className="venue-bar rv">
          <div><dt>Venue</dt><dd>{v.name}</dd></div>
          <div><dt>Address</dt><dd>{v.street}, {v.postcode} {v.city}</dd></div>
          <div><dt>Country</dt><dd>{v.country} · on the Danube</dd></div>
          <div><dt>Website</dt><dd><a href={v.url} target="_blank" rel="noopener">{host(v.url)}<NewTab /></a></dd></div>
        </dl>
      </div>
    </section>
  );
}
