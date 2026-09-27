"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// The animation feature bundle is fetched after hydration; `m.*` components
// render immediately and start animating once it lands.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

/**
 * `reducedMotion="user"` makes Motion drop transform/layout animation for
 * people who ask for less motion, keeping only fades and focus pulls.
 */
export function MotionProvider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
