import { event } from '../data/event';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Parses YYYY-MM-DD as a calendar date (no time-zone shifts). */
function parts(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`event.date.iso must be YYYY-MM-DD, got "${iso}"`);
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const weekday = new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
  return { y, mo, d, weekday };
}

const up = (s: string) => s.toUpperCase();

export function dateLong(iso = event.date.iso) {
  const { y, mo, d, weekday } = parts(iso);
  return `${DAYS[weekday]}, ${d} ${MONTHS[mo - 1]} ${y}`;
}

/** e.g. SAT 19 DEC 2026 */
export function dateMono(iso = event.date.iso) {
  const { y, mo, d, weekday } = parts(iso);
  return up(`${DAYS[weekday].slice(0, 3)} ${d} ${MONTHS[mo - 1].slice(0, 3)} ${y}`);
}

/** e.g. 19 DEC 2026 */
export function dateShort(iso = event.date.iso) {
  const { y, mo, d } = parts(iso);
  return up(`${d} ${MONTHS[mo - 1].slice(0, 3)} ${y}`);
}

export const dateConfirmed = event.date.status === 'confirmed';

export const venueAddressLine = `${event.venue.street}, ${event.venue.postcode} ${event.venue.district}, ${event.venue.country}`;

/** Where every "register" call to action points, and what it says. */
export function registrationCta() {
  const r = event.registration;
  if (r.status === 'open' && r.url) {
    return { href: r.url, external: true, label: r.openLabel, navLabel: r.openLabel };
  }
  return { href: '#register', external: false, label: 'Registration Details', navLabel: 'Registration' };
}

export const externalLinkProps = { target: '_blank', rel: 'noopener noreferrer' } as const;
