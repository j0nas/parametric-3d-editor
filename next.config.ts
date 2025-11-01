import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude replicad from server-side bundling
  serverExternalPackages: ["replicad", "replicad-opencascadejs"],

  webpack: (config, { isServer }) => {
    // Exclude replicad from server-side webpack bundling
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push("replicad", "replicad-opencascadejs");
    }

    // Ignore fs module in client-side bundles
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    // Add WASM support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });

    return config;
  },

  // Required headers for SharedArrayBuffer (needed by Replicad)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
