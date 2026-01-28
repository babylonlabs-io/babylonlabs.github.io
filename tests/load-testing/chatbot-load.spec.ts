/**
 * AI Chatbot Load Testing Suite
 *
 * This test suite performs load testing on the Babylon AI Chatbot by:
 * - Running multiple sequential conversations
 * - Sending various questions from different categories
 * - Waiting for streaming responses to complete
 * - Recording metrics (response time, success rate, etc.)
 *
 * Usage:
 *   # Run with default settings (50 conversations against production)
 *   npx playwright test --config=tests/load-testing/playwright.config.ts
 *
 *   # Run 100 conversations
 *   CONVERSATION_COUNT=100 npx playwright test --config=tests/load-testing/playwright.config.ts
 *
 *   # Run against a different URL
 *   TARGET_URL=https://docs-dev.babylonlabs.io npx playwright test --config=tests/load-testing/playwright.config.ts
 *
 *   # Run with visible browser
 *   HEADLESS=false npx playwright test --config=tests/load-testing/playwright.config.ts
 */

import { test, expect, Page } from '@playwright/test';
import {
  getRandomQuestions,
  getSequentialQuestions,
  TestQuestion,
} from './questions';

// Configuration from environment
const CONVERSATION_COUNT = parseInt(
  process.env.CONVERSATION_COUNT || '50',
  10
);
const RESPONSE_TIMEOUT = parseInt(
  process.env.RESPONSE_TIMEOUT || '120000',
  10
); // 2 minutes default
const DELAY_BETWEEN_CONVERSATIONS = parseInt(
  process.env.DELAY_BETWEEN_CONVERSATIONS || '2000',
  10
); // 2 seconds default
const RANDOM_QUESTIONS = process.env.RANDOM_QUESTIONS !== 'false'; // Default true

// Metrics collection
interface ConversationMetrics {
  questionId: string;
  question: string;
  category: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  error?: string;
  responseLength: number;
  hasExpectedKeywords: boolean;
}

const allMetrics: ConversationMetrics[] = [];

/**
 * Helper class to interact with the Babylon AI Chatbot
 */
class ChatbotHelper {
  constructor(private page: Page) {}

