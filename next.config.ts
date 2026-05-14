import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: "4mb",
    },
    staleTimes: {
      dynamic: 30, 
      static: 1000 * 60 * 60, 
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tickethub-v2.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
