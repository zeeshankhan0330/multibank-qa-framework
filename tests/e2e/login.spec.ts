import { test, expect } from '@fixtures/pageFixtures';

test.describe('Login @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://trade.mb.io/login', { waitUntil: 'domcontentloaded' });
  });

  test('shows a generic error for invalid credentials (no user enumeration)', async ({ loginPage }) => {
    await loginPage.login('nonexistent.user@multibank-test.invalid', 'WrongPassword1!');

    await expect(loginPage.errorBanner).toBeVisible();

    // Security-relevant assertion: the error text must NOT reveal whether
    // the email exists in the system. This is a common fintech vulnerability
    // (user enumeration via differing error messages) and belongs in an
    // automated regression suite, not just a manual pentest checklist.
    const errorText = await loginPage.errorBanner.textContent();
    expect(errorText?.toLowerCase()).not.toContain('email not found');
    expect(errorText?.toLowerCase()).not.toContain('no account');
  });

  test('forgot password link routes to recovery flow', async ({ loginPage }) => {
    await loginPage.forgotPasswordLink.click();
    await loginPage.currentUrlContains('reset|forgot|recover');
  });

  test('login form rejects empty submission client-side', async ({ loginPage, page }) => {
    await loginPage.loginButton.click();
    // Expect HTML5/client validation to block submission -- URL should not change.
    await expect(page).toHaveURL(/login/);
  });
});
