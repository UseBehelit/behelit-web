// ───────────────────────────────────────────────────────────────────────────
// noise.glsl — shared procedural noise: hashes, 3D simplex (value + analytic
// gradient), fbm, curl noise and 3D Voronoi.
//
// Simplex noise after Ian McEwan & Stefan Gustavson, "webgl-noise"
// (Ashima Arts), MIT License — Copyright (C) 2011 Ashima Arts,
// Copyright (C) 2011–2016 Stefan Gustavson.
// Hash functions after Dave Hoskins, "Hash without Sine" (MIT).
// ───────────────────────────────────────────────────────────────────────────

#ifndef BEHELIT_NOISE
#define BEHELIT_NOISE

// ── Hashes ────────────────────────────────────────────────────────────────
// Sine-free hashes: stable across GPUs (sin() precision varies wildly).
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

// ── Simplex noise ─────────────────────────────────────────────────────────
// The lattice is skewed so 3D space tiles into tetrahedra (simplices); each
// sample blends the 4 corner gradients with a radial falloff (r² − d²)⁴, which
// is cheaper and has fewer axis artefacts than classic Perlin noise.
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

// Shared core: returns the 4 corner offsets/gradients for point v.
void simplexCorners(vec3 v, out vec3 x0, out vec3 x1, out vec3 x2, out vec3 x3,
                    out vec3 p0, out vec3 p1, out vec3 p2, out vec3 p3) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner: skew into simplex space, floor, unskew.
  vec3 i = floor(v + dot(v, C.yyy));
  x0 = v - i + dot(i, C.xxx);

  // Other corners: rank the components of x0 to find the simplex we're in.
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  x1 = x0 - i1 + C.xxx;
  x2 = x0 - i2 + C.yyy;
  x3 = x0 - D.yyy;

  // Hash the four corners into gradient indices.
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  // Gradients: 7×7 points over a square, mapped onto an octahedron.
  float n_ = 0.142857142857; // 1/7
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  p0 = vec3(a0.xy, h.x);
  p1 = vec3(a0.zw, h.y);
  p2 = vec3(a1.xy, h.z);
  p3 = vec3(a1.zw, h.w);

  // Normalise gradients.
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
}

// Simplex noise in [-1, 1].
float snoise(vec3 v) {
  vec3 x0, x1, x2, x3, p0, p1, p2, p3;
  simplexCorners(v, x0, x1, x2, x3, p0, p1, p2, p3);
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  vec4 m2 = m * m;
  return 105.0 * dot(m2 * m2, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Simplex noise with its analytic gradient: returns vec4(value, d/dx, d/dy, d/dz).
// Each corner contributes m⁴·(g·x) with m = 0.5 − |x|², so by the product rule
//   ∇ = m⁴·g − 8·m³·(g·x)·x      (since ∇m = −2x and ∇m⁴ = 4m³·∇m)
vec4 snoiseGrad(vec3 v) {
  vec3 x0, x1, x2, x3, p0, p1, p2, p3;
  simplexCorners(v, x0, x1, x2, x3, p0, p1, p2, p3);
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  vec4 m2 = m * m;
  vec4 m4 = m2 * m2;
  vec4 pdotx = vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3));
  vec4 temp = m2 * m * pdotx;
  vec3 gradient = -8.0 * (temp.x * x0 + temp.y * x1 + temp.z * x2 + temp.w * x3);
  gradient += m4.x * p0 + m4.y * p1 + m4.z * p2 + m4.w * p3;
  return 105.0 * vec4(dot(m4, pdotx), gradient);
}

// ── fbm ───────────────────────────────────────────────────────────────────
// Fractal Brownian motion: octaves of simplex noise, each at ~2× the frequency
// and ½ the amplitude. The domain is rotated between octaves so lattice
// artefacts from one octave don't line up with the next.
const mat3 FBM_ROT = mat3(0.00, 0.80, 0.60, -0.80, 0.36, -0.48, -0.60, -0.48, 0.64);

float fbm(vec3 p, int octaves) {
  float sum = 0.0;
  float amp = 0.5;
  float norm = 0.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    sum += amp * snoise(p);
    norm += amp;
    p = FBM_ROT * p * 2.02;
    amp *= 0.5;
  }
  return sum / max(norm, 1e-4);
}

// ── Curl noise ────────────────────────────────────────────────────────────
// Treat three decorrelated noise fields as a vector potential ψ = (ψx, ψy, ψz).
// Its curl ∇×ψ is divergence-free, so particles advected by it swirl and fold
// like smoke without bunching up or leaving holes. Using the analytic gradients
// costs 3 noise evaluations instead of 18 finite differences.
vec3 curlNoise(vec3 p) {
  vec3 gx = snoiseGrad(p).yzw;
  vec3 gy = snoiseGrad(p + vec3(31.416, -47.853, 12.793)).yzw;
  vec3 gz = snoiseGrad(p + vec3(-233.1, 89.25, 64.95)).yzw;
  // (∂ψz/∂y − ∂ψy/∂z, ∂ψx/∂z − ∂ψz/∂x, ∂ψy/∂x − ∂ψx/∂y)
  return vec3(gz.y - gy.z, gx.z - gz.x, gy.x - gx.y);
}

// ── Voronoi ───────────────────────────────────────────────────────────────
// 3D cellular noise: distance to the nearest (F1) and second-nearest (F2)
// jittered feature point. F2 − F1 → 0 exactly on the border between two
// cells, which is what draws crack networks.
vec2 voronoi(vec3 p) {
  vec3 cell = floor(p);
  vec3 f = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  for (int z = -1; z <= 1; z++)
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec3 o = vec3(float(x), float(y), float(z));
    vec3 point = o + hash33(cell + o) * 0.9 + 0.05 - f;
    float d = dot(point, point);
    if (d < f1) {
      f2 = f1;
      f1 = d;
    } else if (d < f2) {
      f2 = d;
    }
  }
  return sqrt(vec2(f1, f2));
}

#endif
