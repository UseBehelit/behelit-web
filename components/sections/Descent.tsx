import type { CSSProperties } from "react";
import { descent, site } from "@/content/copy";
import { InkReveal } from "@/components/ui/InkReveal";

/**
 * Chapter I — the wordmark lands over the Seed. Everything here is server
 * rendered and animated with CSS/SMIL only, so it paints before hydration.
 */
export function Descent() {
  const letters = descent.wordmark.toUpperCase().split("");
  const center = (letters.length - 1) / 2;

  return (
    <section
      id="descent"
      data-chapter="0"
      aria-labelledby="descent-title"
      className="relative flex min-h-[100svh] flex-col items-center justify-end overflow-hidden px-4 pb-[max(8.5rem,17svh)] text-center"
    >
      <div data-speed="0.78" className="relative z-10 flex w-full flex-col items-center">
        <h1
          id="descent-title"
          className="wordmark relative font-display text-[clamp(4.25rem,17.5vw,16.5rem)] font-semibold leading-[0.8] tracking-[-0.015em] text-bone [text-shadow:0_0_42px_rgb(7_7_10/0.9)]"
        >
          <span className="sr-only">{descent.wordmark}</span>
          <span aria-hidden="true" className="block whitespace-nowrap">
            {letters.map((letter, i) => (
              <span
                key={i}
                className="wordmark-letter"
                style={{ "--i": i, "--spread": i - center } as CSSProperties}
              >
                {letter}
              </span>
            ))}
          </span>
          <span
            aria-hidden="true"
            className="impact-line pointer-events-none absolute inset-x-[8%] bottom-[0.06em] h-px bg-gradient-to-r from-transparent via-gold to-transparent"
          />
        </h1>

        <InkReveal
          trigger="load"
          delay={1.6}
          duration={1.9}
          strength={52}
          className="mt-5 font-body text-[clamp(1.45rem,3.2vw,2.5rem)] italic leading-tight text-bone [text-shadow:0_0_24px_rgb(7_7_10/0.95)]"
        >
          {descent.tagline}
        </InkReveal>

        <div className="scrim fade-rise mt-7 flex max-w-[36ch] flex-col items-center gap-3" style={{ animationDelay: "2.5s" }}>
          <p className="label-mono text-gold">
            <span className="text-silver">{site.established}</span>
            <span aria-hidden="true" className="px-3 text-fog">
              ·
            </span>
            {descent.motto}
          </p>
          <p className="text-[1.0625rem] leading-relaxed text-silver md:text-lg">{descent.positioning}</p>
        </div>
      </div>

      <a
        href="#doctrine"
        className="group absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 p-2"
        aria-label={`${descent.scrollHint} — to chapter II`}
      >
        <span className="label-mono text-[0.625rem] text-silver transition-colors group-hover:text-gold">
          {descent.scrollHint}
        </span>
        <span aria-hidden="true" className="relative block h-12 w-px bg-gradient-to-b from-silver/50 to-silver/0">
          <span className="ember-fall absolute -left-[2px] top-0 block size-[5px] rounded-full bg-ember shadow-[0_0_10px_2px_rgb(226_87_43/0.8)]" />
        </span>
      </a>
    </section>
  );
}
