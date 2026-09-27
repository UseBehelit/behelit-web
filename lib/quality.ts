/**
 * Quality tiers for the WebGL layer.
 *
 * The starting tier comes from cheap device heuristics (`detectInitialTier`);
 * after that, drei's <PerformanceMonitor> walks it down (or back up, never
 * above the heuristic ceiling) based on measured frame rate.
 *
 * Append `?quality=high|medium|low|off` to the URL to force a tier while
 * testing — `off` shows the static no-WebGL art.
 */

export type QualityTier = "high" | "medium" | "low";

export interface QualitySettings {
  tier: QualityTier;
  /** [min, max] device pixel ratio handed to the <Canvas>. */
  dpr: [number, number];
  /** Glowing, additive particles. */
  embers: number;
  /** Matte, alpha-blended flakes. */
  ash: number;
  /** fbm octaves in the Seed and relic shaders. */
  noiseOctaves: number;
  /** MSAA samples on the composer's main buffer (0 = off). */
  msaa: number;
  bloom: false | { levels: number; resolutionScale: number };
  ink: { directions: 2 | 3 | 4; sobel: boolean };
  godRays: boolean;
  chromaticAberration: boolean;
  grain: boolean;
  heatHaze: boolean;
  /** Shadow-map size for the key light; 0 disables real-time shadows. */
  shadows: 0 | 512 | 1024;
}

export const QUALITY: Record<QualityTier, QualitySettings> = {
  high: {
    tier: "high",
    dpr: [1, 2],
    embers: 1800,
    ash: 6200,
    noiseOctaves: 4,
    msaa: 4,
    bloom: { levels: 7, resolutionScale: 1 },
    ink: { directions: 4, sobel: true },
    godRays: true,
    chromaticAberration: true,
    grain: true,
    heatHaze: true,
    shadows: 1024,
  },
  medium: {
    tier: "medium",
    dpr: [1, 1.5],
    embers: 1200,
    ash: 3800,
    noiseOctaves: 3,
    msaa: 2,
    bloom: { levels: 5, resolutionScale: 0.5 },
    ink: { directions: 3, sobel: true },
    godRays: false,
    chromaticAberration: true,
    grain: true,
    heatHaze: true,
    shadows: 512,
  },
  low: {
    tier: "low",
    dpr: [1, 1.25],
    embers: 800,
    ash: 2200,
    noiseOctaves: 2,
    msaa: 0,
    bloom: false,
    ink: { directions: 2, sobel: false },
    godRays: false,
    chromaticAberration: false,
    grain: false,
    heatHaze: false,
    shadows: 0,
  },
};

export const TIER_ORDER: readonly QualityTier[] = ["low", "medium", "high"];

export function stepTier(tier: QualityTier, delta: -1 | 1, ceiling: QualityTier): QualityTier {
  const index = TIER_ORDER.indexOf(tier) + delta;
  const max = TIER_ORDER.indexOf(ceiling);
  return TIER_ORDER[Math.max(0, Math.min(max, index))];
}

export interface GLSupport {
  supported: boolean;
  renderer: string;
  /** Software rasterisers (SwiftShader, llvmpipe) can't hold the budget. */
  software: boolean;
}

/** Probe WebGL2 once, without keeping the context alive. */
export function detectWebGL(): GLSupport {
  const unsupported: GLSupport = { supported: false, renderer: "", software: false };
  if (typeof document === "undefined") return unsupported;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) return unsupported;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(
      info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
    );
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    const software = /swiftshader|llvmpipe|software|basic render/i.test(renderer);
    return { supported: !software, renderer, software };
  } catch {
    return unsupported;
  }
}

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/** Ceiling tier for this device. The live monitor can only step down from here, then back up to it. */
export function detectInitialTier(renderer: string): QualityTier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as NavigatorHints;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const shortSide = Math.min(window.screen.width, window.screen.height);
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 8;

  if (nav.connection?.saveData) return "low";
  if (coarse && shortSide < 700) return "low"; // phones
  if (cores <= 4 || memory <= 4) return "low";
  if (coarse) return "medium"; // tablets

  const discrete = /nvidia|geforce|rtx|gtx|quadro|radeon (rx|pro)|arc a\d|apple m\d (pro|max|ultra)/i.test(renderer);
  if (discrete && cores >= 8) return "high";
  if (/apple m\d/i.test(renderer)) return "high";
  return "medium";
}

/** `?quality=` override, used for testing tiers and the static fallback. */
export function readQualityOverride(): QualityTier | "off" | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("quality");
  return value === "high" || value === "medium" || value === "low" || value === "off" ? value : null;
}

export function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

/** Clamp a tier's DPR range to the spec's caps: 2 on desktop, 1.5 on phones. */
export function dprFor(settings: QualitySettings): [number, number] {
  const cap = isMobileViewport() ? 1.5 : 2;
  return [settings.dpr[0], Math.min(settings.dpr[1], cap)];
}
