/** GLSL files are imported as raw source strings (see next.config.ts). */
declare module "*.glsl" {
  const source: string;
  export default source;
}
