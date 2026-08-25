import React, { useEffect, useRef } from 'react';

/**
 * Types a code block out, line by line, when it first scrolls into view.
 *
 * Animate UI's TypingText retypes a string by substringing it into state. That
 * is right for a plain heading and wrong for a code block: Docusaurus has
 * already tokenised the source into highlighted spans, so replacing the text
 * would throw the highlighting away, and while it typed, the reader could
 * select — or the copy button could copy — a half-finished snippet.
 *
 * The effect is kept and the mechanism changed. The markup is left exactly as
 * rendered and each line is uncovered left to right with a clip, a caret
 * riding the edge. Highlighting, selection, copy and in-page search all keep
 * working throughout, because the full code is in the DOM the whole time.
 *
 * One limit stops this becoming an obstacle on reference documentation:
 * blocks longer than MAX_LINES simply reveal without typing, since watching
 * eighty lines appear one at a time is a wait rather than an effect. At
 * 90ms a line, a full 24-line block finishes in about 2.5 seconds.
 */

/** Kept in step with the nth-child delays in custom.css. */
const MAX_LINES = 24;

export default function TypingCode({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    if (
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    if (typeof IntersectionObserver === 'undefined') return;

    const lines = Array.from(
      host.querySelectorAll<HTMLElement>('.token-line'),
    );
    if (lines.length === 0 || lines.length > MAX_LINES) return;

    // The per-line delay is a CSS nth-child rule rather than an inline
    // custom property. Docusaurus sets `style={{color}}` on each token line
    // through React, whose reconciliation rewrites that attribute and
    // silently dropped a property written here — every line typed at once.
    host.classList.add('docs-code-typing');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          host.classList.add('docs-code-typed');
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
    );
    observer.observe(host);

    return () => {
      observer.disconnect();
      // Never leave a block half-typed if this unmounts mid-run.
      host.classList.add('docs-code-typed');
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
