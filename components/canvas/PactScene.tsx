"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { AdditiveBlending, CircleGeometry, CylinderGeometry, DoubleSide, ShaderMaterial } from "three";
import { glsl } from "@/lib/glsl";
import { stage } from "@/lib/stage";
import type { Vec3 } from "@/lib/world";
import { createStoneMaterial } from "./materials";
import { colors, damp, shared } from "./uniforms";

/**
 * The circle carved into the floor beneath the contact form — a 3D echo of
 * the DOM ritual circle. Everything is computed in polar coordinates:
 * engraved rings at fixed radii, and a band of runes where each angular cell
 * hashes to one of a few stroke patterns. Hovering the DOM circle (stage.pact)
 * floods the grooves with gold and closes a crimson line around the rim.
 */
const CIRCLE_FRAG = /* glsl */ `
  #pragma include <noise>
  #pragma include <fog>
  #pragma include <lighting>
  uniform float uTime;
  uniform float uActive;
  uniform vec3 uGold;
  uniform vec3 uCrimson;
  uniform vec3 uStone;
  varying vec3 vWorldPos;
  varying vec2 vLocal;

  float groove(float r, float radius, float width) {
    return 1.0 - smoothstep(width * 0.5, width, abs(r - radius));
  }

  // Distance from p to segment ab.
  float segment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
  }

  void main() {
    float r = length(vLocal) / 4.2;
    float a = atan(vLocal.y, vLocal.x);

    float lines = groove(r, 0.97, 0.012) + groove(r, 0.93, 0.006) + groove(r, 0.72, 0.01)
                + groove(r, 0.68, 0.005) + groove(r, 0.42, 0.009) + groove(r, 0.2, 0.012);

    // Rune band between r = 0.74 and 0.9: 40 cells around the circle.
    float cells = 40.0;
    float turn = a / 6.2831853 * cells + uTime * 0.04;
    float id = floor(turn);
    vec2 cellP = vec2(fract(turn) - 0.5, (r - 0.82) / 0.08);
    float h = hash11(id * 7.31);
    float rune = 1.0;
    rune = min(rune, segment(cellP, vec2(0.0, -0.8), vec2(0.0, 0.8)));
    if (h > 0.25) rune = min(rune, segment(cellP, vec2(-0.3, -0.5), vec2(0.3, 0.5)));
    if (h > 0.5) rune = min(rune, segment(cellP, vec2(-0.3, 0.3), vec2(0.3, 0.3)));
    if (h > 0.75) rune = min(rune, abs(length(cellP - vec2(0.0, -0.3)) - 0.25));
    float runeMask = (1.0 - smoothstep(0.05, 0.1, rune)) * step(abs(cellP.y), 1.0) * step(0.74, r) * step(r, 0.9);

    float carved = clamp(lines + runeMask, 0.0, 1.0);
    vec3 V = normalize(cameraPosition - vWorldPos);
    float grain = fbm(vec3(vLocal * 1.3, 2.0), 3) * 0.5 + 0.5;
    vec3 base = shade(uStone * (0.5 + 0.6 * grain), vec3(0.0, 1.0, 0.0), V, vWorldPos, 0.9, 0.0);
    base *= 0.55 * (1.0 - carved * 0.7);

    // Light pooling from the shaft above.
    base += uGold * exp(-r * r * 6.0) * 0.12;

    float pulse = 0.5 + 0.5 * sin(uTime * 1.6 - r * 9.0);
    vec3 glow = uGold * carved * (0.03 + uActive * (1.6 + 0.8 * pulse));
    float rim = groove(r, 0.985, 0.01) * uActive;
    glow += uCrimson * rim * 5.0;

    vec3 color = base + glow;
    float edgeFade = 1.0 - smoothstep(0.96, 1.0, r);
    gl_FragColor = vec4(applyFog(color, vWorldPos), edgeFade);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const SHAFT_FRAG = /* glsl */ `
  #pragma include <noise>
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uActive;
  varying vec2 vUv;
  varying vec3 vNormalV;
  void main() {
    // Soft cone of light: bright towards the floor, dust drifting through it.
    float facing = abs(normalize(vNormalV).z);
    float edge = pow(facing, 1.6);
    float fall = smoothstep(0.0, 0.9, 1.0 - vUv.y);
    float dust = 0.6 + 0.4 * snoise(vec3(vUv.x * 12.0, vUv.y * 6.0 - uTime * 0.08, uTime * 0.05));
    float a = edge * fall * dust * (0.1 + uActive * 0.12);
    gl_FragColor = vec4(uColor * a, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

type PactSceneProps = Readonly<{ center: Vec3 }>;

export function PactScene({ center }: PactSceneProps) {
  const [cx, cy, cz] = center;
  const assets = useMemo(() => {
    const floor = new CircleGeometry(14, 14).rotateX(-Math.PI / 2);
    const floorStone = createStoneMaterial(colors.stone.clone().multiplyScalar(0.7), 0.97, true);
    const disc = new CircleGeometry(4.2, 128).rotateX(-Math.PI / 2);
    const circle = new ShaderMaterial({
      uniforms: {
        ...shared,
        uActive: { value: 0 },
        uGold: { value: colors.gold },
        uCrimson: { value: colors.crimson },
        uStone: { value: colors.stone },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        varying vec2 vLocal;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorldPos = world.xyz;
          vLocal = position.xz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: glsl(CIRCLE_FRAG),
      transparent: true,
    });
    const cone = new CylinderGeometry(0.9, 3.4, 16, 32, 1, true);
    const shaft = new ShaderMaterial({
      uniforms: { uTime: shared.uTime, uColor: { value: colors.gold.clone().lerp(colors.bone, 0.3).multiplyScalar(0.9) }, uActive: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vNormalV;
        void main() {
          vUv = uv;
          vNormalV = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: glsl(SHAFT_FRAG),
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
    });
    return { floor, floorStone, disc, circle, cone, shaft };
  }, []);

  useEffect(
    () => () => {
      [assets.floor, assets.disc, assets.cone].forEach((g) => g.dispose());
      [assets.floorStone, assets.circle, assets.shaft].forEach((m) => m.dispose());
    },
    [assets],
  );

  useFrame((_, dt) => {
    const active = damp(assets.circle.uniforms.uActive.value, stage.pact, 3, dt);
    assets.circle.uniforms.uActive.value = active;
    assets.shaft.uniforms.uActive.value = active;
  });

  return (
    <group position={[cx, cy, cz]}>
      <mesh geometry={assets.floor} material={assets.floorStone} receiveShadow />
      <mesh geometry={assets.disc} material={assets.circle} position={[0, 0.02, 0]} renderOrder={1} />
      <mesh geometry={assets.cone} material={assets.shaft} position={[0, 8, 0]} renderOrder={2} />
    </group>
  );
}
