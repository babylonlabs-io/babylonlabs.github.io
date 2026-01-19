import React from 'react';
import Link from '@docusaurus/Link';
import {
  WalletCreditCardRegular,
  DiversityRegular,
  TetrisAppRegular,
  DocumentChevronDoubleRegular,
} from '@fluentui/react-icons';
import clsx from 'clsx';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

const PRODUCTS = [
  {
    title: 'Trustless Bitcoin Vault',
    link: '/guides/overview/bitcoin-vault',
    icon: DiversityRegular,
    lightImage: 'img/landing-page/hero/bsn_developers.png',
    darkImage: 'img/landing-page/hero/bsn_developers_dark.png',
    text: 'Learn about Trustless Bitcoin Vault - connecting Bitcoin state to external smart contracts (Ethereum).',
  },
  {
    title: 'Become Operators',
    link: '/operators',
    icon: TetrisAppRegular,
    lightImage: 'img/landing-page/hero/infra_providers.png',
    darkImage: 'img/landing-page/hero/infra_providers_dark.png',
    text: 'The operators that provide the data validation infrastructure for the Babylon network.',
  },
  {
    title: 'Stake BTC',
    link: '/stakers/btc_stakers',
    icon: WalletCreditCardRegular,
    lightImage: 'img/landing-page/hero/btc_stakers.png',
    darkImage: 'img/landing-page/hero/btc_stakers_dark.png',
    text: 'BTC holders that delegate their BTC stake to Babylon for rewards.',
  },
  {
    title: 'Stake BABY',
    link: '/stakers/baby_stakers',
    icon: WalletCreditCardRegular,
    lightImage: 'img/landing-page/hero/btc_stakers.png',
    darkImage: 'img/landing-page/hero/btc_stakers_dark.png',
    text: 'BABY holders can delegate their token to Babylon Genesis chain to participate in governance.',
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
          Make your bitcoin productive
          </h2>
          <p className="max-w-xl text-center text-text-400">
            At Babylon Labs, we're enabling developers to build Bitcoin-powered economies with trustless protocols.
          </p>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-wrap justify-center gap-6 px-4">
        {processedProducts.map((product) => (
          <HeroProduct {...product} key={product.title} />
        ))}
      </section>
    </div>
  );
}
