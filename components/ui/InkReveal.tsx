"use client";

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type InkRevealProps = Readonly<{
  children: ReactNode;
  as?: "p" | "h2" | "h3" | "span" | "div";
  className?: string;
  id?: string;
  /**
   * "load": plays once, `delay` seconds after the page loads. Pure SVG/SMIL +
   *         CSS, so it runs before hydration and without JavaScript.
   * "view": plays when scrolled into view. Without JS the text is simply shown.
   */
  trigger?: "load" | "view";
  delay?: number;
  duration?: number;
  /** Peak displacement in px; scale it with the font size. */
  strength?: number;
  seed?: number;
}>;

/**
 * Ink bleeding into paper. The text is pushed through an SVG filter whose
 * noise displacement, blur and alpha threshold all relax to identity:
 *
 *   feTurbulence       → a fixed fractal-noise field (the paper fibres)
 *   feDisplacementMap  → scatters the glyphs along that field (scale → 0)
 *   feGaussianBlur     → spreads the scattered ink (σ → 0)
 *   feFuncA slope/icpt → re-thresholds alpha, so blurred ink reads as hard
 *                        blots with gooey edges instead of a soft haze
 *
 * When everything reaches identity the filter is dropped entirely, so the
 * resting text is crisp and costs nothing.
 */
export function InkReveal({
  children,
  as: Tag = "p",
  className,
  id,
  trigger = "view",
  delay = 0,
  duration = 1.8,
  strength = 60,
  seed = 4,
}: InkRevealProps) {
  const filterId = `ink-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const ref = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (trigger !== "view") return;
    const el = ref.current;
    const svg = svgRef.current;
    if (!el || !svg) return;

    // Already on screen at hydration: leave it be rather than flash it.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.dataset.ink = "done";
      return;
    }

    el.dataset.ink = "waiting";
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        el.dataset.ink = "bleeding";
        svg.querySelectorAll<SVGAnimationElement>("animate").forEach((a) => a.beginElement());
        timer = window.setTimeout(() => {
          el.dataset.ink = "done";
        }, duration * 1000 + 60);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [trigger, duration]);

  const begin = trigger === "load" ? `${delay}s` : "indefinite";
  const timing = {
    dur: `${duration}s`,
    begin,
    fill: "freeze",
    calcMode: "spline",
    keyTimes: "0;0.55;1",
    keySplines: "0.2 0.7 0.3 1;0.25 0.8 0.3 1",
  } as const;

  const style = {
    "--ink-filter": `url(#${filterId})`,
    "--ink-delay": `${delay}s`,
    "--ink-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={cn("ink-reveal", `ink-reveal--${trigger}`, className)}
      style={style}
    >
      {children}
      <svg ref={svgRef} aria-hidden="true" focusable="false" width="0" height="0" className="absolute size-0 overflow-hidden">
        <filter
          id={filterId}
          x="-15%"
          y="-60%"
          width="130%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves={3} seed={seed} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" result="bled">
            <animate attributeName="scale" values={`${strength};${strength * 0.22};0`} {...timing} />
          </feDisplacementMap>
          <feGaussianBlur in="bled" stdDeviation="0" result="soft">
            <animate attributeName="stdDeviation" values="6;1.3;0" {...timing} />
          </feGaussianBlur>
          <feComponentTransfer in="soft">
            <feFuncA type="linear" slope="1" intercept="0">
              <animate attributeName="slope" values="12;5;1" {...timing} />
              <animate attributeName="intercept" values="-4.2;-1.6;0" {...timing} />
            </feFuncA>
          </feComponentTransfer>
        </filter>
      </svg>
    </Tag>
  );
}
