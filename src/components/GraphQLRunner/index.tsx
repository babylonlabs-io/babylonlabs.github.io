import React, { Suspense, lazy, useCallback, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

import styles from './styles.module.css';

/**
 * The explorer bundles GraphiQL, which is large. Loading it lazily keeps it out
 * of the initial page bundle — nothing is downloaded until someone clicks Run.
 */
const Explorer = lazy(() => import('./Explorer'));

type Props = {
  /** The GraphQL document to open the explorer with. */
  query: string;
};

export default function GraphQLRunner({ query }: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        className={styles.runButton}
        onClick={() => setOpen(true)}
        title="Open this query in the explorer"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false">
          <path d="M1 0.5v9l8-4.5-8-4.5Z" fill="currentColor" />
        </svg>
        Run
      </button>
      {open && (
        <BrowserOnly>
          {() => (
            <Suspense fallback={<div className={styles.loading}>Loading explorer…</div>}>
              <Explorer query={query} onClose={close} />
            </Suspense>
          )}
        </BrowserOnly>
      )}
    </>
  );
}
