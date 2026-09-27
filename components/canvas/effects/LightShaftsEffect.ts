import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import { Uniform, Vector2 } from "three";

/**
 * Cheap god rays (screen-space light scattering, after Mitchell, GPU Gems 3):
 * march from each pixel towards the light's screen position, summing only the
 * HDR part of the samples with exponential decay. Dark pillars between the
 * pixel and the window occlude the march, so shafts appear between them.
 * `uIntensity` 0 short-circuits the pass outside the nave.
 */
const fragment = /* glsl */ `
  uniform vec2 uSun;
  uniform float uIntensity;
  uniform float uDensity;
  uniform float uDecay;
  uniform float uWeight;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    if (uIntensity <= 0.001) {
      outputColor = inputColor;
      return;
    }
    vec2 stepUv = (uv - uSun) * uDensity / float(SAMPLES);
    vec2 coord = uv;
    float illumination = 1.0;
    vec3 sum = vec3(0.0);
    for (int i = 0; i < SAMPLES; i++) {
      coord -= stepUv;
      vec3 s = texture2D(inputBuffer, clamp(coord, 0.0, 1.0)).rgb;
      sum += max(s - 0.9, 0.0) * illumination * uWeight;
      illumination *= uDecay;
    }
    outputColor = vec4(inputColor.rgb + sum * uIntensity, inputColor.a);
  }
`;

export class LightShaftsEffect extends Effect {
  constructor(samples = 28) {
    super("LightShaftsEffect", fragment, {
      attributes: EffectAttribute.CONVOLUTION,
      blendFunction: BlendFunction.NORMAL,
      defines: new Map([["SAMPLES", String(samples)]]),
      uniforms: new Map<string, Uniform>([
        ["uSun", new Uniform(new Vector2(0.5, 0.8))],
        ["uIntensity", new Uniform(0)],
        ["uDensity", new Uniform(0.92)],
        ["uDecay", new Uniform(0.955)],
        ["uWeight", new Uniform(0.06)],
      ]),
    });
  }

  get sun(): Vector2 {
    return this.uniforms.get("uSun")!.value as Vector2;
  }

  set intensity(value: number) {
    this.uniforms.get("uIntensity")!.value = value;
  }
}
