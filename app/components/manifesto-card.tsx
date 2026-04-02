import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

type ManifestoCardProps = Readonly<{
  roman: string;
  title: string;
  accent: "secondary" | "primary" | "neutral";
  bgClass: string;
  imageSrc: StaticImageData;
  children: ReactNode;
}>;

const accentLine: Record<
  ManifestoCardProps["accent"],
  string
> = {
  secondary: "from-secondary/80 via-secondary/40 to-transparent",
  primary: "from-primary/80 via-primary/35 to-transparent",
  neutral: "from-outline/70 via-outline/30 to-transparent",
};

const romanColor: Record<ManifestoCardProps["accent"], string> = {
  secondary: "text-secondary",
  primary: "text-primary",
  neutral: "text-on-surface",
};

/**
 * Principles grid card: hover border fill, gradient wash, top line draw.
 */
export function ManifestoCard({
  roman,
  title,
  accent,
  bgClass,
  imageSrc,
  children,
}: ManifestoCardProps) {
  return (
    <div
      className={[
        "group/manifesto relative flex flex-col justify-between overflow-hidden p-8 md:aspect-[3/4] md:p-10",
        "min-h-[300px] max-md:aspect-auto max-md:touch-manipulation max-md:active:scale-[0.99]",
        "transition-[transform,box-shadow] duration-500 ease-out motion-reduce:transition-none",
        "md:hover:-translate-y-1 motion-reduce:md:hover:translate-y-0",
        bgClass,
        "manifesto-card-frame",
        `manifesto-card-frame--${accent}`,
      ].join(" ")}
    >
      {/* Top line — full width on touch; draws on hover @ md+ */}
      <div
        className={[
          "pointer-events-none absolute left-0 top-0 z-[2] h-px w-full bg-gradient-to-r md:w-0 md:transition-[width] md:duration-700 md:ease-out md:group-hover/manifesto:w-full motion-reduce:md:transition-none motion-reduce:md:group-hover/manifesto:w-full",
          "max-md:opacity-90",
          accentLine[accent],
        ].join(" ")}
        aria-hidden
      />

      {/* Gradient wash — always soft on mobile; full on hover desktop */}
      <div
        className={[
          "pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[48%] bg-gradient-to-t transition-opacity duration-500 max-md:opacity-100 md:opacity-0 md:group-hover/manifesto:opacity-100 motion-reduce:md:group-hover/manifesto:opacity-0",
          accent === "secondary" && "from-secondary/[0.16] to-transparent",
          accent === "primary" && "from-primary/[0.13] to-transparent",
          accent === "neutral" &&
            "from-white/[0.07] via-transparent to-transparent",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden
      />

      {/* Background image — visible on mobile; stronger on hover @ md+ */}
      <div className="absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:duration-200 max-md:opacity-[0.11] md:opacity-0 md:group-hover/manifesto:opacity-[0.14]">
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover grayscale contrast-125"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <span
        className={[
          "relative z-[3] inline-flex font-headline text-3xl font-bold tabular-nums transition-[transform,text-shadow] duration-500",
          romanColor[accent],
          "max-md:drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] max-md:scale-100",
          "md:drop-shadow-[0_0_0_rgba(0,0,0,0)] md:group-hover/manifesto:scale-105 md:group-hover/manifesto:drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] motion-reduce:md:group-hover/manifesto:scale-100",
        ].join(" ")}
      >
        {roman}
      </span>

      <div className="relative z-[3]">
        <div
          className={[
            "mb-3 h-px origin-left transition-transform duration-500 max-md:w-10 max-md:scale-x-110 md:w-8 md:scale-x-100 md:group-hover/manifesto:scale-x-125",
            accent === "secondary" && "bg-secondary/90",
            accent === "primary" && "bg-primary/90",
            accent === "neutral" && "bg-outline/80",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        <h5 className="mb-4 font-headline text-2xl text-on-surface transition-colors duration-300 group-hover/manifesto:text-on-surface">
          {title}
        </h5>
        <p className="text-sm font-light leading-relaxed text-on-surface-variant transition-colors duration-300 group-hover/manifesto:text-on-surface-variant/95">
          {children}
        </p>
      </div>
    </div>
  );
}
