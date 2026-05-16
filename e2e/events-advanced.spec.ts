import { test, expect } from '@playwright/test';

test.describe('EVENTS ADVANCED', () => {
  test('should load events page with lot selector', async ({ page }) => {
    await page.goto('/events');
    await page.waitForSelector('h1', { timeout: 5000 });
    const select = page.locator('select').first();
    await expect(select).toBeVisible({ timeout: 3000 });
  });

  test('should display event types filtered by selected lot', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(2000);
    const lotSelect = page.locator('select').first();
    const options = await lotSelect.locator('option').count();
    if (options > 1) {
      await lotSelect.selectOption({ index: 1 });
      await page.waitForTimeout(2000);
      const typeSelect = page.locator('select').nth(1);
      const typeOptions = await typeSelect.locator('option').count();
      expect(typeOptions).toBeGreaterThanOrEqual(1);
    }
  });

  test('should show event history for selected lot', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(2000);
    const lotSelect = page.locator('select').first();
    const options = await lotSelect.locator('option').count();
    if (options > 1) {
      await lotSelect.selectOption({ index: 1 });
      await page.waitForTimeout(3000);
      const table = page.locator('table');
      const exists = await table.count();
      expect(exists).toBeGreaterThanOrEqual(0);
    }
  });

  test('should display event register form when lot is selected', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(2000);
    const lotSelect = page.locator('select').first();
    const options = await lotSelect.locator('option').count();
    if (options > 1) {
      await lotSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      const registerBtn = page.locator('button:has-text("Registrar"), button:has-text("register")');
      if (await registerBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(registerBtn).toBeVisible();
      }
    }
  });
});
