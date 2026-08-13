/**
 * Motion primitives for documentation content.
 *
 * Adapted from Animate UI (https://animate-ui.com, github.com/imskyleen/animate-ui),
 * MIT + Commons Clause. That licence grants the right to use, modify and
 * distribute the components "as part of an application, website, or product"
 * and forbids only selling or redistributing the components themselves. A
 * public repository that ships a site is within its terms — the same basis on
 * which this repo already carries PixelBlast. Licence scanners report the repo
 * as NOASSERTION because the Commons Clause rider is not an SPDX identifier.
 *
 * Three deliberate departures from upstream:
 *
 *   1. Upstream imports `motion/react`. That package is the same codebase as
 *      `framer-motion`, which this repo already ships at v12, so importing
 *      `framer-motion` avoids a second copy of the animation library.
 *   2. Upstream targets React 19, where `ref` is an ordinary prop. This repo
 *      is on React 18, so anything needing a forwarded ref uses `forwardRef`.
 *   3. Every effect collapses to its finished state under
 *      `prefers-reduced-motion`. On reference documentation that is not a nicety:
 *      motion the reader cannot switch off competes with the text.
 */

import React, { forwardRef, useCallback, useRef, useState } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
  type SpringOptions,
  type Transition,
  type Variants,
} from 'framer-motion';

/** Shared easing. Matches the landing-page vocabulary in tbv/motion.ts. */
const EASE = [0.22, 1, 0.36, 1] as const;

export type RevealVariant = 'fade' | 'slide' | 'blur' | 'zoom';

const VARIANTS: Record<RevealVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slide: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(6px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1 },
  },
};

type RevealProps = {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  /** Fire once when scrolled into view. Off means animate on mount. */
  once?: boolean;
  /** Negative margin brings the trigger point above the fold edge. */
  margin?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Reveals its children when scrolled into view.
 *
 * `amount: 0.15` rather than the default `some`, so a long table does not
 * count as visible the instant one pixel of it clears the fold.
 */
export function Reveal({
  children,
  variant = 'slide',
  delay = 0,
  duration = 0.9,
  once = true,
  margin = '-60px',
  className,
  style,
}: RevealProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, {
    once,
    margin: margin as any,
    amount: 0.15,
  });

  if (reduced) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={VARIANTS[variant]}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggers direct children into view.
 *
 * Used for table rows and card grids. `staggerChildren` is small on purpose:
 * a reader scanning a long table should not wait on a queue of animations.
 */
export function RevealGroup({
  children,
  stagger = 0.08,
  variant = 'slide',
  className,
  once = true,
}: {
  children: React.ReactNode;
  stagger?: number;
  variant?: RevealVariant;
  className?: string;
  once?: boolean;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once, margin: '-40px' as any, amount: 0.1 });

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div
          key={i}
          variants={VARIANTS[variant]}
          transition={{ duration: 0.8, ease: EASE }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Magnifier zoom. Scales in place with the transform origin pinned to the
 * pointer, so the reader magnifies the part of a diagram they are pointing at
 * rather than the centre.
 *
 * Click toggles, so a zoom survives the pointer leaving — necessary to read a
 * wide architecture diagram. Touch devices get click only; hover zoom on a
 * touch screen fires on every tap and traps the reader.
 */
export function ImageZoom({
  children,
  zoomScale = 2.2,
  transition = { type: 'spring', stiffness: 100, damping: 26 },
  className,
}: {
  children: React.ReactNode;
  zoomScale?: number;
  transition?: Transition;
  className?: string;
}): JSX.Element {
  const [zoomed, setZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const isTouch =
    typeof window !== 'undefined' &&
    typeof matchMedia === 'function' &&
    matchMedia('(pointer: coarse)').matches;

  const setOrigin = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const child = el.firstElementChild as HTMLElement | null;
    if (child) child.style.transformOrigin = `${x}px ${y}px`;
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (!zoomed) return;
      setOrigin(e.clientX, e.clientY);
    },
    [zoomed, setOrigin],
  );

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      setOrigin(e.clientX, e.clientY);
      setZoomed((v) => !v);
    },
    [setOrigin],
  );

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={onMove}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setZoomed((v) => !v);
        }
        if (e.key === 'Escape') setZoomed(false);
      }}
      role="button"
      tabIndex={0}
      aria-label={zoomed ? 'Zoom out of image' : 'Zoom into image'}
      style={{
        overflow: 'hidden',
        position: 'relative',
        touchAction: 'manipulation',
        cursor: zoomed ? 'zoom-out' : 'zoom-in',
      }}
    >
      <motion.div
        animate={{ scale: zoomed && !reduced ? zoomScale : 1 }}
        transition={reduced ? { duration: 0 } : transition}
        style={{ willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Tilts toward the pointer. Kept shallow: `maxTilt` above ~8deg on a card
 * containing text makes the text visibly keystone.
 */
// `ref` is omitted from the prop type: HTMLMotionProps carries its own `ref`
// field, and spreading the rest would otherwise reintroduce it with a
// conflicting signature alongside the one forwardRef supplies.
export const Tilt = forwardRef<
  HTMLDivElement,
  Omit<HTMLMotionProps<'div'>, 'ref'> & {
    maxTilt?: number;
    perspective?: number;
    transition?: SpringOptions;
  }
>(function Tilt(
  {
    maxTilt = 6,
    perspective = 900,
    transition = { stiffness: 150, damping: 22, mass: 0.6 },
    style,
    onMouseMove,
    onMouseLeave,
    children,
    ...props
  },
  ref,
) {
  const reduced = useReducedMotion();
  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const sRX = useSpring(rX, transition);
  const sRY = useSpring(rY, transition);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseMove?.(e as any);
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      rY.set(nx * maxTilt);
      rX.set(-ny * maxTilt);
    },
    [maxTilt, rX, rY, onMouseMove, reduced],
  );

  const handleLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e as any);
      rX.set(0);
      rY.set(0);
    },
    [rX, rY, onMouseLeave],
  );

  if (reduced) {
    return (
      <div ref={ref} style={style as React.CSSProperties} {...(props as any)}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ perspective }} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <motion.div
        ref={ref as React.Ref<HTMLDivElement>}
        style={{ rotateX: sRX, rotateY: sRY, willChange: 'transform', ...style }}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
});

/**
 * Pulls gently toward the pointer. Reserved for standalone calls to action —
 * a control that moves away from the cursor is harder to hit, so the offset
 * stays well inside the target's own bounds.
 */
export const Magnetic = forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; strength?: number; className?: string }
>(function Magnetic({ children, strength = 0.25, className }, ref) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 130, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 130, damping: 18, mass: 0.5 });

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      style={{ x: sx, y: sy, display: 'inline-block', willChange: 'transform' }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
});
