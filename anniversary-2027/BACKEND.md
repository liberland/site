# Developer handoff — tickets & backend for the Liberland 12th Anniversary 2027

**Audience:** the Liberland dev team (liberland.org / ll.land) and whoever runs Luma and Stripe.
**Goal:** visitors buy real 2027 tickets safely from https://anniversary.ll.land/, with correct seller, tax and refund
handling, and the organisers can see and check in guests.

The front end is done and lives in this folder: Vite + React + TypeScript, prerendered static HTML. It has no server,
no database and no secrets. Ticket sales are switched off ("Tickets on sale soon") until the work below is done.

---

## 0. TL;DR — what to do

| # | Task | Owner | Needed for |
| --- | --- | --- | --- |
| 1 | Decide the **seller of record**, the **Stripe account**, the **Serbian VAT treatment** and the **refund policy** | Management + accountant | Everything |
| 2 | Create the **2027 event on Luma** (not a copy-paste of the 2026 settings, see §2) | Events team | Option A |
| 3 | Publish **Terms**, **Refund policy** and **Privacy notice** pages (https URLs) | Legal / web | Going live |
| 4 | Send the frontend the values in §4 (event URL, `evt-…`, ticket types `ttyp-…`, seller name, policy URLs) | Events team | Going live |
| 5 | Test a purchase in Stripe **test mode** end-to-end (§7) | Dev + events | Going live |
| 6 | *(Optional)* Build the small integration service in §5 (members, CRM sync, LLD) | Dev team | Later |

**Recommendation:** use **Option A (Luma only, no custom backend)** for 2027 ticket sales. It is what 2026 used,
the website already supports it, and it keeps card data, confirmations, refunds and check-in out of our code. Build
the optional service (§5) only for things Luma cannot do on its own.

---

## 1. What exists today

