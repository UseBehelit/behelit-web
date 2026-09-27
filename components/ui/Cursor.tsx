"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { stage } from "@/lib/stage";

const INTERACTIVE = 'a, button, input, textarea, select, label, summary, [role="button"], [tabindex="0"], [data-cursor]';

/**
 * An ember dot with a faint trailing ring. It also feeds the pointer into the
 * stage store, where the 3D cursor light picks it up. Fine pointers only —
 * on touch devices nothing renders and the system cursor is untouched.
 */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 38, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 420, damping: 38, mass: 0.55 });
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const root = document.documentElement;
    let active = false;

    const onMove = (event: PointerEvent) => {
      // Touch and pen still steer the 3D light; only a mouse gets the drawn cursor.
      stage.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      stage.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      stage.pointerActive = true;
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      if (!active && fine.matches) {
        active = true;
        setEnabled(true);
        root.classList.add("has-cursor");
      }
      setVisible(true);
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
      setHovering(Boolean(target));
      stage.hover = target ? 1 : 0;
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      root.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <m.div className="absolute left-0 top-0" style={{ x: ringX, y: ringY }}>
        <m.div
          className="-ml-4 -mt-4 size-8 rounded-full border border-bone/40"
          animate={{
            scale: pressed ? 0.8 : hovering ? 1.9 : 1,
            opacity: visible ? (hovering ? 0.9 : 0.55) : 0,
            borderColor: hovering ? "rgb(201 164 92 / 0.8)" : "rgb(232 226 214 / 0.4)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        />
      </m.div>
      <m.div className="absolute left-0 top-0" style={{ x, y }}>
        <m.div
          className="-ml-[3px] -mt-[3px] size-[6px] rounded-full bg-ember shadow-[0_0_14px_3px_rgb(226_87_43/0.75)]"
          animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0.6 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </m.div>
    </div>
  );
}
