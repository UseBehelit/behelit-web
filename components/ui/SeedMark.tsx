/**
 * The Seed, flattened: the studio mark used in the header, footer, favicon and
 * static art. An asymmetric faceted spindle with a long lower spike — a relic,
 * deliberately not an egg and never a face.
 */

export const SEED_VIEWBOX = "0 0 40 64";

/** Outline, clockwise from the top apex. */
export const SEED_OUTLINE: ReadonlyArray<readonly [number, number]> = [
  [21.5, 1.5],
  [31, 15],
  [36.5, 30],
  [29.5, 45.5],
  [18.5, 62.5],
  [9.5, 46],
  [3.5, 29],
  [11.5, 14.5],
];

const [A, B, C, D, E, F, G, H] = SEED_OUTLINE;
/** Inner ridge point where the four facets meet. */
const I = [20.5, 29.5] as const;

const poly = (points: ReadonlyArray<readonly [number, number]>) =>
  points.map(([x, y]) => `${x},${y}`).join(" ");

export const SEED_FACETS = {
  litLeft: poly([A, H, G, I]),
  midRight: poly([A, B, C, I]),
  darkLeft: poly([G, F, E, I]),
  darkestRight: poly([C, D, E, I]),
} as const;

/** The crack the core shows through. */
export const SEED_SEAM = "M20.5 29.5 L19.8 38 L21 46 L19.2 55";

type SeedMarkProps = Readonly<{
  className?: string;
  /** Faceted rendering with the crimson seam; otherwise a flat silhouette. */
  detailed?: boolean;
  title?: string;
}>;

export function SeedMark({ className, detailed = false, title }: SeedMarkProps) {
  return (
    <svg
      viewBox={SEED_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {detailed ? (
        <>
          <polygon points={SEED_FACETS.litLeft} fill="currentColor" opacity="0.95" />
          <polygon points={SEED_FACETS.midRight} fill="currentColor" opacity="0.7" />
          <polygon points={SEED_FACETS.darkLeft} fill="currentColor" opacity="0.5" />
          <polygon points={SEED_FACETS.darkestRight} fill="currentColor" opacity="0.32" />
          <path d={SEED_SEAM} fill="none" stroke="var(--color-crimson)" strokeWidth="1.3" strokeLinecap="round" />
        </>
      ) : (
        <polygon points={poly(SEED_OUTLINE)} fill="currentColor" />
      )}
    </svg>
  );
}
