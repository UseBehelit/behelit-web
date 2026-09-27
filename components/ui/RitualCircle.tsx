"use client";

import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pact, site } from "@/content/copy";
import { stage } from "@/lib/stage";
import { mulberry32, r } from "@/lib/random";
import { placeRing, type RingSpec } from "./glyphs";

const SIZE = 600;
const C = SIZE / 2;

const RINGS: ReadonlyArray<RingSpec & { period: number }> = [
  { radius: 268, count: 56, scale: 1.05, seed: 3, period: 140 },
  { radius: 214, count: 42, scale: 0.95, seed: 5, period: -100 },
  { radius: 162, count: 30, scale: 0.9, seed: 8, period: 80 },
];

/** A ragged ink blot: a circle whose radius is pushed around by a few harmonics. */
function splashPath(seed: number): { blot: string; drops: Array<{ cx: number; cy: number; r: number }> } {
  const rand = mulberry32(seed);
  const phases = [rand() * 6.28, rand() * 6.28, rand() * 6.28];
  const points: string[] = [];
  const steps = 48;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const radius =
      100 +
      14 * Math.sin(a * 3 + phases[0]) +
      9 * Math.sin(a * 7 + phases[1]) +
      (rand() < 0.18 ? 22 + rand() * 26 : 0) + // tendrils
      5 * Math.sin(a * 13 + phases[2]);
    points.push(`${r(Math.cos(a) * radius)} ${r(Math.sin(a) * radius)}`);
  }
  const drops = Array.from({ length: 9 }, () => {
    const a = rand() * Math.PI * 2;
    const dist = 132 + rand() * 60;
    return { cx: r(Math.cos(a) * dist), cy: r(Math.sin(a) * dist), r: r(3 + rand() * 7) };
  });
  return { blot: `M${points.join(" L")} Z`, drops };
}

type CopyState = "idle" | "copied" | "failed";

/**
 * Chapter V's centrepiece: three counter-rotating rings of invented glyphs
 * around the studio address. Hover or focus speeds the rings up (GSAP),
 * lights the glyphs and draws a crimson line around the circle; clicking the
 * address copies it and throws an ink splash.
 */
