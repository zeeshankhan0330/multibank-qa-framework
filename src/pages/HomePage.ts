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

    const remaining = new Set(expectedLabels.map((l) => l.toLowerCase()));

    if (remaining.size > 0) {
      // build a single regex from expected labels (escape special chars)
      const escaped = Array.from(remaining).map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const regex = new RegExp(`(${escaped.join('|')})`, 'i');

      for (let i = 0; i < actualCount; i++) {
        const t = (await links.nth(i).innerText()).trim();
        const m = regex.exec(t);
        if (m && m[1]) {
          remaining.delete(m[1].toLowerCase());
        }
        if (remaining.size === 0) break;
      }
    }

    await expect(
      remaining.size,
      `expected navigation to include all labels, missing: ${Array.from(remaining).join(', ')}`
    ).toBe(0);
  }

  async goToSignUp(): Promise<void> {
    await this.signUpButton.click();
  }

  async goToExploreAssets(): Promise<void> {
    await this.exploreAllAssetsLink.click();
  }
}
