import { Page } from '@playwright/test';

export const TEST_USER = {
  email: 'nicolas@gmail.com',
  password: 'nicolas'
};

export async function login(page: Page, email: string = TEST_USER.email, password: string = TEST_USER.password): Promise<void> {
  await page.goto('/login');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type=\"submit\"]');
  await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
}

export async function logout(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.goto('/login');
}

export async function waitForAngular(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

export async function dismissToast(page: Page): Promise<void> {
  const toast = page.locator('.mat-mdc-snack-bar-container, .snack-bar-container');
  if (await toast.isVisible({ timeout: 2000 }).catch(() => false)) {
    await page.waitForTimeout(500);
  }
}
