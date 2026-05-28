require('dotenv').config();
const { themes } = require('prism-react-renderer');
const { languageTabs } = require('./static/languageTabs.cjs');
const BRANCH_NAME = process.env.BRANCH_NAME;
const ALGOLIA_INDEX_NAME =
  BRANCH_NAME === 'main' ? 'doc_babylonlabs_io' : 'doc_dev_babylonlabs_io';
const ENABLE_GTAG =
  process.env.NODE_ENV === 'production' && Boolean(process.env.TRACKING_ID);
const ENABLE_LOCAL_GTAG_STUB = process.env.NODE_ENV !== 'production';
const code_themes = {
  light: themes.github,
  dark: themes.dracula,
};

/** @type {import('@docusaurus/types').Config} */
const meta = {
  title: 'Babylon Docs',
  tagline:
    'Where developers bring programmable economnic security to the decentralized world.',
  url: 'https://docs.babylonlabs.io',
  baseUrl: '/',
  favicon: '/favicon.ico',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
};

/** @type {import('@docusaurus/plugin-content-docs').Options[]} */
const docs = [];

const openapiPlugins = [
  [
    'docusaurus-plugin-openapi-docs',
    {
      id: 'apiDocs',
      docsPluginId: 'classic',
      config: {
        stakingApi: {
          specPath: 'static/swagger/babylon-staking-api-openapi3.yaml',
          outputDir: 'docs/api/staking-api',
          sidebarOptions: {
            groupPathsBy: 'tag',
            categoryLinkSource: 'tag',
          },
          hideSendButton: false,
          showSchemas: true,
        },
        babylonGrpc: {
          specPath: 'static/swagger/babylon-grpc-openapi3.yaml',
          outputDir: 'docs/api/babylon-gRPC',
          sidebarOptions: {
            groupPathsBy: 'tag',
            categoryLinkSource: 'tag',
          },
          hideSendButton: false,
          showSchemas: false,
        },

        cometBFT: {
          specPath: 'static/swagger/comet-bft-rpc-openapi3.yaml',
          outputDir: 'docs/api/comet-bft',
          sidebarOptions: {
            groupPathsBy: 'tag',
            categoryLinkSource: 'tag',
          },
          hideSendButton: false,
          showSchemas: false,
        },
      },
    },
  ],
];

