import React from 'react';
import Zoom from 'react-medium-image-zoom';
import OriginalThemedImage from '@theme-original/ThemedImage';
import 'react-medium-image-zoom/dist/styles.css';


export default function ThemedImage(props) {
  return (
    <Zoom>
      <OriginalThemedImage {...props} />
    </Zoom>
  );
}
