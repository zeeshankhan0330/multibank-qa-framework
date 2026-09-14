import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ExplorePage extends BasePage {
  readonly url = '/en/explore';

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    const contentContainer = this.page.getByRole('heading', { name: 'Markets at your fingertips' });
    await expect(contentContainer, 'Explore page should render meaningful content').toBeVisible();
    const todaysTopCrypto = this.page.getByRole('heading', { name: 'Today\'s top crypto' });
    await expect(todaysTopCrypto).toBeVisible();
    const todaysTopCryptoTableContent = this.page.locator('.bg-neutral-social tr');
    await expect(await todaysTopCryptoTableContent.count()).toBeGreaterThan(0); 
    await expect(this.page).toHaveURL(/explore/i);
  }
}
