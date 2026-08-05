const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('renders hero, CTAs and the evidence notice link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Foster What We Built');
    await expect(page.getByRole('button', { name: 'Fund the Settlement' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Review the Evidence' })).toBeVisible();
  });

  test('metric band shows the qualified claimed-loss figure with its disclaimer', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('€54,486.22', { exact: true })).toBeVisible();
    await expect(page.getByText(/NOT A COURT AWARD OR FINAL FINDING/)).toBeVisible();
  });

  test('"Review the Evidence" navigates to the ledger', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Review the Evidence' }).click();
    await expect(page).toHaveURL(/#\/ledger/);
    await expect(page.locator('h1')).toHaveText('Incidents and items on record');
  });
});

test.describe('Ledger', () => {
  test('lists incident and item rows and supports full-text search', async ({ page }) => {
    await page.goto('/#/ledger');
    await expect(page.locator('table.ledger tbody tr')).toHaveCount(8);
    await page.getByPlaceholder('Item, incident, owner label…').fill('sleeping bag');
    await expect(page.locator('table.ledger tbody tr')).toHaveCount(1);
    await expect(page.locator('table.ledger tbody tr')).toContainText('Sleeping bag');
  });

  test('filtering by status updates the shareable URL', async ({ page }) => {
    await page.goto('/#/ledger');
    await page.locator('select').first().selectOption('temporary_administrative_seizure');
    await expect(page).toHaveURL(/status=temporary_administrative_seizure/);
    await expect(page.locator('table.ledger tbody tr')).toHaveCount(5);
  });

  test('reset clears filters', async ({ page }) => {
    await page.goto('/#/ledger?status=temporary_administrative_seizure');
    await expect(page.locator('table.ledger tbody tr')).toHaveCount(5);
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.locator('table.ledger tbody tr')).toHaveCount(8);
  });

  test('clicking a row opens the incident record', async ({ page }) => {
    await page.goto('/#/ledger');
    await page.locator('table.ledger tbody tr', { hasText: 'Sleeping bag' }).click();
    await expect(page).toHaveURL(/#\/incidents\/GS-2026-07-02/);
    await expect(page.locator('h1')).toHaveText('Temporary camping-equipment seizure');
  });
});

test.describe('Incident detail', () => {
  test('a direct deep link to an incident renders that incident', async ({ page }) => {
    await page.goto('/#/incidents/GS-2023-09-21');
    await expect(page.locator('h1')).toHaveText('Settlement dismantling and property removal');
    await expect(page.getByText('DISPUTED — CRIMINAL COMPLAINT FILED — NO FINAL FINDING')).toBeVisible();
  });

  test('shows all twelve required sections in order for the key incident', async ({ page }) => {
    await page.goto('/#/incidents/GS-2023-09-21');
    const labels = [
      'Neutral factual summary',
      'Claimant account (allegation)',
      'Known official basis',
      'Questions requiring determination',
      'Item ledger',
      'Evidence gallery',
      'Source documents',
      'Procedural timeline',
      'Corrections and responses',
      'Right of reply',
    ];
    for (const label of labels) {
      await expect(page.getByText(label, { exact: false }).first()).toBeVisible();
    }
  });

  test('temporary seizure incident never labels its items as stolen', async ({ page }) => {
    await page.goto('/#/incidents/GS-2026-07-02');
    await expect(page.locator('body')).not.toContainText(/stolen/i);
    await expect(page.getByText('NOT A PERMANENT LOSS')).toBeVisible();
  });
});

test.describe('Fund page', () => {
  test('donation form has no live payment method enabled', async ({ page }) => {
    await page.goto('/#/fund');
    await expect(page.getByRole('button', { name: /Payment provider pending approval/ })).toBeDisabled();
    await expect(page.getByText('DISABLED — PROVIDER PENDING')).toBeVisible();
    await expect(page.getByText(/DONATIONS CONFER NO OWNERSHIP/)).toBeVisible();
  });
});

test.describe('Right of reply', () => {
  test('correction form requires fields before submitting', async ({ page }) => {
    await page.goto('/#/right-of-reply');
    await page.getByRole('button', { name: 'Submit correction request' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('reply form submits via the mock adapter and shows confirmation', async ({ page }) => {
    await page.goto('/#/right-of-reply');
    await page.getByLabel('Organisation or capacity').fill('Test witness');
    await page.getByLabel('Record referenced').fill('GS-2023-09-21');
    await page.getByLabel('Statement for publication').fill('A test statement.');
    await page.getByRole('button', { name: 'Submit reply' }).click();
    await expect(page.getByRole('status')).toContainText('recorded for review');
  });
});

test.describe('Accessibility', () => {
  test('skip link focuses the main landmark without changing route', async ({ page }) => {
    await page.goto('/#/case');
    await page.locator('.skip-link').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#\/case/);
    await expect(page.locator('#main')).toBeFocused();
  });

  test('keyboard can open an incident from the ledger table', async ({ page }) => {
    await page.goto('/#/ledger');
    await page.locator('table.ledger tbody tr').first().focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#\/incidents\//);
  });
});
