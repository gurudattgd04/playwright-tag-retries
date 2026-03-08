# Example tests and sample app

This folder contains a **sample app** and **Playwright tests** that demonstrate `playwright-tag-retries` using Playwright's native `test.tag()` API.

## Structure

- **`sample-app/public/`** — Static HTML app (home page with counter, about page). Served on port 3123 when running tests.
- **`tests/`** — Example specs:
  - `01-home.spec.ts` — Home page: mix of untagged, `{ tag: '@flaky' }`, and `{ tag: '@retry' }` tests
  - `02-navigation.spec.ts` — Navigation and `{ tag: '@flaky' }` example
  - `03-tags.spec.ts` — Tag behavior and describe-level `{ tag: '@flaky' }`
  - `04-retry-demo.spec.ts` — Tagged demo tests; optional flaky simulation via `DEMO_FLAKY=1`
- **`playwright.config.ts`** — Uses `tagRetryProjects()` so tests with `@flaky` or `@retry` get 2 retries; others get 0.

## Run from package root

```bash
npm install
npm run example:test

# Only tests with @flaky or @retry (with retries)
npx playwright test -c examples/playwright.config.ts --project=tagged-retry

# Only tests without those tags (no retries)
npx playwright test -c examples/playwright.config.ts --project=default
```

## Run in UI mode

```bash
npm run example:test:ui
```

To see retries in action (demo tests fail then pass on retry):

```bash
DEMO_FLAKY=1 npm run example:test:ui
```

In the Playwright UI:
- Use the **project** dropdown to switch between **tagged-retry** and **default**.
- Run `04-retry-demo.spec.ts` with `DEMO_FLAKY=1` to see failed attempts followed by a passing retry.

## How to see retries in action

By default, `04-retry-demo.spec.ts` tests pass on first run so the suite stays green. To simulate flakiness:

```bash
DEMO_FLAKY=1 npx playwright test -c examples/playwright.config.ts 04-retry-demo
```

## If webServer fails to start

Start the sample app manually, then run tests (they will reuse the existing server):

```bash
npm run example:serve
# In another terminal:
npm run example:test
```

## Sample app

Minimal static app: home page with a counter and list, plus an About page. The config starts it via `webServer` automatically.
