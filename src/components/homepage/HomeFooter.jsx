import React from 'react';
import Link from '@docusaurus/Link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Github, Linkedin } from '@styled-icons/boxicons-logos';
import { XIcon } from '@site/src/icons';
import { ROUTES } from '@site/src/components/tbv/routes';

/**
 * Site footer.
 *
 * Layout follows the large-format pattern: the navigation in columns, then
 * the wordmark, the legal line and the accounts.
 * Written from scratch — the arrangement is the only thing borrowed, and no
 * third-party component source is involved.
 *
 * The reference pairs the columns with a newsletter capture. There is no
 * mailing list behind this site, and a field that silently discards an
 * address is worse than no field, so that half carries the two things a
 * reader actually arrives to do instead: open the testnet, or read the docs.
 *
 * The routes come from tbv/routes so a rename fails the build rather than
 * shipping a dead footer link — `onBrokenLinks: 'throw'`.
 */

const COLUMNS = [
  {
    title: 'Documentation',
    links: [
      { label: 'What is TBV?', to: ROUTES.whatIsTbv },
      { label: 'Create a vault', to: ROUTES.createVault },
      { label: 'Borrow and repay', to: ROUTES.borrowRepay },
      { label: 'Withdraw and redeem', to: ROUTES.withdrawRedeem },
      { label: 'FAQ', to: ROUTES.faq },
    ],
  },
  {
    title: 'Protocol',
    links: [
      { label: 'How it works', to: ROUTES.howItWorks },
      { label: 'Safety and trust', to: ROUTES.safety },
      { label: 'Bitcoin Staking', to: ROUTES.bitcoinStaking },
      { label: 'Babylon Genesis', to: ROUTES.babylonGenesis },
      { label: 'API reference', to: ROUTES.apiReference },
    ],
  },
  {
    title: 'For AI agents',
    links: [
      { label: 'llms.txt', href: 'pathname:///llms.txt' },
      { label: 'llms-full.txt', href: 'pathname:///llms-full.txt' },
      { label: 'Research paper', to: ROUTES.research },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Babylon Labs', href: 'https://babylonlabs.io' },
      { label: 'GitHub', href: 'https://github.com/babylonlabs-io' },
      { label: 'Privacy Policy', href: 'https://babylonlabs.io/privacy-policy' },
      { label: 'Terms of Service', href: 'https://babylonlabs.io/terms' },
    ],
  },
];

/* The legal line: the two documents a reader may need, and nothing else. The
   accounts used to sit on this row as text; they now have their own row below
   it, so the line stays short enough to read as one sentence. */
const LEGAL = [
  { label: 'Privacy Policy', href: 'https://babylonlabs.io/privacy-policy' },
  { label: 'Terms of Service', href: 'https://babylonlabs.io/terms' },
];

/* The accounts, below the legal line and set as marks. Each still carries its
   own name for assistive technology and as a tooltip, which is what the
   earlier text-only row was protecting; the visible glyph is the trade. */
const SOCIAL = [
  { label: 'GitHub', href: 'https://github.com/babylonlabs-io', Icon: Github },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/babylon-labs-official/',
    Icon: Linkedin,
  },
  { label: 'X', href: 'https://x.com/babylonlabs_io', Icon: XIcon },
];

const APP_URL = 'https://btc-vaults.testnet.babylonlabs.io/';

function FooterLink({ label, to, href }) {
  return (
    <li>
      <Link
        to={to}
        href={href}
        className="text-sm text-white/75 transition-colors duration-200 hover:text-white hover:no-underline dark:text-muted-foreground"
      >
        {label}
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    // Navy in the light theme, the page ground with a hairline in the dark
    // (Figma 134:2428, 161:4).
    <footer className="bg-surface-navy text-white dark:border-t dark:border-border dark:bg-background">
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-10 pt-16 lg:pt-20">
        {/* No statement here. The footer's own top border already separates
            it from the page, so the rule and the top margin that used to sit
            under the headline go with it rather than leaving a gap. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <p className="mb-6 max-w-sm text-sm leading-[23px] text-white/75 dark:text-muted-foreground">
              Lock native BTC on Bitcoin and borrow against it on Ethereum. The
              public testnet is live.
            </p>
            <div className="flex flex-col items-start gap-3">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring tbv-btn tbv-btn-primary"
              >
                Launch testnet
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                to={ROUTES.quickstart}
                className="focus-ring tbv-btn tbv-btn-inverse"
              >
                Read the quickstart
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4"
          >
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-5 font-code text-[11px] font-normal uppercase tracking-[0.14em] text-accent">
                  {col.title}
                </h3>
                <ul className="flex list-none flex-col gap-[19px] p-0">
                  {col.links.map((l) => (
                    <FooterLink key={l.label} {...l} />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* The sign-off is set in type rather than placed as artwork. The
            artwork mark identifies the site in the header; repeating it here
            only says the same thing twice, and every font on this site is one
            family, so the wordmark earns its own voice through weight, size
            and tracking instead of a second face.

            Two tones, not two fonts: "Babylon" is the company and takes the
            foreground, "Docs" is what this particular site is and steps back.
            Kept to a heading's size — an oversized watermark was tried and
            read as decoration rather than identification. */}
        <div className="mt-16 border-t border-white/15 pt-10 dark:border-border">
          <p
            className="mb-8 font-display text-2xl font-normal leading-none sm:text-3xl"
            aria-label="Babylon Docs"
          >
            <span className="text-white">Babylon</span>
            <span className="text-white/60 dark:text-muted-foreground/80"> Docs</span>
          </p>

          {/* Copyright, company and the two legal documents, on one line. */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/75 dark:text-muted-foreground">
            <span>
              &copy; {new Date().getFullYear()}{' '}
              <Link
                href="https://babylonlabs.io"
                className="text-inherit transition-colors duration-200 hover:text-white hover:underline"
              >
                Babylon Labs
              </Link>
            </span>
            {LEGAL.map((item) => (
              <React.Fragment key={item.label}>
                <span aria-hidden="true">&bull;</span>
                <Link
                  href={item.href}
                  className="text-inherit transition-colors duration-200 hover:text-white hover:underline"
                >
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </div>

          {/* The accounts, on their own row beneath the legal line. The target
              is the full 40px control rather than the 20px glyph inside it, so
              the row stays usable on a touch screen. That padding also insets
              the first glyph by 10px, which read as a crooked row against the
              legal line above, hence the matching pull-back on the list. */}
          <ul className="-ml-2.5 mt-4 flex list-none flex-wrap items-center gap-1 p-0">
            {SOCIAL.map(({ label, href, Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  title={label}
                  aria-label={label}
                  className="focus-ring inline-flex h-10 w-10 items-center justify-center text-white/85 transition-colors duration-200 hover:text-white"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
