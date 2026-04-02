"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import { StarfieldCanvas } from "./starfield-canvas";

/** Subtle parallax — smaller shift = less edge gap risk */
const MAX_SHIFT_PX = 52;
const PARALLAX = 0.048;
/** Strip bleed matches modest shift (still ~100vw image) */
const STRIP_TOP_VH = -9;
const STRIP_HEIGHT_VH = 118;

type ParallaxBackgroundProps = Readonly<{
  src: string | StaticImageData;
}>;

function clampShift(scrollY: number): number {
  const y = Math.max(0, scrollY);
  const raw = -y * PARALLAX;
  return Math.max(-MAX_SHIFT_PX, Math.min(MAX_SHIFT_PX, raw));
}

/**
 * Viewport-sized texture + modest vertical bleed for light parallax.
 */
export function ParallaxBackground({ src }: ParallaxBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  /** Parallax + dim shift fight iOS/Android URL bar & rubber-band; disable on narrow viewports */
  const [parallaxOff, setParallaxOff] = useState(false);

  useEffect(() => {
    const mq = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = globalThis.matchMedia("(max-width: 768px)");
    const update = () => setParallaxOff(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion || parallaxOff) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() =>
        setScrollY(Math.max(0, globalThis.scrollY)),
      );
    };
    onScroll();
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      globalThis.removeEventListener("scroll", onScroll);
    };
  }, [reduceMotion, parallaxOff]);

  const scrollSafe = Math.max(0, scrollY);
  const useParallax = !reduceMotion && !parallaxOff;
  const shift = useParallax ? clampShift(scrollSafe) : 0;

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 min-h-dvh w-full overflow-hidden bg-[#0e0e0e]"
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
        className="pointer-events-none fixed inset-0 z-[1] min-h-dvh w-full bg-gradient-to-b from-black/45 via-[#131313]/50 to-black/55"
        aria-hidden
      />
    </>
  );
}
