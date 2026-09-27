"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CatmullRomCurve3,
  Color,
  HalfFloatType,
  MathUtils,
  PerspectiveCamera,
  Vector2,
  Vector3,
  WebGLRenderTarget,
  type DirectionalLight,
  type AmbientLight,
} from "three";
import { relics } from "@/content/relics";
import { QUALITY, dprFor, stepTier, type QualityTier } from "@/lib/quality";
import { emit, stage } from "@/lib/stage";
import { atmosphereAt, buildWorld, type WorldLayout } from "@/lib/world";
import { Atmosphere } from "./Atmosphere";
import { CursorLight } from "./CursorLight";
import { PostFX } from "./effects/PostFX";
import { EmberField } from "./EmberField";
import { FogPlane, type MistLayer } from "./FogPlane";
import { ForgeScene } from "./ForgeScene";
import { PactScene } from "./PactScene";
import { RelicAltar } from "./RelicAltar";
import { Ruins } from "./Ruins";
import { Seed } from "./Seed";
import { damp, shared } from "./uniforms";

// ── Camera rig ─────────────────────────────────────────────────────────────

const P = new Vector3();
const L = new Vector3();
const right = new Vector3();
const up = new Vector3();
const keyDirA = new Vector3();
const keyDirB = new Vector3();
const colorA = new Color();
const colorB = new Color();
const forgeFog = new Color("#2a1208");
const forgeKey = new Color("#ffcf8a");

/** Ink strength along the path: each chapter's value on its hold, blended across transitions. */
function inkAt(world: WorldLayout, t: number): number {
  const { holds, ink } = world;
  for (let i = 0; i < holds.length; i++) {
    const [h0, h1] = holds[i];
    if (t <= h1) {
      if (t >= h0 || i === 0) return ink[i];
      const [, prevEnd] = holds[i - 1];
      const q = MathUtils.smoothstep(t, prevEnd + (h0 - prevEnd) * 0.35, h0);
      return MathUtils.lerp(ink[i - 1], ink[i], q);
    }
  }
  return ink[ink.length - 1];
}

/** 0–1: how close path position t is to a station's hold range (1 inside it, fading over one control point). */
function stationWeight([h0, h1]: [number, number], t: number): number {
  return MathUtils.smoothstep(t, h0 - 1, h0 - 0.1) * (1 - MathUtils.smoothstep(t, h1 + 0.1, h1 + 1));
}

/** In reduced motion the camera doesn't travel: it cuts to the active chapter's station. */
function stationT(world: WorldLayout): number {
  const [h0, h1] = world.holds[stage.chapter] ?? [0, 0];
  if (stage.chapter === 2) return h0 + Math.round(stage.relicFocus);
  if (stage.chapter === 4) return h1;
  return (h0 + h1) / 2;
}

type RigProps = Readonly<{
  world: WorldLayout;
  focus: Vector3;
  shadows: number;
  canvasEl: HTMLDivElement | null;
}>;

