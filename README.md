# MultiBank QA Automation Framework

[![CI](https://github.com/zeeshankhan0330/multibank-qa-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/zeeshankhan0330/multibank-qa-framework/actions)

Production-grade Playwright + TypeScript UI automation for core MultiBank user flows.

Quick links

- Project: multibank-qa-framework
- Tests: Playwright (`@playwright/test`)
- CI: GitHub Actions (`.github/workflows/ci.yml`)

Prerequisites

- Node.js 18+ installed
- Git

Quick start

```bash
git clone https://github.com/zeeshankhan0330/multibank-qa-framework.git
cd multibank-qa-framework
npm install
npx playwright install --with-deps
npm test
```

Recommended commands

- `npm test` — run full Playwright suite
- `npm run test:smoke` — run smoke-tagged tests
- `npm run test:regression` — run regression-tagged tests
- `npm run test:headed` — run tests in headed mode for debugging

Project structure

```
multibank-qa-framework/
├── src/                 # Page objects, fixtures, utilities
├── tests/e2e/           # Playwright spec files
├── .github/workflows/   # GitHub Actions CI
├── playwright.config.ts  # Playwright configuration (reporters, projects)
└── .vscode/             # Recommended workspace settings
```

Design highlights

- Page Object Model + custom fixtures (see `src/pages` and `src/fixtures`)
- Parallel, project matrix (Chromium/Firefox/WebKit/mobile) configured in `playwright.config.ts`
- HTML + JUnit reporters configured to `reports/`

Navigation coverage and desktop viewport handling

A key requirement for the top navigation is that it behaves correctly at standard desktop viewport sizes. To reflect that in a production-ready way, the project uses desktop-specific Playwright projects in `playwright.config.ts` rather than looping over viewport sizes in the test file.

This keeps the suite readable and prevents a single generic loop from hiding which browser/project actually failed. The framework config defines desktop projects with standard viewport settings so the navigation tests validate real user behavior in common desktop layouts.

Example approach used in the project:

```ts
projects: [
  {
    name: "chromium-desktop",
    use: {
      ...devices["Desktop Chrome"],
      viewport: { width: 1440, height: 900 },
    },
  },
  {
    name: "firefox-desktop",
    use: {
      ...devices["Desktop Firefox"],
      viewport: { width: 1440, height: 900 },
    },
  },
  {
    name: "webkit-desktop",
    use: {
      ...devices["Desktop Safari"],
      viewport: { width: 1440, height: 900 },
    },
  },
];
```

The navigation tests themselves remain route-specific and action-driven: each menu item is checked through its real click flow, and popup/new-tab cases such as `$MBG` are handled with dedicated logic instead of a generic helper.

CI (GitHub Actions)

The repository includes a GitHub Actions workflow that:

- installs Node and dependencies
- installs Playwright browsers
- runs `npm test`
- uploads Playwright HTML report and JUnit XML artifacts

Local development notes

- Generate reproducible installs by committing `package-lock.json` (recommended).
- To view the HTML report after a local run:

```bash
npm test
npx playwright show-report reports/html-report
```

Submission checklist (recommended for interview)

- [x] Clean README (this file)
- [x] `playwright.config.ts` with reporters and projects
- [x] GitHub Actions workflow: `.github/workflows/ci.yml`
- [x] `.vscode/` settings to surface Playwright tests in Test Explorer
- [x] `LICENSE` (MIT)

Extras I can add

- Test status badge in README (added) after a successful run
- `package-lock.json` for deterministic installs
- GitHub Pages publishing of HTML report

Contact / Author

Zeeshan Khan — repository prepared for submission.
