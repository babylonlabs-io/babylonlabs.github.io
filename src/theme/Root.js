import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';
import TableCopyControls from '@site/src/components/TableCopyControls';

export default function Root({children}) {
  return (
    <>
      {children}
      <ChatWidget />
      <TableCopyControls />
    </>
  );
}

