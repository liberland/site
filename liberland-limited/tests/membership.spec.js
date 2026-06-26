const { test, expect } = require('@playwright/test');

test.describe('Become a member buttons scroll to membership section', () => {
  test('hero button links to #membership', async ({ page }) => {
    await page.goto('/');
    const heroBtn = page.locator('.hero-actions a').filter({ hasText: 'Become a member' });
    await expect(heroBtn).toHaveAttribute('href', '#membership');
  });

  test('nav button links to #membership', async ({ page }) => {
    await page.goto('/');
    const navBtn = page.locator('nav a.btn').filter({ hasText: 'Become a member' });
    await expect(navBtn).toHaveAttribute('href', '#membership');
  });

  test('hero button scrolls to membership section', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#membership');
    await page.locator('.hero-actions a').filter({ hasText: 'Become a member' }).click();
    await expect(page).toHaveURL(/#membership/);
    await expect(page.locator('#membership')).toBeVisible();
  });
});

test.describe('Apply buttons open tailored mailto links', () => {
  const TIERS = [
    {
      name: 'Silver',
      subjectFragment: 'Silver Membership Application',
      bodyFragment: 'annual ($150)',
    },
    {
      name: 'Gold',
      subjectFragment: 'Gold Membership Application',
      bodyFragment: 'annual ($1,000)',
    },
    {
      name: 'Platinum',
      subjectFragment: 'Platinum Membership Application',
      bodyFragment: 'annual ($10,000)',
    },
    {
      name: 'Founder',
      subjectFragment: 'Founder Membership Enquiry',
      bodyFragment: 'annual ($20,000)',
    },
  ];

  for (const tier of TIERS) {
    test(`${tier.name} apply button has correct mailto`, async ({ page }) => {
      await page.goto('/');

      // Wait for React to render the membership section
      await page.waitForSelector('#membership');
      const applyLink = page.locator('a[href*="mailto:info@liberland.org"]').filter({ hasText: `Apply for ${tier.name}` });
      await expect(applyLink).toBeVisible();

      const href = await applyLink.getAttribute('href');
      const decoded = decodeURIComponent(href);

      expect(decoded).toContain('mailto:info@liberland.org');
      expect(decoded).toContain(tier.subjectFragment);
      expect(decoded).toContain(tier.bodyFragment);
      expect(decoded).toContain('[Your name]');
    });
  }
});

test.describe('Membership section is reachable and shows all four tiers', () => {
  test('membership section exists and shows four tier apply links', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#membership');
    const applyLinks = page.locator('a[href*="mailto:info@liberland.org"]');
    await expect(applyLinks).toHaveCount(4);
  });
});
