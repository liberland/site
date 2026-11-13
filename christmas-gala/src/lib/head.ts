import { event } from '../data/event';
import { dateConfirmed } from './event-helpers';
import { LANG, LANG_STORAGE_KEY } from '../i18n/lang';

/**
 * The public address the page is built for. Defaults to `site.url` in event.ts;
 * a deploy can override it at build time, e.g. SITE_URL=https://christmas.ll.land/.
 */
export function siteUrl() {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return env?.SITE_URL || event.site.url;
}

/** The address of this language's page: the site root for English, <root>zh/ for Chinese. */
export function pageUrl(lang = LANG) {
  return lang === 'zh' ? `${siteUrl()}zh/` : siteUrl();
}

/**
 * English page only: visitors from mainland China, Taiwan, Hong Kong or Macau (by the
 * browser's time zone), or whose browser's first language is Chinese, are sent to the
 * Chinese page before anything is drawn. A choice made with the EN · 中文 switch wins.
 * Static hosting has no IP geolocation, and third-party geo services are often blocked
 * in China, so the time zone is the location signal.
 */
function langRedirectScript() {
  const zhPath = new URL(pageUrl('zh')).pathname;
  const base = new URL(siteUrl()).pathname;
  const zones = [
    'Asia/Shanghai', 'Asia/Chongqing', 'Asia/Chungking', 'Asia/Harbin', 'Asia/Urumqi', 'Asia/Kashgar', 'PRC',
    'Asia/Taipei', 'ROC',
    'Asia/Hong_Kong', 'Hongkong', 'Asia/Macau', 'Asia/Macao',
  ];
  return [
    '<script>(function(){try{',
    `var s=null;try{s=localStorage.getItem(${JSON.stringify(LANG_STORAGE_KEY)})}catch(e){}`,
    "if(s==='en')return;var go=s==='zh';",
    "if(!go){var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}",
    "var l=((navigator.languages&&navigator.languages[0])||navigator.language||'').toLowerCase();",
    `go=${JSON.stringify(zones)}.indexOf(tz)>=0||l.indexOf('zh')===0}`,
    `var p=location.pathname,b=${JSON.stringify(base)};`,
    `if(go&&(p===b||p===b+'index.html'))location.replace(${JSON.stringify(zhPath)}+location.search+location.hash)`,
    '}catch(e){}})()</script>',
  ].join('');
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * <head> tags generated from event.ts at build time.
 * Event structured data (schema.org/Event) is only emitted once the date is
 * confirmed — a tentative date must not be published to search engines as fact.
 */
export function headTags() {
  const s = { ...event.site, url: pageUrl() };
  const title = LANG === 'zh' ? `${event.name} · Le Palais 的圣诞，${event.city}` : `${event.name} · Christmas at Le Palais, ${event.city}`;
  const image = new URL(s.socialImage, siteUrl()).href;
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(s.description)}">`,
    `<meta name="robots" content="${s.indexable ? 'index, follow' : 'noindex, nofollow'}">`,
    `<link rel="canonical" href="${esc(s.url)}">`,
    `<link rel="alternate" hreflang="en" href="${esc(pageUrl('en'))}">`,
    `<link rel="alternate" hreflang="zh-Hans" href="${esc(pageUrl('zh'))}">`,
    `<link rel="alternate" hreflang="x-default" href="${esc(pageUrl('en'))}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Free Republic of Liberland">`,
    `<meta property="og:locale" content="${esc(s.locale)}">`,
    `<meta property="og:locale:alternate" content="${LANG === 'zh' ? 'en_GB' : 'zh_CN'}">`,
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
      inLanguage: LANG === 'zh' ? 'zh-CN' : 'en',
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
      ...(r.status === 'open'
        ? {
            offers: r.tickets.map((t) => ({
              '@type': 'Offer',
              name: t.group,
              price: String(t.price),
              priceCurrency: r.currency,
              url: r.url ?? `${s.url}#register`,
              availability: 'https://schema.org/InStock',
            })),
          }
        : {}),
    };
    tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
  }
  if (LANG === 'en') tags.unshift(langRedirectScript());
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
  if (r.status === 'open' && !r.url && !r.email) errors.push("registration.status is 'open' but neither registration.email nor registration.url is set");
  if (r.email && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(r.email)) errors.push('registration.email does not look like an e-mail address');
  for (const t of r.tickets) if (!(t.price >= 0)) errors.push(`ticket "${t.group}": price must be 0 or more`);
  if (r.url && !/^https:\/\//.test(r.url)) errors.push('registration.url must start with https://');
  for (const p of event.faces.people) {
    if (!['featured', 'programme', 'anticipated', 'confirmed'].includes(p.attendance))
      errors.push(`${p.name}: attendance must be 'featured', 'programme', 'anticipated' or 'confirmed'`);
    if (p.portrait && !p.credit) errors.push(`${p.name}: credit is required when a portrait is set`);
  }
  const v = event.venue;
  for (const ph of [v.heroPhoto, v.portalPhoto, v.christmasPhoto, ...v.gallery]) {
    if (!ph.alt) errors.push(`photo ${ph.id}: alt text is required`);
    if (!ph.credit) errors.push(`photo ${ph.id}: credit is required`);
  }
  if (!/^https:\/\/.+\/$/.test(siteUrl())) errors.push('site.url (or SITE_URL) must be https://… and end with /');
  if (errors.length) throw new Error('src/data/event.ts has problems:\n  - ' + errors.join('\n  - '));
}
