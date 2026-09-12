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

test.describe('Documentary imagery', () => {
  test('every photograph carries a visible author, licence and source credit', async ({ page }) => {
    await page.goto('/');
    const figures = page.locator('figure:has(img)');
    // count() takes no part in Playwright's auto-waiting, and this page needs
    // Babel to transform the JSX before any figure exists — so wait on a
    // retrying assertion first, then count.
    await expect(figures.first()).toBeVisible();
    const count = await figures.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const fig = figures.nth(i);
      // Attribution is a licence condition for the CC BY-SA images, so a
      // missing credit line is a compliance failure, not a cosmetic one.
      await expect(fig.locator('.photo__credit')).toBeVisible();
      await expect(fig.locator('.photo__credit a[href*="commons.wikimedia.org"]')).toHaveCount(1);
      await expect(fig.locator('img')).toHaveAttribute('alt', /\w+/);
    }
  });

  test('a photograph that is not of Gornja Siga says so where it is shown', async ({ page }) => {
    await page.goto('/');
    // No freely-licensed photograph of the settlement exists. Anything that
    // isn't the satellite frame must name its real location and distance in
    // the caption the reader actually sees.
    await expect(page.getByText(/about 16 km from Gornja Siga/i)).toBeVisible();
    await expect(page.getByText(/about 10 km downstream of Gornja Siga/i)).toBeVisible();
    await expect(page.getByText(/NO FREELY LICENSED PHOTOGRAPH OF THE SETTLEMENT ITSELF EXISTS/i)).toBeVisible();
  });

  test('an incident record shows no documentary photograph in place of evidence', async ({ page }) => {
    await page.goto('/#/incidents/GS-2023-09-21');
    await expect(page.locator('figure img')).toHaveCount(0);
    await expect(page.getByText(/PENDING REDACTION APPROVAL|REDACTION STATUS NOT APPROVED/).first()).toBeVisible();
  });
});

test.describe("Croatia's costs", () => {
  test('the home page surfaces the cost-of-enforcement section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'What this has cost Croatia' })).toBeVisible();
    await page.getByRole('button', { name: 'Open the cost ledger' }).click();
    await expect(page).toHaveURL(/#\/costs/);
  });

  test('the cost ledger lists every identified cost structure', async ({ page }) => {
    await page.goto('/#/costs');
    await expect(page.locator('h1')).toHaveText('What this has cost Croatia');
    for (const id of ['CC-01', 'CC-02', 'CC-03', 'CC-04', 'CC-05', 'CC-06']) {
      await expect(page.getByText(new RegExp(id))).toBeVisible();
    }
  });

  test('an unsourced cost row shows NEEDS SOURCE and is excluded from the total', async ({ page }) => {
    await page.goto('/#/costs');
    // No official figure is published yet, so the headline total must stay empty
    // rather than showing a fabricated or zeroed-out number.
    // `has` with an exact-text locator, not `hasText`: hasText matches
    // case-insensitively, so it also catches the neighbouring card's
    // "NEVER ADDED TO SOURCED EXPENDITURE" qualifier.
    const sourced = page
      .locator('.card-grid > div')
      .filter({ has: page.getByText('Sourced expenditure', { exact: true }) });
    await expect(sourced.locator('.cost-total__figure')).toHaveText('—');
    await expect(sourced).toContainText('NO OFFICIAL FIGURE PUBLISHED YET');
    await expect(page.getByText('NEEDS SOURCE').first()).toBeVisible();
    await expect(page.getByText(/6 of 6 rows are awaiting an official figure/i)).toBeVisible();
  });

  test('opening a cost row reveals the inputs required to publish a figure', async ({ page }) => {
    await page.goto('/#/costs');
    await page.getByRole('button', { name: /Police attendance at settlement operations/ }).click();
    await expect(page.getByText('INPUTS REQUIRED TO PUBLISH A FIGURE')).toBeVisible();
    await expect(page.getByText(/Published MUP hourly personnel cost/)).toBeVisible();
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

    // Every item on this record carries the temporary-seizure label, and none
    // is presented as stolen or permanently lost.
    const statusCells = page.locator('#item-ledger [data-item-status]');
    await expect(statusCells).toHaveCount(5);
    for (const cell of await statusCells.all()) {
      await expect(cell).toHaveText('TEMPORARY SEIZURE');
    }

    // The page may mention theft only to disclaim it. A bare search for
    // "stolen" cannot express that — it also fires on the disclaimer, which is
    // the very sentence this rule wants present — so assert against the
    // affirmative constructions CONTENT-GUIDE.md prohibits instead.
    const body = page.locator('body');
    for (const prohibited of [
      /\bwas stolen\b/i,
      /\bwere stolen\b/i,
      /\bitems? stolen\b/i,
      /\bproperty stolen\b/i,
      /\btotal stolen\b/i,
      /\bstolen (?:goods|property|items)\b/i,
    ]) {
      await expect(body).not.toContainText(prohibited);
    }
    await expect(page.getByText(/not classified as stolen or permanently lost/i)).toBeVisible();
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
