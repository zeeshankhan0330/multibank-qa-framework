import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly url = '/register'; // resolved against trade.mb.io base in this flow's test

  readonly emailInput = this.page.getByLabel(/email/i);
  readonly passwordInput = this.page.getByLabel(/^password$/i);
  readonly confirmPasswordInput = this.page.getByLabel(/confirm password/i);
  readonly termsCheckbox = this.page.getByRole('checkbox', { name: /terms/i });
  readonly submitButton = this.page.getByRole('button', { name: /create account|sign up|register/i });
  readonly inlineErrorMessage = this.page.locator('[role="alert"], .error-message');

  constructor(page: Page) {
    super(page);
  }

  async register(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    if (await this.confirmPasswordInput.isVisible().catch(() => false)) {
      await this.confirmPasswordInput.fill(password);
    }
    if (await this.termsCheckbox.isVisible().catch(() => false)) {
      await this.termsCheckbox.check();
    }
    await this.submitButton.click();
  }
}
