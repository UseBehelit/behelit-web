// ───────────────────────────────────────────────────────────────────────────
// seed.frag.glsl — stone and iron plates over a crimson core.
//
// Light sources on the shell, in order:
//   1. key + cursor light on weathered stone / dark iron plates (shade())
//   2. a Fresnel rim, so the silhouette reads against the fog
//   3. seam glow: core light leaking between plates, wider as they part
//   4. surface cracks: a drifting Voronoi crack network, masked by noise so
//      only some cracks are "awake" at any moment
// Emissive values go well above 1.0 on purpose: the bloom pass only picks up
// HDR light, which is how bloom stays selective to crimson and gold.
// ───────────────────────────────────────────────────────────────────────────

#pragma include <noise>
#pragma include <fog>
#pragma include <lighting>

uniform float uTime;
uniform float uPulse;
uniform float uHeat;
uniform int uOctaves;
uniform vec3 uCrimson;
uniform vec3 uEmber;
uniform vec3 uGold;
uniform vec3 uStone;
uniform vec3 uIron;

varying vec3 vWorldPos;
varying vec3 vObjPos;
varying vec3 vNormalW;
varying vec3 vBary;
varying float vRand;
varying float vGap;
varying float vBreath;

void main() {
  vec3 V = normalize(cameraPosition - vWorldPos);

  // Inside the shell: the walls are lit only by the core.
  if (!gl_FrontFacing) {
    float glow = 0.9 + 1.8 * vBreath * uPulse + 2.5 * uHeat;
    vec3 inner = uCrimson * glow;
    gl_FragColor = vec4(applyFog(inner, vWorldPos), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    return;
  }

  // ── Material ─────────────────────────────────────────────────────────────
  // Roughly a third of the plates are iron; the rest are stone.
  float iron = step(0.66, vRand);
  float grain = fbm(vObjPos * 5.5 + vRand * 3.0, uOctaves) * 0.5 + 0.5;
  vec3 albedo = mix(uStone * (0.55 + 0.7 * grain), uIron * (0.6 + 0.6 * grain), iron);
  float rough = mix(0.88, 0.34, iron);
  float metal = mix(0.0, 0.9, iron);

  // Bump: tilt the flat plate normal by the tangential part of a fine noise
  // gradient — pitted stone and hammered iron without a texture.
  vec3 N = normalize(vNormalW);
  vec3 g = snoiseGrad(vObjPos * mix(9.0, 14.0, iron)).yzw;
  N = normalize(N + (g - N * dot(g, N)) * mix(0.06, 0.035, iron));

  vec3 color = shade(albedo, N, V, vWorldPos, rough, metal);

  // ── Rim ──────────────────────────────────────────────────────────────────
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  // Cool silver back-rim plus a warm crimson edge that swells with the breath.
  color += vec3(0.32, 0.36, 0.4) * fresnel * 0.22;
  color += uCrimson * fresnel * (0.25 + 0.55 * vBreath * uPulse);

  // ── Seams ────────────────────────────────────────────────────────────────
  // min(barycentric) is 0 on a plate's edge and ~0.33 at its centre, so it's
  // a free "distance to the edge" — no edge geometry needed. Closed seams are
  // dark hairlines; only plates that have actually lifted let light through.
  float edge = min(min(vBary.x, vBary.y), vBary.z);
  float open = smoothstep(0.012, 0.07, vGap);
  float seamWidth = 0.014 + vGap * 0.5;
  float seam = 1.0 - smoothstep(0.0, seamWidth, edge);
  // Light leaks in uneven runs along the seams (noise along the surface), so
  // they read as molten cracks rather than a glowing wireframe.
  float leak = smoothstep(0.4, 0.78, snoise(vObjPos * 2.6 + vec3(0.0, uTime * 0.09, vRand)) * 0.5 + 0.5);
  float seamGlow = seam * (0.04 + leak * (0.35 + 1.5 * open));

  // ── Cracks ───────────────────────────────────────────────────────────────
  // Domain-warp the lookup so cracks wander instead of forming neat cells,
  // and drift it slowly so the network shifts over time.
  vec3 q = vObjPos * 1.7 + vec3(0.0, uTime * 0.025, 0.0);
  q += 0.3 * vec3(snoise(q * 0.7 + uTime * 0.04), snoise(q * 0.7 + 17.0), snoise(q * 0.7 - 9.0));
  vec2 F = voronoi(q);
  float line = 1.0 - smoothstep(0.0, 0.035, F.y - F.x);
  float awake = smoothstep(0.55, 0.85, snoise(vObjPos * 0.7 + vec3(0.0, uTime * 0.05, 0.0)) * 0.5 + 0.5 + uHeat * 0.3);
  float crack = line * awake * (1.0 - iron * 0.7);

  // ── Core light ───────────────────────────────────────────────────────────
  float intensity = 2.2 + 3.6 * vBreath * uPulse + 6.0 * uHeat;
  vec3 core = mix(uCrimson, uEmber, clamp(line * 0.35 + open * 0.3, 0.0, 1.0));
  vec3 emissive = core * intensity * (seamGlow + crack * 0.8);
  // Cracked stone near a seam darkens (scorched) before the glow takes over.
  color *= 1.0 - 0.6 * max(seam, crack);
  color += emissive;

  color = applyFog(color, vWorldPos);
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
