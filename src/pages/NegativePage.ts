import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class NegativePage extends BasePage {
    readonly url = '/en';

    readonly heroHeading = this.page.getByRole('heading', { name: /crypto for everyone/i });
    readonly nav = this.getNavigation();
    readonly navLinks = this.getNavigationLinks();
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

    async getBrokenNavigationLinks(): Promise<string[]> {
        const links = this.nav.locator('a');
        const count = await links.count();
        const brokenLinks: string[] = [];

        for (let index = 0; index < count; index++) {
            const link = links.nth(index);
            const href = (await link.getAttribute('href')) || '';
            if (!href) {
                continue;
            }

            const url = href.startsWith('http') ? href : new URL(href, this.page.url()).toString();
            const response = await this.page.request.get(url);

            if (response.status() >= 400) {
                brokenLinks.push(`${url} (${response.status()})`);
            }
        }

        return brokenLinks;
    }

    async assertMobileViewportStillShowsHero(): Promise<void> {
        await this.page.setViewportSize({ width: 393, height: 852 });
        await this.gotoHome();
        await expect(this.heroHeading.first()).toBeVisible();
    }

    async assertSlowWidgetDoesNotHang(): Promise<void> {
        await this.page.route('**/api/io/v1/market/widget', async (route) => {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await route.continue();
        });

        await this.page.goto('https://mb.io/en/explore', { waitUntil: 'domcontentloaded' });
        await expect(this.marketHeading).toBeVisible({ timeout: 30_000 });
    }
}
