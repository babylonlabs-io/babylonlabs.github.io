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
  const { isLogo, ...restProps } = props;
  
  // Exclude navbar/footer logo from Zoom effect
  // Check multiple sources for 'logo' in path
  const isLogoImage = 
    isLogo ||
    (typeof props.src === 'string' && props.src.includes('logo')) ||
    (props.sources?.light && props.sources.light.includes('logo')) ||
    (props.sources?.dark && props.sources.dark.includes('logo')) ||
    (typeof curSrc === 'string' && curSrc.includes('logo'));
  
  if (isLogoImage) {
    return <OriginalThemedImage {...restProps} />;
  }
  
  return (
    <Zoom key={curSrc + colorMode}>
      <OriginalThemedImage {...restProps} />
    </Zoom>
  );
}
