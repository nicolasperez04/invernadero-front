import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('LOTS EDIT', () => {
  let testCropName: string;
  let testCropId: number;
  let testLotName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();
    testCropName = `E2E Crop Lots ${ts}`;
    testLotName = `E2E Lot Edit ${ts}`;

    const cropResp = await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testCropName,
        description: 'Test crop for lot editing',
        estimatedGrowthDays: 90,
        inactivityDaysThreshold: 10,
      },
    });
    const crop = await cropResp.json();
    testCropId = crop.id;

    await page.request.post(`${BACKEND}/api/lots`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testLotName,
        cropId: testCropId,
        startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
    });

    await page.goto('/lots');
    await page.waitForLoadState('networkidle');
  });

  test('should populate edit form with lot data on edit click', async ({ page }) => {
    await page.waitForSelector('.table-scroll table tbody tr', { timeout: 10000 });
    await expect(page.locator('.table-scroll table')).toContainText(testLotName, { timeout: 5000 });

    const lotRow = page.locator('.table-scroll table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Editar"]').click();

    await expect(page.locator('sigma-card.edit-mode')).toBeVisible();

    const nameInput = page.locator('sigma-card.edit-mode .sigma-input__el').first();
    await expect(nameInput).toHaveValue(testLotName);
  });

  test('should keep crop, start date, and end date disabled during edit', async ({ page }) => {
    await page.waitForSelector('.table-scroll table tbody tr', { timeout: 10000 });

    const lotRow = page.locator('.table-scroll table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Editar"]').click();
    await expect(page.locator('sigma-card.edit-mode')).toBeVisible();

    const inputs = page.locator('sigma-card.edit-mode .sigma-input__el');
    await expect(inputs.nth(0)).toBeEnabled();

    const cropSelect = page.locator('sigma-card.edit-mode select.native-select');
    await expect(cropSelect).toBeDisabled();

    await expect(inputs.nth(1)).toBeDisabled();

    await expect(inputs.nth(2)).toBeDisabled();
  });

  test('should update lot name and show success', async ({ page }) => {
    await page.waitForSelector('.table-scroll table tbody tr', { timeout: 10000 });
    await expect(page.locator('.table-scroll table')).toContainText(testLotName, { timeout: 5000 });

    const lotRow = page.locator('.table-scroll table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Editar"]').click();
    await expect(page.locator('sigma-card.edit-mode')).toBeVisible();

    const updatedName = `${testLotName} Actualizado`;
    const nameInput = page.locator('sigma-card.edit-mode .sigma-input__el').first();
    await nameInput.clear();
    await nameInput.fill(updatedName);

    await page.locator('button[sigma-btn]', { hasText: 'Actualizar' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.table-scroll table')).toContainText(updatedName, {
      timeout: 10000,
    });
  });

  test('should cancel edit and return to create mode', async ({ page }) => {
    await page.waitForSelector('.table-scroll table tbody tr', { timeout: 10000 });

    const lotRow = page.locator('.table-scroll table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Editar"]').click();
    await expect(page.locator('sigma-card.edit-mode')).toBeVisible();

    await page.locator('button[sigma-btn]', { hasText: 'Cancelar' }).click();

    await expect(page.locator('sigma-card.edit-mode')).not.toBeVisible();
    await expect(page.locator('.form-header__icon').first()).toHaveText('add_circle');
  });
});
