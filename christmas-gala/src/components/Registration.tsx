import { event } from '../data/event';
import { externalLinkProps } from '../lib/event-helpers';
import { Arrow, NewTab } from './Arrow';

/**
 * Registration card. Deliberately has no form: no personal data is collected
 * on this site. When an authorised registration system exists, set
 * `registration.url` and `registration.status = 'open'` in src/data/event.ts.
 */
export function Registration() {
  const r = event.registration;
  const open = r.status === 'open' && !!r.url;

  return (
    <div className="form-card reveal" id="register">
      <h2 className="label" style={{ margin: 0 }}>
        Registration
      </h2>
      {open ? (
        <>
          <h3>Registration is open.</h3>
          <p>Registration is handled on the organisers’ official registration page, where its own terms and privacy notice apply.</p>
          <div className="reg-state">
            <a className="btn btn-gold" href={r.url!} {...externalLinkProps}>
              {r.openLabel} <Arrow />
              <NewTab />
            </a>
          </div>
        </>
      ) : r.status === 'closed' ? (
        <>
          <h3>Registration has closed.</h3>
          <p>Thank you for your interest in the {event.name}.</p>
        </>
      ) : (
        <>
          <h3>Be the first to know.</h3>
          <p>The confirmed date, programme, admission and registration details will be published on this page.</p>
          <div className="reg-state" role="status">
            <span className="seal" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" strokeOpacity=".9" />
                <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
              </svg>
            </span>
            <h4>Registration details coming soon</h4>
            <p>No tickets are on sale yet, and this page does not collect any personal details.</p>
            {r.updatesUrl && (
              <a className="btn btn-ghost btn-sm" href={r.updatesUrl} {...externalLinkProps}>
                {r.updatesLabel}
                <NewTab />
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
