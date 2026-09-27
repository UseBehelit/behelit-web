# behelit.dev

The landing page of Behelit, a one-person independent app studio, built as
a single scroll-driven descent through five chapters:

| Chapter | DOM | 3D station |
| --- | --- | --- |
| I · The Descent | Wordmark reveal, tagline ink-bleed | The Seed breathing above a fog sea; embers and ash |
| II · The Doctrine | Three principles as manga panels that ink their own frames | A drowned nave of broken pillars, rendered through the ink (crosshatch) pass |
| III · The Relics | One slide per app, scroll-snapped | One altar per app; the relic's look is driven by its status |
| IV · The Forge | Spark → Shape → Temper → Ship, pinned horizontal track | An anvil heating from ash to ember to gold |
| V · The Pact | Ritual circle with the address, launch-notes form | A carved circle under a shaft of gold light |

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS v4,
three.js + @react-three/fiber + drei + @react-three/postprocessing, GSAP
(ScrollTrigger, ScrollSmoother) via `@gsap/react`, Motion (`motion/react`).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (Turbopack)
npm run lint
```

## Editing content

**Apps — `content/relics.ts`.** The only place app data lives. Each entry
becomes one altar and one panel, in array order:

```ts
{
  id: "soulen",                       // stable, unique; also seeds the relic's shape
  name: "Soulen",
  tagline: "Your dreams, interpreted.",
  description: "One or two sentences.",
  status: "live",                     // "forging" | "live" | "in-review" | "vaulted"
  platforms: {
    ios: { status: "live", url: "https://apps.apple.com/…" },
    android: { status: "planned" },   // no url → plain label, not a link
  },
  accent: "#C9A45C",                  // optional: halo, inlays, panel rule
}
```

The status alone picks the relic's look: `forging` glows as hot iron and
throws sparks, `live` is lit with a calm halo, `in-review` is a dimmer twin
with a filling ring, `vaulted` is shattered and rusted. Adding or removing
entries is fine — the camera path, snapping and altars are generated from the
array length. The file ships with four clearly marked placeholders.

**Words — `content/copy.ts`.** Every string on the page: chapter titles,
principles, forge steps, the pact, footer legal links, metadata and the
Open Graph alt text. `site.instagram` is empty on purpose; set it to the
profile URL and the footer shows an Instagram link.

**Launch notes — `lib/subscribe.ts`.** A clearly marked stub: it validates
the address, then honestly reports that nothing was stored. Replace the
marked block with a real request and return `{ ok: true }`; the form already
handles success, invalid input, errors and the unconfigured state.

**Colour — `lib/palette.ts`.** The single source for the palette.
`app/globals.css` mirrors it as Tailwind tokens; shaders read it as uniforms.

## GLSL imports

Shaders live in `/shaders/*.glsl` and are imported as strings:

```ts
import seedFrag from "@/shaders/seed.frag.glsl";
```

- **Loader.** Next 16 builds with Turbopack by default, and a custom `webpack`
  config fails the build, so the rule is registered under `turbopack.rules` in
  `next.config.ts`: `raw-loader` with `as: "*.js"`. (Turbopack's built-in
  `type: "raw"` module type does not produce a default export — the import
  comes back `undefined`.)
- **Types.** `types/glsl.d.ts` declares `*.glsl` as a string module.
- **Includes.** Raw imports can't follow includes, so shaders write
  `#pragma include <noise>` (or `<fog>`, `<lighting>`) and `lib/glsl.ts`
  splices the chunk in before compiling. Order: `noise`, then `fog`, then
  `lighting`.

## Quality tiers

`lib/quality.ts` picks a ceiling tier from device hints (cores, memory,
pointer type, GPU renderer string); drei's `PerformanceMonitor` then steps
between tiers on measured frame rate (never above the ceiling), locking after
two round trips.

| | high | medium | low |
| --- | --- | --- | --- |
| DPR cap | 2 | 1.5 | 1.25 (phones never above 1.5) |
| Embers + ash | 8,000 | 5,000 | 3,000 |
| Post | bloom, god rays, ink (4 hatch directions + Sobel), heat haze, CA, grain, vignette, MSAA 4× | bloom (½ res), ink (3 + Sobel), heat haze, CA, grain, vignette, MSAA 2× | ink (2 directions), vignette |
| Shadows | 1024 | 512 | off |

Append `?quality=high|medium|low` to force a tier, or `?quality=off` to see
the static no-WebGL art. The active tier is on the canvas container as
`data-tier`.

## Fallbacks and accessibility

- All text, links and the address are server-rendered and readable without
  WebGL and without JavaScript (the forge becomes a grid, reveals are skipped).
- The 3D chunk (~290 KB gzip) and GSAP (~23 KB gzip) load after first paint.
  Shaders are compiled with `compileAsync` against the composer's render
  target before the first frame, so start-up doesn't stall the main thread.
- `prefers-reduced-motion`: no smooth scrolling, no camera travel (stations
  cut with a fade), no particle motion, no page turns, no pinning; the scene
  renders on demand.
- No WebGL2 (or a software renderer): the CSS/SVG art in
  `components/ui/BackdropArt.tsx` stays in place.
- One `h1`, landmarks, a skip link, gold focus rings. Relic panels are
  focusable and describe the relic's visual state for screen readers.

## Fonts and licences

Cormorant SC, Spectral and JetBrains Mono from Google Fonts (SIL Open Font
License) via `next/font`. The Open Graph image renderer can't read WOFF2, so
OFL TTFs for it live in `assets/fonts/` with their licence files. Every
texture is procedural; there are no downloaded models or images.

## Known limitations

- Performance was measured on one machine (RTX 3070 Ti) with CPU throttling
  to approximate slower devices; GPU cost on integrated and mobile GPUs is
  covered by the tier system, not by measurement.
- Under Lighthouse's simulated slow-4G mobile profile, LCP is estimated at
  ~3.8 s (observed LCP in the same run is ~0.6 s); applied throttling gives
  ~2.9 s, dominated by the connection itself. Desktop LCP is 0.8 s, CLS 0.
- The 3D bundle is large by nature (three.js + postprocessing); it is never
  on the critical path.
