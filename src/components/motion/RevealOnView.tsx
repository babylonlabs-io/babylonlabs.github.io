import React, { useEffect, useRef, useState } from 'react';

/**
 * Marks a block as revealed once it scrolls into view, and lets CSS do the
 * animating.
 *
 * Why not framer-motion here: this wraps every table, code block and
 * admonition on the site. Mounting a motion component per block would put
 * hundreds of animation subscriptions on a long reference page, and — for
 * tables — a `motion.div` cannot go around a `<tr>` without breaking table
 * semantics. A single IntersectionObserver plus a data attribute lets CSS
 * stagger rows through `nth-child` delays, which the compositor handles on
 * its own thread.
 *
 * The element starts visible and is hidden only once JavaScript confirms it
 * will animate it. Without that, a reader whose JavaScript fails or is still
 * loading gets a page of invisible content.
 */
export default function RevealOnView({
  children,
  className = '',
  as: Tag = 'div',
  variant = 'slide',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'span';
  variant?: 'slide' | 'fade' | 'blur' | 'zoom';
}): JSX.Element {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    // Arm only now, so the pre-hydration paint keeps the content visible.
    setArmed(true);

    // Already on screen at mount: reveal on the next frame rather than
    // waiting for a scroll that may never come on a short page.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const id = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as any}
      className={`docs-reveal ${className}`.trim()}
      data-reveal={variant}
      data-armed={armed ? 'true' : undefined}
      data-revealed={revealed ? 'true' : undefined}
    >
      {children}
    </Tag>
  );
}
