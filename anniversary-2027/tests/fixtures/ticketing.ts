/* TEST FIXTURE — State A (tickets live), used only by `npm run test:tickets`.
   Every value is deliberately fake. Vite swaps this in for src/config/ticketing.ts only when
   TICKETING_FIXTURE=1; deployed builds never include it, and prerender refuses to label it production. */
import { derive, type TicketingConfig } from '../../src/config/ticketing-logic';
export * from '../../src/config/ticketing-logic';

export const ticketing: TicketingConfig = {
  provider: 'luma',
  status: 'onSale',
  eventUrl: 'https://luma.com/test-fixture-not-a-real-event',
  eventId: 'evt-TESTFIXTURE0001',
  checkoutMode: 'embedded',
  ticketTypes: [
    { id: 'ttyp-TESTFIXTUREA', name: 'Test ticket A', price: { amount: 100, currency: 'EUR' }, includes: ['Fixture inclusion one', 'Fixture inclusion two'], featured: true },
    { id: 'ttyp-TESTFIXTUREB', name: 'Test ticket B', price: { amount: 250.5, currency: 'EUR' }, includes: ['Fixture inclusion three'], conditions: 'Fixture condition text' },
  ],
  memberTicketsApproved: false,
  sellerLegalName: 'Test Seller (fixture)',
  termsUrl: 'https://example.org/terms',
  refundPolicyUrl: 'https://example.org/refunds',
  privacyPolicyUrl: 'https://example.org/privacy',
  contactEmail: 'anniversary@liberland.org',
  approvals: { sellerOfRecord: true, stripeAccount: true, vatAndInvoicing: true, pricesAndCategories: true, refundAndTerms: true, privacy: true },
  soon: { title: 'Tickets on sale soon', text: 'fixture' },
};

export const { approved, ticketsLive, ticketsEnded, ticketLabel, validateTicketing } = derive(ticketing);
