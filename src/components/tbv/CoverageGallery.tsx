import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from './motion';
import { CutButton } from './CutButton';
import { ROUTES } from './routes';

/**
 * The animated tile section, ported faithfully from the React Bits Pro
 * "Security" template `coverage-grid.tsx`.
 *
 * Twelve duotone tiles are dealt into three columns. As the reader scrolls the
 * tall section, tiles rise into place from alternating directions, the whole
 * grid scales up, and the outer columns spread apart while the heading fades
 * in over the top.
 *
 * Two deliberate differences from the template:
 *
 *  - Lenis is not used. It takes over document scrolling, which would break
 *    Docusaurus anchor links and the sidebar. Native scroll plus
 *    framer-motion's useScroll gives the same result.
 *  - The duotone is tinted with the accent rather than the template's blue,
 *    so the section matches the rest of the site.
 */

const IMAGES: string[] = Array.from(
  { length: 12 },
  (_, i) => `img/landing-page/grid/${String(i + 1).padStart(2, '0')}.webp`,
);

const COLUMNS: string[][] = [0, 1, 2].map((col) =>
  IMAGES.filter((_, i) => i % 3 === col),
);

const TILE_CLIP =
  'polygon(var(--cut) 0, 100% 0, 100% calc(100% - var(--cut)), calc(100% - var(--cut)) 100%, 0 100%, 0 var(--cut))';

const TILE_STYLE = {
  '--cut': '12px',
  clipPath: TILE_CLIP,
} as React.CSSProperties;

/** Duotone treatment, retinted from the template's blue to the accent. */
function DuotoneImage({ src }: { src: string }): JSX.Element {
  const url = useBaseUrl(src);
  return (
    <div
      style={TILE_STYLE}
      className="relative aspect-square w-full overflow-hidden bg-[#fff2e0] [filter:saturate(1.15)] [isolation:isolate] dark:bg-[#2e1705] dark:[filter:saturate(1.35)]"
    >
      <div
        style={{ backgroundImage: `url(${url})` }}
        className="absolute inset-0 bg-cover bg-center [filter:grayscale(1)_contrast(0.85)_brightness(1.55)] dark:[filter:grayscale(1)_contrast(1.2)_brightness(1.08)]"
      />
      <div className="absolute inset-0 bg-[#f7931a] mix-blend-color" />
      <div className="absolute inset-0 bg-[#ffcb8f] opacity-30 mix-blend-multiply dark:bg-[#5c2f0a] dark:opacity-40" />
      <div className="absolute inset-0 bg-white opacity-25 mix-blend-screen dark:bg-[#ffb35c] dark:opacity-25" />
    </div>
  );
}

function Heading(): JSX.Element {
  return (
    <h2 className="mx-auto max-w-4xl text-balance font-display text-3xl font-normal leading-[1.08] tracking-[-0.01em] sm:text-4xl md:text-5xl lg:text-[3.5rem]">
      Trustlessly use{' '}
      <span className="font-ui font-semibold tracking-tight">Bitcoin</span> as
      collateral
    </h2>
  );
}

function CallToAction(): JSX.Element {
  return (
    <CutButton variant="accent" href={ROUTES.whatIsTbv} className="mt-8">
      Explore the vault
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </CutButton>
  );
}

type TileProps = {
  progress: MotionValue<number>;
  src: string;
  colIndex: number;
  pos: number;
  colLen: number;
};

function Tile({
  progress,
  src,
  colIndex,
  pos,
  colLen,
}: TileProps): JSX.Element {
  const fromTop = colIndex % 2 === 0;
  const isCenter = colIndex === 1;

  // Stagger each tile's arrival by its position in the column, so the columns
  // fill from opposite ends rather than all at once.
  const order = fromTop ? colLen - 1 - pos : pos;
  const start = 0.06 + order * 0.045;
  const end = start + 0.3;

  const revealY = useTransform(
    progress,
    [start, end],
    [fromTop ? '-90vh' : '90vh', '0vh'],
    { clamp: true },
  );

  // Late in the scroll the centre column splits apart vertically to open a
  // gap for the heading.
  const mid = Math.floor(colLen / 2);
  const spreadTo = isCenter ? `${(pos < mid ? -1 : 1) * 42}%` : '0%';
  const spreadY = useTransform(progress, [0.54, 0.9], ['0%', spreadTo], {
    clamp: true,
  });

  return (
    <motion.div style={{ y: revealY }} className="will-change-transform">
      <motion.div style={{ y: spreadY }} className="will-change-transform">
        <DuotoneImage src={src} />
      </motion.div>
    </motion.div>
  );
}

/** Reduced-motion fallback: the same content as a plain grid, no scroll region. */
function StaticCoverage(): JSX.Element {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
      <div className="text-center">
        <Heading />
        <div className="flex justify-center">
          <CallToAction />
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
        {IMAGES.map((src) => (
          <DuotoneImage key={src} src={src} />
        ))}
      </div>
    </section>
  );
}

export default function CoverageGallery(): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const scale = useTransform(scrollYProgress, [0.5, 0.92], [1, 2.05]);
  const leftX = useTransform(scrollYProgress, [0.52, 0.92], ['0%', '-55%']);
  const rightX = useTransform(scrollYProgress, [0.52, 0.92], ['0%', '55%']);
  const gridOpacity = useTransform(
    scrollYProgress,
    [0, 0.03, 0.86, 0.99],
    [0, 1, 1, 0],
  );

  const titleOpacity = useTransform(scrollYProgress, [0.02, 0.14], [0, 1]);
  const titleY = useTransform(
    scrollYProgress,
    [0.02, 0.14, 0.6, 0.82],
    [28, 0, 0, -8],
  );

  const bodyOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const bodyY = useTransform(scrollYProgress, [0.6, 0.8], [16, 0]);
  const bodyPointer = useTransform(scrollYProgress, (v: number) =>
    v > 0.62 ? 'auto' : 'none',
  );

  if (prefersReducedMotion) {
    return <StaticCoverage />;
  }

  return (
    <section ref={sectionRef} className="relative h-[420vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        <motion.div
          style={{ opacity: gridOpacity }}
          className="absolute inset-0 z-0 flex items-center justify-center"
        >
          <motion.div
            style={{ scale }}
            className="w-[min(86vw,760px)] will-change-transform"
          >
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {COLUMNS.map((col, colIndex) => (
                <motion.div
                  key={colIndex}
                  style={{
                    x: colIndex === 0 ? leftX : colIndex === 2 ? rightX : 0,
                  }}
                  className="flex flex-col gap-3 will-change-transform sm:gap-4"
                >
                  {col.map((src, pos) => (
                    <Tile
                      key={src}
                      progress={scrollYProgress}
                      src={src}
                      colIndex={colIndex}
                      pos={pos}
                      colLen={col.length}
                    />
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
          <motion.div style={{ opacity: titleOpacity, y: titleY }}>
            <Heading />
          </motion.div>

          <motion.div
            style={{
              opacity: bodyOpacity,
              y: bodyY,
              pointerEvents: bodyPointer,
            }}
            className="flex flex-col items-center"
          >
            <CallToAction />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
