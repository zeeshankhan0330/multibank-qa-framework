import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ExplorePage extends BasePage {
  readonly url = '/en/explore';

  readonly contentContainer = this.page.getByRole('heading', { name: 'Markets at your fingertips' });
  readonly todaysTopCrypto = this.page.getByRole('heading', { name: 'Today\'s top crypto' });
  readonly todaysTopCryptoTableContent = this.page.locator('.bg-neutral-social tr');

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    await expect(this.contentContainer, 'Explore page should render meaningful content').toBeVisible();
    await expect(this.todaysTopCrypto).toBeVisible();
    await expect(await this.todaysTopCryptoTableContent.count()).toBeGreaterThan(0);
    await expect(this.page).toHaveURL(/explore/i);
  }
}
