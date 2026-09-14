import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SupportPage extends BasePage {
  readonly url = '/en/support';

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    const header = this.page.getByRole('heading', { name: 'Got questions? We\'re always' })
    await expect(header, 'Support page should render header content').toBeVisible();
    await expect(this.page).toHaveURL(/support|help|faq/i);
    const quickQuestionsTile = this.page.getByRole('link', { name: 'What is mb.io?', exact: true })
    await expect(quickQuestionsTile, 'Support page should render quick questions tile').toBeVisible();
  }
}
