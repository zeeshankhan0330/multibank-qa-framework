import { test, expect } from '@fixtures/pageFixtures';

test.describe('Trading Section (basic smoke checks)', () => {
  test('spot trading section renders with trading pairs list', async ({ page, homePage }) => {
    await homePage.goto();


    // common trading section identifiers: look for tables or lists that contain
    // trading pair-like patterns (e.g., BTC/USD, ETH/BTC)
    const pairPattern = /[A-Z]{2,5}\/[A-Z]{2,5}/;
    const text = await page.textContent('body');
    expect(text).toMatch(pairPattern);
  });

  test('trading pairs are grouped into categories (sanity)', async ({ page, homePage }) => {
    await homePage.goto();


    // check for headings like "Spot", "Futures", or "Markets" as a heuristic
    const grouping = page.getByRole('heading', { name: /spot|markets|futures/i }).first();
    await expect(grouping).toBeVisible({ timeout: 5_000 });
  });
});
