import { test, expect } from '@playwright/test';
import { login } from './helpers';

const BACKEND = 'http://localhost:8080';

test.describe('PDF DOWNLOAD', () => {
  let testCropName: string;
  let testLotName: string;

  test.beforeEach(async ({ page }) => {
    await login(page);
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();
    testCropName = `E2E PDF Crop ${ts}`;
    testLotName = `E2E PDF Lot ${ts}`;

    const etResp = await page.request.get(`${BACKEND}/api/event-types`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const eventTypes = await etResp.json();
    const hasSowing = Array.isArray(eventTypes) && eventTypes.some((et) => et.name === 'SOWING');
    const hasHarvest = Array.isArray(eventTypes) && eventTypes.some((et) => et.name === 'HARVEST');
    test.skip(!hasSowing || !hasHarvest, 'SOWING or HARVEST event types not available in backend');
  });

  test('should download PDF report for FINISHED lot', async ({ page }) => {
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const ts = Date.now();

    const cropResp = await page.request.post(`${BACKEND}/api/crops`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testCropName,
        description: 'PDF test',
        estimatedGrowthDays: 60,
        inactivityDaysThreshold: 10,
      },
    });
    const crop = await cropResp.json();

    const lotResp = await page.request.post(`${BACKEND}/api/lots`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: testLotName,
        cropId: crop.id,
        startDate: new Date(Date.now() - 60000).toISOString(),
        area: 100,
      },
    });
    const lot = await lotResp.json();

    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);

    await page.request.post(`${BACKEND}/api/events`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        lotId: lot.id,
        type: 'SOWING',
        userId: 1,
        timestamp: yesterday.toISOString(),
        description: 'PDF test sowing',
      },
    });

    await page.request.post(`${BACKEND}/api/events`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        lotId: lot.id,
        type: 'HARVEST',
        userId: 1,
        timestamp: now.toISOString(),
        description: 'PDF test harvest',
      },
    });

    await page.goto('/lots');
    await page.waitForSelector('table tbody tr', { timeout: 10000 });

    const lotRow = page.locator('table tbody tr').filter({ hasText: testLotName });
    await lotRow.locator('button[title="Ver resumen"]').click();

    const modal = page.locator('.modal-overlay');
    await expect(modal).toBeVisible({ timeout: 10000 });

    const downloadBtn = modal.locator('button[sigma-btn]', { hasText: 'Descargar informe' });
    await expect(downloadBtn).toBeVisible({ timeout: 5000 });

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      downloadBtn.click(),
    ]);

    expect(download).toBeTruthy();
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});
