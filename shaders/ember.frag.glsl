// ───────────────────────────────────────────────────────────────────────────
// ember.frag.glsl — the sprite for each point.
//
// Embers: a gaussian core plus a wider halo, coloured along a cooling ramp
// (white-gold → orange → deep red) and pushed into HDR so bloom catches them.
// Premultiplied output for additive blending.
//
// Ash: the sprite square is rotated per particle and cut into an irregular,
// flattened flake with a few angular harmonics — matte, lit only by fog tint.
// ───────────────────────────────────────────────────────────────────────────

uniform vec3 uHot;
uniform vec3 uCool;
uniform vec3 uAsh;
uniform float uIntensity;
uniform vec3 uFogTint;

varying float vAlpha;
varying float vHeat;
varying float vFlicker;
varying float vRot;
varying float vFog;

void main() {
  vec2 uv = gl_PointCoord - 0.5;

  #ifdef EMBER
    float d2 = dot(uv, uv);
    float core = exp(-d2 * 70.0);
    float halo = exp(-d2 * 10.0) * 0.3;
    float a = (core + halo) * vAlpha * vFlicker * (1.0 - vFog * 0.85);
    if (a < 0.003) discard;
    vec3 ramp = mix(uCool, uHot, smoothstep(0.1, 0.9, vHeat));
    vec3 color = ramp * (core * 7.0 + halo * 2.0) * uIntensity;
    gl_FragColor = vec4(color * a, a);
  #else
    float c = cos(vRot);
    float s = sin(vRot);
    uv = mat2(c, -s, s, c) * uv;
    float angle = atan(uv.y, uv.x);
    // A small, slightly lumpy flake — irregular enough to read as ash, round
    // enough never to read as a silhouette of anything.
    float radius = 0.34 + 0.05 * sin(angle * 3.0 + vRot * 2.0) + 0.03 * sin(angle * 5.0 - vRot);
    float shape = 1.0 - smoothstep(radius - 0.12, radius, length(uv * vec2(1.0, 1.35)));
    float a = shape * vAlpha * 0.42;
    if (a < 0.01) discard;
    vec3 color = mix(uAsh, uFogTint, vFog);
    gl_FragColor = vec4(color, a);
  #endif

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
