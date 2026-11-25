import React from 'react';
import Link from '@docusaurus/Link';
import { Discord, Linkedin } from '@styled-icons/boxicons-logos';
import { XIcon } from '@site/src/icons';
import { ArrowUpRight } from 'lucide-react';

/**
 * Community.
 *
 * Each destination is an outlined control carrying its own mark and an
 * external-link arrow, per the docs redesign (Figma 134:2416). Orange stays
 * reserved for primary calls to action, which these are not.
 */

const CHANNELS = [
  {
    label: 'Discord',
    href: 'https://discord.com/invite/babylonglobal',
    Icon: Discord,
  },
  { label: 'Twitter / X', href: 'https://x.com/babylonlabs_io', Icon: XIcon },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/babylon-labs-official/',
    Icon: Linkedin,
  },
];

export default function CommunitySection() {
  return (
    <section className="no-underline-links border-b border-border bg-background dark:bg-contrast">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 py-20 text-center sm:px-8 lg:py-24">
        <h2 className="mb-3 font-display text-3xl font-normal tracking-[-0.01em] text-foreground sm:text-4xl">
          Join the community
        </h2>
        <p className="mb-7 max-w-xl text-base leading-[26px] text-muted-foreground">
          Engage with our ever-growing community to get the latest updates,
          product support, and more.
        </p>

        <div className="flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          {CHANNELS.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              className="focus-ring tbv-btn tbv-btn-secondary"
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {label}
              <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
