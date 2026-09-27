/**
 * The Behelit palette — single source of truth for colour.
 *
 * `app/globals.css` mirrors these values as CSS custom properties (Tailwind v4
 * `@theme` tokens), and every shader receives them as uniforms built from this
 * file, so DOM and WebGL can never drift apart. If you change a value here,
 * change the matching `--color-*` token in `globals.css`.
 */
export const palette = {
  /** Background. Near-black with a cold violet cast. */
  abyss: "#07070A",
  /** Raised surfaces, panels. */
  ash: "#16161B",
  /** Fog, hairlines, disabled states. */
  fog: "#2A2B31",
  /** The Seed's core. Decoration only — 2.1:1 on abyss, never used for text. */
  crimson: "#8E0F1B",
  /** Heat, embers, sparks. 5.4:1 on abyss. */
  ember: "#E2572B",
  /** The only warm light that means hope: CTAs, focus, halos. 8.6:1 on abyss. */
  gold: "#C9A45C",
  /** Secondary text, metal. 7.8:1 on abyss. */
  silver: "#9AA3A8",
  /** Primary text. 15.6:1 on abyss. */
  bone: "#E8E2D6",
} as const;

export type PaletteKey = keyof typeof palette;

/**
 * sRGB hex → linear-light RGB triplet (0..1).
 * Shaders light in linear space; THREE.Color does the same conversion
 * automatically, this helper exists for code that builds raw typed arrays.
 */
export function toLinear(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return [channel((n >> 16) & 255), channel((n >> 8) & 255), channel(n & 255)];
}

/** Relic accent fallback: gold is the colour of things that shipped. */
export const DEFAULT_ACCENT = palette.gold;
