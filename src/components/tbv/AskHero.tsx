import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * Hero entry point into the Babylon AI assistant.
 *
 * This never calls the chat API. It dispatches the question on the
 * `babylon-ai-query` event, which ChatWidget already listens for. ChatWidget
 * opens full screen and only submits once its privacy consent gate has been
 * accepted. Calling the API from here would route around that gate.
 */

const CUT =
  '[clip-path:polygon(var(--cut)_0,100%_0,100%_calc(100%-var(--cut)),calc(100%-var(--cut))_100%,0_100%,0_var(--cut))]';

const SUGGESTED_QUESTIONS = [
  'What is Trustless Bitcoin Vault?',
  'How do I create a vault?',
  'How do I borrow against my Bitcoin?',
  'How does redemption back to Bitcoin work?',
];

function dispatchAIQuery(question: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('babylon-ai-query', { detail: { question } }),
  );
}

export default function AskHero(): JSX.Element {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;
    dispatchAIQuery(question);
    setInput('');
  };

  const cutVar = { '--cut': '10px' } as React.CSSProperties;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        <span className="font-code text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Ask the docs
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        style={cutVar}
        className={`flex h-14 items-center gap-2 bg-border p-px ${CUT}`}
      >
        <span
          style={cutVar}
          className={`flex h-full w-full items-center gap-3 bg-background pl-5 pr-1.5 ${CUT}`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about Trustless Bitcoin Vault…"
            aria-label="Ask Babylon AI a question"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            style={{ '--cut': '8px' } as React.CSSProperties}
            className={`focus-ring inline-flex h-11 shrink-0 items-center gap-2 bg-accent px-5 text-sm font-medium text-accent-foreground transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${CUT}`}
          >
            Ask AI
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </span>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => dispatchAIQuery(q)}
            style={{ '--cut': '6px' } as React.CSSProperties}
            className={`focus-ring border border-border bg-background/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:border-accent hover:text-foreground ${CUT}`}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
