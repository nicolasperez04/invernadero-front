import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('NOTIFICATIONS ADVANCED', () => {
  test('should display notification bell button in toolbar', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await expect(page.locator('.bell-button')).toBeVisible({ timeout: 5000 });
  });

  test('should open dropdown panel when clicking bell, showing mark-all when unread exist', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await page.locator('.bell-button').click();
    await page.waitForTimeout(500);

    const dropdown = page.locator('.dropdown-panel');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    const hasBadge = await page.locator('.bell-badge').isVisible();
    if (hasBadge) {
      await expect(dropdown.locator('.mark-all-btn')).toBeVisible();
    }
  });

  test('should show empty state when no notifications exist', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await page.locator('.bell-button').click();
    await page.waitForTimeout(500);

    const badge = page.locator('.bell-badge');
    if (!(await badge.isVisible())) {
      const emptyState = page.locator('.dropdown-panel .empty-state');
      await expect(emptyState).toBeVisible({ timeout: 3000 });
    }
  });

  test('should mark all notifications as read when clicking mark all button', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    const badge = page.locator('.bell-badge');
    if (!(await badge.isVisible())) {
      test.skip(true, 'No unread notifications — nothing to mark as read');
    }

    await page.locator('.bell-button').click();
    await page.waitForTimeout(500);

    const countBeforeText = await badge.textContent();
    const countBefore = parseInt(countBeforeText || '0');

    await page.locator('.dropdown-panel .mark-all-btn').click();
    await page.waitForTimeout(1000);

    if (await badge.isVisible()) {
      const countAfterText = await badge.textContent();
      const countAfter = parseInt(countAfterText || '0');
      expect(countAfter).toBeLessThan(countBefore);
    }
  });
});
