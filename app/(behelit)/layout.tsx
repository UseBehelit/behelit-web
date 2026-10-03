import type { Metadata, Viewport } from "next";
import { Cormorant_SC, JetBrains_Mono, Spectral } from "next/font/google";
import { meta, site } from "@/content/copy";
import { palette } from "@/lib/palette";
import "./globals.css";

/*
 * Display: Cormorant SC — its thick-to-hairline stroke contrast is the mark of
 * a dip pen, the tool manga inkers use, so the type carries the page's core
 * technique. Cinzel was the alternative, but its Trajan capitals are the stock
 * fantasy-poster look this site deliberately avoids. Used only at 32px+, in
 * a single weight (600) so only one font file sits on the critical path.
 */
const display = Cormorant_SC({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-cormorant",
  display: "swap",
});

const body = Spectral({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
  preload: false,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: meta.title,
  description: meta.description,
  applicationName: site.name,
};

export const viewport: Viewport = {
  themeColor: palette.abyss,
  colorScheme: "dark",
};

/* Without JS, nothing waits for a reveal and the forge becomes a plain grid. */
const NO_SCRIPT_CSS = `
[data-reveal]{opacity:1!important;filter:none!important;transform:none!important}
.forge-track{display:grid!important;width:auto!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))}
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <noscript dangerouslySetInnerHTML={{ __html: `<style>${NO_SCRIPT_CSS}</style>` }} />
        {children}
        <div className="paper-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
