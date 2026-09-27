import { BufferGeometry, Float32BufferAttribute, Sphere, Vector3 } from "three";
import { mulberry32 } from "@/lib/random";

export interface MonolithOptions {
  /** Sides around the girth. */
  sides: number;
  /** Rings from top to bottom. `twist` offsets a ring by a fraction of a side (0.5 → antiprism band). */
  rings: ReadonlyArray<{ y: number; r: number; twist?: number }>;
  top: readonly [number, number, number];
  bottom: readonly [number, number, number];
  /** Irregularity, as a fraction of each ring radius. */
  jitter?: number;
  seed?: number;
  /** Split each plate into four independent plates (more seams). */
  split?: boolean;
  /** Number of shard groups (used by vaulted relics). */
  shards?: number;
}

type Tri = [Vector3, Vector3, Vector3];

/**
 * Faceted monolith made of independent triangular plates. The geometry is
 * non-indexed and every vertex carries its plate's centroid, normal,
 * barycentric coordinate, a random value and a shard id — everything the
 * Seed and relic shaders need to move plates rigidly and draw their seams.
 */
export function createMonolith(options: MonolithOptions): BufferGeometry {
  const { sides: n, jitter = 0.08, seed = 1, split = false, shards = 8 } = options;
  const rand = mulberry32(seed);

  const rings = options.rings.map((ring, k) => {
    const twist = ring.twist ?? (k % 2) * 0.5;
    return Array.from({ length: n }, (_, i) => {
      const angle = ((i + twist) / n) * Math.PI * 2 + (rand() - 0.5) * jitter * 0.9;
      const radius = ring.r * (1 + (rand() - 0.5) * jitter * 2);
      const y = ring.y + (rand() - 0.5) * jitter * ring.r;
      return new Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    });
  });
  const top = new Vector3(...options.top);
  const bottom = new Vector3(...options.bottom);

  let plates: Tri[] = [];
  const first = rings[0];
  const last = rings[rings.length - 1];
  for (let i = 0; i < n; i++) plates.push([top, first[i], first[(i + 1) % n]]);
  for (let k = 0; k < rings.length - 1; k++) {
    const a = rings[k];
    const b = rings[k + 1];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      plates.push([a[i], a[j], b[i]]);
      plates.push([a[j], b[j], b[i]]);
    }
  }
  for (let i = 0; i < n; i++) plates.push([bottom, last[(i + 1) % n], last[i]]);

  if (split) {
    plates = plates.flatMap(([a, b, c]) => {
      const ab = a.clone().lerp(b, 0.5);
      const bc = b.clone().lerp(c, 0.5);
      const ca = c.clone().lerp(a, 0.5);
      return [
        [a, ab, ca],
        [ab, b, bc],
        [ca, bc, c],
        [ab, bc, ca],
      ] as Tri[];
    });
  }

  const centerY = (top.y + bottom.y) / 2;
  const count = plates.length * 3;
  const position = new Float32Array(count * 3);
  const normal = new Float32Array(count * 3);
  const center = new Float32Array(count * 3);
  const bary = new Float32Array(count * 3);
  const random = new Float32Array(count);
  const shard = new Float32Array(count);
  const BARY = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  const e1 = new Vector3();
  const e2 = new Vector3();
  const nrm = new Vector3();
  const cen = new Vector3();

  plates.forEach((plate, p) => {
    cen.copy(plate[0]).add(plate[1]).add(plate[2]).multiplyScalar(1 / 3);
    e1.subVectors(plate[1], plate[0]);
    e2.subVectors(plate[2], plate[0]);
    nrm.crossVectors(e1, e2).normalize();
    // Make every plate face outward, whatever order its corners came in.
    const outward = cen.clone().setY(cen.y - centerY);
    let tri = plate;
    if (nrm.dot(outward) < 0) {
      nrm.negate();
      tri = [plate[0], plate[2], plate[1]];
    }
    const r = rand();
    // Shards: sector around the axis × upper/lower half.
    const sector = Math.floor(((Math.atan2(cen.z, cen.x) / (Math.PI * 2) + 1) % 1) * (shards / 2));
    const half = cen.y > centerY ? 0 : 1;
    const s = sector * 2 + half;

    for (let v = 0; v < 3; v++) {
      const i = p * 3 + v;
      position.set([tri[v].x, tri[v].y, tri[v].z], i * 3);
      normal.set([nrm.x, nrm.y, nrm.z], i * 3);
      center.set([cen.x, cen.y, cen.z], i * 3);
      bary.set(BARY[v], i * 3);
      random[i] = r;
      shard[i] = s;
    }
  });

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(position, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(normal, 3));
  geometry.setAttribute("aPlateNormal", new Float32BufferAttribute(normal, 3));
  geometry.setAttribute("aCenter", new Float32BufferAttribute(center, 3));
  geometry.setAttribute("aBary", new Float32BufferAttribute(bary, 3));
  geometry.setAttribute("aRand", new Float32BufferAttribute(random, 1));
  geometry.setAttribute("aShard", new Float32BufferAttribute(shard, 1));
  geometry.computeBoundingSphere();
  // Breathing and shattering push plates outward; keep culling conservative.
  const sphere = geometry.boundingSphere ?? new Sphere();
  sphere.radius *= 1.6;
  geometry.boundingSphere = sphere;
  return geometry;
}

/** The Seed's proportions: a seven-sided spindle with a long lower spike. */
export function seedShape(): MonolithOptions {
  return {
    sides: 7,
    rings: [
      { y: 1.05, r: 0.52 },
      { y: 0.3, r: 0.92 },
      { y: -0.45, r: 0.84 },
      { y: -1.05, r: 0.5 },
    ],
    top: [0.08, 1.95, -0.04],
    bottom: [-0.1, -2.05, 0.06],
    jitter: 0.11,
    seed: 20260,
    split: false,
  };
}

/** Relic variants: seeded from the relic id so each altar holds its own shape. */
export function relicShape(seed: number): MonolithOptions {
  const rand = mulberry32(seed);
  const sides = 5 + Math.floor(rand() * 4);
  const girth = 0.42 + rand() * 0.16;
  const height = 0.95 + rand() * 0.35;
  return {
    sides,
    rings: [
      { y: height * 0.45, r: girth * (0.6 + rand() * 0.2) },
      { y: height * 0.05, r: girth },
      { y: -height * 0.4, r: girth * (0.7 + rand() * 0.2) },
    ],
    top: [(rand() - 0.5) * 0.08, height * (0.95 + rand() * 0.2), (rand() - 0.5) * 0.08],
    bottom: [(rand() - 0.5) * 0.08, -height * (1.0 + rand() * 0.25), (rand() - 0.5) * 0.08],
    jitter: 0.12,
    seed,
    split: true,
    shards: 8,
  };
}
