// End-to-end tests for /form: the whole signing flow in a real browser, plus verification.
//   npm test            (OFFLINE=1 npm test skips the one test that calls the public timestamp authority)
const { test, expect } = require('@playwright/test');

const TSA = 'https://rfc3161.ai.moda/**';

async function enroll(page, name = 'Jana Svobodová', id = 'LL-2026-004711') {
  await page.goto('./');
  await page.fill('#kyc-name', name);
  await page.fill('#kyc-id', id);
  await page.click('#kyc-form button[type=submit]');
  await page.click('[data-act="create-key"]');
  await expect(page.locator('#step-2')).toHaveAttribute('data-state', 'done');
  await page.click('[data-act="request-cert"]');
  await expect(page.locator('#step-3')).toHaveAttribute('data-state', 'done');
}

async function signSample(page, { tsa }) {
  await page.click('[data-act="sample"]');
  await expect(page.getByTestId('doc-hash')).toBeVisible();
  if (!tsa) await page.uncheck('#tsa-toggle');
  await page.click('[data-act="send"]');
  await expect(page.locator('#phone-sub')).toHaveText('Signing request');
  // The phone shows the same fingerprint as xNotary.
  const hash = (await page.getByTestId('doc-hash').innerText()).replace(/\s/g, '');
  await expect(page.locator('#phone-body')).toContainText(hash.slice(0, 4));
  await page.click('[data-act="approve"]');
  await expect(page.locator('#step-6')).toHaveAttribute('data-state', 'done', { timeout: 30000 });
}

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (e) => { throw e; });
});

test('page loads at /form/ with its assets and no horizontal overflow', async ({ page }) => {
  const bad = [];
  page.on('response', (r) => { if (r.status() >= 400) bad.push(r.url()); });
  await page.goto('./');
  await expect(page.locator('h1')).toContainText('Liberland');
  await expect(page.locator('#kyc-name')).toBeVisible();
  expect(bad).toEqual([]);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('private key is non-extractable and survives a reload', async ({ page }) => {
  await enroll(page);
  await page.click('[data-act="export-test"]');
  await expect(page.locator('#step-2')).toContainText('Refused by the browser');
  await page.reload();
  await expect(page.locator('#step-3')).toHaveAttribute('data-state', 'done');
  await expect(page.locator('#phone-sub')).toHaveText('Wallet');
});

test('signs a sample PDF and the verifier confirms it; tampering is detected', async ({ page }) => {
  await page.route(TSA, (r) => r.abort());
  await enroll(page);
  await signSample(page, { tsa: false });
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="dl-signed"]')]);
  expect(dl.suggestedFilename()).toBe('liberland-sample-agreement-signed.pdf');

  await page.click('[data-act="verify-signed"]');
  const report = page.locator('#verify-report');
  await expect(report).toContainText('Valid · Liberland identity');
  await expect(report).toContainText('Jana Svobodová');
  await expect(report).toContainText('LL-2026-004711');
  await expect(report).toContainText('Document unchanged since signing');
  await expect(report).toContainText('No timestamp');

  // Flip one signed byte and verify again.
  await page.evaluate(() => {
    const s = window.__llEsign.state;
    const b = new Uint8Array(s.signed.bytes);
    b[200] ^= 1;
    window.__llEsign.verifyBytes('tampered.pdf', b);
  });
  await expect(report).toContainText('Document changed after signing');
  await expect(report).toContainText('Invalid');
});

test('a revoked certificate cannot sign and is flagged by the verifier', async ({ page }) => {
  await page.route(TSA, (r) => r.abort());
  await enroll(page, 'Petr Novák', 'LL-2026-000042');
  await signSample(page, { tsa: false });
  await page.click('#step-3 [data-act="revoke"]');
  await page.click('[data-act="verify-signed"]');
  await expect(page.locator('#verify-report')).toContainText('Certificate revoked');
  await page.click('[data-act="reset-doc"]');
  await page.click('[data-act="sample"]');
  await page.click('[data-act="send"]');
  await expect(page.locator('#phone-body')).toContainText('revoked');
  await expect(page.locator('[data-act="approve"]')).toBeDisabled();
});

test('uploads an existing PDF from disk and signs it', async ({ page }) => {
  await page.route(TSA, (r) => r.abort());
  await enroll(page);
  await page.setInputFiles('#doc-file', require('path').join(__dirname, 'fixtures', 'external.pdf'));
  await expect(page.getByTestId('doc-hash')).toBeVisible();
  await expect(page.locator('#step-4')).toContainText('external.pdf');
  await page.click('[data-act="send"]');
  await page.click('[data-act="approve"]');
  await expect(page.locator('#step-6')).toHaveAttribute('data-state', 'done', { timeout: 30000 });
  // With the TSA unreachable, the signature is still made, without a timestamp.
  await expect(page.locator('#step-6')).toContainText('Not added');
  await page.click('[data-act="verify-signed"]');
  await expect(page.locator('#verify-report')).toContainText('Valid · Liberland identity');
});

test('an unsigned PDF is reported as unsigned', async ({ page }) => {
  await page.goto('./');
  await page.setInputFiles('#verify-file', require('path').join(__dirname, 'fixtures', 'external.pdf'));
  await expect(page.locator('#verify-report')).toContainText('No digital signature found');
});

test('real RFC 3161 timestamp from the public TSA', async ({ page }, info) => {
  test.skip(!!process.env.OFFLINE, 'OFFLINE=1');
  test.skip(info.project.name !== 'desktop', 'one networked run is enough');
  await enroll(page);
  await signSample(page, { tsa: true });
  await expect(page.locator('#step-6')).not.toContainText('Not added');
  await page.click('[data-act="verify-signed"]');
  await expect(page.locator('#verify-report')).toContainText('Signed no later than');
  await expect(page.locator('#verify-report')).toContainText('Independent RFC 3161 timestamp');
});
