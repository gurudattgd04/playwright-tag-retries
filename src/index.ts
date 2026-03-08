/**
 * playwright-tag-retries
 *
 * Add retries only for tests annotated with certain tags (e.g. @flaky, @retry).
 * Uses Playwright projects + grep to route tagged tests to a retry project
 * and all other tests to a zero-retry project.
 *
 * Works with Playwright's native `test.tag()` API (v1.42+) and with tags in test titles.
 *
 * @see https://playwright.dev/docs/test-annotations#tag-tests
 * @see https://playwright.dev/docs/test-projects
 */

import type { TagRetryOptions } from './types';

interface PlaywrightProject {
  name: string;
  grep?: RegExp;
  grepInvert?: RegExp;
  retries?: number;
  use?: Record<string, unknown>;
}

const DEFAULT_TAGS = ['@flaky', '@retry'];
const DEFAULT_RETRIES = 2;

/**
 * Build a RegExp that matches any of the given tags.
 * Each tag is escaped and word-boundary anchored so @flaky won't match @flaky1.
 */
function buildGrepPattern(tags: string[]): RegExp {
  const escaped = tags.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b');
  return new RegExp(escaped.join('|'));
}

/**
 * Returns two Playwright projects for tag-based selective retries:
 *
 * 1. **Tagged project** — tests annotated with any of the configured tags
 *    (via `test.tag()` or in the title) run here with the configured retry count.
 * 2. **Default project** — all other tests run here with 0 retries.
 *
 * Playwright's `grep` / `grepInvert` match against both `test.tag()` annotations
 * and test titles, so this works with either tagging approach.
 *
 * @example
 * ```ts
 * // playwright.config.ts
 * import { defineConfig, devices } from '@playwright/test';
 * import { tagRetryProjects } from 'playwright-tag-retries';
 *
 * export default defineConfig({
 *   testDir: 'tests',
 *   projects: [
 *     ...tagRetryProjects({
 *       tags: ['@flaky', '@retry'],
 *       retries: 2,
 *       use: { ...devices['Desktop Chrome'] },
 *     }),
 *   ],
 * });
 * ```
 *
 * @example
 * ```ts
 * // In your tests — use Playwright's native tag API (recommended)
 * test('loads dashboard', { tag: '@flaky' }, async ({ page }) => { ... });
 *
 * // Or tag via the title (also works)
 * test('loads dashboard @flaky', async ({ page }) => { ... });
 * ```
 */
export function tagRetryProjects(options: TagRetryOptions = {}): PlaywrightProject[] {
  const {
    tags = DEFAULT_TAGS,
    retries = DEFAULT_RETRIES,
    retryProjectName = 'tagged-retry',
    defaultProjectName = 'default',
    use = {},
  } = options;

  const pattern = buildGrepPattern(tags);

  return [
    {
      name: retryProjectName,
      grep: pattern,
      retries,
      use,
    },
    {
      name: defaultProjectName,
      grepInvert: pattern,
      retries: 0,
      use,
    },
  ];
}

export type { TagRetryOptions } from './types';
