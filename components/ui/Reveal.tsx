"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

const EASE_INK = [0.22, 1, 0.36, 1] as const;

const TAGS = { div: m.div, p: m.p, li: m.li, span: m.span, header: m.header } as const;

type RevealProps = Readonly<{
  children: ReactNode;
  as?: keyof typeof TAGS;
  className?: string;
  delay?: number;
  /** Rise distance in px (dropped automatically under reduced motion). */
  y?: number;
}>;

/**
 * Blur-to-focus reveal, as if the text were surfacing through fog.
 * `data-reveal` lets the <noscript> rule in the root layout show the content
 * when JavaScript never runs.
 */
export function Reveal({ children, as = "div", className, delay = 0, y = 14 }: RevealProps) {
  const Tag = TAGS[as];
  return (
    <Tag
      data-reveal=""
      className={className}
      initial={{ opacity: 0, filter: "blur(10px)", y }}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE_INK }}
    >
      {children}
    </Tag>
  );
}
