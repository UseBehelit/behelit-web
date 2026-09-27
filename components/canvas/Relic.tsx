"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Group,
  PlaneGeometry,
  ShaderMaterial,
  TetrahedronGeometry,
  TorusGeometry,
  Vector3,
  type Mesh,
} from "three";
import type { Relic as RelicData } from "@/content/relics";
import { glsl } from "@/lib/glsl";
import { DEFAULT_ACCENT } from "@/lib/palette";
import { hashString } from "@/lib/random";
import { stage } from "@/lib/stage";
import relicFrag from "@/shaders/relic.frag.glsl";
import relicVert from "@/shaders/relic.vert.glsl";
import { heatSources } from "./fx";
import { createMonolith, relicShape } from "./geometry";
import { createGlowMaterial, createIronMaterial } from "./materials";
import { Sparks } from "./Sparks";
import { colors, damp, shared } from "./uniforms";

const STATUS_UNIFORMS = {
  live: { uLive: 1, uForge: 0, uCharge: 0, uDecay: 0 },
  forging: { uLive: 0, uForge: 1, uCharge: 0, uDecay: 0 },
  "in-review": { uLive: 0, uForge: 0, uCharge: 1, uDecay: 0 },
  vaulted: { uLive: 0, uForge: 0, uCharge: 0, uDecay: 1 },
} as const;

/** The in-review "twin": the relic's outline again, larger, as a faint afterimage. */
function createTwinMaterial(accent: Color): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: { uColor: { value: accent.clone().multiplyScalar(0.9) }, uTime: shared.uTime },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - world.xyz);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uTime;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.5);
        float a = rim * (0.35 + 0.15 * sin(uTime * 1.3));
        gl_FragColor = vec4(uColor * a, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });
}

/** Thin ring whose arc fills as the review "charges", then resets. */
function createFillMaterial(color: Color): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: { uColor: { value: color.clone().multiplyScalar(2.2) }, uFill: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uFill;
      varying vec3 vPos;
      void main() {
        // Angle from 12 o'clock, clockwise, in [0, 1).
        float a = fract(atan(vPos.x, vPos.y) / 6.2831853 + 1.0);
        float lit = step(a, uFill);
        float head = exp(-pow((a - uFill) * 60.0, 2.0)) * 2.0;
        vec3 color = uColor * (0.12 + lit * 0.9 + head);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  });
}

type RelicProps = Readonly<{
  relic: RelicData;
  index: number;
  position: readonly [number, number, number];
  octaves: number;
  sparks: boolean;
}>;

/**
 * One relic above its altar. Status decides everything: which shader branch
 * lights it, and which extras orbit it (halo, sparks, fill ring, twin).
 */
