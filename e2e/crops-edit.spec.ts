import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('CROPS EDIT', () => {
  let testCropName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();
    testCropName = `E2E Crop Edit ${ts}`;

    await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testCropName,
        description: 'Test crop for E2E editing',
        estimatedGrowthDays: 60,
        inactivityDaysThreshold: 10,
        irrigationFrequencyHours: 48,
      },
    });

    await page.goto('/crops');
    await page.waitForLoadState('networkidle');
  });

  test('should populate form with crop data on edit click', async ({ page }) => {
    await page.waitForSelector('sigma-table tbody tr', { timeout: 10000 });
    await expect(page.locator('sigma-table')).toContainText(testCropName, { timeout: 5000 });

    const cropRow = page.locator('sigma-table tbody tr').filter({ hasText: testCropName });
    await cropRow.locator('button[title="Editar"]').click();

    await expect(page.locator('sigma-card.edit-mode')).toBeVisible();

    const nameInput = page.locator('sigma-card.edit-mode .sigma-input__el').first();
    await expect(nameInput).toHaveValue(testCropName);
  });

  test('should save edited crop name via update', async ({ page }) => {
    await page.waitForSelector('sigma-table tbody tr', { timeout: 10000 });
    await expect(page.locator('sigma-table')).toContainText(testCropName, { timeout: 5000 });

    const cropRow = page.locator('sigma-table tbody tr').filter({ hasText: testCropName });
    await cropRow.locator('button[title="Editar"]').click();
    await expect(page.locator('sigma-card.edit-mode')).toBeVisible();

    const updatedName = `${testCropName} Actualizado`;
    const nameInput = page.locator('sigma-card.edit-mode .sigma-input__el').first();
    await nameInput.clear();
    await nameInput.fill(updatedName);

    await page.locator('button[sigma-btn]', { hasText: 'Guardar cambios' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page.locator('sigma-table')).toContainText(updatedName, { timeout: 10000 });
  });

  test('should cancel edit and return to create mode', async ({ page }) => {
    await page.waitForSelector('sigma-table tbody tr', { timeout: 10000 });

    const cropRow = page.locator('sigma-table tbody tr').filter({ hasText: testCropName });
    await cropRow.locator('button[title="Editar"]').click();
    await expect(page.locator('sigma-card.edit-mode')).toBeVisible();

    await page.locator('button[sigma-btn]', { hasText: 'Cancelar' }).click();

    await expect(page.locator('sigma-card.edit-mode')).not.toBeVisible();
    await expect(page.locator('.form-header__icon').first()).toHaveText('add_circle');
  });

  test('should display edit, delete, and event-type action buttons in table', async ({ page }) => {
    await page.waitForSelector('sigma-table tbody tr', { timeout: 10000 });

    const cropRow = page.locator('sigma-table tbody tr').filter({ hasText: testCropName });
    await expect(cropRow.locator('button[title="Editar"]')).toBeVisible();
    await expect(cropRow.locator('button[title="Eliminar"]')).toBeVisible();
    await expect(cropRow.locator('button[title="Gestionar tipos de evento"]')).toBeVisible();
  });
});
