/* Derived values used across the page, computed once from src/data/anniversary.ts. */
import { event, programme, gala } from '../data/anniversary';
import { anniversaryIn, parts, range, withWeekday, shortNoDay } from './dates';

export const datesConfirmed = event.dates.status === 'confirmed';
export const dateRange = range(event.dates.start, event.dates.end); // 9–12 April 2027
export const dateRangeShort = range(event.dates.start, event.dates.end, 'short'); // 9–12 Apr 2027
export const foundingLong = (() => { const p = parts(event.founding.date); return `${p.d} ${p.month} ${p.y}`; })();
export const foundingDayMonth = (() => { const p = parts(event.founding.date); return `${p.d} ${p.month}`; })();
export const foundingYear = parts(event.founding.date).y;
export const foundingShort = shortNoDay(event.founding.date);
/** The founding anniversary in the event year (13 April 2027) and its weekday. */
export const anniversaryDay = anniversaryIn(event.year, event.founding.date);
export const anniversaryDayLong = withWeekday(anniversaryDay);
export const venueLine = `${event.venue.name} · ${event.venue.city} · ${event.venue.country}`;
export const addressLine = `${event.venue.street}, ${event.venue.postcode} ${event.venue.city}, ${event.venue.country}`;

export const visibleDays = programme.days.map((d) => ({ ...d, sessions: d.sessions.filter((s) => s.status !== 'cancelled') }));
export const galaDay = withWeekday(gala.date);
export const galaWeekday = parts(gala.date).weekday;

export const mailto = (subject?: string) =>
  `mailto:${event.contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
