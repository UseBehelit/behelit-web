"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { detectInitialTier, detectWebGL, readQualityOverride, type QualityTier } from "@/lib/quality";

// three.js, R3F and the post-processing stack live in this chunk, which is
// requested only after first paint — never on the critical path.
const Experience = dynamic(() => import("./Experience"), { ssr: false });

type Plan = { ceiling: QualityTier; forced?: QualityTier };

/**
 * Decides whether the WebGL layer runs at all, and at what ceiling tier,
 * then mounts it once the browser is idle. Until then (and forever, without
 * WebGL2) the server-rendered BackdropArt is the stage.
 */
export function StageLoader() {
  const [plan, setPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const decide = () => {
      const override = readQualityOverride();
      if (override === "off") return;
      const gl = detectWebGL();
      if (!gl.supported) {
        document.documentElement.dataset.gl = "off";
        return;
      }
      setPlan({ ceiling: override ?? detectInitialTier(gl.renderer), forced: override ?? undefined });
    };

    // After first paint: wait for idle time (or ~1.2 s at the latest).
    // Safari has no requestIdleCallback; fall back to a short timeout.
    const idleApi: Partial<Pick<Window, "requestIdleCallback" | "cancelIdleCallback">> = window;
    let idle = 0;
    let timer = 0;
    const schedule = () => {
      if (idleApi.requestIdleCallback) idle = idleApi.requestIdleCallback(decide, { timeout: 1200 });
      else timer = window.setTimeout(decide, 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      if (idle) idleApi.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, []);

  if (!plan) return null;
  return (
    <Suspense fallback={null}>
      <Experience ceiling={plan.ceiling} forced={plan.forced} />
    </Suspense>
  );
}
