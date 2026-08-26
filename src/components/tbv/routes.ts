/**
 * Every documentation route the launch surfaces link to, in one place.
 *
 * Keep these correct. `docusaurus.config.js` sets `onBrokenLinks: 'throw'`,
 * so a wrong route fails the production build rather than shipping a 404.
 */
export const ROUTES = {
  // Trustless Bitcoin Vaults
  whatIsTbv: '/trustless-bitcoin-vault/start-here/what-is-tbv/',
  howItWorks: '/trustless-bitcoin-vault/start-here/how-it-works/',
  safety: '/trustless-bitcoin-vault/start-here/safety-and-trust-assumptions/',
  createVault: '/trustless-bitcoin-vault/use-for-lending/create-a-vault/',
  quickstart: '/trustless-bitcoin-vault/use-for-lending/quickstart/',
  borrowRepay: '/trustless-bitcoin-vault/use-for-lending/borrow-and-repay/',
  withdrawRedeem: '/trustless-bitcoin-vault/use-for-lending/withdraw-and-redeem/',
  liquidation: '/trustless-bitcoin-vault/use-for-lending/liquidation-risk/',
  faq: '/trustless-bitcoin-vault/faq/',
  setup: '/trustless-bitcoin-vault/testnet-info/setup/',
  research: '/trustless-bitcoin-vault/research/btc_trustless_vault/',

  // Bitcoin Staking and the wider docs
  bitcoinStaking: '/guides/overview/bitcoin_staking/',
  babylonGenesis: '/guides/overview/babylon_genesis/',
  apiReference: '/api/staking-api/babylon-staking-api/',
} as const;

export type RouteKey = keyof typeof ROUTES;
