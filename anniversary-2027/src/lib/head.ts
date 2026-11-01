/* <head> tags generated at build time from src/data/anniversary.ts. */
import { event, people, site } from '../data/anniversary';
import { ticketing, ticketsLive } from '../config/ticketing';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function headTags() {
  // SITE_URL overrides the canonical address for a preview deployment (e.g. https://liberlandlimited.com/anniversary/).
  const url = process.env.SITE_URL ?? site.url;
  const image = new URL(site.socialImage, url).href;
  const v = event.venue;
  const place = {
    '@type': 'Place',
    name: v.name,
    url: v.url,
    address: { '@type': 'PostalAddress', streetAddress: v.street, postalCode: v.postcode, addressLocality: v.city, addressCountry: v.countryCode },
  };
  const tags = [
    `<title>${esc(site.title)}</title>`,
    `<meta name="description" content="${esc(site.description)}">`,
    `<meta name="robots" content="${site.indexable ? 'index, follow' : 'noindex, nofollow'}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(site.organiser.name)}">`,
    `<meta property="og:locale" content="${esc(site.locale)}">`,
    `<meta property="og:title" content="${esc(site.title)}">`,
    `<meta property="og:description" content="${esc(site.description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="${esc(site.socialImageAlt)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(site.title)}">`,
    `<meta name="twitter:description" content="${esc(site.description)}">`,
    `<meta name="twitter:image" content="${esc(image)}">`,
    `<meta name="twitter:image:alt" content="${esc(site.socialImageAlt)}">`,
  ];

  // Always: the page and the venue (correctly in Serbia). No dates, prices or performers.
  const ld: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: site.title,
      description: site.description,
      url,
      inLanguage: 'en',
      publisher: { '@type': 'Organization', name: site.organiser.name, url: site.organiser.url },
      about: place,
    },
  ];

  // schema.org/Event only once the organisers confirm the dates. Provisional dates are never published as fact.
  if (event.dates.status === 'confirmed') {
    const performers = people
      .filter((p) => p.status === 'speaker')
      .map((p) => ({ '@type': 'Person', name: p.name }));
    ld.push({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `${event.name} ${event.year}`,
      description: site.description,
      startDate: event.dates.start,
      endDate: event.dates.end,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      image: [image],
      url,
      location: place,
      organizer: { '@type': 'Organization', name: site.organiser.name, url: site.organiser.url },
      ...(performers.length ? { performer: performers } : {}),
      // Only a link to the authorised booking page; prices appear only as configured from the Luma event.
      ...(ticketsLive
        ? { offers: ticketing.ticketTypes.length
            ? ticketing.ticketTypes.filter((t) => t.price).map((t) => ({ '@type': 'Offer', name: t.name, url: ticketing.eventUrl, price: t.price!.amount, priceCurrency: t.price!.currency }))
            : { '@type': 'Offer', url: ticketing.eventUrl } }
        : {}),
    });
  }
  for (const x of ld) tags.push(`<script type="application/ld+json">${JSON.stringify(x).replace(/</g, '\\u003c')}</script>`);
  return tags.join('\n    ');
}
