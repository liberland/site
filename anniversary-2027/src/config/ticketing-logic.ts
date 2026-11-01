/* Ticketing logic shared by src/config/ticketing.ts (real configuration) and tests/fixtures/ticketing.ts
   (the State A test fixture, used only by `npm run test:tickets`, never in a deployed build). */

export type TicketingStatus = 'notConfigured' | 'comingSoon' | 'onSale' | 'soldOut' | 'closed';

export type TicketType = {
  /** Luma ticket type ID (ttyp-…), from the event's Registration tab → ticket → ⋯ → Copy Ticket Type ID. */
  id: string;
  /** Name exactly as configured in Luma. */
  name: string;
  /** Price exactly as configured in Luma (amount in major units, e.g. 150 for €150). null = free / not shown. */
  price: { amount: number; currency: string } | null;
  /** Organiser-approved inclusions (shown as a short list). */
  includes: string[];
  /** Conditions, e.g. "Members only — Luma asks for your member code at checkout". */
  conditions?: string;
  /** Only set when it is kept in sync with Luma; otherwise leave undefined and let checkout show availability. */
  availability?: string;
  /** Highlight as the principal ticket. */
  featured?: boolean;
};

export type TicketingConfig = {
  provider: 'luma' | 'pretix' | 'external';
  status: TicketingStatus;
  eventUrl: string | null;
  eventId: string | null;
  checkoutMode: 'embedded' | 'external';
  ticketTypes: TicketType[];
  memberTicketsApproved: boolean;
  sellerLegalName: string | null;
  termsUrl: string | null;
  refundPolicyUrl: string | null;
  privacyPolicyUrl: string | null;
  contactEmail: string;
  approvals: Record<'sellerOfRecord' | 'stripeAccount' | 'vatAndInvoicing' | 'pricesAndCategories' | 'refundAndTerms' | 'privacy', boolean>;
  soon: { title: string; text: string };
};

/* ---------- derived ---------- */

/** The 2026 event — must never be used as the 2027 checkout destination. */
export const BLOCKED_EVENTS = { ids: ['evt-QVtqQsnF7dmR7HU'], slugs: ['liberland_anniversary'] };

export function derive(ticketing: TicketingConfig) {
const approved = Object.values(ticketing.approvals).every(Boolean);

/** STATE A: real tickets can be bought. */
const ticketsLive =
  ticketing.status === 'onSale' &&
  approved &&
  ticketing.provider === 'luma' &&
  !!ticketing.eventUrl &&
  !!ticketing.eventId;

/** Sold out / closed, but a real event page exists (waitlist, information). */
const ticketsEnded = (ticketing.status === 'soldOut' || ticketing.status === 'closed') && !!ticketing.eventUrl;

const ticketLabel = ticketsLive ? 'Get tickets' : 'Tickets';

/** Build-time checks (run from vite.config.ts): a live state must be complete, genuine and approved. */
function validateTicketing(): string[] {
  const t = ticketing;
  const e: string[] = [];
  const lumaUrl = /^https:\/\/(luma\.com|lu\.ma)\/[A-Za-z0-9_\-/]+$/;
  if (!['notConfigured', 'comingSoon', 'onSale', 'soldOut', 'closed'].includes(t.status)) e.push('ticketing.status is not a known value');
  if (t.eventId && !/^evt-[A-Za-z0-9]+$/.test(t.eventId)) e.push('ticketing.eventId must look like evt-… (copy it from Luma)');
  if (t.eventUrl && t.provider === 'luma' && !lumaUrl.test(t.eventUrl)) e.push('ticketing.eventUrl must be the https://luma.com/… event page');
  if (t.eventId && BLOCKED_EVENTS.ids.includes(t.eventId)) e.push('ticketing.eventId is the 2026 anniversary event — create a 2027 event in Luma');
  if (t.eventUrl && BLOCKED_EVENTS.slugs.some((s) => t.eventUrl!.replace(/\/$/, '').endsWith('/' + s))) e.push('ticketing.eventUrl is the 2026 anniversary page — use the 2027 event');
  const ids = new Set<string>();
  for (const tt of t.ticketTypes) {
    if (!/^(ttyp|evtticktyp)-[A-Za-z0-9]+$/.test(tt.id)) e.push(`ticket "${tt.name}": id must be the Luma ticket type ID (ttyp-…)`);
    if (ids.has(tt.id)) e.push(`ticket "${tt.name}": duplicate id`);
    ids.add(tt.id);
    if (tt.price && (!(tt.price.amount >= 0) || !/^[A-Z]{3}$/.test(tt.price.currency))) e.push(`ticket "${tt.name}": price needs an amount and a 3-letter currency (EUR)`);
    if (!tt.name) e.push('a ticket type has no name');
  }
  if (t.ticketTypes.length && !t.eventId) e.push('ticket types are listed but ticketing.eventId is empty');
  if (t.status === 'onSale') {
    const missing = Object.entries(t.approvals).filter(([, v]) => !v).map(([k]) => k);
    if (missing.length) e.push(`ticketing.status is 'onSale' but these approvals are not given: ${missing.join(', ')}`);
    for (const [k, v] of [['eventUrl', t.eventUrl], ['eventId', t.eventId], ['sellerLegalName', t.sellerLegalName], ['termsUrl', t.termsUrl], ['refundPolicyUrl', t.refundPolicyUrl], ['privacyPolicyUrl', t.privacyPolicyUrl]] as const)
      if (!v) e.push(`ticketing.status is 'onSale' but ticketing.${k} is empty`);
  }
  for (const [k, v] of [['termsUrl', t.termsUrl], ['refundPolicyUrl', t.refundPolicyUrl], ['privacyPolicyUrl', t.privacyPolicyUrl]] as const)
    if (v && !/^https:\/\//.test(v)) e.push(`ticketing.${k} must start with https://`);
  if (t.ticketTypes.some((x) => /member/i.test(x.name)) && !t.memberTicketsApproved) e.push('a member ticket is listed but memberTicketsApproved is false');
  return e;
}
  return { approved, ticketsLive, ticketsEnded, ticketLabel, validateTicketing };
}

export function formatPrice(p: TicketType['price']) {
  if (!p) return 'Free';
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: p.currency, minimumFractionDigits: p.amount % 1 ? 2 : 0 }).format(p.amount);
}

