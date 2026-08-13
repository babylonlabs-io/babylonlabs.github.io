import React from 'react';
import Layout from '@theme/Layout';

import Hero from '../components/tbv/Hero';
import Stats from '../components/tbv/Stats';
import ProductCards from '../components/tbv/ProductCards';
import GuidesSamples from '../components/tbv/GuidesSamples';
import Faq from '../components/tbv/Faq';
import CommunitySection from '../components/homepage/CommunitySection';

export default function Homepage() {
  return (
    <Layout
      title="Babylon Labs Documentation"
      description="Borrow against native Bitcoin without selling, wrapping, bridging or intermediaries."
      wrapperClassName="homepage tbv-surface flex flex-col"
    >
      {/* .tbv-surface scopes the base reset. Sections are numbered in order,
          which is the page's organising device: 01 figures, 02 entry points,
          03 documentation, 04 questions. */}
      <div className="bg-background font-ui text-foreground">
        <Hero />
        <Stats />
        <ProductCards />
        <GuidesSamples />
        <Faq />
        <CommunitySection />
      </div>
    </Layout>
  );
}
