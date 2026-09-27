/**
 * Minimal GLSL include resolver.
 *
 * Raw imports can't follow includes, so shaders write
 *   #pragma include <noise>
 * and this splices in the matching chunk. The `#pragma` spelling keeps the
 * line harmless if a chunk is ever missing and never collides with three.js'
 * own `#include <…>` chunks, which three resolves later at compile time.
 */

import fog from "@/shaders/fog.glsl";
import lighting from "@/shaders/lighting.glsl";
import noise from "@/shaders/noise.glsl";

const CHUNKS: Record<string, string> = { noise, fog, lighting };

export function glsl(source: string): string {
  return source.replace(/^[ \t]*#pragma include <(\w+)>[ \t]*$/gm, (line, name: string) => {
    const chunk = CHUNKS[name];
    if (chunk === undefined) throw new Error(`glsl(): unknown chunk <${name}>`);
    return chunk;
  });
}
