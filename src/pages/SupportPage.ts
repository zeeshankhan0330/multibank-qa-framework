import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SupportPage extends BasePage {
  readonly url = '/en/support';

  readonly header = this.page.getByRole('heading', { name: 'Got questions? We\'re always' });
  readonly quickQuestionsTile = this.page.getByRole('link', { name: 'What is mb.io?', exact: true });

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    await expect(this.header, 'Support page should render header content').toBeVisible();
    await expect(this.page).toHaveURL(/support|help|faq/i);
    await expect(this.quickQuestionsTile, 'Support page should render quick questions tile').toBeVisible();
  }
}
