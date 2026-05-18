import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('SSE REALTIME', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should have valid auth token on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    const hasToken = await page.evaluate(() => {
      const token = localStorage.getItem('token');
      return !!token;
    });
    expect(hasToken).toBeTruthy();
  });

  test('should navigate between lots and dashboard sections', async ({ page }) => {
    await page.goto('/lots');
    await page.waitForSelector('table', { timeout: 10000 });

    const select = page.locator('select.filter-bar__select').first();
    const optCount = await select.locator('option').count();
    test.skip(optCount <= 1, 'No lots available');

    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await expect(page.locator('.kpi-grid').first()).toBeVisible({ timeout: 8000 });
  });

  test('should show content when navigating back to dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await page.goto('/crops');
    await page.waitForSelector('sigma-table', { timeout: 10000 });

    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await expect(page.locator('.kpi-grid').first()).toBeVisible({ timeout: 8000 });
  });
});
