import { test, expect } from '@fixtures/pageFixtures';

test.describe('Explore market widget', () => {
  test('renders the Spot market categories and matches each category API payload', async ({ explorePage }) => {
    const widgetResponsePromise = explorePage.waitForMarketWidgetResponse();

    await explorePage.goto();

    const widgetResponse = await widgetResponsePromise;
    const widgetPayload = await widgetResponse.json();

    await explorePage.assertMarketSectionsMatchApi(widgetPayload);
    expect(Array.isArray(widgetPayload), 'Expected the Explore API to return a list of market sections').toBe(true);
  });
});
