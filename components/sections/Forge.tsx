import type { CSSProperties } from "react";
import { forge } from "@/content/copy";
import { ChapterHeading } from "./ChapterHeading";

/** Heat ramp per step: ash → ember → flame → gold. */
const HEAT = ["#9AA3A8", "#E2572B", "#F08A3C", "#C9A45C"] as const;

/**
 * Chapter IV — Spark → Shape → Temper → Ship. With JS and motion allowed the
 * section pins and the steps slide sideways while the anvil heats up; with
 * reduced motion or no JS it is an ordinary grid.
 */
export function Forge() {
  return (
    <section id="forge" data-chapter="3" aria-labelledby="forge-title" className="relative overflow-hidden">
      <div data-forge-pin="" className="flex min-h-[100svh] flex-col justify-between gap-10 pb-[9svh] pt-[15svh]">
        <div className="px-5 sm:px-8 md:px-12">
          <div className="mx-auto max-w-7xl">
            <ChapterHeading chapter="forge" heading={forge.heading} lede={forge.lede} />
          </div>
        </div>

        <div className="flex flex-col gap-8 md:gap-10">
          <ol data-forge-track="" className="forge-track px-5 sm:px-8 md:px-[max(3rem,calc((100vw_-_80rem)/2_+_3rem))]">
            {forge.steps.map((step, i) => (
              <li
                key={step.name}
                data-forge-step={i}
                className="group relative flex w-[min(84vw,27rem)] shrink-0 flex-col border border-fog/80 bg-abyss/[0.84] p-7 md:p-9"
                style={{ "--heat": HEAT[i] } as CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: "linear-gradient(90deg, transparent, var(--heat), transparent)" }}
                />
                <div className="flex items-baseline justify-between gap-6">
                  <span aria-hidden="true" className="font-display text-7xl font-semibold leading-none" style={{ color: "var(--heat)" }}>
                    {step.numeral}
                  </span>
                  <span className="label-mono text-right text-[0.625rem] text-silver">{step.heat}</span>
                </div>
                <h3 className="mt-8 font-display text-4xl font-semibold text-bone md:text-5xl">
                  <span className="sr-only">Step {step.numeral}: </span>
                  {step.name}
                </h3>
                <p className="mt-4 leading-relaxed text-silver">{step.text}</p>
              </li>
            ))}
          </ol>

          <div aria-hidden="true" className="px-5 sm:px-8 md:px-12">
            <div className="mx-auto flex max-w-7xl items-center gap-4">
              <span className="label-mono text-[0.625rem] text-silver">Heat</span>
              <span className="relative h-px flex-1 overflow-hidden bg-fog">
                <span
                  data-forge-heat=""
                  className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gradient-to-r from-silver via-ember to-gold"
                />
              </span>
              <span className="label-mono text-[0.625rem] text-gold">Ship</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
