import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('ROLE ADMIN — Full Access', () => {
  let testCropName: string;
  let testLotName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();
    testCropName = `E2E Admin Crop ${ts}`;
    testLotName = `E2E Admin Lot ${ts}`;

    const cropResp = await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testCropName,
        description: 'Admin role test',
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

  test('should show edit and delete buttons on crops table for ADMIN', async ({ page }) => {
    await page.goto('/crops');
    await page.waitForSelector('sigma-table tbody tr', { timeout: 10000 });

    const cropRow = page.locator('sigma-table tbody tr').filter({ hasText: testCropName });
    await expect(cropRow.locator('button[title="Editar"]')).toBeVisible();
    await expect(cropRow.locator('button[title="Eliminar"]')).toBeVisible();
  });

  test('should show edit button on lots table for ADMIN', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    const lotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    await expect(lotRow.locator('button[title="Editar"]')).toBeVisible();
  });
});
