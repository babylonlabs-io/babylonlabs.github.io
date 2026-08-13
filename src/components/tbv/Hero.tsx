import React from 'react';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
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
 * The background is PixelBlast from the free React Bits library, configured
 * to the values Babylon selected and tinted with the accent token.
 */

/** The live testnet application, not a documentation route. */
const APP_URL = 'https://btc-vaults.testnet.babylonlabs.io/';

export default function Hero(): JSX.Element {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* Client-only: WebGL is unavailable during Docusaurus prerender. */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <BrowserOnly fallback={<div />}>
          {() => {
            const PixelBlast = require('./PixelBlast').default;
            return (
              <PixelBlast
                variant="square"
                pixelSize={4}
                color="#ce6533"
                patternScale={2}
                patternDensity={1}
                pixelSizeJitter={0}
                enableRipples
                rippleSpeed={0.3}
                rippleThickness={0.1}
                rippleIntensityScale={1}
                liquid={false}
                speed={0.5}
                edgeFade={0.25}
                transparent
              />
            );
          }}
        </BrowserOnly>

        {/* Centred scrim, matching the now-centred copy, so the headline keeps
            its contrast while the field still reads at the edges. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 62% 58% at 50% 38%, rgb(var(--tbv-background)) 0%, rgb(var(--tbv-background) / 0.86) 48%, transparent 84%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background"
        />
      </div>

      {/* One appearance of the secondary accent. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[58%] z-0 h-px bg-gradient-to-r from-transparent via-steel/40 to-transparent"
      />

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-center px-5 pb-20 pt-16 text-center sm:px-8 lg:pb-24 lg:pt-20">
        <p className="mb-6 flex items-center gap-2.5 font-code text-[11px] uppercase tracking-[0.22em] text-accent">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60 motion-reduce:hidden" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Public testnet live
        </p>

        <h1 className="max-w-4xl font-display text-4xl font-normal leading-[1.04] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl">
          Trustlessly use Bitcoin
          <br />
          as collateral
        </h1>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex h-11 items-center gap-2 bg-accent px-6 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 hover:no-underline"
          >
            Launch testnet
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <Link
            to={ROUTES.whatIsTbv}
            className="focus-ring inline-flex h-11 items-center gap-2 border border-border px-6 text-sm font-medium text-foreground transition-colors hover:border-steel hover:no-underline"
          >
            Documentation
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 w-full max-w-2xl">
          <AskHero />
        </div>

        {/* The walkthrough, with the caption bar linking through to the live
            application. The link is scoped to that bar rather than wrapping the
            whole box: the walkthrough has its own step buttons, and buttons
            inside an anchor are neither valid nor clickable. */}
        <div className="mt-12 w-full max-w-4xl border border-border bg-muted text-left">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between border-b border-border px-4 py-2.5 hover:no-underline"
          >
            <span className="font-code text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Deposit, sign, borrow
            </span>
            <span className="inline-flex items-center gap-1.5 font-code text-[11px] text-muted-foreground transition-colors group-hover:text-accent">
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
