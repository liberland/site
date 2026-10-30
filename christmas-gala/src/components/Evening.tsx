import { event } from '../data/event';
import { Chandelier } from './Art';

export function Evening() {
  const ev = event.evening;
  return (
    <section className="evening" id="evening" aria-labelledby="evening-title">
      <Chandelier className="chandelier" aria-hidden="true" />
      <div className="evening-split">
        <div className="ev-day reveal">
          <span className="label">By day</span>
          <p className="ev-day-title">
            The programme:
            <br />
            ideas, argued carefully.
          </p>
          <ul>
            {event.programme.pillars.map((p) => (
              <li key={p.numeral}>
                <span>{p.numeral}</span>
                <span>{p.title}</span>
              </li>
            ))}
            <li>
              <span aria-hidden="true">—</span>
              <span>{event.programme.scheduleNote}</span>
            </li>
          </ul>
        </div>
        <div className="ev-night">
          <span className="label">By night</span>
          <h2 id="evening-title" className="ev-title">
            The <em>gala</em>
            <br />
            evening
          </h2>
          <p className="lead">{ev.lead}</p>
          <div className="ev-moments">
            {ev.moments.map((m) => (
              <div className="reveal" key={m.title}>
                <b>{m.title}</b>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <p className="ev-note">{ev.note}</p>
        </div>
      </div>
    </section>
  );
}
