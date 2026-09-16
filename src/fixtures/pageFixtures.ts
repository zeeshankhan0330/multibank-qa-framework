import { test as base } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { RegisterPage } from '@pages/RegisterPage';
import { LoginPage } from '@pages/LoginPage';
import { ExplorePage } from '@pages/ExplorePage';
import { FeaturesPage } from '@pages/FeaturesPage';
import { OtcDeskPage } from '@pages/OtcDeskPage';
import { CompanyPage } from '@pages/CompanyPage';
import { SupportPage } from '@pages/SupportPage';
import { BlogPage } from '@pages/BlogPage';
import { MbgPage } from '@pages/MbgPage';
import { NegativePage } from '@pages/NegativePage';

type PageFixtures = {
  homePage: HomePage;
  explorePage: ExplorePage;
  negativePage: NegativePage;
  featuresPage: FeaturesPage;
  otcDeskPage: OtcDeskPage;
  companyPage: CompanyPage;
  supportPage: SupportPage;
  blogPage: BlogPage;
  mbgPage: MbgPage;
  registerPage: RegisterPage;
  loginPage: LoginPage;
};

/**
 * Why fixtures instead of instantiating POMs inline in every test:
 * - Single place to change construction logic (e.g. if a page object later
 *   needs an API client or test-data seeding, it changes here once).
 * - Each fixture is lazily created only if the test actually requests it,
 *   keeping unrelated specs fast.
 * - Matches the pattern used in the NUnit parallel suites: composition
 *   over per-test setup boilerplate.
 */
export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  explorePage: async ({ page }, use) => {
    await use(new ExplorePage(page));
  },
  negativePage: async ({ page }, use) => {
    await use(new NegativePage(page));
  },
  featuresPage: async ({ page }, use) => {
    await use(new FeaturesPage(page));
  },
  otcDeskPage: async ({ page }, use) => {
    await use(new OtcDeskPage(page));
  },
  companyPage: async ({ page }, use) => {
    await use(new CompanyPage(page));
  },
  supportPage: async ({ page }, use) => {
    await use(new SupportPage(page));
  },
  blogPage: async ({ page }, use) => {
    await use(new BlogPage(page));
  },
  mbgPage: async ({ page }, use) => {
    await use(new MbgPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
