import {
  DiversityRegular,
  ShieldCheckmarkRegular,
  WalletCreditCardRegular,
} from '@fluentui/react-icons';

/**
 * Landing page content.
 *
 * These lists previously lived inside homepage/HeroSection and
 * homepage/GuidesAndSamples, whose own components stopped rendering when the
 * launch sections replaced them. Only the exported data was still reachable,
 * so two files of dead template were being kept alive by one import each.
 * The data lives here and those files are gone.
 *
 * Data only — no components — so a copy change never risks a rendering
 * regression, and the sections stay the single place that decides layout.
 */

export type Product = {
  title: string;
  link: string;
  icon: any;
  text: string;
};

/** The docs entry point shown on the landing page. */
export const PRODUCTS: Product[] = [
  {
    title: 'TBV Testnet docs',
    link: '/trustless-bitcoin-vault/start-here/what-is-tbv/',
    icon: DiversityRegular,
    text: 'Start with the open Testnet documentation for Babylon Trustless Bitcoin Vaults and the Aave v4 lending integration.',
  },
];

export type Guide = {
  title: string;
  icon: any;
  text: string;
  link: string;
};

export const guides: Guide[] = [
  {
    title: 'Trustless Bitcoin Vaults',
    icon: ShieldCheckmarkRegular,
    text: 'Native Bitcoin collateral for Ethereum DeFi, with BTC remaining locked on Bitcoin.',
    link: '/trustless-bitcoin-vault/start-here/what-is-tbv/',
  },
  {
    title: 'Bitcoin Staking',
    icon: WalletCreditCardRegular,
    text: 'Native BTC staking docs, research papers, and staking security reports.',
    link: '/guides/overview/bitcoin_staking/',
  },
];

export type Sample = {
  title: string;
  platform?: string;
  source?: string;
  demo?: string;
};

export const samples: Sample[] = [
  {
    title: 'Babylon Genesis',
    platform: 'Chain basics, governance, developers, and operators',
    demo: '/guides/overview/babylon_genesis/',
  },
  {
    title: 'API reference',
    platform: 'Staking API, Babylon gRPC, and CometBFT',
    demo: '/api/staking-api/babylon-staking-api/',
  },
];
