import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import ComponentsGrid from '../components/ComponentsGrid';
import { CardSection, Card } from '../components/CardComponents';
// import ThemedIcon from '../scripts/ThemedIcon';
import * as icons from '../icons';

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
};