  /**
   * Wait for the chatbot to be available (API health check passes)
   */
  async waitForChatbotAvailable(timeout = 30000): Promise<boolean> {
    try {
      // Wait for the body to have the ai-chat-available class
      await this.page.waitForSelector('body.ai-chat-available', { timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Open the chatbot widget
   */
  async openChatbot(): Promise<void> {
    // Look for the trigger button with "Ask Babylon AI" text
    const triggerButton = this.page.locator('.chat-trigger-btn');
    await triggerButton.waitFor({ state: 'visible', timeout: 10000 });
    await triggerButton.click();

    // Wait for chat window to appear
    await this.page.waitForSelector('.chat-window', { state: 'visible' });
  }

  /**
   * Close the chatbot and start fresh
   */
  async closeChatbot(): Promise<void> {
    const closeButton = this.page.locator('.chat-close-btn');
    if (await closeButton.isVisible()) {
      await closeButton.click();
      // Wait for chat window to close
      await this.page.waitForSelector('.chat-window', { state: 'hidden' });
    }
  }

  /**
   * Start a new chat session (clears previous conversation)
   */
  async startNewSession(): Promise<void> {
    // First expand if not expanded to access the New Chat button
    const expandButton = this.page.locator('button[title="Expand"]');
    if (await expandButton.isVisible()) {
      await expandButton.click();
      await this.page.waitForTimeout(500);
    }

    // Look for the New Chat button in the sidebar
    const newChatButton = this.page.locator('.new-chat-btn');
    if (await newChatButton.isVisible()) {
      await newChatButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Clear localStorage to reset all sessions
   */
  async clearAllSessions(): Promise<void> {
    await this.page.evaluate(() => {
      localStorage.removeItem('babylon_ai_chat_sessions');
      localStorage.removeItem('babylon_ai_chat_history');
    });
  }

  /**
   * Send a message to the chatbot
   */
  async sendMessage(message: string): Promise<void> {
    const input = this.page.locator('.chat-input input[type="text"]');
    await input.fill(message);

    const sendButton = this.page.locator('.chat-input button[type="submit"]');
    await sendButton.click();
  }

  /**
   * Wait for the AI response to complete streaming
   * Returns the response text
   */
  async waitForResponse(timeout = RESPONSE_TIMEOUT): Promise<string> {
    // Wait for the loading spinner to disappear
    // The assistant message shows Loader2 when content is empty and isLoading
    const startTime = Date.now();

    // Wait for at least one assistant message bubble
    await this.page.waitForSelector(
      '.chat-messages .message-bubble-ai .markdown-body',
      { timeout: 10000 }
    );

    // Poll until loading is done (no more spinner in the last message)
    while (Date.now() - startTime < timeout) {
      // Get the last assistant message
      const messages = this.page.locator('.chat-messages .message-bubble-ai');
      const count = await messages.count();

      if (count > 0) {
        const lastMessage = messages.nth(count - 1);
        const spinner = lastMessage.locator('.animate-spin');

        // Check if spinner is present
        const hasSpinner = await spinner.count();
        if (hasSpinner === 0) {
          // No spinner, response is complete
          const content = await lastMessage
            .locator('.markdown-body')
            .textContent();
          return content || '';
        }
      }

      await this.page.waitForTimeout(500);
    }

    throw new Error(`Response timeout after ${timeout}ms`);
  }

  /**
   * Get the current number of messages in the chat
   */
  async getMessageCount(): Promise<number> {
    const messages = this.page.locator(
      '.chat-messages .message-bubble-user, .chat-messages .message-bubble-ai'
    );
    return messages.count();
  }
}

test.describe('AI Chatbot Load Testing', () => {
  test.beforeAll(async () => {
    console.log('\n========================================');
    console.log('AI Chatbot Load Testing Configuration:');
    console.log(`  Target URL: ${process.env.TARGET_URL || 'https://docs.babylonlabs.io'}`);
    console.log(`  Conversations: ${CONVERSATION_COUNT}`);
    console.log(`  Response Timeout: ${RESPONSE_TIMEOUT}ms`);
    console.log(`  Delay Between Conversations: ${DELAY_BETWEEN_CONVERSATIONS}ms`);
    console.log(`  Random Questions: ${RANDOM_QUESTIONS}`);
    console.log('========================================\n');
  });

  test.afterAll(async () => {
    // Print summary metrics
    const successful = allMetrics.filter((m) => m.success);
    const failed = allMetrics.filter((m) => !m.success);
    const avgDuration =
      successful.length > 0
        ? successful.reduce((sum, m) => sum + m.duration, 0) / successful.length
        : 0;
    const avgResponseLength =
      successful.length > 0
        ? successful.reduce((sum, m) => sum + m.responseLength, 0) /
          successful.length
        : 0;

    console.log('\n========================================');
    console.log('LOAD TEST RESULTS SUMMARY');
    console.log('========================================');
    console.log(`Total Conversations: ${allMetrics.length}`);
    console.log(`Successful: ${successful.length}`);
    console.log(`Failed: ${failed.length}`);
    console.log(`Success Rate: ${((successful.length / allMetrics.length) * 100).toFixed(1)}%`);
    console.log(`Average Response Time: ${(avgDuration / 1000).toFixed(2)}s`);
    console.log(`Average Response Length: ${avgResponseLength.toFixed(0)} chars`);

    if (failed.length > 0) {
      console.log('\nFailed Conversations:');
      failed.forEach((m) => {
        console.log(`  - [${m.questionId}] ${m.question.substring(0, 50)}...`);
        console.log(`    Error: ${m.error}`);
      });
    }

    // Metrics by category
    const categories = [...new Set(allMetrics.map((m) => m.category))];
    console.log('\nMetrics by Category:');
    categories.forEach((cat) => {
      const catMetrics = allMetrics.filter((m) => m.category === cat);
      const catSuccess = catMetrics.filter((m) => m.success);
      const catAvgDuration =
        catSuccess.length > 0
          ? catSuccess.reduce((sum, m) => sum + m.duration, 0) / catSuccess.length
          : 0;
      console.log(
        `  ${cat}: ${catSuccess.length}/${catMetrics.length} success, avg ${(catAvgDuration / 1000).toFixed(2)}s`
      );
    });

    console.log('========================================\n');
  });

  test(`Run ${CONVERSATION_COUNT} chatbot conversations`, async ({ page }) => {
    const helper = new ChatbotHelper(page);

    // Navigate to the site
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if chatbot is available
    const isAvailable = await helper.waitForChatbotAvailable();
    if (!isAvailable) {
      console.log('Chatbot API is not available. Skipping load test.');
      test.skip();
      return;
    }

    // Clear any existing sessions
    await helper.clearAllSessions();
    await page.reload();
    await page.waitForLoadState('networkidle');
    await helper.waitForChatbotAvailable();

    // Get questions
    const questions: TestQuestion[] = RANDOM_QUESTIONS
      ? getRandomQuestions(CONVERSATION_COUNT)
      : getSequentialQuestions(CONVERSATION_COUNT);

    console.log(`Starting ${questions.length} conversations...\n`);

    // Run each conversation
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const metrics: ConversationMetrics = {
        questionId: question.id,
        question: question.question,
        category: question.category,
        startTime: Date.now(),
        endTime: 0,
        duration: 0,
        success: false,
        responseLength: 0,
        hasExpectedKeywords: false,
      };

      console.log(
        `[${i + 1}/${questions.length}] [${question.category}] ${question.question.substring(0, 60)}...`
      );

      try {
        // Open chatbot
        await helper.openChatbot();

        // Start new session for each conversation
        if (i > 0) {
          await helper.startNewSession();
        }

        // Send the question
        await helper.sendMessage(question.question);

        // Wait for response
        const response = await helper.waitForResponse();

        metrics.endTime = Date.now();
        metrics.duration = metrics.endTime - metrics.startTime;
        metrics.responseLength = response.length;
        metrics.success = response.length > 0;

        // Check for expected keywords
        if (question.expectedKeywords && question.expectedKeywords.length > 0) {
          const responseLower = response.toLowerCase();
          metrics.hasExpectedKeywords = question.expectedKeywords.some((kw) =>
            responseLower.includes(kw.toLowerCase())
          );
        }

        console.log(
          `    ✓ Response: ${response.length} chars in ${(metrics.duration / 1000).toFixed(2)}s`
        );

        // Close chatbot before next iteration
        await helper.closeChatbot();
      } catch (error) {
        metrics.endTime = Date.now();
        metrics.duration = metrics.endTime - metrics.startTime;
        metrics.success = false;
        metrics.error = error instanceof Error ? error.message : String(error);

        console.log(`    ✗ Error: ${metrics.error}`);

        // Try to recover by closing and reopening
        try {
          await helper.closeChatbot();
        } catch {
          // Page might be in bad state, reload
          await page.reload();
          await page.waitForLoadState('networkidle');
          await helper.waitForChatbotAvailable();
        }
      }

      allMetrics.push(metrics);

      // Delay between conversations
      if (i < questions.length - 1) {
        await page.waitForTimeout(DELAY_BETWEEN_CONVERSATIONS);
      }
    }

    // Verify we ran all conversations
    expect(allMetrics.length).toBe(questions.length);

    // Assert minimum success rate (adjust threshold as needed)
    const successRate = allMetrics.filter((m) => m.success).length / allMetrics.length;
    console.log(`\nFinal Success Rate: ${(successRate * 100).toFixed(1)}%`);

    // Fail test if success rate is below 90%
    expect(successRate).toBeGreaterThanOrEqual(0.9);
  });
});
