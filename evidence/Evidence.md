# Test Execution Evidence

Command:

    npm test

Browser projects:
- Chromium Desktop
- Firefox Desktop
- WebKit Desktop

Execution evidence:
See `evidenceOfTestRunOnMultiBrowsers.png`.

The attached screenshot captures the local execution output
for the configured browser projects.


zeeshankhan@Mac multibank-qa-framework % npm test

> multibank-qa-framework@1.0.0 test
> playwright test


Running 48 tests using 5 workers

  ✓   1 ….ts:16:7 › Top Navigation @desktop › should navigate to Explore page successfully (3.6s)
  ✓   2 …› Content & External Links › marketing banners render in the expected page region (1.4s)
  ✓   3 …ent & External Links › App Store and Google Play download links resolve correctly (3.1s)
  ✓   4 …iBank page renders all expected components with correct headings and section text (2.7s)
  ✓   5 … Top Navigation @desktop › navigation displays expected items at desktop viewport (1.2s)
  ✓   6 …ts:21:7 › Top Navigation @desktop › should navigate to Features page successfully (3.6s)
  ✓   7 …ts:26:7 › Top Navigation @desktop › should navigate to OTC Desk page successfully (2.2s)
  ✓   8 ….ts:31:7 › Top Navigation @desktop › should navigate to Company page successfully (1.3s)
  ✓   9 ….ts:36:7 › Top Navigation @desktop › should navigate to Support page successfully (1.2s)
  ✓  10 …pec.ts:41:7 › Top Navigation @desktop › should navigate to Blog page successfully (1.5s)
  ✓  11 …pec.ts:46:7 › Top Navigation @desktop › should navigate to $MBG page successfully (3.0s)
  ✓  12 …7 › Negative and edge cases › invalid route returns not-found or non-home content (2.5s)
  ✓  13 …ec.ts:8:7 › Negative and edge cases › slow content loads without hanging the page (3.0s)
  ✓  14 …:25:7 › Explore market widget › renders the widget and required display elements (851ms)
  ✓  15 …› Content & External Links › marketing banners render in the expected page region (1.9s)
  ✓  16 …ent & External Links › App Store and Google Play download links resolve correctly (3.5s)
  ✓  17 …iBank page renders all expected components with correct headings and section text (1.8s)
  ✓  18 … › keeps the visible category symbols aligned with the API-backed market sections (4.7s)
  ✓  19 … Top Navigation @desktop › navigation displays expected items at desktop viewport (1.6s)
  ✓  20 ….ts:16:7 › Top Navigation @desktop › should navigate to Explore page successfully (2.5s)
  ✓  21 …ts:21:7 › Top Navigation @desktop › should navigate to Features page successfully (3.3s)
  ✓  22 …ts:26:7 › Top Navigation @desktop › should navigate to OTC Desk page successfully (1.2s)
  ✓  23 ….ts:31:7 › Top Navigation @desktop › should navigate to Company page successfully (1.4s)
  ✓  24 ….ts:36:7 › Top Navigation @desktop › should navigate to Support page successfully (3.6s)
  ✓  25 …pec.ts:41:7 › Top Navigation @desktop › should navigate to Blog page successfully (1.7s)
  ✓  26 …pec.ts:46:7 › Top Navigation @desktop › should navigate to $MBG page successfully (2.2s)
  ✓  27 …› Explore market widget › validates each visible row field and numeric formatting (1.3s)
  ✓  28 …7 › Negative and edge cases › invalid route returns not-found or non-home content (1.4s)
  ✓  29 …ec.ts:8:7 › Negative and edge cases › slow content loads without hanging the page (3.5s)
  ✓  30 …:25:7 › Explore market widget › renders the widget and required display elements (867ms)
  ✓  31 …› Content & External Links › marketing banners render in the expected page region (6.0s)
  ✓  32 …ent & External Links › App Store and Google Play download links resolve correctly (7.6s)
  ✓  33 …iBank page renders all expected components with correct headings and section text (6.5s)
  ✓  34 … Top Navigation @desktop › navigation displays expected items at desktop viewport (6.1s)
  ✓  35 … › keeps the visible category symbols aligned with the API-backed market sections (6.9s)
  ✓  36 ….ts:16:7 › Top Navigation @desktop › should navigate to Explore page successfully (7.1s)
  ✓  37 …ts:21:7 › Top Navigation @desktop › should navigate to Features page successfully (7.6s)
  ✓  38 …ts:26:7 › Top Navigation @desktop › should navigate to OTC Desk page successfully (6.4s)
  ✓  39 ….ts:31:7 › Top Navigation @desktop › should navigate to Company page successfully (6.9s)
  ✓  40 …› Explore market widget › validates each visible row field and numeric formatting (5.1s)
  ✓  41 ….ts:36:7 › Top Navigation @desktop › should navigate to Support page successfully (6.7s)
  ✓  42 …pec.ts:41:7 › Top Navigation @desktop › should navigate to Blog page successfully (6.7s)
  ✓  43 …pec.ts:46:7 › Top Navigation @desktop › should navigate to $MBG page successfully (6.9s)
  ✓  44 …7 › Negative and edge cases › invalid route returns not-found or non-home content (1.8s)
  ✓  45 …ec.ts:8:7 › Negative and edge cases › slow content loads without hanging the page (8.2s)
  ✓  46 …:25:7 › Explore market widget › renders the widget and required display elements (409ms)
  ✓  47 … › keeps the visible category symbols aligned with the API-backed market sections (5.8s)
  ✓  48 … Explore market widget › validates each visible row field and numeric formatting (953ms)

  48 passed (46.2s)

To open last HTML report run:

  npx playwright show-report reports/html-report

zeeshankhan@Mac multibank-qa-framework % 