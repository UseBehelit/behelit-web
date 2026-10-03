import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://evenstate.behelit.dev"),
  title: "Evenstate",
  applicationName: "Evenstate",
  alternates: { canonical: "/" },
};

export default function EvenstateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
