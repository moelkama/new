import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "media1.tenor.com" },
      { hostname: "placehold.co" },
      { hostname: "placecats.com" },
    ],
  },
};

export default nextConfig;
