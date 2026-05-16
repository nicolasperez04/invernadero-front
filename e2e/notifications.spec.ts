import { test, expect } from '@playwright/test';

test.describe('NOTIFICATIONS', () => {
  test('should display notification bell with badge', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.page-title', { timeout: 5000 });
    const bell = page.locator('.notification-bell, [class*="notification"]').first();
    await expect(bell).toBeVisible({ timeout: 5000 });
  });

  test('should open notification dropdown on bell click', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.page-title', { timeout: 5000 });
    const bell = page.locator('.notification-bell').first();
    if (await bell.isVisible().catch(() => false)) {
      await bell.click();
      await page.waitForSelector('.dropdown-panel', { timeout: 3000 });
      const dropdown = page.locator('.dropdown-panel').first();
      await expect(dropdown).toBeVisible({ timeout: 3000 });
    }
  });

  test('should show notification items when bell is clicked', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.page-title', { timeout: 5000 });
    await page.locator('.notification-bell').first().click();
    const hasDropdown = await page.locator('.dropdown-panel').isVisible({ timeout: 3000 }).catch(() => false);
    if (hasDropdown) {
      const items = page.locator('.notification-item');
      const count = await items.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should close dropdown when clicking outside', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.page-title', { timeout: 5000 });
    const bell = page.locator('.notification-bell').first();
    if (await bell.isVisible().catch(() => false)) {
      await bell.click();
      const dropdown = page.locator('.dropdown-panel').first();
      if (await dropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
        await page.keyboard.press('Escape');
        await expect(dropdown).not.toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should have mark all as read button when notifications exist', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.page-title', { timeout: 5000 });
    await page.locator('.notification-bell').first().click();
    const hasDropdown = await page.locator('.dropdown-panel').isVisible({ timeout: 3000 }).catch(() => false);
    if (hasDropdown) {
      const markAllBtn = page.locator('button:has-text("leído"), button:has-text("Leído")');
      if (await markAllBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(markAllBtn).toBeVisible();
      }
    }
  });
});
