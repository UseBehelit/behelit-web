"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type RevealOnScrollProps = Readonly<{
  children: ReactNode;
  className?: string;
  /** Stagger siblings with ~60–120ms steps */
  delayMs?: number;
}>;

/**
 * Fade-in when section enters view (no translate — vertical shift left a gap at the top).
 */
export function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const reduce = globalThis.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 0px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[
        "transition-opacity duration-[780ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        shown
          ? "opacity-100"
          : "opacity-0 motion-reduce:opacity-100",
        className,
      ].join(" ")}
      style={
        shown && delayMs > 0
          ? { transitionDelay: `${delayMs}ms` }
          : undefined
      }
    >
      {children}
    </div>
  );
}
