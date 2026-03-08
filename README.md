# playwright-tag-retries

[![npm version](https://img.shields.io/npm/v/playwright-tag-retries.svg)](https://www.npmjs.com/package/playwright-tag-retries)
[![npm downloads](https://img.shields.io/npm/dm/playwright-tag-retries.svg)](https://www.npmjs.com/package/playwright-tag-retries)

A Playwright plugin that enables **selective retries** based on test tags. Only tests annotated with the configured tags (e.g. `@flaky`, `@retry`) are retried on failure; all other tests run with zero retries.

Uses Playwright's native [`test.tag()`](https://playwright.dev/docs/test-annotations#tag-tests) API (v1.42+) and [projects](https://playwright.dev/docs/test-projects) for clean, title-free tag matching.

---

## Why

Playwright applies the same retry count to every test by default. When you have a mix of stable and flaky tests, retrying the entire suite wastes time and can mask real failures. This plugin lets you:

- **Tag** specific tests with `@flaky`, `@retry`, or any custom tag.
- **Retry only those tests** on failure, with a configurable retry count.
- **Fail fast** on all other tests with zero retries.

---

## Installation

```bash
npm install -D playwright-tag-retries @playwright/test
```

**Requires:** `@playwright/test` `>=1.42.0`

---

## Quick Start

### 1. Configure projects

In `playwright.config.ts`, spread the projects returned by `tagRetryProjects`:

```ts
import { defineConfig, devices } from '@playwright/test';
import { tagRetryProjects } from 'playwright-tag-retries';

export default defineConfig({
  testDir: 'tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    ...tagRetryProjects({
      tags: ['@flaky', '@retry'],
      retries: 2,
      use: { ...devices['Desktop Chrome'] },
    }),
  ],
});
```

### 2. Tag your tests

Use Playwright's native `tag` option (recommended):

```ts
import { test, expect } from '@playwright/test';

test('loads dashboard', { tag: '@flaky' }, async ({ page }) => {
  await page.goto('/');
  // ...
});

test('checkout flow', { tag: '@retry' }, async ({ page }) => {
  // ...
});
```

You can also tag an entire `describe` block:

```ts
test.describe('Payment flow', { tag: '@flaky' }, () => {
  test('adds item to cart', async ({ page }) => {
    // inherits @flaky from describe — will be retried
  });
});
```

Multiple tags on a single test:

```ts
test('complex flow', { tag: ['@flaky', '@slow'] }, async ({ page }) => {
  // matches @flaky — will be retried
});
```

**Tag level:** You can tag at **test level** or **describe level**; describe-level tags apply to all tests in that block.

**Tag syntax:** Playwright's `grep` matches both `test.tag()` and the test title, so `test('loads dashboard @flaky', ...)` is also supported and will be retried the same way.

### Result

| Test | Project | Retries |
|------|---------|---------|
| Tagged with `@flaky` or `@retry` | `tagged-retry` | 2 |
| No matching tag | `default` | 0 |

---

## API

### `tagRetryProjects(options?)`

Returns an array of two Playwright projects. Spread them into your config's `projects` array.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tags` | `string[]` | `['@flaky', '@retry']` | Tags to match. Must start with `@`. Matched as whole words (`@flaky` matches; `@flaky1` does not). |
| `retries` | `number` | `2` | Retry count for tagged tests. |
| `retryProjectName` | `string` | `'tagged-retry'` | Name of the retry project. |
| `defaultProjectName` | `string` | `'default'` | Name of the no-retry project. |
| `use` | `object` | `{}` | Shared project options (e.g. `{ ...devices['Desktop Chrome'] }`). |

#### TypeScript

Types are included:

```ts
import { tagRetryProjects, type TagRetryOptions } from 'playwright-tag-retries';
```

---

## Running by Project

Run only tagged tests (with retries) or only untagged tests (no retries):

```bash
npx playwright test --project=tagged-retry
npx playwright test --project=default
```

### CI / pipeline usage

Use the `--project` flag to run only one project per pipeline. This does **not** change your config file — the config still defines both projects; the flag only selects which project runs for that invocation.

```bash
# PR pipeline: fail fast, no retries (runs only the default project)
npx playwright test --project=default

# Nightly pipeline: allow retries on known flaky tests (runs only the tagged-retry project)
npx playwright test --project=tagged-retry
```

---

## How It Works

The plugin creates two [Playwright projects](https://playwright.dev/docs/test-projects):

1. **Tagged project** — uses `grep` to match tests annotated with any of the configured tags. These tests run with the configured retry count.
2. **Default project** — uses `grepInvert` to match all other tests. These run with `retries: 0`.

Playwright's `grep` matches against both `test.tag()` annotations and test titles, so each test runs in exactly one project.

---

## Examples

The `examples/` folder contains a sample app and test suite:

| Path | Description |
|------|-------------|
| `examples/sample-app/public/` | Static app (home + about) used by the tests. |
| `examples/tests/` | Specs using `test.tag()` with `@flaky` and `@retry`. |
| `examples/playwright.config.ts` | Config using `tagRetryProjects()` with a `webServer`. |

```bash
npm install
npm run build
npm run example:test
```

See [examples/README.md](examples/README.md) for UI mode and flaky-demo instructions.

---

## Compatibility

| Requirement | Version |
|-------------|---------|
| `@playwright/test` | `>=1.42.0` |
| Node.js | `>=16` |

The `test.tag()` API was introduced in Playwright 1.42. Tags in test titles also work as a fallback.

---

## References

- [Playwright — Tag tests](https://playwright.dev/docs/test-annotations#tag-tests)
- [Playwright — Test projects](https://playwright.dev/docs/test-projects)
- [Playwright — Retries](https://playwright.dev/docs/test-retries)
- [Playwright — Configuration](https://playwright.dev/docs/test-configuration)

---

## License

See [LICENSE](LICENSE) in the repository.
