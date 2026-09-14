import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly url = '/en';

  readonly signUpButton = this.page.getByRole('link', { name: /sign up/i });
  readonly openAccountButton = this.page.getByRole('link', { name: /open an account/i }).first();
  readonly exploreAllAssetsLink = this.page.getByRole('link', { name: /explore all assets/i });
  readonly heroHeading = this.page.getByRole('heading', { name: /crypto for everyone/i });

  constructor(page: Page) {
    super(page);
  }

  async verifyNavLinks(expectedLabels: string[], expectedCount?: number): Promise<void> {
    const nav = this.page.getByRole('navigation').first();
    await expect(nav).toBeVisible();

    const links = nav.locator('a');
    const actualCount = await links.count();
    if (typeof expectedCount === 'number') {
      await expect(actualCount).toBe(expectedCount);
    }

    const texts: string[] = [];
    for (let i = 0; i < actualCount; i++) {
      const t = (await links.nth(i).innerText()).trim();
      texts.push(t.toLowerCase());
    }

    for (const label of expectedLabels) {
      const found = texts.some((t) => t.includes(label.toLowerCase()));
      await expect(found, `expected navigation to include "${label}"`).toBeTruthy();
    }
  }

  async goToSignUp(): Promise<void> {
    await this.signUpButton.click();
  }

  async goToExploreAssets(): Promise<void> {
    await this.exploreAllAssetsLink.click();
  }
}
