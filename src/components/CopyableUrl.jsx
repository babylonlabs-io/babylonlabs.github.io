import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyableUrl({ url }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
      <code>{url}</code>
      <button
        onClick={handleCopy}
        title="Copy to clipboard"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          margin: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {copied ? (
          <Check size={14} strokeWidth={2} color="green" />
        ) : (
          <Copy size={14} strokeWidth={2} color="#888" />
        )}
      </button>
    </span>
  );
}
