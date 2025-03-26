import React from 'react';
import Link from '@docusaurus/Link';
import {
  WalletCreditCardRegular,
  DiversityRegular,
  TetrisAppRegular,
  DocumentChevronDoubleRegular,
} from '@fluentui/react-icons';
import ThemedImage from '@theme/ThemedImage';
import clsx from 'clsx';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';

const PRODUCTS = [
  {
    title: 'Stake BTC',
    link: '/guides/btc_stakers',
    icon: WalletCreditCardRegular,
    lightImage: 'img/landing-page/hero/btc_stakers.png',
    darkImage: 'img/landing-page/hero/btc_stakers_dark.png',
    text: 'BTC holders that delegate their BTC stake to Bitcoin Secured Networks for rewards.',
  },
  {
    title: 'Become Operators',
    link: '/operators',
    icon: TetrisAppRegular,
    lightImage: 'img/landing-page/hero/infra_providers.png',
    darkImage: 'img/landing-page/hero/infra_providers_dark.png',
    text: 'The operators that provide the data validation infrastructure for Bitcoin Secured networks.',
  },
  {
    title: 'Build dApps',
    link: '/developers/dapps/',
    icon: DocumentChevronDoubleRegular,
    lightImage: 'img/landing-page/hero/dapp_developers.png',
    darkImage: 'img/landing-page/hero/dapp_developers_dark.png',
    text: 'Smart contracts developers that want to build Bitcoin secured decentralized applications.',
  },
  {
    title: 'Build BSNs',
    link: '/developers/bsns',
    icon: DiversityRegular,
    lightImage: 'img/landing-page/hero/bsn_developers.png',
    darkImage: 'img/landing-page/hero/bsn_developers_dark.png',
    text: 'Integrate economic security into your PoS blockchain, by incorporating Babylon\'s BTC staking protocol.',
  },
];

function HeroProduct({
  link,
  title,
  icon: Icon,
  text,
  lightImage,
  darkImage
}: 
(typeof PRODUCTS)[0]) {
  return (
    <Link
      to={link}
      style={{
        borderWidth: '1px',
      }}
      className={clsx(
        'group cursor-pointer overflow-clip rounded-3xl from-primary/30 via-transparent to-transparent text-black transition-all hover:bg-gradient-to-tr hover:text-primary hover:no-underline dark:text-white',
        'w-[90vw] border-secondary-700 bg-secondary-900 hover:!border-primary dark:border-secondary-800 sm:w-[440px]'
      )}
    >
      <div className="p-6 !pb-0">
        <h3 className="mb-1.5 flex items-center gap-3 font-jakarta group-hover:text-primary">
          <Icon className="h-7 w-7" />
          <div>{title}</div>
        </h3>
        <p className="mb-0 text-sm text-zinc-400">{text}</p>
      </div>
      {/* <ThemedImage
        sources={{
          light: lightImage,
          dark: darkImage,
        }}
        alt={title}
        className="mt-1 w-full transition-transform group-hover:scale-110"
      /> */}
    </Link>
  );
}

export default function HeroSection() {
  const { withBaseUrl } = useBaseUrlUtils();

  const processedProducts = PRODUCTS.map((product) => ({
    ...product,
    // lightImage: withBaseUrl(product.lightImage),
    // darkImage: withBaseUrl(product.darkImage),
    link: withBaseUrl(product.link),
  }));

  return (
    <div className="noise-bg pb-14">
      <section className="no-underline-links px-4 pt-16 lg:py-0">
        <div className="flex flex-col items-center justify-between py-14">
          <h2 className="mb-4 font-jakarta text-5xl font-bold">
          Make unbreakable chains & dApps
          </h2>
          <p className="max-w-xl text-center text-text-400">
            At Babylon Labs, we're building a more economically secured
            decentralized future. Learn concepts, create dApps and build Bitcoin Secured Networks.
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
