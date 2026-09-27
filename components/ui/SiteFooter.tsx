import Link from "next/link";
import { footer, site } from "@/content/copy";
import { SeedMark } from "./SeedMark";

const linkClass = "text-silver underline-offset-4 transition-colors hover:text-gold hover:underline";

/** Legal links point at each app's own policy — there is no studio-wide one. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const terms = footer.legal.filter((entry) => "terms" in entry && entry.terms);

  return (
    <footer className="relative z-10 border-t border-fog/70 bg-abyss px-5 pb-12 pt-14 sm:px-8 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_2fr_1fr] md:gap-12">
        <div className="flex items-start gap-4">
          <SeedMark detailed className="h-10 w-auto text-gold" />
          <div>
            <p className="label-mono text-bone">
              © {year} {site.name}
            </p>
            <p className="mt-2 max-w-[28ch] text-sm italic leading-relaxed text-silver">{footer.colophon}</p>
          </div>
        </div>

        <nav aria-label="Legal" className="grid gap-4 text-sm">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="label-mono w-20 text-[0.625rem] text-bone">Privacy</span>
            {footer.legal.map((entry) => (
              <Link key={entry.privacy} href={entry.privacy} className={linkClass}>
                {entry.app}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
            <span className="label-mono w-20 text-[0.625rem] text-bone">Terms</span>
            {terms.map((entry) =>
              "terms" in entry ? (
                <Link key={entry.terms} href={entry.terms} className={linkClass}>
                  {entry.app}
                </Link>
              ) : null,
            )}
          </div>
        </nav>

        <div className="flex flex-col gap-3 text-sm md:items-end">
          <a href={`mailto:${site.email}`} className={linkClass}>
            {site.email}
          </a>
          {site.instagram ? (
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Instagram<span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
