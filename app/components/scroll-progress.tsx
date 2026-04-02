"use client";

import { useEffect, useState } from "react";

/**
 * Thin top bar: reading progress through the document (not time-based).
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const mq = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setHide(true);
      return;
    }

    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };

    update();
    globalThis.addEventListener("scroll", update, { passive: true });
    globalThis.addEventListener("resize", update);
    return () => {
      globalThis.removeEventListener("scroll", update);
      globalThis.removeEventListener("resize", update);
    };
  }, []);

  if (hide) return null;

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[61] h-[2px] bg-black/20"
      aria-hidden
    >
      <div
        className="h-full bg-secondary/90 shadow-[0_0_12px_rgba(233,195,73,0.35)] transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
