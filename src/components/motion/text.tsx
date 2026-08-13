/**
 * Text animations.
 *
 * Adapted from Animate UI (MIT + Commons Clause) — see effects.tsx for the
 * licence reasoning and the React 18 / framer-motion departures.
 */

import React, { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

/**
 * Rolls a number up when it scrolls into view.
 *
 * `tabular-nums` is applied by the caller; without it the digits change width
 * mid-count and the surrounding layout jitters.
 */
export function CountingNumber({
  value,
  duration = 2.4,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}): JSX.Element {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) {
      if (reduced) setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/**
 * Types text out character by character once it is in view.
 *
 * The full string is always present for assistive technology and for the
 * static build: only a CSS-clipped span animates, so a screen reader and a
 * crawler both see the finished text rather than a partial one.
 */
export function Typing({
  text,
  speed = 56,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}): JSX.Element {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, speed, reduced]);

  const shown = reduced ? text : text.slice(0, count);
  const done = reduced || count >= text.length;

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{shown}</span>
      {!done && (
        <span aria-hidden="true" style={{ opacity: 0 }}>
          {text.slice(count)}
        </span>
      )}
      <span className="sr-only">{text}</span>
    </span>
  );
}
