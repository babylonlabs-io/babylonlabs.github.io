import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { motion } from 'framer-motion';
import { staggerContainer, useEntrance } from './motion';
import AskHero from './AskHero';
import WindowMockup from './WindowMockup';

/**
 * Primary hero.
 *
 * The sub-headline slot that the source template uses for marketing copy is
 * replaced by the Ask AI entry point, so the first thing a reader can do is
 * ask a question rather than read a claim.
 */
/** Verbatim from the template's `hero-waves`. */
const HERO_FADE =
  'linear-gradient(to bottom, transparent 0%, black 25%, black 80%, transparent 100%)';

export default function Hero(): JSX.Element {
  const { variants, transition, reduced } = useEntrance();

  return (
    // isolate creates a stacking context. Without it the field below cannot
    // sit behind the hero content without also falling behind the page
    // wrapper's opaque background, which hid it completely.
    <section className="relative isolate overflow-hidden bg-background">
      {/* ASCII flow field. Client-only: it needs canvas and window, and
          Docusaurus prerenders every page in Node.

          The top-and-bottom mask and the 1.6s fade-in come from the
          template's `hero-waves`. Opacity and the radial scrim below carry the
          glyphs behind the copy on their own, with no blur. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[620px] opacity-90 dark:opacity-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          reduced
            ? { duration: 0.01 }
            : { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }
        }
        style={{
          maskImage: HERO_FADE,
          WebkitMaskImage: HERO_FADE,
        }}
      >
        <BrowserOnly fallback={<div />}>
          {() => {
            const AsciiWaves = require('./AsciiWaves').default;
            return (
              <AsciiWaves
                characters="TBV"
                noiseScale={5}
                speed={0.7}
                intensity={0.5}
                waveTension={1.5}
                waveTwist={0.4}
                elementSize={12}
                hasCursorInteraction
                interactionIntensity={0.9}
                className="opacity-60 dark:opacity-70"
              />
            );
          }}
        </BrowserOnly>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 sm:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative flex flex-col items-center pb-14 pt-24 text-center md:pt-32"
        >
          {/* Scrim behind the copy, carried over from the template's hero.
              Without it the glyph field runs straight under the headline and
              the text loses contrast. Values match the original, with
              color-mix expressed through the token's alpha channel. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[150%] w-[160%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                'radial-gradient(ellipse at center, rgb(var(--tbv-background)) 0%, rgb(var(--tbv-background) / 0.78) 45%, transparent 72%)',
            }}
          />

          <motion.h1
            variants={variants}
            transition={transition}
            className="max-w-3xl font-display text-4xl font-normal leading-[1.06] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Make your Bitcoin{' '}
            <span className="font-ui font-medium">productive</span>
          </motion.h1>

          <motion.div
            variants={variants}
            transition={transition}
            className="mt-10 w-full"
          >
            <AskHero />
          </motion.div>
        </motion.div>

        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={{ ...transition, delay: 0.35 }}
          className="pb-4"
        >
          <WindowMockup />
        </motion.div>
      </div>
    </section>
  );
}
