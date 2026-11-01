/* ==========================================================================
   TICKETING — the single source of truth for every "Get tickets" button.
   --------------------------------------------------------------------------
   Two states:
     STATE A · LIVE   Every approval below is true, status is 'onSale', and a
                      genuine 2027 Luma event is configured. The site shows
                      "Get tickets" everywhere and opens Luma's official
                      embedded checkout (payment by Stripe, inside Luma).
     STATE B · SOON   Anything else. The site says "Tickets on sale soon",
                      shows no prices, and loads no third-party script.

   This website never collects card details, never confirms payments itself,
   and never shows a price that is not entered below from the Luma event.

   HOW TO GO LIVE (organiser checklist — see TICKETING.md)
     1. Create the 2027 event in Luma (luma.com → Create Event) under the
        Liberland calendar, connect the approved Stripe account, set the
        ticket types, prices, VAT/tax settings and refund policy there.
     2. Copy from Luma → Manage → More → "Embed Registration Button":
          eventUrl  (e.g. https://luma.com/your-slug)
          eventId   (evt-…)
        and for each ticket type (Registration tab → ticket → ⋯ → Copy
        Ticket Type ID) its id (ttyp-…), name and price — exactly as in Luma.
     3. Fill in the seller and the policy links, set each approval to true
        once it has been given in writing, then set status: 'onSale'.
     4. npm run build — the build refuses a half-configured live state.
   ========================================================================== */

import { derive, type TicketType, type TicketingConfig } from './ticketing-logic';
export * from './ticketing-logic';

export const ticketing: TicketingConfig = {
  provider: 'luma',

  /** Current state. Only 'onSale' sells tickets, and only when every approval below is true. */
  status: 'comingSoon',

  /** The verified 2027 event page, e.g. 'https://luma.com/<slug>'. NEVER the 2026 event (luma.com/liberland_anniversary). */
  eventUrl: null,
  /** The 2027 Luma event ID ('evt-…'), from the event's "Embed Registration Button" snippet. */
  eventId: null,
  /** 'embedded' opens Luma's checkout overlay on this page; 'external' sends visitors to the Luma event page. */
  checkoutMode: 'embedded',

  /** Ticket types as configured in Luma. Leave empty to let the Luma checkout present the options (recommended
      if prices may change, so the website never shows stale prices). */
  ticketTypes: [] as TicketType[],

  /** Member tickets: only once the organisers approve 2027 member entitlements. They must be enforced in Luma
      (member-only ticket type with an unlock code or approval) — never by a self-declared checkbox here. */
  memberTicketsApproved: false,

  /** Legal seller / merchant of record, exactly as it should appear to buyers (e.g. "Example Ltd., Hong Kong"). */
  sellerLegalName: null,
  termsUrl: null,
  refundPolicyUrl: null,
  privacyPolicyUrl: null,
  /** Organiser contact shown next to the checkout. */
  contactEmail: 'anniversary@liberland.org',

  /** Written approvals required before real payments. Every one must be true for STATE A. */
  approvals: {
    sellerOfRecord: false, // which legal entity sells the tickets and receives the revenue
    stripeAccount: false, // the Stripe account connected in Luma belongs to that entity
    vatAndInvoicing: false, // Serbian VAT / place-of-supply treatment and invoicing, configured in Luma
    pricesAndCategories: false, // ticket names, prices, currency and inclusions
    refundAndTerms: false, // cancellation/refund conditions and attendance terms (published)
    privacy: false, // privacy notice covering registration data processed by Luma
  },

  /** Copy for STATE B. */
  soon: {
    title: 'Tickets on sale soon',
    text: 'Categories, prices and secure checkout open here once the organisers confirm them.',
  },
};

export const { approved, ticketsLive, ticketsEnded, ticketLabel, validateTicketing } = derive(ticketing);
