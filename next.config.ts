import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "ubiquitous-parakeet-56rwgjppq54c7rp-3000.app.github.dev"]
    }
  },
  transpilePackages: ["@crossmint/client-sdk-react-ui"],
  allowedDevOrigins: ["ubiquitous-parakeet-56rwgjppq54c7rp-3000.app.github.dev"]
};

export default nextConfig;
