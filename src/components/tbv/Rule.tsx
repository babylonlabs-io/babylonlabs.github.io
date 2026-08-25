import React from 'react';

/**
 * Section heading.
 *
 * The design review asks for one consistent heading style carrying the
 * section number and the section name, so every section is introduced the
 * same way. It is a chip rather than a rule across the column: the review
 * also rules out orange for decoration, and a full-width hairline with a
 * coloured index was doing decorative work the chip does structurally.
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
    <div className={`inline-flex items-center gap-3 bg-muted px-4 py-2 ${className}`}>
      <span className="font-label text-[11px] tabular-nums text-tertiary">
        {index}
      </span>
      <span className="font-label text-sm text-foreground">{label}</span>
    </div>
  );
}
