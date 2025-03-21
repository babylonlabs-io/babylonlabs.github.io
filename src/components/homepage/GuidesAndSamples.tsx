import React from 'react';
import Link from '@docusaurus/Link';
import {
  AppsAddInRegular,
  ArrowRightFilled,
  DocumentRegular,
  OpenRegular,
  RecordRegular,
  VideoRegular,
} from '@fluentui/react-icons';
import clsx from 'clsx';
import { ChevronRight, GitHub } from 'react-feather';

interface Guide {
  title: string;
  icon: any;
  text: string;
  link: string;
}

const guides: Guide[] = [
  {
    title: 'Babylon Chain Basics',
    icon: ArrowRightFilled,
    text: 'Learn about the Babylon Chain architecture and how it works.',
    link: '/developers/babylon_genesis_chain',
  },
  {
    title: 'Babylon Staking Script',
    icon: VideoRegular,
    text: "Learn Babylon's core native BTC staking script technology.",
    link: '/guides/specifications/bitcoin_staking_scripts',
  },
  {
    title: 'Babylon Smart Contracts',
    icon: OpenRegular,
    text: 'The CosmWASM contracts that are deployed on the Babylon Chain.',
    link: '/developers/dapps/smart_contract_deployment',
  },
  {
    title: 'Staking Transactions Specifications',
    icon: AppsAddInRegular,
    text: "Learn details of the staking transactions that are executed on the Bitcoin Chain.",
    link: '/guides/specifications/staking_transactions',
  },
];

interface Sample {
  title: string;
  platform?: string;
  source?: string;
  blog?: string;
  demo?: string;
}

const samples: Sample[] = [
  {
    title: 'PoS Integrations Guides',
    platform: 'Cosmos',
    source:
      'https://github.com/babylonlabs-io/babylon-integration-deployment/tree/main/deployments/btc-staking-integration-bitcoind',
    blog: 'https://babylonlabs.io/blog/babylon-bitcoin-security-for-cosmos-and-beyond',
    demo: '/developers/bsns',
  },
  {
    title: 'L2 Integrations Guides',
    platform: 'Optimism',
    blog: '/developers/bsns/op_stack_chains',
    source: 'https://babylonlabs.io/blog/forkless-rollups-with-bitcoin-staking',
    demo: '/developers/bsns/op_stack_chains',
  },
  {
    title: 'CosmWasm Contract Deployment Guides',
    platform: 'Cosmos',
    blog: '/developers/dapps/smart_contract_deployment',
    source: 'https://github.com/babylonlabs-io/storage-contract',
    demo: '/developers/dapps/smart_contract_deployment',
  },
  {
    title: 'Wallet Integrations Guides',
    platform: 'Wallets',
    blog: '/developers/wallet_integration',
    source:
      'https://github.com/babylonlabs-io/networks/blob/main/bbn-test-5/integration/wallet/babylon-wallet.md',
    demo: '/developers/wallet_integration',
  },
];

function Guide({ title, text, icon: Icon, link }: (typeof guides)[0]) {
  return (
    <Link
      to={link}
      className="group flex cursor-pointer items-start gap-2 rounded-lg border-2 border-transparent p-3 text-inherit transition-colors hover:border-primary hover:text-primary"
    >
      <Icon className="h-6 w-6" />

      <div className="flex flex-col">
        <h4 className="mb-1 font-semibold">{title}</h4>
        <p className="mb-0 text-sm text-text-400">{text}</p>
      </div>

      <ChevronRight className="ml-auto h-5 w-5 self-center opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

function Sample({ title, platform, blog, source, demo }: Sample) {
  return (
    <div className="group flex cursor-pointer items-center justify-between rounded-lg border-2 border-transparent p-3 text-text-400/60 transition-colors hover:border-primary hover:text-primary">
      <div className="flex flex-col">
        <h4 className="mb-1 text-black group-hover:text-primary dark:text-white">
          {title}
        </h4>
        <div className="text-sm text-text-400">{platform}</div>
      </div>

      <div className="flex items-center gap-2.5">
        {blog && (
          <Link to={blog} className="text-inherit">
            <DocumentRegular className="h-5 w-5" />
          </Link>
        )}

        {demo && (
          <Link to={demo} className="text-inherit">
            <OpenRegular className="h-5 w-5" />
          </Link>
        )}

        {source && (
          <Link
            to={source}
            className="flex items-center gap-1 rounded-lg px-3 py-1 text-inherit transition-colors group-hover:bg-primary group-hover:text-white"
          >
            <GitHub className="h-4 w-4" />
            <span className="font-semibold">Clone</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default function GuidesAndSamples() {
  return (
    <section className="no-underline-links mx-auto my-40 flex w-full max-w-5xl flex-col gap-10 p-4 py-0 md:flex-row md:gap-0">
      <div className="flex-1">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="m-0">Key Concepts</h3>

          <Link to="/guides" className="font-jakarta text-sm font-semibold">
            More <ArrowRightFilled className="ml-1" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {guides.map((guide) => (
            <Guide {...guide} key={guide.title} />
          ))}
        </div>
      </div>

      <div
        className={clsx(
          'mx-8 block flex-shrink-0 bg-gradient-to-b from-transparent via-secondary-700 to-transparent',
          'hidden w-px md:block'
        )}
      />

      <div className="w-full md:max-w-sm">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="m-0">Resources & Guides</h3>

          <Link to="/guides" className="font-jakarta text-sm font-semibold">
            More <ArrowRightFilled className="ml-1" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {samples.map((sample) => (
            <Sample {...sample} key={sample.title} />
          ))}
        </div>
      </div>
    </section>
  );
}
