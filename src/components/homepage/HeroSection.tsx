import React from 'react';
import Link from '@docusaurus/Link';
import {
  DiversityRegular,
  DocumentChevronDoubleRegular,
  RocketRegular,
} from '@fluentui/react-icons';
import clsx from 'clsx';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import HeroSearch from './HeroSearch';

const PRODUCTS = [
  {
    title: 'TBV Testnet docs',
    link: '/trustless-bitcoin-vault/start-here/what-is-tbv/',
    icon: DiversityRegular,
    lightImage: 'img/landing-page/hero/bsn_developers.png',
    darkImage: 'img/landing-page/hero/bsn_developers_dark.png',
    text: 'Start with the open Testnet documentation for Babylon Trustless Bitcoin Vault and the Aave v4 lending integration.',
  },
  {
    title: 'Create a vault',
    link: '/trustless-bitcoin-vault/use-for-lending/create-a-vault',
    icon: RocketRegular,
    lightImage: 'img/landing-page/hero/infra_providers.png',
    darkImage: 'img/landing-page/hero/infra_providers_dark.png',
    text: 'Lock signet BTC on Bitcoin, activate the vault, and have vaultBTC supplied automatically as collateral.',
  },
  {
    title: 'Borrow and redeem',
    link: '/trustless-bitcoin-vault/use-for-lending/quickstart',
    icon: DocumentChevronDoubleRegular,
    lightImage: 'img/landing-page/hero/btc_stakers.png',
    darkImage: 'img/landing-page/hero/btc_stakers_dark.png',
    text: 'Walk through peg-in, borrow, repay, withdraw, and Bitcoin redemption end to end.',
  },
];

function HeroProduct({
  link,
  title,
  icon: Icon,
  text
}: 
(typeof PRODUCTS)[0]) {
  return (
    <Link
      to={link}
      style={{
        borderWidth: '1px',
      }}
      className={clsx(
        'group cursor-pointer overflow-clip rounded-md from-primary/30 via-transparent to-transparent text-black transition-all hover:bg-gradient-to-tr hover:text-primary hover:no-underline dark:text-white',
        'w-[90vw] border-secondary-700 hover:!border-primary dark:border-secondary-800 sm:w-[440px]'
      )}
    >
      <div className="p-6">
        <h3 className="mb-1.5 flex items-center gap-3 font-jakarta group-hover:text-primary">
          <Icon className="h-7 w-7" />
          <div>{title}</div>
        </h3>
        <p className="mb-0 text-sm text-zinc-700 dark:text-zinc-400">{text}</p>
      </div>
    </Link>
  );
}

export default function HeroSection() {
  const { withBaseUrl } = useBaseUrlUtils();

  const processedProducts = PRODUCTS.map((product) => ({
    ...product,
    link: withBaseUrl(product.link),
  }));

  return (
    <div className="noise-bg pb-14">
      <section className="no-underline-links px-4 pt-16 lg:py-0">
        <div className="flex flex-col items-center justify-between py-14">
          <h2 className="mb-4 font-jakarta text-5xl font-bold">
            Trustless Bitcoin Vault
          </h2>
          <p className="max-w-xl text-center text-text-400">
            Use native Bitcoin as collateral in Ethereum DeFi without bridges,
            wrapped custody, or pooled BTC. The open Testnet docs are the main
            entry point for creating a vault, borrowing on Aave v4, and
            redeeming back to Bitcoin.
          </p>
        </div>
      </section>

      <section className="px-4">
        <HeroSearch />
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-6 px-4">
        {processedProducts.map((product) => (
          <HeroProduct {...product} key={product.title} />
        ))}
      </section>
    </div>
  );
}
