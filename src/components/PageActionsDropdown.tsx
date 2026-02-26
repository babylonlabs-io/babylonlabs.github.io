import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  MessageSquare,
  MoreVertical,
  Sparkles,
} from 'lucide-react';

export default function PageActionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleAskBabylonAI = useCallback(() => {
    const pageUrl = window.location.href;
    const title = document.querySelector('article h1')?.textContent?.trim() || document.title;
    const question = `Help me understand this Babylon documentation page "${title}": ${pageUrl}`;
    window.dispatchEvent(
      new CustomEvent('babylon-ai-query', {
        detail: { question },
      })
    );
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

  return (
    <div className="page-actions-dropdown" ref={dropdownRef}>
      <button
        className="page-actions-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Chat about this page"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Chat about this page"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="page-actions-menu" role="menu">
          <button
            className="page-actions-item page-actions-item--ai"
            onClick={handleAskBabylonAI}
            role="menuitem"
          >
            <Bot size={15} />
            <span>Ask Babylon AI</span>
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
    </div>
  );
}
