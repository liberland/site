# Ticketing — Liberland 12th Anniversary 2027

**Status: NOT YET ACTIVATED (State B).** The site says "Tickets on sale soon". It shows no prices, loads no
payment script and sells nothing. The complete Luma checkout integration is built and tested; switching it on is
a configuration change in `src/config/ticketing.ts`, once the items below exist.

Developer handoff with the backend options (Luma only, optional integration service, liberland.org checkout): [BACKEND.md](BACKEND.md).

## What was found (1 Nov 2026)

| Checked | Result |
| --- | --- |
| Luma, official Liberland profile ([luma.com/user/liberland](https://luma.com/user/liberland)) | Only the **2026** event `evt-QVtqQsnF7dmR7HU` ([luma.com/liberland_anniversary](https://luma.com/liberland_anniversary), 10–13 April 2026) and two 2024 events. **No 2027 event exists.** The 2026 event is blocked in code and can never become the 2027 checkout |
| liberlandlimited.com (live) | No 2027 anniversary, no ticket price, no member ticket entitlement. It says membership "does not guarantee access to events" |
| liberland.org | Lists events and links to Luma for registration. Its own payments (citizenship, e-residency, LLD) are not an event-ticketing system this site can plug into |
| This project | Previously only "Registration details coming soon". No provider configured |

## How it works

All ticket buttons use one component (`TicketButton`). In the live state they share one Luma event ID:
- **Desktop:** the navigation and the hero.
- **Ticket section ("Join the Celebration"):** the main button and a button per ticket type.
- **Phones:** the header and a compact sticky bar.
- **Final invitation.**

- **Checkout:** Luma's official embed (`https://embed.lu.ma/checkout-button.js`, `data-luma-action="checkout"`).
  Luma's overlay opens on the page and payment happens inside Luma, by Stripe. Luma sends the confirmation and
  ticket. This site has no form, never sees card data and never confirms payments itself.
- **Ticket-specific buttons:** these pre-select the ticket type with `data-luma-ticket-type="ttyp-…"`, as Luma
  documents. With no ticket types configured, Luma's checkout presents the options, so prices are never duplicated
  or stale.
- **Fallback:** if the Luma script is blocked or fails, every button becomes a link to the same Luma event page,
  and the page says so. A direct "Open the checkout on Luma" link is always shown, because Apple Pay is not
  available inside Luma's embed.
- **Additions on top of Luma's script:** Escape closes the overlay and focus returns to the button. The sticky bar
  hides over the ticket section and the footer.
- **Privacy:** the Luma script is loaded only in the live state, so State B makes no third-party requests.

## To go live — what the organisers must provide

This needs your team. It can't be done from the website alone.

1. **Create the 2027 event in Luma** under the Liberland calendar, with dates, venue (Ark Village, Mirni Dunav 3,
   25260 Apatin, **Serbia**), ticket types, prices and currency, capacity, and refund policy.
2. **Connect the Stripe account** of the legal seller in Luma (Settings → Payments). Enable Luma's **tax / invoice**
   settings as advised by your accountant. *Admission to an event in Serbia can be taxable in Serbia (place of
   supply), and a foreign seller may need Serbian VAT registration or a fiscal representative. Do not set tax to
   zero by default, and do not guess rates.*
3. **Approve in writing:**
   - the seller of record and the entity receiving the revenue
   - the Stripe account
   - VAT and invoicing
   - ticket names, prices and inclusions
   - refund, cancellation and attendance terms
   - the privacy notice for registration data processed by Luma
4. **Publish the policy pages:** terms, refunds and privacy, at https:// URLs.
5. **Member tickets (optional):** decide whether 2027 member entitlements exist. If they do, create a member-only
   ticket type in Luma protected by an unlock code or approval (Luma checks it). Then set
   `memberTicketsApproved: true`. Never use a self-declared discount.
6. **Send these values,** or enter them in `src/config/ticketing.ts`:

   | Field | Where in Luma |
   | --- | --- |
   | `eventUrl` (`https://luma.com/<slug>`) | the event page |
   | `eventId` (`evt-…`) | Manage → More → Embed Registration Button |
   | `ticketTypes[].id` (`ttyp-…`), name, price | Registration tab → ticket → ⋯ → Copy Ticket Type ID |
   | `sellerLegalName`, `termsUrl`, `refundPolicyUrl`, `privacyPolicyUrl` | your approvals |

   Then set each `approvals.*` to `true` and `status: 'onSale'`.
7. **Build.** `npm run build` refuses a live state with any missing approval, link or ID, or with the 2026 event.
   Then run both suites:

   ```bash
   npm test
   ```
   ```bash
   npm run test:tickets
   ```
8. **Test a real purchase** in Luma before announcing. Use Stripe test mode (or a 100% coupon / free test ticket)
   and check:
   - the confirmation e-mail
   - the guest entry in Luma
   - refunds
   - a declined card, using Stripe's test card 4000 0000 0000 0002
   - checkout on an iPhone and an Android phone

   That step needs access to the Luma event and the Stripe account, so it could not be done here.

Other states: `soldOut` and `closed` show the status with a link to the Luma event page (waitlist). `comingSoon` and
`notConfigured` show "Tickets on sale soon".

## Tests

- `npm test` checks State B. There is no widget, no Luma script, no prices and no categories, and every ticket
  button leads to `#tickets`.
- `npm run test:tickets` builds with the **fake fixture** `tests/fixtures/ticketing.ts` (event `evt-TESTFIXTURE0001`,
  "Test ticket A/B", example.org policy links). It loads Luma's real embed script but stubs the checkout iframe, so
  no request reaches a real checkout. It checks:
  - every button opens the same event
  - the overlay opens
  - the ticket type is pre-selected
  - Escape and close work, and focus returns
  - the direct link and blocked-script fallback work
  - the mobile sticky bar behaves correctly
  - the overlay covers the screen on mobile

  Afterwards it rebuilds the normal site. Fixture data can't reach a deployed build: the build marks it, and the CI
  never sets `TICKETING_FIXTURE`.

## Not verified

A real paid checkout (ticket selection inside Luma, Stripe payment, confirmation, payment failure) has **not** been
tested. No 2027 event or authorised payment configuration exists yet.
