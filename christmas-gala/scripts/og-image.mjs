// Regenerates public/og-image.jpg (1200×630) from the built hero.
// Run after `npm run build`:  node scripts/og-image.mjs  (needs Playwright + Chromium)
import { createRequire } from 'node:module';
import { preview } from 'vite';

const { chromium } = createRequire(import.meta.url)('playwright');
const server = await preview({ preview: { port: 4180, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:4180/christmas/', { waitUntil: 'networkidle' });
await page.addStyleTag({
  content: `*{animation:none!important;transition:none!important}
  .nav,.hero-ctas,.hero-foot,.snow,.skip-link{display:none!important}
  .hero{min-height:630px!important;height:630px}
  .hero-copy{padding-top:58px!important}
  .hero h1{margin-top:22px!important}
  .hero h1 .pre{margin-bottom:16px!important}
  .hero h1 .big{font-size:112px!important}
  .hero .sub{font-size:28px!important;margin-top:22px!important}
  .hero-meta{margin-top:26px!important}
  .hero-art svg{right:-200px!important;width:1150px!important}`,
});
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
server.httpServer.close();
console.log('wrote public/og-image.jpg');
