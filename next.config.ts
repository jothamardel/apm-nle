import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "seyimakinde.com",
      },
      {
        protocol: "https",
        hostname: "apm.org.ng",
      },
    ],
  },
};

export default nextConfig;

