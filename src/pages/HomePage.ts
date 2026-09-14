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

  async assertNavigationLinksPresentAndEnabled(expectedLabels: string[], expectedCount?: number): Promise<void> {
    const nav = this.getNavigation();
    const links = this.getNavigationLinks();
    const actualCount = await links.count();
    if (typeof expectedCount === 'number') {
      await expect(actualCount).toBe(expectedCount);
    }

    // Quick presence/count check using a single Playwright call
    const texts = await links.allInnerTexts();
    const lower = texts.map((t) => t.trim().toLowerCase());

    const missing = expectedLabels.filter((l) => !lower.some((t) => t.includes(l.toLowerCase())));
    if (missing.length > 0) {
      await expect(
        missing.length,
        `expected navigation to include all labels, missing: ${missing.join(', ')}`
      ).toBe(0);
    }

    // Per-label actionability checks (visibility / enabled)
    for (const label of expectedLabels) {
      const locator = nav.getByRole('link', { name: label }).first();
      await expect(locator, `navigation link "${label}" should be visible`).toBeVisible();
      await expect(locator, `navigation link "${label}" should be enabled`).toBeEnabled();
    }
  }

  async clickNavigationLink(label: string): Promise<void> {
    const link = this.getNavigation().getByRole('link', { name: label }).first();
    await expect(link, `navigation link "${label}" should be visible`).toBeVisible();

    const href = (await link.getAttribute('href')) || '';
    if (!href) {
      throw new Error(`Navigation link "${label}" has no href`);
    }

    if (href.startsWith('http') && !href.includes(new URL(this.page.url()).host)) {
      return;
    }

    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      link.click(),
    ]);
  }

  async clickNavigationLinkInNewTab(label: string): Promise<Page> {
    const link = this.getNavigation().getByRole('link', { name: label }).first();
    await expect(link, `navigation link "${label}" should be visible`).toBeVisible();

    const [newTab] = await Promise.all([
      this.page.waitForEvent('popup'),
      link.click(),
    ]);

    await newTab.waitForLoadState('domcontentloaded');
    return newTab;
  }
}
