# QA Strategy: Mobile Fintech Application

## 1. Testing Approach

A risk-weighted, layered strategy rather than uniform coverage everywhere —
in fintech, not all bugs are equal, and treating them as equal wastes
sprint capacity on low-risk surfaces while under-testing money-movement paths.

**Test pyramid, weighted toward the base:**
- **Unit (60%)** — business logic: interest/fee calculations, currency
  conversion, validation rules. Owned by developers, run on every commit.
- **API/contract (25%)** — every service boundary (payments, KYC, ledger,
  notifications) gets contract tests so a backend change can't silently
  break a consumer without the pipeline catching it before deployment.
- **UI/E2E (10%)** — Playwright/Appium covering only the flows a unit or
  contract test structurally cannot: full user journeys (onboarding →
  KYC → fund account → transact), platform-specific rendering, biometric
  auth prompts.
- **Exploratory/manual (5%)** — new features pre-release, and anything
  where automated coverage would cost more to build/maintain than the
  risk it retires (e.g. one-off promotional UI).

**Why contract testing gets its own explicit tier:** in a services
architecture, the most expensive fintech bugs are integration breaks that
each team's unit tests pass individually but that fail the moment two
services interact in production — a payments-service response shape
drifting out from under a mobile client, for example. Catching that
requires testing against the *contract*, not re-testing business logic
that's already covered.

## 2. Sprint QA Process

- **Day 1 (planning):** QA reviews acceptance criteria before sprint
  commitment — ambiguous criteria get clarified now, not during test
  execution when it's expensive to loop back.
- **Throughout sprint:** test cases and automation are written alongside
  development, not after — a feature isn't "done" until its automated
  coverage merges with it. This keeps regression debt from accumulating
  silently.
- **Mid-sprint:** contract tests run on every merge to a shared branch,
  catching integration breaks within hours, not at release-candidate time.
- **Pre-sprint-close:** smoke suite (@smoke tag) runs against the
  release-candidate build; full regression runs overnight so results are
  ready for sprint review.
- **Sprint review:** QA reports not just pass/fail counts but risk
  posture — what's covered, what's deliberately deferred, and why.

## 3. Regression Strategy

- **Tiered, not exhaustive-every-time:** a tagged `@smoke` suite (critical
  paths: login, balance view, fund transfer, KYC submission) runs on
  every build. A full `@regression` suite runs nightly and pre-release.
  Running the full suite on every commit doesn't scale as the suite
  grows — tiering is what keeps CI fast enough that developers don't
  start ignoring it.
- **Money-movement paths are never deprioritized:** any flow touching
  balance, transfer, or ledger state gets regression coverage on every
  release candidate, full stop — no exceptions for "low risk this
  sprint."
- **Flaky-test policy:** a test that fails intermittently is quarantined
  and ticketed within 48 hours, not silently retried indefinitely — a
  suite people don't trust gets ignored, and an ignored suite is worse
  than no suite.
- **Device/OS matrix:** regression runs against a defined matrix of
  OS versions and device classes (not just the latest simulator) —
  fintech apps have a longer install-base tail than most, since users
  are slower to upgrade devices holding financial apps.

## 4. Key Release Risks

- **Money-movement correctness** — miscalculated balances, duplicate or
  lost transactions, currency-conversion rounding errors. Mitigated by
  the unit-test weighting above plus reconciliation checks in staging
  before every release.
- **Auth and session security** — token expiry handling, biometric
  fallback flows, session fixation across app backgrounding — mobile
  apps have more auth edge cases (backgrounding, OS-level biometric
  prompts, deep links) than web, and these are disproportionately
  under-tested because they're awkward to automate.
- **Third-party integration drift** — KYC providers, payment rails, push
  notification services can change behavior without notice. Contract
  tests plus monitoring/alerting in production are the mitigation, since
  no amount of pre-release testing catches a third party's own outage.
- **Regulatory/compliance regressions** — a UI change that accidentally
  removes a required disclosure or consent step is a compliance failure,
  not just a bug. These get explicit test cases tied to the regulatory
  requirement, not just "the button works."
- **Offline/poor-connectivity behavior** — a fintech app that silently
  fails or double-submits a transaction under flaky mobile connectivity
  is a release risk unique to mobile that a desktop-first strategy would
  miss; idempotency and retry-safety need explicit test coverage.

## Summary

The strategy optimizes for catching the bugs that cost the most —
money-movement correctness, integration breaks, and compliance — before
release, while keeping the regression suite fast and trusted enough that
teams actually run it instead of working around it.
