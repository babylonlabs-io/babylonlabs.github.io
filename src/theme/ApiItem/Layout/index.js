/**
 * Swizzled ApiItem/Layout to add PageActionsDropdown and TextSelectionToolbar.
 * Based on docusaurus-theme-openapi-docs ApiItem/Layout.
 */
import React from 'react';
import clsx from 'clsx';
import { useWindowSize } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from 'docusaurus-theme-openapi-docs/lib/theme/ApiItem/Layout/styles.module.css';

function useDocTOC() {
  const { frontMatter, toc } = useDoc();
  const windowSize = useWindowSize();
  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;
  const mobile = canRender ? <DocItemTOCMobile /> : undefined;
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;
  return { hidden, mobile, desktop };
}

export default function DocItemLayout({ children }) {
  const docTOC = useDocTOC();
  const { metadata, frontMatter } = useDoc();
  const api = frontMatter.api;
  const schema = frontMatter.schema;
  return (
    <div className="row">
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <div className="doc-content-with-actions">
              <BrowserOnly>
                {() => {
                  const PageActionsDropdown = require('@site/src/components/PageActionsDropdown').default;
                  return <PageActionsDropdown />;
                }}
              </BrowserOnly>
              <DocItemContent>{children}</DocItemContent>
            </div>
            <div className="row">
              <div className={clsx('col', api || schema ? 'col--7' : 'col--12')}>
                <DocItemFooter />
              </div>
            </div>
          </article>
          <div className="row">
            <div className={clsx('col', api || schema ? 'col--7' : 'col--12')}>
              <DocItemPaginator />
            </div>
          </div>
        </div>
        <BrowserOnly>
          {() => {
            const TextSelectionToolbar = require('@site/src/components/TextSelectionToolbar').default;
            return <TextSelectionToolbar />;
          }}
        </BrowserOnly>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}
