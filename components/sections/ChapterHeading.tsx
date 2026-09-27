import { chapters, type ChapterId } from "@/content/copy";
import { InkReveal } from "@/components/ui/InkReveal";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type ChapterHeadingProps = Readonly<{
  chapter: ChapterId;
  heading: string;
  lede: string;
  align?: "left" | "center";
  className?: string;
}>;

/** "Chapter II — The Doctrine", then the chapter's h2 inking itself in. */
export function ChapterHeading({ chapter, heading, lede, align = "left", className }: ChapterHeadingProps) {
  const index = chapters.findIndex((c) => c.id === chapter);
  const meta = chapters[index];
  const centered = align === "center";

  return (
    <header className={cn("scrim relative max-w-3xl", centered && "mx-auto text-center", className)}>
      <Reveal as="p" className={cn("label-mono flex items-center gap-4 text-silver", centered && "justify-center")}>
        <span aria-hidden="true" className="h-px w-10 bg-gold/70" />
        <span>
          Chapter {meta.numeral} <span className="text-gold">·</span> {meta.title}
        </span>
      </Reveal>
      <InkReveal
        as="h2"
        id={`${chapter}-title`}
        strength={70}
        seed={index + 7}
        className="mt-5 font-display text-[clamp(2.6rem,6.4vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.01em] text-bone"
      >
        {heading}
      </InkReveal>
      <Reveal
        as="p"
        delay={0.2}
        className={cn("mt-6 max-w-[52ch] text-lg italic leading-relaxed text-silver md:text-xl", centered && "mx-auto")}
      >
        {lede}
      </Reveal>
    </header>
  );
}
