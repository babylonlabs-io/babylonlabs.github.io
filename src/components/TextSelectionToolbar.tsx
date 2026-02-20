import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bot, MessageSquare, Sparkles } from 'lucide-react';

interface ToolbarPosition {
  top: number;
  left: number;
}

export default function TextSelectionToolbar() {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<ToolbarPosition>({ top: 0, left: 0 });
  const [selectedText, setSelectedText] = useState('');
  const toolbarRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToolbar = useCallback(() => {
    setVisible(false);
    setSelectedText('');
  }, []);

  const handleMouseUp = useCallback(() => {
    // Small delay lets the selection finalize
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    hideTimeoutRef.current = setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (!text || text.length < 3) {
        hideToolbar();
        return;
      }

      // Only show on doc content areas
      const anchorNode = selection?.anchorNode;
      if (!anchorNode) return;

      const article = (anchorNode.nodeType === Node.ELEMENT_NODE
        ? anchorNode as Element
        : anchorNode.parentElement
      )?.closest('article');

      if (!article) {
        hideToolbar();
        return;
      }

      // Don't show if selection is inside the toolbar itself
      const parentEl = anchorNode.nodeType === Node.ELEMENT_NODE
        ? anchorNode as Element
        : anchorNode.parentElement;
      if (parentEl?.closest('.text-selection-toolbar')) return;

      const range = selection!.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Position toolbar above the selection, centered horizontally
      const toolbarWidth = 280;
      let left = rect.left + rect.width / 2 - toolbarWidth / 2;

      // Keep within viewport bounds
      left = Math.max(8, Math.min(left, window.innerWidth - toolbarWidth - 8));
      const top = rect.top - 48; // above selection with some padding

      setPosition({ top: Math.max(8, top), left });
      setSelectedText(text);
      setVisible(true);
    }, 10);
  }, [hideToolbar]);

  // Listen for mouseup on document
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  // Hide on scroll or resize
  useEffect(() => {
    if (!visible) return;

    const handleHide = () => hideToolbar();
    window.addEventListener('scroll', handleHide, true);
    window.addEventListener('resize', handleHide);
    return () => {
      window.removeEventListener('scroll', handleHide, true);
      window.removeEventListener('resize', handleHide);
    };
  }, [visible, hideToolbar]);

  // Hide when clicking outside toolbar
  useEffect(() => {
    if (!visible) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        hideToolbar();
      }
    };

    // Use a slight delay so the mousedown that's part of a new selection doesn't
    // immediately dismiss the toolbar before mouseup fires
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [visible, hideToolbar]);

  const handleAskBabylonAI = useCallback(() => {
    const question = `Help me understand this from Babylon documentation:\n\n"${selectedText}"`;
    window.dispatchEvent(
      new CustomEvent('babylon-ai-query', {
        detail: { question },
      })
    );
    hideToolbar();
  }, [selectedText, hideToolbar]);

  const handleOpenChatGPT = useCallback(() => {
    const pageUrl = window.location.href;
    const prompt = `I'm reading Babylon documentation at ${pageUrl}. Help me understand this:\n\n"${selectedText}"`;
    window.open(
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
      '_blank',
    );
    hideToolbar();
  }, [selectedText, hideToolbar]);

  const handleOpenClaude = useCallback(() => {
    const pageUrl = window.location.href;
    const prompt = `I'm reading Babylon documentation at ${pageUrl}. Help me understand this:\n\n"${selectedText}"`;
    window.open(
      `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
      '_blank',
    );
    hideToolbar();
  }, [selectedText, hideToolbar]);

  if (!visible) return null;

  return (
    <div
      ref={toolbarRef}
      className="text-selection-toolbar"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      role="toolbar"
      aria-label="Text selection actions"
    >
      <button
        className="text-selection-toolbar-btn text-selection-toolbar-btn--ai"
        onClick={handleAskBabylonAI}
        title="Ask Babylon AI about this text"
      >
        <Bot size={14} />
        <span>Ask Babylon AI</span>
      </button>
      <div className="text-selection-toolbar-divider" />
      <button
        className="text-selection-toolbar-btn"
        onClick={handleOpenChatGPT}
        title="Ask ChatGPT about this text"
      >
        <MessageSquare size={14} />
        <span>ChatGPT</span>
      </button>
      <button
        className="text-selection-toolbar-btn"
        onClick={handleOpenClaude}
        title="Ask Claude about this text"
      >
        <Sparkles size={14} />
        <span>Claude</span>
      </button>
    </div>
  );
}
