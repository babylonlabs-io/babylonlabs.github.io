import React from 'react';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { guides, samples } from '../homepage/GuidesAndSamples';
import { staggerContainer, useEntrance } from './motion';
import { Kicker } from './CornerPlus';
import { ROUTES } from './routes';

/**
 * Guides and samples, restyled into the launch theme.
 *
 * The guide and sample entries are imported from homepage/GuidesAndSamples so
 * the copy and destinations stay in one place. Only presentation changes here.
 */

const CUT =
  '[clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]';

function GuideCard({ guide }: { guide: (typeof guides)[number] }): JSX.Element {
  const { variants, transition } = useEntrance();
  const Icon = guide.icon;

  return (
    <motion.li variants={variants} transition={transition}>
      <Link
        to={guide.link}
        className={`group flex h-full flex-col gap-3 border border-border bg-background p-6 text-foreground transition-colors duration-300 hover:border-accent hover:no-underline ${CUT}`}
      >
        <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
        <h3 className="font-display text-xl font-normal tracking-tight text-foreground">
          {guide.title}
        </h3>
        <p className="mb-0 flex-1 text-sm leading-relaxed text-muted-foreground">
          {guide.text}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium">
          Read guide
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>
    </motion.li>
  );
}

function SampleRow({
  sample,
}: {
  sample: (typeof samples)[number];
}): JSX.Element {
  const { variants, transition } = useEntrance();
  const href = sample.demo ?? sample.source ?? ROUTES.whatIsTbv;

  return (
    <motion.li
      variants={variants}
      transition={transition}
      className="border-b border-border"
    >
      <div className="flex items-center justify-between gap-4 py-5">
        <div className="min-w-0">
          <Link
            to={href}
            className="text-base font-medium text-foreground hover:text-accent hover:no-underline"
          >
            {sample.title}
          </Link>
          {sample.platform && (
            <p className="mb-0 mt-1 text-sm text-muted-foreground">
              {sample.platform}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {sample.source && (
            <Link
              to={sample.source}
              aria-label={`${sample.title} source on GitHub`}
              className="text-muted-foreground hover:text-accent"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          <Link
            to={href}
            aria-label={`Open ${sample.title}`}
            className="text-muted-foreground hover:text-accent"
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.li>
  );
}

export default function GuidesSamples(): JSX.Element {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Kicker>Guides</Kicker>
          <h2 className="mb-8 mt-4 font-display text-3xl font-normal leading-[1.1] tracking-tight text-foreground">
            Documentation{' '}
            <span className="font-ui font-medium">by product</span>
          </h2>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 gap-5"
          >
            {guides.map((g) => (
              <GuideCard key={g.title} guide={g} />
            ))}
          </motion.ul>
        </div>

        <div>
          <Kicker>Samples</Kicker>
          <h2 className="mb-8 mt-4 font-display text-3xl font-normal leading-[1.1] tracking-tight text-foreground">
            Go{' '}
            <span className="font-ui font-medium">deeper</span>
          </h2>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="border-t border-border"
          >
            {samples.map((s) => (
              <SampleRow key={s.title} sample={s} />
            ))}
          </motion.ul>

          <Link
            to={ROUTES.whatIsTbv}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent hover:no-underline"
          >
            Explore the vault docs
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
