import React from 'react';
import Link from '@docusaurus/Link';
import { Discord, Linkedin } from '@styled-icons/boxicons-logos';
import { XIcon } from '@site/src/icons';

/**
 * Community.
 *
 * The design review asked for buttons that are more intuitive and that carry
 * icons, so each destination is now a filled control with its own mark rather
 * than an outlined word. Filled grey, per the same review: outlined styles are
 * out, and orange is reserved for primary calls to action, which these are
 * not.
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
    <section className="no-underline-links bg-background">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 py-20 text-center sm:px-8 lg:py-24">
        <h2 className="mb-3 font-display text-3xl font-normal tracking-tight text-foreground sm:text-4xl">
          Join the community
        </h2>
        <p className="mb-10 max-w-xl text-base leading-relaxed text-muted-foreground">
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
