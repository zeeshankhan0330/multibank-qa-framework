import { test, expect } from '@fixtures/pageFixtures';

test.describe('Homepage @smoke', () => {
  test('critical landing elements are visible and functional', async ({ page, homePage }) => {
    await homePage.goto();
    await homePage.dismissCookieBannerIfPresent();

    await expect(homePage.heroHeading).toBeVisible();
    await expect(homePage.signUpButton).toBeVisible();
    await expect(homePage.exploreAllAssetsLink).toBeVisible();

    // Sanity check the page didn't silently fail to render (a common false
    // positive in trading UIs where the shell loads but data/hydration fails).
    await expect(page).toHaveTitle(/mb\.io/i);
  });

  test('explore assets navigation works', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.dismissCookieBannerIfPresent();
    await homePage.goToExploreAssets();
    await homePage.currentUrlContains('/explore');
  });
});
