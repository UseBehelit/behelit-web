import { Color, Vector3 } from "three";
import { palette } from "@/lib/palette";

/**
 * Uniforms shared by every custom material. Materials spread this object into
 * their own `uniforms`, which copies the *references* — so the camera rig
 * updates fog, key light and cursor light once per frame and every shader
 * sees it.
 */
export const shared = {
  uTime: { value: 0 },
  uFogColor: { value: new Color(palette.abyss) },
  uFogDensity: { value: 0.03 },
  uFogFloor: { value: 0 },
  uFogFalloff: { value: 0.5 },
  uKeyColor: { value: new Color(palette.gold) },
  uKeyIntensity: { value: 1 },
  uKeyDir: { value: new Vector3(-0.4, 1, -0.4).normalize() },
  uAmbient: { value: 0.15 },
  uCursorPos: { value: new Vector3(0, 2, 3) },
  uCursorColor: { value: new Color(palette.ember).multiplyScalar(2.5) },
};

/** Palette as linear-light THREE.Colors (THREE.Color converts sRGB hex on construction). */
export const colors = {
  abyss: new Color(palette.abyss),
  ash: new Color(palette.ash),
  fog: new Color(palette.fog),
  crimson: new Color(palette.crimson),
  ember: new Color(palette.ember),
  gold: new Color(palette.gold),
  silver: new Color(palette.silver),
  bone: new Color(palette.bone),
  /** Weathered stone and dark iron, derived from ash/fog/silver. */
  stone: new Color("#34343a"),
  iron: new Color("#566069"),
  /** The Seed reads lighter than the architecture so its facets carry. */
  seedStone: new Color("#6a655d"),
  seedIron: new Color("#5d6770"),
  rust: new Color("#6b2f14"),
  moss: new Color("#3d4a2a"),
} as const;

/** Frame-rate independent exponential smoothing (same curve as THREE.MathUtils.damp). */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
