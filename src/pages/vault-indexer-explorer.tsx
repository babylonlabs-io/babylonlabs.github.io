import React, { Suspense, lazy } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

import styles from './vault-indexer-explorer.module.css';

/**
 * A dedicated, full-viewport GraphQL explorer for the vault indexer.
 *
 * The Run button on a documentation code block opens a lightbox for one query.
 * This page is the other half: somewhere to stay and try many queries, with the
 * documented examples one click away.
 *
 * GraphiQL is large, so it loads lazily even here.
 */
const FullExplorer = lazy(() => import('@site/src/components/GraphQLRunner/FullExplorer'));

export default function VaultIndexerExplorerPage(): JSX.Element {
  return (
    <Layout
      title="Vault Indexer Explorer"
      description="Run and edit GraphQL queries against the Babylon Trustless Bitcoin Vaults (TBV) indexer, with the documented examples as presets."
      noFooter
    >
      <main className={styles.main}>
        <BrowserOnly fallback={<div className={styles.loading}>Loading explorer…</div>}>
          {() => (
            <Suspense fallback={<div className={styles.loading}>Loading explorer…</div>}>
              <FullExplorer />
            </Suspense>
          )}
        </BrowserOnly>
      </main>
    </Layout>
  );
}
