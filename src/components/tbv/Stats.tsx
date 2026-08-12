import React from 'react';
import { SectionRule } from './Rule';

/**
 * Figures band, following the marketing design's stat row.
 *
 * Set in the mono face and aligned on a hairline grid rather than boxed into
 * cards: the ledger reading is the point, and it keeps the band quiet enough
 * to sit directly under the hero without competing with it.
 */

type Stat = { value: string; label: string };

const STATS: Stat[] = [
  { value: '40,000+', label: 'BTC staked' },
  { value: '$2B+', label: 'Total value' },
  { value: '$110M+', label: 'Raised' },
];

export default function Stats(): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8">
      <SectionRule index="01" label="By the numbers" className="mb-10" />

      <dl className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-background px-6 py-8">
            <dt className="font-code text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {stat.label}
            </dt>
            {/* tabular-nums keeps the three figures optically aligned even
                though they have different digit counts. */}
            <dd className="mt-3 font-display text-4xl tabular-nums tracking-tight text-foreground">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
