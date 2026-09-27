"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { DoubleSide, IcosahedronGeometry, Matrix4, ShaderMaterial, TetrahedronGeometry, TorusGeometry, Vector3, type Group } from "three";
import { glsl } from "@/lib/glsl";
import { stage } from "@/lib/stage";
import { SEED_POSITION } from "@/lib/world";
import seedFrag from "@/shaders/seed.frag.glsl";
import seedVert from "@/shaders/seed.vert.glsl";
import { createMonolith, seedShape } from "./geometry";
import { createCoreMaterial, createIronMaterial } from "./materials";
import { colors, damp, shared } from "./uniforms";

const SHARDS = 5;
const [SEED_X, SEED_Y, SEED_Z] = SEED_POSITION;
const inverse = new Matrix4();
const local = new Vector3();

type SeedProps = Readonly<{ octaves: number }>;

/**
 * The Seed: an original relic — a faceted stone-and-iron spindle whose plates
 * breathe apart around a crimson core. Two angular iron bands and a few
 * shards orbit it.
 */
export function Seed({ octaves }: SeedProps) {
  const root = useRef<Group>(null);
  const bands = useRef<Group>(null);
  const shards = useRef<Group>(null);
  const heat = useRef(0);

  const shell = useMemo(() => createMonolith(seedShape()), []);
  const coreGeometry = useMemo(() => new IcosahedronGeometry(0.62, 2), []);
  const bandGeometry = useMemo(() => new TorusGeometry(1.08, 0.035, 3, 7), []);
  const shardGeometry = useMemo(() => new TetrahedronGeometry(0.11, 0), []);

  const shellMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: glsl(seedVert),
        fragmentShader: glsl(seedFrag),
        uniforms: {
          ...shared,
          uPulse: { value: 1 },
          uHeat: { value: 0 },
          uMouse: { value: new Vector3() },
          uOctaves: { value: 3 },
          uCrimson: { value: colors.crimson },
          uEmber: { value: colors.ember },
          uGold: { value: colors.gold },
          uStone: { value: colors.seedStone },
          uIron: { value: colors.seedIron },
        },
        side: DoubleSide,
      }),
    [],
  );
  const coreMaterial = useMemo(() => createCoreMaterial(), []);
  const ironMaterial = useMemo(() => createIronMaterial(), []);

  useEffect(() => {
    shellMaterial.uniforms.uOctaves.value = octaves;
  }, [shellMaterial, octaves]);

  useEffect(
    () => () => {
      [shell, coreGeometry, bandGeometry, shardGeometry].forEach((g) => g.dispose());
      [shellMaterial, coreMaterial, ironMaterial].forEach((m) => m.dispose());
    },
    [shell, coreGeometry, bandGeometry, shardGeometry, shellMaterial, coreMaterial, ironMaterial],
  );

  useFrame((state, dt) => {
    const group = root.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const still = stage.reducedMotion;
    const pulse = still ? 0.35 : 1;

    group.rotation.y = still ? 0.4 : t * 0.07;
    group.position.y = SEED_Y + (still ? 0 : Math.sin(t * 0.52) * 0.07);
    if (bands.current) {
      bands.current.rotation.set(still ? 0.3 : 0.32 + Math.sin(t * 0.21) * 0.08, still ? 0 : -t * 0.18, 0.2);
    }
    if (shards.current) shards.current.rotation.y = still ? 0 : -t * 0.12;

    // Cursor light in the Seed's object space, for the plates that strain towards it.
    group.updateMatrixWorld();
    inverse.copy(group.matrixWorld).invert();
    local.copy(shared.uCursorPos.value).applyMatrix4(inverse);
    const proximity = Math.exp(-local.lengthSq() * 0.25);

    // Heat: the hero impact spikes it, cursor proximity warms it.
    heat.current = damp(heat.current, stage.impact * 0.9 + proximity * 0.35 + stage.hover * 0.1, 3.5, dt);

    const uniforms = shellMaterial.uniforms;
    uniforms.uPulse.value = pulse;
    uniforms.uHeat.value = heat.current;
    uniforms.uMouse.value.copy(local);
    coreMaterial.uniforms.uPulse.value = pulse;
    coreMaterial.uniforms.uHeat.value = heat.current;
  });

  return (
    <group ref={root} position={[SEED_X, SEED_Y, SEED_Z]}>
      <mesh geometry={shell} material={shellMaterial} castShadow />
      <mesh geometry={coreGeometry} material={coreMaterial} />
      <group ref={bands}>
        <mesh geometry={bandGeometry} material={ironMaterial} rotation={[Math.PI / 2, 0, 0]} castShadow />
        <mesh geometry={bandGeometry} material={ironMaterial} rotation={[Math.PI / 2.4, 0.5, 0]} scale={0.86} castShadow />
      </group>
      <group ref={shards}>
        {Array.from({ length: SHARDS }, (_, i) => {
          const angle = (i / SHARDS) * Math.PI * 2 + i * 0.37;
          const radius = 1.55 + (i % 2) * 0.35;
          return (
            <mesh
              key={i}
              geometry={shardGeometry}
              material={ironMaterial}
              position={[Math.cos(angle) * radius, -0.6 + i * 0.32, Math.sin(angle) * radius]}
              rotation={[i * 0.7, i * 1.3, i * 0.4]}
              scale={0.7 + (i % 3) * 0.35}
            />
          );
        })}
      </group>
    </group>
  );
}
