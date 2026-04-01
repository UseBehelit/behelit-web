import Image from "next/image";
import behelitBlack from "./behelit_black.png";
import behelitLogo from "./behelit_logo.png";
import { ParallaxBackground } from "./components/parallax-background";
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
      <nav className="pointer-events-none fixed left-0 right-0 top-5 z-50 flex justify-center md:top-6">
        <a
          href="#top"
          aria-label="Back to top"
          className="pointer-events-auto rounded-full p-1.5 shadow-[0_2px_14px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.035)] ring-1 ring-white/[0.04] backdrop-blur-[2px] transition-all duration-700 [background:radial-gradient(circle_at_50%_42%,rgba(55,55,55,0.28)_0%,rgba(28,27,27,0.1)_52%,transparent_74%)] hover:scale-105 hover:shadow-[0_3px_18px_rgba(0,0,0,0.22)]"
        >
          <Image
            src={behelitLogo}
            alt="Behelit"
            className="h-9 w-auto brightness-200 drop-shadow-[0_1px_5px_rgba(0,0,0,0.22)]"
            priority
            sizes="120px"
          />
        </a>
      </nav>

      <ParallaxBackground src={siteBg} />

      <main className="relative z-10">
        <section
          id="top"
          className="snap-page relative flex min-h-dvh snap-start flex-col justify-center overflow-hidden bg-transparent"
        >
          <div className="pointer-events-none absolute inset-0 z-[1] opacity-10">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary blur-[160px]" />
          </div>

          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="max-w-4xl">
              <div className="mb-8 flex items-center gap-4">
                <div className="h-[2px] w-12 bg-primary" />
                <span className="font-label text-xs uppercase tracking-[0.4em] text-primary">
                  Est. MMXXVI
                </span>
              </div>

              <h1 className="mb-12 font-headline text-5xl font-extralight leading-[1.1] tracking-[-0.03em] text-on-surface md:text-8xl">
                One studio. <br />
                <span className="font-medium italic tracking-tight text-secondary">
                  Whole products.
                </span>{" "}
                <br />
                <span className="mt-4 block font-normal uppercase tracking-widest text-4xl md:text-6xl">
                  Spark to ship
                </span>
              </h1>

              <p className="mb-10 max-w-lg font-body text-lg leading-relaxed text-on-surface-variant">
                Small-batch software—built with intent, released when it earns
                the room.
              </p>

              <div className="flex gap-6">
                <a
                  href="#manifesto"
                  className="border border-secondary px-10 py-4 text-sm font-bold tracking-widest text-secondary transition-all duration-500 hover:bg-secondary hover:text-on-secondary"
                >
                  HOW WE WORK
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="snap-page relative flex min-h-dvh snap-start items-center justify-center overflow-hidden py-32">
          <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
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
                <div className="space-y-4">
                  <div className="mb-4 h-px w-8 bg-primary" />
                  <h4 className="font-headline text-xl text-on-surface">
                    A living library
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-on-surface-variant">
                    Log what you remember; keep a private thread of nights worth
                    returning to—not scattered notes, one coherent archive.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="mb-4 h-px w-8 bg-secondary" />
                  <h4 className="font-headline text-xl text-on-surface">
                    AI-guided reading
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-on-surface-variant">
                    Layered interpretation with context: symbols, mood, and
                    narrative—assisted, never generic.
                  </p>
                </div>
                <div className="space-y-4">
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
                className="group mt-16 inline-flex items-center gap-4 border-b border-secondary/0 py-2 transition-all hover:border-secondary"
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
          </div>
        </section>

        <section
          id="manifesto"
          className="snap-page relative flex min-h-dvh snap-start flex-col justify-center overflow-hidden px-12 py-32"
        >
          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="mb-24 flex flex-col justify-between gap-8 md:flex-row md:items-end">
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
              <p className="max-w-sm text-sm font-light italic text-on-surface-variant">
                &ldquo;One thread from first sketch to last pixel—clarity over
                noise, finish over fanfare.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
              <div className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden bg-surface-container-low p-10">
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
              </div>

              <div className="group relative flex aspect-[3/4] flex-col justify-between bg-surface-container-high p-10">
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
              </div>

              <div className="group relative flex aspect-[3/4] flex-col justify-between bg-surface-container-highest p-10">
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
              </div>
            </div>
          </div>
        </section>

        <div className="section-bg-archive snap-page flex min-h-dvh snap-start flex-col">
          <section
            id="archive"
            className="flex flex-1 flex-col justify-center px-12 py-24 text-center md:py-32"
          >
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 font-headline text-4xl font-bold text-on-surface md:text-5xl">
                NEW RELEASES
              </h2>
              <p className="mb-12 font-light text-on-surface-variant">
                Be first when something ships—launch notes only, no noise.
              </p>
              <form
                className="group mx-auto flex max-w-lg flex-col gap-0 border-b border-outline-variant transition-colors focus-within:border-secondary md:flex-row"
                action="#"
                method="post"
              >
                <input
                  className="flex-grow border-none bg-transparent py-4 font-label text-sm uppercase tracking-widest text-on-surface placeholder:text-on-surface-variant/60 focus:ring-0"
                  placeholder="YOUR EMAIL ADDRESS"
                  type="email"
                  name="email"
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="px-8 py-4 text-xs font-bold uppercase tracking-[0.3em] text-secondary transition-colors hover:bg-surface-container-high"
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>
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
                      className="font-body text-[10px] font-light tracking-[0.2em] text-[#444748] transition-colors hover:text-[#e5e2e1]"
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
