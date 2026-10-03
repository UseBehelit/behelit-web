import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "evenstate\\.(behelit\\.dev|localhost)" }],
          destination: "/evenstate",
        },
      ],
    };
  },
  turbopack: {
    rules: {
      // Import GLSL as a plain string: `import src from "@/shaders/x.glsl"`.
      // Next 16 builds with Turbopack by default (a custom `webpack` config
      // would fail the build), so the loader is registered here. raw-loader
      // emits `export default "<source>"`; `as: "*.js"` tells Turbopack to
      // treat that output as JavaScript. (Turbopack's built-in
      // `type: "raw"` module type does not produce a default export, so the
      // import would be undefined.) Shared chunks are spliced in at runtime
      // by lib/glsl.ts (`#pragma include <name>`).
      "*.glsl": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
