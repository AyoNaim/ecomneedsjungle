import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@crossmint/client-sdk-react-ui"],
  allowedDevOrigins: ["ubiquitous-parakeet-56rwgjppq54c7rp-3000.app.github.dev"]
};

export default nextConfig;
