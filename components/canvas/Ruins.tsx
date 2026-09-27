"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  InstancedMesh,
  Matrix4,
  Object3D,
  PlaneGeometry,
  Shape,
  ShapeGeometry,
  ShaderMaterial,
  TorusGeometry,
  Vector3,
  type Group,
  type Material,
} from "three";
import { glsl } from "@/lib/glsl";
import { mulberry32 } from "@/lib/random";
import { NAVE } from "@/lib/world";
import { shaftSource } from "./fx";
import { createGlowMaterial, createStoneMaterial } from "./materials";
import { colors, shared } from "./uniforms";

type PillarKind = "tall" | "broken" | "stump";
const PATTERN: PillarKind[] = ["tall", "tall", "broken", "tall", "stump", "tall", "tall", "broken", "tall"];
const TALL = 7.4;

/** A column whose top rows are shattered by seeded jitter. Base sits at y = 0, height 1. */
function columnGeometry(seed: number, jagged: boolean): BufferGeometry {
  const geometry = new CylinderGeometry(0.46, 0.54, 1, 12, 8, false).translate(0, 0.5, 0);
  if (!jagged) return geometry;
  const rand = mulberry32(seed);
  const position = geometry.getAttribute("position");
  const v = new Vector3();
  for (let i = 0; i < position.count; i++) {
    v.fromBufferAttribute(position, i);
    if (v.y > 0.8) {
      const k = (v.y - 0.8) / 0.2;
      v.y -= k * rand() * 0.28;
      v.x *= 1 - k * rand() * 0.25;
      v.z *= 1 - k * rand() * 0.25;
      position.setXYZ(i, v.x, v.y, v.z);
    }
  }
  geometry.computeVertexNormals();
  return geometry;
}

function instanced(geometry: BufferGeometry, material: Material, matrices: Matrix4[]): InstancedMesh {
  const mesh = new InstancedMesh(geometry, material, matrices.length);
  matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.computeBoundingSphere();
  return mesh;
}

/** Soft additive light beam card: bright near the window, dusty, fading down its length. */
function createShaftMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: { uTime: shared.uTime, uColor: { value: colors.bone.clone().lerp(colors.gold, 0.5).multiplyScalar(0.32) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: glsl(/* glsl */ `
      #pragma include <noise>
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        float across = 1.0 - abs(vUv.x * 2.0 - 1.0);
        float along = smoothstep(0.0, 0.12, vUv.y) * pow(vUv.y, 1.4);
        float dust = 0.65 + 0.35 * snoise(vec3(vUv.x * 3.0, vUv.y * 8.0 + uTime * 0.05, uTime * 0.03));
        float a = across * across * along * dust;
        gl_FragColor = vec4(uColor * a, a);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `),
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });
}

/**
 * Chapter II's station: a drowned nave of broken pillars and ribbed arches,
 * lit through a single high window at the far end. The window is the source
 * for the god-ray pass; the ink pass turns the whole thing into hatching.
 */
