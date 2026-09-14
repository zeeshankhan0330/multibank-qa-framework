import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly url = '/login'; // resolved against trade.mb.io base in this flow's test

  readonly emailInput = this.page.getByLabel(/email/i);
  readonly passwordInput = this.page.getByLabel(/password/i);
  readonly loginButton = this.page.getByRole('button', { name: /log ?in|sign in/i });
  readonly forgotPasswordLink = this.page.getByRole('link', { name: /forgot password/i });
  readonly errorBanner = this.page.locator('[role="alert"], .error-message');

  constructor(page: Page) {
    super(page);
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
