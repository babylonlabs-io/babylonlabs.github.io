require('dotenv').config();
const { themes } = require('prism-react-renderer');
const { languageTabs } = require('./static/languageTabs.cjs');
const BRANCH_NAME = process.env.BRANCH_NAME;
const ALGOLIA_INDEX_NAME = BRANCH_NAME === 'main' ? 'doc_babylonlabs_io' : 'doc_dev_babylonlabs_io';
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
        
          cometBFT:{
            specPath: 'static/swagger/comet-bft-rpc-openapi3.yaml'
          ,outputDir: 'docs/api/comet-bft',
          sidebarOptions: {
            groupPathsBy: 'tag',
            categoryLinkSource: 'tag',
          },
          hideSendButton: false,
          showSchemas: false,

          }
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
          to: '/guides/overview/babylon_genesis/architecture/vigilantes/',
        },
        // Governance redirects
        {
          from: '/guides/governance/',
          to: '/guides/overview/babylon_genesis/governance/',
        },
        {
          from: '/guides/governance/drafting_proposals/',
          to: '/guides/overview/babylon_genesis/governance/drafting_proposals/',
        },
        {
          from: '/guides/governance/reviewing_proposals/',
          to: '/guides/overview/babylon_genesis/governance/reviewing_proposals/',
        },
        {
          from: '/guides/governance/submit_proposals/',
          to: '/guides/overview/babylon_genesis/governance/submit_proposals/',
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
          to: '/guides/overview/babylon_genesis/networks/mainnet/',
        },
        {
          from: '/guides/networks/babylon-genesis/',
          to: '/guides/overview/babylon_genesis/networks/mainnet/',
        },
        {
          from: '/guides/networks/babylon-genesis/mainnet/',
          to: '/guides/overview/babylon_genesis/networks/mainnet/',
        },
        {
          from: '/guides/networks/babylon-genesis/testnet/',
          to: '/guides/overview/babylon_genesis/networks/testnet/',
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
      ],
    },
  ],
  tailwindPlugin,
  webpackReactProvider,
  ...docs_plugins,
  ...openapiPlugins
];

// @ts-ignore
/** @type {import('@docusaurus/types').Config} */
const config = {
  ...meta,
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
          customCss: [
            require.resolve('./src/css/custom.css')
          ],
        },
        sitemap: {
          ignorePatterns: ['**/tags/**', '/api/*'],
        },
        gtag: process.env.TRACKING_ID ? {
          trackingID: process.env.TRACKING_ID,
          anonymizeIP: true,
        } : false,
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
            label: 'Overview',
            to: '/guides/overview/',
            className: 'guides-top-header',
          },
          {
            label: 'Stakers',
            to: '/stakers/',
            className: 'stakers-top-header',
          },
          {
            label: 'Developers',
            to: '/developers/',
            className: 'developers-top-header',
          },
          {
            label: 'Operators',
            to: '/operators/',
            className: 'operators-top-header',
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
              {label: 'CometBFT',
                to:'api/comet-bft/babylon-grpc-api-docs'
              }
            ],
          },
          {
            label: 'Support',
            to: 'https://discord.com/invite/babylonglobal',
          },
          {
            label: 'Ask AI',
            to: '#',
            className: 'header-ai-chat-link',
            position: 'right',
          },
          {
            href: 'https://discord.com/invite/babylonglobal',
            position: 'right',
            className: 'header-discord-link',
          },
          {
            href: 'https://github.com/babylonlabs-io/',
            position: 'right',
            className: 'header-github-link',
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
  customFields: {
    apiBaseUrl: process.env.API_BASE_URL || '',
  },
};
module.exports = config;
// This documentation website is developed and maintained by Kevin @kkkk666.