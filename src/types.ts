/**
 * Options for tag-based retry projects.
 * @see https://playwright.dev/docs/test-annotations#tag-tests
 * @see https://playwright.dev/docs/test-projects
 */
export interface TagRetryOptions {
  /**
   * Tags to match (e.g. `['@flaky', '@retry']`).
   * Must start with `@`. Matched as whole words so `@flaky` won't match `@flaky1`.
   *
   * Works with Playwright's native `test.tag()` API and with tags in test titles.
   *
   * @default ['@flaky', '@retry']
   */
  tags?: string[];

  /**
   * Number of retries for tests that match the tags.
   * @default 2
   */
  retries?: number;

  /**
   * Project name for tests that match the tags (run with retries).
   * @default 'tagged-retry'
   */
  retryProjectName?: string;

  /**
   * Project name for tests that do not match the tags (no retries).
   * @default 'default'
   */
  defaultProjectName?: string;

  /**
   * Optional base project config to merge into both projects
   * (e.g. `{ ...devices['Desktop Chrome'] }`).
   */
  use?: Record<string, unknown>;
}
