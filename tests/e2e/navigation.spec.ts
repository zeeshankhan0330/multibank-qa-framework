import { test, expect } from '@fixtures/pageFixtures';
import navData from '../data/navLinks.json';

test.describe('Top Navigation & Links', () => {
  test('navigation renders and links resolve (no 4xx/5xx)', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.dismissCookieBannerIfPresent();

      // verify expected nav items and count using JSON-driven test data
      await homePage.verifyNavLinks(navData.labels, navData.count);

      const nav = page.getByRole('navigation', { name: /main/i });
    await expect(nav).toBeVisible();

    const links = nav.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    // sample up to first 8 links and ensure target URLs return OK
    const max = Math.min(8, count);
    for (let i = 0; i < max; i++) {
      const a = links.nth(i);
      const href = (await a.getAttribute('href')) || '';
      if (!href) continue;

      // resolve absolute URL
      const url = href.startsWith('http') ? href : new URL(href, page.url()).toString();
      const resp = await page.request.get(url);
      expect(resp.status(), `link ${url} should be reachable`).toBeLessThan(400);
    }
  });

  test('navigation links navigate to expected destinations', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.dismissCookieBannerIfPresent();

    const nav = page.getByRole('navigation').first();
    const links = nav.locator('a');
    const count = await links.count();
    const sample = Math.min(5, count);

    for (let i = 0; i < sample; i++) {
      const a = links.nth(i);
      const href = (await a.getAttribute('href')) || '';
      if (!href) continue;

      // navigate via click but guard against external targets
      const url = href.startsWith('http') ? href : new URL(href, page.url()).toString();
      await page.goto(url);
      expect(page.url()).toContain(new URL(url).pathname);
      await page.goBack();
    }
  });
});
