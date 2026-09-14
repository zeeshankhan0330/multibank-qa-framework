# MultiBank QA Automation Framework

Production-grade Playwright/TypeScript UI automation framework built to test
critical user flows on the MultiBank Group trading platform (`mb.io`).

## Why this architecture

| Decision | Reasoning |
|---|---|
| **Page Object Model + custom fixtures** | Specs never touch selectors directly. Fixtures (`src/fixtures/pageFixtures.ts`) inject page objects, so adding a new flow means adding a page object + a fixture entry, not rewriting boilerplate in every test. |
| **`fullyParallel: true`, worker-scoped test data** | Each spec runs isolated. `generateTestEmail()` guarantees no collisions across parallel workers hitting a shared staging environment — critical for a trading platform where duplicate-account errors would produce false failures. |
| **Tagged suites (`@smoke` / `@regression`)** | CI runs `@smoke` on every merge request (fast feedback, <2 min) and the full `@regression` matrix only on `main`/schedule — keeps developer feedback loops fast without sacrificing coverage before release. |
| **Retries on CI only, never locally** | A test that fails twice on CI is a real bug, not flake — retries absorb network jitter without hiding regressions. Local runs fail immediately so you're not waiting on retries while debugging. |
| **Multi-browser + mobile viewport matrix** | Chromium, Firefox, WebKit, and a Pixel 7 mobile profile — a trading platform's mobile experience is not optional; a UI bug that only reproduces in Safari/WebKit is exactly the kind of thing that reaches production without this. |
| **JUnit + HTML reporters** | JUnit feeds GitLab's native MR test-report widget (pass/fail inline on the merge request); HTML report is the human-debuggable artifact with traces/videos on first retry. |
| **GitLab CI with matrix parallelism** | Mirrors the existing GitLab CI/CD pipeline pattern — lint stage gates MRs, smoke stage gives fast MR feedback, regression stage runs the full browser matrix on `main` merges and nightly schedules. |
| **Docker parity** | `Dockerfile` uses the same base image (`mcr.microsoft.com/playwright:v1.48.0-jammy`) locally and in CI, eliminating "works on my machine" browser-version drift. |

## Project structure

```
multibank-qa-framework/
├── src/
│   ├── pages/          # Page Object Models (BasePage, HomePage, RegisterPage, LoginPage)
│   ├── fixtures/        # Custom Playwright fixtures — dependency injection for POMs
│   └── utils/           # Test data generators, shared helpers
├── tests/
│   └── e2e/              # Spec files, tagged @smoke / @regression
├── reports/              # HTML + JUnit output (gitignored, generated at runtime)
├── .gitlab-ci.yml        # Lint → smoke → regression (matrix) → report pipeline
├── Dockerfile            # Local/CI parity
└── playwright.config.ts  # Central runtime config (timeouts, retries, projects, reporters)
```

## Critical flows covered (Task 1 scope)

1. **Homepage** — hero content renders, primary CTAs (Sign Up, Explore Assets) are functional. `@smoke`
2. **Registration** — valid signup, mismatched-password rejection, malformed-email client-side validation. `@regression`
3. **Login** — invalid-credential handling **with an explicit assertion against user-enumeration** (the error message must not reveal whether an email exists — a real fintech security requirement, not just a UX check), forgot-password routing, empty-form client validation. `@regression`

This is a starting skeleton, not the full suite — the same POM + fixture pattern extends cleanly to deposit flows, KYC steps, trade execution, and portfolio views as next increments.

## Running locally

```bash
npm install
npx playwright install --with-deps
npm test                    # full suite, all browsers
npm run test:smoke          # fast smoke gate only
npm run test:regression     # full regression tagged suite
npm run test:headed         # watch it run
npm run report              # open the last HTML report
```

## Running in Docker

```bash
docker build -t multibank-qa .
docker run --rm multibank-qa
```

## CI

Pipeline defined in `.gitlab-ci.yml`:
- **lint** — runs on every MR
- **smoke** — Chromium only, every MR, fast feedback
- **regression** — full Chromium/Firefox/WebKit matrix, on `main` merges and scheduled runs
- **publish_html_report** — archives the HTML report as a 30-day pipeline artifact

## Next increments (documented intentionally, not implemented, to keep this a focused first pass)

- API-layer test client for setting up test accounts via backend endpoints instead of UI registration (faster, less flaky test setup for flows that depend on an existing logged-in user)
- Visual regression baseline for the trading dashboard
- Accessibility (axe-core) checks folded into `@smoke`
