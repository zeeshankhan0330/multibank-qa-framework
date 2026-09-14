import { test, expect } from '@fixtures/pageFixtures';

test.describe('Content & External Links', () => {
  test('marketing banners render in the expected page region', async ({ page, homePage }) => {
    await homePage.goto();

    const banner = page.getByRole('banner').first();
    await expect(banner, 'header banner should be visible').toBeVisible();

    const heroHeading = page.getByRole('heading', { name: /markets at your fingertips|crypto for everyone/i }).first();
    await expect(heroHeading, 'marketing hero heading should render in the main content area').toBeVisible();

    const promoCard = page.getByRole('link', { name: /get crypto with your card|deposit funds/i }).first();
    await expect(promoCard, 'marketing promo card should render').toBeVisible();
  });

  test('app store and play store links resolve', async ({ page, homePage }) => {
    await homePage.goto();

    const appleLink = page.locator('a[href*="apps.apple.com"], a[href*="itunes.apple.com"]').first();
    const googleLink = page.locator('a[href*="play.google.com"]').first();

    await expect(appleLink, 'App Store link should exist').toBeVisible();
    await expect(googleLink, 'Google Play link should exist').toBeVisible();

    const appleHref = await appleLink.getAttribute('href');
    const googleHref = await googleLink.getAttribute('href');

    expect(appleHref, 'App Store link should point to Apple App Store').toMatch(/apps\.apple\.com|itunes\.apple\.com/i);
    expect(googleHref, 'Google Play link should point to Google Play').toMatch(/play\.google\.com/i);

    const appleResp = await page.request.get(appleHref ?? '', { maxRedirects: 10 });
    const googleResp = await page.request.get(googleHref ?? '', { maxRedirects: 10 });

    expect(appleResp.ok(), 'App Store link should resolve successfully').toBeTruthy();
    expect(googleResp.ok(), 'Google Play link should resolve successfully').toBeTruthy();
  });

  test('About / Why MultiBank page renders expected headings and text', async ({ page, homePage, companyPage }) => {
    await homePage.goto();
    await homePage.clickNavigationLink('Company');

    await expect(page).toHaveURL(/company|about/i);
    await expect(page.getByRole('heading', { name: /why multibank group/i })).toBeVisible();
    await expect(page.getByRole('img', { name: /a tradition of global/i }).nth(1)).toBeVisible();

    const sectionText = page.getByText(/global|trusted|institutional|tradition/i).first();
    await expect(sectionText, 'company page should include the expected descriptive text').toBeVisible();

    await companyPage.assertLoaded();
  });
});
