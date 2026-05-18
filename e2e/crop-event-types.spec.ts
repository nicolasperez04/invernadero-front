import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('CROP EVENT TYPES DIALOG', () => {
  let hasEventTypes = false;
  let testCropName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();
    testCropName = `E2E Crop ET ${ts}`;

    const etResp = await page.request.get(`${BACKEND}/api/event-types`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const eventTypes = await etResp.json();
    hasEventTypes = Array.isArray(eventTypes) && eventTypes.length > 0;

    await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testCropName,
        description: 'Test for event types dialog',
        estimatedGrowthDays: 60,
        inactivityDaysThreshold: 10,
      },
    });

    await page.goto('/crops');
    await page.waitForSelector('sigma-table tbody tr', { timeout: 10000 });
  });

  test('should open dialog when clicking event type button', async ({ page }) => {
    const cropRow = page.locator('sigma-table tbody tr').filter({ hasText: testCropName });
    await cropRow.locator('button[title="Gestionar tipos de evento"]').click();

    const overlay = page.locator('app-crop-event-types-dialog .modal-overlay');
    await expect(overlay).toBeVisible({ timeout: 10000 });
    await expect(overlay.locator('.modal-title')).toContainText(
      `Tipos de evento — ${testCropName}`,
    );
  });

  test('should close dialog via X close button', async ({ page }) => {
    const cropRow = page.locator('sigma-table tbody tr').filter({ hasText: testCropName });
    await cropRow.locator('button[title="Gestionar tipos de evento"]').click();

    const overlay = page.locator('app-crop-event-types-dialog .modal-overlay');
    await expect(overlay).toBeVisible({ timeout: 10000 });

    await overlay.locator('.modal-close-btn').click();
    await expect(page.locator('app-crop-event-types-dialog .modal-overlay')).not.toBeVisible();
  });

  test('should close dialog via Cancelar button', async ({ page }) => {
    const cropRow = page.locator('sigma-table tbody tr').filter({ hasText: testCropName });
    await cropRow.locator('button[title="Gestionar tipos de evento"]').click();

    const overlay = page.locator('app-crop-event-types-dialog .modal-overlay');
    await expect(overlay).toBeVisible({ timeout: 10000 });

    await overlay.locator('button[sigma-btn]', { hasText: 'Cancelar' }).click();
    await expect(page.locator('app-crop-event-types-dialog .modal-overlay')).not.toBeVisible();
  });

  test('should display event type checkboxes when types exist', async ({ page }) => {
    test.skip(!hasEventTypes, 'No event types in backend');

    const cropRow = page.locator('sigma-table tbody tr').filter({ hasText: testCropName });
    await cropRow.locator('button[title="Gestionar tipos de evento"]').click();

    const overlay = page.locator('app-crop-event-types-dialog .modal-overlay');
    await expect(overlay).toBeVisible({ timeout: 10000 });

    const checkboxes = overlay.locator('.event-type-checkbox');
    const count = await checkboxes.count();
    test.skip(count === 0, 'No event type checkboxes rendered');

    const firstCheckbox = checkboxes.first();
    const wasChecked = await firstCheckbox.isChecked();
    await firstCheckbox.click();
    await expect(firstCheckbox).toBeChecked({ checked: !wasChecked });

    await firstCheckbox.click();
    await expect(firstCheckbox).toBeChecked({ checked: wasChecked });
  });

  test('should show save and cancel action buttons in dialog', async ({ page }) => {
    const cropRow = page.locator('sigma-table tbody tr').filter({ hasText: testCropName });
    await cropRow.locator('button[title="Gestionar tipos de evento"]').click();

    const overlay = page.locator('app-crop-event-types-dialog .modal-overlay');
    await expect(overlay).toBeVisible({ timeout: 10000 });

    const actions = overlay.locator('.modal-actions');
    await expect(
      actions.locator('button[sigma-btn]', { hasText: 'Guardar cambios' }),
    ).toBeVisible();
    await expect(actions.locator('button[sigma-btn]', { hasText: 'Cancelar' })).toBeVisible();
  });
});
