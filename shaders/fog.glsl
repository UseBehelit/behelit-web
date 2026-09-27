// ───────────────────────────────────────────────────────────────────────────
// fog.glsl — the atmosphere every surface sits in. Uniform values are driven
// each frame by the camera rig from the per-station keyframes in lib/world.ts.
// Include before lighting.glsl (it declares the key-light uniforms).
// ───────────────────────────────────────────────────────────────────────────

#ifndef BEHELIT_FOG
#define BEHELIT_FOG

uniform vec3 uFogColor;      // linear fog colour
uniform float uFogDensity;   // distance fog density ρ
uniform float uFogFloor;     // world height the ground mist pools on
uniform float uFogFalloff;   // mist thinning rate with height (b)
uniform vec3 uKeyColor;      // key light colour (linear)
uniform float uKeyIntensity;
uniform vec3 uKeyDir;        // unit vector towards the key light

// The colour of fog seen along direction rd: the base tint, brightened by
// forward (Mie-like) scattering where the ray looks towards the key light.
// pow(cosθ, k) is a cheap stand-in for a Henyey–Greenstein lobe.
vec3 fogTint(vec3 rd) {
  float cosTheta = max(dot(rd, uKeyDir), 0.0);
  float scatter = pow(cosTheta, 8.0) * 0.55 + pow(cosTheta, 64.0) * 1.4;
  return uFogColor + uKeyColor * uKeyIntensity * scatter * 0.12;
}

// Fraction of light lost to fog between the camera and world point p.
//
// 1) Distance fog, exponential-squared: f₁ = 1 − exp(−(ρ·d)²). Stays clear
//    close to the camera, then closes in fast — the "drowned" falloff.
//
// 2) Ground mist whose density decays with height above the floor:
//        σ(y) = a · exp(−b · (y − floor))
//    Integrated along the ray o + t·rd for t ∈ [0, d] this has a closed form
//    (Quilez, "better fog"):
//        f₂ = (a / b) · exp(−b · (o.y − floor)) · (1 − exp(−b · rd.y · d)) / rd.y
//    so mist pools around altars and pillar bases with no ray marching.
float fogAmount(vec3 p) {
  vec3 ro = cameraPosition;
  vec3 delta = p - ro;
  float d = length(delta);
  vec3 rd = delta / max(d, 1e-4);

  float f1 = 1.0 - exp(-pow(d * uFogDensity, 2.0));

  const float a = 0.05;
  float b = max(uFogFalloff, 1e-3);
  float ry = abs(rd.y) < 1e-3 ? 1e-3 : rd.y;
  float heightAboveFloor = max(ro.y - uFogFloor, -2.0);
  float f2 = (a / b) * exp(-b * heightAboveFloor) * (1.0 - exp(-b * ry * d)) / ry;
  f2 = clamp(f2, 0.0, 0.9);

  // Combine as independent extinctions: T = (1 − f₁)(1 − f₂).
  return 1.0 - (1.0 - f1) * (1.0 - f2);
}

vec3 applyFog(vec3 color, vec3 worldPos) {
  vec3 rd = normalize(worldPos - cameraPosition);
  return mix(color, fogTint(rd), fogAmount(worldPos));
}

#endif
