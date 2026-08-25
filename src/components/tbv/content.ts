import {
  DiversityRegular,
  DocumentChevronDoubleRegular,
  RocketRegular,
  ShieldCheckmarkRegular,
  WalletCreditCardRegular,
} from '@fluentui/react-icons';
import type { FluentIcon } from '@fluentui/react-icons';
import { ROUTES } from './routes';

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
  icon: FluentIcon;
  text: string;
};

/** The three entry points, in the order they appear on the landing page. */
export const PRODUCTS: Product[] = [
  {
    title: 'TBV Testnet docs',
    link: ROUTES.whatIsTbv,
    icon: DiversityRegular,
    text: 'Start with the open Testnet documentation for Babylon Trustless Bitcoin Vault and the Aave v4 lending integration.',
  },
  {
    title: 'Create a vault',
    link: ROUTES.createVault,
    icon: RocketRegular,
    text: 'Lock signet BTC on Bitcoin, activate the vault, and have it supplied automatically as collateral.',
  },
  {
    title: 'Borrow and redeem',
    link: ROUTES.quickstart,
    icon: DocumentChevronDoubleRegular,
    text: 'Walk through peg-in, borrow, repay, withdraw, and Bitcoin redemption end to end.',
  },
];

export type Guide = {
  title: string;
  icon: FluentIcon;
  text: string;
  link: string;
};

export const guides: Guide[] = [
  {
    title: 'Trustless Bitcoin Vault',
    icon: ShieldCheckmarkRegular,
    text: 'Native Bitcoin collateral for Ethereum DeFi, with BTC remaining locked on Bitcoin.',
    link: ROUTES.whatIsTbv,
  },
  {
    title: 'Bitcoin Staking',
    icon: WalletCreditCardRegular,
    text: 'Native BTC staking docs, research papers, and staking security reports.',
    link: ROUTES.bitcoinStaking,
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
    demo: ROUTES.babylonGenesis,
  },
  {
    title: 'API reference',
    platform: 'Staking API, Babylon gRPC, and CometBFT',
    demo: ROUTES.apiReference,
  },
];
