import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // WebGL scene code: three.js objects (materials, uniforms, effects) are
  // created once with useMemo and mutated every frame inside useFrame — the
  // canonical react-three-fiber pattern. The React Compiler immutability rule
  // treats those memoised objects as frozen React values, which they are not
  // (and the compiler isn't enabled in this project).
  {
    files: ["components/canvas/**/*.{ts,tsx}"],
    rules: { "react-hooks/immutability": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
