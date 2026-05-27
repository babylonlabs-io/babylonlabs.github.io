import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import ComponentsGrid from '../components/ComponentsGrid';
import { CardSection, Card } from '../components/CardComponents';
// import ThemedIcon from '../scripts/ThemedIcon';
import * as icons from '../icons';

// Wrap markdown <img> with Zoom so that `![alt](path)` images become
// click-to-fullscreen (mirroring the behaviour already swizzled into
// <ThemedImage>). Skip logos and small icon SVGs.
function ZoomableImg(props) {
  const src = typeof props.src === 'string' ? props.src : '';
  const isLogo = src.includes('logo');
  const isIcon = src.endsWith('.svg') && (src.includes('/icon') || src.includes('icons/'));
  if (isLogo || isIcon || !src) {
    return <img {...props} />;
  }
  return (
    <Zoom>
      <img {...props} />
    </Zoom>
  );
}

export default {
  ...MDXComponents,
  React,
  ...icons,
  Tabs,
  TabItem,
  ComponentsGrid,
  Card,
  CardSection,
  // ThemedIcon,
  img: ZoomableImg,
};
