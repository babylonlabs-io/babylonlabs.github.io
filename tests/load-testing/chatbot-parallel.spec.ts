/**
 * Parallel AI Chatbot Load Testing Suite
 *
 * This test runs multiple conversations IN PARALLEL to achieve high throughput.
 * Use this for stress testing the API with >30 conversations per minute.
 *
 * Usage:
 *   # Run 50 parallel conversations (default)
 *   npm run test:load:parallel
 *
 *   # Run 100 parallel conversations with 10 workers
 *   CONVERSATION_COUNT=100 WORKERS=10 npm run test:load:parallel
 *
 *   # Aggressive load: 100 conversations, 20 workers, no delay
 *   CONVERSATION_COUNT=100 WORKERS=20 DELAY_BETWEEN=0 npm run test:load:parallel
 */

import { test, expect, Page } from '@playwright/test';
import { getSequentialQuestions, TestQuestion } from './questions';

// Configuration
const TOTAL_CONVERSATIONS = parseInt(process.env.CONVERSATION_COUNT || '50', 10);
const RESPONSE_TIMEOUT = parseInt(process.env.RESPONSE_TIMEOUT || '120000', 10);
const DELAY_BETWEEN = parseInt(process.env.DELAY_BETWEEN || '500', 10);

// Use sequential questions for parallel tests to ensure consistency across workers
// (Random questions would generate different tests in each worker process)
const allQuestions = getSequentialQuestions(TOTAL_CONVERSATIONS);

// Shared metrics (collected via console output, aggregated at end)
interface TestResult {
  questionId: string;
  category: string;
  duration: number;
  success: boolean;
  responseLength: number;
  error?: string;
}

/**
 * Helper to interact with the chatbot
 */
async function runConversation(
  page: Page,
  question: TestQuestion,
  index: number
): Promise<TestResult> {
  const startTime = Date.now();
  const result: TestResult = {
    questionId: question.id,
    category: question.category,
    duration: 0,
    success: false,
    responseLength: 0,
  };

  try {
    // Navigate to site
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for chatbot to be available
    await page.waitForSelector('body.ai-chat-available', { timeout: 30000 });

    // Open chatbot
    const triggerButton = page.locator('.chat-trigger-btn');
    await triggerButton.waitFor({ state: 'visible', timeout: 10000 });
    await triggerButton.click();
    await page.waitForSelector('.chat-window', { state: 'visible' });

    // Send message
    const input = page.locator('.chat-input input[type="text"]');
    await input.fill(question.question);
    const sendButton = page.locator('.chat-input button[type="submit"]');
    await sendButton.click();

    // Wait for response (poll for spinner to disappear)
    const responseStart = Date.now();
    while (Date.now() - responseStart < RESPONSE_TIMEOUT) {
      const messages = page.locator('.chat-messages .message-bubble-ai');
      const count = await messages.count();
      if (count > 0) {
        const lastMessage = messages.nth(count - 1);
        const spinner = lastMessage.locator('.animate-spin');
        if ((await spinner.count()) === 0) {
          const content = await lastMessage.locator('.markdown-body').textContent();
          result.responseLength = content?.length || 0;
          result.success = result.responseLength > 0;
          break;
        }
      }
      await page.waitForTimeout(200);
    }

    if (!result.success && result.responseLength === 0) {
      throw new Error('Response timeout');
    }

  } catch (error) {
    result.success = false;
    result.error = error instanceof Error ? error.message : String(error);
  }

  result.duration = Date.now() - startTime;

  console.log(
    `[Worker ${index}] ${result.success ? '✓' : '✗'} [${question.category}] ` +
    `${question.question.substring(0, 40)}... (${(result.duration / 1000).toFixed(2)}s)`
  );

  return result;
}

// Generate individual test cases for parallel execution
for (let i = 0; i < allQuestions.length; i++) {
  const question = allQuestions[i];

  test(`Conversation ${i + 1}: ${question.id}`, async ({ page }) => {
    // Small staggered delay to avoid thundering herd
    if (DELAY_BETWEEN > 0 && i > 0) {
      await page.waitForTimeout(Math.random() * DELAY_BETWEEN);
    }

    const result = await runConversation(page, question, i + 1);

    // Attach result as test annotation for reporting
    test.info().annotations.push({
      type: 'result',
      description: JSON.stringify(result),
    });

    expect(result.success, `Failed: ${result.error}`).toBe(true);
  });
}
