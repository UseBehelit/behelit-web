/**
 * An invented script for the ritual circle, assembled from code punctuation
 * (brackets, braces, angle marks, slashes) and plain geometry (dots, bars,
 * rings, triangles). Every glyph is a seeded combination of one "spine" and
 * one or two "marks", drawn in a 20×20 cell centred on the origin. It isn't
 * modelled on any existing alphabet.
 */

import { mulberry32, r } from "@/lib/random";

const SPINES: ReadonlyArray<string> = [
  "M0 -8 L0 8", // stem |
  "M5 -8 L-2 -8 L-2 8 L5 8", // [
  "M-5 -8 L2 -8 L2 8 L-5 8", // ]
  "M5 -7 L-4 0 L5 7", // <
  "M-5 -7 L4 0 L-5 7", // >
  "M-5 8 L5 -8", // /
  "M-5 -8 L5 8", // \
  "M4 -8 Q-1 -8 0 -3 Q0 0 -4 0 Q0 0 0 3 Q-1 8 4 8", // {
  "M-4 -8 Q1 -8 0 -3 Q0 0 4 0 Q0 0 0 3 Q1 8 -4 8", // }
  "M-6 -6 L0 6 L6 -6", // chevron
];

const MARKS: ReadonlyArray<(rand: () => number) => string> = [
  // dot
  (rand) => {
    const x = r((rand() - 0.5) * 10, 1);
    const y = r((rand() - 0.5) * 12, 1);
    return `M${x - 1.4} ${y} a1.4 1.4 0 1 0 2.8 0 a1.4 1.4 0 1 0 -2.8 0`;
  },
  // bar
  (rand) => {
    const y = r((rand() - 0.5) * 12, 1);
    return `M-6 ${y} L6 ${y}`;
  },
  // ring
  () => "M-3.6 0 a3.6 3.6 0 1 0 7.2 0 a3.6 3.6 0 1 0 -7.2 0",
  // triangle
  () => "M0 -5 L4.5 3.5 L-4.5 3.5 Z",
  // tick pair
  (rand) => {
    const x = r(2 + rand() * 3, 1);
    return `M${x} -3 L${x} 3 M${-x} -3 L${-x} 3`;
  },
];

/** Deterministic glyph path for a given seed. */
export function glyphPath(seed: number): string {
  const rand = mulberry32(seed);
  const spine = SPINES[Math.floor(rand() * SPINES.length)];
  const marks = 1 + Math.floor(rand() * 2);
  let d = spine;
  for (let i = 0; i < marks; i++) {
    d += " " + MARKS[Math.floor(rand() * MARKS.length)](rand);
  }
  return d;
}

export interface RingSpec {
  radius: number;
  count: number;
  scale: number;
  seed: number;
}

export interface PlacedGlyph {
  d: string;
  transform: string;
}

/** Lay a ring of glyphs around (cx, cy), each rotated to face outwards. */
export function placeRing(ring: RingSpec, cx: number, cy: number): PlacedGlyph[] {
  return Array.from({ length: ring.count }, (_, i) => {
    const angle = (i / ring.count) * 360;
    const rad = (angle * Math.PI) / 180;
    const x = r(cx + Math.sin(rad) * ring.radius, 2);
    const y = r(cy - Math.cos(rad) * ring.radius, 2);
    return {
      d: glyphPath(ring.seed * 1000 + i),
      transform: `translate(${x} ${y}) rotate(${r(angle, 2)}) scale(${ring.scale})`,
    };
  });
}
