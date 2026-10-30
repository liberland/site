// Renders scripts/ornaments/out/*.svg to transparent PNGs (2× for crisp edges).
import { createRequire } from 'node:module';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const out = join(dirname(fileURLToPath(import.meta.url)), 'out');
const only = process.argv.slice(2);
const browser = await chromium.launch();
for (const f of (await readdir(out)).filter((f) => f.endsWith('.svg'))) {
  const name = f.replace(/\.svg$/, '');
  if (only.length && !only.includes(name)) continue;
  const svg = await readFile(join(out, f), 'utf8');
  const [, w, h] = svg.match(/width="(\d+)" height="(\d+)"/);
  const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg}</body></html>`);
  await page.screenshot({ path: join(out, name + '.png'), omitBackground: true, clip: { x: 0, y: 0, width: +w, height: +h } });
  await page.close();
  console.log('rendered', name);
}
await browser.close();
