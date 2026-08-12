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
import RevealOnView from '../components/motion/RevealOnView';

// Wrap markdown <img> with Zoom so that `![alt](path)` images become
// click-to-fullscreen (mirroring the behaviour already swizzled into
// <ThemedImage>). Skip logos and small icon SVGs.
//
// The fullscreen zoom is kept as the click action — on a wide architecture
// diagram it beats a magnifier, which can only show one region at a time.
// The reveal and the hover lift are additive, so the existing interaction is
// unchanged.
function ZoomableImg(props) {
  const src = typeof props.src === 'string' ? props.src : '';
  const isLogo = src.includes('logo');
  const isIcon = src.endsWith('.svg') && (src.includes('/icon') || src.includes('icons/'));
  if (isLogo || isIcon || !src) {
    return <img {...props} />;
  }
  return (
    <RevealOnView as="span" className="docs-media" variant="zoom">
      <Zoom wrapElement="span">
        <img {...props} />
      </Zoom>
    </RevealOnView>
  );
}

/**
 * Tables reveal as a block and stagger their rows through CSS. The wrapper
 * sits outside the table so the row/cell structure is untouched — a `<div>`
 * between `<table>` and `<tr>` would be invalid and browsers reparent it.
 */
function AnimatedTable(props) {
  const Table = MDXComponents.table ?? 'table';
  return (
    <RevealOnView className="docs-table-wrap">
      <Table {...props} />
    </RevealOnView>
  );
}

/**
 * Code blocks reveal, then carry a shine sweep on hover. `pre` is the element
 * Docusaurus hands to MDX; the CodeBlock component renders inside it.
 */
function AnimatedPre(props) {
  const Pre = MDXComponents.pre ?? 'pre';
  return (
    <RevealOnView className="docs-code-wrap">
      <Pre {...props} />
    </RevealOnView>
  );
}

function AnimatedBlockquote(props) {
  const Blockquote = MDXComponents.blockquote ?? 'blockquote';
  return (
    <RevealOnView variant="fade">
      <Blockquote {...props} />
    </RevealOnView>
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
  table: AnimatedTable,
  pre: AnimatedPre,
  blockquote: AnimatedBlockquote,
};
