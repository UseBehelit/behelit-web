"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, Plane, Raycaster, Vector2, Vector3, type Mesh, type PointLight } from "three";
import { stage } from "@/lib/stage";
import { createGlowMaterial } from "./materials";
import { colors, damp, shared } from "./uniforms";

const raycaster = new Raycaster();
const ndc = new Vector2();
const plane = new Plane();
const target = new Vector3();
const forward = new Vector3();
const hit = new Vector3();

type CursorLightProps = Readonly<{ focus: Vector3 }>;

/**
 * A point light that follows the cursor through 3D space. The pointer ray is
 * intersected with a plane facing the camera through the current focus point
 * (the Seed, a relic, the anvil…), so the light hovers at the right depth for
 * whatever the camera is looking at and the facets catch it as you move.
 * With no pointer (touch, keyboard) it drifts on a slow Lissajous path.
 */
export function CursorLight({ focus }: CursorLightProps) {
  const light = useRef<PointLight>(null);
  const wisp = useRef<Mesh>(null);
  const intensity = useRef(0);
  const glow = useMemo(() => createGlowMaterial(new Color("#ffb070"), 2), []);
  const baseColor = useMemo(() => colors.ember.clone().lerp(colors.gold, 0.35), []);

  useFrame((state, dt) => {
    const camera = state.camera;
    const t = state.clock.elapsedTime;
    const pointer = stage.pointerActive
      ? stage.pointer
      : { x: Math.sin(t * 0.21) * 0.45, y: Math.sin(t * 0.13 + 1.3) * 0.3 };

    camera.getWorldDirection(forward);
    plane.setFromNormalAndCoplanarPoint(forward.negate(), focus);
    ndc.set(pointer.x, pointer.y);
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      // Keep the light a little in front of the focus plane, towards the camera.
      target.copy(hit).lerp(camera.position, 0.18);
    }

    const pos = shared.uCursorPos.value;
    const k = stage.reducedMotion ? 30 : 5;
    pos.set(damp(pos.x, target.x, k, dt), damp(pos.y, target.y, k, dt), damp(pos.z, target.z, k, dt));

    intensity.current = damp(intensity.current, 1 + stage.hover * 1.2 + stage.pact * 0.8, 4, dt);
    shared.uCursorColor.value.copy(baseColor).multiplyScalar(7 * intensity.current);

    if (light.current) {
      light.current.position.copy(pos);
      light.current.intensity = 14 * intensity.current;
    }
    if (wisp.current) {
      wisp.current.position.copy(pos);
      wisp.current.quaternion.copy(camera.quaternion);
      const flicker = 0.85 + 0.15 * Math.sin(t * 11.3) * Math.sin(t * 7.1);
      wisp.current.scale.setScalar(0.1 * intensity.current * flicker);
    }
  });

  return (
    <>
      <pointLight ref={light} color={baseColor} distance={14} decay={2} />
      <mesh ref={wisp} material={glow} renderOrder={6}>
        <planeGeometry args={[1, 1]} />
      </mesh>
    </>
  );
}
