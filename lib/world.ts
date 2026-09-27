/**
 * World layout for the descent — plain data, no three.js import, so the
 * scroll director can read chapter ranges without pulling the 3D bundle.
 *
 * Side view (y = depth, the camera travels down and along −z):
 *
 *   +2   cam ─╮
 *   +1        ╰──> ◆ Seed                  I   DESCENT
 *    0   ~~~~~~~~~~~╲~~~~~~~~~~~ fog sea
 *  -8     |  |  |  |  |  ──>               II  DOCTRINE (nave of broken pillars)
 *  -13    [1]──[2]──[3]──[4]               III RELICS   (one altar per relic)
 *  -19    ▄▄▟███▙▄▄  ──>                   IV  FORGE
 *  -26         ( o )                       V   PACT
 *
 * The camera path is a Catmull-Rom spline through `positions`, with a
 * parallel spline through `targets` for where it looks. Control point `i`
 * sits at spline parameter i / (count − 1), so every range below is written
 * in control-point units and converted by the camera rig.
 */

export type Vec3 = readonly [number, number, number];

export const SEED_POSITION: Vec3 = [0, 1.7, 0];
export const FOG_SEA_Y = 0;

export const NAVE = {
  floorY: -10.2,
  zStart: 3,
  zEnd: -31,
  spacing: 4.25,
  halfWidth: 3.35,
  /** The high window at the far end: source of the light shafts. */
  window: [0, -2.4, -40] as Vec3,
} as const;

const ALTAR_SPACING_Z = 8;
const ALTAR_OFFSET_X = 2.3;
const RELIC_FLOAT = 2.05;

export interface WorldLayout {
  positions: Vec3[];
  targets: Vec3[];
  /** Per chapter: [start, end] hold range in control-point units. */
  holds: [number, number][];
  altars: Vec3[];
  relics: Vec3[];
  anvil: Vec3;
  pact: Vec3;
  /** Ink post-process strength per chapter. */
  ink: number[];
  atmosphere: AtmosphereKey[];
}

export interface Atmosphere {
  /** Fog colour (sRGB hex). */
  fog: string;
  /** Exponential-squared distance fog density. */
  density: number;
  /** World height the ground mist pools on. */
  floor: number;
  /** How quickly the ground mist thins with height. */
  falloff: number;
  /** Key light colour and intensity. */
  key: string;
  keyIntensity: number;
  /** Direction *towards* the key light. */
  keyDir: Vec3;
  /** Flat ambient term. */
  ambient: number;
}

export interface AtmosphereKey extends Atmosphere {
  /** Control-point position this keyframe applies at. */
  at: number;
}

function altarBase(i: number): Vec3 {
  const side = i % 2 === 0 ? -1 : 1;
  return [side * ALTAR_OFFSET_X, -13 - 0.45 * i, -38 - ALTAR_SPACING_Z * i];
}

