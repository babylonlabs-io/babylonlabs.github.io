# AI Chatbot Load Testing Suite

This directory contains Playwright-based load tests for the Babylon AI Chatbot.

## Overview

The load testing suite provides two modes:

| Mode | Throughput | Use Case |
|------|------------|----------|
| **Sequential** | ~8/min | Baseline testing, debugging |
| **Parallel** | 30-100+/min | Stress testing, load testing |

Features:
- Opens the chatbot widget on the Babylon docs site
- Sends configurable number of questions (50, 100, or custom)
- Waits for streaming responses to complete
- Collects metrics (response time, success rate, response length)
- Generates detailed HTML and JSON reports

## Quick Start

### Sequential Testing (Default)

```bash
# Run 50 conversations against production
npm run test:load

# Run 100 conversations
npm run test:load:100

# Run against dev environment
npm run test:load:dev
```

### Parallel Testing (High Throughput)

```bash
# Run 50 parallel conversations (5 workers)
npm run test:load:parallel

# Stress test: 100 conversations, 10 workers, no delay
npm run test:load:parallel:stress

# Custom: 200 conversations, 20 workers
WORKERS=20 CONVERSATION_COUNT=200 npm run test:load:parallel
```

## Configuration

All configuration is done via environment variables:

### Sequential Mode Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TARGET_URL` | `https://docs.babylonlabs.io` | Target site URL |
| `CONVERSATION_COUNT` | `50` | Number of conversations to run |
| `RESPONSE_TIMEOUT` | `120000` | Max wait time for response (ms) |
| `DELAY_BETWEEN_CONVERSATIONS` | `2000` | Delay between conversations (ms) |
| `RANDOM_QUESTIONS` | `true` | Randomize question order |

### Parallel Mode Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TARGET_URL` | `https://docs.babylonlabs.io` | Target site URL |
| `CONVERSATION_COUNT` | `50` | Total conversations to run |
| `WORKERS` | `5` | Number of parallel browser instances |
| `DELAY_BETWEEN` | `500` | Stagger delay between workers (ms) |
| `RESPONSE_TIMEOUT` | `120000` | Max wait time per response (ms) |
| `RANDOM_QUESTIONS` | `true` | Randomize question order |

### Throughput Calculation

```
Throughput ≈ (WORKERS × 60) / avg_response_time_seconds

Example with 10 workers and 6s avg response:
  (10 × 60) / 6 = 100 conversations/minute
```
| `HEADLESS` | `true` | Run browser in headless mode |

### Examples

```bash
# Custom configuration
TARGET_URL=https://docs-dev.babylonlabs.io \
CONVERSATION_COUNT=25 \
RESPONSE_TIMEOUT=180000 \
DELAY_BETWEEN_CONVERSATIONS=5000 \
npm run test:load

# Run with visible browser for debugging
HEADLESS=false CONVERSATION_COUNT=5 npm run test:load

# Sequential questions (reproducible order)
RANDOM_QUESTIONS=false npm run test:load
```

## Test Results

Results are saved to:
- `./playwright-report/` - Interactive HTML report
- `./test-results/results.json` - Machine-readable JSON results
- `./test-results/` - Screenshots and videos on failure

### Viewing the HTML Report

```bash
npx playwright show-report tests/load-testing/playwright-report
```

## Question Bank

Questions are defined in `questions.ts` and cover various categories:
- Protocol Overview
- Staking
- Finality Providers
- Node Operation
- Development
- Wallet
- Governance
- Security
- Networks
- Technical
- CLI
- API
- Edge Cases

### Adding Questions

Edit `questions.ts` to add or modify questions:

```typescript
{
  id: 'unique-id',
  category: 'Category Name',
  question: 'Your question here?',
  expectedKeywords: ['optional', 'keywords', 'to', 'check'],
}
```

## Metrics Collected

For each conversation:
- Question ID and category
- Start/end time
- Total duration
- Success/failure status
- Response length
- Error message (if failed)
- Expected keyword match

Summary metrics:
- Total conversations
- Success rate
- Average response time
- Average response length
- Per-category breakdown

## Architecture

```
tests/load-testing/
├── playwright.config.ts    # Playwright configuration
├── questions.ts            # Question bank and utilities
├── chatbot-load.spec.ts    # Main test file
└── README.md               # This file
```

### How It Works

1. **Page Load**: Navigates to the target URL and waits for `networkidle`
2. **Health Check**: Waits for `body.ai-chat-available` class (indicates API is healthy)
3. **Session Reset**: Clears localStorage to start fresh
4. **Conversation Loop**:
   - Opens chatbot widget
   - Starts new session
   - Sends question
   - Waits for streaming response to complete (no loading spinner)
   - Records metrics
   - Closes widget
   - Delays before next conversation
5. **Summary**: Prints detailed metrics and generates reports

## Troubleshooting

### Chatbot Not Available

If tests skip with "Chatbot API is not available":
- The API health check at `/health` is failing
- Check if `API_BASE_URL` is correctly configured
- Verify the backend service is running

### Timeout Errors

If responses timeout:
- Increase `RESPONSE_TIMEOUT` environment variable
- Check network connectivity to the target
- Backend may be overloaded

### Session Limit Reached

The chatbot has a 15-session limit. The test clears localStorage before starting, but if you see session limit errors:
- Manually clear browser storage
- Reload the page

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Load Test
on:
  workflow_dispatch:
    inputs:
      target_url:
        description: 'Target URL'
        default: 'https://docs-dev.babylonlabs.io'
      conversation_count:
        description: 'Number of conversations'
        default: '50'

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install chromium
      - name: Run Load Tests
        env:
          TARGET_URL: ${{ inputs.target_url }}
          CONVERSATION_COUNT: ${{ inputs.conversation_count }}
        run: npm run test:load
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: load-test-results
          path: tests/load-testing/test-results/
```
