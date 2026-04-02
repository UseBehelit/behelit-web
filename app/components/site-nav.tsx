"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

type SiteNavProps = Readonly<{
  logo: StaticImageData;
}>;

/**
 * Logo pill: tightens + stronger glass when scrolled (premium nav affordance).
 */
export function SiteNav({ logo }: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mq = globalThis.matchMedia("(prefers-reduced-motion: reduce)");
    const onScroll = () => {
      if (mq.matches) {
        setScrolled(false);
        return;
      }
      setScrolled(globalThis.scrollY > 32);
    };
    onScroll();
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    return () => globalThis.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="pointer-events-none fixed left-0 right-0 top-0 z-[60] flex justify-center px-4 pt-4 md:pt-5">
      <a
        href="#top"
        aria-label="Back to top"
        className={[
          "pointer-events-auto rounded-full ring-1 shadow-lg transition-all duration-500 ease-out",
          "hover:scale-[1.03] active:scale-[0.97]",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary/50",
          scrolled
            ? "scale-[0.94] bg-black/35 p-1.5 ring-white/[0.08] backdrop-blur-xl [box-shadow:0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.06)]"
            : "scale-100 bg-black/15 p-2 ring-white/[0.04] backdrop-blur-md [box-shadow:0_2px_14px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.035)]",
        ].join(" ")}
      >
        <Image
          src={logo}
          alt="Behelit"
          className={
            scrolled
              ? "h-7 w-auto brightness-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-[height] duration-500 md:h-8"
              : "h-9 w-auto brightness-200 drop-shadow-[0_1px_5px_rgba(0,0,0,0.22)] transition-[height] duration-500"
          }
          priority
          sizes="120px"
        />
      </a>
    </nav>
  );
}
