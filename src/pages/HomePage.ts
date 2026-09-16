import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export enum NavigationLabel {
  Explore = 'Explore',
  Features = 'Features',
  OtcDesk = 'OTC Desk',
  Company = 'Company',
  Support = 'Support',
  Blog = 'Blog',
  Mbg = '$MBG',
}

export class HomePage extends BasePage {
  readonly url = '/en';

  readonly signUpButton = this.page.getByRole('link', { name: /sign up/i });
  readonly openAccountButton = this.page.getByRole('link', { name: /open an account/i }).first();
  readonly exploreAllAssetsLink = this.page.getByRole('link', { name: /explore all assets/i });
  readonly heroHeading = this.page.getByRole('heading', { name: /crypto for everyone/i });
  readonly downloadAppLink = this.page.getByRole('link', { name: /download the app/i }).first();
  readonly primaryCta = this.page.getByRole('link', { name: /open an account|start portfolio|download the app/i }).first();
  readonly header = this.page.getByRole('banner').first();
  readonly footer = this.page.locator('footer').first();
  readonly nav = this.getNavigation();
  readonly navLinks = this.getNavigationLinks();

  constructor(page: Page) {
    super(page);
  }

  async assertNavigationLinksPresentAndEnabled(expectedLabels: string[], expectedCount?: number): Promise<void> {
    const actualCount = await this.navLinks.count();
    if (typeof expectedCount === 'number') {
      await expect(actualCount).toBe(expectedCount);
    }

    // Quick presence/count check using a single Playwright call
    const texts = await this.navLinks.allInnerTexts();
    const lower = texts.map((t) => t.trim().toLowerCase());

    const missing = expectedLabels.filter((l) => !lower.some((t) => t.includes(l.toLowerCase())));
    if (missing.length > 0) {
      await expect(
        missing.length,
        `expected navigation to include all labels, missing: ${missing.join(', ')}`
      ).toBe(0);
    }

    // Per-label actionability checks (visibility / enabled)
    for (const label of expectedLabels) {
      const locator = this.nav.getByRole('link', { name: label }).first();
      await expect(locator, `navigation link "${label}" should be visible`).toBeVisible();
      await expect(locator, `navigation link "${label}" should be enabled`).toBeEnabled();
    }
  }

  async clickNavigationLink(label: NavigationLabel): Promise<void> {
    const link = this.nav.getByRole('link', { name: label }).first();
    await expect(link, `navigation link "${label}" should be visible`).toBeVisible();

    const href = (await link.getAttribute('href')) || '';
    if (!href) {
      throw new Error(`Navigation link "${label}" has no href`);
    }

    if (href.startsWith('http') && !href.includes(new URL(this.page.url()).host)) {
      return;
    }

    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      link.click(),
    ]);
  }

  async clickNavigationLinkInNewTab(label: string): Promise<Page> {
    const link = this.nav.getByRole('link', { name: label }).first();
    await expect(link, `navigation link "${label}" should be visible`).toBeVisible();

    const [newTab] = await Promise.all([
      this.page.waitForEvent('popup'),
      link.click(),
    ]);

    await newTab.waitForLoadState('domcontentloaded');
    return newTab;
  }

  async assertMarketingHeroInMainRegion(): Promise<void> {
    const hero = this.heroHeading;
    const cta = this.primaryCta;
    const header = this.header;
    const footer = this.footer;

    await expect(hero, 'marketing hero heading should render in the main content area').toBeVisible();
    await expect(cta, 'homepage primary CTA should render in the hero area').toBeVisible();

    const heroBox = await hero.boundingBox();
    const headerBox = await header.boundingBox();
    const footerBox = await footer.boundingBox();
    const viewportHeight = this.page.viewportSize()?.height ?? 900;

    expect(heroBox, 'hero heading should have a bounding box').not.toBeNull();
    expect(headerBox, 'page header should have a bounding box').not.toBeNull();

    if (headerBox) {
      expect(heroBox!.y, 'marketing hero should start at or below the header region').toBeGreaterThanOrEqual(headerBox.y);
    }

    if (footerBox) {
      expect(heroBox!.y, 'marketing hero should appear above the footer').toBeLessThan(footerBox.y);
    }

    expect(heroBox!.y, 'marketing hero should sit in the upper content area of the page').toBeLessThan(viewportHeight * 0.75);
  }

  async getDownloadAppHref(): Promise<string> {
    await expect(this.downloadAppLink, 'Download app CTA should exist').toBeVisible();

    const href = await this.downloadAppLink.getAttribute('href');
    expect(href, 'Download app link should be present').toBeTruthy();
    expect(href ?? '', 'Download app link should point to a supported app download destination').toMatch(
      /go\.link|apps\.apple\.com|itunes\.apple\.com|play\.google\.com/i
    );
    expect(href ?? '', 'Download app CTA should not point to login or auth pages').not.toMatch(
      /\/login|sign(?:in|up)|auth|account/i
    );

    return href ?? '';
  }

  async clickDownloadAppLink(): Promise<string> {
    const popupPromise = this.page.context().waitForEvent('page', { timeout: 15000 }).catch(() => null);
    await this.downloadAppLink.click({ force: true });

    const newTab = await popupPromise;
    const targetUrl = newTab && newTab.url() ? newTab.url() : await this.getDownloadAppHref();

    expect(targetUrl, 'Download app CTA should resolve to an app download URL after click').toMatch(
      /go\.link|apps\.apple\.com|itunes\.apple\.com|play\.google\.com|intent:\/\//i
    );
    expect(targetUrl, 'Download app CTA should not open a login/auth page after click').not.toMatch(
      /\/login|sign(?:in|up)|auth|account/i
    );

    return targetUrl;
  }
}
