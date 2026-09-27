/**
 * The stage: a tiny mutable store shared by the DOM (scroll choreography,
 * cursor, UI) and the WebGL scene.
 *
 * Why not React state? Scroll and pointer data change every frame. Writing
 * them to a plain object and reading it inside `useFrame` keeps the whole
 * descent at zero React re-renders. Discrete moments (chapter changes, the
 * hero impact, copy confirmations) go through `stageEvents` instead.
 */

import type { ChapterId } from "@/content/copy";

export interface StageState {
  /** Camera path position in control-point units (see lib/world.ts). */
  pathT: number;
  /** Active chapter index, 0–4. */
  chapter: number;
  /** 0–1 progress through the active chapter's hold range. */
  chapterProgress: number;
  /** Continuous relic focus, 0 … relics.length − 1 (stair-stepped for dwell). */
  relicFocus: number;
  /** Forge heat, 0 (ash) → 1 (gold), driven by the horizontal pin. */
  heat: number;
  /** Pointer in normalised device coordinates, −1…1. */
  pointer: { x: number; y: number };
  /** Whether a fine pointer has moved over the page yet. */
  pointerActive: boolean;
  /** 0–1: cursor is over an interactive element. Brightens the cursor light. */
  hover: number;
  /** 0–1: the pact circle is hovered/focused. */
  pact: number;
  /** Decaying spike (0–1) for transition chromatic aberration. */
  kick: number;
  /** Decaying spike (0–1) for the hero's impact moment. */
  impact: number;
  reducedMotion: boolean;
  /** Set once the first WebGL frame has rendered. */
  glReady: boolean;
  /** Post-process ink strength (0–1), written by the camera rig. */
  ink: number;
  /** Requests a frame when the canvas renders on demand (reduced motion). */
  invalidate: () => void;
}

export const stage: StageState = {
  pathT: 0,
  chapter: 0,
  chapterProgress: 0,
  relicFocus: 0,
  heat: 0,
  pointer: { x: 0, y: 0 },
  pointerActive: false,
  hover: 0,
  pact: 0,
  kick: 0,
  impact: 0,
  reducedMotion: false,
  glReady: false,
  ink: 0,
  invalidate: () => {},
};

export interface StageEventMap {
  /** Fired when the camera crosses into another chapter. */
  chapter: { index: number; id: ChapterId; direction: 1 | -1 };
  /** The hero wordmark lands. */
  impact: Record<string, never>;
  /** Ask the scroll director to travel to a chapter anchor. */
  navigate: { id: ChapterId };
  /** The WebGL layer drew its first frame. */
  glready: Record<string, never>;
}

const target = typeof window === "undefined" ? null : new EventTarget();

export function emit<K extends keyof StageEventMap>(type: K, detail: StageEventMap[K]): void {
  target?.dispatchEvent(new CustomEvent(type, { detail }));
}

export function on<K extends keyof StageEventMap>(
  type: K,
  handler: (detail: StageEventMap[K]) => void,
): () => void {
  if (!target) return () => {};
  const listener = (event: Event) => handler((event as CustomEvent<StageEventMap[K]>).detail);
  target.addEventListener(type, listener);
  return () => target.removeEventListener(type, listener);
}
