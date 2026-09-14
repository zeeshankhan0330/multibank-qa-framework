import { test as base } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { RegisterPage } from '@pages/RegisterPage';
import { LoginPage } from '@pages/LoginPage';

type PageFixtures = {
  homePage: HomePage;
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
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
