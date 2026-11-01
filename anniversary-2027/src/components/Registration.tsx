import { event, registration, tiers } from '../data/anniversary';
import { mailto, registrationOpen } from '../lib/event';
import { Arrow, Tag } from './Tag';

const NEW_TAB = <span className="vh"> (opens in a new tab)</span>;

/** J · Participation / registration. No form, no checkout: an authorised external link only, when configured. */
export function Registration() {
  const r = registration;
  const closed = r.status === 'closed';
  return (
    <section id="register" className="sec s-reg" aria-labelledby="reg-title">
      <div className="wrap">
        <div className="reg-top">
          <div className="rv">
            <p className="kick lbl">Participation</p>
            <h2 id="reg-title" className="d2">Registration</h2>
            <p className="lead" style={{ marginTop: 24 }}>{r.intro}</p>
          </div>
          <div className="reg-state rv">
            {registrationOpen ? <Tag>Open</Tag> : <Tag prov>{closed ? 'Closed' : 'Not yet open'}</Tag>}
            <p className="d3">{registrationOpen ? 'Registration is open.' : closed ? r.closedMessage : r.message}</p>
            <p>
              {registrationOpen
                ? `Registration is handled on an external booking page${r.provider ? ` (${r.provider})` : ''}. Questions go to the organisers.`
                : r.detail}
            </p>
            <div className="reg-btns">
              {registrationOpen ? (
                <>
                  <a className="btn btn-y" href={r.url!} target="_blank" rel="noopener">Register <Arrow c="↗" />{NEW_TAB}</a>
                  <a className="btn btn-ov" href={mailto(`${event.name} ${event.year}`)}>Write to the organisers</a>
                </>
              ) : (
                <>
                  <a className="btn btn-v" href={mailto(`${event.name} ${event.year}`)}>Write to the organisers</a>
                  <span>
                    <button className="btn" type="button" disabled aria-describedby="reg-why">Register</button>
                    <span className="why" id="reg-why">{closed ? 'Closed' : 'Not yet open'}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="tiers rv" role="group" aria-label={registrationOpen ? 'Participation categories' : 'Participation categories in preparation'}>
          {tiers.map((t) => {
            const url = t.status === 'open' ? t.url ?? r.url : null;
            return (
              <article className={t.featured ? 'tier feat' : 'tier'} key={t.name}>
                <span className="rec">{t.label}</span>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                <p className="price">{t.status === 'soldout' ? 'Sold out' : t.price ?? t.priceNote}</p>
                {url && registrationOpen && (
                  <a className="btn btn-ov" href={url} target="_blank" rel="noopener">Register <Arrow c="↗" />{NEW_TAB}</a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
