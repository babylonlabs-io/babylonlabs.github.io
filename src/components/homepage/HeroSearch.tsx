import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import './HeroSearch.css';

const SUGGESTED_QUESTIONS = [
  'What is Trustless Bitcoin Vault?',
  'How does co-staking work?',
  'How do I stake BABY tokens?',
  'How do I stake BTC on Babylon?',
  'What is a Finality Provider?',
];

function dispatchAIQuery(question: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('babylon-ai-query', {
      detail: { question },
    })
  );
}

export default function HeroSearch() {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    dispatchAIQuery(input.trim());
    setInput('');
  };

  return (
    <div className="hero-search-container">
      <div className="hero-search-content">
        <div className="hero-search-badge">
          <Sparkles className="hero-search-badge-icon" />
          <span>AI-Powered Documentation</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`hero-search-bar ${isFocused ? 'focused' : ''}`}
        >
          <Search className="hero-search-icon" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask Babylon AI anything..."
            className="hero-search-input"
          />
          <button
            type="submit"
            className="hero-search-submit"
            disabled={!input.trim()}
          >
            Ask AI
          </button>
        </form>

        <div className="hero-search-chips">
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => dispatchAIQuery(q)}
              className="hero-search-chip"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
