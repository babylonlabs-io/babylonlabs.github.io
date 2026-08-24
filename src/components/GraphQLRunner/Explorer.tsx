import React, { useEffect, useMemo } from 'react';
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // Stop the page behind the lightbox from scrolling.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
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
      <div className={styles.panel}>
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
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close explorer">
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
