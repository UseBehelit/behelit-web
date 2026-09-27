"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  NormalBlending,
  PerspectiveCamera,
  ShaderMaterial,
  Vector3,
} from "three";
import { glsl } from "@/lib/glsl";
import { mulberry32 } from "@/lib/random";
import { stage } from "@/lib/stage";
import emberFrag from "@/shaders/ember.frag.glsl";
import emberVert from "@/shaders/ember.vert.glsl";
import { colors, damp, shared } from "./uniforms";

/** Camera-following box the field wraps inside (metres). */
const BOX = new Vector3(18, 13, 20);

function createField(count: number, seed: number): BufferGeometry {
  const rand = mulberry32(seed);
  const position = new Float32Array(count * 3);
  const seeds = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    position[i * 3] = rand() - 0.5;
    position[i * 3 + 1] = rand() - 0.5;
    position[i * 3 + 2] = rand() - 0.5;
    seeds[i * 4] = rand();
    seeds[i * 4 + 1] = rand();
    seeds[i * 4 + 2] = rand();
    seeds[i * 4 + 3] = rand();
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(position, 3));
  geometry.setAttribute("aSeed", new Float32BufferAttribute(seeds, 4));
  return geometry;
}

function createMaterial(ember: boolean): ShaderMaterial {
  return new ShaderMaterial({
    defines: ember ? { EMBER: "" } : {},
    uniforms: {
      ...shared,
      uScale: { value: 800 },
      uSize: { value: ember ? 0.06 : 0.042 },
      uRise: { value: ember ? 0.55 : 0.5 },
      uCurl: { value: ember ? 1.3 : 1.7 },
      uHeat: { value: 0 },
      uBoxCenter: { value: new Vector3() },
      uBoxSize: { value: BOX },
      uHot: { value: new Color("#ffd9a0") },
      uCool: { value: colors.crimson.clone().lerp(colors.ember, 0.35) },
      uAsh: { value: new Color("#8d877f") },
      uIntensity: { value: 1 },
      uFogTint: shared.uFogColor,
    },
    vertexShader: glsl(emberVert),
    fragmentShader: glsl(emberFrag),
    transparent: true,
    depthWrite: false,
    blending: ember ? AdditiveBlending : NormalBlending,
  });
}

type EmberFieldProps = Readonly<{ embers: number; ash: number }>;

/** 3k–8k GPU particles (quality tier decides): glowing embers and drifting ash. */
export function EmberField({ embers, ash }: EmberFieldProps) {
  const emberGeometry = useMemo(() => createField(embers, 7), [embers]);
  const ashGeometry = useMemo(() => createField(ash, 11), [ash]);
  const emberMaterial = useMemo(() => createMaterial(true), []);
  const ashMaterial = useMemo(() => createMaterial(false), []);
  const heat = useRef(0);

  useEffect(() => () => emberGeometry.dispose(), [emberGeometry]);
  useEffect(() => () => ashGeometry.dispose(), [ashGeometry]);
  useEffect(
    () => () => {
      emberMaterial.dispose();
      ashMaterial.dispose();
    },
    [emberMaterial, ashMaterial],
  );

  useFrame((state, dt) => {
    const camera = state.camera as PerspectiveCamera;
    const scale = state.gl.domElement.height / (2 * Math.tan(MathUtils.degToRad(camera.fov) / 2));
    const target = stage.chapter === 3 ? 0.25 + stage.heat * 0.75 : stage.chapter === 0 ? 0.12 : 0;
    heat.current = damp(heat.current, target, 2, dt);
    for (const material of [emberMaterial, ashMaterial]) {
      material.uniforms.uScale.value = scale;
      material.uniforms.uBoxCenter.value.copy(camera.position);
      material.uniforms.uHeat.value = heat.current;
    }
    emberMaterial.uniforms.uIntensity.value = 1 + heat.current * 0.8;
  });

  return (
    <>
      <points geometry={ashGeometry} material={ashMaterial} frustumCulled={false} renderOrder={4} />
      <points geometry={emberGeometry} material={emberMaterial} frustumCulled={false} renderOrder={5} />
    </>
  );
}
