import React, { useState, useCallback } from 'react';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Improve code block conversion
turndownService.addRule('fencedCodeBlock', {
  filter: (node) => {
    return (
      node.nodeName === 'PRE' &&
      node.firstChild &&
      node.firstChild.nodeName === 'CODE'
    );
  },
  replacement: (_content, node) => {
    const codeEl = node.firstChild as HTMLElement;
    const language = (codeEl.className || '').replace(/language-/, '').split(' ')[0] || '';
    const code = codeEl.textContent || '';
    return `\n\`\`\`${language}\n${code}\n\`\`\`\n`;
  },
});

export default function CopyMarkdownButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const article = document.querySelector('article') || document.querySelector('.markdown');
    if (!article) return;

    // Clone to avoid modifying DOM
    const clone = article.cloneNode(true) as HTMLElement;

    // Remove elements that shouldn't be in the markdown
    clone.querySelectorAll('.hash-link, .copy-markdown-btn, .theme-doc-footer, nav.pagination-nav, .table-of-contents').forEach(el => el.remove());

    const markdown = turndownService.turndown(clone.innerHTML);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <button
      className="copy-markdown-btn"
      onClick={handleCopy}
      title="Copy page as Markdown"
      aria-label="Copy page as Markdown"
    >
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>Copy as Markdown</span>
        </>
      )}
    </button>
  );
}
