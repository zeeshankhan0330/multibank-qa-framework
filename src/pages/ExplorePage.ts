import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export type MarketCategoryId = 'hot' | 'gainers' | 'losers';

export class ExplorePage extends BasePage {
  readonly url = '/en/explore';

  readonly contentContainer = this.page.getByRole('heading', { name: 'Markets at your fingertips' });
  readonly todaysTopCrypto = this.page.getByRole('heading', { name: /today's top crypto prices/i });
  readonly todaysTopCryptoTableContent = this.page.locator('.bg-neutral-social tr');
  readonly marketTableRows = this.page.locator('table tbody tr');
  readonly marketTabButtons = this.page.locator('button');

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
    await expect(await this.todaysTopCryptoTableContent.count()).toBeGreaterThan(0);
    await expect(this.page).toHaveURL(/explore/i);
  }

  async waitForMarketWidgetResponse() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes('/api/io/v1/market/widget') && response.request().method() === 'GET'
    );
  }

  async assertMarketSectionsMatchApi(widgetPayload: unknown): Promise<void> {
    expect(Array.isArray(widgetPayload), 'Expected the Explore API to return a list of market sections').toBe(true);

    const apiSections = new Map<string, { id: string; items: string[]; name: string }>(
      (widgetPayload as Array<{ id: string; items: string[]; name: string }>).map((section) => [section.id, section])
    );

    await expect(this.todaysTopCrypto).toBeVisible({ timeout: 15_000 });

    for (const { id, label } of this.marketCategories) {
      const tabButton = this.marketTabButtons.filter({ hasText: label }).first();
      await expect(tabButton).toBeVisible();
      await tabButton.click();

      const apiSection = apiSections.get(id);
      if (!apiSection) {
        throw new Error(`API should contain the ${label} section`);
      }

      const rows = this.marketTableRows;
      await expect(rows.first()).toBeVisible({ timeout: 15_000 });

      const rowCount = await rows.count();
      expect(rowCount, `The ${label} market should render at least one row`).toBeGreaterThan(0);

      const renderedSymbols: string[] = [];

      for (let index = 0; index < rowCount; index++) {
        const row = rows.nth(index);
        const symbol = await row.locator('img[alt]').first().getAttribute('alt');
        const priceText = (await row.locator('td').nth(1).textContent()) ?? '';
        const changeText = (await row.locator('td').nth(2).textContent()) ?? '';

        expect(symbol, `Row ${index} in ${label} should contain a symbol`).toBeTruthy();
        expect(priceText.trim(), `Row ${index} in ${label} should contain a visible price`).not.toBe('');
        expect(changeText.trim(), `Row ${index} in ${label} should contain a visible change percentage`).not.toBe('');
        expect(priceText.trim()).toMatch(/^\$\d[\d,]*\.\d+$/);
        expect(changeText.trim()).toMatch(/^[+-]?\d+(?:\.\d+)?%$/);

        renderedSymbols.push(symbol!);
      }

      const actualSymbols = [...renderedSymbols].filter(Boolean);
      const apiSymbolSet = new Set(apiSection.items.filter(Boolean));

      expect(actualSymbols.length, `The ${label} market should render at least one symbol`).toBeGreaterThan(0);
      expect(new Set(actualSymbols).size, `The ${label} market should not contain duplicate symbols`).toBe(actualSymbols.length);

      for (const symbol of actualSymbols) {
        expect(
          apiSymbolSet.has(symbol),
          `Rendered ${label} symbol ${symbol} should exist in the API response`
        ).toBe(true);
      }
    }
  }
}
