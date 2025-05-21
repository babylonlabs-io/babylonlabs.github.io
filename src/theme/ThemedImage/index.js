import React from 'react';
import Zoom from 'react-medium-image-zoom';
import OriginalThemedImage from '@theme-original/ThemedImage';
import 'react-medium-image-zoom/dist/styles.css';
import { useColorMode } from '@docusaurus/theme-common';

function getSrcFromThemedImageProps(props, isDarkTheme) {
  if (props.sources) {
    return isDarkTheme ? props.sources.dark : props.sources.light;
  }
  if (props.src) {
    return props.src;
  }
  return '';
}

export default function ThemedImage(props) {
  const { colorMode } = useColorMode();
  const curSrc = getSrcFromThemedImageProps(props, colorMode);
  return (
    <Zoom key={curSrc + colorMode}>
      <OriginalThemedImage {...props} />
    </Zoom>
  );
}
