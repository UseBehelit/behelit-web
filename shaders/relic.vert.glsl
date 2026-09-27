// ───────────────────────────────────────────────────────────────────────────
// relic.vert.glsl — one shader, four fates. The relic's status arrives as
// uniforms (exactly one is 1, the rest 0; transitions could blend them):
//
//   uLive    a slow shared breath, nothing else — calm and crisp
//   uForge   a high-frequency tremor, like iron still ringing from the hammer
//   uCharge  a pulse climbing the body; plates lift as it passes
//   uDecay   the relic comes apart: shards drift outward and turn
//
// Plates are rigid (see seed.vert.glsl); every offset below is computed from
// per-plate attributes so the three corners of a plate always move together.
// ───────────────────────────────────────────────────────────────────────────

#pragma include <noise>

uniform float uTime;
uniform float uLive;
uniform float uForge;
uniform float uCharge;
uniform float uDecay;

attribute vec3 aCenter;
attribute vec3 aPlateNormal;
attribute vec3 aBary;
attribute float aRand;
attribute float aShard;

varying vec3 vWorldPos;
varying vec3 vObjPos;
varying vec3 vNormalW;
varying vec3 vBary;
varying float vRand;
varying float vGap;

// Rotation by `angle` about unit `axis` (Rodrigues' formula as a matrix).
mat3 rotation(vec3 axis, float angle) {
  float s = sin(angle);
  float c = cos(angle);
  float oc = 1.0 - c;
  return mat3(
    oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z - axis.x * s,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c
  );
}

void main() {
  vec3 p = position;
  vec3 n = aPlateNormal;
  float gap = 0.0;

  if (uDecay > 0.0) {
    // Every plate in a shard shares one drift direction (outward, jittered by
    // a hash of the shard id), so the relic breaks into chunks; each plate
    // also turns about its own centroid, so break faces never line up again.
    vec3 h = hash33(vec3(aShard * 1.37, aShard * 2.11, aShard * 3.73)) - 0.5;
    vec3 outward = normalize(aCenter + vec3(1e-4));
    vec3 dir = normalize(outward * 1.4 + h);
    float drift = uDecay * (0.14 + 0.3 * hash11(aShard * 7.1 + 0.3)) + uDecay * 0.035 * sin(uTime * 0.35 + aShard);
    vec3 axis = normalize(h + vec3(1e-3));
    mat3 R = rotation(axis, uDecay * (0.3 + 0.75 * aRand) + 0.1 * uDecay * sin(uTime * 0.27 + aRand * 6.28));
    p = aCenter + R * (p - aCenter) + dir * drift;
    p.y -= uDecay * 0.07 * hash11(aShard * 3.3);
    n = R * n;
  }

  // Charge: a gaussian band travelling up the body every ~3.6 s.
  float wave = fract(uTime * 0.28);
  float band = exp(-pow((aCenter.y * 0.45 + 0.5 - wave) * 7.0, 2.0));
  gap += uCharge * band * 0.04;

  // Forge tremor.
  gap += uForge * (0.012 + 0.01 * sin(uTime * 23.0 + aRand * 40.0));

  // Live breath.
  gap += uLive * 0.01 * (0.5 - 0.5 * cos(uTime * 0.9));

  p += n * gap;

  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorldPos = world.xyz;
  vObjPos = position;
  vNormalW = normalize(mat3(modelMatrix) * n);
  vBary = aBary;
  vRand = aRand;
  vGap = gap;
  gl_Position = projectionMatrix * viewMatrix * world;
}
