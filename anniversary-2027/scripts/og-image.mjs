// Regenerates public/og-image.jpg (1200×630): the title, dates and venue beside the hero photograph, with the XII seal. Built from the production page itself, so fonts and the medallion are identical.
// Run after `npm run build`:  node scripts/og-image.mjs   (needs Playwright + Chromium)
import { createRequire } from 'node:module';
import { preview } from 'vite';

const { chromium } = createRequire(import.meta.url)('playwright');
const server = await preview({ preview: { port: 4184, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:4184/', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  const seal = document.querySelector('.seal').outerHTML;
  const photo = document.querySelector('.hero-fig img');
  const dates = document.querySelector('.hero-facts dd').textContent;
  const venue = document.querySelectorAll('.hero-facts dd')[1].textContent;
  const provisional = !!document.querySelector('.hero-note');
  document.querySelector('.lla').innerHTML = `
    <div class="og">
      <div class="og-txt">
        <p class="eyebrow">Free Republic of Liberland</p>
        <p class="og-t">Liberland</p>
        <p class="og-12">12th Anniversary</p>
        <p class="og-d">${dates}</p>
        <p class="og-v">${venue}${provisional ? ' · provisional dates' : ''}</p>
      </div>
      <div class="og-ph"><img src="${photo.currentSrc || photo.src}" alt="">${seal}</div>
    </div>`;
});
await page.addStyleTag({
  content: `*{animation:none!important}
  .og{width:1200px;height:630px;display:grid;grid-template-columns:520px 1fr;gap:0;align-items:center;background:var(--ivory)}
  .og-txt{padding:0 40px 0 72px}
  .og-t{font-family:var(--f-display);font-size:84px;line-height:1;margin-top:18px}
  .og-12{font-family:var(--f-display);font-style:italic;font-size:42px;color:var(--gold-text);margin-top:8px}
  .og-d{font-size:30px;font-weight:600;margin-top:36px}
  .og-v{font-size:19px;color:var(--soft);margin-top:8px}
  .og-ph{position:relative;height:630px}
  .og-ph img{width:100%;height:100%;object-fit:cover;display:block}
  .og-ph .seal{left:-60px;bottom:40px;width:150px;height:150px}`,
});
await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r))))));
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
server.httpServer.close();
console.log('wrote public/og-image.jpg');
