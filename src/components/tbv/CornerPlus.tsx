import React from 'react';
import type { ReactNode } from 'react';

/**
 * Corner crosshair motif. Placed at the corners of a bounded region to mark it
 * as a deliberate frame rather than a card. The template uses a fixed blue
 * here; this version uses the accent token so it follows the palette.
 */
export function CornerPlus({ className }: { className: string }): JSX.Element {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`pointer-events-none absolute z-10 h-3.5 w-3.5 text-accent ${className}`}>
      <path
        d="M12 4v16M4 12h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Small label that sits above a section heading. */
export function Kicker({ children }: { children: ReactNode }): JSX.Element {
  return (
    <p className="font-code text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </p>
  );
}

/**
 * Wraps a region in the four-corner crosshair frame.
 */
export function CrosshairFrame({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div className={`relative ${className}`}>
      <CornerPlus className="-left-1.5 -top-1.5" />
      <CornerPlus className="-right-1.5 -top-1.5" />
      <CornerPlus className="-bottom-1.5 -left-1.5" />
      <CornerPlus className="-bottom-1.5 -right-1.5" />
      {children}
    </div>
  );
}

export default CornerPlus;
