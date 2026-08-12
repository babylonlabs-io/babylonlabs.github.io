import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useReducedMotion } from './motion';
import { ROUTES } from './routes';
import { SectionRule } from './Rule';

/**
 * Landing page FAQ.
 *
 * Questions and answers are condensed from the real documentation FAQ at
 * docs/trustless-bitcoin-vault/use-for-lending/faq.mdx rather than written
 * fresh, so the landing page cannot contradict the docs. Each answer links
 * to the page that carries the full detail.
 */

type Item = { q: string; a: React.ReactNode };

const ITEMS: Item[] = [
  {
    q: 'Who holds my BTC during all of this?',
    a: (
      <>
        No third party. The BTC sits in a Taproot output whose spend paths are
        committed by all participants at vault creation. After creation no party
        can fabricate a new spend, because the only spends Bitcoin will accept
        are the ones already encoded in the script. The Vault Provider, Vault
        Keepers, Universal Challengers and Security Council have operational
        roles, but they never custody the depositor's BTC.{' '}
        <Link to={ROUTES.whatIsTbv}>What is TBV?</Link>
      </>
    ),
  },
  {
    q: 'Which wallets do I need?',
    a: (
      <>
        Two: a UniSat Bitcoin wallet on signet, and an Ethereum wallet on
        Sepolia. The Bitcoin wallet must produce Taproot (P2TR) addresses and
        support PSBT signing with message signing. The Ethereum wallet must
        support WalletConnect or be a compatible injected wallet.{' '}
        <Link to={ROUTES.setup}>Setup</Link>
      </>
    ),
  },
  {
    q: 'How long does peg-in take?',
    a: (
      <>
        About 2 hours on signet from the Deposit click to an Active vault, mostly
        waiting for 12 Bitcoin confirmations. Off-chain setup runs concurrently
        and takes 6 to 10 minutes once confirmations land. Activation itself is
        a single Ethereum transaction.{' '}
        <Link to={ROUTES.createVault}>Create a vault</Link>
      </>
    ),
  },
  {
    q: 'How is the interest rate set?',
    a: (
      <>
        The rate for each borrowable asset is a function of utilisation, the
        ratio of borrowed to supplied for that asset on the Aave v4 Hub. Below
        the optimal-utilisation pivot the rate climbs gently, and above it much
        faster. The displayed APR is what the borrower pays.{' '}
        <Link to={ROUTES.borrowRepay}>Borrow and repay</Link>
      </>
    ),
  },
  {
    q: 'What is the health factor and what number is safe?',
    a: (
      <>
        The health factor compares the risk-adjusted value of the collateral to
        the value of the debt. A position becomes liquidatable when it drops
        below 1.0, and above 1.5 is a comfortable margin.{' '}
        <Link to={ROUTES.liquidation}>Liquidation risk</Link>
      </>
    ),
  },
  {
    q: 'Why does withdrawal take about 3 days?',
    a: (
      <>
        Bitcoin cannot natively verify Ethereum state. The protocol generates a
        zero-knowledge proof of the redemption event and verifies it on Bitcoin
        through the BABE construction, with a roughly 3-day challenge window in
        which a Vault Keeper or Universal Challenger can dispute an invalid
        claim. If no challenge appears, the payout finalises.{' '}
        <Link to={ROUTES.withdrawRedeem}>Withdraw and redeem</Link>
      </>
    ),
  },
  {
    // Last and deepest: separates the two Babylon products that are easiest
    // to confuse.
    q: 'How is this different from Bitcoin staking?',
    a: (
      <>
        <p className="mb-3">
          They solve different problems and are not alternatives to each other.
        </p>
        <p className="mb-3">
          <strong>Bitcoin staking</strong> puts BTC to work as economic
          security. You lock it in a self-custodial script to secure a network
          and earn for providing that security. Nothing is borrowed and no debt
          exists.
        </p>
        <p className="mb-3">
          <strong>Trustless Bitcoin Vault</strong> puts BTC to work as
          collateral. A lending market on another chain treats it as backing for
          a loan, so you take on debt, a borrow rate and liquidation risk, and
          you earn no staking reward for it.
        </p>
        <p className="mb-0">
          What they share is the principle: the Bitcoin never leaves Bitcoin.{' '}
          <Link to={ROUTES.bitcoinStaking}>Bitcoin staking</Link> ·{' '}
          <Link to={ROUTES.research}>Research paper</Link>
        </p>
      </>
    ),
  },
];

function Row({
  item,
  open,
  onToggle,
  id,
}: {
  item: Item;
  open: boolean;
  onToggle: () => void;
  id: string;
}): JSX.Element {
  const reduced = useReducedMotion() ?? false;

  return (
    <li className="border-b border-border">
      <h3 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="focus-ring flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span className="text-lg font-medium tracking-tight text-foreground">
            {item.q}
          </span>
          <Plus
            aria-hidden="true"
            className={`mt-1 h-5 w-5 shrink-0 text-accent transition-transform duration-300 ${
              open ? 'rotate-45' : ''
            }`}
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="max-w-2xl pb-6 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Faq(): JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
      <SectionRule index="04" label="Questions" className="mb-12" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16">
        <div>
          <h2 className="mt-4 font-display text-3xl font-normal leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Frequently asked{' '}
            <span className="font-ui font-medium">questions</span>
          </h2>
          <Link
            to={ROUTES.faq}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent hover:no-underline"
          >
            Read the full FAQ
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="border-t border-border">
          {ITEMS.map((item, i) => (
            <Row
              key={item.q}
              id={`tbv-faq-${i}`}
              item={item}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
