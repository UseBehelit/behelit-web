import type { Metadata } from "next";
import { StageLoader } from "@/components/canvas/StageLoader";
import { Descent } from "@/components/sections/Descent";
import { Doctrine } from "@/components/sections/Doctrine";
import { Forge } from "@/components/sections/Forge";
import { Pact } from "@/components/sections/Pact";
import { Relics } from "@/components/sections/Relics";
import { BackdropArt } from "@/components/ui/BackdropArt";
import { Cursor } from "@/components/ui/Cursor";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { PageTurn } from "@/components/ui/PageTurn";
import { ScrollDirector } from "@/components/ui/ScrollDirector";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { meta, site, ui } from "@/content/copy";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: meta.title,
    description: meta.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  slogan: "One studio. Whole products.",
  foundingDate: "2026",
  description: meta.description,
};

export default function Home() {
  return (
    <MotionProvider>
      <a href="#main" className="skip-link">
        {ui.skip}
      </a>

      <BackdropArt />
      <StageLoader />
      <SiteHeader />

      {/* ScrollSmoother moves #smooth-content inside this fixed wrapper; anything
          position:fixed (header, canvas, cursor, overlays) must stay outside it. */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="main" tabIndex={-1} className="relative z-10 outline-none">
            <Descent />
            <Doctrine />
            <Relics />
            <Forge />
            <Pact />
          </main>
          <SiteFooter />
        </div>
      </div>

      <ScrollDirector />
      <PageTurn />
      <Cursor />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </MotionProvider>
  );
}
