import { pact } from "@/content/copy";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";
import { RitualCircle } from "@/components/ui/RitualCircle";
import { ChapterHeading } from "./ChapterHeading";

/** Chapter V — contact and launch notes, at the bottom of the descent. */
export function Pact() {
  return (
    <section
      id="pact"
      data-chapter="4"
      aria-labelledby="pact-title"
      className="relative px-5 pb-[14svh] pt-[24svh] sm:px-8 md:px-12"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 md:gap-20">
        <ChapterHeading chapter="pact" heading={pact.heading} lede={pact.lede} align="center" />
        <RitualCircle />
        <Reveal className="scrim w-full">
          <NewsletterForm />
        </Reveal>
      </div>
    </section>
  );
}
