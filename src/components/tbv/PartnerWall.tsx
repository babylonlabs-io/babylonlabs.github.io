import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { CornerPlus, Kicker } from './CornerPlus';

/**
 * Product partner logo wall. Replaces the template's "protecting industry
 * leaders" band, and sits directly under the hero screenshot.
 */

// Names, logos and destinations come from the existing ToolsAndInfra partner
// list, so the wall shows the real product partners rather than a curated set.
const PARTNERS: { name: string; file: string; href: string }[] = [
  {
    name: 'Skip (Eureka)',
    file: 'skip.png',
    href: 'https://go.cosmos.network/',
  },
  { name: 'Union', file: 'union.png', href: 'https://btc.union.build/' },
  {
    name: 'Squid (Axelar)',
    file: 'squid.png',
    href: 'https://app.squidrouter.com/',
  },
  {
    name: 'SatLayer',
    file: 'satlayer.png',
    href: 'https://cube.satlayer.xyz/',
  },
  { name: 'Escher', file: 'escher.jpg', href: 'https://app.escher.finance/' },
  {
    name: 'MilkyWay',
    file: 'milkyway.jpg',
    href: 'https://app.milkyway.zone/stake?tab=stake',
  },
  {
    name: 'Persistence',
    file: 'persistence.jpg',
    href: 'https://app.persistence.one/?from=BABY&to=XPRT',
  },
];

function PartnerLogo({
  name,
  file,
  href,
}: {
  name: string;
  file: string;
  href: string;
}): JSX.Element {
  const src = useBaseUrl(`img/landing-page/tools-and-infra/${file}`);
  return (
    <li className="flex items-center justify-center px-4 py-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={name}
        className="focus-ring flex items-center justify-center"
      >
      <img
        src={src}
        alt={name}
        loading="lazy"
        decoding="async"
        // Every logo in this set is a dark mark on a light ground, including
        // the four opaque JPGs. So in dark mode `invert` does two useful jobs
        // at once: it turns the light ground near-black, where it disappears
        // into the page, and it turns the mark white. Grayscale first stops
        // inversion shifting brand hues to their complements.
        //
        // Do not un-invert on hover. It flashes the original white tile.
          className="h-10 w-auto max-w-[140px] object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 dark:invert"
        />
      </a>
    </li>
  );
}

export default function PartnerWall(): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8">
      <div className="relative border-y border-border py-10">
        <CornerPlus className="-left-1.5 -top-1.5" />
        <CornerPlus className="-right-1.5 -top-1.5" />
        <CornerPlus className="-bottom-1.5 -left-1.5" />
        <CornerPlus className="-bottom-1.5 -right-1.5" />

        <div className="mb-8 text-center">
          <Kicker>Product partners</Kicker>
        </div>

        <ul className="grid grid-cols-2 items-center gap-x-4 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
          {PARTNERS.map((p) => (
            <PartnerLogo key={p.name} {...p} />
          ))}
        </ul>
      </div>
    </section>
  );
}
