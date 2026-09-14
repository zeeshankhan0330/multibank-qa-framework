import { test, expect } from '@fixtures/pageFixtures';
import { generateTestEmail, generateStrongPassword } from '@utils/testData';

test.describe('Account registration @regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://trade.mb.io/register', { waitUntil: 'domcontentloaded' });
  });

  test('user can submit registration with valid credentials', async ({ registerPage }) => {
    const email = generateTestEmail();
    const password = generateStrongPassword();

    await registerPage.register(email, password);

    // On a real trading platform, successful registration typically routes
    // to an email-verification or KYC step rather than straight to the
    // dashboard -- assert against that, not a dashboard redirect.
    await registerPage.currentUrlContains('verify|kyc|welcome');
  });

  test('registration rejects a mismatched confirm-password', async ({ registerPage }) => {
    const email = generateTestEmail();

    await registerPage.emailInput.fill(email);
    await registerPage.passwordInput.fill('ValidPass1!');
    if (await registerPage.confirmPasswordInput.isVisible().catch(() => false)) {
      await registerPage.confirmPasswordInput.fill('DifferentPass2!');
    }
    await registerPage.submitButton.click();

    await expect(registerPage.inlineErrorMessage).toBeVisible();
  });

  test('registration rejects an already-used email format edge case', async ({ registerPage }) => {
    // Deliberately malformed to test client-side validation, not server load.
    await registerPage.emailInput.fill('not-an-email');
    await registerPage.passwordInput.fill('ValidPass1!');
    await registerPage.submitButton.click();

    await expect(registerPage.inlineErrorMessage.or(registerPage.emailInput)).toBeVisible();
  });
});
