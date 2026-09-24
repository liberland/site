const { test, expect } = require('@playwright/test');

// The site is React-over-Babel with no build step, so the failure mode that
// matters most is "a page silently renders nothing". These tests check that
// every page mounts, that the shared chrome is present, and that nothing
// pushes the layout off a phone screen.

const PAGES = [
  { path: '/', page: 'home', heading: 'VOTULA' },
  { path: '/protocol.html', page: 'protocol', heading: 'A constitution you can compile' },
  { path: '/property.html', page: 'property', heading: 'Deeds, cut into pieces' },
  { path: '/llm.html', page: 'llm', heading: 'Merit is collateral, not currency' },
  { path: '/builders.html', page: 'builders', heading: 'Build the parts we would rather not' },
  { path: '/company.html', page: 'company', heading: 'Registered in Seychelles since 2014' },
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
  // Eight full page loads, each compiling JSX in the browser.
  test.setTimeout(150000);
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

test('protocol figures come from the frozen-release block in data.jsx', async ({ page }) => {
  await page.goto('/protocol.html');
  await page.waitForSelector('#root main');

  const chain = await page.evaluate(() => window.VT_DATA.CHAIN);
  expect(chain.tag).toBe('audit-freeze-2026-08-03');

  // The release link, the tag and the headline evidence must all be on the page.
  await expect(page.locator(`a[href="${chain.release}"]`).first()).toBeVisible();
  await expect(page.getByText(chain.tag).first()).toBeVisible();
  await expect(page.getByText(chain.evidence.testsPassed, { exact: false }).first()).toBeVisible();

  // Honesty guardrail: the page must not claim an external audit it has not had.
  const body = await page.locator('body').innerText();
  expect(body).toContain('Not approved for Ethereum mainnet launch');
});

test('wide parameter tables scroll inside their own box', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/protocol.html');
  await page.waitForSelector('#root main');
  const count = await page.locator('.table-wrap').count();
  expect(count).toBeGreaterThan(0);
  const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflows).toBe(false);
});

test('the billing details are on the company page and copy to the clipboard', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/company.html');
  await page.waitForSelector('#root main');

  const legal = await page.evaluate(() => window.VT_DATA.LEGAL);

  // The registered office is on Ile du Port, Mahe. Victoria is where the
  // Registrar sits, and an earlier version of this site confused the two.
  expect(legal.officeOneLine).toContain('Ile du Port');
  expect(legal.number).toBe('156846');

  const billing = page.locator('#billing');
  await expect(billing).toBeVisible();
  for (const fact of [legal.legalName, legal.number, legal.incorporated, legal.officeOneLine]) {
    await expect(billing.getByText(fact, { exact: false }).first()).toBeVisible();
  }

  await billing.locator('.copyblock-btn').click();
  await expect(billing.locator('.copyblock-btn')).toContainText('Copied');
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toBe(legal.billingBlock);
  expect(clip).toContain('Company No. 156846');
});

test('every page footer carries the registration record', async ({ page }) => {
  // Four representative pages rather than all eight: this is shared chrome.
  test.setTimeout(90000);
  for (const path of ['/', '/protocol.html', '/company.html', '/docs.html']) {
    await page.goto(path);
    await page.waitForSelector('#root main');
    const footer = page.locator('footer.footer');
    await expect(footer.getByText('Seychelles IBC No. 156846').first()).toBeVisible();
    await expect(footer.getByText('House of Francis, Room 303, Ile du Port, Mahe, Seychelles'.replace('Mahe', 'Mah\u00e9')).first()).toBeVisible();
  }
});
