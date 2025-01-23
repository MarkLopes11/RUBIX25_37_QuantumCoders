// next.config.js or next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three'],  // Add 'three' here to transpile the package
  // You can add other configurations here if necessary
};

export default nextConfig;
