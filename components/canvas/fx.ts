import { Vector3 } from "three";

/**
 * Screen-space effects need to know where certain things are in the world.
 * Scene components write here each frame; PostFX reads and projects.
 */

export interface HeatSource {
  position: Vector3;
  /** 0–1, fades the shimmer in and out. */
  strength: number;
  /** World-space radius of the shimmer. */
  radius: number;
}

/** Things hot enough to bend light: forging relics, the anvil. */
export const heatSources = new Map<string, HeatSource>();

/** The nave's high window — the light the god-ray pass rakes from. */
export const shaftSource = {
  position: new Vector3(),
  /** 0–1 set by the scene; PostFX multiplies by on-screen visibility. */
  strength: 0,
};
