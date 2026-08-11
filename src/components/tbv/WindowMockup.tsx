import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Window chrome wrapped around a product screenshot.
 *
 * The React Bits template hand-builds a fake dashboard inside this chrome. Here
 * the chrome holds a real screenshot of the borrow and repay flow, so the
 * landing page shows the actual product rather than an illustration.
 */
export default function WindowMockup({
  src = 'img/landing-page/dashboard/borrow-repay-placeholder.png',
  alt = 'Borrowing against a Bitcoin vault, showing repayment amount, borrow rate and health factor',
  title = 'Trustless Bitcoin Vault',
}: {
  src?: string;
  alt?: string;
  title?: string;
}): JSX.Element {
  const resolved = useBaseUrl(src);

  return (
    <div className="mx-auto max-w-[1100px] overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/[0.08] dark:shadow-black/40">
      <div className="relative flex h-8 items-center border-b border-border px-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="pointer-events-none absolute inset-x-0 text-center font-code text-xs text-muted-foreground">
          {title}
        </span>
      </div>

      <img
        src={resolved}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block w-full"
      />
    </div>
  );
}
