import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OtcDeskPage extends BasePage {
  readonly url = '/en/otc-desk';

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    const requestQuote = this.page.locator('div').filter({ hasText: 'Request a quoteFirst name*' }).nth(3)
    await expect(requestQuote, 'OTC Desk page should render request quote form').toBeVisible();
    const header = this.page.getByRole('heading', { name: 'Large trades. Zero slippage.' })
    await expect(header, 'OTC Desk page should render meaningful content').toBeVisible();
    await expect(this.page).toHaveURL(/otc|desk/i);
  }
}
