"use client";

import { useEffect, useState } from "react";
import { chapters, ui } from "@/content/copy";
import { cn } from "@/lib/cn";
import { on } from "@/lib/stage";

/** I · II · III · IV · V — current chapter in gold, each a jump link. */
export function ChapterNav() {
  const [current, setCurrent] = useState(0);

  useEffect(() => on("chapter", ({ index }) => setCurrent(index)), []);

  return (
    <nav aria-label={ui.chapterNav}>
      <ol className="flex items-center gap-1 sm:gap-2">
        {chapters.map((chapter, i) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              aria-current={current === i ? "true" : undefined}
              title={chapter.title}
              className={cn(
                "label-mono relative block px-1.5 py-2 text-[0.625rem] tracking-[0.18em] transition-colors duration-500 sm:px-2",
                current === i ? "text-gold" : "text-silver/70 hover:text-bone",
              )}
            >
              <span className="sr-only">Chapter </span>
              {chapter.numeral}
              <span className="sr-only">: {chapter.title}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-1.5 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-700 sm:inset-x-2",
                  current === i ? "scale-x-100" : "scale-x-0",
                )}
              />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
