import { site, ui } from "@/content/copy";
import { ChapterNav } from "./ChapterNav";
import { SeedMark } from "./SeedMark";
import { SoundToggle } from "./SoundToggle";

/** Fixed, quiet chrome: mark, chapter index, sound. Lives outside the smooth-scroll wrapper. */
export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-abyss from-25% via-abyss/75 to-transparent"
      />
      <div className="relative flex items-center justify-between gap-3 px-3 py-3 sm:px-6 md:px-8">
        <a href="#descent" aria-label={ui.backToTop} className="pointer-events-auto flex items-center gap-3 p-1.5">
          <SeedMark detailed className="h-7 w-auto text-gold" />
          <span className="label-mono hidden text-bone sm:inline">{site.name}</span>
        </a>
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-4">
          <ChapterNav />
          <span aria-hidden="true" className="h-4 w-px bg-fog" />
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
