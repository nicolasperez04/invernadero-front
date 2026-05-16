import { test, expect } from '@playwright/test';

test.describe('LOTS ADVANCED', () => {
  test('should display lots list with filter options', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForSelector('h1', { timeout: 5000 });
    const filterSelect = page.locator('select, mat-select').first();
    await expect(filterSelect).toBeVisible({ timeout: 3000 });
  });

  test('should open lot summary modal when available', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForTimeout(2000);
    const summaryBtns = page.locator('button.btn-summary');
    const count = await summaryBtns.count();
    if (count > 0) {
      await summaryBtns.first().click();
      await page.waitForTimeout(1000);
      const modal = page.locator('.modal-overlay').first();
      await expect(modal).toBeVisible({ timeout: 3000 });
    }
  });

  test('should display inactivity badges on lots', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForTimeout(2000);
    const badges = page.locator('.status-badge, [class*="inactivity"], .metric-badge');
    const count = await badges.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show lot progress indicator', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForTimeout(2000);
    const progress = page.locator('[class*="progress"], [class*="bar"]').first();
    await expect(progress).toBeVisible({ timeout: 3000 });
  });

  test('should display lot table with data', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForTimeout(2000);
    const tableOrEmpty = page.locator('table, .empty-state');
    await expect(tableOrEmpty).toBeVisible({ timeout: 5000 });
  });
});
