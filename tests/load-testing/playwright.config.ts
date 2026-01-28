import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for AI Chatbot load testing.
 *
 * Configure the target URL via environment variable:
 *   TARGET_URL=https://docs.babylonlabs.io npx playwright test
 *
 * Default targets the production site.
 */
export default defineConfig({
  testDir: '.',
  timeout: 300000, // 5 minutes per test (streaming responses can be slow)
  expect: {
    timeout: 60000, // 60 seconds for assertions
  },
  fullyParallel: false, // Run conversations sequentially to avoid overwhelming the API
  forbidOnly: true,
  retries: 0, // No retries for load testing - we want to see actual failure rates
  workers: 1, // Single worker for sequential execution
  reporter: [
    ['html', { outputFolder: './playwright-report' }],
    ['json', { outputFile: './test-results/results.json' }],
    ['list'], // Console output
  ],
  outputDir: './test-results',
  use: {
    baseURL: process.env.TARGET_URL || 'https://docs.babylonlabs.io',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
});
