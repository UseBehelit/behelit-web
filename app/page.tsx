import Image from "next/image";
import behelitBlack from "./behelit_black.png";
import behelitLogo from "./behelit_logo.png";
import { ParallaxBackground } from "./components/parallax-background";
import { RevealOnScroll } from "./components/reveal-on-scroll";
import { ScrollProgress } from "./components/scroll-progress";
import { SiteNav } from "./components/site-nav";
import soulenLogo from "./soulen.png";
import siteBg from "./bg.png";

function ManifestoCardImage({ src }: { src: typeof behelitBlack }) {
  return (
    <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out motion-reduce:duration-200 group-hover:opacity-[0.12]">
      <Image
        src={src}
        alt=""
        fill
        className="object-cover grayscale contrast-125"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  );
}

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <ScrollProgress />
      <SiteNav logo={behelitLogo} />

      <ParallaxBackground src={siteBg} />

      <main className="relative z-10">
        <section
          id="top"
          className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-transparent"
        >
          <div className="pointer-events-none absolute inset-0 z-[1] opacity-10">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary blur-[160px]" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="max-w-4xl">
              <div className="mb-10 flex items-center gap-4 md:mb-12">
                <div className="h-[2px] w-12 bg-primary" />
                <span className="font-label text-xs uppercase tracking-[0.4em] text-primary">
                  Est. MMXXVI
                </span>
              </div>

              <h1 className="mb-10 max-w-[22ch] font-headline text-5xl font-extralight leading-[1.08] tracking-[-0.03em] text-on-surface md:mb-14 md:max-w-none md:text-8xl md:leading-[1.06]">
                One studio. <br />
                <span className="font-medium italic tracking-tight text-secondary">
                  Whole products.
                </span>{" "}
                <br />
                <span className="mt-5 block font-normal uppercase tracking-widest text-4xl md:mt-6 md:text-6xl">
                  Spark to ship
                </span>
              </h1>

              <p className="mb-12 max-w-md font-body text-lg leading-[1.75] text-on-surface-variant md:max-w-lg">
                Small-batch software—built with intent, released when it earns
                the room.
              </p>

              <div className="flex gap-6">
                <a
                  href="#manifesto"
                  className="border border-secondary px-10 py-4 text-sm font-bold tracking-widest text-secondary transition-all duration-300 hover:bg-secondary hover:text-on-secondary active:scale-[0.98] active:brightness-95"
                >
                  HOW WE WORK
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-dvh flex-col items-center overflow-hidden px-4 pb-24 pt-28 text-center sm:px-6 md:pb-32 md:pt-32">
          <RevealOnScroll className="relative z-10 w-full max-w-4xl">
            <div className="mb-16 flex justify-center">
              <div className="relative inline-block">
                <div className="absolute -inset-8 animate-pulse rounded-full border border-secondary/20" />
                <Image
                  src={soulenLogo}
                  alt="Soulen — AI dream interpretation"
                  className="h-64 w-64 object-contain drop-shadow-[0_0_50px_rgba(233,195,73,0.3)] md:h-80 md:w-80"
                  sizes="320px"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-center gap-3">
                <svg
                  className="h-7 w-7 shrink-0 text-secondary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <h2 className="font-headline text-5xl font-bold uppercase tracking-tight text-on-surface md:text-6xl">
                  SOULEN
                </h2>
              </div>

              <h3 className="mb-12 font-body text-2xl italic text-outline">
                Your dreams—interpreted, analyzed, imagined.
              </h3>

              <div className="mt-20 grid grid-cols-1 gap-12 text-left md:grid-cols-3">
                <div className="space-y-4 transition-transform duration-300 ease-out md:hover:-translate-y-0.5 motion-reduce:md:hover:translate-y-0">
                  <div className="mb-4 h-px w-8 bg-primary" />
                  <h4 className="font-headline text-xl text-on-surface">
                    A living library
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-on-surface-variant">
                    Log what you remember; keep a private thread of nights worth
                    returning to—not scattered notes, one coherent archive.
                  </p>
                </div>
                <div className="space-y-4 transition-transform duration-300 ease-out md:hover:-translate-y-0.5 motion-reduce:md:hover:translate-y-0">
                  <div className="mb-4 h-px w-8 bg-secondary" />
                  <h4 className="font-headline text-xl text-on-surface">
                    AI-guided reading
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-on-surface-variant">
                    Layered interpretation with context: symbols, mood, and
                    narrative—assisted, never generic.
                  </p>
                </div>
                <div className="space-y-4 transition-transform duration-300 ease-out md:hover:-translate-y-0.5 motion-reduce:md:hover:translate-y-0">
                  <div className="mb-4 h-px w-8 bg-outline" />
                  <h4 className="font-headline text-xl text-on-surface">
                    Text & image
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-on-surface-variant">
                    Turn insight into words and visuals you can save or share—reflections
                    shaped from each session.
                  </p>
                </div>
              </div>

              <a
                href="#archive"
                className="group mt-16 inline-flex items-center gap-4 border-b border-secondary/0 py-2 transition-all duration-300 hover:border-secondary active:scale-[0.99]"
              >
                <span className="font-label text-sm font-bold tracking-[0.3em] text-secondary">
                  RELEASE UPDATES
                </span>
                <svg
                  className="h-6 w-6 shrink-0 text-secondary transition-transform group-hover:translate-x-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          </RevealOnScroll>
        </section>

        <section
          id="manifesto"
          className="relative flex min-h-dvh flex-col justify-center overflow-hidden px-12 py-32"
        >
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <RevealOnScroll className="mb-24 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span className="mb-4 block font-label text-xs uppercase tracking-[0.5em] text-outline">
                  Principles
                </span>
                <h2 className="font-headline text-5xl font-extrabold uppercase tracking-tighter text-on-surface md:text-7xl">
                  WE SHIP <br />
                  <span className="bg-primary px-4 text-primary-container">
                    WHAT WE OWN.
                  </span>
                </h2>
              </div>
              <p className="max-w-sm text-sm font-light italic leading-relaxed text-on-surface-variant">
                &ldquo;One thread from first sketch to last pixel—clarity over
                noise, finish over fanfare.&rdquo;
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
              <RevealOnScroll
                delayMs={0}
                className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden bg-surface-container-low p-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-[box-shadow,transform] duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_28px_56px_-32px_rgba(0,0,0,0.65)] motion-reduce:hover:translate-y-0"
              >
                <ManifestoCardImage src={behelitBlack} />
                <span className="relative z-[1] font-headline text-3xl font-bold text-secondary">
                  I
                </span>
                <div className="relative z-[1]">
                  <h5 className="mb-4 font-headline text-2xl text-on-surface">
                    Authorship
                  </h5>
                  <p className="text-sm font-light text-on-surface-variant">
                    Every product is authored in-house—design, code, and
                    identity stay in one pair of hands, start to finish.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll
                delayMs={90}
                className="group relative flex aspect-[3/4] flex-col justify-between bg-surface-container-high p-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-[box-shadow,transform] duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_28px_56px_-32px_rgba(0,0,0,0.65)] motion-reduce:hover:translate-y-0"
              >
                <ManifestoCardImage src={behelitBlack} />
                <span className="relative z-[1] font-headline text-3xl font-bold text-primary">
                  II
                </span>
                <div className="relative z-[1]">
                  <h5 className="mb-4 font-headline text-2xl text-on-surface">
                    Release
                  </h5>
                  <p className="text-sm font-light text-on-surface-variant">
                    Shipping matters—out in the wild, on real devices, with
                    feedback that sharpens what comes next.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll
                delayMs={180}
                className="group relative flex aspect-[3/4] flex-col justify-between bg-surface-container-highest p-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-[box-shadow,transform] duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_28px_56px_-32px_rgba(0,0,0,0.65)] motion-reduce:hover:translate-y-0"
              >
                <ManifestoCardImage src={behelitBlack} />
                <span className="relative z-[1] font-headline text-3xl font-bold text-on-surface">
                  III
                </span>
                <div className="relative z-[1]">
                  <h5 className="mb-4 font-headline text-2xl text-on-surface">
                    Restraint
                  </h5>
                  <p className="text-sm font-light text-on-surface-variant">
                    Fewer releases, deeper polish. We prefer finished work over
                    endless roadmaps and borrowed aesthetics.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        <div className="section-bg-archive flex min-h-dvh flex-col">
          <section
            id="archive"
            className="flex flex-1 flex-col justify-center px-12 py-24 text-center md:py-32"
          >
            <RevealOnScroll className="mx-auto max-w-3xl">
              <h2 className="mb-6 font-headline text-4xl font-bold text-on-surface md:text-5xl">
                NEW RELEASES
              </h2>
              <p className="mb-12 font-light leading-relaxed text-on-surface-variant">
                Be first when something ships—launch notes only, no noise.
              </p>
              <form
                className="group mx-auto flex max-w-lg flex-col gap-0 border-b border-outline-variant transition-colors duration-300 focus-within:border-secondary md:flex-row"
                action="#"
                method="post"
              >
                <input
                  className="flex-grow rounded-none border-none bg-transparent py-4 font-label text-sm uppercase tracking-widest text-on-surface transition-all duration-300 placeholder:text-on-surface-variant/60 placeholder:transition-colors focus:bg-white/[0.03] focus:ring-0 focus:placeholder:text-on-surface-variant/35"
                  placeholder="YOUR EMAIL ADDRESS"
                  type="email"
                  name="email"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] text-secondary transition-all duration-200 hover:bg-surface-container-high active:scale-[0.98]"
                >
                  SUBSCRIBE
                </button>
              </form>
            </RevealOnScroll>
          </section>

          <footer className="w-full shrink-0 bg-[#0e0e0e] px-12 py-16">
            <div className="flex flex-col items-center justify-between gap-8 border-t border-[#444748]/15 pt-12 md:flex-row">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <Image
                  src={behelitLogo}
                  alt="Behelit"
                  className="h-8 w-auto brightness-150"
                  sizes="120px"
                />
                <span className="hidden font-body text-[10px] font-light tracking-[0.2em] text-[#444748] md:block">
                  |
                </span>
                <p className="text-center font-body text-[10px] font-light tracking-[0.2em] text-[#444748] md:text-left">
                  © {year} BEHELIT. INDEPENDENT SOFTWARE.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                {(["PRIVACY", "TERMS", "CONTACT", "INSTAGRAM"] as const).map(
                  (label) => (
                    <a
                      key={label}
                      href="#"
                      className="font-body text-[10px] font-light tracking-[0.2em] text-[#444748] transition-colors hover:text-[#e5e2e1] active:opacity-70"
                    >
                      {label}
                    </a>
                  ),
                )}
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
