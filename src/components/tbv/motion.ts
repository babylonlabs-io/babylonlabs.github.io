import { useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';

/**
 * Shared motion vocabulary for the TBV launch surfaces.
 *
 * The React Bits templates import from `motion/react`. That package is the
 * same codebase as `framer-motion`, which this repo already ships at v12.
 * Importing from `framer-motion` avoids shipping a second copy of the same
 * animation library.
 */

export const softEase = [0.22, 1, 0.36, 1] as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/** Static end-state, used when the reader prefers reduced motion. */
export const staticVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

/**
 * Returns the variant set and transition to use for an entrance animation,
 * already resolved against the reader's motion preference.
 */
export function useEntrance(): {
  variants: Variants;
  transition: { duration: number; ease?: readonly number[] };
  reduced: boolean;
} {
  const reduced = useReducedMotion() ?? false;
  return {
    variants: reduced ? staticVariants : fadeInUp,
    transition: reduced
      ? { duration: 0.01 }
      : { duration: 0.7, ease: softEase },
    reduced,
  };
}

export { useReducedMotion };
