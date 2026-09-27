import { doctrine } from "@/content/copy";
import { MangaPanel } from "@/components/ui/MangaPanel";
import { ChapterHeading } from "./ChapterHeading";

/** Asymmetric page composition: [placement classes, tilt in degrees]. */
const LAYOUT: ReadonlyArray<readonly [string, number]> = [
  ["md:col-span-7 md:row-start-1", -1.4],
  ["md:col-span-5 md:col-start-8 md:row-start-1 md:mt-40", 1.15],
  ["md:col-span-8 md:col-start-3 md:row-start-2 md:-mt-4", -0.6],
];

/**
 * Chapter II — three vows as manga panels. Their ink frames draw themselves
 * on scroll and the post-process turns the nave behind them into hatching.
 */
export function Doctrine() {
  return (
    <section
      id="doctrine"
      data-chapter="1"
      aria-labelledby="doctrine-title"
      className="relative px-5 pb-[22svh] pt-[26svh] sm:px-8 md:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <ChapterHeading chapter="doctrine" heading={doctrine.heading} lede={doctrine.lede} />

        <div className="mt-20 grid grid-cols-1 gap-14 md:mt-28 md:grid-cols-12 md:gap-x-10 md:gap-y-16">
          {doctrine.principles.map((vow, i) => {
            const [placement, tilt] = LAYOUT[i];
            return (
              <MangaPanel
                key={vow.name}
                className={placement}
                rotate={tilt}
                seed={31 + i * 17}
                labelledBy={`vow-${i}`}
              >
                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-2 -top-4 font-display text-[7rem] font-semibold leading-none text-bone/[0.07] md:text-[9rem]"
                  >
                    {vow.numeral}
                  </span>
                  <p className="label-mono text-gold">{vow.kind}</p>
                  <h3 id={`vow-${i}`} className="mt-4 font-display text-5xl font-semibold leading-none text-bone md:text-6xl">
                    {vow.name}
                  </h3>
                  <p className="mt-6 border-l border-gold/45 pl-4 text-lg italic leading-relaxed text-bone/85">
                    “{vow.flavor}”
                  </p>
                  <p className="mt-5 max-w-[60ch] leading-relaxed text-silver">{vow.meaning}</p>
                </div>
              </MangaPanel>
            );
          })}
        </div>
      </div>
    </section>
  );
}
