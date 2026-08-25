import React, { useEffect, useMemo, useRef } from 'react';
import { GraphiQL } from 'graphiql';
import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';

import { ENDPOINT, createFetcher, useVaultIndexerSchema } from './schema';

// `graphiql/graphiql.min.css` exists on disk but is absent from the package's
// exports map, so bundlers reject it. `./style.css` is the exported path.
import 'graphiql/style.css';
import styles from './styles.module.css';

type Props = {
  query: string;
  onClose: () => void;
};

/** The lightbox explorer opened by a code block's Run button. */
export default function Explorer({ query, onClose }: Props): JSX.Element {
  const { colorMode } = useColorMode();
  const { schema, settled } = useVaultIndexerSchema();
  const fetcher = useMemo(() => createFetcher(), []);
  const fullPage = useBaseUrl('/vault-indexer-explorer');
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const panel = panelRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelector)
      );
      if (!focusable.length) {
        e.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (document.activeElement === panel) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    panel?.focus();
    // Stop the page behind the lightbox from scrolling.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [onClose]);

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label="GraphQL explorer"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={panelRef} className={styles.panel} tabIndex={-1}>
        <header className={styles.header}>
          <span className={styles.title}>Vault Indexer explorer</span>
          <code className={styles.endpoint}>{ENDPOINT}</code>
          <a
            className={styles.headerLink}
            href={fullPage}
            title="Open the full explorer, with preset queries"
          >
            Full explorer
          </a>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close explorer"
          >
            Close
          </button>
        </header>
        <div className={styles.graphiql}>
          {settled ? (
            <GraphiQL
              fetcher={fetcher}
              query={query}
              schema={schema}
              forcedTheme={colorMode === 'dark' ? 'dark' : 'light'}
              defaultEditorToolsVisibility={false}
            />
          ) : (
            <div className={styles.schemaLoading}>Loading schema…</div>
          )}
        </div>
      </div>
    </div>
  );
}
