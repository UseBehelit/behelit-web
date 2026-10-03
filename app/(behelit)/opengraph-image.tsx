import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SEED_FACETS, SEED_SEAM, SEED_VIEWBOX } from "@/components/ui/SeedMark";
import { descent, meta, site } from "@/content/copy";
import { palette } from "@/lib/palette";
import { mulberry32 } from "@/lib/random";

export const alt = meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Ink hatching for the frame edges: deterministic diagonal strokes. */
function hatchLines(): Array<{ x1: number; y1: number; x2: number; y2: number; w: number }> {
  const rand = mulberry32(7);
  const lines = [];
  for (let i = -40; i < 150; i++) {
    const x = i * 9;
    const jitter = (rand() - 0.5) * 6;
    lines.push({ x1: x + jitter, y1: 0, x2: x - 420 + jitter, y2: 630, w: 0.6 + rand() * 1.6 });
  }
  return lines;
}

/**
 * The share card, in the site's art direction: the Seed over a crimson glow,
 * ink hatching closing in from the edges, a manga panel frame, the wordmark.
 * Static — rendered once at build time. Fonts are OFL files from Google Fonts
 * (assets/fonts), since the OG renderer can't read the WOFF2 next/font ships.
 */
export default async function OpenGraphImage() {
  const [display, italic] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/CormorantSC-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Spectral-Italic.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: palette.abyss,
          fontFamily: "Cormorant SC",
        }}
      >
        {/* Core glow + hatching, heavier towards the edges. */}
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <radialGradient id="glow" cx="325" cy="310" r="360" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#8E0F1B" stopOpacity="0.62" />
              <stop offset="0.35" stopColor="#8E0F1B" stopOpacity="0.22" />
              <stop offset="1" stopColor="#8E0F1B" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="fade" cx="0.3" cy="0.48" r="0.9">
              <stop offset="0.28" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="1" />
            </radialGradient>
            <mask id="m">
              <rect width="1200" height="630" fill="url(#fade)" />
            </mask>
          </defs>
          <rect width="1200" height="630" fill="url(#glow)" />
          <g mask="url(#m)" stroke="#2A2B31" opacity="0.9">
            {hatchLines().map((l, i) => (
              <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} strokeWidth={l.w} />
            ))}
          </g>
        </svg>

        {/* The Seed. */}
        <svg
          width="250"
          height="400"
          viewBox={SEED_VIEWBOX}
          style={{ position: "absolute", left: 200, top: 112 }}
        >
          <polygon points={SEED_FACETS.litLeft} fill="#5b5249" />
          <polygon points={SEED_FACETS.midRight} fill="#3a3530" />
          <polygon points={SEED_FACETS.darkLeft} fill="#26221f" />
          <polygon points={SEED_FACETS.darkestRight} fill="#171514" />
          <path d={SEED_SEAM} fill="none" stroke="#8E0F1B" strokeWidth="3.2" strokeLinecap="round" />
          <path d={SEED_SEAM} fill="none" stroke="#FF8A4C" strokeWidth="0.9" strokeLinecap="round" />
          <polyline points="21.5,1.5 31,15 36.5,30" fill="none" stroke="#C9A45C" strokeWidth="0.5" />
        </svg>

        {/* Manga panel frame with overshooting corners. */}
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <g stroke={palette.bone} strokeWidth="4" strokeLinecap="round">
            <line x1="20" y1="30" x2="1178" y2="27" />
            <line x1="1172" y1="18" x2="1175" y2="612" />
            <line x1="1182" y1="603" x2="22" y2="606" />
            <line x1="30" y1="615" x2="27" y2="20" />
          </g>
        </svg>

        <div
          style={{
            position: "absolute",
            left: 560,
            top: 150,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: "0.32em", color: palette.gold, display: "flex" }}>
            {`${site.established} · ${descent.motto.toUpperCase()}`}
          </div>
          <div style={{ fontSize: 150, lineHeight: 1, color: palette.bone, marginTop: 18, letterSpacing: "-0.01em", display: "flex" }}>
            BEHELIT
          </div>
          <div
            style={{
              fontFamily: "Spectral",
              fontStyle: "italic",
              fontSize: 46,
              color: palette.bone,
              marginTop: 16,
              display: "flex",
            }}
          >
            {descent.tagline}
          </div>
          <div style={{ width: 90, height: 2, background: palette.gold, marginTop: 34, display: "flex" }} />
          <div style={{ fontFamily: "Spectral", fontStyle: "italic", fontSize: 24, color: palette.silver, marginTop: 20, maxWidth: 520, display: "flex" }}>
            {descent.positioning}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant SC", data: display, weight: 700, style: "normal" },
        { name: "Spectral", data: italic, weight: 400, style: "italic" },
      ],
    },
  );
}
