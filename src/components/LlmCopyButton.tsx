import React, { useState, useEffect } from 'react';

interface LlmMetadata {
  wordCount: number;
  tokenCount: number;
  lastUpdated: string;
}

interface NotificationState {
  visible: boolean;
  message: string;
  metadata: LlmMetadata | null;
}

export default function LlmCopyButton() {
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    message: '',
    metadata: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndCopyLlmTxt = async () => {
    setIsLoading(true);
    try {
      // Fetch the llms.txt file
      const response = await fetch('/llms.txt');
      if (!response.ok) {
        throw new Error('Failed to fetch llms.txt');
      }
      const text = await response.text();

      // Copy to clipboard
      await navigator.clipboard.writeText(text);

      // Extract metadata from the file (embedded as comments at the top)
      const metadata = extractMetadata(text);

      // Show success notification
      setNotification({
        visible: true,
        message: 'LLM context copied to clipboard!',
        metadata,
      });

      // Auto-hide after 4 seconds
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
      }, 4000);
    } catch (error) {
      console.error('Error copying llm.txt:', error);
      setNotification({
        visible: true,
        message: 'Failed to copy. Please try again.',
        metadata: null,
      });
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const extractMetadata = (text: string): LlmMetadata | null => {
    try {
      // Look for metadata block at the start of the file
      // Format: <!-- METADATA: {"wordCount": 1234, "tokenCount": 1600, "lastUpdated": "2025-01-15"} -->
      const metadataMatch = text.match(
        /<!--\s*METADATA:\s*(\{[^}]+\})\s*-->/
      );
      if (metadataMatch) {
        return JSON.parse(metadataMatch[1]);
      }

      // Fallback: calculate from content
      const words = text.split(/\s+/).filter((w) => w.length > 0).length;
      return {
        wordCount: words,
        tokenCount: Math.round(words * 1.3), // Approximate token count
        lastUpdated: 'Unknown',
      };
    } catch {
      return null;
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <>
      {/* Copy Button */}
      <button
        onClick={fetchAndCopyLlmTxt}
        disabled={isLoading}
        className="llm-copy-button"
        aria-label="Copy LLM context to clipboard"
        title="Copy LLM context for AI assistants"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
        <span>{isLoading ? 'Copying...' : 'llms.txt'}</span>
      </button>

      {/* Notification Toast */}
      {notification.visible && (
        <div className="llm-notification">
          <div className="llm-notification-content">
            <div className="llm-notification-header">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="llm-notification-icon"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span className="llm-notification-message">
                {notification.message}
              </span>
            </div>
            {notification.metadata && (
              <div className="llm-notification-metadata">
                <span className="llm-metadata-item">
                  <strong>{formatNumber(notification.metadata.wordCount)}</strong> words
                </span>
                <span className="llm-metadata-divider">•</span>
                <span className="llm-metadata-item">
                  <strong>~{formatNumber(notification.metadata.tokenCount)}</strong> tokens
                </span>
                <span className="llm-metadata-divider">•</span>
                <span className="llm-metadata-item">
                  Updated: <strong>{notification.metadata.lastUpdated}</strong>
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setNotification((prev) => ({ ...prev, visible: false }))}
            className="llm-notification-close"
            aria-label="Close notification"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
