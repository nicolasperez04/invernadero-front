import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('RESPONSIVE LAYOUT', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display sidebar navigation on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible({ timeout: 5000 });
  });

  test('should display all main nav items', async ({ page }) => {
    const navItems = ['Dashboard', 'Cultivos', 'Lotes', 'Eventos'];
    for (const item of navItems) {
      const navItem = page.locator(`.nav-item:has-text("${item}")`).first();
      await expect(navItem).toBeVisible({ timeout: 3000 });
    }
  });

  test('should have working toolbar with user info', async ({ page }) => {
    const toolbar = page.locator('.toolbar');
    await expect(toolbar).toBeVisible({ timeout: 5000 });
  });

  test('should display content on each section', async ({ page }) => {
    const sections: { path: string; selector: string }[] = [
      { path: '/dashboard', selector: '.dashboard-content' },
      { path: '/crops', selector: 'sigma-table' },
      { path: '/lots', selector: '.filter-bar' },
      { path: '/events', selector: 'select.native-select' },
    ];
    for (const section of sections) {
      await page.goto(section.path);
      await expect(page.locator(section.selector).first()).toBeVisible({ timeout: 10000 });
    }
  });
});
