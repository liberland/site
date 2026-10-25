const { test, expect } = require('@playwright/test');

const MEMBERSHIP_MAIL = 'mailto:info@liberland.org?subject=Liberland%20Limited%20membership%20enquiry';

async function open(page, path = '/') {
  await page.goto(path);
  await page.waitForSelector('#faq');
}

test.describe('Trust and identity', () => {
  test('company identity and registered office are shown, with a registry link', async ({ page }) => {
    await open(page);
    const company = page.locator('#company');
    await expect(company.getByRole('heading', { name: /A registered company/ })).toBeVisible();
    await expect(company).toContainText('64816138');
    await expect(company).toContainText('64816138-000');
    await expect(company).toContainText('Room 1601, 16th Floor, Wing On Centre, 111 Connaught Road Central, Hong Kong');
    const verify = company.getByRole('link', { name: /Verify our company registration/ });
    await expect(verify).toHaveAttribute('href', 'https://www.cr.gov.hk/en/electronic/e-servicesportal/e-search.htm');
    await expect(page.locator('footer')).toContainText('Liberland Limited · Hong Kong · BRN 64816138');
    await expect(page.locator('#contact')).toContainText('registered office. It should not be understood as a public visitor centre');
  });

  test('no invented events, prices, scarcity or luxury claims remain', async ({ page }) => {
    await open(page);
    const text = await page.locator('body').innerText();
    for (const banned of [
      /salon/i, /Floating Man/i, /Anniversary/i, /27\s*[—–-]\s*30 December/, /Most chosen/i,
      /\bplaces\b.*\b(240|80)\b|\b(240|80) places/i, /12 seats/i, /lifetime/i, /concierge/i,
      /VIP/i, /€|\$\s?\d/, /m²/, /brokerage fee/i, /kept by hand/i, /Six to eight/i,
      /1,240/, /within a working week/i, /Director's office/i,
    ]) {
      expect(text, `found ${banned}`).not.toMatch(banned);
    }
  });

  test('structured data describes only the company', async ({ page }) => {
    await page.goto('/');
    const json = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
    expect(json['@type']).toBe('Organization');
    expect(json.identifier.value).toBe('64816138');
    expect(JSON.stringify(json)).not.toMatch(/Event/);
    await expect(page).toHaveTitle('Liberland Limited | Membership, Community & Danube Experiences');
  });
});

test.describe('Membership enquiry', () => {
  test('hero and nav lead to membership, and the CTA is a working enquiry email', async ({ page }) => {
    await open(page);
    await expect(page.locator('.hero-actions a', { hasText: 'Explore Membership' })).toHaveAttribute('href', '#membership');
    await expect(page.locator('.hero-actions a', { hasText: 'Visit the Danube' })).toHaveAttribute('href', '#visit');
    const cta = page.locator('#membership').getByRole('link', { name: /Ask About Membership/ });
    await expect(cta).toHaveAttribute('href', MEMBERSHIP_MAIL);
    await expect(page.locator('#membership')).toContainText('does not, by itself, provide a passport');
    await expect(page.locator('#membership').getByRole('link', { name: /Liberland E-Residency and citizenship/ }))
      .toHaveAttribute('href', 'https://liberland.org/faq');
  });

  test('there are no payment controls or fake forms', async ({ page }) => {
    await open(page);
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.locator('input')).toHaveCount(0);
    const controls = /pay|checkout|ticket|subscribe|apply for|buy/i;
    await expect(page.getByRole('button', { name: controls })).toHaveCount(0);
    await expect(page.getByRole('link', { name: controls })).toHaveCount(0);
  });
});

