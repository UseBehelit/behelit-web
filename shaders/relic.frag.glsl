// ───────────────────────────────────────────────────────────────────────────
// relic.frag.glsl — status-driven surface for the relics on the altars.
//
//   uLive    crisp lighting, gold (accent) inlay rings, an accent rim
//   uForge   glowing hot iron: a drifting temperature field over cooler
//            Voronoi crust plates, white-hot fissures between them, and a
//            black-body colour ramp (heatRamp) pushed into HDR for bloom
//   uCharge  a dimmer twin: lit at ~60 %, with a charge pulse climbing
//            through the seams in crimson-gold
//   uDecay   desaturated; rust eats the iron, moss creeps over upward-facing
//            stone, and the cracks are dark — they give no light
// ───────────────────────────────────────────────────────────────────────────

#pragma include <noise>
#pragma include <fog>
#pragma include <lighting>

uniform float uTime;
uniform float uLive;
uniform float uForge;
uniform float uCharge;
uniform float uDecay;
uniform float uFocus;   // 1 while the camera is visiting this altar
uniform int uOctaves;
uniform vec3 uAccent;
uniform vec3 uCrimson;
uniform vec3 uGold;
uniform vec3 uStone;
uniform vec3 uIron;
uniform vec3 uRust;
uniform vec3 uMoss;

varying vec3 vWorldPos;
varying vec3 vObjPos;
varying vec3 vNormalW;
varying vec3 vBary;
varying float vRand;
varying float vGap;

void main() {
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 N = normalize(vNormalW);
  if (!gl_FrontFacing) N = -N;

  float iron = step(0.55, vRand);
  float grain = fbm(vObjPos * 6.0 + vRand * 4.0, uOctaves) * 0.5 + 0.5;
  vec3 albedo = mix(uStone * (0.6 + 0.6 * grain), uIron * (0.65 + 0.5 * grain), iron);
  float rough = mix(0.85, 0.3, iron);
  float metal = mix(0.0, 0.9, iron);

  // ── Decay: rust, moss, desaturation ─────────────────────────────────────
  if (uDecay > 0.0) {
    float rustMask = smoothstep(0.4, 0.72, fbm(vObjPos * 3.2 + 11.0, uOctaves) * 0.5 + 0.5);
    // Moss only takes hold on faces that look up (rain and dust settle there).
    float mossMask = smoothstep(0.48, 0.8, fbm(vObjPos * 2.4 - 5.0, uOctaves) * 0.5 + 0.5) * smoothstep(-0.1, 0.7, N.y);
    vec3 decayed = mix(albedo, uRust * (0.55 + 0.7 * grain), rustMask * mix(0.3, 0.95, iron));
    decayed = mix(decayed, uMoss * (0.5 + 0.8 * grain), mossMask * (1.0 - iron) * 0.9);
    float lum = dot(decayed, vec3(0.2126, 0.7152, 0.0722));
    albedo = mix(decayed, vec3(lum), uDecay * 0.5);
    rough = mix(rough, 0.96, uDecay);
    metal *= 1.0 - uDecay * 0.85;
  }

  // Pitting / hammer marks via the tangential part of a noise gradient.
  vec3 g = snoiseGrad(vObjPos * mix(10.0, 16.0, iron)).yzw;
  N = normalize(N + (g - N * dot(g, N)) * 0.045);

  vec3 color = shade(albedo, N, V, vWorldPos, rough, metal);
  // The in-review relic is a dimmer twin; the vaulted one sits in half-light.
  color *= 1.0 - 0.4 * uCharge - 0.35 * uDecay;

  float edge = min(min(vBary.x, vBary.y), vBary.z);
  float seam = 1.0 - smoothstep(0.0, 0.018 + vGap * 0.7, edge);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 emissive = vec3(0.0);

  // ── Live ────────────────────────────────────────────────────────────────
  if (uLive > 0.0) {
    // Engraved rings around the body, inlaid with the accent colour.
    float ring = abs(fract(vObjPos.y * 2.4 + 0.2) - 0.5);
    float inlay = (1.0 - smoothstep(0.018, 0.034, ring)) * (0.6 + 0.4 * iron);
    emissive += uAccent * inlay * (1.4 + 0.3 * sin(uTime * 0.8)) * uLive;
    emissive += uAccent * fresnel * 0.55 * uLive;
    color += uAccent * seam * 0.08 * uLive;
  }

  // ── Forging ─────────────────────────────────────────────────────────────
  if (uForge > 0.0) {
    vec3 q = vObjPos * 2.6 + vec3(0.0, -uTime * 0.12, 0.0);
    vec2 F = voronoi(q);
    float fissure = 1.0 - smoothstep(0.0, 0.1, F.y - F.x);
    float temp = fbm(vObjPos * 1.7 + vec3(0.0, uTime * 0.22, 0.0), uOctaves) * 0.5 + 0.5;
    temp = temp * 0.42 + 0.05 + fissure * 0.6 + seam * 0.3;
    temp *= 0.92 + 0.08 * sin(uTime * 3.1 + vRand * 20.0);
    // The crust is scorched dark; the light comes from inside.
    color *= mix(1.0, 0.22, uForge);
    emissive += heatRamp(clamp(temp, 0.0, 1.0)) * uForge;
  }

  // ── In review ───────────────────────────────────────────────────────────
  if (uCharge > 0.0) {
    float wave = fract(uTime * 0.28);
    float band = exp(-pow((vObjPos.y * 0.45 + 0.5 - wave) * 7.0, 2.0));
    vec3 charge = mix(uCrimson * 1.6, uGold, 0.55);
    emissive += charge * seam * (0.06 + 3.4 * band) * uCharge;
    emissive += uGold * fresnel * (0.12 + 0.25 * band) * uCharge;
  }

  // ── Vaulted: cracks with no light ───────────────────────────────────────
  if (uDecay > 0.0) {
    vec2 F = voronoi(vObjPos * 3.4 + 2.0);
    float crack = 1.0 - smoothstep(0.0, 0.055, F.y - F.x);
    color *= 1.0 - 0.85 * crack * uDecay;
    color *= 1.0 - 0.7 * seam * uDecay;
  }

  color *= 0.8 + 0.3 * uFocus;
  color += emissive * (0.8 + 0.2 * uFocus);
  gl_FragColor = vec4(applyFog(color, vWorldPos), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
