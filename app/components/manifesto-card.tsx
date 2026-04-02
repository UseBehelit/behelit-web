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
        "group/manifesto relative flex aspect-[3/4] flex-col justify-between overflow-hidden p-10",
        "transition-[transform,box-shadow] duration-500 ease-out motion-reduce:transition-none",
        "hover:-translate-y-1 motion-reduce:hover:translate-y-0",
        bgClass,
        "manifesto-card-frame",
        `manifesto-card-frame--${accent}`,
      ].join(" ")}
    >
      {/* Top line — draws on hover */}
      <div
        className={[
          "pointer-events-none absolute left-0 top-0 z-[2] h-px w-0 bg-gradient-to-r transition-[width] duration-700 ease-out group-hover/manifesto:w-full motion-reduce:transition-none motion-reduce:group-hover/manifesto:w-full",
          accentLine[accent],
        ].join(" ")}
        aria-hidden
      />

      {/* Hover gradient wash from bottom */}
      <div
        className={[
          "pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[45%] bg-gradient-to-t opacity-0 transition-opacity duration-500 group-hover/manifesto:opacity-100 motion-reduce:group-hover/manifesto:opacity-0",
          accent === "secondary" && "from-secondary/[0.12] to-transparent",
          accent === "primary" && "from-primary/[0.1] to-transparent",
          accent === "neutral" &&
            "from-white/[0.06] via-transparent to-transparent",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden
      />

      {/* Background image — existing behavior, slightly stronger on hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out motion-reduce:duration-200 group-hover/manifesto:opacity-[0.14]">
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
          "group-hover/manifesto:scale-105 motion-reduce:group-hover/manifesto:scale-100",
          "drop-shadow-[0_0_0_rgba(0,0,0,0)] group-hover/manifesto:drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]",
        ].join(" ")}
      >
        {roman}
      </span>

      <div className="relative z-[3]">
        <div
          className={[
            "mb-3 h-px w-8 origin-left scale-x-100 transition-transform duration-500 group-hover/manifesto:scale-x-125",
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
