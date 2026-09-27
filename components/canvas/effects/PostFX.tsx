"use client";

import { useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode, type ChromaticAberrationEffect } from "postprocessing";
import { useEffect, useMemo, useRef } from "react";
import { HalfFloatType, MathUtils, Vector2, Vector3 } from "three";
import type { QualitySettings } from "@/lib/quality";
import { stage } from "@/lib/stage";
import { heatSources, shaftSource } from "../fx";
import { damp } from "../uniforms";
import { HeatHazeEffect } from "./HeatHazeEffect";
import { InkEffect } from "./InkEffect";
import { LightShaftsEffect } from "./LightShaftsEffect";

const projected = new Vector3();
const screen = new Vector2();
const edge = new Vector3();

/**
 * The post chain, in order:
 *   Bloom (HDR threshold ≈ 1 → only crimson/gold/ember emissives glow)
 *   → light shafts (god rays from the nave window, high tier)
 *   → ACES tone mapping
 *   → Ink (crosshatching, per-chapter amount)
 *   → heat haze (UV shimmer around hot things)
 *   → chromatic aberration (barely there; spikes on page turns)
 *   → film grain → vignette
 * postprocessing merges neighbours into as few passes as its rules allow.
 */
export function PostFX({ quality }: Readonly<{ quality: QualitySettings }>) {
  const ink = useMemo(() => new InkEffect(), []);
  const haze = useMemo(() => new HeatHazeEffect(), []);
  const shafts = useMemo(() => new LightShaftsEffect(28), []);
  const aberration = useRef<ChromaticAberrationEffect>(null);
  const smooth = useRef({ ink: 0, shafts: 0 });

  useEffect(() => {
    ink.setQuality(quality.ink.directions, quality.ink.sobel);
  }, [ink, quality.ink.directions, quality.ink.sobel]);

  useEffect(
    () => () => {
      ink.dispose();
      haze.dispose();
      shafts.dispose();
    },
    [ink, haze, shafts],
  );

  useFrame((state, dt) => {
    const camera = state.camera;
    const s = smooth.current;
    s.ink = damp(s.ink, stage.ink, 3, dt);
    ink.amount = s.ink;
    ink.pixelRatio = state.gl.getPixelRatio();

    // God rays: project the window; fade as it leaves the frame or goes behind us.
    projected.copy(shaftSource.position).project(camera);
    const inFront = projected.z < 1;
    const onScreen = Math.max(Math.abs(projected.x), Math.abs(projected.y));
    const visibility = inFront ? 1 - MathUtils.smoothstep(onScreen, 1.0, 1.6) : 0;
    s.shafts = damp(s.shafts, shaftSource.strength * visibility, 2.5, dt);
    shafts.sun.set(projected.x * 0.5 + 0.5, projected.y * 0.5 + 0.5);
    shafts.intensity = s.shafts * 1.4;

    // Heat haze: the two strongest on-screen sources.
    let slot: 0 | 1 = 0;
    for (const source of heatSources.values()) {
      if (slot > 1 || source.strength < 0.02) continue;
      projected.copy(source.position).project(camera);
      if (projected.z > 1 || Math.abs(projected.x) > 1.3 || Math.abs(projected.y) > 1.3) continue;
      // Radius: project a point `radius` above the source to get it in screen units.
      edge.copy(source.position).setY(source.position.y + source.radius).project(camera);
      const radius = Math.max(0.02, Math.abs(edge.y - projected.y) * 0.5);
      screen.set(projected.x * 0.5 + 0.5, projected.y * 0.5 + 0.5);
      haze.setSource(slot, screen, radius, source.strength);
      slot = (slot + 1) as 0 | 1;
    }
    for (let i = slot; i < 2; i++) haze.setSource(i as 0 | 1, screen, 0.1, 0);

    // Chromatic aberration: a whisper, plus a spike when a page turns.
    const offset = 0.00045 + stage.kick * 0.005;
    aberration.current?.offset.set(offset, offset * 0.6);
  });

  return (
    <EffectComposer multisampling={quality.msaa} frameBufferType={HalfFloatType}>
      {quality.bloom ? (
        <Bloom
          mipmapBlur
          luminanceThreshold={1}
          luminanceSmoothing={0.3}
          intensity={1.2}
          radius={0.78}
          levels={quality.bloom.levels}
          resolutionScale={quality.bloom.resolutionScale}
        />
      ) : null}
      {quality.godRays ? <primitive object={shafts} dispose={null} /> : null}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <primitive object={ink} dispose={null} />
      {quality.heatHaze ? <primitive object={haze} dispose={null} /> : null}
      {quality.chromaticAberration ? (
        <ChromaticAberration ref={aberration} offset={[0.00045, 0.0003]} radialModulation modulationOffset={0.3} />
      ) : null}
      {quality.grain ? <Noise premultiply={false} blendFunction={BlendFunction.OVERLAY} opacity={0.11} /> : null}
      <Vignette offset={0.26} darkness={0.78} />
    </EffectComposer>
  );
}
