"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { StarfieldCanvas } from "./starfield-canvas";

/** Stronger scroll response; clamp avoids runaway on long pages */
const MAX_SHIFT_PX = 100;
const PARALLAX = 0.092;
/** Taller strip so larger shifts don’t reveal edges (keeps image sharp vs. 100vw) */
const STRIP_TOP_VH = -12;
const STRIP_HEIGHT_VH = 124;

type ParallaxBackgroundProps = Readonly<{
  src: string | StaticImageData;
}>;

function clampShift(scrollY: number): number {
  const raw = -scrollY * PARALLAX;
  return Math.max(-MAX_SHIFT_PX, Math.min(MAX_SHIFT_PX, raw));
}

/**
 * Viewport-sized texture + extra vertical bleed (~24vh) for a stronger parallax
 * shift without exposing edges. Image stays ~100vw for sharpness.
 */
export function ParallaxBackground({ src }: ParallaxBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(globalThis.scrollY));
    };
    onScroll();
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      globalThis.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion]);

  const shift = reduceMotion ? 0 : clampShift(scrollY);
  /** Subtle counter-shift on overlay so fg/bg separation reads clearer */
  const dimShift = reduceMotion ? 0 : scrollY * 0.018;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0e0e0e]"
        aria-hidden
      >
        <div
          className="absolute inset-x-0 [will-change:transform]"
          style={{
            top: `${STRIP_TOP_VH}vh`,
            height: `${STRIP_HEIGHT_VH}vh`,
            transform: `translateY(${shift}px)`,
          }}
        >
          <div className="relative h-full w-full min-h-0">
            <Image
              src={src}
              alt=""
              fill
              priority
              quality={100}
              sizes="100vw"
              className="object-cover object-center"
            />
            <StarfieldCanvas reducedMotion={reduceMotion} />
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/45 via-[#131313]/50 to-black/55 [will-change:transform]"
        style={
          reduceMotion
            ? undefined
            : { transform: `translateY(${dimShift}px)` }
        }
        aria-hidden
      />
    </>
  );
}
