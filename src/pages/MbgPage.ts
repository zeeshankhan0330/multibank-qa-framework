import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MbgPage extends BasePage {
  readonly url = '/en/mbg';

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(page:Page): Promise<void> {
    const buyMbgButton = page.getByRole('link', { name: 'Buy $MBG', exact: true })
    await expect(buyMbgButton, '$MBG page should render Buy $MBG button').toBeVisible();
    const contentContainer = page.locator('main, h1, h2, h3').first();
    await expect(contentContainer, '$MBG page should render meaningful content').toBeVisible();
  }
}
