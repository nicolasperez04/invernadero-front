import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('LANGUAGE SWITCHER', () => {
  test('should switch to English and update active class and localStorage', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    const enBtn = page.locator('.lang-btn', { hasText: 'EN' });
    await expect(enBtn).toBeVisible({ timeout: 5000 });
    await enBtn.click();
    await page.waitForTimeout(500);

    await expect(enBtn).toHaveClass(/active/);
    const esBtn = page.locator('.lang-btn', { hasText: 'ES' });
    await expect(esBtn).not.toHaveClass(/active/);

    const lang = await page.evaluate(() => localStorage.getItem('lang'));
    expect(lang).toBe('en');
  });

  test('should switch back to Spanish and update active class and localStorage', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForSelector('.dashboard-content', { timeout: 15000 });

    await page.locator('.lang-btn', { hasText: 'EN' }).click();
    await page.waitForTimeout(300);

    const esBtn = page.locator('.lang-btn', { hasText: 'ES' });
    await esBtn.click();
    await page.waitForTimeout(500);

    await expect(esBtn).toHaveClass(/active/);
    const enBtn = page.locator('.lang-btn', { hasText: 'EN' });
    await expect(enBtn).not.toHaveClass(/active/);

    const lang = await page.evaluate(() => localStorage.getItem('lang'));
    expect(lang).toBe('es');
  });
});
