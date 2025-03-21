import React from 'react';
import { useLocation } from '@docusaurus/router';
import HomeFooter from '../../components/homepage/HomeFooter';

export default function FooterWrapper(props) {
  const { pathname } = useLocation();

  return (
    <>
      <HomeFooter />
    </>
  );
}
