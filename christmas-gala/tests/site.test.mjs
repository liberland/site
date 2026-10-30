// End-to-end checks against the production build (run `npm run build` first).
// Uses Playwright with Chromium. Install once with `npm i -D playwright && npx playwright install chromium`
// if it is not already available on the machine.
//
//   npm test                 → checks only
//   npm test -- --shots      → also writes full-page screenshots to tests/screenshots/
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { preview } from 'vite';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const WIDTHS = [320, 375, 390, 768, 1024, 1440, 1920, 2560];
const SHOTS = process.argv.includes('--shots');
const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? '  ok ' : 'FAIL '} ${msg}`);
};

const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: 'silent' });
const url = 'http://localhost:4179/christmas/';
const browser = await chromium.launch();

try {
  /* ---------- no-JS: the prerendered HTML carries the content ---------- */
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(url);
    check((await p.locator('h1').count()) === 1, 'prerendered HTML has exactly one h1 without JavaScript');
    check(await p.getByText('Proposed · not yet confirmed').first().isVisible(), 'proposed-date marker is in the static HTML');
    await ctx.close();
  }

  /* ---------- metadata & integrity ---------- */
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  const bad = [];
  page.on('response', (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));
  await page.goto(url, { waitUntil: 'networkidle' });

  check(/Liberland Grand Christmas Gala 2026/.test(await page.title()), 'title names the event');
  for (const sel of ['meta[name=description]', 'meta[property="og:image"]', 'meta[property="og:title"]', 'meta[name="twitter:card"]', 'link[rel=canonical]'])
    check((await page.locator(sel).count()) === 1, `head has ${sel}`);
  const robots = await page.locator('meta[name=robots]').getAttribute('content');
  check(robots === 'noindex, nofollow', `test preview is noindex (robots="${robots}")`);
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  check(!ld.some((t) => t.includes('"Event"')), 'no Event structured data while the date is tentative');

  const text = await page.locator('body').innerText();
  check(!/confirmed speaker/i.test(text), 'no "confirmed speaker" wording');
  check((await page.locator('.chip-confirmed, .chip-confirmed-ink').count()) === 0, 'no guest carries a "Confirmed" chip');
  check((await page.locator('.guest-feature .chip').textContent()) === 'Anticipated · subject to confirmation', 'Roger Ver is marked anticipated');
  check((await page.locator('input, textarea, select, form').count()) === 0, 'no form collects personal data');
  check(text.includes('Registration details coming soon'), 'registration shows the coming-soon state');
  check(/already offers EVM compatibility/.test(text) && /planned next generation/.test(text), 'V2 is described as planned; current chain as EVM-compatible');

  /* ---------- links, images, headings ---------- */
  const anchors = await page.$$eval('a[href^="#"]', (as) => as.map((a) => a.getAttribute('href')));
  for (const h of new Set(anchors)) check((await page.locator(h).count()) === 1, `anchor ${h} has a target`);
  const ext = await page.$$eval('a[target=_blank]', (as) => as.filter((a) => !/noopener/.test(a.rel)).length);
  check(ext === 0, 'every new-tab link has rel=noopener');
  const empty = await page.$$eval('a, button', (els) => els.filter((e) => !e.textContent.trim() && !e.getAttribute('aria-label')).length);
  check(empty === 0, 'every link and button has an accessible name');
  const headings = await page.$$eval('h1,h2,h3,h4', (hs) => hs.map((h) => +h.tagName[1]));
  check(headings.every((l, i) => i === 0 || l <= headings[i - 1] + 1), `heading levels never skip (${headings.join(' ')})`);

  // scroll through so lazy images load, then verify every image decoded
  for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 700) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(40);
  }
  await page.waitForLoadState('networkidle');
  const broken = await page.$$eval('img', (is) => is.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
  check(broken.length === 0, `all images load ${broken.join(' ')}`);
  check(bad.length === 0, `no failed requests ${bad.join(' ')}`);
  const external = await page.evaluate(() =>
    performance.getEntriesByType('resource').map((r) => r.name).filter((n) => !n.startsWith(location.origin) && !n.startsWith('data:')),
  );
  check(external.length === 0, `no third-party requests (fonts and images self-hosted) ${external.join(' ')}`);

  /* ---------- keyboard ---------- */
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press('Tab');
  check((await page.evaluate(() => document.activeElement?.className)) === 'skip-link', 'first Tab reaches the skip link');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle + getComputedStyle(document.activeElement).top);
  check(!outline.startsWith('none') || !outline.endsWith('-80px'), 'skip link becomes visible on focus');

  /* ---------- responsive ---------- */
  for (const w of WIDTHS) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(url, { waitUntil: 'networkidle' });
    const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(over <= 0, `${w}px: no horizontal overflow (${over}px)`);
    const clipped = await p.$$eval('.btn', (bs) => bs.filter((b) => b.offsetParent && b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent.trim()));
    check(clipped.length === 0, `${w}px: no clipped button labels ${clipped.join(', ')}`);
    // .gala clips overflow, so also check that nothing in the header or hero is cut off or wrapped
    const cut = await p.$$eval('.nav a, .nav button, .hero-copy > *', (els) =>
      els.filter((e) => e.offsetParent && e.getBoundingClientRect().right > window.innerWidth + 0.5).map((e) => e.textContent.trim().slice(0, 24)),
    );
    check(cut.length === 0, `${w}px: header and hero fit the viewport ${cut.join(', ')}`);
    const wrapped = await p.$$eval('.nav-links a', (as) => as.filter((a) => a.offsetParent && a.getClientRects().length > 1 || (a.offsetParent && a.getBoundingClientRect().height > 40)).map((a) => a.textContent));
    check(wrapped.length === 0, `${w}px: nav links stay on one line ${wrapped.join(', ')}`);
    const small = await p.$$eval('.btn, .menu-btn, .nav-links a', (bs) =>
      bs.filter((b) => b.offsetParent && b.getBoundingClientRect().height < 24).map((b) => b.textContent.trim()),
    );
    check(small.length === 0, `${w}px: touch targets are at least 24px tall ${small.join(', ')}`);
    if (w <= 980) {
      const btn = p.locator('.menu-btn');
      check(await btn.isVisible(), `${w}px: menu button visible`);
      await btn.click();
      check((await btn.getAttribute('aria-expanded')) === 'true', `${w}px: menu opens (aria-expanded)`);
      await p.keyboard.press('Escape');
      check((await p.locator('#mobile-menu').count()) === 0, `${w}px: Escape closes the menu`);
    }
    if (SHOTS) {
      await mkdir('tests/screenshots', { recursive: true });
      await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}.snow{display:none}' });
      await p.screenshot({ path: `tests/screenshots/${w}.png`, fullPage: true });
    }
    await p.close();
  }

  /* ---------- reduced motion ---------- */
  {
    const p = await browser.newPage({ reducedMotion: 'reduce' });
    await p.goto(url, { waitUntil: 'networkidle' });
    const anim = await p.evaluate(() => getComputedStyle(document.querySelector('.hero-art .rings')).animationName);
    check(anim === 'none', 'reduced motion stops ambient animation');
    check(!(await p.locator('.snow').isVisible()), 'reduced motion removes snow');
    await p.close();
  }

  check(errors.length === 0, `no console errors ${errors.join(' | ')}`);
} finally {
  await browser.close();
  server.httpServer.close();
}

console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nall checks passed');
process.exit(failures.length ? 1 : 0);
