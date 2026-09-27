/**
 * THE RELICS — every app the studio has made, is making, or has sealed away.
 *
 * This file is the only place app data lives. Chapter III renders one altar
 * per entry, in array order, and the 3D relic's look is driven purely by
 * `status`:
 *
 *   "forging"   → glowing hot iron, spark bursts, heat shimmer
 *   "live"      → fully lit, calm gold halo, slow rotation
 *   "in-review" → dimmer twin, charging core, a thin ring filling up
 *   "vaulted"   → shattered, desaturated, rust and moss, dead cracks
 *
 * `accent` (optional, any CSS hex) tints the halo, inlays and panel rule.
 * Store URLs are optional; a platform without a URL renders as plain text.
 */

export type RelicStatus = "forging" | "live" | "in-review" | "vaulted";

export interface Relic {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: RelicStatus;
  platforms: {
    ios?: { status: "live" | "in-review" | "planned"; url?: string };
    android?: { status: "live" | "in-review" | "planned"; url?: string };
  };
  accent?: string;
}

// PLACEHOLDER DATA — replace these four entries with real apps before shipping.
export const relics: Relic[] = [
  {
    id: "relic-i",
    name: "Relic I",
    tagline: "Placeholder — still in the fire.",
    description:
      "Stand-in for an app being forged. Replace name, tagline, description and platforms in content/relics.ts.",
    status: "forging",
    platforms: {
      ios: { status: "planned" },
      android: { status: "planned" },
    },
    accent: "#E2572B",
  },
  {
    id: "relic-ii",
    name: "Relic II",
    tagline: "Placeholder — out in the world.",
    description:
      "Stand-in for a shipped app. Add its App Store and Google Play URLs and the platform labels become links.",
    status: "live",
    platforms: {
      ios: { status: "live" },
      android: { status: "live" },
    },
    accent: "#C9A45C",
  },
  {
    id: "relic-iii",
    name: "Relic III",
    tagline: "Placeholder — waiting at the gate.",
    description:
      "Stand-in for an app in store review. The ring around it fills while it waits.",
    status: "in-review",
    platforms: {
      ios: { status: "in-review" },
      android: { status: "planned" },
    },
  },
  {
    id: "relic-iv",
    name: "Relic IV",
    tagline: "Placeholder — sealed in the vault.",
    description:
      "Stand-in for a retired experiment. Vaulted relics stay on the page as a record of what didn't make it.",
    status: "vaulted",
    platforms: {},
  },
];
