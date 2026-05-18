import { test, expect } from '@playwright/test';

test.describe('LOGIN INTERACTIONS', () => {
  test('should disable submit button when email or password is empty', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('sigma-input[name="email"]', { timeout: 10000 });

    const submitBtn = page.locator('button[sigma-btn][type="submit"]');
    await expect(submitBtn).toBeDisabled();

    await page.locator('sigma-input[name="email"] .sigma-input__el').fill('test@test.com');
    await expect(submitBtn).toBeDisabled();

    await page.locator('sigma-input[name="password"] .sigma-input__el').fill('password123');
    await expect(submitBtn).toBeEnabled();
  });

  test('should toggle password visibility when clicking eye icon', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('sigma-input[name="password"]', { timeout: 10000 });

    const passwordInput = page.locator('sigma-input[name="password"] .sigma-input__el');
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.locator('.toggle-password').click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await page.locator('.toggle-password').click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should reject invalid credentials and show error', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('sigma-input[name="email"]', { timeout: 10000 });

    await page.locator('sigma-input[name="email"] .sigma-input__el').fill('wrong@email.com');
    await page.locator('sigma-input[name="password"] .sigma-input__el').fill('wrongpass');

    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes('/api/auth/login'),
        { timeout: 15000 },
      ),
      page.locator('button[sigma-btn][type="submit"]').click(),
    ]);

    expect(response.status()).toBeGreaterThanOrEqual(400);
    await page.waitForTimeout(500);

    const errorDiv = page.locator('.error-message');
    const snackbar = page.locator('.mat-mdc-snack-bar-container, .cdk-overlay-container');

    const hasErrorDiv = (await errorDiv.count()) > 0;
    const hasSnackbar = (await snackbar.count()) > 0;

    expect(hasErrorDiv || hasSnackbar).toBeTruthy();
    expect(page.url()).toContain('/login');
  });
});
