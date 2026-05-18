import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('FORM VALIDATION', () => {
  test('should show validation error when crop name is too short', async ({ page }) => {
    await login(page);
    await page.goto('/crops');
    await page.waitForSelector('sigma-table', { timeout: 10000 });

    const inputs = page.locator('sigma-input .sigma-input__el');
    await inputs.nth(0).fill('A');
    await inputs.nth(2).fill('60');
    await inputs.nth(3).fill('10');

    const submitBtn = page.locator('sigma-card').first().locator('button[sigma-btn]').last();
    await submitBtn.click();
    await page.waitForTimeout(500);

    await expect(page.locator('.sigma-input__error').first()).toBeVisible();
  });

  test('should show required validation on lots form when submitting empty', async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();

    await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: `E2E Crop Valid ${ts}`,
        description: 'Test validation',
        estimatedGrowthDays: 60,
        inactivityDaysThreshold: 10,
      },
    });

    await page.goto('/lots');
    await page.waitForSelector('sigma-card', { timeout: 10000 });

    await page.waitForTimeout(1000);

    const submitBtn = page.locator('sigma-card').first().locator('button[sigma-btn]').last();
    await submitBtn.click();
    await page.waitForTimeout(500);

    const errors = page.locator('.sigma-input__error, .native-select-error');
    const count = await errors.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should show required validation on events form', async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();

    const cropResp = await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: `E2E Crop Valid Event ${ts}`,
        description: 'Test event validation',
        estimatedGrowthDays: 60,
        inactivityDaysThreshold: 10,
      },
    });
    const crop = await cropResp.json();

    await page.request.post(`${BACKEND}/api/lots`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: `E2E Lot Valid Event ${ts}`,
        cropId: crop.id,
        startDate: new Date().toISOString(),
        area: 100,
      },
    });

    await page.goto('/events');
    await page.waitForTimeout(2000);

    const lotSelect = page.locator('.native-select').first();
    const lotOptions = await lotSelect.locator('option').allTextContents();
    test.skip(lotOptions.length <= 1, 'No lots available');

    await lotSelect.selectOption({ index: 1 });
    await page.waitForTimeout(500);

    const typeSelect = page.locator('.native-select').nth(1);
    await expect(typeSelect.locator('..').locator('.native-select-error')).not.toBeVisible();

    const submitBtn = page.locator('button[sigma-btn]', { hasText: 'Registrar' });
    if (await submitBtn.isEnabled()) {
      await submitBtn.click();
      await page.waitForTimeout(500);
      const typeError = typeSelect.locator('..').locator('.native-select-error');
      await expect(typeError).toBeVisible();
    }
  });

  test('should create crop successfully with valid data', async ({ page }) => {
    await login(page);
    const ts = Date.now();
    const cropName = `E2E Crop Success ${ts}`;

    await page.goto('/crops');
    await page.waitForSelector('sigma-table', { timeout: 10000 });

    const inputs = page.locator('sigma-input .sigma-input__el');
    await inputs.nth(0).fill(cropName);
    await inputs.nth(1).fill('Valid submission test');
    await inputs.nth(2).fill('60');
    await inputs.nth(3).fill('10');

    const submitBtn = page.locator('sigma-card').first().locator('button[sigma-btn]').last();
    await submitBtn.click();

    await page.waitForTimeout(1500);
    await page.waitForSelector('sigma-table tbody tr', { timeout: 5000 });

    const newRow = page.locator('sigma-table tbody tr').filter({ hasText: cropName });
    await expect(newRow).toBeVisible({ timeout: 5000 });
  });
});
