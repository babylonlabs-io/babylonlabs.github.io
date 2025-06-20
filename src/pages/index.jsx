import React from 'react';
import Layout from '@theme/Layout';

import HeroSection from '../components/homepage/HeroSection';
import CommunitySection from '../components/homepage/CommunitySection';
import HomeFooter from '../components/homepage/HomeFooter';
import Head from '@docusaurus/Head';
import GuidesAndSamples from '../components/homepage/GuidesAndSamples';
import ToolsAndInfra from '../components/homepage/ToolsAndInfra';
import BlogSection from '../components/homepage/BlogSection';
export default function Homepage() {
  return (
    <Layout
      title="Babylon Labs Documentation"
      wrapperClassName="homepage flex flex-col"
      noFooter
    >
      <Head>
        <link rel="prefetch" href="/assets/css/elements.min.css"/>
      </Head>
      <div></div>
      <HeroSection/>
      <ToolsAndInfra/>
      <GuidesAndSamples/>
      <BlogSection />
      <CommunitySection/>
      <HomeFooter/>
    </Layout>
  );
}
