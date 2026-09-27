"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapters } from "@/content/copy";
import { relics } from "@/content/relics";
import { emit, stage } from "@/lib/stage";
import { buildWorld } from "@/lib/world";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * The scroll choreography, created in one place so ordering is guaranteed:
 * ScrollSmoother first, then pins, then everything that measures positions.
 *
 * The camera: each chapter has a *hold* range in scroll pixels (its section
 * from top-at-top to bottom-at-bottom; the pinned forge; the relic list) and
 * a hold range on the camera spline (lib/world.ts). Inside a hold, scroll maps
 * linearly onto that spline segment; between holds, onto the transition
 * segment. Mapping per chapter — rather than one global progress — keeps the
 * 3D stations locked to their DOM chapters whatever the section heights.
 */
export default function ScrollEngine() {
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stage.reducedMotion = reduce;
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Touch-only devices keep native scrolling; smoothing there fights the OS.
    const smoother =
      !reduce && ScrollTrigger.isTouch !== 1
        ? ScrollSmoother.create({ wrapper: "#smooth-wrapper", content: "#smooth-content", smooth: 1.1, effects: true })
        : null;
    const scrub = smoother ? true : 0.5;

    const world = buildWorld(relics.length);
    const sections = gsap.utils.toArray<HTMLElement>("[data-chapter]");

    // ── Chapter IV: pinned horizontal forge ───────────────────────────────
    const forge = document.querySelector<HTMLElement>("#forge");
    const track = forge?.querySelector<HTMLElement>("[data-forge-track]");
    const heatBar = forge?.querySelector<HTMLElement>("[data-forge-heat]");
    const steps = forge ? Array.from(forge.querySelectorAll<HTMLElement>("[data-forge-step]")) : [];
    let forgeHold: ScrollTrigger | null = null;
    if (forge && track && !reduce) {
      const distance = () => Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
      forgeHold = ScrollTrigger.create({
        trigger: forge,
        start: "top top",
        end: () => `+=${Math.max(distance(), window.innerHeight * 0.9)}`,
        pin: true,
        scrub,
        invalidateOnRefresh: true,
        animation: gsap.to(track, { x: () => -distance(), ease: "none" }),
      });
    }

    // ── Chapter III: one stop per relic ───────────────────────────────────
    // Snapping is done here rather than with ScrollTrigger's `snap`: its snap
    // tween can desync from ScrollSmoother after an instant jump (PageDown,
    // Space, anchor links), leaving the content behind the native scroll.
    // Going through smoother.scrollTo keeps both in lockstep, and snapping to
    // the *nearest* stop (not the next one in the scroll direction) means a
    // jump that lands exactly on a relic stays there.
    const relicList = document.querySelector<HTMLElement>("#relics [data-hold]");
    const relicHold = relicList
      ? ScrollTrigger.create({ trigger: relicList, start: "top top", end: "bottom bottom" })
      : null;
    let snapTimer = 0;
    const snapToRelic = () => {
      if (!relicHold || relics.length < 2) return;
      const y = smoother ? smoother.scrollTop() : window.scrollY;
      const { start, end } = relicHold;
      if (y < start - 2 || y > end + 2) return;
      const step = (end - start) / (relics.length - 1);
      const target = start + Math.round((y - start) / step) * step;
      if (Math.abs(target - y) < 3) return;
      if (smoother) smoother.scrollTo(target, true);
      else window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
    };
    const onScrollEnd = () => {
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(snapToRelic, 140);
    };
    ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);

    // ── Chapter II: ink frames draw themselves; the active panel gets speed lines ──
    gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
      ScrollTrigger.create({
        trigger: panel,
        start: "center 62%",
        end: "center 38%",
        toggleClass: { targets: panel, className: "is-active" },
      });
      if (reduce) return;
      const strokes = panel.querySelectorAll<SVGPathElement>("[data-ink-stroke]");
      gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap
        .timeline({ scrollTrigger: { trigger: panel, start: "top 90%", end: "top 40%", scrub } })
        .to(strokes, { strokeDashoffset: 0, ease: "none", duration: 1, stagger: 0.22 });
    });

    // ── Hold ranges, in scroll pixels ─────────────────────────────────────
    const holds = sections.map((section, i) => {
      if (i === 3 && forgeHold) return forgeHold;
      if (i === 2 && relicHold) return relicHold;
      const el = section.querySelector<HTMLElement>("[data-hold]") ?? section;
      return ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom bottom" });
    });

    // ── Per-frame: scroll → stage ─────────────────────────────────────────
    let lastY = Number.NaN;
    let lastWidth = 0;
    const update = () => {
      const y = smoother ? smoother.scrollTop() : window.scrollY;
      const width = window.innerWidth;
      if (y === lastY && width === lastWidth) return;
      lastY = y;
      lastWidth = width;

      let t = world.holds[4][1];
      let chapter = 4;
      let progress = 1;
      for (let i = 0; i < holds.length; i++) {
        const start = holds[i].start;
        const end = Math.max(holds[i].end, start);
        const [w0, w1] = world.holds[i];
        if (y < start) {
          if (i === 0) {
            t = w0;
            chapter = 0;
            progress = 0;
          } else {
            const prevEnd = Math.max(holds[i - 1].end, holds[i - 1].start);
            const q = clamp01((y - prevEnd) / Math.max(1, start - prevEnd));
            t = world.holds[i - 1][1] + (w0 - world.holds[i - 1][1]) * smoothstep(0, 1, q);
            chapter = q < 0.5 ? i - 1 : i;
            progress = q < 0.5 ? 1 : 0;
          }
          break;
        }
        if (y <= end) {
          const p = end > start ? (y - start) / (end - start) : 1;
          let local = p;
          if (i === 2 && relics.length > 1) {
            // Dwell at each altar: move quickly between stops, linger at them.
            const s = p * (relics.length - 1);
            const k = Math.min(Math.floor(s), relics.length - 2);
            local = (k + smoothstep(0.18, 0.82, s - k)) / (relics.length - 1);
          }
          t = w0 + (w1 - w0) * local;
          chapter = i;
          progress = p;
          break;
        }
      }

      stage.pathT = t;
      stage.chapterProgress = progress;
      const [r0] = world.holds[2];
      stage.relicFocus = Math.min(relics.length - 1, Math.max(0, t - r0));

      // Forge heat: 0 before the pin, the pin's progress during, 1 after.
      if (forgeHold) {
        stage.heat = clamp01((y - forgeHold.start) / Math.max(1, forgeHold.end - forgeHold.start));
      } else {
        stage.heat = chapter > 3 ? 1 : chapter === 3 ? 0.6 : 0;
      }
      if (heatBar) heatBar.style.transform = `scaleX(${stage.heat})`;
      const hot = Math.min(steps.length - 1, Math.floor(stage.heat * steps.length));
      steps.forEach((step, i) => step.classList.toggle("is-hot", chapter === 3 && i === hot));

      if (chapter !== stage.chapter) {
        const direction = chapter > stage.chapter ? 1 : -1;
        stage.chapter = chapter;
        emit("chapter", { index: chapter, id: chapters[chapter].id, direction });
      }
      stage.invalidate();
    };
    gsap.ticker.add(update);
    const onRefresh = () => {
      lastY = Number.NaN;
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    // ── Anchor links travel through the smoother ──────────────────────────
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")!.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      if (smoother) smoother.scrollTo(target, true, "top top");
      else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    // ── Keyboard focus: bring the focused element into view via the smoother ──
    const wrapper = document.getElementById("smooth-wrapper");
    const content = document.getElementById("smooth-content");
    const onFocusIn = (event: FocusEvent) => {
      if (!smoother || !wrapper || !content) return;
      const el = event.target as HTMLElement;
      if (!content.contains(el)) return;
      wrapper.scrollTop = 0;
      // A relic stop is the whole slide: align it the way the snap does.
      const slide = el.closest<HTMLElement>("[data-relic-slide]");
      const rect = (slide ?? el).getBoundingClientRect();
      if (slide) {
        if (Math.abs(rect.top) > 4) smoother.scrollTo(slide, true, "top top");
      } else if (rect.top < 72 || rect.bottom > window.innerHeight - 24) {
        smoother.scrollTo(el, true, "center center");
      }
    };
    const onWrapperScroll = () => {
      if (wrapper && wrapper.scrollTop !== 0) wrapper.scrollTop = 0;
    };
    document.addEventListener("focusin", onFocusIn);
    wrapper?.addEventListener("scroll", onWrapperScroll);

    // Web fonts change line heights: re-measure once they land.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(update);
      window.clearTimeout(snapTimer);
      ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFocusIn);
      wrapper?.removeEventListener("scroll", onWrapperScroll);
      smoother?.kill();
    };
  });

  return null;
}
