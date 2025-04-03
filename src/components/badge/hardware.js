import React from 'react';

const HardwareBadge = ({ children }) => (
  <span
    style={{
      backgroundColor: '#d8a0f7',
      padding: '2px',
      borderRadius: '4px',
      color: 'black',
      fontWeight: 'bold',
      fontSize: '0.8em',
    }}
  >
    {children}
  </span>
);

export default HardwareBadge;
