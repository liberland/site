// Regenerates public/og-image.jpg (1200×630) from the built hero.
// Uses the production build (no uncleared hotel photography). Run after `npm run build`:  node scripts/og-image.mjs  (needs Playwright + Chromium)
import { createRequire } from 'node:module';
import { preview } from 'vite';

const { chromium } = createRequire(import.meta.url)('playwright');
const server = await preview({ preview: { port: 4180, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:4180/christmas/', { waitUntil: 'networkidle' });
await page.addStyleTag({
  content: `*{animation:none!important;transition:none!important}
  .nav,.hero-ctas,.hero-credit,.snowfall,.skip-link,.ref-tag,.hero-pending,.twinkles{display:none!important}
  .hero{min-height:630px!important;height:630px}
  .hero .hero-garland{top:-8px!important}
  .hero-shade{opacity:.55}
  .hero-inner{padding:178px 0 0!important}
  .hero .hero-wreath{top:60%!important;width:540px!important}
  .hero-grand{font-size:104px!important}
  .hero-sub{font-size:28px!important}`,
});
await page.evaluate(async () => {
  document.querySelectorAll('img').forEach((i) => (i.loading = 'eager'));
  await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))));
  await document.fonts.ready;
});
await page.waitForTimeout(300);
if (process.env.DEBUG) console.log(await page.evaluate(() => ({ y: scrollY, hero: document.querySelector('.hero').getBoundingClientRect().toJSON(), g: document.querySelector('.hero-garland').getBoundingClientRect().toJSON() })));
await page.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
server.httpServer.close();
console.log('wrote public/og-image.jpg');
