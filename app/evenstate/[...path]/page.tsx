import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Page not found — Evenstate",
  robots: { index: false, follow: false },
};

export default function UnknownEvenstatePage() {
  notFound();
}