export function Ruins() {
  const floorY = NAVE.floorY;
  const [wx, wy, wz] = NAVE.window;

  const scene = useMemo(() => {
    const stone = createStoneMaterial(colors.stone.clone().multiplyScalar(1.25));
    const floorStone = createStoneMaterial(colors.stone.clone().multiplyScalar(0.85), 0.97, true);
    const tallGeo = columnGeometry(1, false);
    const brokenGeo = columnGeometry(2, true);
    const stumpGeo = columnGeometry(3, true);
    const blockGeo = new BoxGeometry(1, 1, 1);
    const drumGeo = new CylinderGeometry(0.5, 0.5, 1, 12);
    const arcGeo = new TorusGeometry(NAVE.spacing / 2, 0.24, 5, 14, Math.PI);
    const ribGeo = new TorusGeometry(NAVE.halfWidth, 0.3, 5, 18, Math.PI);
    const brokenRibGeo = new TorusGeometry(NAVE.halfWidth, 0.3, 5, 14, Math.PI * 0.68);

    const dummy = new Object3D();
    const place = (x: number, y: number, z: number, sx: number, sy: number, sz: number, rx = 0, ry = 0, rz = 0) => {
      dummy.position.set(x, y, z);
      dummy.rotation.set(rx, ry, rz);
      dummy.scale.set(sx, sy, sz);
      dummy.updateMatrix();
      return dummy.matrix.clone();
    };

    const rand = mulberry32(77);
    const tall: Matrix4[] = [];
    const broken: Matrix4[] = [];
    const stumps: Matrix4[] = [];
    const blocks: Matrix4[] = [];
    const arcs: Matrix4[] = [];
    const rows = Math.floor((NAVE.zStart - NAVE.zEnd) / NAVE.spacing) + 1;

    for (const side of [-1, 1]) {
      for (let i = 0; i < rows; i++) {
        const z = NAVE.zStart - i * NAVE.spacing;
        const x = side * NAVE.halfWidth;
        const kind = PATTERN[(i + (side > 0 ? 3 : 0)) % PATTERN.length];
        blocks.push(place(x, floorY + 0.25, z, 1.5, 0.5, 1.5, 0, rand() * 0.3));
        if (kind === "tall") {
          tall.push(place(x, floorY + 0.5, z, 1, TALL, 1));
          blocks.push(place(x, floorY + 0.5 + TALL + 0.2, z, 1.35, 0.4, 1.35));
          const next = PATTERN[(i + 1 + (side > 0 ? 3 : 0)) % PATTERN.length];
          if (next === "tall" && i < rows - 1) {
            arcs.push(place(x, floorY + 0.9 + TALL, z - NAVE.spacing / 2, 1, 1, 1, 0, Math.PI / 2));
          }
        } else if (kind === "broken") {
          broken.push(place(x, floorY + 0.5, z, 1, 3.2 + rand() * 2.2, 1, 0, rand() * 6));
        } else {
          stumps.push(place(x, floorY + 0.5, z, 1, 1 + rand() * 0.8, 1, 0, rand() * 6));
        }
      }
    }

    // Fallen drums and rubble on the floor.
    const drums: Matrix4[] = [];
    for (let i = 0; i < 7; i++) {
      const z = NAVE.zStart - 4 - rand() * (NAVE.zStart - NAVE.zEnd - 6);
      const x = (rand() < 0.5 ? -1 : 1) * (1.6 + rand() * 1.4);
      drums.push(place(x, floorY + 0.5, z, 1, 1.2 + rand() * 0.8, 1, Math.PI / 2, rand() * Math.PI, 0));
    }
    for (let i = 0; i < 14; i++) {
      const s = 0.25 + rand() * 0.6;
      blocks.push(
        place((rand() - 0.5) * 6.5, floorY + s / 2, NAVE.zStart - rand() * (NAVE.zStart - NAVE.zEnd), s * 1.4, s, s, rand(), rand() * 3, rand()),
      );
    }

    // Transverse ribs across the nave; one of them broken.
    const ribs = [-4.5, -13, -21.5].map((z, i) =>
      place(0, floorY + 0.9 + TALL, z, 1, 1, 1, 0, 0, i === 1 ? 0.25 : 0),
    );

    const meshes = [
      instanced(tallGeo, stone, tall),
      instanced(brokenGeo, stone, broken),
      instanced(stumpGeo, stone, stumps),
      instanced(blockGeo, stone, blocks),
      instanced(arcGeo, stone, arcs),
      instanced(drumGeo, stone, drums),
      instanced(ribGeo, stone, [ribs[0], ribs[2]]),
      instanced(brokenRibGeo, stone, [ribs[1]]),
    ];

    // Floor and the far wall.
    const length = NAVE.zStart - wz + 8;
    const floorGeo = new PlaneGeometry(16, length).rotateX(-Math.PI / 2);
    const wallGeo = new PlaneGeometry(30, 26);

    // The high window: a pointed arch of hot, white-gold light.
    const arch = new Shape();
    arch.moveTo(-1.5, -3.6);
    arch.lineTo(1.5, -3.6);
    arch.lineTo(1.5, 1.8);
    arch.quadraticCurveTo(1.45, 3.2, 0, 4.2);
    arch.quadraticCurveTo(-1.45, 3.2, -1.5, 1.8);
    arch.closePath();
    const windowGeo = new ShapeGeometry(arch, 12);
    const windowMaterial = new ShaderMaterial({
      uniforms: { ...shared, uColor: { value: colors.bone.clone().lerp(colors.gold, 0.35).multiplyScalar(9) } },
      vertexShader: /* glsl */ `
        varying vec2 vPos;
        varying vec3 vWorldPos;
        void main() {
          vPos = position.xy;
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorldPos = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: glsl(/* glsl */ `
        #pragma include <fog>
        uniform vec3 uColor;
        varying vec2 vPos;
        varying vec3 vWorldPos;
        void main() {
          // Mullions: two dark bars split the light.
          float bar = step(abs(vPos.x), 0.07) + step(abs(vPos.y - 0.6), 0.07);
          vec3 color = uColor * (1.0 - clamp(bar, 0.0, 1.0) * 0.96);
          // Seen through the nave's fog, but bright enough to burn through it.
          vec3 rd = normalize(vWorldPos - cameraPosition);
          color = mix(color, fogTint(rd), fogAmount(vWorldPos) * 0.55);
          gl_FragColor = vec4(color, 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
      `),
    });
    const halo = createGlowMaterial(colors.gold.clone().lerp(colors.bone, 0.4), 0.7);
    const shaftGeo = new PlaneGeometry(2.2, 34);
    const shaft = createShaftMaterial();

    return { meshes, floorGeo, wallGeo, floorStone, stone, windowGeo, windowMaterial, halo, shaftGeo, shaft, length };
  }, [floorY, wz]);

  useEffect(
    () => () => {
      scene.meshes.forEach((m) => {
        m.geometry.dispose();
        m.dispose();
      });
      [scene.floorGeo, scene.wallGeo, scene.windowGeo, scene.shaftGeo].forEach((g) => g.dispose());
      [scene.floorStone, scene.stone, scene.windowMaterial, scene.halo, scene.shaft].forEach((m) => m.dispose());
    },
    [scene],
  );

  // Feed the god-ray pass, and only show the window from inside the nave
  // (from above, the fog sea would otherwise let its HDR glow bleed through).
  const lit = useRef<Group>(null);
  useFrame((state) => {
    const c = state.camera.position;
    shaftSource.position.set(wx, wy, wz);
    const inside = c.y < -4 && c.y > -12 && c.z > wz + 4;
    shaftSource.strength = inside ? 1 : 0;
    if (lit.current) lit.current.visible = c.y < -3;
  });

  const midZ = (NAVE.zStart + wz) / 2;
  return (
    <group>
      {scene.meshes.map((mesh, i) => (
        <primitive key={i} object={mesh} />
      ))}
      <mesh geometry={scene.floorGeo} material={scene.floorStone} position={[0, floorY, midZ]} receiveShadow />
      <mesh geometry={scene.wallGeo} material={scene.stone} position={[0, floorY + 11, wz - 0.4]} receiveShadow />
      <group ref={lit}>
      <mesh geometry={scene.windowGeo} material={scene.windowMaterial} position={[wx, wy, wz]} />
      <mesh geometry={scene.shaftGeo} material={scene.halo} position={[wx, wy + 0.3, wz + 0.2]} scale={[3, 0.2, 1]} renderOrder={2} />
      {[-0.9, 0.2, 1.1].map((x, i) => (
        <group key={i} position={[wx + x, wy - 1.2, wz + 0.5]} rotation={[-1.28 + i * 0.05, x * 0.12, 0]}>
          <mesh geometry={scene.shaftGeo} material={scene.shaft} position={[0, -17, 0]} renderOrder={2} />
          <mesh geometry={scene.shaftGeo} material={scene.shaft} position={[0, -17, 0]} rotation={[0, Math.PI / 2, 0]} renderOrder={2} />
        </group>
      ))}
      </group>
    </group>
  );
}
