// State A (tickets live) checks — run with `npm run test:tickets`, which builds with the FAKE fixture
// (tests/fixtures/ticketing.ts), runs this file, then rebuilds the normal site.
//
// The real Luma embed script (https://embed.lu.ma/checkout-button.js) is loaded from Luma. Only the checkout
// iframe for the fake event is answered by a local stub, so no request ever reaches a real Luma checkout and
// no payment is attempted. A real purchase can only be tested once a genuine 2027 event exists (see TICKETING.md).
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { preview } from 'vite';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); console.log(`${ok ? '  ok ' : 'FAIL '} ${msg}`); };

const html = await readFile('dist/index.html', 'utf8');
if (!html.includes('ticketing-fixture')) {
  console.error('dist/ is not a fixture build — run `npm run test:tickets`, not this file directly.');
  process.exit(1);
}

const EVT = 'evt-TESTFIXTURE0001';
const URL_ = 'https://luma.com/test-fixture-not-a-real-event';
const PORT = 4187;
const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' });
const url = `http://localhost:${PORT}/`;
const browser = await chromium.launch();

/** Stub only the checkout iframe of the fake event; let Luma's real script and stylesheet load. */
async function stubCheckout(ctx) {
  const opened = [];
  await ctx.route('https://luma.com/embed/event/**', (r) => {
    opened.push(r.request().url());
    r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>stub</title><h1>Luma checkout stub (test)</h1>' });
  });
  await ctx.route(`${URL_}**`, (r) => r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Luma event stub</title>' }));
  return opened;
}

try {
  /* ---------- desktop: buttons, ticket rows, overlay ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const opened = await stubCheckout(ctx);
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForFunction(() => !!window.luma?.initCheckout, null, { timeout: 15000 });
    check((await p.locator('script#luma-checkout[src="https://embed.lu.ma/checkout-button.js"]').count()) === 1, 'official Luma script loaded once, with id="luma-checkout"');

    const ids = await p.$$eval('[data-luma-action="checkout"]', (as) => [...new Set(as.map((a) => a.dataset.lumaEventId))]);
    check(ids.length === 1 && ids[0] === EVT, `every checkout button opens the same event (${ids.join(', ')})`);
    const hrefs = await p.$$eval('[data-luma-action="checkout"]', (as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
    check(hrefs.length === 1 && hrefs[0] === URL_, 'every checkout button falls back to the same Luma event page');
    check(await p.locator('.nav .nav-tix', { hasText: 'Get tickets' }).isVisible(), 'navigation shows Get tickets');
    check(await p.locator('.hero .btn', { hasText: 'Get tickets' }).isVisible(), 'hero shows Get tickets as the primary CTA');
    check(await p.locator('#register .btn', { hasText: 'Get tickets' }).isVisible(), 'final invitation repeats Get tickets');
    const rows = await p.locator('.tix-row').allInnerTexts();
    check(rows.length === 2 && /Test ticket A/.test(rows[0]) && /€100/.test(rows[0]) && /€250\.50/.test(rows[1]), 'configured ticket types and prices are shown exactly');
    check((await p.locator('.invite-legal').innerText()).includes('Test Seller (fixture)'), 'the legal seller is named next to checkout');
    for (const l of ['Terms & conditions', 'Refund & cancellation policy', 'Privacy policy'])
      check((await p.locator('.invite-foot a', { hasText: l }).count()) === 1, `${l} link shown`);
    check((await p.locator(`a[href="${URL_}"][target=_blank]`, { hasText: 'Open the checkout on Luma' }).count()) === 1, 'direct Luma link (Apple Pay / full page) is offered');
    check((await p.locator('form, input').count()) === 0, 'the site itself has no form or card field');

    // Main CTA → Luma overlay
    const main = p.locator('.invite-cta .btn', { hasText: 'Get tickets' });
    await main.click();
    const overlay = p.locator('.luma-checkout--overlay');
    await overlay.waitFor({ timeout: 5000 });
    const src = await overlay.locator('iframe').getAttribute('src');
    check(src.startsWith(`https://luma.com/embed/event/${EVT}/simple`) && src.includes('utm_source=anniversary-site'), `Get tickets opens Luma's checkout overlay for the event (${src})`);
    check(/payment/.test(await overlay.locator('iframe').getAttribute('allow')), 'the checkout iframe is allowed to use the Payment Request API');
    check(p.url() === url, 'the visitor stays on the anniversary page while checking out');
    await p.keyboard.press('Escape');
    check((await overlay.count()) === 0, 'Escape closes the checkout overlay');
    check((await p.evaluate(() => document.activeElement?.textContent)).includes('Get tickets'), 'focus returns to the button after closing');

    // Ticket-specific button → ticket type pre-selected
    await p.locator('.tix-row', { hasText: 'Test ticket B' }).locator('a', { hasText: 'Select' }).click();
    await overlay.waitFor();
    const src2 = await overlay.locator('iframe').getAttribute('src');
    check(src2.includes('tt=ttyp-TESTFIXTUREB'), `ticket-specific button pre-selects its ticket type (${src2})`);
    await p.locator('.luma-checkout--close-btn').click();
    check((await overlay.count()) === 0, 'the close button closes the overlay');

    // Nav button opens the same checkout
    await p.locator('.nav .nav-tix').click();
    await overlay.waitFor();
    check((await overlay.locator('iframe').getAttribute('src')).includes(EVT), 'navigation Get tickets opens the same checkout');
    await p.keyboard.press('Escape');
    check(opened.length === 3 && opened.every((u) => u.includes(EVT)), 'only the fake event checkout was requested (stubbed — no real Luma checkout)');
    check(errors.length === 0, `no page errors (${errors.join(' | ')})`);
    await ctx.close();
  }

  /* ---------- fallback when Luma's script is blocked ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await stubCheckout(ctx);
    await ctx.route('https://embed.lu.ma/**', (r) => r.abort());
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.locator('.invite-note[role=status]').waitFor({ timeout: 12000 });
    check(true, 'blocked script: the page explains that checkout opens on Luma instead');
    const btn = p.locator('.invite-cta .btn', { hasText: 'Get tickets' });
    check((await btn.getAttribute('href')) === URL_ && (await btn.getAttribute('target')) === '_blank', 'blocked script: Get tickets becomes a direct link to the Luma event');
    const [popup] = await Promise.all([p.waitForEvent('popup'), btn.click()]);
    await popup.waitForLoadState();
    check(popup.url().startsWith(URL_), 'blocked script: clicking opens the Luma event page — no dead end');
    await ctx.close();
  }

  /* ---------- mobile ---------- */
  {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const opened = await stubCheckout(ctx);
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.waitForFunction(() => !!window.luma?.initCheckout, null, { timeout: 15000 });
    check(await p.locator('.nav .nav-tix-m', { hasText: 'Get tickets' }).isVisible(), 'mobile header shows Get tickets next to Menu');
    const heroBtn = await p.locator('.hero .btn', { hasText: 'Get tickets' }).boundingBox();
    check(heroBtn && heroBtn.y + heroBtn.height < 740 * 1.6, `mobile: hero Get tickets within ~1.5 screens (${heroBtn && Math.round(heroBtn.y)}px)`);
    const bar = p.locator('.sticky-tix');
    check(!(await bar.evaluate((e) => e.classList.contains('on'))), 'sticky bar hidden while the hero is on screen');
    await p.locator('#programme').scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    check(await bar.evaluate((e) => e.classList.contains('on')), 'sticky bar appears in the programme');
    const box = await bar.boundingBox();
    check(box && box.y + box.height <= 740 && box.height <= 72, `sticky bar is compact and on screen (${box && Math.round(box.height)}px)`);
    await p.locator('#tickets').scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    check(!(await bar.evaluate((e) => e.classList.contains('on'))), 'sticky bar hides over the ticket section');
    await p.locator('.foot').scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    check(!(await bar.evaluate((e) => e.classList.contains('on'))), 'sticky bar hides over the footer');
    check((await bar.getAttribute('inert')) !== null, 'hidden sticky bar is not focusable');
    await p.locator('#programme').scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    await bar.locator('a').click();
    const overlay = p.locator('.luma-checkout--overlay');
    await overlay.waitFor();
    const ob = await overlay.boundingBox();
    check(ob && ob.width >= 370 && ob.height >= 700, `mobile: checkout overlay covers the screen (${ob && Math.round(ob.width)}×${ob && Math.round(ob.height)})`);
    check(opened.at(-1).includes(EVT), 'mobile: sticky bar opens the same checkout');
    await p.locator('.luma-checkout--close-btn').click();
    check((await overlay.count()) === 0, 'mobile: closing returns to the page');
    const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(over <= 0, 'mobile: no horizontal overflow');
    await p.locator('#tickets').scrollIntoViewIfNeeded();
    await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
    await p.locator('#tickets').screenshot({ path: 'tests/screenshots/tickets-live-375.png' }).catch(() => {});
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await stubCheckout(ctx);
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
    await p.locator('#tickets').screenshot({ path: 'tests/screenshots/tickets-live-1440.png' }).catch(() => {});
    await ctx.close();
  }
} finally {
  await browser.close();
  server.httpServer.close();
}
console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nall ticket checks passed');
process.exit(failures.length ? 1 : 0);
