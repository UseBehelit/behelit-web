import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BEHELIT | The Future of Digital Experience",
  description:
    "Behelit is a laboratory of digital craftsmanship — mobile monoliths blending avant-garde intensity with precision engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${newsreader.variable} ${manrope.variable} h-full snap-y snap-mandatory scroll-smooth scroll-pt-[4.75rem] antialiased`}
    >
      <body className="relative min-h-full font-body selection:bg-primary selection:text-primary-container">
        {children}
      </body>
    </html>
  );
}
