import React from 'react';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { guides, samples } from './content';
import { staggerContainer, useEntrance } from './motion';
import { ROUTES } from './routes';
import { SectionRule } from './Rule';

/**
 * Guides and samples, restyled into the launch theme.
 *
 * The guide and sample entries are imported from tbv/content so
 * the copy and destinations stay in one place. Only presentation changes here.
 */

function GuideCard({ guide }: { guide: (typeof guides)[number] }): JSX.Element {
  const { variants, transition } = useEntrance();
  const Icon = guide.icon;

  return (
    <motion.li variants={variants} transition={transition}>
      <Link
        to={guide.link}
        className={`group flex h-full flex-col border border-transparent bg-muted px-6 pb-7 pt-5 text-foreground transition-colors duration-300 hover:border-border-strong hover:no-underline`}
      >
        <Icon className="h-11 w-auto self-start text-foreground" aria-hidden="true" />
        <h3 className="mt-5 font-display text-xl font-normal text-foreground">
          {guide.title}
        </h3>
        <p className="mb-0 mt-8 flex-1 text-sm leading-[23px] text-muted-foreground">
          {guide.text}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold">
          Read guide
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
      <div className="flex items-start justify-between gap-4 py-6 pl-0 pr-2 sm:pl-8">
        <div className="min-w-0">
          <Link
            to={href}
            className="text-base font-bold text-foreground hover:text-accent hover:no-underline"
          >
            {sample.title}
          </Link>
          {sample.platform && (
            <p className="mb-0 mt-2 text-sm text-muted-foreground">
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
            className="text-foreground hover:text-accent"
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
    <section className="bg-background dark:bg-contrast">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
      <SectionRule index="02" label="Documentation" className="mb-14" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="mb-12 font-display text-3xl font-normal leading-[1.2] tracking-[-0.01em] text-foreground">
            Documentation by product
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
          <h2 className="mb-12 font-display text-3xl font-normal leading-[1.2] tracking-[-0.01em] text-foreground">
            Go deeper
          </h2>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {samples.map((s) => (
              <SampleRow key={s.title} sample={s} />
            ))}
          </motion.ul>

          <Link
            to={ROUTES.whatIsTbv}
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-foreground hover:text-accent hover:no-underline sm:ml-8"
          >
            Explore the vault docs
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}
