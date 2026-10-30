import { event, type Guest } from '../data/event';
import { withBase } from '../lib/assets';

function GuestFeature({ g }: { g: Guest }) {
  const confirmed = g.status === 'confirmed';
  return (
    <article className="guest-feature reveal">
      {g.portrait ? (
        <div className="portrait">
          <img src={withBase(g.portrait)} alt={`Portrait of ${g.name}`} loading="lazy" decoding="async" />
        </div>
      ) : (
        <div className="portrait" role="img" aria-label={`Portrait placeholder for ${g.name}`}>
          <span className="mono-gram" aria-hidden="true">
            {g.initials}
          </span>
          <span className="ph-note" aria-hidden="true">
            PORTRAIT PENDING · A RIGHTS-CLEARED PHOTOGRAPH IS REQUIRED BEFORE PUBLICATION
          </span>
        </div>
      )}
      <div className="guest-info">
        {confirmed ? (
          <span className="chip chip-confirmed-ink">Confirmed</span>
        ) : (
          <span className="chip chip-pending-ink">Anticipated · subject to confirmation</span>
        )}
        <div className="nameplate">
          <h3 className="h3">{g.name}</h3>
          <p className="role" style={{ marginBottom: 0 }}>
            {g.role}
          </p>
        </div>
        <p>
          {g.bio}
          {!confirmed && ' Attendance is anticipated and has not yet been confirmed.'}
        </p>
        {!confirmed && <p className="disclaim">Listing subject to the guest’s approval.</p>}
      </div>
    </article>
  );
}

export function Guests() {
  const gs = event.guests;
  return (
    <section className="guests" id="guests" aria-labelledby="guests-title">
      <div className="wrap">
        <div className="sec-head reveal">
          <div>
            <span className="label">Featured guests</span>
            <h2 className="h2" id="guests-title">
              Voices of the <em>evening</em>
            </h2>
          </div>
          <p className="body">{gs.intro}</p>
        </div>
        <div className="guest-grid">
          {gs.featured.map((g) => (
            <GuestFeature key={g.name} g={g} />
          ))}
          {gs.slots.length > 0 && (
            <ul className="guest-slots" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {gs.slots.map((s) => (
                <li className="tba reveal" key={s.title}>
                  <b>{s.title}</b>
                  <span>{s.note}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="guest-note reveal">{gs.note}</p>
        </div>
      </div>
    </section>
  );
}
