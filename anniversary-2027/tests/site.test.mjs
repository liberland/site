// End-to-end checks against the production build (run `npm run build` first).
// Uses Playwright with Chromium (`require('playwright')`; install with `npm i -D playwright && npx playwright install chromium`
// if the machine does not already have it).
//
//   npm test                 → checks only
//   npm test -- --shots      → also writes full-page screenshots (375, 768, 1440) to tests/screenshots/
import { createRequire } from 'node:module';
import { mkdir, access } from 'node:fs/promises';
import { preview } from 'vite';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const WIDTHS = [320, 375, 390, 768, 1024, 1100, 1101, 1280, 1440, 1920, 2560];
const SHOTS = process.argv.includes('--shots');
const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? '  ok ' : 'FAIL '} ${msg}`);
};

const PORT = 4183;
const server = await preview({ preview: { port: PORT, strictPort: true }, logLevel: 'silent' });
const url = `http://localhost:${PORT}/`;
const browser = await chromium.launch();

/** Scroll through the page so lazy images and scroll reveals settle. */
async function scrollThrough(p) {
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(25);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForLoadState('networkidle');
}

try {
  /* ---------- production build never ships uncleared photographs ---------- */
  check(await access('dist/_reference').then(() => false, () => true), 'dist/ contains no _reference folder');

  /* ---------- no-JS: the prerendered HTML carries the content ---------- */
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(url);
    check((await p.locator('h1').count()) === 1, 'prerendered HTML has exactly one h1 without JavaScript');
    const t = await p.locator('body').textContent();
    check(t.includes('9–12 April 2027') && t.includes('Mirni Dunav 3'), 'dates and venue are in the static HTML');
    check((await p.locator('h2').count()) === 10, 'all ten section headings are in the static HTML');
    await ctx.close();
  }

  /* ---------- metadata, structured data, network ---------- */
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  const bad = [];
  const requested = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));
  page.on('request', (r) => requested.push(r.url()));
  await page.goto(url, { waitUntil: 'networkidle' });
  await scrollThrough(page);

  check((await page.title()) === 'Liberland 12th Anniversary · 9–12 April 2027 · Ark Village, Apatin', `title (${await page.title()})`);
  for (const sel of ['meta[name=description]', 'meta[property="og:image"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:card"]', 'link[rel=canonical]', 'link[rel=icon]'])
    check((await page.locator(sel).count()) === 1, `head has ${sel}`);
  check((await page.locator('link[rel=canonical]').getAttribute('href')) === 'https://anniversary.ll.land/', 'canonical is https://anniversary.ll.land/');
  const robots = await page.locator('meta[name=robots]').getAttribute('content');
  check(robots === 'noindex, nofollow', `pre-launch build is noindex (robots="${robots}")`);
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t));
  const wp = ld.find((x) => x['@type'] === 'WebPage');
  check(wp?.about?.address?.addressCountry === 'RS' && wp?.about?.address?.addressLocality === 'Apatin', 'structured data places Ark Village in Apatin, Serbia (RS)');
  check(!ld.some((x) => x['@type'] === 'Event'), 'no schema.org/Event while the dates are provisional');
  check(!/"(price|offers|performer|lowPrice|availability)"/.test(JSON.stringify(ld)), 'structured data invents no prices, offers or performers');
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  const ogRes = await page.request.get(new URL(new URL(og).pathname, url).href);
  check(ogRes.ok() && (ogRes.headers()['content-type'] ?? '').startsWith('image/'), 'social preview image exists');

  check(errors.length === 0, `no console errors (${errors.join(' | ')})`);
  check(bad.length === 0, `no failed requests (${bad.join(', ')})`);
  const third = requested.filter((r) => !r.startsWith(url) && !r.startsWith('data:'));
  check(third.length === 0, `no third-party requests (${third.slice(0, 3).join(', ')})`);

  /* ---------- structure & accessibility ---------- */
  check((await page.locator('h1').count()) === 1, 'exactly one h1');
  const levels = await page.$$eval('h1,h2,h3,h4,h5,h6', (hs) => hs.filter((h) => h.offsetParent !== null || h.closest('[hidden]') === null).map((h) => +h.tagName[1]));
  check(levels.every((l, i) => i === 0 || l <= levels[i - 1] + 1), 'no skipped heading levels');
  const sectionsLabelled = await page.$$eval('main section', (s) => s.every((x) => {
    const id = x.getAttribute('aria-labelledby');
    return id && document.getElementById(id);
  }));
  check(sectionsLabelled, 'every section is labelled by its heading');
  const anchors = await page.$$eval('a[href^="#"]', (as) => as.map((a) => a.getAttribute('href')).filter((h) => h.length > 1 && !document.getElementById(h.slice(1))));
  check(anchors.length === 0, `every in-page link has a target (${anchors.join(', ')})`);
  for (const id of ['about', 'tickets', 'experience', 'programme', 'faces', 'ark', 'gala', 'story', 'visit', 'register'])
    check((await page.locator(`#${id}`).count()) === 1, `section #${id} exists`);
  const imgs = await page.$$eval('img', (is) => is.map((i) => ({ src: i.currentSrc || i.src, alt: i.getAttribute('alt'), ok: i.complete && i.naturalWidth > 0 })));
  check(imgs.every((i) => i.alt !== null), 'every image has an alt attribute');
  check(imgs.every((i) => i.ok), `every image loads (${imgs.filter((i) => !i.ok).map((i) => i.src).join(', ')})`);
  const ext = await page.$$eval('a[target=_blank]', (as) => as.filter((a) => !/noopener/.test(a.rel)).length);
  check(ext === 0, 'external links use rel=noopener');
  check((await page.locator('form, input, select, textarea').count()) === 0, 'no forms or personal-data fields');

  /* ---------- content integrity ---------- */
  const text = await page.locator('body').innerText();
  check(text.includes('13 April 2015'), 'historical founding date 13 April 2015 shown');
  check(/9–12 April 2027/i.test(text), 'event dates 9–12 April 2027 shown'); // innerText applies text-transform
  check(text.includes('Tuesday 13 April 2027'), 'founding anniversary day computed as Tuesday 13 April 2027');
  check(!/Founded 12 April|proclaimed on 12 April|12 April 2015/i.test(text), 'no claim that the founding was on 12 April');
  check(text.includes('Provisional dates — subject to confirmation'), 'dates are marked provisional in the hero');
  check(text.includes('Mirni Dunav 3, 25260 Apatin, Serbia'), 'venue address correct');
  check((await page.locator('a[href="mailto:anniversary@liberland.org"]').count()) > 0, 'contact e-mail link present');
  check((await page.locator('a[href="https://ark.ll.land/"]').count()) >= 2, 'Ark Village links to ark.ll.land');
  // Ticketing, State B (not activated): no checkout, no prices, no third-party script, every CTA leads to #tickets.
  check(text.includes('Tickets on sale soon'), 'ticket section says "Tickets on sale soon"');
  check(text.includes('Join the Celebration') && text.includes('Celebrate twelve years of Liberland at Ark Village on the Danube.'), 'ticket section headline and subheading');
  check((await page.locator('[data-luma-action], script[src*="lu.ma"], script[src*="luma.com"]').count()) === 0, 'no checkout widget or Luma script while ticketing is not activated');
  check((await page.locator('.nav .nav-tix').getAttribute('href')) === '#tickets', 'navigation ticket button leads to the ticket section');
  check((await page.locator('a[href*="luma.com"], a[href*="lu.ma"]').count()) === 0, 'no link to the 2026 (or any) Luma event');
  check((await page.locator('#tickets .tix-row').count()) === 0, 'no ticket categories shown before they are configured');
  check(!/[€$£]\s?\d|\d\s?(EUR|USD|RSD)\b/.test(text), 'no ticket prices');
  check(!/sold out|only \d+ (left|seats)|hurry|limited (seats|places)/i.test(text), 'no scarcity or countdown messaging');
  const personText = await page.locator('.person').allInnerTexts();
  check(personText.length === 3 && personText.every((t) => /featured community figure/i.test(t)), 'the three people are shown as featured community figures');
  check(!personText.some((t) => /confirmed (speaker|guest)/i.test(t)), 'nobody is shown as a confirmed speaker or guest');
  check((await page.locator('.person-ph img').count()) === 3, 'all three people have real portraits');
  for (const n of ['Vít Jedlička', 'Balázs Magyar', 'Jan Schlüter']) check(text.includes(n), `${n} listed`);
  check(text.includes('Attending at Ark Village does not involve entering Liberland'), 'venue/Gornja Siga distinction stated');
  check(/not been recognised as a state by any UN member state/.test(text), 'no implied recognition (timeline source note)');

  /* ---------- programme tabs ---------- */
  const tabs = page.locator('[role=tab]');
  check((await tabs.count()) === 4, 'programme has four day tabs');
  check((await page.locator('[role=tab][aria-selected=true]').textContent()).includes('Conference & gala'), 'Saturday is selected initially');
  for (let i = 0; i < 4; i++) {
    await tabs.nth(i).click();
    const items = page.locator('#day-panel .sessions li');
    const n = await items.count();
    const tbc = await page.locator('#day-panel .s-time', { hasText: 'Time TBC' }).count();
    const prov = await page.locator('#day-panel .pill-prov', { hasText: 'Provisional' }).count();
    check(n > 0 && tbc === n && prov === n, `day ${i + 1}: every session shows Time TBC and Provisional`);
  }
  await tabs.nth(0).click();
  await page.keyboard.press('ArrowRight');
  check((await page.evaluate(() => document.activeElement?.id)) === 'day-tab-1' && (await tabs.nth(1).getAttribute('aria-selected')) === 'true', 'ArrowRight moves to the next day');
  await page.keyboard.press('End');
  check((await tabs.nth(3).getAttribute('aria-selected')) === 'true', 'End selects the last day');
  await page.keyboard.press('Home');
  check((await tabs.nth(0).getAttribute('aria-selected')) === 'true', 'Home selects the first day');
  check((await page.$$eval('[role=tab]', (t) => t.filter((x) => x.tabIndex === 0).length)) === 1, 'roving tabindex: one tab in the tab order');
  check((await page.locator('#day-panel').getAttribute('aria-labelledby')) === 'day-tab-0', 'panel is labelled by the selected tab');

  /* ---------- people ---------- */
  check((await page.locator('.chip').count()) === 0, 'no filter chips while every person has the same status');

  /* ---------- zero-placeholder audit ---------- */
  const visible = await page.locator('body').innerText();
  const banned = /IMG-\d\d|\bP-0\d\b|photograph pending|image required|photo coming soon|illustrative fallback|replace image|placeholder|lorem ipsum|unsplash|reference image|not cleared/i;
  check(!banned.test(visible), `no placeholder or development wording visible (${(visible.match(banned) || [])[0] ?? ''})`);
  check((await page.locator('.ph-in, .ph:not(:has(img)), .face-tba, .ref-tag').count()) === 0, 'no empty photo frames, placeholder panels or reference tags');
  const srcs = await page.$$eval('img', (is) => is.map((i) => i.getAttribute('src') || ''));
  check(srcs.every((x) => x.length > 0), 'no image without a source');
  const stems = (await page.$$eval('main img[srcset]', (is) => is.map((i) => i.currentSrc || i.src))).map((u) => u.replace(/-\d+\.webp$/, ''));
  check(stems.length >= 18, `the page shows at least 18 real photographs (${stems.length})`);
  check(new Set(stems).size === stems.length, 'no photograph is used twice');
  const caps = await page.$$eval('figure figcaption', (f) => f.map((x) => x.textContent.trim()));
  check(caps.every((c) => c.length > 0) && caps.length >= 15, `every captioned photo has a caption (${caps.length})`);

  /* ---------- FAQ ---------- */
  const q = page.locator('.faq-q');
  check((await q.first().getAttribute('aria-expanded')) === 'true', 'first FAQ open initially');
  await q.nth(2).click();
  check((await q.nth(2).getAttribute('aria-expanded')) === 'true' && (await q.first().getAttribute('aria-expanded')) === 'false', 'FAQ opens one answer at a time');
  check(await page.locator('#faq-a-2').isVisible(), 'FAQ answer is visible when expanded');
  await q.nth(2).focus();
  await page.keyboard.press('Enter');
  check((await q.nth(2).getAttribute('aria-expanded')) === 'false', 'FAQ toggles from the keyboard');

  /* ---------- skip link ---------- */
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  check((await page.evaluate(() => document.activeElement?.className)) === 'skip', 'first Tab reaches the skip link');
  await page.keyboard.press('Tab');
  const ring = await page.evaluate(() => {
    const s = getComputedStyle(document.activeElement);
    return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`;
  });
  check(ring === 'solid 2px rgb(201, 163, 74)', `keyboard focus shows the 2px gold ring (${ring})`);
  await page.close();

  /* ---------- layout at every width ---------- */
  for (const w of WIDTHS) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(url, { waitUntil: 'networkidle' });
    await scrollThrough(p);
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `${w}px: no horizontal overflow (${overflow}px)`);
    if (w === 1440) {
      const hero = await p.evaluate(() => ({ fs: parseFloat(getComputedStyle(document.querySelector('.h1-a')).fontSize), bottom: document.querySelector('.hero').getBoundingClientRect().bottom }));
      check(hero.fs <= 64, `1440px: hero headline is at most 64px (${hero.fs}px)`);
      check(hero.bottom <= 900 * 0.85, `1440px: hero incl. navigation fits within 85% of a 900px viewport (${Math.round(hero.bottom)}px)`);
    }
    if (w === 375) {
      const fs = await p.$eval('.h1-a', (e) => parseFloat(getComputedStyle(e).fontSize));
      check(fs >= 34 && fs <= 42, `375px: hero headline 34–42px (${fs}px)`);
    }
    const h1 = await p.$eval('.h1-a', (e) => e.getBoundingClientRect().right <= window.innerWidth);
    check(h1, `${w}px: hero title fits`);
    const small = await p.$$eval('a.btn, button, .nav-links a, .menu-btn', (els) =>
      els.filter((e) => e.offsetParent !== null && !e.closest('.skip')).map((e) => ({ t: e.textContent.trim().slice(0, 20), h: e.getBoundingClientRect().height })).filter((x) => x.h < 36));
    check(small.length === 0, `${w}px: controls are at least 36px tall (${JSON.stringify(small.slice(0, 3))})`);
    if (w <= 1100) {
      const btn = p.locator('.menu-btn');
      check(await btn.isVisible(), `${w}px: menu button visible`);
      await btn.click();
      check((await btn.getAttribute('aria-expanded')) === 'true' && (await p.locator('#mnav').isVisible()), `${w}px: menu opens`);
      await p.keyboard.press('Escape');
      check((await btn.getAttribute('aria-expanded')) === 'false' && !(await p.locator('#mnav').isVisible()), `${w}px: Escape closes the menu`);
      check((await p.evaluate(() => document.activeElement?.className)) === 'menu-btn', `${w}px: focus returns to the menu button`);
      await btn.click();
      await p.locator('#mnav a', { hasText: 'Programme' }).click();
      check(!(await p.locator('#mnav').isVisible()), `${w}px: choosing a link closes the menu`);
    } else {
      check(await p.locator('.nav-links').isVisible(), `${w}px: inline navigation visible`);
    }
    if (SHOTS && [375, 768, 1440].includes(w)) {
      await mkdir('tests/screenshots', { recursive: true });
      await p.evaluate(() => window.scrollTo(0, 0));
      await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
      await p.screenshot({ path: `tests/screenshots/${w}.png`, fullPage: true });
    }
    await p.close();
  }

  /* ---------- reduced motion ---------- */
  {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'networkidle' });
    const anim = await p.$$eval('.seal-rot, .rv', (els) => els.map((e) => getComputedStyle(e).animationName));
    check(anim.every((a) => a === 'none'), 'reduced motion stops every animation');
    const op = await p.$$eval('.rv', (els) => els.every((e) => getComputedStyle(e).opacity === '1'));
    check(op, 'reduced motion: all content visible without reveals');
    await ctx.close();
  }
} finally {
  await browser.close();
  server.httpServer.close();
}

console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nall checks passed');
process.exit(failures.length ? 1 : 0);
