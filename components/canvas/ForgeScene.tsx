"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { BoxGeometry, CircleGeometry, Color, ExtrudeGeometry, PlaneGeometry, ShaderMaterial, Shape, Vector3, type Group } from "three";
import { glsl } from "@/lib/glsl";
import { stage } from "@/lib/stage";
import type { Vec3 } from "@/lib/world";
import { heatSources } from "./fx";
import { createGlowMaterial, createStoneMaterial } from "./materials";
import { Sparks } from "./Sparks";
import { colors, damp, shared } from "./uniforms";

/**
 * The anvil, as an abstract side profile extruded into a slab: foot, waist,
 * working face, a long tapering horn and a short heel.
 */
function anvilGeometry(): ExtrudeGeometry {
  const s = new Shape();
  s.moveTo(-1.3, 0);
  s.lineTo(1.3, 0);
  s.lineTo(1.1, 0.35);
  s.lineTo(0.55, 0.55);
  s.lineTo(0.6, 1.25);
  s.lineTo(1.35, 1.45);
  s.lineTo(1.55, 1.95);
  s.lineTo(-0.85, 1.95);
  s.quadraticCurveTo(-2.1, 1.95, -2.55, 1.72);
  s.quadraticCurveTo(-1.6, 1.52, -0.7, 1.3);
  s.lineTo(-0.6, 0.55);
  s.lineTo(-1.1, 0.35);
  s.closePath();
  const geometry = new ExtrudeGeometry(s, {
    depth: 1.05,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 1,
    curveSegments: 8,
  });
  geometry.translate(0, 0, -0.525);
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Hot iron. Heat collects on the upward-facing working face first, then
 * creeps down the body as it rises; noise breaks the glow into patches of
 * scale, and the black-body ramp carries it ash → ember → gold.
 */
function createAnvilMaterial(faceY: number): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: { ...shared, uHeat: { value: 0 }, uIron: { value: new Color("#5a6068") }, uFaceY: { value: faceY } },
    vertexShader: /* glsl */ `
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      varying vec3 vObjPos;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        vObjPos = position;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: glsl(/* glsl */ `
      #pragma include <noise>
      #pragma include <fog>
      #pragma include <lighting>
      uniform float uTime;
      uniform float uHeat;
      uniform vec3 uIron;
      uniform float uFaceY;
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      varying vec3 vObjPos;
      void main() {
        vec3 V = normalize(cameraPosition - vWorldPos);
        vec3 N = normalize(vNormalW);
        float pits = snoise(vObjPos * 9.0) * 0.5 + 0.5;
        vec3 color = shade(uIron * (0.4 + 0.4 * pits), N, V, vWorldPos, 0.35 + 0.3 * pits, 0.85);

        float face = smoothstep(0.55, 0.95, N.y);
        float height = smoothstep(uFaceY - 1.9 + uHeat * 1.1, uFaceY, vWorldPos.y);
        float n = fbm(vObjPos * 2.2 + vec3(0.0, uTime * 0.3, 0.0), 3) * 0.5 + 0.5;
        float temp = uHeat * (0.3 + 0.7 * max(face, height * 0.75)) * (0.7 + 0.45 * n);
        temp = clamp(temp, 0.0, 1.0);
        color *= 1.0 - 0.65 * smoothstep(0.2, 0.8, temp);
        color += heatRamp(temp) * 0.72;
        gl_FragColor = vec4(applyFog(color, vWorldPos), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `),
  });
}

type ForgeSceneProps = Readonly<{ anvil: Vec3; sparks: boolean }>;

/** Chapter IV's station: the anvil on its plinth, heating as the steps advance. */
export function ForgeScene({ anvil, sparks }: ForgeSceneProps) {
  const [ax, ay, az] = anvil;
  const heatGlow = useRef<Group>(null);
  const heat = useRef(0);
  const plinthTop = ay + 0.75;
  const faceY = plinthTop + 1.95;

  const assets = useMemo(() => {
    const anvilGeo = anvilGeometry();
    const anvilMat = createAnvilMaterial(faceY);
    const stepA = new BoxGeometry(4.4, 0.4, 2.8);
    const stepB = new BoxGeometry(3.6, 0.35, 2.2);
    const floor = new CircleGeometry(11, 12).rotateX(-Math.PI / 2);
    const stone = createStoneMaterial(colors.stone.clone().multiplyScalar(1.15));
    const floorStone = createStoneMaterial(colors.stone.clone().multiplyScalar(0.8), 0.97, true);
    const glowGeo = new PlaneGeometry(6, 3.2);
    const glow = createGlowMaterial(colors.ember.clone().lerp(colors.gold, 0.3), 1.5);
    return { anvilGeo, anvilMat, stepA, stepB, floor, stone, floorStone, glowGeo, glow };
  }, [faceY]);

  useEffect(
    () => () => {
      [assets.anvilGeo, assets.stepA, assets.stepB, assets.floor, assets.glowGeo].forEach((g) => g.dispose());
      [assets.anvilMat, assets.stone, assets.floorStone, assets.glow].forEach((m) => m.dispose());
    },
    [assets],
  );

  const heatPosition = useMemo(() => new Vector3(ax, faceY + 0.4, az), [ax, faceY, az]);
  useEffect(() => {
    heatSources.set("anvil", { position: heatPosition, strength: 0, radius: 2.6 });
    return () => {
      heatSources.delete("anvil");
    };
  }, [heatPosition]);

  useFrame((state, dt) => {
    heat.current = damp(heat.current, stage.heat, 3, dt);
    const h = heat.current;
    assets.anvilMat.uniforms.uHeat.value = h;
    assets.glow.uniforms.uOpacity.value = h * h * 0.9;
    const source = heatSources.get("anvil");
    if (source) source.strength = h;
    if (heatGlow.current) heatGlow.current.quaternion.copy(state.camera.quaternion);
  });

  const sparkIntensity = () => Math.max(0, heat.current - 0.35) * 1.6;

  return (
    <group>
      <mesh geometry={assets.floor} material={assets.floorStone} position={[ax, ay, az]} receiveShadow />
      <mesh geometry={assets.stepA} material={assets.stone} position={[ax, ay + 0.2, az]} castShadow receiveShadow />
      <mesh geometry={assets.stepB} material={assets.stone} position={[ax, ay + 0.575, az]} castShadow receiveShadow />
      <mesh geometry={assets.anvilGeo} material={assets.anvilMat} position={[ax, plinthTop, az]} castShadow receiveShadow />
      <group ref={heatGlow} position={[ax - 0.3, faceY + 0.25, az]}>
        <mesh geometry={assets.glowGeo} material={assets.glow} renderOrder={2} />
      </group>
      {sparks ? (
        <>
          <Sparks count={140} seed={404} fountain rate={0.9} speed={2.6} gravity={4.2} spread={1.8} position={[ax - 0.4, faceY + 0.05, az]} getIntensity={sparkIntensity} />
          <Sparks count={120} seed={405} interval={1.35} speed={3.6} gravity={5.5} spread={2.4} size={0.03} position={[ax + 0.2, faceY + 0.05, az]} getIntensity={sparkIntensity} />
        </>
      ) : null}
    </group>
  );
}
