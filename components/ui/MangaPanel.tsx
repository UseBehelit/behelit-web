"use client";

import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { mulberry32, r } from "@/lib/random";

type Point = [number, number];

/**
 * One ruled ink line per side, the way an inker frames a panel: the pen
 * overshoots each corner a little and never runs perfectly straight.
 * Each side is its own <path> so the scroll director can draw them in order.
 */
function frameSides(w: number, h: number, seed: number): string[] {
  const rand = mulberry32(seed);
  const jitter = (amount: number) => (rand() - 0.5) * amount;
  const corners: Point[] = [
    [jitter(3), jitter(3)],
    [w + jitter(3), jitter(3)],
    [w + jitter(3), h + jitter(3)],
    [jitter(3), h + jitter(3)],
  ];

  return corners.map((start, i) => {
    const end = corners[(i + 1) % 4];
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    // Normal to the side, for the pen's sideways wander.
    const nx = -uy;
    const ny = ux;
    const before = 4 + rand() * 7;
    const after = 3 + rand() * 9;
    const points: Point[] = [[start[0] - ux * before, start[1] - uy * before]];
    for (const t of [0.33, 0.68]) {
      const wander = jitter(1.6);
      points.push([start[0] + dx * t + nx * wander, start[1] + dy * t + ny * wander]);
    }
    points.push([end[0] + ux * after, end[1] + uy * after]);
    return points.map(([x, y], k) => `${k === 0 ? "M" : "L"}${r(x, 1)} ${r(y, 1)}`).join(" ");
  });
}

/**
 * Focus lines (集中線): thin wedges converging on the panel — the manga
 * shorthand for "look here". Drawn in a 200×200 box stretched to the panel.
 */
function speedLines(seed: number): string {
  const rand = mulberry32(seed ^ 0x9e3779b9);
  let d = "";
  for (let i = 0; i < 120; i++) {
    const angle = rand() * Math.PI * 2;
    const inner = 0.56 + rand() * 0.14;
    const width = 0.004 + rand() * 0.012;
    const cx = 100;
    const cy = 100;
    const outer = 1.5;
    const a0 = angle - width;
    const a1 = angle + width;
    d += `M${r(cx + Math.cos(a0) * outer * 100)} ${r(cy + Math.sin(a0) * outer * 100)}`;
    d += `L${r(cx + Math.cos(angle) * inner * 100)} ${r(cy + Math.sin(angle) * inner * 100)}`;
    d += `L${r(cx + Math.cos(a1) * outer * 100)} ${r(cy + Math.sin(a1) * outer * 100)}Z`;
  }
  return d;
}

type MangaPanelProps = Readonly<{
  children: ReactNode;
  className?: string;
  /** Panel tilt in degrees. */
  rotate?: number;
  seed?: number;
  labelledBy?: string;
}>;

export function MangaPanel({ children, className, rotate = 0, seed = 1, labelledBy }: MangaPanelProps) {
  const ref = useRef<HTMLElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      setSize((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Before measurement (SSR, no JS) the frame is drawn in a stretched 100×100
  // box with non-scaling strokes; afterwards in true pixels.
  const w = size?.w ?? 100;
  const h = size?.h ?? 100;
  const sides = useMemo(() => frameSides(w, h, seed), [w, h, seed]);
  const lines = useMemo(() => speedLines(seed), [seed]);

  return (
    <article
      ref={ref}
      aria-labelledby={labelledBy}
      data-panel=""
      className={cn("manga-panel relative isolate", className)}
      style={{ rotate: `${rotate}deg` }}
    >
      <svg
        aria-hidden="true"
        className="speed-lines pointer-events-none absolute -inset-[22%] -z-10 size-[144%] text-bone/15"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <path d={lines} fill="currentColor" />
      </svg>

      <div className="screentone relative h-full bg-abyss/88 p-6 sm:p-8 md:p-10">{children}</div>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full overflow-visible text-bone"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
      >
        {sides.map((d, i) => (
          <path
            key={i}
            d={d}
            data-ink-stroke=""
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={i % 2 === 0 ? 3.4 : 2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect={size ? undefined : "non-scaling-stroke"}
          />
        ))}
      </svg>
    </article>
  );
}
