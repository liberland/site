// Regenerates public/og-image.jpg (1200×630): an ivory card with the XII medallion and the dates, as the
// design handoff specifies. Built from the production page itself, so fonts and the medallion are identical.
// Run after `npm run build`:  node scripts/og-image.mjs   (needs Playwright + Chromium)
import { createRequire } from 'node:module';
import { preview } from 'vite';

const { chromium } = createRequire(import.meta.url)('playwright');
const server = await preview({ preview: { port: 4184, strictPort: true }, logLevel: 'silent' });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('http://localhost:4184/', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  const med = document.querySelector('.med').outerHTML;
  const dates = document.querySelector('.h-meta .v').textContent;
  const venue = document.querySelectorAll('.h-meta .v')[1].textContent;
  const provisional = !!document.querySelector('.h-meta .tag-prov');
  const lla = document.querySelector('.lla');
  lla.innerHTML = `
    <div class="og">
      <div class="og-med">${med}</div>
      <div class="og-txt">
        <p class="kick lbl">Free Republic of Liberland · Founded 13 April 2015</p>
        <p class="d1 og-t">Liberland</p>
        <p class="og-12">12th Anniversary</p>
        <p class="og-d">${dates}</p>
        <p class="rec og-v">${venue}${provisional ? ' · Provisional dates' : ''}</p>
      </div>
    </div>`;
});
await page.addStyleTag({
  content: `*{animation:none!important}
  .og{width:1200px;height:630px;display:grid;grid-template-columns:400px 1fr;gap:64px;align-items:center;padding:0 72px;background:var(--ivory);border-bottom:10px solid var(--yellow)}
  .og-med{width:400px}
  .og-t{font-size:118px;line-height:.95;margin-top:6px}
  .og-12{font-family:var(--f-display);font-size:50px;color:var(--gold-text);margin-top:6px}
  .og-d{font-family:var(--f-record);font-size:30px;letter-spacing:.06em;text-transform:uppercase;margin-top:30px}
  .og-v{color:var(--soft);font-size:14px;margin-top:10px}
  .kick{margin-bottom:6px}`,
});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: 'public/og-image.jpg', type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
server.httpServer.close();
console.log('wrote public/og-image.jpg');
