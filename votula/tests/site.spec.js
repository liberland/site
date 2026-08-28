const { test, expect } = require('@playwright/test');

// The site is React-over-Babel with no build step, so the failure mode that
// matters most is "a page silently renders nothing". These tests check that
// every page mounts, that the shared chrome is present, and that nothing
// pushes the layout off a phone screen.

const PAGES = [
  { path: '/', page: 'home', heading: 'VOTULA' },
  { path: '/property.html', page: 'property', heading: 'Deeds, cut into pieces' },
  { path: '/llm.html', page: 'llm', heading: 'LLM, and the reserves behind it' },
  { path: '/builders.html', page: 'builders', heading: 'Build the parts we would rather not' },
  { path: '/company.html', page: 'company', heading: 'Registered in Victoria' },
  { path: '/docs.html', page: 'docs', heading: 'Read it before you deploy it' },
  { path: '/brand.html', page: 'brand', heading: 'VOTULA' },
];

for (const { path, page: name, heading } of PAGES) {
  test.describe(`${path}`, () => {
    test('mounts, shows its heading, and carries the shared chrome', async ({ page }) => {
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));

      await page.goto(path);
      await page.waitForSelector('#root main');

      await expect(page.locator('h1')).toContainText(heading);
      await expect(page.locator('nav.nav')).toBeVisible();
      await expect(page.locator('footer.footer')).toBeVisible();

      // Brand guardrail: the Liberland endorsement appears in every footer.
      await expect(page.locator('footer').getByText('A Liberland company').first()).toBeVisible();

      expect(errors).toEqual([]);
    });

    test('marks its own nav link as current', async ({ page }) => {
      await page.goto(path);
      await page.waitForSelector('#root main');
      expect(await page.locator('body').getAttribute('data-page')).toBe(name);
      if (name !== 'home' && name !== 'brand') {
        await expect(page.locator(`.nav-links a[aria-current="page"]`)).toHaveCount(1);
      }
    });

    test('does not scroll sideways on a phone', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);
      await page.waitForSelector('#root main');
      const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflows).toBe(false);
    });
  });
}

test('every internal link points at a page that exists', async ({ page }) => {
  // Seven full page loads, each compiling JSX in the browser.
  test.setTimeout(120000);
  const known = new Set(PAGES.map(p => (p.path === '/' ? 'index.html' : p.path.slice(1))));
  for (const { path } of PAGES) {
    await page.goto(path);
    await page.waitForSelector('#root main');
    const hrefs = await page.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
    for (const href of hrefs) {
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) continue;
      const file = href.split('#')[0];
      if (!file) continue;
      expect(known, `${path} links to ${href}`).toContain(file);
    }
  }
});

test('the offerings CTA in the nav reaches the offerings section', async ({ page }) => {
  // Two full page loads, each compiling JSX in the browser.
  test.setTimeout(60000);
  await page.goto('/');
  await page.waitForSelector('#root main');
  await page.locator('.nav-cta').click();
  // `serve` strips the .html extension; the deployed host may not.
  await expect(page).toHaveURL(/property(\.html)?#offerings/);
  await page.waitForSelector('#root main');
  await expect(page.locator('#offerings')).toBeVisible();

  // The fragment must actually be scrolled to, not just present: React
  // renders after the browser has already resolved the hash.
  await expect.poll(
    () => page.evaluate(() => Math.round(document.getElementById('offerings').getBoundingClientRect().top)),
    { timeout: 10000 }
  ).toBeLessThan(200);
});
