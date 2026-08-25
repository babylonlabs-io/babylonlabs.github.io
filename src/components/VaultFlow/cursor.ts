/**
 * Cursor choreography.
 *
 * Two rules this exists to enforce:
 *
 * 1. The pointer arrives before the thing it triggers. Scenes author cursor
 *    waypoints on the same second-based timeline as their events, and derive
 *    those event times from `clickTime`/`reactTime` here — so "move, arrive,
 *    click, react" holds by construction rather than by hand-tuning.
 *
 * 2. The pointer lands on the real target. Waypoints name a `data-hit`
 *    element rather than carrying coordinates; positions are measured from the
 *    live DOM at run time. Hard-coded coordinates drifted the moment a card
 *    changed height — the Sign button alone sits at three different heights
 *    across the deposit scenes.
 */

export interface CursorStep {
  /** Seconds from the start of the scene. */
  at: number;
  /** `data-hit` value of the element to point at. */
  hit?: string;
  /** Stage coordinates, for resting positions with no element to target. */
  x?: number;
  y?: number;
  /** Approach offset, so the pointer drifts in rather than teleporting. */
  offsetY?: number;
  /** Adds the press pulse. Author an arrival step just before every click. */
  click?: boolean;
}

export type HitMap = Record<string, { x: number; y: number }>;

/** How long the pointer takes to travel to a target before clicking it. */
export const TRAVEL = 0.85;
/** Gap between the click landing and the UI reacting to it. */
export const REACT = 0.18;

/**
 * Waypoints for moving to a target and clicking it. `arriveAt` is when the
 * pointer settles; the click follows, and the UI reacts after that.
 */
export function clickAt(hit: string, arriveAt: number) {
  const clickTime = arriveAt + 0.12;

  return {
    steps: [
      { at: Math.max(0, arriveAt - TRAVEL), hit, offsetY: 30 },
      { at: arriveAt, hit },
      { at: clickTime, hit, click: true },
    ] as CursorStep[],
    clickTime,
    reactTime: clickTime + REACT,
  };
}

/**
 * Resolves waypoints against measured element positions and returns Web
 * Animations keyframes. Returns null if any targeted element is missing, so a
 * broken reference surfaces instead of the pointer silently jumping to 0,0.
 */
export function cursorFrames(
  steps: CursorStep[],
  duration: number,
  hits: HitMap,
): Keyframe[] | null {
  const missing = steps
    .map((step) => step.hit)
    .filter((hit): hit is string => !!hit && !hits[hit]);

  if (missing.length) {
    console.error(
      `VaultFlow: no [data-hit] element for ${[...new Set(missing)].join(', ')}`,
    );
    return null;
  }

  const frames: Keyframe[] = [];
  const at = (t: number) => Math.min(1, Math.max(0, t / duration));

  [...steps]
    .sort((a, b) => a.at - b.at)
    .forEach((step) => {
      const target = step.hit ? hits[step.hit] : { x: step.x ?? 0, y: step.y ?? 0 };
      const x = target.x;
      const y = target.y + (step.offsetY ?? 0);
      const pos = `translate(${x}px, ${y}px)`;

      if (step.click) {
        // A short dip and rebound, centred on the moment the click lands.
        frames.push(
          { offset: at(step.at - 0.08), transform: `${pos} scale(1)`, easing: 'ease-in' },
          { offset: at(step.at), transform: `${pos} scale(0.72)`, easing: 'ease-out' },
          { offset: at(step.at + 0.16), transform: `${pos} scale(1)` },
        );
      } else {
        frames.push({
          offset: at(step.at),
          transform: pos,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        });
      }
    });

  // Offsets must be non-decreasing; overlapping click pulses would violate it.
  for (let i = 1; i < frames.length; i += 1) {
    const prev = frames[i - 1].offset as number;
    if ((frames[i].offset as number) < prev) frames[i].offset = prev;
  }

  // Hold the last position to the end of the scene.
  //
  // Without an explicit offset-1 keyframe, Web Animations fills the remainder
  // from the final keyframe back to the element's *underlying* value — no
  // transform, i.e. the stage origin. That is what made the pointer glide to
  // the top-left corner after every last click.
  const last = frames[frames.length - 1];
  if (last && (last.offset as number) < 1) {
    frames.push({ offset: 1, transform: last.transform });
  }

  return frames;
}
