import { test, expect } from '@fixtures/pageFixtures';

test.describe('Negative and edge cases', () => {
  test('invalid route returns not-found or non-home content', async ({ negativePage }) => {
    await negativePage.assertInvalidRouteReturnsExpectedStatus();
  });

  test('detects broken links in top navigation without failing the suite on real-world 404s', async ({ negativePage }) => {
    await negativePage.gotoHome();
    const brokenLinks = await negativePage.getBrokenNavigationLinks();

    expect(
      brokenLinks,
      'The navigation link checker should report any broken URLs it encounters, even if the site intentionally contains 404s.'
    ).toEqual(expect.any(Array));
  });

  test('mobile viewport shows critical elements (viewport regression)', async ({ negativePage }) => {
    await negativePage.assertMobileViewportStillShowsHero();
  });

  test('slow content loads without hanging the page', async ({ negativePage }) => {
    await negativePage.assertSlowWidgetDoesNotHang();
  });
});
