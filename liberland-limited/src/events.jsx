// Events — publicly announced events by named organisers, linked to the organiser's own page.
// We never sell tickets, quote prices or claim to organise someone else's event.
function EventCard({ event }) {
  const t = window.LL_T.events;
  const { Link } = window.LL_UI;
  const copy = t.items[event.id];

  return (
    <article className="card offer" style={{ padding: "32px 28px 28px" }}>
      <div className="label label--teal">{t.organiser}</div>
      <h3 className="h3" style={{ margin: 0 }}>{copy.title}</h3>
      <dl className="facts" style={{ marginTop: 4 }}>
        <dt className="label">{t.whenLabel}</dt>
        <dd><time dateTime={event.start}>{window.LL_T.formatRange(event.start, event.end)}</time></dd>
        <dt className="label">{t.whereLabel}</dt>
        <dd>{copy.where}</dd>
      </dl>
      <p className="body" style={{ margin: 0 }}>{copy.text}</p>
      <Link href={event.url} className="btn btn--sm" style={{ marginTop: "auto" }}>{t.details}</Link>
    </article>
  );
}

function Events() {
  const t = window.LL_T.events;
  const { Link, SectionHead } = window.LL_UI;
  const { LINKS, upcomingEvents } = window.LL_DATA;
  const events = upcomingEvents(new Date());

  return (
    <section id="events" className="section" data-screen-label="Events">
      <div className="container">
        <SectionHead label={t.label} title={t.title} paragraphs={[t.intro]} />

        {events.length > 0 ? (
          <div className="grid-2">
            {events.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        ) : (
          <p className="body" style={{ margin: 0 }}>{t.none}</p>
        )}

        <div className="calendar-cta">
          <p className="body" style={{ margin: 0, maxWidth: 620 }}>{t.calendarText}</p>
          <Link href={LINKS.arkEvents} className="btn btn--solid">{t.calendarButton}</Link>
        </div>
      </div>

      <style>{`
        .calendar-cta { margin-top: 40px; padding-top: 28px; border-top: 1px solid var(--rule); display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; }
      `}</style>
    </section>
  );
}

window.LL_Events = Events;