export function Relic({ relic, index, position, octaves, sparks }: RelicProps) {
  const group = useRef<Group>(null);
  const body = useRef<Mesh>(null);
  const twin = useRef<Mesh>(null);
  const focus = useRef(0);
  const seed = useMemo(() => hashString(relic.id), [relic.id]);
  const accent = useMemo(() => new Color(relic.accent ?? DEFAULT_ACCENT), [relic.accent]);
  const status = relic.status;

  const geometry = useMemo(() => createMonolith(relicShape(seed)), [seed]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: glsl(relicVert),
        fragmentShader: glsl(relicFrag),
        uniforms: {
          ...shared,
          uLive: { value: 0 },
          uForge: { value: 0 },
          uCharge: { value: 0 },
          uDecay: { value: 0 },
          uFocus: { value: 0 },
          uOctaves: { value: 3 },
          uAccent: { value: accent },
          uCrimson: { value: colors.crimson },
          uGold: { value: colors.gold },
          uStone: { value: colors.stone },
          uIron: { value: colors.iron },
          uRust: { value: colors.rust },
          uMoss: { value: colors.moss },
        },
        side: DoubleSide,
      }),
    [accent],
  );

  useEffect(() => {
    const values = STATUS_UNIFORMS[status];
    for (const [name, value] of Object.entries(values)) material.uniforms[name].value = value;
  }, [material, status]);

  useEffect(() => {
    material.uniforms.uOctaves.value = octaves;
  }, [material, octaves]);

  const halo = useMemo(() => (status === "live" ? createGlowMaterial(accent, 0.95, 0.7) : null), [status, accent]);
  const twinMaterial = useMemo(() => (status === "in-review" ? createTwinMaterial(accent) : null), [status, accent]);
  const fillMaterial = useMemo(() => (status === "in-review" ? createFillMaterial(colors.gold) : null), [status]);
  const ringGeometry = useMemo(() => new TorusGeometry(0.95, 0.008, 4, 160), []);
  const haloGeometry = useMemo(() => new PlaneGeometry(2.7, 2.7), []);
  const debrisGeometry = useMemo(() => new TetrahedronGeometry(0.06, 0), []);
  const debrisMaterial = useMemo(() => (status === "vaulted" ? createIronMaterial(colors.rust) : null), [status]);

  useEffect(
    () => () => {
      [geometry, ringGeometry, haloGeometry, debrisGeometry].forEach((g) => g.dispose());
      [material, halo, twinMaterial, fillMaterial, debrisMaterial].forEach((m) => m?.dispose());
    },
    [geometry, ringGeometry, haloGeometry, debrisGeometry, material, halo, twinMaterial, fillMaterial, debrisMaterial],
  );

  // Forging relics bend the air above them (HeatHaze post effect).
  const heatKey = `relic-${relic.id}`;
  const heatPosition = useMemo(() => new Vector3(position[0], position[1] + 0.5, position[2]), [position]);
  useEffect(() => {
    if (status !== "forging") return;
    heatSources.set(heatKey, { position: heatPosition, strength: 0, radius: 1.6 });
    return () => {
      heatSources.delete(heatKey);
    };
  }, [status, heatKey, heatPosition]);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const still = stage.reducedMotion;

    // Focus: 1 while the camera dwells at this altar.
    const target = stage.chapter === 2 ? Math.max(0, 1 - Math.abs(stage.relicFocus - index)) : 0;
    focus.current = damp(focus.current, target, 3, dt);
    material.uniforms.uFocus.value = focus.current;

    const bob = still || status === "vaulted" ? 0 : Math.sin(t * 0.8 + index) * 0.06;
    g.position.set(position[0], position[1] + bob, position[2]);
    if (body.current) {
      const spin = status === "live" ? 0.22 : status === "in-review" ? 0.12 : status === "forging" ? 0.05 : 0.02;
      body.current.rotation.y = still ? 0.6 : t * spin + index;
    }
    if (twin.current) twin.current.rotation.y = still ? -0.3 : -t * 0.2;
    if (halo) {
      halo.uniforms.uOpacity.value = 0.4 + 0.15 * Math.sin(t * 0.7) + focus.current * 0.25;
    }
    if (fillMaterial) {
      fillMaterial.uniforms.uFill.value = still ? 0.72 : (t % 6.5) / 6.5;
    }
    const heat = heatSources.get(heatKey);
    if (heat) heat.strength = 0.35 + focus.current * 0.65;
  });

  return (
    <group ref={group} position={[position[0], position[1], position[2]]}>
      {halo ? (
        <Billboard>
          <mesh geometry={haloGeometry} material={halo} renderOrder={2} />
        </Billboard>
      ) : null}
      <mesh ref={body} geometry={geometry} material={material} castShadow />
      {twinMaterial ? <mesh ref={twin} geometry={geometry} material={twinMaterial} scale={1.18} renderOrder={3} /> : null}
      {fillMaterial ? (
        <mesh geometry={ringGeometry} material={fillMaterial} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} />
      ) : null}
      {status === "forging" && sparks ? (
        <Sparks count={90} seed={seed} interval={1.9 + (seed % 7) * 0.1} speed={2.1} gravity={3} position={[0, 0.3, 0]} />
      ) : null}
      {debrisMaterial
        ? Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2 + seed * 0.001;
            return (
              <mesh
                key={i}
                geometry={debrisGeometry}
                material={debrisMaterial}
                position={[Math.cos(a) * (0.9 + (i % 3) * 0.2), -0.6 + (i % 4) * 0.35, Math.sin(a) * (0.9 + (i % 2) * 0.25)]}
                rotation={[i, i * 2.1, i * 0.7]}
                scale={0.8 + (i % 3) * 0.5}
              />
            );
          })
        : null}
    </group>
  );
}

/** Keeps its children facing the camera (halo cards). */
function Billboard({ children }: Readonly<{ children: React.ReactNode }>) {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    ref.current?.quaternion.copy(state.camera.quaternion);
  });
  return <group ref={ref}>{children}</group>;
}
