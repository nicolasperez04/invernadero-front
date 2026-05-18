import { test as setup } from '@playwright/test';
import { TEST_USER } from './helpers';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.locator('sigma-input[name="email"] .sigma-input__el').fill(TEST_USER.email);
  await page.locator('sigma-input[name="password"] .sigma-input__el').fill(TEST_USER.password);
  await page.click('button[sigma-btn]');
  await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
  await page.context().storageState({ path: authFile });
});
