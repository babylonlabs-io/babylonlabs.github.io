import React, { useState, useCallback } from 'react';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Preserve code blocks with language hints
turndownService.addRule('fencedCodeBlock', {
  filter: (node: HTMLElement) => {
    return (
      node.nodeName === 'PRE' &&
      node.querySelector('code') !== null
    );
  },
  replacement: (_content: string, node: TurndownService.Node) => {
    const codeEl = (node as HTMLElement).querySelector('code');
    if (!codeEl) return _content;
    const langClass = codeEl.className.match(/language-(\S+)/);
    const lang = langClass ? langClass[1] : '';
    const code = codeEl.textContent || '';
    return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
  },
});

// Handle admonitions (:::note, :::tip, etc.)
turndownService.addRule('admonition', {
  filter: (node: HTMLElement) => {
    return (
      node.nodeName === 'DIV' &&
      node.classList.contains('admonition')
    );
  },
  replacement: (_content: string, node: TurndownService.Node) => {
    const el = node as HTMLElement;
    const type =
      el.dataset.admonitionType ||
      (el.classList.contains('admonition_warning') ? 'warning' :
       el.classList.contains('admonition_tip') ? 'tip' :
       el.classList.contains('admonition_info') ? 'info' : 'note');
    const titleEl = el.querySelector('.admonitionHeading_Gvgb, .admonition-title, [class*="admonitionHeading"]');
    const contentEl = el.querySelector('.admonitionContent_UjKb, .admonition-content, [class*="admonitionContent"]');
    const title = titleEl?.textContent?.trim() || '';
    const body = contentEl ? turndownService.turndown(contentEl.innerHTML) : '';
    const titlePart = title && title.toLowerCase() !== type ? ` ${title}` : '';
    return `\n:::${type}${titlePart}\n${body}\n:::\n`;
  },
});

// Skip copy buttons inside code blocks
turndownService.addRule('skipCopyButton', {
  filter: (node: HTMLElement) => {
    return (
      node.nodeName === 'BUTTON' &&
      (node.classList.contains('copyButton') ||
       node.classList.contains('clean-btn'))
    );
  },
  replacement: () => '',
});

export default function CopyMarkdownButton(): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const article = document.querySelector('article');
    if (!article) return;

    // Clone the article to avoid modifying the DOM
    const clone = article.cloneNode(true) as HTMLElement;

    // Remove elements that shouldn't be in the markdown copy
    const selectorsToRemove = [
      '.theme-doc-toc-mobile',
      '.pagination-nav',
      '.theme-doc-footer',
      '[class*="copyButton"]',
      '[class*="buttonGroup"]',
      'button.clean-btn',
    ];
    selectorsToRemove.forEach((sel) => {
      clone.querySelectorAll(sel).forEach((el) => el.remove());
    });

    const markdown = turndownService.turndown(clone.innerHTML);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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
      type="button"
      onClick={handleCopy}
      className="copy-markdown-button"
      title="Copy page as Markdown"
      aria-label="Copy page as Markdown"
    >
      {copied ? (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M3 11V2.5A1.5 1.5 0 0 1 4.5 1H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span>Copy as Markdown</span>
        </>
      )}
    </button>
  );
}
