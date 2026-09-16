# MultiBank QA Automation Framework

[![CI](https://github.com/zeeshankhan0330/multibank-qa-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/zeeshankhan0330/multibank-qa-framework/actions)

Playwright + TypeScript UI automation for MultiBank's public trading
platform, built for the QA Automation Coding Challenge.

Prerequisites

- Node.js 20+ installed
- Git

Quick start

```bash
git clone https://github.com/zeeshankhan0330/multibank-qa-framework.git
cd multibank-qa-framework
npm install
npx playwright install --with-deps
npm test
```

Project structure

```
multibank-qa-framework/
├── src/                 # Page objects, fixtures, utilities
├── tests/e2e/           # Playwright spec files
├── .github/workflows/   # GitHub Actions CI
├── playwright.config.ts  # Playwright configuration (reporters, projects)
└── .vscode/             # Recommended workspace settings
```

## Framework & Design Decisions

**Page Object Model + custom fixtures.** Every page (`src/pages/`) encapsulates
its own locators and actions; `src/fixtures/pageFixtures.ts` injects them into
tests via dependency injection rather than tests instantiating `new HomePage(page)`
inline. This keeps specs readable and means a locator change happens in one
place, not wherever it's used.

**Tests call page object methods, never locators directly.** No spec
file in `tests/e2e/` contains a raw `page.locator(...)` or selector
string — tests read as user actions and assertions (`homePage.goToSignUp()`,
`explorePage.getRenderedSymbolsForCurrentCategory()`), while every locator
lives inside its page object. This means a markup change only requires
updating one file, not hunting across the test suite.

**Multi-browser not just Chromium.** `playwright.config.ts`
runs Chromium, Firefox, WebKit profile as separate
projects.

**Retries on CI only, never locally.** A local failure should surface
immediately while debugging; CI retries absorb network flakiness without
masking a real regression — a test that fails twice on CI is treated as
a real bug, not flake.

**Serial execution for the trading/market-widget suite** — a deliberate
exception to the framework's default parallelism.** `trading.spec.ts`
uses `test.describe.serial` because all three tests in that file share
one API response captured once in `beforeAll` (confirmed via network
inspection that Hot/Gainers/Losers tab-switching is client-side
filtering of a single initial payload, not three separate API calls).
Fetching it once and reusing it across tests is faster and more accurate
than re-fetching per test; serial execution is the cost of that
optimization, not an oversight.

**Test data is externalized, not hardcoded.** Expected navigation labels
live in `tests/data/navLinks.json`, not inline in `navigation.spec.ts` — the
test asserts against imported data, so updating expected nav items means
editing a JSON file, not the test logic itself.

**Enums over hardcoded strings for repeated values.** Navigation labels
(`Explore`, `Features`, `OTC Desk`, etc.) are defined once as a
`NavigationLabel` enum in `HomePage.ts` and referenced by name everywhere
else — `homePage.clickNavigationLink(NavigationLabel.Explore)` rather than
the literal string `'Explore'` repeated across every test. A typo in a
hardcoded string fails silently at runtime; a typo referencing an enum
member fails at compile time, before the test ever runs.

**HTML + JUnit reporting.** JUnit output feeds CI's native test-result
reporting (pass/fail inline in GitHub Actions); the HTML report is the
human-debuggable artifact with traces and videos attached on first retry.

## Task 2 — QA Strategy, Test Plan, Release Checklist & Risk Matrix

Written responses to Task 2's five questions, along with the required
test plan, release readiness checklist, and risk matrix, are in
[`TASK2-QA-STRATEGY.md`](./TASK2-QA-STRATEGY.md).


Contact / Author
Zeeshan Khan — repository prepared for submission.
