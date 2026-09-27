import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import { Color, Uniform } from "three";
import { palette } from "@/lib/palette";
import inkFragment from "@/shaders/ink.frag.glsl";

export interface InkOptions {
  /** Number of hatch families, 2–4 (quality tier). */
  directions?: 2 | 3 | 4;
  /** Sobel contour lines (skipped on the low tier). */
  sobel?: boolean;
}

/**
 * Manga ink as a postprocessing Effect: crosshatching by brightness band,
 * midtone screentone, paper fibres and Sobel contours (shaders/ink.frag.glsl).
 * `amount` is driven per chapter by the camera rig — full strength in the
 * Doctrine, a faint texture everywhere else.
 *
 * CONVOLUTION: the Sobel filter samples neighbouring texels of the input
 * buffer, so postprocessing must give this effect its own pass.
 */
export class InkEffect extends Effect {
  constructor({ directions = 4, sobel = true }: InkOptions = {}) {
    super("InkEffect", inkFragment, {
      attributes: EffectAttribute.CONVOLUTION,
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform>([
        ["uAmount", new Uniform(0)],
        ["uDirections", new Uniform(directions)],
        ["uSobel", new Uniform(sobel ? 1 : 0)],
        ["uPixelRatio", new Uniform(1)],
        ["uInk", new Uniform(new Color("#050407"))],
        ["uPaper", new Uniform(new Color(palette.bone).multiplyScalar(0.62))],
      ]),
    });
  }

  get amount(): number {
    return this.uniforms.get("uAmount")!.value as number;
  }

  set amount(value: number) {
    this.uniforms.get("uAmount")!.value = value;
  }

  set pixelRatio(value: number) {
    this.uniforms.get("uPixelRatio")!.value = value;
  }

  setQuality(directions: 2 | 3 | 4, sobel: boolean): void {
    this.uniforms.get("uDirections")!.value = directions;
    this.uniforms.get("uSobel")!.value = sobel ? 1 : 0;
  }
}
