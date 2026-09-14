import { test, expect } from '@fixtures/pageFixtures';
import navData from '../data/navLinks.json';

test.describe('Top Navigation & Links', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('Top navigation displays expected items and reachable links', async ({ homePage }) => {
    // verify expected nav items and count using JSON-driven test data
    await homePage.verifyNavLinks(navData.labels, navData.count);
  });

  // Consolidated: click each navigation link and verify destination renders content
  test('navigation links navigate and destinations render meaningful content', async ({ page, homePage }) => {
    const nav = page.getByRole('navigation').first();
    const links = nav.locator('a');
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const a = links.nth(i);
      const href = (await a.getAttribute('href')) || '';
      if (!href) continue;

      // Skip fully external links (they open a new domain)
      if (href.startsWith('http') && !href.includes(new URL(page.url()).host)) {
        continue;
      }

      // Click and wait for navigation/render
      await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), a.click()]);

      // Basic destination checks: page should have at least one visible heading or main element with text
      const heading = page.locator('h1, h2, h3').filter({ hasText: /\w/ }).first();
      const main = page.locator('main').first();

      const headingVisible = await heading.isVisible().catch(() => false);
      const mainText = (await main.textContent().catch(() => '')) || '';

      expect(headingVisible || mainText.trim().length > 20, `destination ${href} should render meaningful content`).toBeTruthy();
      await page.goBack();
    }
  });
});
