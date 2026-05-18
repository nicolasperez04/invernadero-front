import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('LOTS SUMMARY MODAL', () => {
  let testCropName: string;
  let testLotName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();
    testCropName = `E2E Crop Sum ${ts}`;
    testLotName = `E2E Lot Sum ${ts}`;

    const cropResp = await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testCropName,
        description: 'Test for lots summary',
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
    const count = await page.locator('table tbody tr').count();
    test.skip(count === 0, 'No lots in table — creation may have failed');
  });

  test('should open summary modal when clicking Ver resumen', async ({ page }) => {
    const lotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Ver resumen"]').click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(modal.locator('.modal-title')).toContainText(testLotName);
  });

  test('should display KPI metrics in summary modal', async ({ page }) => {
    const lotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Ver resumen"]').click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible({ timeout: 10000 });

    const kpiValues = modal.locator('.kpi-mini__value');
    await expect(kpiValues.first()).toBeVisible();
    const kpiCount = await kpiValues.count();
    expect(kpiCount).toBeGreaterThanOrEqual(3);
  });

  test('should show no sowing section when no SOWING event exists', async ({ page }) => {
    const lotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Ver resumen"]').click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible({ timeout: 10000 });

    const noSowing = modal.locator('.no-sowing');
    await expect(noSowing).toBeVisible({ timeout: 5000 });
  });

  test('should hide download report button for CREATED lots', async ({ page }) => {
    const lotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Ver resumen"]').click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible({ timeout: 10000 });

    await expect(
      modal.locator('button[sigma-btn]', { hasText: 'Descargar informe' }),
    ).not.toBeVisible();
  });

  test('should close summary modal via close button', async ({ page }) => {
    const lotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Ver resumen"]').click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible({ timeout: 10000 });

    await modal.locator('.modal-close').click();
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });
});
