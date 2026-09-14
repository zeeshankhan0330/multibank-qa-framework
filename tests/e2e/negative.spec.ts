import { test, expect } from '@fixtures/pageFixtures';

test.describe('Negative and edge cases', () => {
  test('invalid route returns not-found or non-home content', async ({ page }) => {
    const resp = await page.goto('/this-route-should-not-exist-qa');
    if (resp) {
      expect([404, 410, 400]).toContain(resp.status());
    } else {
      // fallback: ensure not redirected to homepage
      expect(page.url()).not.toMatch(/\/en\/?$/);
    }
  });

  test('detect broken links in top navigation', async ({ page, homePage }) => {
    await homePage.goto();

    const nav = page.getByRole('navigation').first();
    const links = nav.locator('a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const a = links.nth(i);
      const href = (await a.getAttribute('href')) || '';
      if (!href) continue;
      const url = href.startsWith('http') ? href : new URL(href, page.url()).toString();
      const r = await page.request.get(url);
      expect(r.status(), `link ${url} should not be broken`).toBeLessThan(400);
    }
  });

  test('mobile viewport shows critical elements (viewport regression)', async ({ page, homePage }) => {
    await page.setViewportSize({ width: 393, height: 852 }); // approx Pixel 7
    await homePage.goto();

    // ensure hero heading is still visible on mobile
    const hero = page.getByRole('heading', { name: /crypto for everyone/i }).first();
    await expect(hero).toBeVisible();
  });
});
