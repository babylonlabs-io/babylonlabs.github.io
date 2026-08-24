import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import { DollarSign, Edit3, FilePlus, Key, Zap } from 'react-feather';

import { cursorFrames, HitMap } from './cursor';
import { SCENES, STAGE_H, STAGE_W } from './Scenes';
import s from './styles.module.css';

const ICONS = [FilePlus, Key, Edit3, Zap, DollarSign];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/**
 * Scenes are laid out against a fixed 1200x675 stage and scaled to whatever
 * width the frame ends up at. That keeps the composition identical everywhere
 * instead of reflowing, and — being DOM, not video — it stays sharp at any DPR.
 */
function useFrameWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(STAGE_W);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

/** Below this, fitting the whole stage would shrink body text past legibility. */
const ZOOM_BELOW = 640;

/**
 * Measures every click target in stage coordinates and animates the pointer
 * through the scene's waypoints. Reading positions from the live DOM rather
 * than hard-coding them is what keeps the pointer on target when a card
 * changes height — the Sign button sits at three different heights across the
 * deposit scenes alone.
 */
function useCursor(
  sceneEl: React.RefObject<HTMLDivElement>,
  cursorEl: React.RefObject<SVGSVGElement>,
  active: number,
  runKey: number,
  paused: boolean,
  enabled: boolean,
) {
  const animation = useRef<Animation | null>(null);

  useLayoutEffect(() => {
    const stage = sceneEl.current;
    const pointer = cursorEl.current;
    if (!stage || !pointer || !enabled) return;

    const scene = SCENES[active];

    // Suppress animations for the duration of the measurement, so elements are
    // read at their settled geometry rather than on an entrance keyframe. This
    // runs inside a layout effect, so nothing is painted in between.
    stage.classList.add(s.measuring);

    const base = stage.getBoundingClientRect();
    // The stage is scaled; divide back out to get design-space coordinates.
    const scale = new DOMMatrixReadOnly(getComputedStyle(stage).transform).a || 1;

    const hits: HitMap = {};
    stage.querySelectorAll<HTMLElement>('[data-hit]').forEach((el) => {
      const r = el.getBoundingClientRect();
      hits[el.dataset.hit as string] = {
        x: (r.left + r.width / 2 - base.left) / scale,
        y: (r.top + r.height / 2 - base.top) / scale,
      };
    });

    stage.classList.remove(s.measuring);

    const frames = cursorFrames(scene.cursor, scene.duration, hits);
    if (!frames) return;

    const anim = pointer.animate(frames, {
      duration: scene.duration * 1000,
      fill: 'both',
    });
    animation.current = anim;
    return () => anim.cancel();
  }, [sceneEl, cursorEl, active, runKey, enabled]);

  // CSS `animation-play-state` does not reach Web Animations, so pause it here.
  useEffect(() => {
    const anim = animation.current;
    if (!anim) return;
    if (paused) anim.pause();
    else anim.play();
  }, [paused, runKey, active]);
}

export default function VaultFlow() {
  const [active, setActive] = useState(0);
  // Bumping this remounts the scene, which restarts every CSS animation in it.
  const [runKey, setRunKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: stageRef, width } = useFrameWidth();
  const sceneRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<SVGSVGElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const scene = SCENES[active];

  // Narrow viewports crop to the scene's focal point rather than shrinking the
  // whole stage, which would render body text at around 3px.
  const zoom = width < ZOOM_BELOW ? scene.focus : null;
  const scale = width / (zoom ? zoom.w : STAGE_W);
  const stageHeight = (zoom ? zoom.h : STAGE_H) * scale;

  useCursor(sceneRef, cursorRef, active, runKey, paused, !reducedMotion);

  const goTo = useCallback((index: number) => {
    setActive(((index % SCENES.length) + SCENES.length) % SCENES.length);
    setRunKey((k) => k + 1);
  }, []);

  // Advance when the current scene's choreography finishes. Restarting on
  // resume (rather than tracking elapsed time) keeps the timer and the CSS
  // animations from drifting apart.
  useEffect(() => {
    if (paused || reducedMotion) return;

    const timer = setTimeout(() => goTo(active + 1), scene.duration * 1000);
    return () => clearTimeout(timer);
  }, [active, runKey, paused, reducedMotion, scene.duration, goTo]);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPaused(!entry.isIntersecting);
        // Re-entering restarts the scene from the top so viewers never arrive
        // mid-animation with half the UI already assembled.
        if (entry.isIntersecting) setRunKey((k) => k + 1);
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    // Frame-less: the hero supplies the border and caption bar around this.
    <div ref={sectionRef} className="relative">
      {/* Stage: fixed design size, scaled to the frame. It is a drawing of the
          portal, not the portal — hide it from assistive tech. */}
      <div
        ref={stageRef}
        aria-hidden
        className="relative w-full overflow-hidden bg-white"
        style={{ height: stageHeight }}
      >
        <div
          key={runKey}
          ref={sceneRef}
          className={clsx(s.scene, paused && s.paused, 'absolute left-0 top-0 origin-top-left')}
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: zoom
              ? `scale(${scale}) translate(${-zoom.x}px, ${-zoom.y}px)`
              : `scale(${scale})`,
          }}
        >
          {scene.render()}

          {!reducedMotion && (
            <svg ref={cursorRef} viewBox="0 0 12 18" className={s.cursor} aria-hidden>
              <path
                d="M1 1l10 8.2-4.6.5 2.5 5.1-2.2 1-2.5-5.2-3.2 3z"
                fill="#fff"
                stroke="#1a1a1a"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Dock — straddles the frame's bottom edge on desktop. On phones the
          frame is too small to give away, so it sits below instead. */}
      <div className="mt-3 flex justify-center px-2 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:translate-y-1/2">
        <div
          role="tablist"
          aria-label="Vault walkthrough steps"
          className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-[#15151c]/85 p-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9)] backdrop-blur-xl"
        >
          {SCENES.map((item, index) => {
            const isActive = index === active;
            const StepIcon = ICONS[index];

            return (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => goTo(index)}
                className={clsx(
                  'relative flex shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-xl border-0 px-3.5 py-2.5 text-sm font-medium transition-colors lg:px-4',
                  // Explicit Babylon orange, not `bg-primary`: the theme token
                  // flips to pale green in light mode and disappears.
                  isActive
                    ? 'bg-[#ce6533] text-white shadow-[0_4px_16px_-2px_rgba(206,101,51,0.6)]'
                    : 'bg-transparent text-white/55 hover:bg-white/5 hover:text-white/80',
                )}
              >
                <StepIcon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{item.title}</span>

                {isActive && !reducedMotion && (
                  <span
                    key={runKey}
                    aria-hidden
                    className={clsx(s.dockProgress, 'absolute bottom-0 left-0 h-[2px] bg-white/70')}
                    style={{
                      ['--fill' as string]: '100%',
                      animationDuration: `${item.duration}s`,
                      animationPlayState: paused ? 'paused' : 'running',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
