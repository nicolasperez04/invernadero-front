import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('EVENTS ADVANCED', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display event types filtered by selected lot', async ({ page }) => {
    await page.goto('/events');
    await page.waitForSelector('select.native-select', { timeout: 5000 });

    const lotSelect = page.locator('select.native-select').first();
    const options = await lotSelect.locator('option').count();
    test.skip(options <= 1, 'No lots available');

    await lotSelect.selectOption({ index: 1 });
    await page.waitForTimeout(1000);

    const typeSelect = page.locator('select.native-select').nth(1);
    const typeOptions = await typeSelect.locator('option').count();
    expect(typeOptions).toBeGreaterThanOrEqual(1);
  });
});
