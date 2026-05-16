import { test as setup } from '@playwright/test';
import { TEST_USER } from './helpers';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.fill('#email', TEST_USER.email);
  await page.fill('#password', TEST_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*\/dashboard/, { timeout: 10000 });
  await page.context().storageState({ path: authFile });
});
