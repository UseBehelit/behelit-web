"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// GSAP, ScrollTrigger and ScrollSmoother arrive in their own chunk after
// hydration. Until then the page scrolls natively and reads fine.
const ScrollEngine = dynamic(() => import("./ScrollEngine"), { ssr: false });

/**
 * The Suspense boundary matters: an `ssr: false` component bails out of
 * server rendering by suspending, and without a boundary of its own that
 * bailout would bubble up and turn the whole page into a client-rendered
 * fallback in the prerendered HTML.
 */
export function ScrollDirector() {
  return (
    <Suspense fallback={null}>
      <ScrollEngine />
    </Suspense>
  );
}
