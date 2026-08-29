import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, Slash } from 'lucide-react';

/**
 * Hero composer.
 *
 * Deliberately minimal: an autosizing textarea, slash commands and a send
 * control. Dictation, attachments and the row of pre-set question buttons were
 * removed — each was another thing between the reader and the product
 * screenshot, which is what the hero is actually for.
 *
 * It never calls the chat API. Submitting dispatches `babylon-ai-query`, which
 * ChatWidget listens for; the widget opens full screen and runs its privacy
 * consent gate before anything is sent.
 */

type Command = { name: string; hint: string; question: string };

/** Slash commands map to the questions readers actually arrive with. */
const COMMANDS: Command[] = [
  {
    name: '/vault',
    hint: 'What Babylon Trustless Bitcoin Vaults are',
    question: 'What are Babylon Trustless Bitcoin Vaults?',
  },
  {
    name: '/create',
    hint: 'Creating and activating a vault',
    question: 'How do I create a vault?',
  },
  {
    name: '/borrow',
    hint: 'Borrowing against your Bitcoin',
    question: 'How do I borrow against my Bitcoin?',
  },
  {
    name: '/redeem',
    hint: 'Getting your Bitcoin back',
    question: 'How does redemption back to Bitcoin work?',
  },
  {
    name: '/setup',
    hint: 'Wallets, networks and faucets',
    question: 'Which wallets do I need and how do I set them up?',
  },
  {
    name: '/risk',
    hint: 'Health factor and liquidation',
    question: 'What is the health factor and what number is safe?',
  },
];

function dispatchAIQuery(question: string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('babylon-ai-query', { detail: { question } }),
  );
}

export default function AskHero(): JSX.Element {
  const [value, setValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCmd, setActiveCmd] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // The menu opens when the field starts with a slash, and filters as you type.
  const query = value.startsWith('/') ? value.slice(1).toLowerCase() : null;
  const matches =
    query === null
      ? []
      : COMMANDS.filter((c) => c.name.slice(1).startsWith(query));
  const showMenu = menuOpen && matches.length > 0;

  useEffect(() => {
    setMenuOpen(value.startsWith('/'));
    setActiveCmd(0);
  }, [value]);

  const autosize = (): void => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const send = (text: string): void => {
    const question = text.trim();
    if (!question || question.startsWith('/')) return;
    dispatchAIQuery(question);
    setValue('');
    setMenuOpen(false);
    const el = textareaRef.current;
    if (el) el.style.height = 'auto';
  };

  const runCommand = (cmd: Command): void => {
    setMenuOpen(false);
    send(cmd.question);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (showMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveCmd((i) => (i + 1) % matches.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveCmd((i) => (i - 1 + matches.length) % matches.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const cmd = matches[activeCmd];
        if (cmd) runCommand(cmd);
        return;
      }
      if (e.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(value);
    }
  };

  const btn =
    'focus-ring inline-flex h-9 w-9 shrink-0 items-center justify-center transition-colors duration-150';

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative">
        {showMenu && (
          <div
            id="ask-hero-command-list"
            role="listbox"
            aria-label="Commands"
            className="absolute bottom-full z-20 mb-2 w-full border border-border bg-background py-1"
          >
            {matches.map((cmd, i) => (
              <button
                key={cmd.name}
                id={`ask-hero-command-${cmd.name.slice(1)}`}
                type="button"
                role="option"
                aria-selected={i === activeCmd}
                onMouseEnter={() => setActiveCmd(i)}
                onClick={() => runCommand(cmd)}
                className={`flex w-full items-baseline gap-3 px-3 py-2 text-left transition-colors ${
                  i === activeCmd ? 'bg-muted' : ''
                }`}
              >
                <span className="font-label text-xs text-muted-foreground">
                  {cmd.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {cmd.hint}
                </span>
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(value);
          }}
          className="border border-border bg-background/80 backdrop-blur-sm transition-colors focus-within:border-muted-foreground"
        >
          <div className="flex items-end gap-1.5 p-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                autosize();
              }}
              onKeyDown={onKeyDown}
              placeholder="Ask anything, or type / for commands"
              aria-label="Ask Babylon AI a question"
              role="combobox"
              aria-controls="ask-hero-command-list"
              aria-expanded={showMenu}
              aria-activedescendant={showMenu ? `ask-hero-command-${matches[activeCmd]?.name.slice(1)}` : undefined}
              className="block max-h-40 min-w-0 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-left font-ui text-[15px] leading-6 text-foreground outline-none placeholder:text-muted-foreground"
            />

            <button
              type="button"
              onClick={() => {
                setValue('/');
                textareaRef.current?.focus();
              }}
              aria-label="Show commands"
              className={`${btn} text-muted-foreground hover:text-foreground`}
            >
              <Slash className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="submit"
              disabled={!value.trim() || value.startsWith('/')}
              aria-label="Send"
              className={`${btn} bg-accent text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground`}
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
