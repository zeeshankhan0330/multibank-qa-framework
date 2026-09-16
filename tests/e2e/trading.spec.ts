import { test, expect } from '@fixtures/pageFixtures';
import { ExplorePage } from '@pages/ExplorePage';

test.describe.serial('Explore market widget', () => {
  let explorePage: ExplorePage;
  let widgetPayload: Array<{ id: string; items: string[]; name: string }>;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    explorePage = new ExplorePage(page);

    const widgetResponsePromise = explorePage.waitForMarketWidgetResponse();
    await explorePage.goto();

    const widgetResponse = await widgetResponsePromise;
    widgetPayload = await widgetResponse.json();
  });

  test('renders the widget and required display elements', async () => {
    await expect(explorePage.marketWidgetContainer).toBeVisible();
    await expect(explorePage.todaysTopCrypto).toBeVisible({ timeout: 15_000 });
    await expect(explorePage.getMarketTab('Hot')).toBeVisible();
    await expect(explorePage.getMarketTab('Gainers')).toBeVisible();
    await expect(explorePage.getMarketTab('Losers')).toBeVisible();
    await expect(explorePage.marketTableRows.first()).toBeVisible({ timeout: 15_000 });
  });

  test('keeps the visible category symbols aligned with the API-backed market sections', async () => {
    await expect(Array.isArray(widgetPayload), 'Expected the Explore API to return a list of market sections').toBe(true);

    const apiSections = new Map<string, { id: string; items: string[]; name: string }>(
      widgetPayload.map((section) => [section.id, section])
    );

    for (const { id, label } of explorePage.marketCategories) {
      const tabButton = explorePage.getMarketTab(label);
      await expect(tabButton).toBeVisible();
      await tabButton.click();

      const apiSection = apiSections.get(id);
      if (!apiSection) {
        throw new Error(`API should contain the ${label} section`);
      }

      const renderedSymbols = await explorePage.getRenderedSymbolsForCurrentCategory();
      const apiSymbolSet = new Set(apiSection.items.filter(Boolean));

      expect(renderedSymbols.length, `The ${label} market should render at least one symbol`).toBeGreaterThan(0);
      for (const symbol of renderedSymbols) {
        expect(apiSymbolSet.has(symbol), `Rendered ${label} symbol ${symbol} should exist in the API response`).toBe(true);
      }
    }
  });

  test('validates each visible row field and numeric formatting', async () => {
    for (const { label } of explorePage.marketCategories) {
      const tabButton = explorePage.getMarketTab(label);
      await expect(tabButton).toBeVisible();
      await tabButton.click();
      await explorePage.validateRowFields(label);
    }
  });
});
