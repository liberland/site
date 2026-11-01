/* Date formatting from ISO strings. Uses UTC so the weekday never depends on the visitor's time zone. */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function parts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return { y, m, d, weekday: DAYS[dt.getUTCDay()], month: MONTHS[m - 1] };
}

/** "13 April 2015" */
export const long = (iso: string) => { const p = parts(iso); return `${p.d} ${p.month} ${p.y}`; };
/** "Saturday 10 April 2027" */
export const withWeekday = (iso: string) => { const p = parts(iso); return `${p.weekday} ${p.d} ${p.month} ${p.y}`; };
/** "Sat 10 Apr 2027" */
export const short = (iso: string) => { const p = parts(iso); return `${p.weekday.slice(0, 3)} ${p.d} ${p.month.slice(0, 3)} ${p.y}`; };
/** "13 Apr 2015" */
export const shortNoDay = (iso: string) => { const p = parts(iso); return `${p.d} ${p.month.slice(0, 3)} ${p.y}`; };
/** "13 · IV · 2015" (medallion) */
export const roman = (iso: string) => {
  const R = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const p = parts(iso); return `${p.d} · ${R[p.m - 1]} · ${p.y}`;
};
/** Two-digit day number: "09" */
export const dayNum = (iso: string) => String(parts(iso).d).padStart(2, '0');

/** "9–12 April 2027" (also handles ranges across months/years). */
export function range(start: string, end: string, monthStyle: 'long' | 'short' = 'long') {
  const a = parts(start), b = parts(end);
  const mo = (p: ReturnType<typeof parts>) => (monthStyle === 'long' ? p.month : p.month.slice(0, 3));
  if (a.y === b.y && a.m === b.m) return a.d === b.d ? `${a.d} ${mo(a)} ${a.y}` : `${a.d}–${b.d} ${mo(a)} ${a.y}`;
  if (a.y === b.y) return `${a.d} ${mo(a)} – ${b.d} ${mo(b)} ${a.y}`;
  return `${a.d} ${mo(a)} ${a.y} – ${b.d} ${mo(b)} ${b.y}`;
}

/** Same calendar day and month as the founding, in the event year. */
export function anniversaryIn(year: number, foundingIso: string) {
  const p = parts(foundingIso);
  return `${year}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}

/** Roman numerals for years (MMXV). */
export function toRoman(n: number) {
  const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let s = '';
  for (const [v, r] of map) while (n >= v) { s += r; n -= v; }
  return s;
}
