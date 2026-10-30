import { event } from '../data/event';
import { externalLinkProps } from '../lib/event-helpers';
import { NewTab } from './Arrow';
import { Star } from './Ornaments';

/**
 * Registration card. Deliberately has no form: no personal data is collected
 * on this site. When an authorised registration system exists, set
 * `registration.url` and `registration.status = 'open'` in src/data/event.ts.
 */
export function Registration() {
  const r = event.registration;
  const open = r.status === 'open' && !!r.url;
  return (
    <aside className="reg-card reveal" id="register" aria-labelledby="reg-title">
      <p className="eyebrow">Registration</p>
      {open ? (
        <>
          <h3 id="reg-title">Registration is open</h3>
          <p>Registration is handled on the organisers’ official registration page, where its own terms and privacy notice apply.</p>
          <a className="btn btn-gold" href={r.url!} {...externalLinkProps}>
            {r.openLabel}
            <NewTab />
          </a>
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
