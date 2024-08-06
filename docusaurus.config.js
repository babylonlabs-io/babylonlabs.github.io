// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Babylon Blockchain',
  tagline: 'Unlocking 21 Million Bitcoin to Secure the Decentralized Economy',
  url: 'https://docs.babylonlabs.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon_black.png',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'babylonlabs-io', // Usually your GitHub org/user name.
  projectName: 'babylonlabs.github.io', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          includeCurrentVersion: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: '',
        hideOnScroll: true,
        logo: {
          alt: 'Babylon',
          srcDark: 'img/logo_white.svg',
          src: 'img/logo_black.svg',
        },
        items: [
          {
            type: 'doc',
            position: 'left',
            docId: 'introduction/overview',
            label: 'Docs',
          },
          {
            to: 'docs/developer-guides/grpcrestapi',
            position: 'left',
            label: 'API',
          },
          //{to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/babylonlabs-io',
            label: 'GitHub',
            position: 'right',
          },
          {
            href: 'https://babylonlabs.io/about',
            label: 'About',
            position: 'right',
          },
          {
            href: 'https://babylonlabs.io/contact',
            label: 'Contact',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Documentation',
                to: '/docs/introduction/overview',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/company/babylon-chain',
              },
              {
                label: 'Twitter',
                href: 'https://www.twitter.com/babylon_chain',
              },
              {
                label: 'Youtube',
                href: 'https://www.youtube.com/channel/UCmnied_wAVVa2ECVLQH2OLQ',
              }
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: 'https://babylonlabs.io/blog',
              },
            ],
          },
        ],
        
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
