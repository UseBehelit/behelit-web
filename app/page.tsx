import Image from "next/image";
import behelitBlack from "./behelit_black.png";
import behelitLogo from "./behelit_logo.png";
import soulenLogo from "./soulen.png";

function ManifestoCardImage({ src }: { src: typeof behelitBlack }) {
  return (
    <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10">
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
      <nav className="pointer-events-none fixed top-0 z-50 flex h-24 w-full items-center justify-center">
        <div className="pointer-events-auto">
          <Image
            src={behelitLogo}
            alt="Behelit"
            className="h-12 w-auto invert brightness-200"
            priority
            sizes="200px"
          />
        </div>
      </nav>

      <main>
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-surface px-12">
          <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary blur-[160px]" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="mb-8 flex items-center gap-4">
                <div className="h-[2px] w-12 bg-primary" />
                <span className="font-label text-xs uppercase tracking-[0.4em] text-primary">
                  Est. MMXXIV
                </span>
              </div>

              <h1 className="hero-title-shadow mb-8 font-headline text-6xl font-bold leading-tight tracking-tighter md:text-8xl">
                DEFINING THE <br />
                <span className="italic text-secondary">FUTURE</span> OF DIGITAL <br />
                EXPERIENCE.
              </h1>

              <p className="mb-10 max-w-lg font-body text-lg leading-relaxed text-on-surface-variant">
                Behelit is a laboratory of digital craftsmanship, blending the raw
                intensity of avant-garde art with precision engineering to create
                mobile monoliths.
              </p>

              <div className="flex gap-6">
                <a
                  href="#manifesto"
                  className="border border-secondary px-10 py-4 text-sm font-bold tracking-widest text-secondary transition-all duration-500 hover:bg-secondary hover:text-on-secondary"
                >
                  OUR PHILOSOPHY
                </a>
              </div>
            </div>

            <div className="relative flex justify-center md:col-span-5">
              <div className="relative flex aspect-square w-full max-w-md items-center justify-center border border-outline-variant/15 bg-surface-container-lowest p-12">
                <Image
                  src={behelitBlack}
                  alt="Behelit monolith emblem"
                  className="h-auto w-full grayscale contrast-125"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute -bottom-6 -right-6 w-32 border border-primary/20 bg-primary-container p-6">
                  <span className="font-headline text-4xl font-bold text-primary">
                    01
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-container-lowest px-12 py-32">
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-16 flex justify-center">
              <div className="relative inline-block">
                <div className="absolute -inset-8 animate-pulse rounded-full border border-secondary/20" />
                <Image
                  src={soulenLogo}
                  alt="Soulen app logo"
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
                The vessel for digital consciousness.
              </h3>

              <div className="mt-20 grid grid-cols-1 gap-12 text-left md:grid-cols-3">
                <div className="space-y-4">
                  <div className="mb-4 h-px w-8 bg-primary" />
                  <h4 className="font-headline text-xl text-on-surface">
                    Asymmetric Flow
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-on-surface-variant">
                    Breaking the conventional grid for a more organic navigation
                    experience.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="mb-4 h-px w-8 bg-secondary" />
                  <h4 className="font-headline text-xl text-on-surface">
                    Neural Feedback
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-on-surface-variant">
                    Haptic responses tuned to interaction rhythm, creating digital
                    weight.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="mb-4 h-px w-8 bg-outline" />
                  <h4 className="font-headline text-xl text-on-surface">
                    Hyper-Dark
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-on-surface-variant">
                    Optimized for low-light depth, maximizing atmospheric tension.
                  </p>
                </div>
              </div>

              <a
                href="#archive"
                className="group mt-16 inline-flex items-center gap-4 border-b border-transparent py-2 transition-all hover:border-secondary"
              >
                <span className="font-label text-sm font-bold tracking-[0.3em] text-secondary">
                  INITIATE CONNECTION
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
          className="flex min-h-screen flex-col justify-center bg-surface px-12 py-32"
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-24 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <span className="mb-4 block font-label text-xs uppercase tracking-[0.5em] text-outline">
                  The Behelit Manifesto
                </span>
                <h2 className="font-headline text-5xl font-extrabold uppercase tracking-tighter text-on-surface md:text-7xl">
                  WE BUILD <br />
                  <span className="bg-primary px-4 text-primary-container">MONOLITHS.</span>
                </h2>
              </div>
              <p className="max-w-sm text-sm font-light italic text-on-surface-variant">
                &ldquo;In the void between the code and the user, we find the soul of
                the machine.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
              <div className="group relative flex aspect-[3/4] flex-col justify-between overflow-hidden bg-surface-container-low p-10">
                <ManifestoCardImage src={behelitBlack} />
                <span className="relative z-[1] font-headline text-3xl font-bold text-secondary">
                  01
                </span>
                <div className="relative z-[1]">
                  <h5 className="mb-4 font-headline text-2xl text-on-surface">
                    Purity
                  </h5>
                  <p className="text-sm font-light text-on-surface-variant">
                    Eliminating the noise. We believe every pixel must serve the
                    narrative or be discarded without mercy.
                  </p>
                </div>
              </div>

              <div className="group relative flex aspect-[3/4] flex-col justify-between bg-surface-container-high p-10">
                <ManifestoCardImage src={behelitBlack} />
                <span className="relative z-[1] font-headline text-3xl font-bold text-primary">
                  02
                </span>
                <div className="relative z-[1]">
                  <h5 className="mb-4 font-headline text-2xl text-on-surface">
                    Intensity
                  </h5>
                  <p className="text-sm font-light text-on-surface-variant">
                    Software should be felt. Our interfaces demand attention through
                    atmospheric tension and bold contrast.
                  </p>
                </div>
              </div>

              <div className="group relative flex aspect-[3/4] flex-col justify-between bg-surface-container-highest p-10">
                <ManifestoCardImage src={behelitBlack} />
                <span className="relative z-[1] font-headline text-3xl font-bold text-on-surface">
                  03
                </span>
                <div className="relative z-[1]">
                  <h5 className="mb-4 font-headline text-2xl text-on-surface">
                    Permanence
                  </h5>
                  <p className="text-sm font-light text-on-surface-variant">
                    We do not chase trends. We create digital artifacts designed to
                    endure past the current zeitgeist.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="archive"
          className="bg-surface-container-lowest px-12 py-40 text-center"
        >
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 font-headline text-4xl font-bold text-on-surface md:text-5xl">
              JOIN THE ARCHIVE
            </h2>
            <p className="mb-12 font-light text-on-surface-variant">
              Receive exclusive insights into our development process and early
              access to upcoming editions.
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
      </main>

      <footer className="w-full bg-[#0e0e0e] px-12 py-16">
        <div className="flex flex-col items-center justify-between gap-8 border-t border-[#444748]/15 pt-12 md:flex-row">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <span className="font-headline text-xl text-[#e5e2e1]">BEHELIT</span>
            <span className="hidden font-body text-[10px] font-light tracking-[0.2em] text-[#444748] md:block">
              |
            </span>
            <p className="text-center font-body text-[10px] font-light tracking-[0.2em] text-[#444748] md:text-left">
              © {year} THE BEHELIT EDITORIAL. ALL RIGHTS RESERVED.
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
    </>
  );
}
