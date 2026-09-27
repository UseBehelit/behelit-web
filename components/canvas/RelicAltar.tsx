"use client";

import { useEffect, useMemo } from "react";
import { BoxGeometry, CircleGeometry, Color, PlaneGeometry } from "three";
import type { Relic as RelicData } from "@/content/relics";
import { DEFAULT_ACCENT } from "@/lib/palette";
import { mulberry32, hashString } from "@/lib/random";
import { createGlowMaterial, createStoneMaterial } from "./materials";
import { Relic } from "./Relic";
import { colors } from "./uniforms";

/** Colour of the light pooled on the altar top, by status. Vaulted altars are dark. */
function poolColor(relic: RelicData): Color | null {
  switch (relic.status) {
    case "live":
      return new Color(relic.accent ?? DEFAULT_ACCENT);
    case "forging":
      return colors.ember.clone();
    case "in-review":
      return colors.silver.clone().lerp(colors.gold, 0.3);
    default:
      return null;
  }
}

type RelicAltarProps = Readonly<{
  relic: RelicData;
  index: number;
  base: readonly [number, number, number];
  relicPosition: readonly [number, number, number];
  octaves: number;
  sparks: boolean;
}>;

/**
 * A stepped stone plinth on its own island of floor in the dark, with the
 * relic floating above. Vaulted altars are knocked askew.
 */
export function RelicAltar({ relic, index, base, relicPosition, octaves, sparks }: RelicAltarProps) {
  const seed = hashString(relic.id);
  const vaulted = relic.status === "vaulted";

  const parts = useMemo(() => {
    const rand = mulberry32(seed ^ 0x51ed);
    const tilt = vaulted ? 0.14 : 0.02;
    return [
      { size: [2.4, 0.3, 2.4], y: 0.15, rot: [0, rand() * 0.4, 0] },
      { size: [1.8, 0.28, 1.8], y: 0.44, rot: [0, rand() * 0.6, 0] },
      { size: [1.15, 1.05, 1.15], y: 1.1, rot: [0, 0.3 + rand() * 0.3, 0] },
      { size: [1.55, 0.2, 1.55], y: 1.72, rot: [tilt * (rand() - 0.5) * 2, rand() * 0.8, tilt] },
    ] as const;
  }, [seed, vaulted]);

  const geometries = useMemo(() => parts.map((p) => new BoxGeometry(p.size[0], p.size[1], p.size[2])), [parts]);
  const floor = useMemo(() => new CircleGeometry(5.5, 10).rotateX(-Math.PI / 2), []);
  const stone = useMemo(() => createStoneMaterial(colors.stone.clone().multiplyScalar(1.1)), []);
  const floorStone = useMemo(() => createStoneMaterial(colors.stone.clone().multiplyScalar(0.8), 0.97, true), []);
  const poolGeometry = useMemo(() => new PlaneGeometry(2.6, 2.6).rotateX(-Math.PI / 2), []);
  const pool = useMemo(() => {
    const color = poolColor(relic);
    return color ? createGlowMaterial(color, relic.status === "forging" ? 1.4 : 0.9) : null;
  }, [relic]);

  useEffect(
    () => () => {
      [...geometries, floor, poolGeometry].forEach((g) => g.dispose());
      [stone, floorStone, pool].forEach((m) => m?.dispose());
    },
    [geometries, floor, poolGeometry, stone, floorStone, pool],
  );

  return (
    <group>
      <group position={[base[0], base[1], base[2]]}>
        <mesh geometry={floor} material={floorStone} receiveShadow />
        {parts.map((part, i) => (
          <mesh
            key={i}
            geometry={geometries[i]}
            material={stone}
            position={[0, part.y, 0]}
            rotation={[part.rot[0], part.rot[1], part.rot[2]]}
            castShadow
            receiveShadow
          />
        ))}
        {pool ? <mesh geometry={poolGeometry} material={pool} position={[0, 1.83, 0]} renderOrder={2} /> : null}
      </group>
      <Relic relic={relic} index={index} position={relicPosition} octaves={octaves} sparks={sparks} />
    </group>
  );
}
