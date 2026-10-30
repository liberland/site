import { event } from '../data/event';
import { dateConfirmed, venueAddressLine } from './event-helpers';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * <head> tags generated from event.ts at build time.
 * Event structured data (schema.org/Event) is only emitted once the date is
 * confirmed — a tentative date must not be published to search engines as fact.
 */
export function headTags() {
  const s = event.site;
  const title = `${event.name} · ${event.city}`;
  const image = new URL(s.socialImage, s.url).href;
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(s.description)}">`,
    `<meta name="robots" content="${s.indexable ? 'index, follow' : 'noindex, nofollow'}">`,
    `<link rel="canonical" href="${esc(s.url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Free Republic of Liberland">`,
    `<meta property="og:locale" content="${esc(s.locale)}">`,
    `<meta property="og:title" content="${esc(event.name)}">`,
    `<meta property="og:description" content="${esc(event.tagline + ' ' + s.description)}">`,
    `<meta property="og:url" content="${esc(s.url)}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(s.socialImageAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(event.name)}">`,
    `<meta name="twitter:description" content="${esc(s.description)}">`,
    `<meta name="twitter:image" content="${esc(image)}">`,
    `<meta name="twitter:image:alt" content="${esc(s.socialImageAlt)}">`,
  ];

  if (dateConfirmed) {
    const r = event.registration;
    const start = event.date.startTime ? `${event.date.iso}T${event.date.startTime}:00+01:00` : event.date.iso;
    const ld: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.name,
      description: s.description,
      startDate: start,
      ...(event.date.endTime ? { endDate: `${event.date.iso}T${event.date.endTime}:00+01:00` } : {}),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      image: [image],
      url: s.url,
      location: {
        '@type': 'Place',
        name: event.venue.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: event.venue.street,
          postalCode: event.venue.postcode,
          addressLocality: event.city,
          addressCountry: event.countryCode,
        },
      },
      organizer: { '@type': 'Organization', name: s.organiser.name, url: s.organiser.url },
      ...(r.status === 'open' && r.url ? { offers: { '@type': 'Offer', url: r.url } } : {}),
    };
    tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  }
  return tags.join('\n    ');
}

/** Sanity checks run at build time so organisers get a clear error, not a broken page. */
export function validateEvent() {
  const errors: string[] = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date.iso)) errors.push('date.iso must look like 2026-12-19');
  if (!['tentative', 'confirmed'].includes(event.date.status)) errors.push("date.status must be 'tentative' or 'confirmed'");
  for (const t of [event.date.startTime, event.date.endTime])
    if (t !== null && !/^\d{2}:\d{2}$/.test(t)) errors.push('date.startTime / endTime must look like 19:00 or be null');
  const r = event.registration;
  if (!['coming-soon', 'open', 'closed'].includes(r.status)) errors.push("registration.status must be 'coming-soon', 'open' or 'closed'");
  if (r.status === 'open' && !r.url) errors.push("registration.status is 'open' but registration.url is empty");
  if (r.url && !/^https:\/\//.test(r.url)) errors.push('registration.url must start with https://');
  for (const g of event.guests.featured) {
    if (!['anticipated', 'confirmed'].includes(g.status)) errors.push(`guest ${g.name}: status must be 'anticipated' or 'confirmed'`);
    if (g.portrait && !g.portraitCredit) errors.push(`guest ${g.name}: portraitCredit is required when a portrait is set`);
  }
  for (const p of event.venue.photos) {
    if (p.src && !p.credit) errors.push(`venue photo ${p.title}: credit is required when a photograph is set`);
    if (p.src && !p.alt) errors.push(`venue photo ${p.title}: alt text is required`);
  }
  if (!/^https:\/\/.+\/$/.test(event.site.url)) errors.push('site.url must be https://… and end with /');
  if (errors.length) throw new Error('src/data/event.ts has problems:\n  - ' + errors.join('\n  - '));
  return venueAddressLine;
}
