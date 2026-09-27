/**
 * Every word on the landing page lives here. Components only lay it out.
 * App data is separate: see `content/relics.ts`.
 */

import type { RelicStatus } from "./relics";

export const site = {
  name: "Behelit",
  url: "https://www.behelit.dev",
  email: "app@behelit.dev",
  /** Set the profile URL to show "Instagram" in the footer; empty hides it. */
  instagram: "", // PLACEHOLDER — e.g. "https://www.instagram.com/<handle>"
  established: "EST. MMXXVI",
} as const;

export const meta = {
  title: "Behelit — One studio. Whole products.",
  description:
    "Behelit is a one-person independent app studio. Small-batch software — built with intent, released when it earns the room.",
  ogAlt:
    "Behelit — a faceted stone-and-iron relic with a crimson core, floating in fog above the words One studio. Whole products.",
} as const;

export type ChapterId = "descent" | "doctrine" | "relics" | "forge" | "pact";

export const chapters: ReadonlyArray<{
  id: ChapterId;
  numeral: string;
  title: string;
}> = [
  { id: "descent", numeral: "I", title: "The Descent" },
  { id: "doctrine", numeral: "II", title: "The Doctrine" },
  { id: "relics", numeral: "III", title: "The Relics" },
  { id: "forge", numeral: "IV", title: "The Forge" },
  { id: "pact", numeral: "V", title: "The Pact" },
];

export const descent = {
  wordmark: "Behelit",
  tagline: "One studio. Whole products.",
  motto: "Spark to ship",
  positioning:
    "Small-batch software — built with intent, released when it earns the room.",
  scrollHint: "Descend",
} as const;

export const doctrine = {
  heading: "We ship what we own.",
  lede: "One thread from first sketch to last pixel — clarity over noise, finish over fanfare.",
  principles: [
    {
      numeral: "I",
      name: "Authorship",
      kind: "Vow I · The single hand",
      flavor:
        "No committee ever carved a relic. The hand that draws the first line is the hand that signs the last.",
      meaning:
        "Every product is authored in-house — design, code and identity stay in one pair of hands, start to finish.",
    },
    {
      numeral: "II",
      name: "Release",
      kind: "Vow II · Proven in the wild",
      flavor: "A blade that never leaves the forge is only ornament.",
      meaning:
        "Shipping matters — out in the wild, on real devices, with real feedback that sharpens what comes next.",
    },
    {
      numeral: "III",
      name: "Restraint",
      kind: "Vow III · Fewer, deeper",
      flavor: "What is left unmade keeps watch over what is made.",
      meaning:
        "Fewer releases, deeper polish. Finished work over endless roadmaps and borrowed aesthetics.",
    },
  ],
} as const;

export const relicsCopy = {
  heading: "Things made, and things still burning.",
  lede: "Each altar holds one app. Its light tells you where it stands.",
  status: {
    forging: {
      label: "Forging",
      note: "Still in the fire.",
      visual: "Hot iron throwing sparks, the air shimmering around it.",
    },
    live: {
      label: "Live",
      note: "Out in the world.",
      visual: "Fully lit and slowly turning, crowned with a calm gold halo.",
    },
    "in-review": {
      label: "In review",
      note: "Waiting at the gate.",
      visual: "A dimmer twin with a charging core; a thin ring slowly fills around it.",
    },
    vaulted: {
      label: "Vaulted",
      note: "Sealed away, kept as a record.",
      visual: "Shattered and drifting apart, rusted and overgrown; its cracks give no light.",
    },
  } satisfies Record<RelicStatus, { label: string; note: string; visual: string }>,
  platformName: { ios: "iOS", android: "Android" },
  storeName: { ios: "App Store", android: "Google Play" },
  platformStatus: { live: "Live", "in-review": "In review", planned: "Planned" },
  noPlatforms: "No longer distributed.",
} as const;

export const forge = {
  heading: "Spark to ship.",
  lede: "Four heats, in order. Nothing skips the fire.",
  steps: [
    {
      numeral: "I",
      name: "Spark",
      heat: "Ash · cold iron",
      text: "One real problem, felt firsthand. If it doesn't keep me up at night, it doesn't get made.",
    },
    {
      numeral: "II",
      name: "Shape",
      heat: "Ember · dull red",
      text: "Design, code and identity hammered out together — on real devices from the first day.",
    },
    {
      numeral: "III",
      name: "Temper",
      heat: "Flame · bright orange",
      text: "Stress it, cut it, refine it. Every feature earns its place; the rest goes back in the fire.",
    },
    {
      numeral: "IV",
      name: "Ship",
      heat: "Gold · white heat",
      text: "Released when it earns the room. Then listened to, and sharpened again.",
    },
  ],
} as const;

export const pact = {
  heading: "Seal the pact.",
  lede: "Questions, collaborations, a signal from the dark — the inbox is read by the same hands that build.",
  copyLabel: "Copy email address",
  copyHint: "Click to copy",
  copied: "Sealed — address copied.",
  copyFailed: "Couldn't reach the clipboard — the address is selected, press Ctrl+C.",
  mailto: "Open in your mail app",
  newsletter: {
    heading: "Be first when something ships",
    sub: "Launch notes only — no noise.",
    label: "Email address",
    placeholder: "you@domain.com",
    submit: "Subscribe",
    submitting: "Sending…",
    empty: "Enter an email address.",
    invalid: "That address doesn't look complete — check for a typo.",
    success: "You're on the list. Launch notes only.",
    network: "Couldn't reach the list. Try again, or write to app@behelit.dev.",
  },
} as const;

export const footer = {
  legal: [
    { app: "Soulen", privacy: "/soulen/privacy", terms: "/soulen/terms" },
    { app: "Bonfire", privacy: "/bonfire/privacy", terms: "/bonfire/terms" },
    { app: "ANCHOR", privacy: "/anchor/privacy" },
    { app: "NOX", privacy: "/nox/privacy" },
  ],
  colophon: "Independent software. Rendered live, in the dark.",
} as const;

export const ui = {
  skip: "Skip to content",
  chapterNav: "Chapters",
  soundOn: "Ambient sound on",
  soundOff: "Ambient sound off",
  backToTop: "Behelit — back to the top",
} as const;
