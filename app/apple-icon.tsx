import { ImageResponse } from "next/og";
import { SEED_FACETS, SEED_SEAM, SEED_VIEWBOX } from "@/components/ui/SeedMark";
import { palette } from "@/lib/palette";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the Seed in gold on the abyss, crimson seam through it. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: palette.abyss,
        }}
      >
        <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <radialGradient id="glow" cx="90" cy="98" r="90" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#8E0F1B" stopOpacity="0.55" />
              <stop offset="1" stopColor="#8E0F1B" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="180" height="180" fill="url(#glow)" />
        </svg>
        <svg width="92" height="147" viewBox={SEED_VIEWBOX}>
          <polygon points={SEED_FACETS.litLeft} fill="#E3C27E" />
          <polygon points={SEED_FACETS.midRight} fill="#C9A45C" />
          <polygon points={SEED_FACETS.darkLeft} fill="#7A6236" />
          <polygon points={SEED_FACETS.darkestRight} fill="#4E3F24" />
          <path d={SEED_SEAM} fill="none" stroke="#E2572B" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}
