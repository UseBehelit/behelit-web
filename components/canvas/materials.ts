import {
  AdditiveBlending,
  Color,
  DoubleSide,
  FrontSide,
  MeshStandardMaterial,
  ShaderMaterial,
  type WebGLProgramParametersWithUniforms,
} from "three";
import { glsl } from "@/lib/glsl";
import { colors, shared } from "./uniforms";

/**
 * Small materials whose shaders are short enough to live inline. The big ones
 * (Seed, relics, embers, ink) have their own files in /shaders.
 */

const FOOTER = /* glsl */ `
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`;

/** Pass-through vertex shader: world position + world normal. */
const WORLD_VERT = /* glsl */ `
  varying vec3 vWorldPos;
  varying vec3 vNormalW;
  varying vec3 vObjPos;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    #ifdef USE_INSTANCING
      world = modelMatrix * instanceMatrix * vec4(position, 1.0);
      vNormalW = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
    #else
      vNormalW = normalize(mat3(modelMatrix) * normal);
    #endif
    vWorldPos = world.xyz;
    vObjPos = position;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/**
 * The Seed's core: a crimson heart seen only through the gaps in the shell.
 * Its brightness beats with the breath (same 0.2 Hz phase) and flickers with
 * noise; the view-facing centre burns hotter than the limb.
 */
export function createCoreMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: { ...shared, uPulse: { value: 1 }, uHeat: { value: 0 }, uCrimson: { value: colors.crimson }, uEmber: { value: colors.ember } },
    vertexShader: WORLD_VERT,
    fragmentShader: glsl(/* glsl */ `
      #pragma include <noise>
      uniform float uTime;
      uniform float uPulse;
      uniform float uHeat;
      uniform vec3 uCrimson;
      uniform vec3 uEmber;
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      varying vec3 vObjPos;
      void main() {
        vec3 V = normalize(cameraPosition - vWorldPos);
        float facing = max(dot(normalize(vNormalW), V), 0.0);
        float breath = pow(0.5 - 0.5 * cos(uTime * 1.25663706), 1.6);
        float flicker = snoise(vObjPos * 3.0 + vec3(0.0, uTime * 0.9, 0.0)) * 0.5 + 0.5;
        float heat = 5.0 + 5.0 * breath * uPulse + 3.0 * flicker + 8.0 * uHeat;
        vec3 color = mix(uCrimson, uEmber, facing * facing * 0.5) * heat * (0.35 + 0.65 * facing);
        gl_FragColor = vec4(color, 1.0);
        ${FOOTER}
      }
    `),
  });
}

/** Dark hammered iron for bands, shards and relic fittings. */
export function createIronMaterial(tint: Color = colors.iron): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: { ...shared, uAlbedo: { value: tint } },
    vertexShader: WORLD_VERT,
    fragmentShader: glsl(/* glsl */ `
      #pragma include <noise>
      #pragma include <fog>
      #pragma include <lighting>
      uniform vec3 uAlbedo;
      varying vec3 vWorldPos;
      varying vec3 vNormalW;
      varying vec3 vObjPos;
      void main() {
        vec3 V = normalize(cameraPosition - vWorldPos);
        vec3 N = normalize(vNormalW);
        if (!gl_FrontFacing) N = -N;
        float pits = snoise(vObjPos * 22.0) * 0.5 + 0.5;
        vec3 albedo = uAlbedo * (0.45 + 0.4 * pits);
        vec3 color = shade(albedo, N, V, vWorldPos, 0.32 + 0.3 * pits, 0.92);
        gl_FragColor = vec4(applyFog(color, vWorldPos), 1.0);
        ${FOOTER}
      }
    `),
    side: DoubleSide,
  });
}

/**
 * A soft additive glow card (billboarded by the caller): halos, light pools,
 * the high window. `uColor` is HDR, so the bloom pass catches it.
 */
export function createGlowMaterial(color: Color, intensity: number, ring = 0): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      uColor: { value: color.clone().multiplyScalar(intensity) },
      uRing: { value: ring },
      uOpacity: { value: 1 },
      uTime: shared.uTime,
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uRing;
      uniform float uOpacity;
      uniform float uTime;
      varying vec2 vUv;
      void main() {
        float d = length(vUv - 0.5) * 2.0;
        // uRing = 0: a gaussian disc. uRing > 0: a ring of that radius.
        float disc = exp(-d * d * 4.0);
        float ring = exp(-pow((d - uRing) * 14.0, 2.0)) + exp(-pow((d - uRing) * 4.0, 2.0)) * 0.18;
        float shape = mix(disc, ring, step(0.001, uRing));
        shape *= 1.0 - smoothstep(0.92, 1.0, d);
        float a = shape * uOpacity;
        gl_FragColor = vec4(uColor * a, a);
        ${FOOTER}
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: FrontSide,
  });
}

/**
 * Weathered stone for architecture (pillars, altars, anvil plinth, floors).
 * It's a MeshStandardMaterial so it receives the key light's real-time
 * shadows; onBeforeCompile swaps three's fog for the shared height fog and
 * breaks up the flat albedo with world-space noise.
 */
export function createStoneMaterial(
  color: Color = colors.stone,
  roughness = 0.94,
  /** Draw worn floor-tile joints in world XZ (for floors). */
  tiles = false,
): MeshStandardMaterial {
  const material = new MeshStandardMaterial({ color, roughness, metalness: 0, flatShading: true });
  const tileChunk = tiles
    ? /* glsl */ `
          // Worn tile joints every 1.6 m, broken up so they never read as a grid.
          vec2 tileUv = vBehelitWorld.xz / 1.6 + vec2(snoise(vBehelitWorld * 0.35) * 0.06);
          vec2 joint = abs(fract(tileUv) - 0.5);
          float seamLine = 1.0 - smoothstep(0.455, 0.49, max(joint.x, joint.y));
          diffuseColor.rgb *= mix(0.35, 1.0, seamLine);`
    : "";
  material.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    Object.assign(shader.uniforms, shared);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vBehelitWorld;")
      .replace(
        "#include <project_vertex>",
        /* glsl */ `#include <project_vertex>
        #ifdef USE_INSTANCING
          vBehelitWorld = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
        #else
          vBehelitWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
        #endif`,
      );
    shader.fragmentShader = glsl(
      shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying vec3 vBehelitWorld;\n#pragma include <noise>\n#pragma include <fog>",
        )
        .replace(
          "#include <color_fragment>",
          /* glsl */ `#include <color_fragment>
          // Stone variation: two octaves of world-space noise, plus darker
          // grime pooling low on every surface.
          float stoneNoise = snoise(vBehelitWorld * 0.9) * 0.5 + snoise(vBehelitWorld * 3.7) * 0.25;
          diffuseColor.rgb *= 0.78 + 0.32 * stoneNoise;
          diffuseColor.rgb *= mix(0.55, 1.0, smoothstep(uFogFloor - 0.2, uFogFloor + 1.6, vBehelitWorld.y));${tileChunk}`,
        )
        .replace("#include <fog_fragment>", "gl_FragColor.rgb = applyFog(gl_FragColor.rgb, vBehelitWorld);"),
    );
  };
  // Distinct program cache key so three doesn't reuse an unpatched program.
  material.customProgramCacheKey = () => (tiles ? "behelit-stone-tiles" : "behelit-stone");
  return material;
}
