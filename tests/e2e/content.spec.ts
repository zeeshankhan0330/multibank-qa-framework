import { test, expect } from '@fixtures/pageFixtures';
import { NavigationLabel } from '@pages/HomePage';

test.describe('Content & External Links', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('marketing banners render in the expected page region', async ({ homePage }) => {
    await homePage.assertMarketingHeroInMainRegion();
  });

  test('App Store and Google Play download links resolve correctly', async ({ homePage }) => {
    const appHref = await homePage.getDownloadAppHref();
    expect(appHref, 'Download app link should be present').toBeTruthy();

    const targetUrl = await homePage.clickDownloadAppLink();
    expect(targetUrl, 'Download app CTA should resolve to an app download URL after click').toMatch(
      /go\.link|apps\.apple\.com|itunes\.apple\.com|play\.google\.com|intent:\/\//i
    );
    expect(targetUrl, 'Download app CTA should not open a login/auth page after click').not.toMatch(
      /\/login|sign(?:in|up)|auth|account/i
    );
  });

  test('About / Why MultiBank page renders all expected components with correct headings and section text', async ({ homePage, companyPage }) => {
    await homePage.clickNavigationLink(NavigationLabel.Company);
    await companyPage.assertAllComponentsLoaded();
  });
});
