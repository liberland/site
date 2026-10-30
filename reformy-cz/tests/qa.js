// Vizuální a funkční kontrola náhledů z build_preview.py v Chromiu (Playwright).
// Použití: node reformy-cz/tests/qa.js SLOZKA_S_NAHLEDY
// Náhledy se otevírají na skutečných adresách reformy.cz: požadavky na /o-spolku/,
// /about/ a soubory pluginu se obslouží lokálně, vše ostatní (CSS/JS šablony Newspaper)
// jde na produkční web. Chyby JS se porovnávají s živou stránkou /about/ (baseline).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const pluginDir = path.resolve(__dirname, '..', 'plugin', 'reformy-o-spolku');
const pages = { 'preview-o-spolku': 'https://reformy.cz/o-spolku/', 'preview-about': 'https://reformy.cz/about/' };
const types = { '.css': 'text/css', '.woff2': 'font/woff2' };

async function open(browser, name, width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  // Spamový odkaz z produkce neotevírat ani při kontrole.
  await page.route(/fapjunk/, r => r.abort());
  if (name) {
    await page.route(pages[name], r => r.fulfill({ contentType: 'text/html; charset=utf-8', body: fs.readFileSync(path.join(dir, name + '.html')) }));
    await page.route('https://reformy.cz/wp-content/plugins/reformy-o-spolku/**', r => {
      const f = path.join(pluginDir, decodeURIComponent(new URL(r.request().url()).pathname.split('/reformy-o-spolku/')[1]));
      r.fulfill({ contentType: types[path.extname(f)] || 'application/octet-stream', body: fs.readFileSync(f) });
    });
  }
  await page.goto(name ? pages[name] : 'https://reformy.cz/about/', { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(800);
  return { page, errors };
}

const dir = path.resolve(process.argv[2] || '.');
const widths = [320, 390, 768, 1024, 1366, 1920];
let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${msg}`); if (!ok) failures++; };

function luminance(rgb) {
  const [r, g, b] = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ proxy });

  const base = await open(browser, null, 1366);
  const baseline = new Set(base.errors);
  console.log('baseline (živé /about/) chyby JS:', JSON.stringify([...baseline]));
  await base.page.close();

  for (const name of Object.keys(pages)) {
    for (const width of widths) {
      const { page, errors: all } = await open(browser, name, width);
      const errors = all.filter(e => !baseline.has(e));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(overflow <= 0, `${name} @${width}px: bez vodorovného posuvníku (přesah ${overflow}px)`);
      check(errors.length === 0, `${name} @${width}px: žádné nové chyby JavaScriptu oproti živému webu ${errors.length ? JSON.stringify(errors) : ''}`);
      if (name === 'preview-o-spolku') {
        const own = await page.evaluate(() => {
          const root = document.getElementById('rz-spolek');
          const r = root.getBoundingClientRect();
          const off = [...root.querySelectorAll('*')].filter(el => {
            const b = el.getBoundingClientRect();
            return b.width > 0 && (b.right > r.right + 1 || b.left < r.left - 1);
          }).map(el => el.tagName + '.' + el.className).slice(0, 5);
          return { off };
        });
        check(own.off.length === 0, `${name} @${width}px: žádný prvek nepřetéká obsah ${own.off.join(', ')}`);
      }
      await page.screenshot({ path: path.join(dir, `${name}-${width}.png`), fullPage: true });
      await page.close();
    }
  }

  // Obsahové a přístupnostní kontroly nové stránky (desktop).
  const { page } = await open(browser, 'preview-o-spolku', 1366);
  const r = await page.evaluate(() => {
    const root = document.getElementById('rz-spolek');
    const vis = el => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && b.width > 0 && b.height > 0; };
    const text = root.innerText;
    const h1 = [...document.querySelectorAll('h1')].filter(vis).map(h => h.textContent.trim());
    const heads = [...root.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]);
    let skip = false; for (let i = 1; i < heads.length; i++) if (heads[i] > heads[i - 1] + 1) skip = true;
    const anchors = [...root.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => !document.getElementById(h.slice(1)));
    const ids = [...root.querySelectorAll('[id]')].map(e => e.id); const dupIds = ids.filter((v, i) => ids.indexOf(v) !== i);
    const links = [...root.querySelectorAll('a[href]')].map(a => a.href);
    const noName = [...root.querySelectorAll('a,button')].filter(a => !a.textContent.trim() && !a.getAttribute('aria-label')).length;
    const small = [...root.querySelectorAll('a')].filter(vis).filter(a => { const b = a.getBoundingClientRect(); return b.height < 24 && !a.closest('p,li,dd'); }).map(a => a.textContent.trim());
    // Kontrast textu: barva textu proti první neprůhledné barvě pozadí v předcích.
    const parse = c => (c.match(/[\d.]+/g) || []).map(Number);
    const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c.length === 3 || (c.length === 4 && c[3] > 0.9)) return c.slice(0, 3); } return [255, 255, 255]; };
    const samples = [];
    root.querySelectorAll('p,li,dt,dd,h1,h2,h3,h4,a,span,strong,footer').forEach(el => {
      if (!vis(el) || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return;
      const s = getComputedStyle(el); const fg = parse(s.color); samples.push({ t: el.textContent.trim().slice(0, 40), fg: fg.slice(0, 3), bg: bgOf(el), size: parseFloat(s.fontSize), bold: +s.fontWeight >= 700 });
    });
    return { text, h1, skip, anchors, dupIds, links: [...new Set(links)], noName, small, samples, title: document.title,
      desc: document.querySelector('meta[name=description]')?.content, scripts: root.querySelectorAll('script').length,
      lang: document.documentElement.lang, enLang: document.getElementById('en')?.lang, fonts: [...document.fonts].filter(f => f.family.startsWith('"RZ') || f.family.startsWith('RZ')).map(f => f.family + ' ' + f.weight + ' ' + f.status) };
  });
  check(r.h1.length === 1 && r.h1[0] === 'Reformy.cz z.s.', `jediný viditelný H1 = „Reformy.cz z.s.“ (${JSON.stringify(r.h1)})`);
  check(!r.skip, 'nadpisy bez přeskočené úrovně');
  check(r.anchors.length === 0, `všechny kotvy existují ${r.anchors.join(' ')}`);
  check(r.dupIds.length === 0, `žádná duplicitní id ${r.dupIds.join(' ')}`);
  check(r.noName === 0, 'každý odkaz má text');
  check(r.small.length === 0, `samostatné odkazy mají cíl ≥ 24 px ${JSON.stringify(r.small)}`);
  check(r.scripts === 0, 'obsah stránky neobsahuje žádný <script>');
  check(r.lang === 'cs' && r.enLang === 'en', 'jazyk: stránka cs, anglická sekce en');
  for (const s of ['Reformy.cz z.s.', '22874046', 'Loretánské náměstí 109/3', '118 00 Praha 1', 'Městský soud v Praze', 'L 21391', 'gov.ll.land', 'liberland.org', 'About Reformy.cz z.s.']) {
    check(r.text.includes(s), `text obsahuje „${s}“`);
  }
  for (const s of ['Lorem', 'k ověření', 'to verify', 'TODO', 'placeholder', 'spravuje Reformy.cz', 'administered by Reformy.cz']) {
    check(!r.text.toLowerCase().includes(s.toLowerCase()), `text neobsahuje „${s}“`);
  }
  const bad = r.samples.filter(s => {
    const [a, b] = [luminance(s.fg), luminance(s.bg)];
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const large = s.size >= 24 || (s.bold && s.size >= 18.66);
    s.ratio = ratio.toFixed(2);
    return ratio < (large ? 3 : 4.5);
  });
  check(bad.length === 0, `kontrast textu WCAG AA (${r.samples.length} prvků) ${JSON.stringify(bad.slice(0, 5))}`);
  console.log('fonty:', r.fonts.join(' | '));
  console.log('odkazy:', r.links.join('\n        '));
  await browser.close();
  console.log(failures ? `\n${failures} kontrol selhalo` : '\nVšechny kontroly prošly');
  process.exit(failures ? 1 : 0);
})();
