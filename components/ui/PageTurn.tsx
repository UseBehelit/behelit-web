"use client";

import { useAnimate } from "motion/react-mini";
import { useEffect } from "react";
import { on, stage } from "@/lib/stage";

const DURATION = 0.52; // s — the spec caps chapter transitions at 600 ms
const MIN_GAP = 700; // ms between turns, so fast scrubbing doesn't strobe

/**
 * The manga page turn between chapters: a slanted band of ink with speed
 * lines sweeps across the screen. Forward travel sweeps left → right, the way
 * a manga page is turned; scrolling back sweeps the other way. Transform-only
 * (compositor-friendly) and skipped entirely under reduced motion.
 */
export function PageTurn() {
  const [scope, animate] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let last = 0;
    return on("chapter", ({ direction }) => {
      if (reduce.matches || !scope.current) return;
      const now = performance.now();
      if (now - last < MIN_GAP) return;
      last = now;
      stage.kick = 1;

      const skew = direction > 0 ? -14 : 14;
      const from = direction > 0 ? "-135vw" : "135vw";
      const to = direction > 0 ? "135vw" : "-135vw";
      animate(
        scope.current,
        {
          transform: [`translateX(${from}) skewX(${skew}deg)`, `translateX(${to}) skewX(${skew}deg)`],
          opacity: [1, 1, 0.85],
        },
        { duration: DURATION, ease: [0.7, 0, 0.3, 1] },
      );
    });
  }, [animate, scope]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[65] overflow-hidden">
      <div
        ref={scope}
        className="absolute -inset-y-[10%] left-[-10vw] w-[120vw]"
        style={{ transform: "translateX(-135vw) skewX(-14deg)" }}
      >
        {/* Ink body with speed lines raking along the direction of travel. */}
        <div
          className="absolute inset-y-0 left-[18vw] right-[18vw] bg-abyss"
          style={{
            backgroundImage: [
              "repeating-linear-gradient(0deg, rgb(232 226 214 / 0.07) 0 1px, transparent 1px 7px)",
              "repeating-linear-gradient(0deg, transparent 0 23px, rgb(232 226 214 / 0.12) 23px 24px, transparent 24px 61px)",
            ].join(","),
          }}
        />
        {/* Leading and trailing edges: the page's cut edge catching light. */}
        <div className="absolute inset-y-0 right-[18vw] w-[3px] bg-bone/80 shadow-[0_0_28px_6px_rgb(201_164_92/0.35)]" />
        <div className="absolute inset-y-0 left-[18vw] w-px bg-bone/40" />
        {/* Soft shadow the turning page throws ahead of itself. */}
        <div className="absolute inset-y-0 right-0 w-[18vw] bg-gradient-to-r from-abyss/70 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[18vw] bg-gradient-to-l from-abyss/50 to-transparent" />
      </div>
    </div>
  );
}
