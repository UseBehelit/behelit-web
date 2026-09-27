// ───────────────────────────────────────────────────────────────────────────
// seed.vert.glsl — the Seed's shell breathes.
//
// The shell is built from independent triangular plates (non-indexed geometry,
// see components/canvas/geometry.ts). Every vertex carries its plate's
// centroid and normal, so any offset computed from those is identical for all
// three corners: plates move rigidly, and the seams between neighbours open
// and close. That gap is what lets the crimson core bleed through.
// ───────────────────────────────────────────────────────────────────────────

#pragma include <noise>

uniform float uTime;
uniform float uPulse;   // breathing amplitude (0 = still, used for reduced motion)
uniform float uHeat;    // agitation: the hero impact and cursor proximity spike it
uniform vec3 uMouse;    // cursor light position in the Seed's object space
uniform int uOctaves;

attribute vec3 aCenter;       // plate centroid (object space)
attribute vec3 aPlateNormal;  // plate normal (object space)
attribute vec3 aBary;         // barycentric coordinate inside the plate
attribute float aRand;        // per-plate random in [0, 1)

varying vec3 vWorldPos;
varying vec3 vObjPos;
varying vec3 vNormalW;
varying vec3 vBary;
varying float vRand;
varying float vGap;
varying float vBreath;

void main() {
  // Breath at ~0.2 Hz: a raised cosine, shaped by pow() so the shell lingers
  // open for a moment before exhaling — closer to lungs than to a sine wave.
  float breath = pow(0.5 - 0.5 * cos(uTime * 0.2 * 6.28318530718), 1.6);

  // Layered simplex noise sampled at the plate centroid decides how far each
  // plate lifts. The noise drifts slowly upward, so the pattern of which
  // plates open wanders over the surface between breaths.
  float n = fbm(aCenter * 1.35 + vec3(0.0, uTime * 0.07, aRand * 7.0), uOctaves) * 0.5 + 0.5;

  // Plates nearest the cursor light strain towards it.
  float pull = exp(-dot(uMouse - aCenter, uMouse - aCenter) * 0.9);

  // n³ skews the distribution: most plates barely stir, a few open wide —
  // so light escapes through a handful of cracks, not every seam at once.
  float open = n * n * n;
  float lift = uPulse * breath * (0.003 + 0.11 * open) + uHeat * (0.01 + 0.08 * open) + pull * 0.025 * uPulse;

  vec3 displaced = position + aPlateNormal * lift;
  // Whole-body swell. Coincident corners of neighbouring plates scale by the
  // same amount, so this never tears the shell.
  displaced *= 1.0 + 0.012 * breath * uPulse;

  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorldPos = world.xyz;
  vObjPos = position;
  vNormalW = normalize(mat3(modelMatrix) * aPlateNormal);
  vBary = aBary;
  vRand = aRand;
  vGap = lift;
  vBreath = breath;
  gl_Position = projectionMatrix * viewMatrix * world;
}
