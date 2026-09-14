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
 
    // Assert that we've reached a URL containing the expected fragment/path
    await expect(this.page).toHaveURL(new RegExp(this.url));

    // Basic sanity: page body should be visible
    await expect(this.page.locator('body')).toBeVisible();
  }

  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  async currentUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  /**
   * Return the first navigation landmark on the page.
   */
  getNavigation() {
    return this.page.getByRole('navigation').first();
  }

  /**
   * Return a locator for all anchor links inside the primary navigation.
   */
  getNavigationLinks() {
    return this.getNavigation().locator('a');
  }
}
