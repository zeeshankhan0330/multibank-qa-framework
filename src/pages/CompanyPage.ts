import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CompanyPage extends BasePage {
  readonly url = '/en/company';

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    const header = this.page.getByRole('heading', { name: 'Why MultiBank Group?' });
    await expect(header, 'Company page should render header content').toBeVisible();
    const companyLogo = this.page.getByRole('img', { name: 'A Tradition of Global' }).nth(1)
    await expect(companyLogo, 'Company page should render logo content').toBeVisible();
    await expect(this.page).toHaveURL(/company|about/i);
  }
}
