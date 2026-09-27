"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BackSide, ShaderMaterial, SphereGeometry, Vector3, type Mesh } from "three";
import { glsl } from "@/lib/glsl";
import { SEED_POSITION } from "@/lib/world";
import { colors, damp, shared } from "./uniforms";

/**
 * The void behind everything: a camera-centred dome shaded as fog seen to
 * infinity. Haze thickens towards the horizon, the key light scatters a halo,
 * slow fbm mottles it like drifting cloud, and near the surface the Seed's
 * crimson glow bleeds through.
 */
const FRAG = /* glsl */ `
  #pragma include <noise>
  #pragma include <fog>
  uniform float uTime;
  uniform vec3 uAbyss;
  uniform vec3 uCrimson;
  uniform vec3 uSeed;
  uniform float uSeedGlow;
  varying vec3 vWorldPos;
  void main() {
    vec3 rd = normalize(vWorldPos - cameraPosition);
    // At the horizon the dome is exactly the colour distant surfaces fog out
    // to (fogTint), so the fog sea's far edge dissolves into it with no seam.
    vec3 color = fogTint(rd);
    float away = smoothstep(0.08, 0.85, abs(rd.y));
    // Overhead and underfoot fall away into the abyss…
    color = mix(color, uAbyss * 0.5, away * 0.8);
    // …and only there does the haze break into slow, mottled cloud.
    float clouds = fbm(rd * 3.2 + vec3(0.0, uTime * 0.008, uTime * 0.004), 3);
    color *= 1.0 + 0.45 * clouds * smoothstep(0.02, 0.3, abs(rd.y));
    // A faint crimson bloom where the Seed hangs above the sea.
    vec3 toSeed = normalize(uSeed - cameraPosition);
    color += uCrimson * pow(max(dot(rd, toSeed), 0.0), 60.0) * uSeedGlow * smoothstep(-0.05, 0.1, rd.y);
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export function Atmosphere() {
  const dome = useRef<Mesh>(null);
  const geometry = useMemo(() => new SphereGeometry(90, 40, 20), []);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          ...shared,
          uAbyss: { value: colors.abyss },
          uCrimson: { value: colors.crimson },
          uSeed: { value: new Vector3(...SEED_POSITION) },
          uSeedGlow: { value: 1 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vWorldPos;
          void main() {
            vec4 world = modelMatrix * vec4(position, 1.0);
            vWorldPos = world.xyz;
            gl_Position = projectionMatrix * viewMatrix * world;
          }
        `,
        fragmentShader: glsl(FRAG),
        side: BackSide,
        depthWrite: false,
        depthTest: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, dt) => {
    const mesh = dome.current;
    if (!mesh) return;
    mesh.position.copy(state.camera.position);
    // The Seed's glow only reads while we're still near the surface.
    const target = state.camera.position.y > -6 ? 0.3 : 0;
    material.uniforms.uSeedGlow.value = damp(material.uniforms.uSeedGlow.value, target, 1.5, dt);
  });

  return <mesh ref={dome} geometry={geometry} material={material} renderOrder={-10} frustumCulled={false} />;
}
