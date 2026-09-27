/**
 * Deterministic randomness. Every procedural shape on the page (panel frames,
 * speed lines, glyphs, geometry jitter, particles) is seeded, so server and
 * client render identical markup and the art never reshuffles between visits.
 */

/** mulberry32: tiny, fast, well-distributed 32-bit PRNG. Returns [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a string hash → 32-bit seed (e.g. a relic id). */
export function hashString(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function range(rand: () => number, min: number, max: number): number {
  return min + (max - min) * rand();
}

/** Round to a fixed number of decimals so SVG path strings stay compact and stable. */
export function r(value: number, digits = 2): number {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
}
