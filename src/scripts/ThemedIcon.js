import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

const ThemedIcon = ({ iconPath, alt, darkImg }) => {
  const { colorMode } = useColorMode();

  const getDarkIconPath = (path) => {
    if (!path) return '';
    const parts = path.split('.');
    const extension = parts.pop();
    return `${parts.join('.')}_dark.${extension}`;
  };

  const iconSrc =
    colorMode === 'dark' ? darkImg || getDarkIconPath(iconPath) : iconPath;

  return <img src={iconSrc} alt={alt} />;
};

export default ThemedIcon;
