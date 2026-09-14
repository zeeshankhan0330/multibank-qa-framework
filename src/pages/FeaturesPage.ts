import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FeaturesPage extends BasePage {
  readonly url = '/en/features';

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    const modal = this.page.getByRole('dialog', { name: 'Subscribe to mb.insider' })
    await modal.getByRole('button', { name: 'Close' }).click();
    const contentHeader = this.page.getByRole('heading', { name: 'The power of crypto is yours' })
    await expect(contentHeader, 'Features page should render meaningful content').toBeVisible();
    const featuresOne = this.page.getByRole('heading', { name: 'Easily explore opportunities' })
    await expect(featuresOne, 'Features page should render meaningful content').toBeVisible();
    const featureTwo = this.page.getByRole('heading', { name: 'Smart asset insights at a' })
    await expect(featureTwo, 'Features page should render meaningful content').toBeVisible();
    await expect(this.page).toHaveURL(/features/i);
  }
}
