import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2, Vector3 } from "three";

/**
 * Heat shimmer around hot things (forging relics, the anvil). A `mainUv`
 * effect: it bends the lookup coordinates for everything after it, inside a
 * soft radius around up to two screen-space sources. The offset is two
 * crossed sine fields scrolling upward — cheap, and it reads as rising air.
 */
const fragment = /* glsl */ `
  uniform vec3 uSources[2];   // xy: screen uv, z: radius in uv units (height-relative)
  uniform float uStrength[2];

  void mainUv(inout vec2 uv) {
    vec2 offset = vec2(0.0);
    for (int i = 0; i < 2; i++) {
      if (uStrength[i] <= 0.001) continue;
      vec2 d = (uv - uSources[i].xy) * vec2(aspect, 1.0);
      // Shimmer lives mostly above the source: stretch the falloff upward.
      d.y *= d.y > 0.0 ? 0.55 : 1.6;
      float mask = exp(-dot(d, d) / (uSources[i].z * uSources[i].z) * 2.2);
      float w1 = sin(uv.y * 95.0 - time * 7.0 + sin(uv.x * 38.0 + time * 1.7) * 2.2);
      float w2 = sin(uv.y * 61.0 - time * 5.1 + uv.x * 27.0);
      offset += vec2(w1, w2 * 0.6) * 0.0028 * uStrength[i] * mask;
    }
    uv += offset;
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = inputColor;
  }
`;

export class HeatHazeEffect extends Effect {
  constructor() {
    super("HeatHazeEffect", fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([
        ["uSources", new Uniform([new Vector3(), new Vector3()])],
        ["uStrength", new Uniform([0, 0])],
      ]),
    });
  }

  setSource(index: 0 | 1, uv: Vector2, radius: number, strength: number): void {
    const sources = this.uniforms.get("uSources")!.value as Vector3[];
    const strengths = this.uniforms.get("uStrength")!.value as number[];
    sources[index].set(uv.x, uv.y, radius);
    strengths[index] = strength;
  }
}
