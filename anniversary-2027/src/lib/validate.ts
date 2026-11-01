/* Build-time checks on src/data/anniversary.ts, so organisers get a clear message instead of a broken page.
   Runs from vite.config.ts (Node), never in the browser. */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { event, faq, gala, people, photos, programme, registration, site, tiers, type Photo } from '../data/anniversary';

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export function validate(root: string) {
  const e: string[] = [];
  const d = event.dates;
  for (const [k, v] of [['event.founding.date', event.founding.date], ['event.dates.start', d.start], ['event.dates.end', d.end], ['gala.date', gala.date]] as const)
    if (!ISO.test(v) || Number.isNaN(Date.parse(v))) e.push(`${k} must be a real date like 2027-04-09 (got "${v}")`);
  if (d.end < d.start) e.push('event.dates.end is before event.dates.start');
  if (!['provisional', 'confirmed'].includes(d.status)) e.push("event.dates.status must be 'provisional' or 'confirmed'");
  if (event.founding.date !== '2015-04-13') e.push('event.founding.date is the historical founding (2015-04-13); do not change it');

  const dayDates = programme.days.map((x) => x.date);
  programme.days.forEach((day, i) => {
    if (!ISO.test(day.date)) e.push(`programme day ${i + 1}: date must look like 2027-04-09`);
    else if (day.date < d.start || day.date > d.end) e.push(`programme day ${i + 1} (${day.date}) is outside the event dates ${d.start} – ${d.end}`);
    day.sessions.forEach((s, j) => {
      const where = `programme day ${i + 1}, session ${j + 1} ("${s.title}")`;
      if (!['proposed', 'confirmed', 'cancelled'].includes(s.status)) e.push(`${where}: status must be 'proposed', 'confirmed' or 'cancelled'`);
      for (const t of [s.start, s.end]) if (t !== null && !TIME.test(t)) e.push(`${where}: times must look like 09:30 or be null`);
      if (s.end && !s.start) e.push(`${where}: an end time needs a start time`);
      for (const id of s.speakerIds) {
        const p = people.find((x) => x.id === id);
        if (!p) e.push(`${where}: speaker id ${id} is not in people`);
        else if (p.status !== 'speaker') e.push(`${where}: ${p.name} is listed as a speaker but their status is '${p.status}', not 'speaker'`);
      }
    });
  });
  if (programme.initialDay < 0 || programme.initialDay >= programme.days.length) e.push('programme.initialDay must point at one of the days (0 = first)');
  if (!dayDates.includes(gala.date)) e.push(`gala.date (${gala.date}) is not one of the programme days`);

  const ids = new Set<string>();
  for (const p of people) {
    if (ids.has(p.id)) e.push(`people: duplicate id ${p.id}`);
    ids.add(p.id);
    if (!['speaker', 'guest', 'featured', 'pending'].includes(p.status)) e.push(`${p.name}: status must be 'speaker', 'guest', 'featured' or 'pending'`);
  }

  const r = registration;
  if (!['coming-soon', 'open', 'closed'].includes(r.status)) e.push("registration.status must be 'coming-soon', 'open' or 'closed'");
  if (r.status === 'open' && !r.url) e.push("registration.status is 'open' but registration.url is empty");
  if (r.url && !/^https:\/\//.test(r.url)) e.push('registration.url must start with https://');
  for (const t of tiers) {
    if (t.status === 'open' && !t.url && !r.url) e.push(`tier "${t.name}" is open but has no url (and registration.url is empty)`);
    if (t.url && !/^https:\/\//.test(t.url)) e.push(`tier "${t.name}": url must start with https://`);
  }

  const allPhotos: Photo[] = [...Object.values(photos), ...people.map((p) => p.portrait)];
  for (const ph of allPhotos) {
    if (!ph.alt) e.push(`photo ${ph.id}: alt text is required`);
    if (ph.cleared) {
      if (!ph.file) e.push(`photo ${ph.id}: cleared but no file is set`);
      else for (const w of ph.widths ?? [ph.width ?? 1600]) {
        const f = resolve(root, 'public/images', `${ph.file}-${w}.webp`);
        if (!existsSync(f)) e.push(`photo ${ph.id}: cleared, but public/images/${ph.file}-${w}.webp is missing (run: python3 scripts/photos.py --publish ${ph.file})`);
      }
      if (!ph.credit) e.push(`photo ${ph.id}: a credit is required for published photographs`);
    }
  }
  if (!faq.length) e.push('faq is empty');
  if (!/^https:\/\/.+\/$/.test(site.url)) e.push('site.url must be https://… and end with /');
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(event.contact.email)) e.push('event.contact.email does not look like an email address');

  if (e.length) throw new Error('src/data/anniversary.ts has problems:\n  - ' + e.join('\n  - '));
}