export function buildWorld(relicCount: number): WorldLayout {
  const n = Math.max(1, relicCount);
  const altars = Array.from({ length: n }, (_, i) => altarBase(i));
  const relics = altars.map(([x, y, z]) => [x, y + RELIC_FLOAT, z] as Vec3);

  const positions: Vec3[] = [];
  const targets: Vec3[] = [];
  const push = (p: Vec3, t: Vec3) => {
    positions.push(p);
    targets.push(t);
  };

  // I — the Seed above the fog sea, then down through it.
  push([0, 2.2, 10.6], [0, 0.55, 0]); // 0 rest
  push([1.4, 1.75, 5.6], [0, 1.2, 0]); // 1 push-in, slight orbit
  push([0.55, -1.2, 2.6], [0, -4.5, -4]); // 2 sinking through the fog sea
  // II — the nave.
  push([0, -7.3, 1.5], [0, -8.3, -10]); // 3 doctrine hold start
  push([0.15, -7.7, -7.5], [0, -8.4, -20]); // 4
  push([0, -8.1, -16.5], [0, -8.8, -30]); // 5 doctrine hold end
  // III — altars.
  const [fx, , fz] = relics[0];
  push([fx * 0.3, -9.6, -27.5], [fx * 0.6, relics[0][1] - 0.3, fz]); // 6 approach
  relics.forEach(([x, y, z]) => {
    const side = x < 0 ? -1 : 1;
    push([x - side * 0.6, y + 0.5, z + 5.1], [x, y - 0.15, z]); // 7 … 6+n
  });
  const [, lastY, lastZ] = altars[n - 1];
  const anvil: Vec3 = [0, lastY - 5.5, lastZ - 17];
  // IV — the forge.
  push([0, lastY - 1, lastZ - 5], [0, lastY - 4.5, lastZ - 15]); // 7+n
  push([-3.6, anvil[1] + 2.8, anvil[2] + 9], [-0.3, anvil[1] + 0.9, anvil[2]]); // 8+n forge hold start
  push([3.6, anvil[1] + 2.8, anvil[2] + 9], [0.3, anvil[1] + 0.9, anvil[2]]); // 9+n forge hold end
  // V — the pact circle.
  const pact: Vec3 = [0, anvil[1] - 7.5, anvil[2] - 20];
  push([1.4, anvil[1] - 0.5, anvil[2] - 7], [0, anvil[1] - 6, anvil[2] - 16]); // 10+n
  push([0, pact[1] + 7.4, pact[2] + 4.6], [0, pact[1], pact[2] + 0.4]); // 11+n pact hold start
  push([0, pact[1] + 8.2, pact[2] + 2.2], [0, pact[1], pact[2] + 0.1]); // 12+n pact hold end

  const holds: [number, number][] = [
    [0, 0],
    [3, 5],
    [7, 6 + n],
    [8 + n, 9 + n],
    [11 + n, 12 + n],
  ];

  const atmosphere: AtmosphereKey[] = [
    { at: 0, fog: "#0c0a0d", density: 0.03, floor: 0, falloff: 0.55, key: "#C9A45C", keyIntensity: 1.25, keyDir: [-0.55, 0.85, 0.6], ambient: 0.16 },
    { at: 1.4, fog: "#0e0b0e", density: 0.034, floor: 0, falloff: 0.5, key: "#C9A45C", keyIntensity: 1.2, keyDir: [-0.55, 0.85, 0.6], ambient: 0.16 },
    { at: 2.1, fog: "#2a2a30", density: 0.2, floor: -1, falloff: 0.3, key: "#b9b2a4", keyIntensity: 0.8, keyDir: [0, 1, 0], ambient: 0.3 },
    { at: 3, fog: "#101117", density: 0.05, floor: -10.2, falloff: 0.32, key: "#d8c49a", keyIntensity: 1.7, keyDir: [0.05, 0.5, -1], ambient: 0.13 },
    { at: 5, fog: "#0f1016", density: 0.045, floor: -10.2, falloff: 0.32, key: "#d8c49a", keyIntensity: 1.8, keyDir: [0.05, 0.5, -1], ambient: 0.12 },
    { at: 7, fog: "#0b0b0f", density: 0.05, floor: -13.2, falloff: 0.42, key: "#C9A45C", keyIntensity: 1.25, keyDir: [-0.3, 1, 0.35], ambient: 0.12 },
    { at: 6 + n, fog: "#0b0b0f", density: 0.05, floor: -13.2 - 0.45 * (n - 1), falloff: 0.42, key: "#C9A45C", keyIntensity: 1.25, keyDir: [-0.3, 1, 0.35], ambient: 0.12 },
    { at: 8 + n, fog: "#120d0b", density: 0.042, floor: anvil[1], falloff: 0.45, key: "#E2572B", keyIntensity: 1.3, keyDir: [0.35, 1, 0.5], ambient: 0.1 },
    { at: 9 + n, fog: "#1a130a", density: 0.04, floor: anvil[1], falloff: 0.45, key: "#C9A45C", keyIntensity: 1.6, keyDir: [-0.35, 1, 0.5], ambient: 0.12 },
    { at: 11 + n, fog: "#09080b", density: 0.05, floor: pact[1], falloff: 0.5, key: "#C9A45C", keyIntensity: 1.15, keyDir: [0, 1, 0.12], ambient: 0.08 },
    { at: 12 + n, fog: "#08080b", density: 0.05, floor: pact[1], falloff: 0.5, key: "#C9A45C", keyIntensity: 1.25, keyDir: [0, 1, 0.12], ambient: 0.08 },
  ];

  return {
    positions,
    targets,
    holds,
    altars,
    relics,
    anvil,
    pact,
    ink: [0.12, 1, 0.16, 0.22, 0.14],
    atmosphere,
  };
}

/** Interpolated atmosphere at a path position (control-point units). */
export function atmosphereAt(keys: AtmosphereKey[], t: number): { a: AtmosphereKey; b: AtmosphereKey; mix: number } {
  if (t <= keys[0].at) return { a: keys[0], b: keys[0], mix: 0 };
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (t <= b.at) return { a, b, mix: (t - a.at) / Math.max(1e-6, b.at - a.at) };
  }
  const last = keys[keys.length - 1];
  return { a: last, b: last, mix: 0 };
}
