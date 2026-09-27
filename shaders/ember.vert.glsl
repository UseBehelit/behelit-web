// ───────────────────────────────────────────────────────────────────────────
// ember.vert.glsl — embers and ash, simulated entirely in the vertex shader.
//
// Nothing is stored between frames: each particle's position is a pure
// function of (its seed, time). That makes the field free to update — the CPU
// only uploads a few uniforms — and deterministic.
//
//   1. Life:  age = fract(time / life + phase) — every particle loops through
//             birth → rise → fade on its own period, so births are spread out.
//   2. Rise:  y grows linearly with age (embers faster than ash).
//   3. Drift: displaced by curl noise sampled along its path. Curl noise is
//             divergence-free, so the field swirls like smoke without clumping.
//   4. Wrap:  positions are folded into a box that follows the camera
//             (mod over the box size), so the field is endless in every
//             direction the camera travels. Particles fade near the box faces
//             to hide the fold.
// Compiled twice: once with EMBER defined (additive, glowing) and once without
// (ash: alpha-blended, matte, tumbling).
// ───────────────────────────────────────────────────────────────────────────

#pragma include <noise>
#pragma include <fog>

uniform float uTime;
uniform float uScale;      // viewport height in px / (2·tan(fov/2)): world → pixel size
uniform float uSize;       // base particle size in world units
uniform float uRise;       // metres per second
uniform float uCurl;       // drift strength
uniform float uHeat;       // forge heat: more embers, hotter, faster
uniform vec3 uBoxCenter;   // the camera, in practice
uniform vec3 uBoxSize;

attribute vec4 aSeed;      // x: life jitter, y: phase, z: curl seed, w: size / flicker

varying float vAlpha;
varying float vHeat;
varying float vFlicker;
varying float vRot;
varying float vFog;

void main() {
  #ifdef EMBER
    float life = mix(4.5, 9.0, aSeed.x) / (1.0 + uHeat * 0.6);
    float rise = uRise * (1.0 + uHeat * 0.8);
  #else
    float life = mix(8.0, 16.0, aSeed.x);
    float rise = uRise * 0.35;
  #endif

  float age = fract(uTime / life + aSeed.y);
  vec3 p = position * uBoxSize;
  p.y += age * life * rise;

  // Curl drift, stronger as the particle ages (it has had longer to be pushed).
  vec3 flow = curlNoise(p * 0.11 + vec3(aSeed.z * 13.0, uTime * 0.018, 0.0));
  p += flow * uCurl * (0.35 + age);

  // Fold into the camera-centred box: rel ∈ [−size/2, size/2].
  vec3 rel = mod(p - uBoxCenter + 0.5 * uBoxSize, uBoxSize) - 0.5 * uBoxSize;
  vec3 world = uBoxCenter + rel;
  vec3 edge = 1.0 - smoothstep(0.34, 0.5, abs(rel) / uBoxSize);
  float edgeFade = edge.x * edge.y * edge.z;

  vec4 mv = viewMatrix * vec4(world, 1.0);
  gl_Position = projectionMatrix * mv;

  float depth = max(-mv.z, 0.05);
  float size = uSize * mix(0.45, 1.55, aSeed.w);
  #ifndef EMBER
    // Flakes right in front of the lens read as big, soft, out-of-focus ash.
    size *= 1.0 + smoothstep(1.6, 0.6, depth) * 0.3;
  #endif
  gl_PointSize = clamp(size * uScale / depth, 0.0, 96.0);

  float lifeFade = smoothstep(0.0, 0.1, age) * (1.0 - smoothstep(0.62, 1.0, age));
  // Too-close particles would fill the screen: fade them.
  float nearFade = smoothstep(0.25, 0.9, depth);

  #ifdef EMBER
    // Only a fraction of seeds are lit embers; the forge wakes up more of them.
    float lit = step(aSeed.w, 0.55 + 0.45 * uHeat);
    vAlpha = lifeFade * edgeFade * nearFade * lit;
  #else
    vAlpha = lifeFade * edgeFade * nearFade;
  #endif

  vHeat = 1.0 - age;  // embers cool as they climb
  vFlicker = 0.6 + 0.4 * sin(uTime * (6.0 + aSeed.w * 14.0) + aSeed.y * 40.0);
  vRot = aSeed.z * 6.2831853 + uTime * (aSeed.w - 0.5) * 1.8;
  vFog = fogAmount(world);
}
