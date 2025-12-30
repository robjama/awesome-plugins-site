import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/awesome-plugins-site",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
