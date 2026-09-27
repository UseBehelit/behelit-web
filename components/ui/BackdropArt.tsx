import { SEED_FACETS, SEED_SEAM, SEED_VIEWBOX } from "./SeedMark";

/**
 * The static stage: what you see before WebGL arrives, and all you see
 * without it (no WebGL2, software rendering, or `?quality=off`).
 * CSS gradients for fog and glow, SVG for the Seed and ink hatching —
 * the same art direction, just not moving.
 */
export function BackdropArt() {
  return (
    <div aria-hidden="true" className="backdrop-art pointer-events-none fixed inset-0 z-0 overflow-hidden bg-abyss">
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(38% 30% at 50% 36%, rgb(142 15 27 / 0.34), transparent 72%)",
            "radial-gradient(80% 55% at 50% -8%, rgb(201 164 92 / 0.12), transparent 62%)",
            "radial-gradient(120% 50% at 50% 100%, rgb(42 43 49 / 0.55), transparent 70%)",
            "linear-gradient(to bottom, #07070a 0%, #0b0a0d 48%, #131218 70%, #07070a 100%)",
          ].join(","),
        }}
      />

      {/* The fog sea the Seed floats over. */}
      <div
        className="absolute inset-x-[-10%] top-[56%] h-[26%] blur-md"
        style={{ background: "linear-gradient(to bottom, transparent, rgb(42 43 49 / 0.5) 45%, rgb(22 22 27 / 0.2) 75%, transparent)" }}
      />

      {/* The Seed. */}
      <svg
        viewBox={SEED_VIEWBOX}
        className="absolute left-1/2 top-[36%] h-[36vmin] w-auto -translate-x-1/2 -translate-y-1/2 text-[#2b2a31] drop-shadow-[0_0_48px_rgb(142_15_27/0.6)]"
      >
        <polygon points={SEED_FACETS.litLeft} fill="currentColor" />
        <polygon points={SEED_FACETS.midRight} fill="#1f1e24" />
        <polygon points={SEED_FACETS.darkLeft} fill="#16161b" />
        <polygon points={SEED_FACETS.darkestRight} fill="#0f0f13" />
        <path d={SEED_SEAM} fill="none" stroke="#e2572b" strokeWidth="0.9" strokeLinecap="round" opacity="0.9" />
        <path d={SEED_SEAM} fill="none" stroke="#8e0f1b" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
      </svg>

      {/* Ink: two hatch directions, heavier towards the edges, roughened by noise. */}
      <svg className="absolute inset-0 size-full" preserveAspectRatio="none">
        <defs>
          <pattern id="bd-hatch-a" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
            <line x1="0" y1="0" x2="0" y2="7" stroke="#07070a" strokeWidth="1.7" />
          </pattern>
          <pattern id="bd-hatch-b" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-52)">
            <line x1="0" y1="0" x2="0" y2="9" stroke="#07070a" strokeWidth="1.4" />
          </pattern>
          <radialGradient id="bd-fade-a" cx="50%" cy="40%" r="75%">
            <stop offset="18%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.9" />
          </radialGradient>
          <radialGradient id="bd-fade-b" cx="50%" cy="40%" r="70%">
            <stop offset="45%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </radialGradient>
          <mask id="bd-mask-a">
            <rect width="100%" height="100%" fill="url(#bd-fade-a)" />
          </mask>
          <mask id="bd-mask-b">
            <rect width="100%" height="100%" fill="url(#bd-fade-b)" />
          </mask>
          <filter id="bd-rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="4" />
          </filter>
        </defs>
        <g filter="url(#bd-rough)">
          <rect width="100%" height="100%" fill="url(#bd-hatch-a)" mask="url(#bd-mask-a)" />
          <rect width="100%" height="100%" fill="url(#bd-hatch-b)" mask="url(#bd-mask-b)" />
        </g>
      </svg>

      {/* Vignette. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_55%,rgb(7_7_10/0.85)_100%)]" />
    </div>
  );
}
