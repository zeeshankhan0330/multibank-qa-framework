import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type MarketCategoryId = 'hot' | 'gainers' | 'losers';

export class ExplorePage extends BasePage {
  readonly url = '/en/explore';

  readonly contentContainer = this.page.getByRole('heading', { name: 'Markets at your fingertips' });
  readonly todaysTopCrypto = this.page.getByRole('heading', { name: /today's top crypto prices/i });
  readonly todaysTopCryptoTableContent = this.page.locator('.bg-neutral-social tr');

  readonly marketWidgetContainer = this.page
    .locator('div')
    .filter({ has: this.page.getByRole('heading', { name: /today's top crypto prices/i }) })
    .filter({ has: this.page.locator('button').filter({ hasText: 'Hot' }) })
    .first();
  readonly marketTabButtons = this.marketWidgetContainer.locator('button');
  readonly marketTable = this.marketWidgetContainer.locator('table').first();
  readonly marketTableRows = this.marketTable.locator('tbody tr');

  readonly marketCategories: ReadonlyArray<{ id: MarketCategoryId; label: string }> = [
    { id: 'hot', label: 'Hot' },
    { id: 'gainers', label: 'Gainers' },
    { id: 'losers', label: 'Losers' },
  ];

  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    await expect(this.contentContainer, 'Explore page should render meaningful content').toBeVisible();
    await expect(this.todaysTopCrypto).toBeVisible({ timeout: 15_000 });
    await expect(this.marketWidgetContainer).toBeVisible();
    await expect(await this.marketTableRows.count()).toBeGreaterThan(0);
    await expect(this.page).toHaveURL(/explore/i);
  }

  async waitForMarketWidgetResponse() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/io/v1/market/widget') && response.request().method() === 'GET'
    );
  }

  getMarketTab(label: string) {
    return this.marketTabButtons.filter({ hasText: label }).first();
  }

  async getRenderedSymbolsForCurrentCategory(): Promise<string[]> {
    const rows = this.marketTableRows;
    const rowCount = await rows.count();
    const renderedSymbols: string[] = [];

    for (let index = 0; index < rowCount; index++) {
      const row = rows.nth(index);
      const symbol = await row.locator('img[alt]').first().getAttribute('alt');
      if (symbol) {
        renderedSymbols.push(symbol);
      }
    }

    return renderedSymbols;
  }

  async validateRowFields(label: string): Promise<void> {
    const rows = this.marketTableRows;
    const rowCount = await rows.count();

    expect(rowCount, `The ${label} market should render at least one row`).toBeGreaterThan(0);

    for (let index = 0; index < rowCount; index++) {
      const row = rows.nth(index);
      const symbol = await row.locator('img[alt]').first().getAttribute('alt');
      const priceText = (await row.locator('td').nth(1).textContent()) ?? '';
      const changeText = (await row.locator('td').nth(2).textContent()) ?? '';

      expect(symbol, `Row ${index} in ${label} should contain a symbol`).toBeTruthy();
      expect(priceText.trim(), `Row ${index} in ${label} should contain a visible price`).not.toBe('');
      expect(changeText.trim(), `Row ${index} in ${label} should contain a visible change percentage`).not.toBe('');
      expect(priceText.trim()).toMatch(/^\$\d+(?:,\d{3})*(?:\.\d+)?$/);
      expect(changeText.trim()).toMatch(/^[+-]?\d+(?:\.\d+)?%$/);
    }
  }

  async assertMarketSectionsMatchApi(widgetPayload: unknown): Promise<void> {
    expect(Array.isArray(widgetPayload), 'Expected the Explore API to return a list of market sections').toBe(true);

    const apiSections = new Map<string, { id: string; items: string[]; name: string }>(
      (widgetPayload as Array<{ id: string; items: string[]; name: string }>).map((section) => [section.id, section])
    );

    await expect(this.todaysTopCrypto).toBeVisible({ timeout: 15_000 });

    for (const { id, label } of this.marketCategories) {
      const tabButton = this.getMarketTab(label);
      await expect(tabButton).toBeVisible();
      await tabButton.click();

      const apiSection = apiSections.get(id);
      if (!apiSection) {
        throw new Error(`API should contain the ${label} section`);
      }

      const renderedSymbols = await this.getRenderedSymbolsForCurrentCategory();
      expect(renderedSymbols.length, `The ${label} market should render at least one symbol`).toBeGreaterThan(0);

      const apiSymbolSet = new Set(apiSection.items.filter(Boolean));
      for (const symbol of renderedSymbols) {
        expect(
          apiSymbolSet.has(symbol),
          `Rendered ${label} symbol ${symbol} should exist in the API response`
        ).toBe(true);
      }
    }
  }
}
