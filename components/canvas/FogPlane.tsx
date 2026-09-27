"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  DoubleSide,
  InstancedBufferAttribute,
  InstancedMesh,
  Object3D,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
  type Mesh,
} from "three";
import { glsl } from "@/lib/glsl";
import { FOG_SEA_Y, SEED_POSITION, type Vec3 } from "@/lib/world";
import { colors, shared } from "./uniforms";

const VERT = /* glsl */ `
  varying vec3 vWorldPos;
  attribute float aLayer;
  attribute float aOpacity;
  varying float vLayer;
  varying float vOpacity;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    #ifdef USE_INSTANCING
      world = modelMatrix * instanceMatrix * vec4(position, 1.0);
      vLayer = aLayer;
      vOpacity = aOpacity;
    #else
      vLayer = 0.0;
      vOpacity = 1.0;
    #endif
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/**
 * The fog sea: the "endless dark plane" the Seed floats above. Two layers of
 * fbm roll across it in different directions; the core's crimson light pools
 * on the fog directly beneath the Seed and pulses with its breath.
 */
const SEA_FRAG = /* glsl */ `
  #pragma include <noise>
  #pragma include <fog>
  uniform float uTime;
  uniform vec3 uSeed;
  uniform vec3 uCrimson;
  uniform vec3 uAbyss;
  uniform int uOctaves;
  varying vec3 vWorldPos;
  varying float vLayer;
  varying float vOpacity;
  void main() {
    vec2 xz = vWorldPos.xz;
    float n1 = fbm(vec3(xz * 0.06 + vec2(uTime * 0.012, 0.0), uTime * 0.02), uOctaves);
    float n2 = fbm(vec3(xz * 0.17 - vec2(0.0, uTime * 0.025), 4.0), 2);
    float density = clamp(0.5 + 0.38 * n1 + 0.18 * n2, 0.0, 1.0);

    vec3 color = mix(uAbyss, uFogColor * 2.2 + vec3(0.012), density);

    // Core light on the fog: inverse-square-like gaussian pool, breathing at 0.2 Hz.
    float breath = pow(0.5 - 0.5 * cos(uTime * 1.25663706), 1.6);
    float d = length(xz - uSeed.xz);
    color += uCrimson * (0.45 + 0.55 * breath) * exp(-d * d * 0.16) * (0.3 + density);

    // Grazing sheen from the key light.
    vec3 V = normalize(cameraPosition - vWorldPos);
    color += uKeyColor * uKeyIntensity * pow(1.0 - abs(V.y), 5.0) * 0.06 * density;

    bool below = cameraPosition.y < vWorldPos.y;
    float alpha = below ? 0.45 * density : 0.96;
    gl_FragColor = vec4(applyFog(color, vWorldPos), alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/**
 * Mist sheets: stacked translucent layers of drifting noise. Crossing the
 * stack is what makes the camera feel like it's sinking through fog; each
 * sheet fades out as the camera nears its plane so the flat slice never shows.
 */
const MIST_FRAG = /* glsl */ `
  #pragma include <noise>
  #pragma include <fog>
  uniform float uTime;
  uniform vec3 uSeed;
  uniform vec3 uCrimson;
  varying vec3 vWorldPos;
  varying float vLayer;
  varying float vOpacity;
  void main() {
    vec2 xz = vWorldPos.xz;
    vec2 drift = vec2(uTime * (0.02 + vLayer * 0.015), -uTime * 0.012);
    float n = fbm(vec3(xz * (0.07 + vLayer * 0.03) + drift, vLayer * 11.0), 2) * 0.5 + 0.5;
    float a = smoothstep(0.32, 0.85, n) * 0.3 * vOpacity;
    a *= smoothstep(0.0, 1.7, abs(cameraPosition.y - vWorldPos.y));
    a *= 1.0 - smoothstep(18.0, 46.0, length(xz - cameraPosition.xz));
    if (a < 0.004) discard;
    vec3 rd = normalize(vWorldPos - cameraPosition);
    vec3 color = fogTint(rd) * 1.6 + vec3(0.01);
    float d = length(vWorldPos - uSeed);
    color += uCrimson * exp(-d * d * 0.09) * 0.08;
    gl_FragColor = vec4(color, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export interface MistLayer {
  center: Vec3;
  extent: number;
  opacity: number;
}

type FogPlaneProps = Readonly<{
  /** Extra ground-mist sheets for the stations below the fog sea. */
  mist: ReadonlyArray<MistLayer>;
  seaLayers: number;
  octaves: number;
}>;

const seed = new Vector3(...SEED_POSITION);

export function FogPlane({ mist, seaLayers, octaves }: FogPlaneProps) {
  const seaGeometry = useMemo(() => new PlaneGeometry(260, 260).rotateX(-Math.PI / 2), []);
  const sheetGeometry = useMemo(() => new PlaneGeometry(1, 1).rotateX(-Math.PI / 2), []);

  const seaMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { ...shared, uSeed: { value: seed }, uCrimson: { value: colors.crimson }, uAbyss: { value: colors.abyss }, uOctaves: { value: 3 } },
        vertexShader: VERT,
        fragmentShader: glsl(SEA_FRAG),
        transparent: true,
        side: DoubleSide,
      }),
    [],
  );

  const mistMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { ...shared, uSeed: { value: seed }, uCrimson: { value: colors.crimson } },
        vertexShader: VERT,
        fragmentShader: glsl(MIST_FRAG),
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      }),
    [],
  );

  // Sea sheets (sinking through the fog) + station ground mist, one draw call.
  const sheets = useMemo(() => {
    const layers: MistLayer[] = [];
    for (let i = 0; i < seaLayers; i++) {
      const y = FOG_SEA_Y - 0.7 - (i / Math.max(1, seaLayers - 1)) * 5.2;
      layers.push({ center: [0, y, -2], extent: 140, opacity: 1 - i * 0.06 });
    }
    return [...layers, ...mist];
  }, [seaLayers, mist]);

  const mesh = useMemo(() => {
    const instanced = new InstancedMesh(sheetGeometry, mistMaterial, sheets.length);
    const dummy = new Object3D();
    const layer = new Float32Array(sheets.length);
    const opacity = new Float32Array(sheets.length);
    sheets.forEach((sheet, i) => {
      dummy.position.set(...sheet.center);
      dummy.scale.set(sheet.extent, 1, sheet.extent);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
      layer[i] = (i % 7) / 7;
      opacity[i] = sheet.opacity;
    });
    instanced.geometry = sheetGeometry.clone();
    instanced.geometry.setAttribute("aLayer", new InstancedBufferAttribute(layer, 1));
    instanced.geometry.setAttribute("aOpacity", new InstancedBufferAttribute(opacity, 1));
    instanced.frustumCulled = false;
    instanced.renderOrder = 3;
    return instanced;
  }, [sheets, sheetGeometry, mistMaterial]);

  useEffect(() => {
    seaMaterial.uniforms.uOctaves.value = octaves;
  }, [seaMaterial, octaves]);

  useEffect(
    () => () => {
      mesh.geometry.dispose();
      mesh.dispose();
    },
    [mesh],
  );
  useEffect(
    () => () => {
      seaGeometry.dispose();
      sheetGeometry.dispose();
      seaMaterial.dispose();
      mistMaterial.dispose();
    },
    [seaGeometry, sheetGeometry, seaMaterial, mistMaterial],
  );

  // The sea only matters near chapter I; stop drawing it once we're deep below.
  const sea = useRef<Mesh>(null);
  useFrame((state) => {
    if (sea.current) sea.current.visible = state.camera.position.y > FOG_SEA_Y - 14;
  });

  return (
    <>
      <mesh ref={sea} geometry={seaGeometry} material={seaMaterial} position={[0, FOG_SEA_Y, 0]} renderOrder={1} />
      <primitive object={mesh} />
    </>
  );
}
