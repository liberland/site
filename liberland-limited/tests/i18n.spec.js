const { test, expect } = require('@playwright/test');

async function ready(page) {
  await page.waitForSelector('#faq');
}

test.describe('Chinese page', () => {
  test.use({ locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });

  test('renders in Simplified Chinese with the company identity', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-10-25T12:00:00'));
    await page.goto('/zh/');
    await ready(page);
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans');
    await expect(page.locator('h1')).toContainText('结识社区成员');
    await expect(page.locator('#company')).toContainText('64816138');
    await expect(page.locator('#company')).toContainText('Room 1601, 16th Floor, Wing On Centre, 111 Connaught Road Central, Hong Kong');
    await expect(page.locator('#events article').first()).toContainText('2026年11月21日至22日');
    await expect(page.locator('#events article').first()).toContainText('由 Ark Village 组织');
    await expect(page.locator('#membership').getByRole('link', { name: /咨询会员事宜/ }))
      .toHaveAttribute('href', 'mailto:info@liberland.org?subject=Liberland%20Limited%20membership%20enquiry');
    const text = await page.locator('body').innerText();
    expect(text).not.toMatch(/沙龙|Salon|€|\$\s?\d|名额有限|终身/);
  });

  test('in-page links resolve, external links are safe, nothing third-party loads', async ({ page }) => {
    const foreign = [];
    page.on('request', r => { if (!r.url().startsWith('http://localhost:3737')) foreign.push(r.url()); });
    await page.goto('/zh/');
    await ready(page);
    const ids = await page.$$eval('a[href^="#"]', as => as.map(a => a.getAttribute('href').slice(1)));
    for (const id of new Set(ids)) await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);
    const bad = await page.$$eval('a[href^="http"]', as => as.filter(a => a.target !== '_blank' || !/noopener/.test(a.rel)).map(a => a.href));
    expect(bad).toEqual([]);
    await page.waitForLoadState('networkidle');
    expect(foreign).toEqual([]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('Chinese privacy and terms pages exist and link back to English', async ({ page, request }) => {
    for (const [path, heading, en] of [['/zh/privacy/', '隐私声明', '/privacy/'], ['/zh/terms/', '网站信息及使用条款', '/terms/']]) {
      expect((await request.get(path)).status()).toBe(200);
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
      await expect(page.locator('main')).toContainText('2026年10月25日');
      await page.locator('.lang-switch a[hreflang="en"]').click();
      await expect(page).toHaveURL(new RegExp(`${en}$`));
    }
    await page.goto('/zh/');
    await ready(page);
    await page.locator('footer').getByRole('link', { name: '隐私' }).click();
    await expect(page).toHaveURL(/\/zh\/privacy\/$/);
  });
});

test.describe('Automatic language choice on the home page', () => {
  test.describe('Simplified Chinese browser', () => {
    test.use({ locale: 'zh-CN', timezoneId: 'Europe/Prague' });
    test('goes to the Chinese page, keeping the section', async ({ page }) => {
      await page.goto('/#contact');
      await expect(page).toHaveURL(/\/zh\/#contact$/);
      await ready(page);
    });
  });

  test.describe('English browser in mainland China time zone', () => {
    test.use({ locale: 'en-US', timezoneId: 'Asia/Shanghai' });
    test('goes to the Chinese page', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/zh\/$/);
    });
  });

  test.describe('English browser elsewhere', () => {
    test.use({ locale: 'en-US', timezoneId: 'America/New_York' });
    test('stays in English', async ({ page }) => {
      await page.goto('/');
      await ready(page);
      await expect(page).toHaveURL(/\/$/);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    });
  });

  test.describe('Traditional Chinese browser in Taipei', () => {
    test.use({ locale: 'zh-TW', timezoneId: 'Asia/Taipei' });
    test('stays in English (only Simplified Chinese is offered)', async ({ page }) => {
      await page.goto('/');
      await ready(page);
      await expect(page).toHaveURL(/\/$/);
    });
  });

  test.describe('Visitor in China who picks English', () => {
    test.use({ locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
    test('the flag switch wins and is remembered', async ({ page }) => {
      await page.goto('/');
      await expect(page).toHaveURL(/\/zh\/$/);
      await ready(page);
      await page.locator('nav .lang-switch a[hreflang="en"]').click();
      await expect(page).toHaveURL(/localhost:3737\/$/);
      await ready(page);
      await page.goto('/');
      await ready(page);
      await expect(page).toHaveURL(/localhost:3737\/$/);
      await expect(page.locator('h1')).toContainText('Meet the people');
    });
  });

  test.describe('English visitor who picks Chinese', () => {
    test.use({ locale: 'en-GB', timezoneId: 'Europe/London' });
    test('lands on the Chinese page and stays there', async ({ page }) => {
      await page.goto('/');
      await ready(page);
      await expect(page.locator('nav .lang-switch a[aria-current="true"]')).toHaveAttribute('hreflang', 'en');
      await page.locator('nav .lang-switch a[hreflang="zh-Hans"]').click();
      await expect(page).toHaveURL(/\/zh\/$/);
      await ready(page);
      await page.goto('/');
      await expect(page).toHaveURL(/\/zh\/$/);
    });
  });
});