function Rig({ world, focus, shadows, canvasEl }: RigProps) {
  const invalidate = useThree((state) => state.invalidate);
  const key = useRef<DirectionalLight>(null);
  const ambient = useRef<AmbientLight>(null);
  const rig = useRef({ t: 0, parallax: new Vector2(), shift: new Vector2(), cut: -1, fov: 42 });

  const curves = useMemo(
    () => ({
      position: new CatmullRomCurve3(world.positions.map((p) => new Vector3(...p)), false, "centripetal"),
      target: new CatmullRomCurve3(world.targets.map((p) => new Vector3(...p)), false, "centripetal"),
      count: world.positions.length,
    }),
    [world],
  );

  // Reduced motion: fade the canvas out, cut, fade back in.
  useEffect(() => {
    stage.invalidate = invalidate;
    return () => {
      stage.invalidate = () => {};
    };
  }, [invalidate]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const camera = state.camera as PerspectiveCamera;
    const r = rig.current;
    const reduce = stage.reducedMotion;

    if (!reduce) shared.uTime.value += dt;

    // ── Path position ──────────────────────────────────────────────────────
    if (reduce) {
      const station = stationT(world);
      if (station !== r.cut) {
        if (r.cut < 0) {
          r.t = station;
        } else if (canvasEl) {
          canvasEl.classList.add("is-cutting");
          window.setTimeout(() => {
            r.t = station;
            invalidate();
            window.setTimeout(() => canvasEl.classList.remove("is-cutting"), 40);
          }, 360);
        } else {
          r.t = station;
        }
        r.cut = station;
      }
    } else {
      r.t = damp(r.t, stage.pathT, 5, dt);
    }
    const u = MathUtils.clamp(r.t / (curves.count - 1), 0, 1);
    curves.position.getPoint(u, P);
    curves.target.getPoint(u, L);
    focus.copy(L);

    // How close the camera is to the relic and forge stations (0–1).
    const inRelics = stationWeight(world.holds[2], r.t);
    const inForge = stationWeight(world.holds[3], r.t);
    const aspect = state.size.width / Math.max(1, state.size.height);

    // ── Pose: parallax, handheld drift, impact jolt ────────────────────────
    const px = stage.pointerActive ? stage.pointer.x : 0;
    const py = stage.pointerActive ? stage.pointer.y : 0;
    r.parallax.set(damp(r.parallax.x, px, 2.2, dt), damp(r.parallax.y, py, 2.2, dt));
    // Portrait screens are narrow: back off from the anvil so it fits.
    if (aspect < 0.75 && inForge > 0) P.sub(L).multiplyScalar(1 + 0.4 * inForge).add(L);
    camera.position.copy(P);
    camera.lookAt(L);
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    up.setFromMatrixColumn(camera.matrixWorld, 1);
    camera.position.addScaledVector(right, r.parallax.x * 0.35).addScaledVector(up, r.parallax.y * 0.22);
    if (!reduce) {
      const time = shared.uTime.value;
      camera.position.addScaledVector(up, Math.sin(time * 0.53) * 0.025 + stage.impact * Math.sin(time * 38) * 0.035);
      camera.position.addScaledVector(right, Math.sin(time * 0.37 + 1.2) * 0.03);
    }
    camera.lookAt(L);

    // ── Lens: FOV by aspect, lens shift to frame relics beside their panel ──
    const fov = aspect < 0.75 ? 60 : aspect < 1.15 ? 50 : 42;
    const mobile = state.size.width < 768;
    // Relics sit left of their panel (desktop) or above it (phone); the anvil
    // rides in the upper right, clear of the heading and the step cards.
    const shiftX = mobile ? 0 : 0.2 * inRelics - 0.19 * inForge;
    const shiftY = mobile ? 0.18 * inRelics + 0.09 * inForge : 0.13 * inForge;
    // On-demand rendering (reduced motion) draws too few frames to ease: snap.
    if (reduce) r.shift.set(shiftX, shiftY);
    else r.shift.set(damp(r.shift.x, shiftX, 4, dt), damp(r.shift.y, shiftY, 4, dt));
    const { width, height } = state.size;
    if (Math.abs(r.shift.x) + Math.abs(r.shift.y) > 1e-4) {
      camera.setViewOffset(width, height, r.shift.x * width, r.shift.y * height, width, height);
    } else if (camera.view?.enabled) {
      camera.clearViewOffset();
    }
    if (fov !== r.fov || camera.fov !== fov) {
      r.fov = fov;
      camera.fov = fov;
    }
    camera.updateProjectionMatrix();

    // ── Atmosphere ─────────────────────────────────────────────────────────
    const { a, b, mix } = atmosphereAt(world.atmosphere, r.t);
    const heat = stage.heat * inForge;

    shared.uFogColor.value.copy(colorA.set(a.fog)).lerp(colorB.set(b.fog), mix).lerp(forgeFog, heat * 0.5);
    shared.uFogDensity.value = MathUtils.lerp(a.density, b.density, mix);
    shared.uFogFloor.value = MathUtils.lerp(a.floor, b.floor, mix);
    shared.uFogFalloff.value = MathUtils.lerp(a.falloff, b.falloff, mix);
    shared.uKeyColor.value.copy(colorA.set(a.key)).lerp(colorB.set(b.key), mix).lerp(forgeKey, heat * 0.6);
    shared.uKeyIntensity.value = MathUtils.lerp(a.keyIntensity, b.keyIntensity, mix) * (1 + heat * 0.4);
    shared.uKeyDir.value.copy(keyDirA.set(...a.keyDir).normalize()).lerp(keyDirB.set(...b.keyDir).normalize(), mix).normalize();
    shared.uAmbient.value = MathUtils.lerp(a.ambient, b.ambient, mix);

    // Real three.js lights for the MeshStandardMaterial architecture.
    if (key.current) {
      key.current.color.copy(shared.uKeyColor.value);
      key.current.intensity = shared.uKeyIntensity.value * 1.6;
      key.current.position.copy(L).addScaledVector(shared.uKeyDir.value, 24);
      key.current.target.position.copy(L);
      key.current.target.updateMatrixWorld();
    }
    if (ambient.current) {
      ambient.current.color.copy(shared.uFogColor.value).addScalar(0.02);
      ambient.current.intensity = shared.uAmbient.value * 6;
    }

    stage.ink = inkAt(world, r.t);
    stage.impact = damp(stage.impact, 0, 1.6, dt);
    stage.kick = damp(stage.kick, 0, 3.2, dt);
  }, -1);

  return (
    <>
      <ambientLight ref={ambient} />
      <directionalLight
        ref={key}
        castShadow={shadows > 0}
        shadow-mapSize={[shadows || 512, shadows || 512]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-radius={shadows >= 1024 ? 4 : 2}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-near={1}
        shadow-camera-far={60}
      />
    </>
  );
}