/** @type {import('@docusaurus/plugin-content-docs').Options} */
const defaultSettings = {
  breadcrumbs: true,
  showLastUpdateTime: true,
  sidebarCollapsible: true,
  remarkPlugins: [
    [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
  ],
  sidebarPath: require.resolve('./sidebars-default.js'),
};

/**
 * Create a section
 * @param {import('@docusaurus/plugin-content-docs').Options} options
 */
function create_doc_plugin({
  sidebarPath = require.resolve('./sidebars-default.js'),
  ...options
}) {
  return [
    '@docusaurus/plugin-content-docs',
    /** @type {import('@docusaurus/plugin-content-docs').Options} */
    ({
      ...defaultSettings,
      sidebarPath,
      ...options,
    }),
  ];
}

const tailwindPlugin = require('./plugins/tailwind-plugin.cjs');
const webpackReactProvider = require('./plugins/webpack-react-provider.cjs');
const docs_plugins = docs.map((doc) => create_doc_plugin(doc));
const plugins = [
  [
    '@docusaurus/plugin-client-redirects',
    {
      redirects: [
        {
          from: '/guides/baby_stakers/baby_staking_tools/',
          to: '/stakers/baby_stakers/',
        },
        // Old Bitcoin Vault overview page → consolidated Trustless Bitcoin Vault section
        {
          from: '/guides/overview/bitcoin-vault/',
          to: '/trustless-bitcoin-vault/',
        },
        // Staking research/security moved under Bitcoin Staking
        {
          from: '/guides/research/',
          to: '/guides/overview/bitcoin_staking/research/',
        },
        {
          from: '/guides/research/babe_verification/',
          to: '/trustless-bitcoin-vault/research/babe_verification/',
        },
        {
          from: '/guides/research/btc_staking_litepaper/',
          to: '/guides/overview/bitcoin_staking/research/btc_staking_litepaper/',
        },
        {
          from: '/guides/research/btc_timestamping/',
          to: '/guides/overview/bitcoin_staking/research/btc_timestamping/',
        },
        {
          from: '/guides/research/btc_trustless_vault/',
          to: '/trustless-bitcoin-vault/research/btc_trustless_vault/',
        },
        {
          from: '/guides/overview/bitcoin_staking/research/babe_verification/',
          to: '/trustless-bitcoin-vault/research/babe_verification/',
        },
        {
          from: '/guides/overview/bitcoin_staking/research/btc_trustless_vault/',
          to: '/trustless-bitcoin-vault/research/btc_trustless_vault/',
        },
        {
          from: '/guides/security/',
          to: '/guides/overview/bitcoin_staking/security/',
        },
        {
          from: '/guides/security/audit_reports/',
          to: '/guides/overview/bitcoin_staking/security/audit_reports/',
        },
        {
          from: '/guides/security/bug_bounties/',
          to: '/guides/overview/bitcoin_staking/security/bug_bounties/',
        },
        // Architecture redirects (moved under babylon_genesis)
        {
          from: '/guides/architecture/',
          to: '/guides/overview/babylon_genesis/architecture/',
        },
        {
          from: '/guides/architecture/btc_staking_program/',
          to: '/guides/overview/babylon_genesis/architecture/btc_staking_program/',
        },
        {
          from: '/guides/architecture/vigilantes/',
          to: '/guides/overview/babylon_genesis/architecture/btc_staking_program/vigilantes/',
        },
        // Vigilantes moved under btc_staking_program
        {
          from: '/guides/overview/babylon_genesis/architecture/vigilantes/',
          to: '/guides/overview/babylon_genesis/architecture/btc_staking_program/vigilantes/',
        },
        // Networks removed
        {
          from: '/guides/overview/babylon_genesis/networks/mainnet/',
          to: '/guides/overview/babylon_genesis/',
        },
        {
          from: '/guides/overview/babylon_genesis/networks/testnet/',
          to: '/guides/overview/babylon_genesis/',
        },
        {
          from: '/guides/overview/babylon_genesis/networks/',
          to: '/guides/overview/babylon_genesis/',
        },
        // Governance proposals flattened
        {
          from: '/guides/overview/babylon_genesis/governance/reviewing_proposals/',
          to: '/guides/overview/babylon_genesis/governance/proposal-review-guide/',
        },
        {
          from: '/guides/overview/babylon_genesis/governance/drafting_proposals/',
          to: '/guides/overview/babylon_genesis/governance/drafting-proposals/',
        },
        {
          from: '/guides/overview/babylon_genesis/governance/submit_proposals/',
          to: '/guides/overview/babylon_genesis/governance/submit_proposals_overview/',
        },
        // Governance redirects
        {
          from: '/guides/governance/',
          to: '/guides/overview/babylon_genesis/governance/',
        },
        {
          from: '/guides/governance/drafting_proposals/',
          to: '/guides/overview/babylon_genesis/governance/drafting-proposals/',
        },
        {
          from: '/guides/governance/reviewing_proposals/',
          to: '/guides/overview/babylon_genesis/governance/proposal-review-guide/',
        },
        {
          from: '/guides/governance/submit_proposals/',
          to: '/guides/overview/babylon_genesis/governance/submit_proposals_overview/',
        },
        // Specifications redirects
        {
          from: '/guides/specifications/',
          to: '/guides/overview/babylon_genesis/specifications/bitcoin_staking_scripts/',
        },
        {
          from: '/guides/specifications/bitcoin_staking_scripts/',
          to: '/guides/overview/babylon_genesis/specifications/bitcoin_staking_scripts/',
        },
        {
          from: '/guides/specifications/staking_transactions/',
          to: '/guides/overview/babylon_genesis/specifications/staking_transactions/',
        },
        // Network redirects (Babylon Genesis)
        {
          from: '/guides/networks/',
          to: '/guides/overview/babylon_genesis/',
        },
        {
          from: '/guides/networks/babylon-genesis/',
          to: '/guides/overview/babylon_genesis/',
        },
        {
          from: '/guides/networks/babylon-genesis/mainnet/',
          to: '/guides/overview/babylon_genesis/',
        },
        {
          from: '/guides/networks/babylon-genesis/testnet/',
          to: '/guides/overview/babylon_genesis/',
        },
        // Network redirects (Bitcoin -> developers)
        {
          from: '/guides/networks/bitcoin/',
          to: '/developers/bitcoin_staking/networks/',
        },
        {
          from: '/guides/networks/bitcoin/mainnet/',
          to: '/developers/bitcoin_staking/networks/mainnet/',
        },
        {
          from: '/guides/networks/bitcoin/signet/',
          to: '/developers/bitcoin_staking/networks/signet/',
        },
        // Developer section reorganization
        {
          from: '/developers/wallet_integration/',
          to: '/developers/bitcoin_staking/wallet_integration/',
        },
        {
          from: '/developers/wallet_integration/babylon_wallet_integration/',
          to: '/developers/bitcoin_staking/wallet_integration/babylon_wallet_integration/',
        },
        {
          from: '/developers/wallet_integration/bitcoin_wallet_integration/',
          to: '/developers/bitcoin_staking/wallet_integration/bitcoin_wallet_integration/',
        },
        {
          from: '/developers/staking_backend/',
          to: '/developers/bitcoin_staking/staking_backend/',
        },
        {
          from: '/developers/wallet_setup/',
          to: '/developers/babylon_genesis_chain/wallet_setup/',
        },
        {
          from: '/developers/dapps/',
          to: '/developers/babylon_genesis_chain/dapps/',
        },
        // BSN content removed - redirect to overview
        {
          from: '/guides/overview/bsns/',
          to: '/guides/overview/',
        },
        {
          from: '/guides/architecture/consumer_zone_programs/',
          to: '/guides/overview/babylon_genesis/architecture/',
        },
        {
          from: '/guides/architecture/babylon_genesis_modules/',
          to: '/guides/overview/babylon_genesis/architecture/',
        },
        // Retired top-nav redirects
        {
          from: '/stakers/',
          to: '/guides/overview/',
        },
        {
          from: '/developers/',
          to: '/guides/overview/',
        },
        {
          from: '/operators/',
          to: '/guides/overview/',
        },
      ],
    },
  ],
  tailwindPlugin,
  webpackReactProvider,
  ...docs_plugins,
  ...openapiPlugins,
];

// @ts-ignore
/** @type {import('@docusaurus/types').Config} */
const config = {
  ...meta,
  scripts: ENABLE_LOCAL_GTAG_STUB ? [{ src: '/local-gtag-stub.js' }] : [],
  plugins,

  trailingSlash: true,
  themes: [
    '@docusaurus/theme-live-codeblock',
    '@docusaurus/theme-mermaid',
    'docusaurus-theme-openapi-docs',
  ],

  markdown: {
    mermaid: true,
  },

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          ...defaultSettings,
          editUrl:
            'https://github.com/babylonlabs-io/babylonlabs.github.io/tree/main/',
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          docItemComponent: '@theme/ApiItem',
        },
        blog: false,
        theme: {
          customCss: [require.resolve('./src/css/custom.css')],
        },
        sitemap: {
          ignorePatterns: ['**/tags/**', '/api/*'],
        },
        gtag: ENABLE_GTAG
          ? {
              trackingID: process.env.TRACKING_ID,
              anonymizeIP: true,
            }
          : false,
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: '/logo/babylon.svg',
      colorMode: {
        defaultMode: 'dark',
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      navbar: {
        logo: {
          href: '/',
          src: '/logo/light.svg',
          srcDark: '/logo/dark.svg',
          alt: 'Babylon Documentation | Babylon Docs',
          height: '40px',
          width: '101px',
        },
        items: [
          {
            label: 'Trustless Bitcoin Vault',
            to: '/trustless-bitcoin-vault/',
            className: 'trustless-bitcoin-vault-top-header',
          },
          {
            label: 'Bitcoin Staking',
            to: '/guides/overview/bitcoin_staking/',
            className: 'guides-top-header',
          },
          {
            label: 'API',
            items: [
              {
                label: 'Staking API',
                to: '/api/staking-api/babylon-staking-api',
              },
              {
                label: 'Babylon gRPC',
                to: '/api/babylon-gRPC/babylon-grpc-api-docs',
              },
              {
                label: 'CometBFT',
                to: '/api/comet-bft/babylon-grpc-api-docs',
              },
            ],
          },
          {
            label: 'Support',
            to: 'https://discord.com/invite/babylonglobal',
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      footer: {
        logo: {
          href: '/',
          src: '/logo/light.svg',
          srcDark: '/logo/dark.svg',
          alt: 'Babylon Documentation | Babylon Docs',
          height: '36px',
        },
        links: [
          {
            title: 'Product',
            items: [
              {
                label: 'Documentation',
                href: 'https://docs.babylonlabs.io',
              },
              {
                label: 'Developer Events',
                href: 'https://linktr.ee/buildonbabylon',
              },
              {
                label: 'Project Showcase',
                href: 'https://dorahacks.io/projects/babylon-labs',
              },
            ],
          },
        ],
        copyright: 'Copyright © Babylon Labs since 2023. All rights reserved.',
      },
      prism: {
        theme: code_themes.light,
        darkTheme: code_themes.dark,
        additionalLanguages: ['rust', 'swift', 'objectivec', 'json', 'bash'],
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: { start: 'highlight-start', end: 'highlight-end' },
          },
          {
            className: 'code-block-error-line',
            line: 'highlight-next-line-error',
          },
        ],
      },
      languageTabs: [...languageTabs],
      algolia: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY_READONLY,
        indexName: ALGOLIA_INDEX_NAME,
        contextualSearch: true,
        searchParameters: {},
        contextualSearchFilters: [],
      },
      search: {
        algolia: {
          contextualSearch: true,
          searchParameters: {
            facetFilters: ['language:en'],
          },
        },
      },
    }),

  // Conditionally enable custom webpack config only if SWC is available
  ...(() => {
    try {
      require.resolve('swc-loader');
      require('@swc/core');
      return {
        webpack: {
          jsLoader: (isServer) => ({
            loader: require.resolve('swc-loader'),
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                target: 'es2017',
              },
              module: {
                type: isServer ? 'commonjs' : 'es6',
              },
            },
          }),
        },
      };
    } catch (e) {
      console.warn(
        'SWC not available, using Docusaurus default Babel loader:',
        e.message
      );
      return {}; // No custom webpack config, use Docusaurus defaults
    }
  })(),
  customFields: {
    apiBaseUrl: process.env.API_BASE_URL || '',
  },
};
module.exports = config;
// This documentation website is developed and maintained by Kevin @kkkk666.
