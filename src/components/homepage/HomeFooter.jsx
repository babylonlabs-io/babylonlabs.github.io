import React from 'react';
import Link from '@docusaurus/Link';
import { ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@site/src/components/tbv/routes';

/**
 * Site footer.
 *
 * Layout follows the large-format pattern: the navigation in columns, then
 * an oversized wordmark over the legal line.
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

/* The bottom row, left to right. Icons were dropped in favour of text: three
   marks in the bottom-right collided with the assistant's floating button,
   and a wordless glyph is a worse target than its own name. */
const LEGAL = [
  { label: 'Privacy Policy', href: 'https://babylonlabs.io/privacy-policy' },
  { label: 'Terms of Service', href: 'https://babylonlabs.io/terms' },
  { label: 'GitHub', href: 'https://github.com/babylonlabs-io' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/babylon-labs-official/',
  },
  { label: 'X', href: 'https://x.com/babylonlabs_io' },
];

const APP_URL = 'https://btc-vaults.testnet.babylonlabs.io/';

function FooterLink({ label, to, href }) {
  return (
    <li>
      <Link
        to={to}
        href={href}
        className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground hover:no-underline"
      >
        {label}
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-10 pt-16 lg:pt-20">
        {/* No statement here. The footer's own top border already separates
            it from the page, so the rule and the top margin that used to sit
            under the headline go with it rather than leaving a gap. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Lock native BTC on Bitcoin and borrow against it on Ethereum. The
              public testnet is live.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex h-10 items-center gap-2 bg-accent px-5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 hover:no-underline"
              >
                Launch testnet
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                to={ROUTES.quickstart}
                className="focus-ring inline-flex h-10 items-center gap-2 border border-border px-5 text-sm font-medium text-foreground transition-colors hover:border-muted-foreground hover:no-underline"
              >
                Read the quickstart
              </Link>
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4"
          >
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 font-code text-[11px] uppercase tracking-[0.18em] text-foreground">
                  {col.title}
                </h3>
                <ul className="flex list-none flex-col gap-2.5 p-0">
                  {col.links.map((l) => (
                    <FooterLink key={l.label} {...l} />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* The wordmark is set in type rather than placed as artwork. The
            SVG had to be sized large to read as a sign-off and then dominated
            the page; as text it scales with the layout, stays crisp at any
            DPR, and is selectable and searchable. */}
        <div className="mt-16 border-t border-border pt-10">
          <p
            className="mb-8 font-display text-5xl font-bold leading-none tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl"
            aria-label="Babylon Docs"
          >
            babylon<span className="text-muted-foreground"> docs</span>
          </p>

          {/* One dot-separated line: copyright, company, legal, then the
              accounts. All text, so every target carries its own name. */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span>
              &copy; {new Date().getFullYear()}{' '}
              <Link
                href="https://babylonlabs.io"
                className="text-inherit transition-colors duration-200 hover:text-foreground hover:underline"
              >
                Babylon Labs
              </Link>
            </span>
            {LEGAL.map((item) => (
              <React.Fragment key={item.label}>
                <span aria-hidden="true">&bull;</span>
                <Link
                  href={item.href}
                  className="text-inherit transition-colors duration-200 hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
