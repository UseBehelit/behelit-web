// ───────────────────────────────────────────────────────────────────────────
// ink.frag.glsl — the manga pass (a postprocessing Effect, see InkEffect.ts).
//
// Turns the rendered frame into pen-and-ink:
//   1. tone      linear luminance → perceptual (gamma) → stretched, because
//                the descent is dark and hatching needs a full tonal range
//   2. hatching  up to four families of strokes, each switching on in a
//                darker brightness band (45° → −45° → 0° → 90°), with stroke
//                width growing with darkness, a hand-drawn wobble and uneven
//                pen pressure
//   3. tone dots a 45° screentone grid, only in the midtones
//   4. contours  a Sobel filter on luminance inks silhouettes and light edges
//   5. paper     warm off-white lit by the scene, with fibres
// `uAmount` blends the result over the original per chapter.
//
// Built-ins from postprocessing's effect template: inputBuffer, resolution,
// texelSize, time.
// ───────────────────────────────────────────────────────────────────────────

uniform float uAmount;
uniform float uDirections;   // 2, 3 or 4 hatch families (quality tier)
uniform float uSobel;        // 1 → draw contours
uniform float uPixelRatio;
uniform vec3 uInk;
uniform vec3 uPaper;

float inkLuma(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Smooth 2D value noise for fibres, wobble and pressure.
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
             mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);
}

// One family of parallel strokes at `angle`, `spacing` CSS px apart.
// `darkness` ∈ [0, 1] sets stroke width: hairlines for light tones, fat
// strokes that almost merge for dark ones. Returns ink coverage 0–1.
float hatch(vec2 px, float angle, float spacing, float darkness) {
  if (darkness <= 0.0) return 0.0;
  vec2 dir = vec2(cos(angle), sin(angle));
  float along = dot(px, dir);
  float across = dot(px, vec2(-dir.y, dir.x));
  float lineIndex = floor(across / spacing);
  // Wobble: nudge each stroke sideways by slow noise along its length.
  across += (vnoise(vec2(along * 0.018, lineIndex * 1.7)) - 0.5) * spacing * 0.55;
  // Distance from the stroke centre: 0 on the stroke, 1 halfway to the next.
  float d = abs(fract(across / spacing) - 0.5) * 2.0;
  float width = clamp(darkness, 0.0, 1.0) * 0.92;
  // Pen pressure: strokes thin and thicken along their length.
  width *= 0.7 + 0.6 * vnoise(vec2(along * 0.045, lineIndex * 3.1));
  float aa = 1.4 / spacing;
  return 1.0 - smoothstep(width - aa, width + aa, d);
}

// Screentone: a 45° dot grid whose dots swell with darkness (area ∝ tone).
float screentone(vec2 px, float spacing, float darkness) {
  vec2 q = mat2(0.7071, -0.7071, 0.7071, 0.7071) * px / spacing;
  float d = length(fract(q) - 0.5);
  float radius = sqrt(clamp(darkness, 0.0, 1.0)) * 0.56;
  float aa = 1.2 / spacing;
  return 1.0 - smoothstep(radius - aa, radius + aa, d);
}

// Sobel gradient magnitude of luminance over a 3×3 neighbourhood.
float sobel(vec2 uv) {
  vec2 t = texelSize * max(1.0, uPixelRatio);
  float tl = inkLuma(texture2D(inputBuffer, uv + vec2(-t.x, t.y)).rgb);
  float tc = inkLuma(texture2D(inputBuffer, uv + vec2(0.0, t.y)).rgb);
  float tr = inkLuma(texture2D(inputBuffer, uv + vec2(t.x, t.y)).rgb);
  float ml = inkLuma(texture2D(inputBuffer, uv + vec2(-t.x, 0.0)).rgb);
  float mr = inkLuma(texture2D(inputBuffer, uv + vec2(t.x, 0.0)).rgb);
  float bl = inkLuma(texture2D(inputBuffer, uv + vec2(-t.x, -t.y)).rgb);
  float bc = inkLuma(texture2D(inputBuffer, uv + vec2(0.0, -t.y)).rgb);
  float br = inkLuma(texture2D(inputBuffer, uv + vec2(t.x, -t.y)).rgb);
  float gx = -tl - 2.0 * ml - bl + tr + 2.0 * mr + br;
  float gy = -tl - 2.0 * tc - tr + bl + 2.0 * bc + br;
  // Edges are judged perceptually: dark-on-dark edges still count.
  return sqrt(gx * gx + gy * gy) / (0.08 + inkLuma(texture2D(inputBuffer, uv).rgb));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  if (uAmount <= 0.001) {
    outputColor = inputColor;
    return;
  }

  // CSS-pixel coordinates: stroke spacing stays the same on every screen.
  vec2 px = uv * resolution / max(uPixelRatio, 1.0);
  vec3 col = inputColor.rgb;

  float tone = pow(clamp(inkLuma(col), 0.0, 1.0), 1.0 / 2.2);
  tone = smoothstep(0.035, 0.7, tone);
  float darkness = 1.0 - tone;

  float ink = hatch(px, 0.7854, 5.0, (darkness - 0.14) * 0.95);
  if (uDirections > 1.5) ink = max(ink, hatch(px, -0.7854, 5.5, (darkness - 0.38) * 1.15));
  if (uDirections > 2.5) ink = max(ink, hatch(px, 0.0, 4.5, (darkness - 0.6) * 1.35));
  if (uDirections > 3.5) ink = max(ink, hatch(px, 1.5708, 4.0, (darkness - 0.8) * 1.8));

  float midtones = smoothstep(0.22, 0.42, darkness) * (1.0 - smoothstep(0.55, 0.78, darkness));
  ink = max(ink, screentone(px, 6.0, darkness * 0.55) * midtones * 0.8);

  if (uSobel > 0.5) {
    ink = max(ink, smoothstep(0.35, 1.1, sobel(uv)) * 0.95);
  }

  float fibre = vnoise(px * vec2(0.035, 0.8)) * 0.5 + vnoise(px * 0.3) * 0.5;
  vec3 paper = uPaper * mix(0.12, 1.0, tone) * (0.94 + 0.07 * fibre);
  // Keep a trace of the scene's hue so crimson and gold light still read on the page.
  paper = mix(paper, col * 1.3 + paper * 0.2, 0.28);
  // Burning highlights (hot iron, the window) keep their own light.
  paper = mix(paper, col, smoothstep(0.82, 1.0, tone));
  vec3 inked = mix(paper, uInk, ink);

  outputColor = vec4(mix(col, inked, uAmount), inputColor.a);
}
