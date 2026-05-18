import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('LOTS FILTER', () => {
  let testCropName: string;
  let testLotName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();
    testCropName = `E2E Crop Filter ${ts}`;
    testLotName = `E2E Lot Filter ${ts}`;

    const cropResp = await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testCropName,
        description: 'Test for lots filter',
        estimatedGrowthDays: 60,
        inactivityDaysThreshold: 10,
      },
    });
    const crop = await cropResp.json();

    await page.request.post(`${BACKEND}/api/lots`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testLotName,
        cropId: crop.id,
        startDate: new Date().toISOString(),
        area: 100,
      },
    });

    await page.goto('/lots');
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
  });

  test('should display filter bar with status options', async ({ page }) => {
    const filterSelect = page.locator('.filter-bar__select');
    await expect(filterSelect).toBeVisible();

    const options = await filterSelect.locator('option').allTextContents();
    expect(options).toContain('Todos los estados');
    expect(options).toContain('Creado');
    expect(options).toContain('En producción');
    expect(options).toContain('Finalizado');
  });

  test('should filter lots and show created lot with CREATED status', async ({ page }) => {
    await page.locator('.filter-bar__select').selectOption('CREATED');
    await page.waitForTimeout(500);

    const lotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    await expect(lotRow).toBeVisible({ timeout: 5000 });
    await expect(lotRow.locator('sigma-badge')).toContainText('Creado');
  });

  test('should show empty state when filtering by FINISHED status', async ({ page }) => {
    await page.locator('.filter-bar__select').selectOption('FINISHED');
    await page.waitForTimeout(1000);

    const testLotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    const testLotPresent = await testLotRow.count();
    expect(testLotPresent).toBe(0);

    const rows = page.locator('table tbody tr').count();
    const tablePresent = await page.locator('table tbody tr').count();
    if (tablePresent === 0) {
      await expect(page.locator('sigma-empty-state').first()).toBeVisible();
    }
  });
});
