import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const jakarta = localFont({
  src: [
    { path: "../../assets/evenstate/fonts/PlusJakartaSans-400.ttf", weight: "400" },
    { path: "../../assets/evenstate/fonts/PlusJakartaSans-500.ttf", weight: "500" },
    { path: "../../assets/evenstate/fonts/PlusJakartaSans-600.ttf", weight: "600" },
  ],
  display: "swap",
  variable: "--font-evenstate",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://evenstate.behelit.dev"),
  title: "Evenstate",
  applicationName: "Evenstate",
  icons: {
    icon: [{ url: "/evenstate/assets/icon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/evenstate/assets/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  robots: process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development"
    ? { index: false, follow: false }
    : undefined,
};

export const viewport: Viewport = { themeColor: "#FCF9F3", colorScheme: "light" };

export default function EvenstateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`evenstate ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
