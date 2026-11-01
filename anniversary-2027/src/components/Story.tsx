import { event, timeline } from '../data/anniversary';
import { dateRangeShort, datesConfirmed, foundingYear } from '../lib/event';

/** H · The story so far */
export function Story() {
  return (
    <section id="story" className="sec s-story" aria-labelledby="story-title">
      <div className="wrap">
        <div className="story-head rv">
          <div>
            <p className="kick lbl">{foundingYear} – {event.year}</p>
            <h2 id="story-title" className="d2">The story so far</h2>
          </div>
          <p className="lead">A short record of a long project. Dates as given in Liberland’s published history.</p>
        </div>
        <ol className="tl">
          {timeline.items.map((t, i) => (
            <li key={t.year + t.title} className={i === 0 ? 'first rv' : 'rv'}>
              <span className="tl-y">{t.year}</span>
              <span><span className="tl-t">{t.title}</span><span className="tl-d">{t.text}</span></span>
              <span className="tl-r">{t.when}</span>
            </li>
          ))}
          <li className="now rv" aria-current="date">
            <span className="tl-y">{event.year}</span>
            <span><span className="tl-t">{timeline.current.title}</span><span className="tl-d">{timeline.current.text}</span></span>
            <span className="tl-r">{dateRangeShort}{datesConfirmed ? '' : ' · Provisional'}</span>
          </li>
        </ol>
        <p className="src">{timeline.source}</p>
      </div>
    </section>
  );
}
