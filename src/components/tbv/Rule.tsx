import React from 'react';
import type { ReactNode } from 'react';

/**
 * The ledger motif — this page's differentiation anchor.
 *
 * Every section is introduced by a hairline rule carrying a monospace index
 * and label, the way a ledger or a spec sheet numbers its entries. The index
 * is the accent; the rule is the structure. It is the one device repeated
 * across the page, and it is what makes a screenshot of this page
 * recognisable without the logo.
 *
 * Written for this site. No third-party component source is involved.
 */
export function SectionRule({
  index,
  label,
  className = '',
}: {
  index: string;
  label: string;
  className?: string;
}): JSX.Element {
  return (
    <div className={`flex items-baseline gap-4 ${className}`}>
      <span className="font-code text-xs tabular-nums text-accent">
        {index}
      </span>
      <span className="font-code text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </span>
      {/* The rule runs to the edge of the container, not the text. Stopping it
          short is what makes a divider look decorative rather than structural. */}
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-border"
      />
    </div>
  );
}

/**
 * Section wrapper. One rhythm for the whole page, so nothing has to decide
 * its own spacing.
 */
export function Section({
  index,
  label,
  children,
  className = '',
}: {
  index: string;
  label: string;
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <section className={`mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28 ${className}`}>
      <SectionRule index={index} label={label} className="mb-12" />
      {children}
    </section>
  );
}
