import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * ASCII flow field, ported from the React Bits Pro "Security" template's
 * `ascii-waves`.
 *
 * The field maths is carried over from the original fragment shader unchanged,
 * so the motion reads the same. Canvas 2D rather than React Three Fiber
 * because @react-three/fiber v9 requires React 19 and this site is on React
 * 18, and because `three` would add roughly 600 KB to a page whose job is to
 * link to documentation.
 *
 * Drawing is done one row at a time: every glyph shares a colour and the font
 * is monospace, so a row is a single fillText rather than one draw per cell.
 */

/** Matches `flowField` in the original fragment shader. */
function flowField(x: number, y: number, t: number): number {
  return Math.sin(x + Math.sin(y + t * 0.1)) * Math.sin(y * x * 0.1 + t * 0.2);
}

export interface AsciiWavesProps {
  /** Glyph ramp, sparsest to densest. */
  characters?: string;
  /** Multiplier on field magnitude before it maps to a character. */
  intensity?: number;
  /** Spatial frequency of the field. */
  noiseScale?: number;
  /** Time multiplier. */
  speed?: number;
  waveTension?: number;
  waveTwist?: number;
  /** Grid cell size in CSS pixels. */
  elementSize?: number;
  hasCursorInteraction?: boolean;
  interactionIntensity?: number;
  /** CSS colour for the glyphs. Defaults to the accent token. */
  color?: string;
  className?: string;
}

export default function AsciiWaves({
  characters = 'TBV',
  intensity = 0.5,
  noiseScale = 5,
  speed = 0.7,
  waveTension = 1.5,
  waveTwist = 0.4,
  elementSize = 12,
  hasCursorInteraction = true,
  interactionIntensity = 0.9,
  color,
  className = '',
}: AsciiWavesProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const chars = characters.length > 0 ? characters : ' ';
    const maxIndex = chars.length - 1;

    let raf = 0;
    let inView = true;
    let disposed = false;
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let fontPx = 0;
    let scaleX = 1;
    let scaleY = 1;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const readColor = (): string => {
      if (color) return color;
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--tbv-accent')
        .trim();
      return raw ? `rgb(${raw})` : '#f7931a';
    };

    const layout = (): void => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.max(1, Math.ceil(width / elementSize));
      rows = Math.max(1, Math.ceil(height / elementSize));

      // The shader stretches each glyph to fill a square cell. The same is
      // achieved here by picking a font whose natural advance is one cell
      // wide, then squashing the row vertically by the matching ratio. That
      // keeps a whole row to a single fillText.
      fontPx = elementSize / 0.6;
      ctx.font = `${fontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      const advance = ctx.measureText('M').width || fontPx * 0.6;
      scaleX = elementSize / advance;
      scaleY = elementSize / fontPx;
    };

    /**
     * Matches `computeField`. Advects the sample point along the tangent of
     * the field gradient, then returns the gradient magnitude.
     */
    const fieldMagnitude = (px: number, py: number, t: number): number => {
      const ep = 0.05;
      let x = px;
      let y = py;
      let gx = 0;
      let gy = 0;

      const sx = Math.sin(t * 0.25) * waveTwist;
      const cy = Math.cos(t * 0.25) * waveTwist;

      for (let i = 0; i < 10; i++) {
        const t0 = flowField(x, y, t);
        const t1 = flowField(x + ep, y, t);
        const t2 = flowField(x, y + ep, t);

        gx = (t1 - t0) / ep;
        gy = (t2 - t0) / ep;

        // tangent = perpendicular of the gradient
        x += -gy * waveTension + gx * 0.005;
        y += gx * waveTension + gy * 0.005;
        x += sx;
        y += cy;
      }

      return Math.sqrt(gx * gx + gy * gy);
    };

    const draw = (timeSeconds: number): void => {
      const [ax, ay] =
        width > height ? [width / height, 1] : [height / width, 1];

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = readColor();
      ctx.textBaseline = 'top';
      ctx.font = `${fontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;

      const t = timeSeconds * speed;
      const m = mouseRef.current;
      const useMouse = hasCursorInteraction && m.active;
      const strength = interactionIntensity;
      const wobble = Math.sin(timeSeconds * 3) * 0.5;
      const wobbleC = Math.cos(timeSeconds * 3) * 0.5;
      const row: string[] = new Array(cols);

      const mu = (m.x / width) * ax;
      const mv = (m.y / height) * ay;

      for (let r = 0; r < rows; r++) {
        const v = ((r * elementSize) / height) * ay;

        for (let c = 0; c < cols; c++) {
          const u = ((c * elementSize) / width) * ax;

          let px = u * noiseScale;
          let py = v * noiseScale;

          if (useMouse) {
            const dx = u - mu;
            const dy = v - mv;
            const dist = Math.hypot(dx, dy);
            const radius = 0.5;
            if (dist < radius) {
              // smoothstep(radius, 0, dist)
              const s = 1 - dist / radius;
              const interaction = s * s * (3 - 2 * s);
              if (dist > 0) {
                px += (dx / dist) * interaction * strength;
                py += (dy / dist) * interaction * strength;
              }
              px += wobble * interaction * strength;
              py += wobbleC * interaction * strength;
            }
          }

          const mag = fieldMagnitude(px, py, t) * intensity;
          const gray = mag > 1 ? 1 : mag < 0 ? 0 : mag;
          // The shader floors rather than rounds.
          const idx = Math.min(Math.floor(gray * maxIndex), maxIndex);
          row[c] = chars[idx] ?? ' ';
        }

        ctx.setTransform(
          dpr * scaleX,
          0,
          0,
          dpr * scaleY,
          0,
          dpr * r * elementSize,
        );
        ctx.fillText(row.join(''), 0, 0);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // 30fps. The field evolves slowly, so a higher rate costs battery without
    // reading as smoother.
    const FRAME_MS = 1000 / 30;
    let last = 0;
    const start = performance.now();

    const loop = (now: number): void => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (!inView) return;
      if (now - last < FRAME_MS) return;
      last = now;
      draw((now - start) / 1000);
    };

    const onMouseMove = (e: MouseEvent): void => {
      const rect = wrap.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onMouseLeave = (): void => {
      mouseRef.current.active = false;
    };

    layout();

    if (reduced) {
      // One static frame. No loop, no battery cost, no movement.
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: '120px' },
    );
    io.observe(wrap);

    const ro = new ResizeObserver(() => {
      layout();
      if (reduced) draw(0);
    });
    ro.observe(wrap);

    // Redraw on theme change so the glyph colour follows the token.
    const mo = new MutationObserver(() => {
      if (reduced) draw(0);
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    if (hasCursorInteraction && !reduced) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      wrap.addEventListener('mouseleave', onMouseLeave);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      wrap.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [
    characters,
    intensity,
    noiseScale,
    speed,
    waveTension,
    waveTwist,
    elementSize,
    hasCursorInteraction,
    interactionIntensity,
    color,
    reduced,
  ]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className={`pointer-events-none relative h-full w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