export function RitualCircle() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const emailRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef<(on: boolean) => void>(() => {});
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [splashKey, setSplashKey] = useState(0);

  const rings = useMemo(() => RINGS.map((ring) => ({ ...ring, glyphs: placeRing(ring, C, C) })), []);
  const splash = useMemo(() => splashPath(splashKey + 17), [splashKey]);

  // GSAP is loaded lazily and shared with the scroll engine's chunk.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let disposed = false;
    let cleanup = () => {};

    import("gsap").then(({ gsap }) => {
      if (disposed) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const ctx = gsap.context(() => {
        const spins = reduce
          ? []
          : Array.from(svg.querySelectorAll<SVGGElement>("[data-ring]")).map((ring, i) =>
              gsap.to(ring, {
                rotation: RINGS[i].period > 0 ? 360 : -360,
                duration: Math.abs(RINGS[i].period),
                ease: "none",
                repeat: -1,
                svgOrigin: `${C} ${C}`,
              }),
            );
        const glyphs = svg.querySelectorAll("[data-glyph]");
        const line = svg.querySelector("[data-pact-line]");

        activeRef.current = (on: boolean) => {
          stage.pact = on ? 1 : 0;
          spins.forEach((spin) =>
            gsap.to(spin, { timeScale: on ? 7 : 1, duration: on ? 1.1 : 2.2, ease: "power2.out", overwrite: true }),
          );
          gsap.to(glyphs, {
            opacity: on ? 1 : 0.42,
            duration: on ? 0.5 : 0.9,
            stagger: { each: 0.0035, from: "random" },
            overwrite: true,
          });
          if (line) {
            gsap.to(line, { strokeDashoffset: on ? 0 : 1, duration: on ? 1.1 : 0.7, ease: "power3.inOut", overwrite: true });
          }
        };
      }, svg);
      cleanup = () => ctx.revert();
    });

    return () => {
      disposed = true;
      stage.pact = 0;
      cleanup();
    };
  }, []);

  const onEnter = useCallback(() => activeRef.current(true), []);
  const onLeave = useCallback(() => {
    if (rootRef.current?.contains(document.activeElement)) return;
    activeRef.current(false);
  }, []);

  const copy = useCallback(async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(site.email);
      ok = true;
    } catch {
      // Clipboard API unavailable (insecure context, permissions): select the
      // address so the visitor can copy it by hand.
      const node = emailRef.current;
      const selection = window.getSelection();
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    setCopyState(ok ? "copied" : "failed");
    if (ok) setSplashKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 3200);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  return (
    <div
      ref={rootRef}
      className="relative mx-auto aspect-square w-[min(92vw,38rem)]"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) activeRef.current(false);
      }}
    >
      <svg ref={svgRef} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <radialGradient id="pact-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#07070A" stopOpacity="0.92" />
            <stop offset="62%" stopColor="#07070A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#07070A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={C} fill="url(#pact-pool)" />

        {/* Guide rings and ticks */}
        <g fill="none" stroke="#E8E2D6" strokeOpacity="0.16" strokeWidth="1">
          {[290, 246, 236, 190, 184, 136].map((radius) => (
            <circle key={radius} cx={C} cy={C} r={radius} />
          ))}
        </g>
        <g stroke="#9AA3A8" strokeOpacity="0.35" strokeWidth="1">
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i / 72) * Math.PI * 2;
            const inner = i % 6 === 0 ? 278 : 284;
            return (
              <line
                key={i}
                x1={r(C + Math.sin(a) * inner)}
                y1={r(C - Math.cos(a) * inner)}
                x2={r(C + Math.sin(a) * 290)}
                y2={r(C - Math.cos(a) * 290)}
              />
            );
          })}
        </g>

        {rings.map((ring, i) => (
          <g key={i} data-ring={i} className="ritual-ring">
            {ring.glyphs.map((glyph, k) => (
              <path
                key={k}
                data-glyph=""
                className="ritual-glyph"
                d={glyph.d}
                transform={glyph.transform}
                fill="none"
                stroke={i === 1 ? "#C9A45C" : "#E8E2D6"}
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.42}
              />
            ))}
          </g>
        ))}

        {/* The crimson line that closes the circle on hover/focus. */}
        <circle
          data-pact-line=""
          cx={C}
          cy={C}
          r={300}
          fill="none"
          stroke="#8E0F1B"
          strokeWidth="3"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          transform={`rotate(-90 ${C} ${C})`}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-[18%] text-center">
        <div className="relative">
          <AnimatePresence>
            {copyState === "copied" && (
              <m.svg
                key={splashKey}
                aria-hidden="true"
                viewBox="-200 -200 400 400"
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[150%] -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.2, opacity: 0.95, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, mass: 0.7 }}
              >
                <path d={splash.blot} fill="#8E0F1B" fillOpacity="0.92" />
                {splash.drops.map((drop, i) => (
                  <circle key={i} cx={drop.cx} cy={drop.cy} r={drop.r} fill={i % 3 === 0 ? "#C9A45C" : "#8E0F1B"} />
                ))}
              </m.svg>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={copy}
            aria-label={`${pact.copyLabel}: ${site.email}`}
            className="group flex flex-col items-center gap-2 px-3 py-2"
          >
            <span
              ref={emailRef}
              className="font-display text-[clamp(1.35rem,4.6vw,2.6rem)] font-semibold leading-none text-bone transition-colors group-hover:text-gold"
            >
              {site.email}
            </span>
            <span className="label-mono text-[0.625rem] text-silver">{pact.copyHint}</span>
          </button>
        </div>

        <a
          href={`mailto:${site.email}`}
          className="label-mono border-b border-gold/50 pb-1 text-[0.625rem] text-gold transition-colors hover:border-gold hover:text-bone"
        >
          {pact.mailto}
        </a>

        <p role="status" aria-live="polite" className="label-mono min-h-[1.5em] text-[0.625rem] text-bone">
          {copyState === "copied" ? pact.copied : copyState === "failed" ? pact.copyFailed : ""}
        </p>
      </div>
    </div>
  );
}
