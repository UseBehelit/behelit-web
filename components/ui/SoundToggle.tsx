"use client";

import { useEffect, useState } from "react";
import { ui } from "@/content/copy";
import { cn } from "@/lib/cn";
import { on } from "@/lib/stage";
import type { Ambience } from "@/lib/ambience";

const STORAGE_KEY = "behelit:sound";

/** One audio graph per page, created lazily on the first gesture. */
let ambience: Ambience | null = null;

async function getAmbience(): Promise<Ambience> {
  if (!ambience) {
    const { Ambience } = await import("@/lib/ambience");
    ambience = new Ambience();
  }
  return ambience;
}

function readPreference(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function writePreference(enabled: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Storage blocked (private mode): the toggle still works for this visit.
  }
}

/**
 * Ambient wind and distant fire. Off by default; starts only from a user
 * gesture. If a previous visit left it on, it arms and starts on the first
 * click or keypress anywhere — browsers forbid autoplay before that.
 */
export function SoundToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!readPreference()) return;
    const arm = async () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      const engine = await getAmbience();
      await engine.start();
      setEnabled(true);
    };
    window.addEventListener("pointerdown", arm);
    window.addEventListener("keydown", arm);
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, []);

  useEffect(() => {
    const off = on("chapter", ({ index }) => {
      ambience?.setHeat(index === 3 ? 1 : index === 2 ? 0.35 : 0);
    });
    return () => {
      off();
      void ambience?.stop();
    };
  }, []);

  const toggle = async () => {
    const next = !enabled;
    setEnabled(next);
    writePreference(next);
    const engine = await getAmbience();
    if (next) await engine.start();
    else await engine.stop();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? ui.soundOn : ui.soundOff}
      title={enabled ? ui.soundOn : ui.soundOff}
      className="group flex h-9 items-center gap-2.5 px-2"
    >
      <span aria-hidden="true" className="flex h-3.5 items-end gap-[3px]">
        {[0.55, 1, 0.7, 0.4].map((h, i) => (
          <span
            key={i}
            className={cn(
              "w-[2px] origin-bottom bg-current transition-transform duration-500",
              enabled ? "sound-bar text-gold" : "scale-y-[0.3] text-silver group-hover:text-bone",
            )}
            style={{ height: `${h * 100}%`, animationDelay: `${i * 0.17}s` }}
          />
        ))}
      </span>
      <span className={cn("label-mono hidden text-[0.625rem] sm:inline", enabled ? "text-gold" : "text-silver")}>
        {enabled ? "Sound" : "Muted"}
      </span>
    </button>
  );
}
