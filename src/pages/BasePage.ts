import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage centralizes cross-cutting concerns so individual page objects
 * stay thin and only describe locators + page-specific actions.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly url: string;

  async goto(): Promise<void> {
    await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }

  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  async currentUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  async dismissCookieBannerIfPresent(): Promise<void> {
    // Trading platforms almost always have a cookie/consent overlay that
    // blocks subsequent clicks if not handled defensively.
    const acceptButton = this.page.getByRole('button', { name: /accept|agree/i });
    if (await acceptButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await acceptButton.click();
    }
  }
}
