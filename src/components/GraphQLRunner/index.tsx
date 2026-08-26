import React, { useCallback } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

let queryWindowNumber = 0;

const POPUP_FEATURES =
  'popup=yes,width=1440,height=1000,resizable=yes,scrollbars=yes';

type Props = {
  /** The GraphQL document to open the explorer with. */
  query: string;
};

export default function GraphQLRunner({ query }: Props): JSX.Element {
  const explorerPath = useBaseUrl('/vault-indexer-explorer');
  const explorerUrl = `${explorerPath}?${new URLSearchParams({
    query,
  }).toString()}`;

  const openExplorer = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const windowName = `query${(queryWindowNumber += 1)}`;
      const popup = window.open(explorerUrl, windowName, POPUP_FEATURES);

      if (popup) {
        event.preventDefault();
        popup.opener = null;
        popup.focus();
        return;
      }

      // Let the normal link open when the browser blocks pop-ups.
      event.currentTarget.target = windowName;
    },
    [explorerUrl]
  );

  return (
    <a
      className={styles.runButton}
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={openExplorer}
      title="Open this query in the full explorer in a new window"
      aria-label="Open this query in the full explorer in a new window"
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
    </a>
  );
}
