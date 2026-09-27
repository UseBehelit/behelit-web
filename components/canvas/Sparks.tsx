"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, MathUtils, PerspectiveCamera, ShaderMaterial } from "three";
import { glsl } from "@/lib/glsl";
import { mulberry32 } from "@/lib/random";
import { shared } from "./uniforms";

/**
 * Stateless sparks. Each spark is a ballistic arc p(t) = v·t + ½·g·t²,
 * evaluated in the vertex shader from its seed and the clock:
 *   bursts   — all sparks share a burst clock (every `interval` s); each
 *              burst re-hashes the directions, so no two bursts match
 *   fountain — every spark loops on its own phase for a steady spray
 */
const VERT = /* glsl */ `
  #pragma include <noise>
  uniform float uTime;
  uniform float uInterval;
  uniform float uFountain;
  uniform float uRate;
  uniform float uSpeed;
  uniform float uGravity;
  uniform float uSize;
  uniform float uScale;
  uniform float uSpread;
  attribute vec4 aSeed;
  varying float vAlpha;
  varying float vHeat;
  void main() {
    float t;
    float cycle;
    if (uFountain > 0.5) {
      float period = 0.8 + aSeed.w * 0.9;
      float phase = uTime * uRate + aSeed.w * period;
      cycle = floor(phase / period);
      t = mod(phase, period);
    } else {
      cycle = floor(uTime / uInterval);
      t = uTime - cycle * uInterval - aSeed.w * 0.07;
    }
    vec3 h = hash33(aSeed.xyz * 91.7 + cycle * 13.1);
    vec3 dir = normalize(vec3((h.x - 0.5) * uSpread, 0.55 + h.y, (h.z - 0.5) * uSpread));
    float speed = uSpeed * (0.35 + h.z * 0.9);
    vec3 p = dir * speed * t;
    p.y -= 0.5 * uGravity * t * t;
    float life = 0.55 + h.y * 0.75;
    float age = t / life;
    vAlpha = step(0.0, t) * step(age, 1.0) * (1.0 - smoothstep(0.55, 1.0, age));
    vHeat = 1.0 - age;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * uScale * (0.5 + h.x) / max(-mv.z, 0.1), 0.0, 48.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uIntensity;
  varying float vAlpha;
  varying float vHeat;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d2 = dot(uv, uv);
    float core = exp(-d2 * 90.0);
    float halo = exp(-d2 * 14.0) * 0.25;
    float a = (core + halo) * vAlpha;
    if (a < 0.003) discard;
    vec3 color = mix(vec3(1.0, 0.28, 0.05), vec3(1.0, 0.85, 0.55), vHeat) * (core * 9.0 + halo * 2.0) * uIntensity;
    gl_FragColor = vec4(color * a, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

type SparksProps = Readonly<{
  count: number;
  seed: number;
  /** Seconds between bursts; ignored by fountains. */
  interval?: number;
  fountain?: boolean;
  rate?: number;
  speed?: number;
  gravity?: number;
  size?: number;
  spread?: number;
  /** Brightness multiplier. */
  intensity?: number;
  /** Per-frame brightness source (e.g. the forge's heat); overrides `intensity`. */
  getIntensity?: () => number;
  position?: [number, number, number];
}>;

export function Sparks({
  count,
  seed,
  interval = 2.2,
  fountain = false,
  rate = 1,
  speed = 2.4,
  gravity = 3.2,
  size = 0.035,
  spread = 1.4,
  intensity = 1,
  getIntensity,
  position,
}: SparksProps) {
  const geometry = useMemo(() => {
    const rand = mulberry32(seed);
    const pos = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) seeds[i] = rand();
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new Float32BufferAttribute(seeds, 4));
    return g;
  }, [count, seed]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTime: shared.uTime,
          uInterval: { value: interval },
          uFountain: { value: fountain ? 1 : 0 },
          uRate: { value: rate },
          uSpeed: { value: speed },
          uGravity: { value: gravity },
          uSize: { value: size },
          uScale: { value: 800 },
          uSpread: { value: spread },
          uIntensity: { value: 1 },
        },
        vertexShader: glsl(VERT),
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    [interval, fountain, rate, speed, gravity, size, spread],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    const camera = state.camera as PerspectiveCamera;
    material.uniforms.uScale.value = state.gl.domElement.height / (2 * Math.tan(MathUtils.degToRad(camera.fov) / 2));
    material.uniforms.uIntensity.value = getIntensity ? getIntensity() : intensity;
  });

  return <points geometry={geometry} material={material} position={position} frustumCulled={false} renderOrder={6} />;
}
