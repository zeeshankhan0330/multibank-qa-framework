import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class NegativePage extends BasePage {
    readonly url = '/en';

    readonly marketHeading = this.page.getByRole('heading', { name: /today's top crypto prices/i });

    constructor(page: Page) {
        super(page);
    }

    async gotoHome(): Promise<void> {
        await this.page.goto(this.url, { waitUntil: 'domcontentloaded' });
        await expect(this.page).toHaveURL(/\/en\/?$/i);
    }

    async assertInvalidRouteReturnsExpectedStatus(): Promise<void> {
        const response = await this.page.goto('/this-route-should-not-exist-qa');

        if (response) {
            expect([404, 410, 400]).toContain(response.status());
        } else {
            expect(this.page.url()).not.toMatch(/\/en\/?$/);
        }
    }

    async assertSlowWidgetDoesNotHang(): Promise<void> {
        await this.page.route('**/api/io/v1/market/widget', async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await route.continue();
        });

        await this.page.goto('/en/explore', { waitUntil: 'domcontentloaded' });
        await expect(this.marketHeading).toBeVisible({ timeout: 30_000 });
    }

    async assertNeverResolvingWidgetRequestDoesNotCrash(): Promise<void> {
        let pageError = false;
        this.page.on('pageerror', () => {
            pageError = true;
        });

        await this.page.route('**/api/io/v1/market/widget', async () => {
            await new Promise(() => undefined);
        });

        await this.page.goto('/en/explore', { waitUntil: 'domcontentloaded' });

        const bodyText = await this.page.locator('body').innerText();
        expect(bodyText.length).toBeGreaterThan(0);
        await expect(this.page.getByRole('heading', { name: /today's top crypto prices/i })).toBeVisible({ timeout: 30_000 });
        expect(pageError, 'The page should not crash or throw an unhandled error when the widget request never resolves').toBe(false);
    }
}
