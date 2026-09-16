# 1. Where do you start?

I would start by defining the highest-risk user journeys and the trust boundaries before automating anything. In a fintech app with real user funds, the first questions are not “what looks nice on the homepage?” but “what can lose money, expose sensitive data, or make users think a transaction succeeded when it did not?”

That means I would map the app by risk: authentication, account funding, transfers, balances, transaction history, notifications, KYC, and any crypto price or market data that drives trading decisions. I would also check the actual public entry points and the live app states that can fail in production: login flows, mobile nav, market widgets, and marketplace pages. The first pass is about understanding the product priorities, user flows, and the biggest operational risks.

If there is no test suite yet, I would begin with a lightweight risk-based smoke plan, not a broad automation sweep. I would identify 5–10 critical paths, document expected behavior, and add automation only where the risk and failure cost justify it.

# 2. How would you approach testing this app?

I would use a layered test strategy: risk-based manual exploration, key API/contract checks, and a lean UI automation suite that focuses on user-critical paths instead of every possible screen.

For a mobile trading app, the biggest areas to cover are:
- onboarding and auth
- KYC flows
- account creation, funding, transfers, and balances
- security flows such as session expiry, MFA, biometric fallback, and logout
- app/store download and deep-link flows
- live market data rendering and price-change accuracy
- mobile navigation and responsive layouts
- error, timeout, and empty-state handling

I would validate both functional correctness and product safety. For example, a market widget may render fine but still be wrong if the wrong data source is wired in, if a tab shows stale values, or if a timeout degrades into a blank screen. I would test the real user experience: is the app usable, understandable, and safe under failure?

I would also test against live conditions, not only local assumptions. That means checking production-like paths, real navigation states, slow network behavior, and mobile-only interactions that don’t exist on desktop web.

# 3. What does QA look like inside a sprint, from ticket creation through to regression?

At the start of a sprint, QA would review the ticket with engineering and product, clarify acceptance criteria, and identify risk areas before development starts. The goal is to define what “done” means before the work is built, especially for money-moving flows.

During the sprint, I would:
- review stories and break them into testable conditions
- create test cases and automation in parallel with development
- run smoke checks on every build
- validate the acceptance criteria on feature branches
- log UI bugs and API issues in the same working language used by engineering
- call out risk and missing edge cases early, not after release

Before sprint close, I would run a release candidate pass across the critical flows and ensure the app still behaves correctly under the expected environment conditions. I would also verify regression coverage for any area touched by the sprint, especially if it included trading logic, auth, or content that can affect customer trust.

At the end of the sprint, the QA output is not just “tests passed.” It is a risk summary: what changed, what is covered, what is still manual, and what issues remain open. That matters especially in fintech, where a missing acceptance criteria check can be worth more than any single UI bug.

# 4. What does your ideal regression suite look like?

My ideal regression suite is risk-based, not exhaustive. It should be fast enough that developers trust it and broad enough that we catch high-cost failures early.

A strong regression suite would include:
- smoke tests for login, onboarding, market page loads, nav, and core trading actions
- mobile viewport checks for key flows
- API contract validation for live data feeds, market widget responses, and critical backend responses
- error-path tests for invalid routes, slow API responses, timeouts, and empty states
- cross-browser checks for core flows and a single mobile viewport set
- navigation coverage across the primary app tree
- critical transaction flows with assertions on visible state, not just page load

The ideal suite should balance reproducibility with speed. It should catch regressions from the highest-risk flows automatically, while leaving exploratory testing for edge cases or unusual product behavior that does not justify permanent automation.

# 5. What would keep you up at night about this app specifically and releasing to the public?

The biggest concerns are the ones tied to real money and live market data.

I would be most worried about:
- incorrect or stale market pricing
- transaction failures or duplicate actions
- broken auth or session handling on mobile devices
- timeout and slow-network behavior that leaves the user with a blank or misleading screen
- broken or hidden mobile navigation, especially if users cannot reach key pages
- legal/compliance issues such as missing disclosures, risky messaging, or broken account flows
- third-party integration drift, especially for market data, authentication, or app-store links

For a fintech app, that mostly comes down to not losing user trust or their money — even when the network or the platform itself isn't behaving.

## Test plan

### Objective
Validate the app’s most critical user journeys and failure modes before public release, with a focus on financial correctness, secure flows, and mobile usability.

### Scope
- authentication and onboarding
- market data display and navigation
- mobile menu behavior
- transaction and balance-related flows
- invalid-route and timeout handling
- critical links and app-store redirects

### Execution plan
1. Map risk areas and prioritize user journeys by financial impact.
2. Add smoke coverage for login, market data page, and primary navigation.
3. Add edge-case coverage for invalid routes, slow-loads, and mobile layouts.
4. Validate API data contract against the rendered UI.
5. Run the smoke suite on every build and a broader regression suite before release.

## Release readiness checklist

- critical user flows pass on mobile and desktop
- no broken key navigation links in live user paths
- market data page renders with real data and expected layout
- timeout and slow-network states remain graceful
- invalid routes behave safely and predictably
- app-store/download links resolve correctly
- auth and session flows are validated
- no unhandled errors in the console or UI
- release notes and rollback plan are prepared
- known issues are explicitly triaged and accepted

## Risk matrix

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Incorrect or stale market pricing | Medium | Critical | Validate render vs API contract; test market data page under slow and failed network conditions |
| Duplicate or incorrect financial action | Medium | Critical | Add transaction-path regression tests and confirm user confirmation states |
| Broken mobile navigation | Medium | High | Test mobile menu open/close flows and required nav items at mobile breakpoint |
| Timeout or failed API requests | High | High | Add slow-load and abort/timeout tests; verify graceful fallback state |
| Invalid routing or hidden broken links | Medium | Medium | Add invalid-route checks and automated detection of broken nav links |
| Regulatory or disclosure regressions | Medium | Critical | Include legal/compliance checks in release QA and smoke tests |
| Third-party link or app-store redirect issues | Medium | Medium | Validate deep links and app-download destinations before release |

This is the structure I would use to answer the assignment directly: start with risk, test in layers, verify the user-impacting flows, and tie everything back to public release risk in fintech.
