// LiberCom landing page. Run: npm install && npm test
// Set OFFLINE=1 to skip the one test that loads Atli's real widget over the network.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const ROOT = path.resolve(__dirname, '..');
const CONFIG_SRC = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8');

function loadConfig(src = CONFIG_SRC) {
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  return sandbox.window.LIBERCOM_CONFIG;
}
const CONFIG = loadConfig();
const GP_URL = `${CONFIG.globalPlus.productUrl}?${CONFIG.globalPlus.referralParam}=${CONFIG.globalPlus.code}`;

/** Serve config.js with some fields changed, to test other launch states. */
async function withConfig(page, patch) {
  const src = `${CONFIG_SRC}\n;(${patch.toString()})(window.LIBERCOM_CONFIG);`;
  await page.route('**/config.js', route => route.fulfill({ contentType: 'text/javascript', body: src }));
}

/** Keep Atli's real widget out of tests that are not about it. */
async function stubWidget(page, body = '') {
  await page.route(CONFIG.widget.scriptUrl, route => route.fulfill({ contentType: 'text/javascript', body }));
}

/** Errors from this page only: the widget iframe carries Atli's own trackers. */
function watchErrors(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const where = (m.location() && m.location().url) || '';
    if (where && !where.startsWith('http://localhost')) return;
    errors.push(`console: ${m.text()}`);
  });
  page.on('response', r => {
    if (r.url().startsWith('http://localhost') && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  return errors;
}

test.describe('configuration', () => {
  test('codes and the Global Plus product URL live only in config.js', () => {
    for (const file of ['index.html', 'app.js', 'styles.css']) {
      const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
      expect(src, file).not.toContain(CONFIG.globalPlus.code);
      expect(src, file).not.toMatch(/\bLIBERLAND(GLOBAL)?\b/);
      expect(src, file).not.toContain('esim-global-plus');
      expect(src, file).not.toContain('/embed.js');
    }
  });

  test('the citizen link stays off until Atli supplies one, and the two codes stay separate', () => {
    expect(CONFIG.citizenData.status).toBe('coming-soon');
    expect(CONFIG.citizenData.redemptionUrl).toBe('');
    expect(CONFIG.widget.referral).toBe('LIBERLAND');
    expect(CONFIG.globalPlus.code).toBe('LIBERLANDGLOBAL');
    expect(CONFIG.site.canonicalUrl).toBeNull();
  });
});

test.describe('page at /mobile/', () => {
  test.beforeEach(async ({ page }) => { await stubWidget(page); });

  test('loads with every asset under the base path and no errors', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('./');
    await expect(page).toHaveURL(/\/mobile\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Stay connected\.\s*Wherever freedom takes\syou\./);
    await page.evaluate(() => document.fonts.ready);
    const assets = await page.evaluate(() => ({
      images: [...document.images].map(i => ({ src: i.currentSrc, ok: i.complete && i.naturalWidth > 0 })),
      fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => `${f.family} ${f.weight} ${f.style}`),
      css: [...document.styleSheets].map(s => s.href),
    }));
    for (const img of assets.images) {
      expect(img.ok, img.src).toBe(true);
      expect(img.src).toContain('/mobile/assets/');
    }
    expect(assets.fonts.length).toBeGreaterThanOrEqual(3);
    expect(assets.css).toContain('http://localhost:3747/mobile/styles.css');
    expect(errors).toEqual([]);
  });

  test('/mobile without a slash redirects and still works', async ({ page }) => {
    const res = await page.goto('http://localhost:3747/mobile');
    expect(res.status()).toBe(200);
    await expect(page).toHaveURL('http://localhost:3747/mobile/');
    await expect(page.locator('#global-plus .code-value')).toHaveText(CONFIG.globalPlus.code);
  });

  test('the same files work at a domain root (libercom.ll.land)', async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto('http://localhost:3747/');
    await expect(page.locator('#global-plus .code-value')).toHaveText(CONFIG.globalPlus.code);
    expect(await page.locator('img.brand-shield').first().evaluate(i => i.naturalWidth)).toBeGreaterThan(0);
    expect(errors).toEqual([]);
  });

  test('Global Plus card: facts, code and the referral link from config', async ({ page }) => {
    await page.goto('./');
    const card = page.locator('#global-plus');
    await expect(card.locator('.offer-label')).toHaveText(/global connectivity/i);
    await expect(card.locator('.offer-highlight')).toHaveText(/20%\s*off/i);
    await expect(card.getByRole('heading', { level: 3 })).toHaveText('One eSIM. A world of possibilities.');
    for (const fact of ['30 GB mobile data', 'Valid for 365 days from purchase', 'Coverage across 113 countries and territories',
      'Single reusable eSIM', '20% discount with the Liberland referral offer']) {
      await expect(card.locator('.feature-list')).toContainText(fact);
    }
    const cta = card.getByRole('link', { name: 'Get Global Plus — 20% Off' });
    await expect(cta).toHaveAttribute('href', GP_URL);
    expect(GP_URL).toBe('https://heyatli.com/esim-global-plus?referral=LIBERLANDGLOBAL');
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('rel', 'sponsored noopener');
    // No price is stated anywhere on the page.
    expect(await page.locator('main').innerText()).not.toMatch(/[$€£]\s?\d/);
  });

  test('a changed code flows to the link, the card and the button text', async ({ page }) => {
    await withConfig(page, c => { c.globalPlus.code = 'LIBERLAND'; c.globalPlus.discountPercent = 15; });
    await page.goto('./');
    await expect(page.locator('#global-plus .code-value')).toHaveText('LIBERLAND');
    await expect(page.getByRole('link', { name: 'Get Global Plus — 15% Off' }))
      .toHaveAttribute('href', 'https://heyatli.com/esim-global-plus?referral=LIBERLAND');
  });

  test('copy button copies the code', async ({ page, context, browserName }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('./');
    await page.getByRole('button', { name: 'Copy code' }).click();
    await expect(page.locator('[data-copy-label]')).toHaveText('Copied');
    await expect(page.locator('[data-copy-status]')).toHaveText(`Code ${CONFIG.globalPlus.code} copied to the clipboard.`);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(CONFIG.globalPlus.code);
  });

  test('citizen 1 GB: coming soon by default, no redemption link anywhere', async ({ page }) => {
    await page.goto('./');
    const card = page.locator('#citizen-benefit');
    await expect(card).toHaveAttribute('data-state', 'coming-soon');
    await expect(card.getByRole('heading', { level: 3 })).toHaveText('Your first 1 GB. On us.');
    await expect(card).toContainText('Liberland citizens are eligible to claim 1 GB of complimentary travel data through our partnership with Atli.');
    await expect(card).toContainText('Activation details will follow');
    await expect(card.getByRole('link', { name: 'Claim Your Free Data' })).toHaveCount(0);
    // No form, no inputs: nothing personal is collected.
    await expect(page.locator('form, input, textarea, select')).toHaveCount(0);
    const hero = page.locator('.hero [data-citizen-cta]');
    await expect(hero).toHaveText(/Claim Your Free 1\sGB\s*Coming soon/);
    await expect(hero).toHaveAttribute('href', '#citizen-benefit');
    await expect(hero).not.toHaveAttribute('target', /.*/);
  });

  for (const [label, patch] of [
    ['an empty URL', c => { c.citizenData.status = 'available'; c.citizenData.redemptionUrl = ''; }],
    ['a plain-http URL', c => { c.citizenData.status = 'available'; c.citizenData.redemptionUrl = 'http://example.com/claim'; }],
    ['a URL but status still coming-soon', c => { c.citizenData.redemptionUrl = 'https://example.com/claim'; }],
  ]) {
    test(`citizen 1 GB stays coming soon with ${label}`, async ({ page }) => {
      await withConfig(page, patch);
      await page.goto('./');
      await expect(page.locator('#citizen-benefit')).toHaveAttribute('data-state', 'coming-soon');
      await expect(page.locator('a[href*="example.com"]')).toHaveCount(0);
    });
  }

  test('citizen 1 GB goes live once a verified https URL is configured', async ({ page }) => {
    await withConfig(page, c => { c.citizenData.status = 'available'; c.citizenData.redemptionUrl = 'https://example.com/claim?c=1'; });
    await page.goto('./');
    await expect(page.locator('#citizen-benefit')).toHaveAttribute('data-state', 'available');
    const claim = page.getByRole('link', { name: 'Claim Your Free Data' });
    await expect(claim).toBeVisible();
    await expect(claim).toHaveAttribute('href', 'https://example.com/claim?c=1');
    const hero = page.locator('.hero [data-citizen-cta]');
    await expect(hero).toHaveText('Claim Your Free 1 GB');
    await expect(hero).toHaveAttribute('href', 'https://example.com/claim?c=1');
    await expect(page.getByText('Coming soon').filter({ visible: true })).toHaveCount(0);
  });

  test('outbound links open safely', async ({ page }) => {
    await page.goto('./');
    const links = await page.locator('a[target="_blank"]').evaluateAll(as => as.map(a => ({ href: a.href, rel: a.rel })));
    expect(links.length).toBeGreaterThan(5);
    for (const l of links) {
      expect(l.rel, l.href).toContain('noopener');
      expect(l.href, l.href).toMatch(/^https:\/\//);
    }
    for (const href of ['https://liberland.org/', 'https://heyatli.com/', 'https://heyatli.com/terms', 'https://heyatli.com/privacy']) {
      await expect(page.locator(`footer a[href="${href}"]`).first()).toBeVisible();
    }
    await expect(page.locator('footer')).toContainText('Connectivity services and eSIM plans are provided by Atli and its network partners.');
    await expect(page.locator('footer')).toContainText('Powered by');
  });

  test('how it works: three steps and the device note', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('.step-title')).toHaveText(['Choose your plan', 'Install your eSIM', 'Stay connected']);
    await expect(page.locator('#how')).toContainText('An eSIM-compatible, carrier-unlocked device is required. Coverage and plan conditions vary.');
  });

  test('no horizontal overflow and the first tab stop is the skip link', async ({ page }) => {
    await page.goto('./');
    const { sw, iw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
    expect(sw).toBeLessThanOrEqual(iw);
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText('Skip to content');
  });

  test('reduced motion stops the animations', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await stubWidget(page);
    await page.goto('http://localhost:3747/mobile/');
    expect(await page.locator('.routes-flow path').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    expect(await page.locator('.hero-title').evaluate(el => getComputedStyle(el.parentElement.firstElementChild).animationName)).toBe('none');
    await context.close();
  });

  test('no automatically detectable accessibility violations', async ({ page }) => {
    await page.goto('./');
    await page.evaluate(() => document.fonts.ready);
    // The widget lives in Atli's cross-origin iframe; this audits our page.
    const results = await new AxeBuilder({ page }).exclude('#atli-esim-widget').analyze();
    expect(results.violations.map(v => `${v.id}: ${v.nodes.length} × ${v.help}`)).toEqual([]);
  });
});

