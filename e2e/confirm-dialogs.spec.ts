import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('CONFIRM DIALOGS', () => {
  let testCropName: string;
  let testLotName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();
    testCropName = `E2E Conf Crop ${ts}`;
    testLotName = `E2E Conf Lot ${ts}`;

    const cropResp = await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testCropName,
        description: 'Confirm dialog test',
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
  });

  test('should show confirm dialog when clicking delete on a lot', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForSelector('.filter-bar', { timeout: 10000 });
    await page.waitForSelector('table tbody tr', { timeout: 15000 });

    const lotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Eliminar"]').click();

    await page.waitForTimeout(500);
    const dialogTitle = page.locator('.cdk-overlay-container h2');
    await expect(dialogTitle).toBeVisible({ timeout: 5000 });
  });

  test('should cancel deletion and keep lot in table', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForSelector('.filter-bar', { timeout: 10000 });
    await page.waitForSelector('table tbody tr', { timeout: 15000 });

    const lotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Eliminar"]').click();

    await page.waitForTimeout(500);
    const cancelBtn = page.locator('.cdk-overlay-container button', { hasText: 'No' });
    await expect(cancelBtn).toBeVisible({ timeout: 5000 });
    await cancelBtn.click();
    await page.waitForTimeout(500);

    await expect(page.locator('table tbody tr').filter({ hasText: testLotName })).toBeVisible();
  });
});
