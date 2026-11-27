import React from 'react';
import Link from '@docusaurus/Link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import AskHero from './AskHero';
import VaultFlow from '../VaultFlow';
import { ROUTES } from './routes';

/**
 * Hero.
 *
 * Centred column: mono status line, display headline, controls, the composer,
 * and the product screenshot as the centrepiece beneath it.
 *
 * The lead paragraph, the pre-set question buttons, the attachment control and
 * dictation were all removed. Each sat between the reader and the screenshot,
 * which is the thing the hero exists to show.
 *
 * The ground is the plain beige band from the docs redesign (Figma 134:2269).
 * The PixelBlast field that used to sit behind it is not part of that design,
 * so it was removed along with its three/postprocessing dependencies.
 */

/** The live testnet application, not a documentation route. */
const APP_URL = 'https://btc-vaults.testnet.babylonlabs.io/';

export default function Hero(): JSX.Element {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-muted dark:bg-background">
      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-5 pb-20 pt-16 text-center sm:px-8 lg:pb-16 lg:pt-20">
        {/* The dot carries the status colour, the words do not: orange cannot
            reach 4.5:1 for 11px text on the beige ground. */}
        <p className="tbv-status-label mb-7 flex items-center gap-2.5 font-code text-[11px] uppercase tracking-[0.14em]">
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/30 motion-reduce:hidden" />
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent/30" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Public testnet live
        </p>

        <h1 className="max-w-4xl font-display text-5xl font-normal leading-none tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[72px]">
          Use native Bitcoin
          <br />
          as collateral
        </h1>

        <div className="mt-12 flex w-full flex-wrap items-center justify-center gap-3 sm:w-auto">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring tbv-btn tbv-btn-primary"
          >
            Launch testnet
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <Link
            to={ROUTES.whatIsTbv}
            className="focus-ring tbv-btn tbv-btn-secondary"
          >
            Documentation
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 w-full max-w-[672px]">
          <AskHero />
        </div>

        {/* The walkthrough, with the caption bar linking through to the live
            application. The link is scoped to that bar rather than wrapping the
            whole box: the walkthrough has its own step buttons, and buttons
            inside an anchor are neither valid nor clickable. The frame is drawn
            by the caption bar and the stage, so the step bar can sit below it
            on its own, as in the design. */}
        <div className="mt-12 w-full max-w-[896px] text-left">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between border border-border bg-background px-6 py-3 hover:no-underline dark:bg-muted"
          >
            <span className="font-code text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Deposit, sign, borrow
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">
              Open the testnet app
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </a>

          <VaultFlow />
        </div>
      </div>
    </section>
  );
}
