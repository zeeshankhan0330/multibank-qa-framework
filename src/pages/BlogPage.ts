import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class BlogPage extends BasePage {
  readonly url = '/en/blog';

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    const header = this.page.getByRole('heading', { name: 'Blog and News' });
    await expect(header, 'Blog page should render header content').toBeVisible();
    const blogs = this.page.locator('li a img')
    await expect(await blogs.count()).toBeGreaterThan(0);
    await expect(this.page).toHaveURL(/blog|news|insights/i);
  }
}