test.describe('Events', () => {
  test('both Ark Village events are listed before they take place, credited to Ark Village', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-10-25T12:00:00'));
    await open(page);
    const events = page.locator('#events article');
    await expect(events).toHaveCount(2);
    await expect(events.nth(0)).toContainText('Longevity Ark Retreat');
    await expect(events.nth(0)).toContainText('21–22 November 2026');
    await expect(events.nth(0)).toContainText('Organised by Ark Village');
    await expect(events.nth(0).getByRole('link', { name: /Event Details/ })).toHaveAttribute('href', 'https://ark.ll.land/events/longevity-retreat');
    await expect(events.nth(1)).toContainText('12–13 December 2026');
  });

  test('a finished event disappears the next day', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-11-23T09:00:00'));
    await open(page);
    await expect(page.locator('#events article')).toHaveCount(1);
    await expect(page.locator('#events')).not.toContainText('Longevity');
  });

  test('with nothing upcoming, only the organiser calendar remains', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-12-14T09:00:00'));
    await open(page);
    await expect(page.locator('#events article')).toHaveCount(0);
    await expect(page.locator('#events').getByRole('link', { name: /Full Ark Village Calendar/ }))
      .toHaveAttribute('href', 'https://ark.ll.land/events');
  });
});

test.describe('Links and navigation', () => {
  test('nav has the agreed sections and every in-page link has a target', async ({ page }) => {
    await open(page);
    const ids = await page.$$eval('a[href^="#"]', as => as.map(a => a.getAttribute('href').slice(1)));
    for (const id of new Set(ids)) {
      await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);
    }
    const labels = ['About', 'Membership', 'Visit & Events', 'Company & Contact', 'FAQ'];
    const nav = page.locator('nav[aria-label="Main"]');
    if (await nav.locator('.mob-toggle').isVisible()) await nav.locator('.mob-toggle').click();
    for (const l of labels) await expect(nav.getByRole('link', { name: l, exact: true })).toBeVisible();
  });

  test('external links open safely in a new tab', async ({ page }) => {
    await open(page);
    const bad = await page.$$eval('a[href^="http"]', as => as
      .filter(a => a.target !== '_blank' || !/noopener/.test(a.rel))
      .map(a => a.href));
    expect(bad).toEqual([]);
  });

  test('old and new deep links land on their sections', async ({ page }) => {
    await page.goto('/#contact');
    await expect(page.locator('#contact h2')).toBeInViewport();
    await page.goto('/#residences');
    await page.reload();
    await expect(page.locator('#visit h2')).toBeInViewport();
  });

  test('privacy and terms pages exist and are linked from the footer', async ({ page, request }) => {
    for (const [path, heading] of [['/privacy/', 'Privacy Notice'], ['/terms/', 'Website Information and Terms of Use']]) {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
      await expect(page.locator('main')).toContainText('Last updated: 25 October 2026');
      await expect(page.locator('main')).toContainText('64816138');
    }
    await open(page);
    await expect(page.locator('footer').getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', 'privacy/');
    await expect(page.locator('footer').getByRole('link', { name: 'Terms' })).toHaveAttribute('href', 'terms/');
  });

  test('the old pitch deck and PDF are no longer published', async ({ request }) => {
    expect((await request.get('/Pitch%20Deck.html')).status()).toBe(404);
    expect((await request.get('/assets/liberland-limited-company-introduction.pdf')).status()).toBe(404);
  });
});

test.describe('Quality', () => {
  test('nothing is loaded from third-party servers', async ({ page }) => {
    const foreign = [];
    page.on('request', r => { if (!r.url().startsWith('http://localhost:3737')) foreign.push(r.url()); });
    await open(page);
    await page.waitForLoadState('networkidle');
    expect(foreign).toEqual([]);
  });

  test('no horizontal overflow and no script errors', async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await open(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test('FAQ answers open with the keyboard', async ({ page }) => {
    await open(page);
    const first = page.locator('#faq summary').first();
    await first.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#faq details').first()).toHaveAttribute('open', '');
    await expect(page.locator('#faq')).toContainText('Hong Kong-registered company associated with the Liberland community');
  });
});
