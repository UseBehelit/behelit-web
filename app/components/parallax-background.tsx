"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

const MAX_SHIFT_PX = 56;
const PARALLAX = 0.045;

type ParallaxBackgroundProps = Readonly<{
  src: string | StaticImageData;
}>;

function clampShift(scrollY: number): number {
  const raw = -scrollY * PARALLAX;
  return Math.max(-MAX_SHIFT_PX, Math.min(MAX_SHIFT_PX, raw));
}

/**
 * Viewport-sized texture + small vertical bleed (~12vh) for parallax only.
 * Keeps next/image close to 100vw so sharpness stays high (no giant upscale).
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

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0e0e0e]"
        aria-hidden
      >
        {/* ~112vh tall strip: only slightly larger than viewport so cover stays sharp */}
        <div
          className="absolute inset-x-0 top-[-6vh] h-[112vh] [will-change:transform]"
          style={{ transform: `translateY(${shift}px)` }}
        >
          <div className="relative h-full w-full">
            <Image
              src={src}
              alt=""
              fill
              priority
              quality={100}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-gradient-to-b from-black/45 via-[#131313]/50 to-black/55"
        aria-hidden
      />
    </>
  );
}
