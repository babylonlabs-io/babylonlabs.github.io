import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ChatWidget from '@site/src/components/ChatWidget';

export default function Root({children}) {
  return (
    <>
      {children}
      {/* Reveals documentation prose on scroll. Mounted here rather than in
          DocItem/Layout so API reference pages, which use ApiItem/Layout, are
          covered by the same pass. Client-only: it reads layout and needs
          IntersectionObserver, neither of which exists during prerender. */}
      <BrowserOnly>
        {() => {
          const ContentMotion =
            require('@site/src/components/motion/ContentMotion').default;
          return <ContentMotion />;
        }}
      </BrowserOnly>
      <ChatWidget />
    </>
  );
}
