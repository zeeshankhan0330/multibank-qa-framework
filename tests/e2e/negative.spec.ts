import { test } from '@fixtures/pageFixtures';

test.describe('Negative and edge cases', () => {
  test('invalid route returns not-found or non-home content', async ({ negativePage }) => {
    await negativePage.assertInvalidRouteReturnsExpectedStatus();
  });

  test('slow content loads without hanging the page', async ({ negativePage }) => {
    await negativePage.assertSlowWidgetDoesNotHang();
  });
});
