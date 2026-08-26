import { useEffect } from 'react';

/**
 * Reveals the prose of a documentation page as it scrolls into view.
 *
 * The MDX wrappers only reach tables, code blocks and images, which on a
 * typical page is a small minority of the content — the TBV FAQ measured 2
 * animated blocks out of 84. Everything else stayed static, so pages read as
 * unanimated even though the effects themselves worked. This picks up the
 * rest: headings, paragraphs, lists, admonitions and details.
 *
 * It walks the DOM rather than wrapping elements in React, because the
 * elements come from MDX and are not ours to wrap, and because one observer
 * over many targets is far cheaper than a component per paragraph — long
 * pages here carry ninety-odd blocks.
 *
 * Two things were learned the hard way and are worth keeping:
 *
 *   1. The content column is found by structure, not by a selector chain.
 *      Docusaurus nests it as `.theme-doc-markdown > .row > .col.markdown`,
 *      and spelling that out matched nothing because it missed the `.row`.
 *   2. Re-arming is driven by a MutationObserver, not by a route hook. Keying
 *      an effect on the pathname did not re-run on client-side navigation, so
 *      every in-app page change — which is how readers actually move through
 *      the docs — arrived completely unanimated. Watching the DOM works
 *      regardless of how or when the router swaps content in.
 */

const ANIMATE_TAGS = new Set([
  'H2',
  'H3',
  'H4',
  'P',
  'UL',
  'OL',
  'BLOCKQUOTE',
  'DETAILS',
  'HEADER',
]);

const ARMED = 'docs-prose-reveal';
const REVEALED = 'docs-prose-revealed';

function contentColumn(): HTMLElement | null {
  const containers = Array.from(
    document.querySelectorAll<HTMLElement>('article .markdown'),
  );
  if (containers.length === 0) return null;
  return containers.reduce((best, el) =>
    el.children.length > best.children.length ? el : best,
  );
}

function candidates(column: HTMLElement): HTMLElement[] {
  return Array.from(column.children).filter((el): el is HTMLElement => {
    if (!(el instanceof HTMLElement)) return false;
    if (el.classList.contains(ARMED)) return false;
    // Tables, code blocks and images already animate through their MDX
    // wrappers; arming them here would run two transitions on one element.
    if (el.classList.contains('docs-reveal')) return false;
    if (el.querySelector(':scope > .docs-reveal')) return false;
    return (
      ANIMATE_TAGS.has(el.tagName) || el.classList.contains('theme-admonition')
    );
  });
}

export default function ContentMotion(): null {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    if (
      typeof IntersectionObserver === 'undefined' ||
      typeof MutationObserver === 'undefined'
    ) {
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        // Cascade whatever arrives together, so a screenful of paragraphs
        // staggers instead of snapping in as one block.
        let i = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.transitionDelay = `${Math.min(i, 6) * 80}ms`;
          el.classList.add(REVEALED);
          io.unobserve(el);
          i += 1;
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
    );

    const arm = () => {
      io.disconnect();
      const column = contentColumn();
      if (!column) return;
      const pending = Array.from(
        column.querySelectorAll<HTMLElement>(`.${ARMED}:not(.${REVEALED})`),
      );
      const fresh = candidates(column);
      for (const el of [...pending, ...fresh]) {
        el.classList.add(ARMED);
        io.observe(el);
      }
    };

    arm();

    // Re-arm whenever the router swaps in new content. Scoped to the main
    // wrapper so unrelated DOM churn — the chat widget, the search modal —
    // does not trigger a rescan.
    const host =
      document.querySelector('.main-wrapper') ??
      document.getElementById('__docusaurus') ??
      document.body;

    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        arm();
      });
    });
    mo.observe(host, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      // Never leave content hidden behind.
      document
        .querySelectorAll(`.${ARMED}`)
        .forEach((el) => el.classList.add(REVEALED));
    };
  }, []);

  return null;
}
