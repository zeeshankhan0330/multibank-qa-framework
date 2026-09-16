import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FeaturesPage extends BasePage {
  readonly url = '/en/features';

  readonly modal = this.page.getByRole('dialog', { name: 'Subscribe to mb.insider' });
  readonly contentHeader = this.page.getByRole('heading', { name: 'The power of crypto is yours' });
  readonly featuresOne = this.page.getByRole('heading', { name: 'Easily explore opportunities' });
  readonly featureTwo = this.page.getByRole('heading', { name: 'Smart asset insights at a' });

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    await this.modal.getByRole('button', { name: 'Close' }).click();
    await expect(this.contentHeader, 'Features page should render meaningful content').toBeVisible();
    await expect(this.featuresOne, 'Features page should render meaningful content').toBeVisible();
    await expect(this.featureTwo, 'Features page should render meaningful content').toBeVisible();
    await expect(this.page).toHaveURL(/features/i);
  }
}
