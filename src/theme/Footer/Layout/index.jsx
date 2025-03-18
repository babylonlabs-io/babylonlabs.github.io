import React from 'react';
import clsx from 'clsx';

export default function FooterLayout({ style, links, logo, copyright }) {
  return (
    <footer
      className={clsx('footer', {
        'footer--dark': style === 'dark',
      })}
    ></footer>
  );
}
