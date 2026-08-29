import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

import styles from './styles.module.css';

/**
 * The explorer bundles GraphiQL, which is large. Loading it lazily keeps it out
 * of the initial page bundle — nothing is downloaded until someone clicks Run.
 */
const Explorer = lazy(() => import('./Explorer'));

/**
 * A page carries one Run button per example, and every one of them can mount an
 * explorer. Holding the open dialog's setter here keeps that to a single live
 * GraphiQL instance: opening a second example closes the first.
 */
let openDialog: React.Dispatch<React.SetStateAction<boolean>> | null = null;

type Props = {
  /** The GraphQL document to open the explorer with. */
  query: string;
};

export default function GraphQLRunner({ query }: Props): JSX.Element {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    if (openDialog === setOpen) openDialog = null;
  }, []);

  const show = useCallback(() => {
    if (openDialog && openDialog !== setOpen) openDialog(false);
    openDialog = setOpen;
    setOpen(true);
  }, []);

  // A page navigation unmounts the button while its dialog is still registered.
  useEffect(
    () => () => {
      if (openDialog === setOpen) openDialog = null;
    },
    []
  );

  return (
    <>
      <button
        type="button"
        className={styles.runButton}
        onClick={show}
        title="Open this query in the explorer"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M1 0.5v9l8-4.5-8-4.5Z" fill="currentColor" />
        </svg>
        Run
      </button>
      {open && (
        <BrowserOnly>
          {() => (
            <Suspense
              fallback={<div className={styles.loading}>Loading explorer…</div>}
            >
              <Explorer query={query} onClose={close} />
            </Suspense>
          )}
        </BrowserOnly>
      )}
    </>
  );
}
