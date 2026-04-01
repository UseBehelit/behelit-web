"use client";

import { useEffect, useRef } from "react";

type StarfieldCanvasProps = Readonly<{
  reducedMotion: boolean;
}>;

type StarKind = "twinkle" | "drift";

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  tw: number;
  kind: StarKind;
};

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createStars(w: number, h: number, seed: number): Star[] {
  const rnd = mulberry32(seed);
  const area = w * h;
  const n = Math.min(520, Math.max(160, Math.floor(area / 3200)));
  const stars: Star[] = [];
  for (let i = 0; i < n; i++) {
    const kind: StarKind = rnd() < 0.42 ? "twinkle" : "drift";
    if (kind === "twinkle") {
      stars.push({
        x: rnd() * w,
        y: rnd() * h,
        vx: 0,
        vy: 0,
        r: rnd() * 1.15 + 0.28,
        phase: rnd() * Math.PI * 2,
        tw: 1.1 + rnd() * 3.8,
        kind: "twinkle",
      });
    } else {
      stars.push({
        x: rnd() * w,
        y: rnd() * h,
        vx: (rnd() - 0.5) * 16,
        vy: (rnd() - 0.5) * 13,
        r: rnd() * 1.45 + 0.38,
        phase: rnd() * Math.PI * 2,
        tw: 0.5 + rnd() * 1.4,
        kind: "drift",
      });
    }
  }
  return stars;
}

function stepStar(s: Star, dt: number, reduce: boolean, w: number, h: number) {
  if (reduce || s.kind !== "drift") return;
  s.x += s.vx * dt;
  s.y += s.vy * dt;
  const pad = 4;
  if (s.x < -pad) s.x = w + pad;
  if (s.x > w + pad) s.x = -pad;
  if (s.y < -pad) s.y = h + pad;
  if (s.y > h + pad) s.y = -pad;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  s: Star,
  t: number,
  reduce: boolean,
) {
  const pulse = 0.5 + 0.5 * Math.sin(t * s.tw + s.phase);
  let alpha: number;

  if (s.kind === "twinkle") {
    const tw = 0.15 + 0.85 * pulse;
    alpha = reduce ? 0.42 + 0.35 * tw : tw;
  } else {
    const soft = 0.52 + 0.28 * (0.5 + 0.5 * Math.sin(t * s.tw * 0.65 + s.phase));
    alpha = reduce ? 0.48 : soft;
  }

  ctx.beginPath();
  ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 248, 240, ${alpha})`;
  ctx.fill();

  const glow = s.kind === "twinkle" ? 0.22 : 0.15;
  if (s.r > 0.75) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 240, 230, ${alpha * glow})`;
    ctx.fill();
  }
}

/**
 * Canvas fills its parent (parallax strip): stars move with the same transform as the bg plate.
 */
export function StarfieldCanvas({ reducedMotion }: StarfieldCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = Math.min(globalThis.devicePixelRatio ?? 1, 2);
      const cw = Math.max(1, Math.round(container.clientWidth));
      const ch = Math.max(1, Math.round(container.clientHeight));
      w = cw;
      h = ch;
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(cw, ch, 0xbeefcafe);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    resize();
    globalThis.addEventListener("resize", resize);

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.08);
      last = now;
      const t = now * 0.001;
      const reduce = reducedRef.current;

      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        stepStar(s, dt, reduce, w, h);
        drawStar(ctx, s, t, reduce);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      globalThis.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[2] min-h-0 min-w-0"
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full mix-blend-screen" />
    </div>
  );
}
