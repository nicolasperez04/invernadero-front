import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('EVENTS CREATE', () => {
  let hasEventTypes = false;
  let testLotId: number;

  test.beforeEach(async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();

    const etResp = await page.request.get(`${BACKEND}/api/event-types`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const eventTypes = await etResp.json();
    hasEventTypes = Array.isArray(eventTypes) && eventTypes.length > 0;

    const cropResp = await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: `E2E Crop Events ${ts}`,
        description: 'Test crop for events',
        estimatedGrowthDays: 60,
        inactivityDaysThreshold: 10,
      },
    });
    const crop = await cropResp.json();

    const lotResp = await page.request.post(`${BACKEND}/api/lots`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: `E2E Lot Events ${ts}`,
        cropId: crop.id,
        startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
      },
    });
    const lot = await lotResp.json();
    testLotId = lot.id;

    if (hasEventTypes) {
      const sowingType = eventTypes.find((et: any) => et.name === 'SOWING');
      if (sowingType) {
        await page.request.post(`${BACKEND}/api/events`, {
          headers: { Authorization: `Bearer ${token}` },
          data: {
            lotId: testLotId,
            type: 'SOWING',
            timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
            description: 'Siembra de prueba E2E',
          },
        });
      }
    }

    await page.goto('/events');
    await page.waitForLoadState('networkidle');
  });

  test('should display lot selector card', async ({ page }) => {
    await expect(page.locator('h3.section__title').first()).toContainText('Seleccione lote');
    await expect(page.locator('select.native-select').first()).toBeVisible();
  });

  test('should hide create form when no lot is selected', async ({ page }) => {
    await expect(page.locator('sigma-card').nth(1)).not.toBeVisible();
  });

  test('should show create form and history when lot is selected', async ({ page }) => {
    const lotSelect = page.locator('select.native-select').first();
    const optCount = await lotSelect.locator('option').count();
    test.skip(optCount <= 1, 'No lots available to select');

    await lotSelect.selectOption({ index: 1 });
    await page.waitForLoadState('networkidle');

    await expect(page.locator('sigma-card').nth(1)).toBeVisible();
    await expect(page.locator('sigma-card').nth(1).locator('h3.section__title')).toContainText(
      'Nuevo Evento',
    );

    await expect(page.locator('sigma-card').nth(2)).toBeVisible();
  });

  test('should create event and display in history table', async ({ page }) => {
    test.skip(!hasEventTypes, 'No event types exist in backend — cannot create events');

    const lotSelect = page.locator('select.native-select').first();
    const optCount = await lotSelect.locator('option').count();
    test.skip(optCount <= 1, 'No lots available');

    await lotSelect.selectOption({ index: 1 });
    await page.waitForLoadState('networkidle');

    const typeSelect = page.locator('select.native-select').nth(1);
    const typeOptions = await typeSelect.locator('option').count();
    test.skip(typeOptions <= 1, 'No event types assigned to this crop');

    await typeSelect.selectOption({ index: 1 });

    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const datetimeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

    await page.locator('sigma-input input[type="datetime-local"]').fill(datetimeStr);

    const description = `Evento de prueba E2E ${Date.now()}`;
    await page.locator('sigma-input textarea').fill(description);

    await page.locator('button[sigma-btn]', { hasText: 'Registrar' }).click();
    await page.waitForLoadState('networkidle');

    const historyTable = page.locator('.table-scroll table');
    await expect(historyTable).toBeVisible({ timeout: 5000 });
    await expect(historyTable.locator('tbody tr').first()).toBeVisible({ timeout: 5000 });
  });
});
