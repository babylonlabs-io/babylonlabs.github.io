import { SectionRule } from './Rule';
import React from 'react';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PRODUCTS } from './content';
import { staggerContainer, useEntrance } from './motion';

/**
 * The three existing product entry points, restyled into the launch theme.
 *
 * Content, links and icons come from PRODUCTS in tbv/content so the
 * copy stays in one place. Only the presentation changes here.
 */

function ProductCard({
  product,
}: {
  product: (typeof PRODUCTS)[number] & { link: string };
}): JSX.Element {
  const { variants, transition } = useEntrance();
  const Icon = product.icon;

  return (
    <motion.li variants={variants} transition={transition}>
      <Link
        to={product.link}
        className={`group flex h-full flex-col gap-4 border border-border bg-background p-6 text-foreground transition-colors duration-300 hover:border-border-strong hover:no-underline`}
      >
        <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />

        <h3 className="font-display text-2xl font-normal tracking-tight text-foreground">
          {product.title}
        </h3>

        <p className="mb-0 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.text}
        </p>

        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
          Read more
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>
    </motion.li>
  );
}

export default function ProductCards(): JSX.Element {
  const products = PRODUCTS;

  return (
    <section className="bg-background">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-20 sm:px-8 lg:py-28">
      <SectionRule index="01" label="Start here" className="mb-12" />

      <div className="mb-12 max-w-2xl">
        <h2 className="mt-4 font-display text-3xl font-normal leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Use native Bitcoin as{' '}
          <span className="font-ui font-medium">collateral</span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          Without bridges, wrapped custody, or pooled BTC. The open Testnet docs
          are the main entry point for creating a vault, borrowing on Aave v4,
          and redeeming back to Bitcoin.
        </p>
      </div>

      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {products.map((p) => (
          <ProductCard key={p.title} product={p} />
        ))}
      </motion.ul>
      </div>
    </section>
  );
}
