import React from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import {useDynamicTOC} from '@site/src/components/DynamicTOCContext';

import styles from './styles.module.css';

function DynamicTOCDesktop({tocItems}) {
  return (
    <div className={clsx('thin-scrollbar', styles.dynamicToc)}>
      <ul className="table-of-contents table-of-contents__left-border">
        {tocItems.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? styles.tocNested : undefined}
          >
            <a
              href={`#${item.id}`}
              className="table-of-contents__link toc-highlight"
            >
              {item.value}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const {tocItems: dynamicTocItems} = useDynamicTOC();
  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const hasNativeToc = !hidden && toc.length > 0;
  const hasDynamicToc = !hidden && dynamicTocItems.length > 0;
  const canRender = hasNativeToc || hasDynamicToc;

  const mobile = hasNativeToc ? <DocItemTOCMobile /> : undefined;

  let desktop;
  if (canRender && (windowSize === 'desktop' || windowSize === 'ssr')) {
    if (hasNativeToc) {
      desktop = <DocItemTOCDesktop />;
    } else if (hasDynamicToc) {
      desktop = <DynamicTOCDesktop tocItems={dynamicTocItems} />;
    }
  }

  return {
    hidden,
    mobile,
    desktop,
    canRender,
  };
}

export default function DocItemLayout({children}) {
  const docTOC = useDocTOC();
  const {metadata} = useDoc();
  return (
    <div className="row">
      <div className={clsx('col', docTOC.canRender && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}
