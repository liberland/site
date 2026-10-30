import { event } from '../data/event';
import { dateConfirmed, dateLong, dateShort } from '../lib/event-helpers';

export function Introduction() {
  const ed = event.editorial;
  const closing = dateConfirmed
    ? `The gala takes place on ${dateLong()}. Registration details will be published on this page.`
    : `The date is proposed for ${dateLong()} and is not yet confirmed. The confirmed date, programme and registration details will be published on this page as soon as they are available.`;

  return (
    <section className="intro" id="introduction" aria-labelledby="intro-title">
      <div className="wrap">
        <div className="intro-head reveal">
          <p className="label" style={{ margin: 0 }}>
            The gathering
          </p>
          <h2 className="statement" id="intro-title">
            {ed.introStatement} <em>{ed.introStatementEmphasis}</em>
          </h2>
        </div>
        <div className="intro-body">
          <dl className="facts reveal" style={{ margin: 0 }}>
            {ed.milestones.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
            <div>
              <dt>{event.shortName}</dt>
              <dd>
                {dateShort()}
                {!dateConfirmed && <small>Proposed date</small>}
              </dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{event.venue.name.toUpperCase()}</dd>
            </div>
          </dl>
          <div className="cols reveal">
            {ed.introParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>{closing}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