// ── Scene ──────────────────────────────────────────────────────────────────

/**
 * Compiles every material in the scene before the first frame, using
 * KHR_parallel_shader_compile where available (three's compileAsync), so
 * the dozen noise-heavy programs don't freeze the main thread in one long
 * synchronous task. Rendering stays off (frameloop "never") until it's done.
 */
function Precompile({ onDone }: Readonly<{ onDone: () => void }>) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  useEffect(() => {
    let cancelled = false;
    // Wait one frame so every child has mounted its meshes into the scene.
    const id = requestAnimationFrame(() => {
      // Compile the variants that will actually be used: the composer renders
      // the scene into a linear HalfFloat target (no tone mapping, no sRGB
      // encode in the material), and three keys programs on exactly that.
      // Compiling against the screen would build the wrong variants and every
      // program would be rebuilt synchronously on the first real frame.
      const target = new WebGLRenderTarget(1, 1, { type: HalfFloatType });
      const previous = gl.getRenderTarget();
      gl.setRenderTarget(target);
      const compiling = gl.compileAsync(scene, camera);
      gl.setRenderTarget(previous);
      compiling
        .catch(() => undefined)
        .finally(() => {
          target.dispose();
          if (!cancelled) onDone();
        });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [gl, scene, camera, onDone]);
  return null;
}

/** Marks the page once the first frames are on screen, then flares the Seed. */
function ReadySignal() {
  const frames = useRef(0);
  useFrame((state) => {
    frames.current += 1;
    // With frameloop="demand" (reduced motion) nothing renders unless asked:
    // keep requesting frames until the scene has been drawn a few times.
    if (frames.current < 3) {
      state.invalidate();
      return;
    }
    if (frames.current === 3 && !stage.glReady) {
      stage.glReady = true;
      stage.impact = Math.max(stage.impact, 0.7);
      document.documentElement.dataset.gl = "ready";
      emit("glready", {});
    }
  });
  return null;
}

function Scene({ tier, world, canvasEl }: Readonly<{ tier: QualityTier; world: WorldLayout; canvasEl: HTMLDivElement | null }>) {
  const q = QUALITY[tier];
  const focus = useMemo(() => new Vector3(0, 1.5, 0), []);

  const mist = useMemo<MistLayer[]>(() => {
    const layers: MistLayer[] = [];
    const add = (center: readonly [number, number, number], extent: number, opacity: number) =>
      layers.push({ center: [center[0], center[1], center[2]], extent, opacity });
    add([0, -9.7, -14], 70, 0.8);
    add([0, -9.1, -20], 60, 0.5);
    world.altars.forEach((altar) => add([altar[0], altar[1] + 0.35, altar[2]], 26, 0.7));
    add([world.anvil[0], world.anvil[1] + 0.3, world.anvil[2]], 40, 0.6);
    add([world.pact[0], world.pact[1] + 0.25, world.pact[2]], 40, 0.55);
    return layers;
  }, [world]);

  return (
    <>
      <Rig world={world} focus={focus} shadows={q.shadows} canvasEl={canvasEl} />
      <Atmosphere />
      <FogPlane mist={mist} seaLayers={tier === "low" ? 3 : tier === "medium" ? 5 : 7} octaves={q.noiseOctaves} />
      <Seed octaves={q.noiseOctaves} />
      <Ruins />
      {relics.map((relic, i) => (
        <RelicAltar
          key={relic.id}
          relic={relic}
          index={i}
          base={world.altars[i]}
          relicPosition={world.relics[i]}
          octaves={q.noiseOctaves}
          sparks={tier !== "low"}
        />
      ))}
      <ForgeScene anvil={world.anvil} sparks={tier !== "low"} />
      <PactScene center={world.pact} />
      <EmberField embers={q.embers} ash={q.ash} />
      <CursorLight focus={focus} />
      <PostFX quality={q} />
      <ReadySignal />
    </>
  );
}

// ── Canvas ─────────────────────────────────────────────────────────────────

type ExperienceProps = Readonly<{
  /** Highest tier this device may use (from lib/quality heuristics). */
  ceiling: QualityTier;
  /** Tier forced via ?quality=, bypassing the monitor. */
  forced?: QualityTier;
}>;

/**
 * The persistent WebGL layer: one fixed canvas behind the DOM for the whole
 * descent. Loaded client-side only, after first paint (see StageLoader).
 */
export default function Experience({ ceiling, forced }: ExperienceProps) {
  const [tier, setTier] = useState<QualityTier>(forced ?? ceiling);
  const [frameloop, setFrameloop] = useState<"always" | "demand" | "never">("always");

  // Tier adaptation. drei counts every incline/decline *event* as a flip —
  // including inclines that can't go anywhere because we're already at the
  // ceiling — so its own flip-flop fallback would fire on a device that's
  // doing great. Count real tier changes instead, and stop adapting after
  // two round trips.
  const adapt = useRef({ tier: forced ?? ceiling, changes: 0, locked: Boolean(forced) });
  const shiftTier = useCallback(
    (delta: -1 | 1) => {
      const a = adapt.current;
      if (a.locked) return;
      const next = stepTier(a.tier, delta, ceiling);
      if (next === a.tier) return;
      a.tier = next;
      a.changes += 1;
      if (a.changes >= 4) a.locked = true;
      setTier(next);
    },
    [ceiling],
  );
  const [compiled, setCompiled] = useState(false);
  const onCompiled = useCallback(() => setCompiled(true), []);
  const [canvasEl, setCanvasEl] = useState<HTMLDivElement | null>(null);
  const world = useMemo(() => buildWorld(relics.length), []);
  const q = QUALITY[tier];

  // Reduced motion → render on demand; hidden tab → don't render at all.
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      stage.reducedMotion = motion.matches;
      setFrameloop(document.hidden ? "never" : motion.matches ? "demand" : "always");
      stage.invalidate();
    };
    sync();
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={setCanvasEl} data-tier={tier} className="stage-canvas fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={compiled ? frameloop : "never"}
        dpr={dprFor(q)}
        shadows={q.shadows > 0 ? "percentage" : false}
        gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "high-performance" }}
        camera={{ fov: 42, near: 0.1, far: 140, position: [0, 2.2, 10.6] }}
        onCreated={({ gl }) => {
          gl.setClearColor("#07070A", 1);
          // Querying program info logs forces each shader link to finish
          // synchronously, defeating KHR_parallel_shader_compile (measured:
          // ~2.3 s of main-thread stalls at start-up). Keep the checks in dev.
          gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            document.documentElement.dataset.gl = "lost";
          });
        }}
      >
        <PerformanceMonitor
          // Judge on ~4 s windows so a one-off hitch (a station's first
          // shadow pass, a big scroll jump) doesn't cost a quality tier.
          ms={400}
          iterations={10}
          threshold={0.8}
          bounds={(refresh) => (refresh > 100 ? [50, 90] : [38, 57])}
          onDecline={() => shiftTier(-1)}
          onIncline={() => shiftTier(1)}
        >
          <Scene tier={tier} world={world} canvasEl={canvasEl} />
        </PerformanceMonitor>
        <Precompile onDone={onCompiled} />
      </Canvas>
    </div>
  );
}
