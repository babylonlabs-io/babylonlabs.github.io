# llms.txt Feature

This documentation site includes support for [llms.txt](https://llmstxt.org/), a standard that helps AI assistants understand and work with website content.

## Overview

The llms.txt file provides a structured, machine-readable summary of the Babylon Labs documentation that AI tools can use as context when helping users with questions about Babylon.

## Components

### 1. Copy Button (`src/components/LlmCopyButton.tsx`)

A React component that allows users to copy the llms.txt content to their clipboard with one click.

**Features:**
- Fetches `/llms.txt` and copies to clipboard
- Shows loading state while fetching
- Displays success toast with word/token count
- Handles errors gracefully
- Supports light/dark themes

**Location:** Footer of the site, next to social media icons

### 2. Static File (`static/llms.txt`)

The llms.txt file served at `https://docs.babylonlabs.io/llms.txt`.

**Note:** This file is generated and updated by an external cron job, not during the build process.

## Usage

### For Users

1. Visit any page on the documentation site
2. Scroll to the footer
3. Click the "llms.txt" button
4. The content is copied to your clipboard
5. Paste into your AI assistant (ChatGPT, Claude, etc.) for context

### For AI Assistants

Fetch the file directly:
```
https://docs.babylonlabs.io/llms.txt
```

## File Format

The llms.txt file follows the [official specification](https://llmstxt.org/):

```markdown
# Project Name

> Brief description of the project

## Section Name
- [Page Title](url): Description of the page
```

Optional metadata comment (parsed by the copy button for stats):
```html
<!-- METADATA: {"wordCount": 1234, "tokenCount": 1600, "lastUpdated": "2025-01-15"} -->
```

## Styling

Button and notification styles are defined in `src/css/custom.css`:
- `.llm-copy-button` - Main button styles
- `.llm-notification` - Toast notification styles
- Dark mode variants included

## Maintenance

- **Content updates:** Handled by external cron job
- **Button component:** `src/components/LlmCopyButton.tsx`
- **Button placement:** `src/components/homepage/HomeFooter.jsx`
- **Styles:** `src/css/custom.css` (search for "LLM Copy Button")

## References

- [llms.txt Official Specification](https://llmstxt.org/)
- [Best Practices Guide](https://www.rankability.com/guides/llms-txt-best-practices/)
