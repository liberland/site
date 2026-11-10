import { event } from '../data/event';
import { externalLinkProps, formatPrice, rsvpMailto } from '../lib/event-helpers';
import { NewTab } from './Arrow';
import { Star } from './Ornaments';

/**
 * Tickets & registration card. Deliberately has no form: no personal data is
 * collected on this site. Registration runs by e-mail (`registration.email`,
 * a pre-filled message) or on an authorised page (`registration.url`).
 */
export function Registration() {
  const r = event.registration;
  const mailto = rsvpMailto();
  const open = r.status === 'open' && (!!mailto || !!r.url);
  return (
    <aside className="reg-card reveal" id="register" aria-labelledby="reg-title">
      <p className="eyebrow">Tickets &amp; Registration</p>
      {open ? (
        <>
          <h3 id="reg-title">Reserve your place</h3>
          <ul className="tickets" aria-label="Admission prices">
            {r.tickets.map((t) => (
              <li key={t.group}>
                <span className="ticket-group">{t.group}</span>
                <span className="ticket-dots" aria-hidden="true" />
                <span className={`ticket-price${t.price === 0 ? ' ticket-price--free' : ''}`}>{formatPrice(t.price)}</span>
              </li>
            ))}
          </ul>
          <p>{r.instructions}</p>
          {mailto ? (
            <>
              <a className="btn btn-gold reg-btn" href={mailto}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
                  <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
                </svg>
                {r.openLabel}
              </a>
              <p className="reg-address">
                or write to <a href={`mailto:${r.email}`}>{r.email}</a>
              </p>
            </>
          ) : (
            <a className="btn btn-gold reg-btn" href={r.url!} {...externalLinkProps}>
              {r.openLabel}
              <NewTab />
            </a>
          )}
          <p className="reg-fine">
            <Star /> Your RSVP goes directly to Liberland by e‑mail. This page does not collect any personal details.
          </p>
        </>
      ) : r.status === 'closed' ? (
        <>
          <h3 id="reg-title">Registration has closed</h3>
          <p>Thank you for your interest in the {event.name}.</p>
        </>
      ) : (
        <>
          <h3 id="reg-title">Registration details coming soon</h3>
          <p>Admission and registration details will be published on this page.</p>
          <p className="reg-fine" role="status">
            <Star /> No tickets are on sale yet, and this page does not collect any personal details.
          </p>
          {r.updatesUrl && (
            <a className="btn btn-ivory btn-sm" href={r.updatesUrl} {...externalLinkProps}>
              {r.updatesLabel}
              <NewTab />
            </a>
          )}
        </>
      )}
    </aside>
  );
}
