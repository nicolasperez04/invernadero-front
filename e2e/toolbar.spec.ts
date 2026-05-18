import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('TOOLBAR', () => {
  test('should display user avatar and username in toolbar', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    const avatar = page.locator('.user-avatar');
    await expect(avatar).toBeVisible();
    const avatarText = await avatar.textContent();
    expect(avatarText?.trim()).toBeTruthy();

    const userName = page.locator('.user-name');
    await expect(userName).toBeVisible({ timeout: 5000 });
    const userNameText = await userName.textContent();
    expect(userNameText?.trim()).toBeTruthy();
  });

  test('should redirect to login and clear token when clicking logout', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await page.locator('.logout-btn').click();
    await page.waitForTimeout(1500);

    expect(page.url()).toContain('/login');

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });

  test('should collapse sidebar when clicking hamburger menu', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    const layout = page.locator('.layout');
    await expect(layout).not.toHaveClass(/sidebar-collapsed/);

    await page.locator('.toolbar-menu-btn').click();
    await page.waitForTimeout(500);

    await expect(layout).toHaveClass(/sidebar-collapsed/);
  });
});
