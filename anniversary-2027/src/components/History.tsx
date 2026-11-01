import badge from '../assets/badge-280.webp';
import { event, timeline } from '../data/anniversary';
import { dateRangeShort, datesConfirmed, foundingYear } from '../lib/event';

/** H · Twelve years of history — a compact timeline with the official badge; no invented archive photographs. */
export function History() {
  return (
    <section id="story" className="sec" aria-labelledby="story-title">
      <div className="wrap hist-grid">
        <div className="hist-side rv">
          <div>
            <p className="eyebrow">{foundingYear} – {event.year}</p>
            <h2 id="story-title" className="h2" style={{ marginTop: 10 }}>Twelve years of history</h2>
            <p className="body" style={{ marginTop: 14 }}>A short record of a long project, as given in Liberland’s published history.</p>
          </div>
          <img src={badge} width="150" height="150" alt="Badge of the Free Republic of Liberland" loading="lazy" />
        </div>
        <div className="rv">
          <ol className="tl">
            {timeline.items.map((t) => (
              <li key={t.year + t.title}>
                <span className="tl-y">{t.year}</span>
                <span><span className="tl-t">{t.title}</span><span className="tl-d">{t.text}</span></span>
                <span className="tl-r">{t.when}</span>
              </li>
            ))}
            <li className="now">
              <span className="tl-y">{event.year}</span>
              <span><span className="tl-t">{timeline.current.title}</span><span className="tl-d">{timeline.current.text}</span></span>
              <span className="tl-r">{dateRangeShort}{datesConfirmed ? '' : ' · provisional'}</span>
            </li>
          </ol>
          <p className="src">{timeline.source}</p>
        </div>
      </div>
    </section>
  );
}
