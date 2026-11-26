import React from 'react';
import type { ReactNode } from 'react';

/**
 * Section heading.
 *
 * One consistent heading style carrying the section number and the section
 * name, so every section is introduced the same way. Per the docs redesign
 * (Figma 134:2319) it is set in the accent: the number in Px Grotesk Mono,
 * the name in Px Grotesk, both bold at 16px.
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
    <div
      className={`inline-flex items-center gap-2.5 text-base font-bold leading-tight text-accent-text ${className}`}
    >
      <span className="font-code tabular-nums">{index}</span>
      <span>{label}</span>
    </div>
  );
}

/**
 * Section wrapper. One rhythm for the whole page, so nothing has to decide
 * its own spacing. `tone` picks the ground: the review asks for background
 * colours that separate neighbouring sections rather than one flat page.
 */
export function Section({
  index,
  label,
  children,
  className = '',
  tone = 'base',
}: {
  index: string;
  label: string;
  children: ReactNode;
  className?: string;
  tone?: 'base' | 'raised';
}): JSX.Element {
  const ground = tone === 'raised' ? 'bg-contrast' : 'bg-background';
  return (
    <section className={`${ground} ${className}`}>
      <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
        <SectionRule index={index} label={label} className="mb-12" />
        {children}
      </div>
    </section>
  );
}
