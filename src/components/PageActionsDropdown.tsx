import React, { useState, useEffect, useRef, useCallback } from 'react';
import TurndownService from 'turndown';
import {
  Copy,
  Download,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

function getPageMarkdown(): { markdown: string; title: string } | null {
  const article = document.querySelector('article');
  if (!article) return null;

  const clone = article.cloneNode(true) as HTMLElement;

  // Remove non-content elements
  clone
    .querySelectorAll(
      'nav, .theme-doc-breadcrumbs, .theme-doc-version-badge, .theme-doc-footer, .page-actions-dropdown, .table-of-contents',
    )
    .forEach((el) => el.remove());

  const h1 = clone.querySelector('h1');
  const title = h1?.textContent?.trim() || document.title;

  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });

  // Preserve code block language hints
  turndown.addRule('fencedCodeBlock', {
    filter(node: HTMLElement) {
      return (
        node.nodeName === 'PRE' &&
        node.firstChild != null &&
        (node.firstChild as HTMLElement).nodeName === 'CODE'
      );
    },
    replacement(_content: string, node: TurndownService.Node) {
      const code = (node as HTMLElement).querySelector('code');
      if (!code) return _content;
      const lang =
        code.className
          .split(' ')
          .find((c: string) => c.startsWith('language-'))
          ?.replace('language-', '') || '';
      return `\n\`\`\`${lang}\n${code.textContent}\n\`\`\`\n`;
    },
  });

  const markdown = turndown.turndown(clone.innerHTML);
  return { markdown, title };
}

type TooltipState = {
  text: string;
  visible: boolean;
};

export default function PageActionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [remoteMdLoading, setRemoteMdLoading] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({
    text: '',
    visible: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track RemoteMD loading state
  useEffect(() => {
    const onLoadStart = () => setRemoteMdLoading(true);
    const onLoadComplete = () => setRemoteMdLoading(false);
    window.addEventListener('remoteMdLoadStart', onLoadStart);
    window.addEventListener('remoteMdLoadComplete', onLoadComplete);
    return () => {
      window.removeEventListener('remoteMdLoadStart', onLoadStart);
      window.removeEventListener('remoteMdLoadComplete', onLoadComplete);
    };
  }, []);

  // Close on click-outside or Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const showTooltip = useCallback((text: string) => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    setTooltip({ text, visible: true });
    tooltipTimeout.current = setTimeout(() => {
      setTooltip({ text: '', visible: false });
    }, 2000);
  }, []);

  const handleCopy = useCallback(async () => {
    const result = getPageMarkdown();
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.markdown);
      showTooltip('Copied!');
    } catch {
      showTooltip('Copy failed');
    }
    setIsOpen(false);
  }, [showTooltip]);

  const handleDownload = useCallback(() => {
    const result = getPageMarkdown();
    if (!result) return;
    const filename =
      result.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '.md';
    const blob = new Blob([result.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  }, []);

  const handleOpenChatGPT = useCallback(() => {
    const pageUrl = window.location.href;
    const prompt = `Read this Babylon documentation page and help me understand it: ${pageUrl}`;
    window.open(
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
      '_blank',
    );
    setIsOpen(false);
  }, []);

  const handleOpenClaude = useCallback(() => {
    const pageUrl = window.location.href;
    const prompt = `Read this Babylon documentation page and help me understand it: ${pageUrl}`;
    window.open(
      `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
      '_blank',
    );
    setIsOpen(false);
  }, []);

  const contentDisabled = remoteMdLoading;

  return (
    <div className="page-actions-dropdown" ref={dropdownRef}>
      <button
        className="page-actions-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Page actions"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Page actions"
      >
        <Copy size={18} />
      </button>

      {isOpen && (
        <div className="page-actions-menu" role="menu">
          <button
            className="page-actions-item"
            onClick={handleCopy}
            disabled={contentDisabled}
            role="menuitem"
          >
            <Copy size={15} />
            <span>Copy as Markdown</span>
          </button>
          <button
            className="page-actions-item"
            onClick={handleDownload}
            disabled={contentDisabled}
            role="menuitem"
          >
            <Download size={15} />
            <span>Download as Markdown</span>
          </button>
          <div className="page-actions-divider" role="separator" />
          <button
            className="page-actions-item"
            onClick={handleOpenChatGPT}
            role="menuitem"
          >
            <MessageSquare size={15} />
            <span>Open in ChatGPT</span>
          </button>
          <button
            className="page-actions-item"
            onClick={handleOpenClaude}
            role="menuitem"
          >
            <Sparkles size={15} />
            <span>Open in Claude</span>
          </button>
        </div>
      )}

      {tooltip.visible && (
        <div className="page-actions-tooltip">{tooltip.text}</div>
      )}
    </div>
  );
}
