// End-to-end checks against the production build (run `npm run build` first).
// Uses Playwright with Chromium. Install once with `npm i -D playwright && npx playwright install chromium`
// if it is not already available on the machine.
//
//   npm test                 → checks only
//   npm test -- --shots      → also writes full-page screenshots to tests/screenshots/
import { createRequire } from 'node:module';
import { mkdir, access } from 'node:fs/promises';
import { preview } from 'vite';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const WIDTHS = [320, 375, 390, 768, 1024, 1200, 1280, 1366, 1440, 1920, 2560];
const SHOTS = process.argv.includes('--shots');
const failures = [];
const check = (ok, msg) => {
  if (!ok) failures.push(msg);
  console.log(`${ok ? '  ok ' : 'FAIL '} ${msg}`);
};

const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: 'silent' });
const url = 'http://localhost:4179/christmas/';
const browser = await chromium.launch();

/** Scroll through the page so lazy images and reveals load. */
async function scrollThrough(p) {
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(30);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForLoadState('networkidle');
}

try {
  /* ---------- production build never ships uncleared hotel photographs ---------- */
  check(await access('dist/_reference').then(() => false, () => true), 'dist/ contains no _reference folder');

  /* ---------- no-JS: the prerendered HTML carries the content ---------- */
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(url);
    check((await p.locator('h1').count()) === 1, 'prerendered HTML has exactly one h1 without JavaScript');
    check((await p.locator('body').textContent()).includes('Friday, 18 December 2026'), 'date is in the static HTML');
    await ctx.close();
  }

  /* ---------- metadata & integrity ---------- */
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  const bad = [];
  const requested = [];
  page.on('response', (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));
  page.on('request', (r) => requested.push(r.url()));
  await page.goto(url, { waitUntil: 'networkidle' });

  check(/Liberland Grand Christmas Gala 2026/.test(await page.title()), 'title names the event');
  for (const sel of ['meta[name=description]', 'meta[property="og:image"]', 'meta[property="og:title"]', 'meta[name="twitter:card"]', 'link[rel=canonical]'])
    check((await page.locator(sel).count()) === 1, `head has ${sel}`);
  const robots = await page.locator('meta[name=robots]').getAttribute('content');
  check(robots === 'noindex, nofollow', `test preview is noindex (robots="${robots}")`);
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t));
  const ev = ld.find((x) => x['@type'] === 'Event');
  check(ev?.startDate === '2026-12-18T15:00:00+01:00', `Event structured data starts Friday 18 Dec 2026, 15:00 (${ev?.startDate})`);
  check(ev?.location?.name === 'Le Palais Art Hotel Prague', 'Event structured data names Le Palais');

  const text = await page.locator('body').textContent();
  const html = await page.content();
  check(!/19 Dec(ember)? 2026|Saturday|2026-12-19/i.test(html), 'no trace of the old date (19 December 2026 / Saturday)');
  check(/Friday, 18 December 2026/.test(text), 'Friday, 18 December 2026 is shown');
  for (const t of ['15:00', '17:00', 'Constitutional Convention', 'Press Conference', 'Grand Christmas Gala'])
    check(text.includes(t), `programme includes "${t}"`);
  check(text.includes('subject to final programme confirmation'), 'schedule is marked as planned');
  check(/already EVM-compatible/.test(text) && /planned next generation/.test(text), 'V2 is planned; the existing chain is EVM-compatible');
  const speakers = await page.$$eval('.speaker h3', (hs) => hs.map((h) => h.textContent));
  check(speakers.join() === 'Vít Jedlička,Daniel Vávra,Vojtěch Roček,Martin Groch,Jan Schlüter,Balázs Magyar', `confirmed speakers: ${speakers.join(', ')}`);
  check(/Old Structures Rewritten by AI/.test(text) && /David nuclear reactor/.test(text) && /Gornja Siga digital archive/.test(text), 'speakers show their talks');
  check(!/Gorja Siga|Christmas\.ll\.land gathering/i.test(text), 'copy corrections hold (Gornja Siga; the event is the Grand Christmas Gala)');
  const faces = await page.$$eval('.face h3', (hs) => hs.map((h) => h.textContent));
  check(faces.length === 0, `no unconfirmed personalities listed (${faces.join(', ')})`);
  check(!/Roger Ver/.test(html), 'Roger Ver appears nowhere on the page');
  check((await page.locator('.face-status--confirmed').count()) === 0, 'other personalities are not marked "Confirmed"');
  check(/AI and the state/.test(text), 'programme has the AI theme');
  check((await page.locator('input, textarea, select, form').count()) === 0, 'no form collects personal data');
  const rsvp = await page.locator('#register a.reg-btn').getAttribute('href');
  check(/^mailto:rsvp@liberland\.org\?subject=/.test(rsvp ?? ''), `RSVP button opens a pre-filled e-mail to rsvp@liberland.org (${(rsvp ?? '').slice(0, 40)}…)`);
  check(/citizen of Liberland \/ e-resident \/ member of the public/.test(decodeURIComponent(rsvp ?? '')), 'RSVP e-mail asks citizen / e-resident / public');
  const prices = await page.$$eval('.tickets li', (ls) => ls.map((l) => l.textContent.replace(/\s+/g, ' ').trim()));
  check(prices.join('|') === 'Citizens of LiberlandFree|E-residents50 USD|General public100 USD', `ticket prices: ${prices.join(' | ')}`);
  check(ev?.offers?.length === 3 && ev.offers.map((o) => o.price).join() === '0,50,100', 'Event structured data lists the three ticket prices');
  check(!text.includes('Reference image'), 'production build shows no reference-image tags');

  const galleryLink = await page.locator('.venue-tour a[href="https://www.lepalaishotel.eu/gallery/"]').count();
  check(galleryLink === 1 && !/Photographs of Le Palais to follow/.test(text), 'venue invites visitors into the hotel’s own gallery');

  /* ---------- links, images, headings ---------- */
  const anchors = await page.$$eval('a[href^="#"]', (as) => as.map((a) => a.getAttribute('href')));
  for (const h of new Set(anchors)) check((await page.locator(h).count()) === 1, `anchor ${h} has a target`);
  const ext = await page.$$eval('a[target=_blank]', (as) => as.filter((a) => !/noopener/.test(a.rel)).length);
  check(ext === 0, 'every new-tab link has rel=noopener');
  const empty = await page.$$eval('a, button', (els) => els.filter((e) => !e.textContent.trim() && !e.getAttribute('aria-label')).length);
  check(empty === 0, 'every link and button has an accessible name');
  const headings = await page.$$eval('h1,h2,h3,h4', (hs) => hs.map((h) => +h.tagName[1]));
  check(headings.every((l, i) => i === 0 || l <= headings[i - 1] + 1), `heading levels never skip (${headings.join(' ')})`);
  const noAlt = await page.$$eval('img', (is) => is.filter((i) => !i.hasAttribute('alt')).length);
  check(noAlt === 0, 'every image has an alt attribute');

  await scrollThrough(page);
  const broken = await page.$$eval('img', (is) => is.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
  check(broken.length === 0, `all images load ${broken.join(' ')}`);
  check(bad.length === 0, `no failed requests ${bad.join(' ')}`);
  check(!requested.some((u) => u.includes('_reference')), 'no request for reference images');
  const external = requested.filter((n) => !n.startsWith('http://localhost') && !n.startsWith('data:'));
  check(external.length === 0, `no third-party requests ${external.join(' ')}`);
  const revealed = await page.$$eval('.reveal', (els) => els.every((e) => e.classList.contains('is-in')));
  check(revealed, 'every reveal element became visible after scrolling');

  /* ---------- keyboard ---------- */
  await page.keyboard.press('Tab');
  check((await page.evaluate(() => document.activeElement?.className)) === 'skip-link', 'first Tab reaches the skip link');

  /* ---------- last year's film ---------- */
  check((await page.locator('#last-christmas video').count()) === 0, 'the 2025 film is not loaded until someone presses play');
  check(!requested.some((u) => u.endsWith('.mp4')), 'no video bytes are requested on page load');
  const film = await page.request.head(url + 'media/gala-2025/film.mp4');
  check(film.ok() && /video\/mp4/.test(film.headers()['content-type'] ?? ''), `film.mp4 is served as video/mp4 (${film.status()})`);
  await page.locator('#last-christmas .cinema-play').click();
  await page.waitForTimeout(2500);
  const playback = await page.$eval('#last-christmas video', (v) => ({ t: v.currentTime, paused: v.paused, controls: v.controls }));
  check(playback.t > 0.5 && !playback.paused && playback.controls, `pressing play starts the film with controls (t=${playback.t.toFixed(1)}s)`);
  check(/Honours & passports/.test(text) && /19 December 2025/.test(text), 'last year’s highlights are shown');
  check(!/Hoppe|Kinsella|Fusillo|Vondráček/.test(html), 'no named guests from last year');

  /* ---------- responsive ---------- */
  for (const w of WIDTHS) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(url, { waitUntil: 'networkidle' });
    const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(over <= 0, `${w}px: no horizontal overflow (${over}px)`);
    const clipped = await p.$$eval('.btn', (bs) => bs.filter((b) => b.offsetParent && b.scrollWidth > b.clientWidth + 1).map((b) => b.textContent.trim()));
    check(clipped.length === 0, `${w}px: no clipped button labels ${clipped.join(', ')}`);
    // .gala clips overflow, so also check that nothing in the header or hero is cut off
    const cut = await p.$$eval('.nav a, .nav button, .hero-inner > *', (els) =>
      els.filter((e) => e.offsetParent && (e.getBoundingClientRect().right > window.innerWidth + 0.5 || e.getBoundingClientRect().left < -0.5)).map((e) => e.textContent.trim().slice(0, 24)),
    );
    check(cut.length === 0, `${w}px: header and hero fit the viewport ${cut.join(', ')}`);
    const wrapped = await p.$$eval('.nav-primary a', (as) => as.filter((a) => a.offsetParent && a.getBoundingClientRect().height > 40).map((a) => a.textContent));
    check(wrapped.length === 0, `${w}px: nav links stay on one line ${wrapped.join(', ')}`);
    const titleFits = await p.$eval('.hero-grand', (e) => e.scrollWidth <= e.clientWidth + 1);
    check(titleFits, `${w}px: hero title fits`);
    const small = await p.$$eval('.btn, .menu-btn, .nav-primary a, .tile-btn', (bs) =>
      bs.filter((b) => b.offsetParent && b.getBoundingClientRect().height < 24).map((b) => b.textContent.trim()),
    );
    check(small.length === 0, `${w}px: touch targets are at least 24px tall ${small.join(', ')}`);
    if (w <= 1180) {
      const btn = p.locator('.menu-btn');
      check(await btn.isVisible(), `${w}px: menu button visible`);
      await btn.click();
      check((await btn.getAttribute('aria-expanded')) === 'true', `${w}px: menu opens (aria-expanded)`);
      await p.keyboard.press('Escape');
      check((await p.locator('#mobile-menu').count()) === 0, `${w}px: Escape closes the menu`);
    }
    if (SHOTS) {
      await mkdir('tests/screenshots', { recursive: true });
      await scrollThrough(p);
      await p.addStyleTag({ content: '*{animation:none!important;transition:none!important}.snowfall,.twinkles{display:none}.reveal{opacity:1!important;transform:none!important}' });
      await p.screenshot({ path: `tests/screenshots/${w}.png`, fullPage: true });
    }
    await p.close();
  }

  /* ---------- snowfall stays white after a resize (phones resize while scrolling) ---------- */
  {
    const p = await browser.newPage({ viewport: { width: 1200, height: 800 } });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.setViewportSize({ width: 390, height: 844 });
    await p.waitForTimeout(700);
    const snow = await p.evaluate(() => {
      const c = document.querySelector('.snowfall');
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let painted = 0, dark = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 40) { painted++; if (d[i] < 128) dark++; }
      return { painted, dark };
    });
    check(snow.painted > 0 && snow.dark === 0, `snowflakes stay white after a resize (${snow.painted} px drawn, ${snow.dark} dark)`);
    await p.close();
  }

  /* ---------- reduced motion ---------- */
  {
    const p = await browser.newPage({ reducedMotion: 'reduce' });
    await p.goto(url, { waitUntil: 'networkidle' });
    const anim = await p.evaluate(() => getComputedStyle(document.querySelector('.hero-grand em')).animationName);
    check(anim === 'none', 'reduced motion stops the gold shimmer');
    check(!(await p.locator('.snowfall').isVisible()), 'reduced motion removes the snowfall');
    const reveal = await p.evaluate(() => getComputedStyle(document.querySelector('.reveal')).opacity);
    check(reveal === '1', 'reduced motion shows content without reveal animation');
    await p.close();
  }

  /* ---------- Simplified Chinese page (/zh/) ---------- */
  {
    const zhUrl = url + 'zh/';
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const zhErrors = [];
    const zhBad = [];
    p.on('console', (m) => m.type() === 'error' && zhErrors.push(m.text()));
    p.on('pageerror', (e) => zhErrors.push(e.message));
    p.on('response', (r) => r.status() >= 400 && zhBad.push(`${r.status()} ${r.url()}`));
    await p.goto(zhUrl, { waitUntil: 'networkidle' });
    check((await p.getAttribute('html', 'lang')) === 'zh-CN', 'zh: <html lang="zh-CN">');
    const h1 = (await p.locator('h1').textContent()) ?? '';
    check(h1.includes('利伯兰') && h1.includes('圣诞盛典'), `zh: Chinese headline (${h1.trim()})`);
    check(/^https:\/\/.+\/zh\/$/.test((await p.locator('link[rel=canonical]').getAttribute('href')) ?? ''), 'zh: canonical points to /zh/');
    check((await p.locator('link[rel=alternate][hreflang="en"]').count()) === 1 && (await p.locator('link[rel=alternate][hreflang="zh-Hans"]').count()) === 1, 'zh: hreflang alternates for en and zh-Hans');
    check(/og-image-zh\.jpg$/.test((await p.locator('meta[property="og:image"]').getAttribute('content')) ?? ''), 'zh: Chinese social image');
    const zhText = (await p.locator('body').textContent()) ?? '';
    check(zhText.includes('2026年12月18日（星期五）'), 'zh: date in Chinese format');
    const zhPrices = await p.$$eval('.tickets li', (ls) => ls.map((l) => l.textContent.replace(/\s+/g, '')));
    check(zhPrices.join('|') === '利伯兰公民免费|电子居民50美元|公众100美元', `zh: ticket prices (${zhPrices.join(' | ')})`);
    const zhMail = decodeURIComponent((await p.locator('#register a.reg-btn').getAttribute('href')) ?? '');
    check(zhMail.startsWith('mailto:rsvp@liberland.org?subject=RSVP：') && zhMail.includes('利伯兰公民 citizen'), 'zh: RSVP e-mail pre-filled in Chinese (with English labels)');
    const leftovers = ['Discover the Gala', 'Reserve your place', 'Watch the film', 'The Faces of the Evening', 'Before you travel', 'Skip to content'].filter((x) => zhText.includes(x));
    check(leftovers.length === 0, `zh: no English interface text left ${leftovers.join(', ')}`);
    check((await p.locator('.lang-switch a[hreflang="en"]').getAttribute('href')) === new URL(url).pathname, 'zh: language switch links to the English page');
    await scrollThrough(p);
    const zhBroken = await p.$$eval('img', (is) => is.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
    check(zhBroken.length === 0 && zhBad.length === 0, `zh: all images and files load ${[...zhBroken, ...zhBad].join(' ')}`);
    const font = await p.evaluate(() => document.fonts.check('400 40px "Noto Serif SC"', '圣诞'));
    check(font, 'zh: Noto Serif SC is available for the Chinese headings');
    check(zhErrors.length === 0, `zh: no console errors ${zhErrors.join(' | ')}`);
    await p.close();
    for (const w of [320, 390, 1024, 1440]) {
      const q = await browser.newPage({ viewport: { width: w, height: 900 } });
      await q.goto(zhUrl, { waitUntil: 'networkidle' });
      const over = await q.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const cut = await q.$$eval('.nav a, .nav button, .hero-inner > *', (els) =>
        els.filter((e) => e.offsetParent && (e.getBoundingClientRect().right > window.innerWidth + 0.5 || e.getBoundingClientRect().left < -0.5)).length,
      );
      check(over <= 0 && cut === 0, `zh ${w}px: no overflow, header and hero fit`);
      await q.close();
    }
  }

  /* ---------- visitors from China / Taiwan get the Chinese page ---------- */
  {
    const visit = async (opts, label, expectZh) => {
      const ctx = await browser.newContext(opts);
      const p = await ctx.newPage();
      await p.goto(url, { waitUntil: 'networkidle' });
      const landed = new URL(p.url()).pathname;
      check(landed.endsWith('/zh/') === expectZh, `${label} → ${landed}`);
      await ctx.close();
    };
    await visit({ timezoneId: 'Asia/Shanghai', locale: 'en-US' }, 'browser in mainland China (Asia/Shanghai)', true);
    await visit({ timezoneId: 'Asia/Taipei', locale: 'en-US' }, 'browser in Taiwan (Asia/Taipei)', true);
    await visit({ timezoneId: 'Asia/Hong_Kong', locale: 'en-GB' }, 'browser in Hong Kong', true);
    await visit({ timezoneId: 'Europe/Prague', locale: 'zh-CN' }, 'Chinese-language browser in Prague', true);
    await visit({ timezoneId: 'Europe/Prague', locale: 'en-GB' }, 'English browser in Prague stays on English', false);
    await visit({ timezoneId: 'Asia/Tokyo', locale: 'ja-JP' }, 'Japanese browser in Tokyo stays on English', false);

    // An explicit choice wins: someone in Shanghai who picks EN stays on English.
    const ctx = await browser.newContext({ timezoneId: 'Asia/Shanghai', locale: 'zh-CN' });
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.locator('.lang-switch a[hreflang="en"]').click();
    await p.waitForLoadState('networkidle');
    await p.goto(url, { waitUntil: 'networkidle' });
    check(!new URL(p.url()).pathname.endsWith('/zh/'), 'choosing EN is remembered (no redirect back to Chinese)');
    await p.locator('.lang-switch a[hreflang="zh-CN"]').click();
    await p.waitForURL(/\/zh\/$/);
    check(new URL(p.url()).pathname.endsWith('/zh/'), '中文 switch opens the Chinese page');
    await ctx.close();
  }

  check(errors.length === 0, `no console errors ${errors.join(' | ')}`);
} finally {
  await browser.close();
  server.httpServer.close();
}

console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nall checks passed');
process.exit(failures.length ? 1 : 0);
