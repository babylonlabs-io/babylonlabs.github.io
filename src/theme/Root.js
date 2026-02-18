import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';
import { DynamicTOCProvider } from '@site/src/components/DynamicTOCContext';

export default function Root({children}) {
  return (
    <DynamicTOCProvider>
      {children}
      <ChatWidget />
    </DynamicTOCProvider>
  );
}

