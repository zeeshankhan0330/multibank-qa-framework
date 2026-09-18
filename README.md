# MultiBank QA Automation Framework

[![CI](https://github.com/zeeshankhan0330/multibank-qa-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/zeeshankhan0330/multibank-qa-framework/actions)

## Overview

This repository contains a Playwright + TypeScript automation framework created for the MultiBank Group QA Automation assessment.

The framework focuses on validating key public-facing MultiBank platform flows including navigation, market/trading data, content, links and negative/edge scenarios.

The framework is designed with maintainability and scalability in mind using Page Object Model, custom fixtures, API/UI validation, cross-browser execution and CI reporting.

## Assessment Coverage

| Assessment Requirement | Implementation |
|---|---|
| Navigation & layout | Navigation E2E tests |
| Navigation destinations | Destination assertions for internal/external links |
| Trading / market data | UI + API market data validation |
| Trading pair categories | Category validation against market data |
| Marketing content | Content validation |
| App Store / Google Play links | Link destination validation |
| Why MultiBank page | Page/component/content validation |
| Invalid route | Negative route test |
| Cross-browser execution | Chromium, Firefox, WebKit |
| API/network validation | Market API validation |
| CI | GitHub Actions |
| Reporting | HTML + JUnit |
| Task 2 | `TASK2-QA-STRATEGY.md` |

## Technology Stack

- Playwright
- TypeScript
- Node.js 20+
- GitHub Actions
- HTML / JUnit reporting

## Project Structure

```text
multibank-qa-framework/
├── src/
│   ├── pages/            # Page Object Models encapsulating UI locators and user actions
│   ├── fixtures/         # Custom Playwright fixtures for shared test setup and dependencies
│   └── utils/            # Reusable helpers and test utilities
│
├── tests/
│   └── e2e/              # End-to-end tests grouped by functional area and tagged by test type
│
├── evidence/             # Sample execution evidence and cross-browser test results
│
├── .github/
│   └── workflows/        # GitHub Actions workflow for automated test execution and reporting
│
├── playwright.config.ts  # Browser projects, viewport, timeouts, reporters, retries and test configuration
├── TASK2-QA-STRATEGY.md  # Task 2 QA strategy, test plan, release checklist and risk matrix
├── package.json          # Project scripts and dependencies
└── .vscode/              # Recommended VS Code workspace settings

Test Specs
    ↓
Custom Fixtures
    ↓
Page Objects
    ↓
UI / API
    ↓
Assertions & Reporting

## Design

- Tests contain business-level scenarios and assertions.
- Page Objects encapsulate locators and UI interactions.
- Fixtures provide reusable test dependencies and setup.
- Utilities contain shared functionality.
- API validation is used where UI data is backed by network responses.
- Playwright configuration centralizes browser projects, execution settings and reporting.

## Test Coverage

## Navigation
- Expected top navigation items are visible.
- Navigation destinations are validated.
- New-tab navigation is handled where applicable.

## Trading / Market Data
- Market data is available.
- Trading symbols/categories are validated.
- Rendered market values contain expected fields and numeric formats.
- API responses are validated where appropriate.

## Content
- Marketing content is rendered.
- App Store / Google Play links are validated.
- About Us / Why MultiBank content is validated.

## Negative / Edge Cases
- Invalid route handling.
- Slow content/network handling.


## Browser & Execution Matrix

| Browser | Viewport | Purpose |
|---|---|---|
| Chromium | 1440 × 900 | Desktop |
| Firefox | 1440 × 900 | Desktop compatibility |
| WebKit | 1440 × 900 | Desktop compatibility |
| Mobile | Configured mobile viewport | Responsive regression |

The framework uses Playwright projects to execute the suite across supported browser configurations.

## Installation & Setup

### Prerequisites

- Node.js 20+
- npm

```bash
git clone https://github.com/zeeshankhan0330/multibank-qa-framework.git
cd multibank-qa-framework
npm install
npx playwright install --with-deps
npm test
```
## CI/CD

GitHub Actions executes the Playwright test suite in a clean Node.js environment.

The workflow:

1. Checks out the repository.
2. Installs Node.js dependencies.
3. Installs Playwright browsers.
4. Executes the test suite.
5. Generates HTML/JUnit reports.
6. Uploads test results as workflow artifacts.

## Task 2 – QA Strategy

The Task 2 scenario and responses are documented separately:

[`TASK2-QA-STRATEGY.md`](./TASK2-QA-STRATEGY.md)

The document covers:

- Initial assessment and risk identification
- Test strategy for a fintech trading application
- QA activities within the sprint
- Regression strategy
- Release risks
- Test plan
- Release readiness checklist
- Risk matrix

## QA Deliverables

| Deliverable | Location |
|---|---|
| Automation framework | Repository |
| Test specifications | `tests/e2e/` |
| Page Objects | `src/pages/` |
| Fixtures | `src/fixtures/` |
| Test evidence | `evidence/` |
| Task 2 strategy | `TASK2-QA-STRATEGY.md` |
| Test plan | `TASK2-QA-STRATEGY.md` |
| Release readiness checklist | `TASK2-QA-STRATEGY.md` |
| Risk matrix | `TASK2-QA-STRATEGY.md` |
| CI workflow | `.github/workflows/` |

## Limitations / Known Constraints

- The assessment was limited to publicly accessible functionality as instructed.
- No account creation or personal/financial information was used.
- Some trading functionality described in the assessment was not consistently exposed through the public UI; the implemented validation approach is documented above.

### Trading-pair scenario assumption

The assessment specifies validation of the Spot trading section,
trading-pair categorisation, and pair-level data fields.

At the time of execution, the publicly accessible target application
did not consistently expose the Spot trading UI described in the
assessment. Therefore, the automation validates the currently
observable trading/market content without inventing application
behaviour that could not be verified.

This limitation is documented rather than treated as a passing
functional assertion against an assumed UI.

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


## Evidence Of Test Run on local

Evidence of test run on my local machine can be found in evidence folder
Also, CI pipeline of this repo is configured to run the tests.

## Assessment Coverage

| Requirement | Implementation |
|---|---|
| Navigation & layout | `tests/e2e/navigation.spec.ts` |
| Trading / market data | `tests/e2e/trading.spec.ts` |
| Marketing / app links | `tests/e2e/content.spec.ts` |
| Invalid route | `tests/e2e/negative.spec.ts` |
| Slow-content handling | `tests/e2e/negative.spec.ts` |
| API validation | `src/pages/ExplorePage.ts` |
| Cross-browser | Chromium / Firefox / WebKit |
| CI | `.github/workflows/ci.yml` |
| Task 2 | `TASK2-QA-STRATEGY.md` |
| Evidence | `evidence/` |  

## Browser Matrix

- Chromium — Desktop 1440x900
- Firefox — Desktop 1440x900
- WebKit — Desktop 1440x900

CI executes the configured browser projects and publishes HTML/JUnit results.
