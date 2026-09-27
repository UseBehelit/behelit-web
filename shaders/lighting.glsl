// ───────────────────────────────────────────────────────────────────────────
// lighting.glsl — the two lights of the descent, shared by every custom
// material: a directional key light (gold "rest-point" light from above) and
// the cursor's point light. Requires fog.glsl (key-light uniforms).
// ───────────────────────────────────────────────────────────────────────────

#ifndef BEHELIT_LIGHTING
#define BEHELIT_LIGHTING

uniform vec3 uCursorPos;     // world-space cursor light position
uniform vec3 uCursorColor;   // linear colour × intensity
uniform float uAmbient;

// Normalised Blinn-Phong lobe. The (n + 8) / 8π factor keeps highlight energy
// roughly constant as the lobe tightens, so rough stone and polished iron can
// share one light setup.
float blinnPhong(vec3 N, vec3 L, vec3 V, float shininess) {
  vec3 H = normalize(L + V);
  return pow(max(dot(N, H), 0.0), shininess) * (shininess + 8.0) * 0.0397887;
}

// Schlick's Fresnel: reflectance rises towards 1 at grazing angles.
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

// Shade a surface. rough ∈ [0,1] maps to shininess 6 → 110; metals tint their
// highlights with the albedo and lose their diffuse term.
vec3 shade(vec3 albedo, vec3 N, vec3 V, vec3 P, float rough, float metal) {
  float shininess = mix(110.0, 6.0, rough);
  vec3 F0 = mix(vec3(0.04), albedo, metal);
  vec3 F = fresnelSchlick(max(dot(N, V), 0.0), F0);
  vec3 diffuse = albedo * (1.0 - metal);

  // Key light (directional).
  float ndl = max(dot(N, uKeyDir), 0.0);
  vec3 color = (diffuse + F * blinnPhong(N, uKeyDir, V, shininess)) * ndl * uKeyColor * uKeyIntensity;

  // Cursor light (point): inverse-square falloff with a soft core so it never
  // blows out when it passes through a surface.
  vec3 toLight = uCursorPos - P;
  float dist2 = dot(toLight, toLight);
  vec3 Lc = toLight * inversesqrt(max(dist2, 1e-4));
  float atten = 1.0 / (1.0 + dist2 * 0.45);
  float ndlc = max(dot(N, Lc), 0.0);
  color += (diffuse + F * blinnPhong(N, Lc, V, shininess)) * ndlc * uCursorColor * atten;

  // Ambient: a hemisphere between the abyss below and the fog above.
  vec3 sky = uFogColor * 2.5 + vec3(0.02);
  vec3 ground = vec3(0.008, 0.007, 0.009);
  color += albedo * uAmbient * mix(ground, sky, N.y * 0.5 + 0.5);
  return color;
}

// Incandescence ramp for hot iron, t ∈ [0, 1]: black → deep red → orange →
// yellow-white. Radiated power climbs roughly with T⁴, so brightness rises
// much faster than the hue shifts — hence the steep final multiplier.
vec3 heatRamp(float t) {
  vec3 c = vec3(0.55, 0.03, 0.01) * smoothstep(0.05, 0.35, t);
  c += vec3(0.45, 0.2, 0.02) * smoothstep(0.3, 0.65, t);
  c += vec3(0.2, 0.35, 0.25) * smoothstep(0.6, 1.0, t);
  return c * (0.5 + 5.5 * t * t);
}

#endif