test.describe('Atli widget', () => {
  test('falls back to a link when the script cannot load', async ({ page }) => {
    await page.route(CONFIG.widget.scriptUrl, route => route.abort());
    await page.goto('./');
    const fallback = page.locator('[data-widget-fallback]');
    await expect(fallback).toBeVisible();
    await expect(fallback.getByRole('link', { name: 'Browse plans on heyatli.com' }))
      .toHaveAttribute('href', `https://heyatli.com/?referral=${CONFIG.widget.referral}`);
    await expect(page.locator('[data-widget-frame]')).toHaveAttribute('data-state', 'failed');
  });

  test('falls back when the script loads but the widget never answers', async ({ page }) => {
    await withConfig(page, c => { c.widget.fallbackAfterMs = 1500; });
    await stubWidget(page, '/* loads, mounts nothing */');
    await page.goto('./');
    await page.locator('#plans').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-widget-fallback]')).toBeVisible({ timeout: 8000 });
  });

  test('loads Atli’s real widget once, with the supplied settings', async ({ page }) => {
    test.skip(!!process.env.OFFLINE, 'OFFLINE=1');
    const errors = watchErrors(page);
    await page.goto('./');
    await page.locator('#plans').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-widget-frame]')).toHaveAttribute('data-state', 'ready', { timeout: 30000 });
    await expect(page.locator(`script[src="${CONFIG.widget.scriptUrl}"]`)).toHaveCount(1);
    await expect(page.locator('#atli-esim-widget iframe')).toHaveCount(1);
    expect(await page.evaluate(() => window.HeyAtli.instances.length)).toBe(1);
    const src = new URL(await page.locator('#atli-esim-widget iframe').getAttribute('src'));
    expect(src.origin + src.pathname).toBe('https://embed.heyatli.com/embed/');
    expect(src.searchParams.get('referral')).toBe('LIBERLAND');
    expect(src.searchParams.get('theme')).toBe('light');
    expect(src.searchParams.get('theme_priority')).toBe('widget');
    expect(src.searchParams.get('css')).toBe('https://embed.heyatli.com/themes/liberty.css');
    await expect(page.locator('[data-widget-fallback]')).toBeHidden();
    // Fits the screen: the iframe is no wider than its frame, and the page does not scroll sideways.
    const fit = await page.evaluate(() => {
      const f = document.querySelector('#atli-esim-widget iframe').getBoundingClientRect();
      const box = document.querySelector('[data-widget-frame]').getBoundingClientRect();
      return { inside: f.left >= box.left - 1 && f.right <= box.right + 1, h: f.height, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    expect(fit.inside).toBe(true);
    // The first resize arrives before the plan list has rendered; wait for the full height.
    await expect.poll(() => page.locator('#atli-esim-widget iframe').evaluate(f => f.getBoundingClientRect().height), { timeout: 20000 })
      .toBeGreaterThan(400);
    expect(fit.overflow).toBe(false);
    // The frame shows Atli's plan list and the widget's referral banner.
    const widget = page.frameLocator('#atli-esim-widget iframe');
    await expect(widget.getByText('LIBERLAND', { exact: true }).first()).toBeVisible({ timeout: 20000 });
    expect(errors).toEqual([]);
  });
});
