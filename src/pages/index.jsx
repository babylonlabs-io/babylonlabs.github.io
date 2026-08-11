import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

import Hero from '../components/tbv/Hero';
import PartnerWall from '../components/tbv/PartnerWall';
import CoverageGallery from '../components/tbv/CoverageGallery';
import ProductCards from '../components/tbv/ProductCards';
import GuidesSamples from '../components/tbv/GuidesSamples';
import Faq from '../components/tbv/Faq';
import CommunitySection from '../components/homepage/CommunitySection';

export default function Homepage() {
  return (
    <Layout
      title="Babylon Labs Documentation"
      description="Use native Bitcoin as collateral in Ethereum DeFi without bridges, wrapped custody, or pooled BTC."
      wrapperClassName="homepage tbv-surface flex flex-col"
    >
      <Head>
        <link rel="prefetch" href="/assets/css/elements.min.css" />
      </Head>

      {/* .tbv-surface scopes the React Bits reset. Everything inside it gets
          preflight-style base rules; nothing outside it changes.

          Section content follows the deployed site: the three TBV entry
          points, the guides and samples, the partner list and the community
          band are all the current copy and links, restyled. */}
      <div className="bg-background font-ui text-foreground">
        <Hero />
        <PartnerWall />
        <CoverageGallery />
        <ProductCards />
        <GuidesSamples />
        <Faq />
        <CommunitySection />
      </div>
    </Layout>
  );
}
