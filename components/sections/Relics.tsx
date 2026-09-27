import { relicsCopy } from "@/content/copy";
import { relics, type Relic, type RelicStatus } from "@/content/relics";
import { DEFAULT_ACCENT } from "@/lib/palette";
import { cn } from "@/lib/cn";
import { ChapterHeading } from "./ChapterHeading";

const STATUS_TONE: Record<RelicStatus, string> = {
  forging: "text-ember",
  live: "text-gold",
  "in-review": "text-bone",
  vaulted: "text-silver",
};

const STATUS_GLYPH: Record<RelicStatus, string> = {
  forging: "◆",
  live: "◈",
  "in-review": "◇",
  vaulted: "✕",
};

function Platforms({ relic }: Readonly<{ relic: Relic }>) {
  const entries = (["ios", "android"] as const).flatMap((key) => {
    const platform = relic.platforms[key];
    return platform ? [{ key, ...platform }] : [];
  });

  if (entries.length === 0) {
    return <p className="label-mono text-silver/80">{relicsCopy.noPlatforms}</p>;
  }

  return (
    <ul className="flex flex-wrap gap-3" aria-label="Platforms">
      {entries.map(({ key, status, url }) => {
        const label = (
          <>
            <span className="text-bone">{relicsCopy.platformName[key]}</span>
            <span aria-hidden="true" className="text-fog">
              /
            </span>
            <span className={status === "live" ? "text-gold" : "text-silver"}>
              {relicsCopy.platformStatus[status]}
            </span>
          </>
        );
        const base = "label-mono inline-flex items-center gap-2 border px-3 py-2";
        return (
          <li key={key}>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(base, "border-gold/60 transition-colors hover:border-gold hover:bg-gold/10")}
              >
                {label}
                <span className="sr-only"> — open on {relicsCopy.storeName[key]} (new tab)</span>
                <span aria-hidden="true" className="text-gold">
                  ↗
                </span>
              </a>
            ) : (
              <span className={cn(base, "border-fog")}>{label}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Chapter III — one full-height slide per relic. The camera stops at each
 * altar (ScrollTrigger snap); the panel sits right of the relic on desktop
 * and below it on phones. Each article is focusable so keyboard users can
 * step relic to relic — focusing one brings its altar into view.
 */
export function Relics() {
  return (
    <section id="relics" data-chapter="2" aria-labelledby="relics-title" className="relative">
      <div className="px-5 pb-[8svh] pt-[24svh] sm:px-8 md:px-12">
        <div className="mx-auto max-w-7xl">
          <ChapterHeading chapter="relics" heading={relicsCopy.heading} lede={relicsCopy.lede} />
        </div>
      </div>

      <ol data-hold="" className="relative">
        {relics.map((relic, i) => {
          const status = relicsCopy.status[relic.status];
          const accent = relic.accent ?? DEFAULT_ACCENT;
          return (
            <li
              key={relic.id}
              data-relic-slide={i}
              className="relative flex min-h-[100svh] items-end px-4 pb-[6svh] sm:px-8 md:items-center md:px-12 md:pb-0"
            >
              <article
                tabIndex={0}
                data-relic-index={i}
                aria-labelledby={`${relic.id}-name`}
                aria-describedby={`${relic.id}-visual`}
                className="relative w-full border border-fog/80 bg-abyss/[0.86] p-6 outline-offset-4 sm:p-8 md:ml-auto md:mr-[4vw] md:w-[min(34rem,42vw)] md:p-10"
                style={{ borderTopColor: accent }}
              >
                <p className={cn("label-mono flex flex-wrap items-center gap-x-3 gap-y-1", STATUS_TONE[relic.status])}>
                  <span aria-hidden="true">{STATUS_GLYPH[relic.status]}</span>
                  <span>{status.label}</span>
                  <span aria-hidden="true" className="text-fog">
                    ·
                  </span>
                  <span className="text-silver normal-case tracking-[0.12em]">{status.note}</span>
                </p>

                <p className="label-mono mt-6 text-[0.625rem] text-silver/80">
                  Relic {String(i + 1).padStart(2, "0")} / {String(relics.length).padStart(2, "0")}
                </p>
                <h3
                  id={`${relic.id}-name`}
                  className="mt-2 font-display text-[clamp(2.6rem,5vw,4.25rem)] font-semibold leading-[0.95] text-bone"
                >
                  {relic.name}
                </h3>
                <p className="mt-3 text-lg italic text-bone/85">{relic.tagline}</p>
                <p className="mt-5 leading-relaxed text-silver">{relic.description}</p>

                <div aria-hidden="true" className="my-7 h-px w-16" style={{ background: accent }} />
                <Platforms relic={relic} />

                <p id={`${relic.id}-visual`} className="sr-only">
                  {status.label}: {status.visual}
                </p>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
