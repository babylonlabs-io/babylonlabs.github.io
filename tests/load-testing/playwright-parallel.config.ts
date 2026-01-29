import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for PARALLEL load testing.
 *
 * This configuration runs multiple browser instances simultaneously
 * to achieve high throughput (>30 conversations per minute).
 *
 * Environment variables:
 *   TARGET_URL         - Target site (default: https://docs.babylonlabs.io)
 *   WORKERS            - Number of parallel workers (default: 5)
 *   CONVERSATION_COUNT - Total conversations to run (default: 50)
 *
 * Example: 100 conversations with 10 parallel workers
 *   WORKERS=10 CONVERSATION_COUNT=100 npm run test:load:parallel
 */
export default defineConfig({
  testDir: '.',
  testMatch: 'chatbot-parallel.spec.ts', // Only run parallel tests
  timeout: 180000, // 3 minutes per individual test
  expect: {
    timeout: 60000,
  },

  // PARALLEL EXECUTION SETTINGS
  fullyParallel: true,  // Enable parallel execution
  workers: parseInt(process.env.WORKERS || '5', 10), // Configurable workers

  retries: 0, // No retries for accurate failure metrics
  reporter: [
    ['html', { outputFolder: './playwright-report-parallel' }],
    ['json', { outputFile: './test-results/parallel-results.json' }],
    ['list'],
  ],
  outputDir: './test-results-parallel',

  use: {
    baseURL: process.env.TARGET_URL || 'https://docs.babylonlabs.io',
    trace: 'off', // Disable tracing for performance
    screenshot: 'only-on-failure',
    video: 'off', // Disable video for performance
    headless: true,
  },
});
