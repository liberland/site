import { event, type Photo } from '../data/event';
import { withBase } from './assets';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Parses YYYY-MM-DD as a calendar date (no time-zone shifts). */
function parts(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`event.date.iso must be YYYY-MM-DD, got "${iso}"`);
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  return { y, mo, d, weekday: new Date(Date.UTC(y, mo - 1, d)).getUTCDay() };
}

/** Friday, 18 December 2026 */
export function dateLong(iso = event.date.iso) {
  const { y, mo, d, weekday } = parts(iso);
  return `${DAYS[weekday]}, ${d} ${MONTHS[mo - 1]} ${y}`;
}

/** 18 December 2026 */
export function dateDayMonthYear(iso = event.date.iso) {
  const { y, mo, d } = parts(iso);
  return `${d} ${MONTHS[mo - 1]} ${y}`;
}

/** Friday */
export function weekday(iso = event.date.iso) {
  return DAYS[parts(iso).weekday];
}

export const dateConfirmed = event.date.status === 'confirmed';

/** Where every registration call to action points, and what it says. */
export function registrationCta() {
  const r = event.registration;
  if (r.status === 'open' && r.url && !r.email) return { href: r.url, external: true, label: r.openLabel, short: r.openLabel };
  if (r.status === 'open') return { href: '#register', external: false, label: 'Tickets & RSVP', short: 'Tickets & RSVP' };
  return { href: '#register', external: false, label: 'Registration Details', short: 'Registration' };
}

/** 'Free' or '50 USD'. */
export function formatPrice(price: number) {
  return price === 0 ? 'Free' : `${price} ${event.registration.currency}`;
}

/** A mailto: link with a ready-to-fill RSVP message. */
export function rsvpMailto() {
  const r = event.registration;
  if (!r.email) return null;
  const subject = `RSVP: ${event.name}, ${dateLong()}`;
  const body = [
    'Dear RSVP team,',
    '',
    `I would like to register for the ${event.name} on ${dateLong()} at ${event.venue.name}.`,
    '',
    'Full name:',
    'I am a (please keep one): citizen of Liberland / e-resident / member of the public',
    'Number of guests (including me):',
    '',
    'Kind regards,',
  ].join('\n');
  return `mailto:${r.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const externalLinkProps = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** Local design mockups only: show uncleared hotel photographs, tagged as such. */
export const REFERENCE_MODE = import.meta.env?.VITE_REFERENCE_IMAGES === '1';

export interface ResolvedPhoto {
  src: string;
  srcSet: string;
  reference: boolean;
}

/**
 * A photograph is shown only when cleared for publication — or, in a local
 * reference build, from the git-ignored _reference folder with a visible tag.
 * Otherwise null: the caller renders its designed placeholder.
 */
export function resolvePhoto(p: Photo): ResolvedPhoto | null {
  const dir = p.cleared ? 'images/venue' : REFERENCE_MODE ? '_reference' : null;
  if (!dir) return null;
  const base = withBase(`${dir}/${p.id}`);
  return { src: `${base}.webp`, srcSet: `${base}-800.webp 800w, ${base}.webp 2000w`, reference: !p.cleared };
}