| Piece | State |
| --- | --- |
| Website (this folder) | Done. Test preview at https://liberlandlimited.com/anniversary/ (`noindex`). Production target is anniversary.ll.land, which still serves the 2026 site on SiteGround and is untouched (see `DEPLOYMENT.md`) |
| Ticket UI | Done. One `TicketButton` component is used in the nav, hero, ticket band, mobile header, mobile sticky bar and final invitation, plus per-ticket "Select" buttons |
| Ticket config | `src/config/ticketing.ts`: provider, status, event URL/ID, ticket types, seller, policy URLs and six approval flags. The build **refuses** a half-configured live state and the 2026 event |
| Checkout | Luma's official embed (`https://embed.lu.ma/checkout-button.js`). It falls back to a direct Luma link if blocked, and a direct link is always shown for Apple Pay. See `TICKETING.md` |
| Tests | `npm test` (160 checks, current "coming soon" state). `npm run test:tickets` (38 checks, live state with a **fake** fixture event and Luma's real script, checkout stubbed) |
| Backend | **None.** Not needed for Option A |

## 2. What the 2026 anniversary did (for reference — do not copy blindly)

From the public Luma event `evt-QVtqQsnF7dmR7HU` (https://luma.com/liberland_anniversary, 10–13 April 2026, Europe/Zagreb):

| Ticket type (2026) | Price | Notes from Luma |
| --- | --- | --- |
| General Admission | €200 | "Full access to all 3 days… Conference Day, Gala Party and all workshops" |
| VIP Admission | €2,499 | GA + "Premium Accommodation in The Ark", exclusive events, VIP Boat Party |
| New Citizen Package | €10,999 | VIP ticket + Liberland citizenship package, capacity 3 |
| Live Stream Access (Online) | €29 | Live stream + recordings |

The 2026 Luma setup also had:
- Card payments via **Stripe** (account `acct_1Nq7XLCJf7N9etoj`). **Confirm which legal entity owns this account.**
- No crypto requirement or option configured.
- **`tax_config: null`.** No tax was configured.
- **`refund_policy: null`.** No refund policy was set.
- Waitlist disabled, and no approval required.
- Three optional questions: LinkedIn profile, "Would you like to present your business?" (Yes / Maybe / No) and a WhatsApp/Signal number.

The 2026 programme, per the press release of 10 Feb 2026:
- **10 Apr:** registration and welcome networking.
- **11 Apr:** opening, the President's address, keynotes, a longevity session, gala dinner and party.
- **12 Apr:** a choice of tour to Liberland, Danube boat trip, or walk in Ark.
- **13 Apr:** house inauguration and a 5 km independence run.
- Also a startup pitch competition.

The tickets were sold via anniversary.ll.land, which linked to Luma.

**Lessons for 2027**
- Set VAT/tax and a refund policy in Luma **before** opening sales.
- Bundles that include accommodation ("Premium Accommodation in The Ark") or citizenship are different products,
  with their own tax and contractual consequences. Keep them separate or have them reviewed.
- Do not reuse the 2026 event. Create a new 2027 event, so attendees, reports and refunds stay separate. The website
  blocks the 2026 ID and slug.
- **Archive the 2026 site before replacing it.** It is on SiteGround (35.214.195.209). A Wayback snapshot exists
  (`web.archive.org/web/20260223001103/https://anniversary.ll.land/`), but take a full file + database export too.
  The snapshot could not be fetched from this environment.

## 3. Option A — Luma only (recommended, zero backend)

### 3.1 Luma setup (Events team)

1. Create the event under the **Liberland Official** Luma calendar:
   - name, 9–12 April 2027 (or the final dates)
   - timezone Europe/Belgrade
   - location **Ark Village, Mirni Dunav 3, 25260 Apatin, Serbia**
2. **Payments:** connect the Stripe account **owned by the approved seller of record**. If it differs from 2026, set
   up a new account under the right entity.
3. **Tax:** configure Luma's tax/VAT settings as advised by the accountant. Admission to an event held in Serbia is
   generally taxed where the event takes place; a foreign seller may need Serbian VAT registration or a fiscal
   representative. *Do not leave tax unset by default, and do not guess a rate.*
4. **Ticket types:** only those approved. For each, set the name, price and currency (EUR), description (the
   inclusions), capacity and sale window.
5. **Refund policy:** fill in Luma's refund policy field and link the published policy page.
6. **Registration questions:** keep them minimal. Every question is personal data, so the privacy notice must
   cover it.
7. **Member tickets** (only if approved): a hidden or member-only ticket type unlocked by a code or by host
   approval. **Never** publish a working member code on the website.
8. **Embed:** Manage → More → *Embed Registration Button*. Copy the event URL and `evt-…` ID. For each ticket type,
   use Registration tab → ticket → ⋯ → *Copy Ticket Type ID* (`ttyp-…`).
9. **Check-in on site:** Luma's check-in (QR codes on the guest tickets). Assign check-in staff in Luma.

### 3.2 Website switch-on (frontend dev, ~15 minutes)

Edit `src/config/ticketing.ts`:

```ts
status: 'onSale',
eventUrl: 'https://luma.com/<2027-slug>',
eventId: 'evt-…',
ticketTypes: [                        // optional; leave [] to let Luma show the options
  { id: 'ttyp-…', name: 'General Admission', price: { amount: 0 /* exact Luma price */, currency: 'EUR' },
    includes: ['…approved inclusions…'], featured: true },
],
sellerLegalName: '<exact legal name>',
termsUrl: 'https://…', refundPolicyUrl: 'https://…', privacyPolicyUrl: 'https://…',
approvals: { sellerOfRecord: true, stripeAccount: true, vatAndInvoicing: true,
             pricesAndCategories: true, refundAndTerms: true, privacy: true },
```

Then build and test:

```bash
cd anniversary-2027 && npm install && npm run build && npm test && npm run test:tickets
```

The build stops with a plain-English error if anything is missing. Deploy as described in `DEPLOYMENT.md`. If the
host sends a CSP, allow `embed.lu.ma` (script and style) and `luma.com` (frame).

Prices on the website are typed in by hand. If prices may change during sales, leave `ticketTypes: []`; the Luma
checkout then always shows the current options and prices.

## 4. Values the frontend needs (fill in and send)

| Field | Example format | Value |
| --- | --- | --- |
| Event URL | `https://luma.com/…` | |
| Event ID | `evt-…` | |
| Ticket types (ID, name, price, inclusions, conditions) | `ttyp-…`, "General Admission", €…, … | |
| Seller legal name (shown to buyers) | "… Ltd., Hong Kong" / "… d.o.o., Serbia" | |
| Terms URL | https | |
| Refund policy URL | https | |
| Privacy notice URL | https | |
| Contact e-mail | anniversary@liberland.org | ✔ |
| Written approvals: seller, Stripe, VAT, prices, refunds/terms, privacy | yes/no + who | |
| Member tickets approved? | yes/no; how members prove it | |

## 5. Option B — optional integration service (only if needed)

Build this only for requirements Luma cannot cover on its own. It is a small serverless service, for example
Cloudflare Workers, Vercel Functions or a liberland.org API route. It holds the secrets; the static site never does.

### 5.1 Possible jobs

1. **Member tickets tied to liberland.org accounts.** A logged-in user in the liberland.org Dashboard
   (`liberland.org/dashboard`, where e-residency/citizenship and merits are shown) requests an anniversary ticket.
   The service checks their status server-side, then issues a **single-use Luma coupon or unlock code** through the
   Luma API (or sends the user a personal code). No self-declared discounts.
2. **CRM / attendee sync.** A Luma webhook (guest registered, cancelled or checked in) goes to the service, which
   updates liberland.org's CRM / dashboard ("You're attending the 12th Anniversary").
3. **LLD or crypto payments** (if leadership wants them), see §6.
4. **Live availability on the site**, if desired. Expose a cached `GET /api/anniversary/tickets` that reads ticket
   types, prices and remaining capacity from the Luma API. The frontend then shows live values instead of
   hand-typed ones. This needs a small frontend change, which the website side will make once the endpoint exists.

### 5.2 Requirements

- Luma API access (an API key on the Luma calendar; check Luma's current plan and API docs) and Luma webhooks.
  **Verify webhook authenticity** with Luma's signature or secret mechanism and reject unsigned calls.
- Store only what is necessary: Luma guest ID, liberland.org user ID and status. Card data never touches our
  systems.
- Idempotent webhook handling (dedupe on event ID) and retries.
- Secrets in the platform's secret store, never in this repository or the static build.
- Logging without personal data. Data retention aligned with the privacy notice (GDPR / Serbian ZZPL).

### 5.3 API contract (if the website should read from it)

```
GET  /api/anniversary/tickets
     → 200 { status: "onSale"|"soldOut"|"closed"|"comingSoon",
             eventUrl, eventId,
             ticketTypes: [{ id, name, price: { amount, currency } | null, available: number | null, includes: [] }] }
     Cache 60 s. CORS: anniversary.ll.land only. No personal data.

POST /api/anniversary/member-code       (authenticated liberland.org session only)
     → 200 { code }  single-use, bound to the user, expires
     → 403 if the user is not eligible
```

## 6. Option C — selling through liberland.org's own payment system

liberland.org already handles payments for e-residency, citizenship and merits through user accounts in the
Dashboard, and runs the Liberland blockchain (LLD / LLM; wallets SubWallet, polkadot{.js}, Talisman). *The exact
processors and rails behind liberland.org's checkout (card processor, PayPal, crypto processor, bank transfer) could
not be verified from outside. The liberland.org team should confirm them.*

Choose this option only if there is a strong reason, such as paying in LLD or one account for everything. It means
building a full ticketing system:

| Must build | Notes |
| --- | --- |
| Products and inventory | ticket types, capacity, sale windows, atomic stock decrement |
| Checkout | **hosted** card checkout only (e.g. Stripe Checkout / Payment Links), so card data never touches our servers. Never a custom card form |
| Order lifecycle | pending → paid → issued → refunded/cancelled. Webhook-driven, idempotent |
| Ticket issuance | unique ticket ID + QR code, e-mail confirmation with an .ics file, resend option |
| Check-in | scanner web app for staff, offline-tolerant, duplicate-scan detection |
| Refunds and cancellations | per the published policy. Partial refunds; reporting |
| Tax and invoices | VAT per accountant. Invoice/receipt numbering, and fiscalisation if required in Serbia |
| Privacy | consent text, data minimisation, retention, data-subject requests |
| Admin | attendee list, exports, comp tickets, audit log |
| **LLD / crypto** (if wanted) | quote the price in EUR, convert at a stated rate with a short expiry, and pay to a **per-order** address or memo. Confirm on-chain after N blocks; handle under- and over-payment and refunds; record the EUR value for accounting |

Frontend integration: set `provider: 'external'` with the liberland.org checkout URL. The website needs a small
change, because `TicketButton` currently treats only Luma as "live". It will be done when the URL exists.

**Rough comparison:** Option A takes days and has the lowest risk. Option B adds 1–2 weeks for a small service.
Option C takes several weeks, and the team owns payments, tax, refunds and check-in.

## 7. Test plan before opening sales

Use **Stripe test mode** (or a free/100%-coupon test ticket on a hidden test event). Never charge real cards while
testing.

1. "Get tickets" (nav, hero, band, sticky bar, final invitation) opens the **2027** event's checkout.
2. Ticket-specific "Select" pre-selects that ticket.
3. Prices and currency on the site equal Luma's, or `ticketTypes` is empty.
4. Quantity selection works, and capacity limits hold.
5. A successful payment (card `4242 4242 4242 4242`) produces the guest in Luma and the confirmation e-mail with
   QR code.
6. A declined card (`4000 0000 0000 0002`) shows an error and creates no ticket.
7. Closing the overlay (×, click outside, Escape) returns to the page.
8. iPhone Safari and Android Chrome work, as does Apple Pay via the direct Luma link.
9. With the Luma script blocked, the buttons open the Luma event page.
10. A refund issued in Luma reaches the buyer and the guest status updates.
11. Tax lines and the invoice/receipt match the accountant's instructions.
12. Run `npm test` and `npm run test:tickets`.

## 8. Decisions needed from leadership

1. Who sells the tickets (legal entity), and which Stripe account receives the money?
2. VAT/fiscal set-up for an event in Serbia (accountant).
3. 2027 ticket types, prices and inclusions. Accommodation and citizenship bundles: yes or no, and reviewed?
4. Refund/cancellation policy and attendance terms.
5. Member entitlements for 2027 (liberland.org citizens / e-residents / Liberland Limited members)? If yes, how is
   eligibility checked?
6. LLD/crypto payments: needed for 2027, or card-only via Luma?
7. Final dates (the site says provisional until then), and when to replace the 2026 site on anniversary.ll.land.

## 9. Contacts and files

- Website code: `anniversary-2027/` in `liberland/site`.
  - `README.md`: content editing.
  - `TICKETING.md`: ticketing details.
  - `DEPLOYMENT.md`: hosting and CSP.
  - `ASSETS.md`: photo rights.
- Event e-mail: anniversary@liberland.org. Press: press@liberland.org.
