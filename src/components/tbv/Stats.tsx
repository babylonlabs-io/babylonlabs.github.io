import React from 'react';

/**
 * Figures band, following the marketing design's stat row.
 *
 * Labels in the mono face over large figures, on three beige tiles.
 */

type Stat = { value: string; label: string };

const STATS: Stat[] = [
  { value: '40,000+', label: 'BTC staked' },
  { value: '$2B+', label: 'Total value' },
  { value: '$110M+', label: 'Raised' },
];

export default function Stats(): JSX.Element {
  return (
    <section className="bg-background dark:bg-contrast">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 lg:py-20">

      {/* Beige tiles on the white band, separated by a hairline gap, per the
          docs redesign (Figma 134:2308). */}
      <dl className="grid grid-cols-1 gap-px sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-muted px-7 py-7">
            <dt className="font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {stat.label}
            </dt>
            {/* tabular-nums keeps the three figures optically aligned even
                though they have different digit counts. */}
            <dd className="mt-4 font-display text-4xl tabular-nums tracking-[-0.02em] text-foreground lg:text-5xl">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      </div>
    </section>
  );
}
