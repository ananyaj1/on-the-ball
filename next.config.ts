import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s1.ticketm.net",
        pathname: "/dam/**",
        search: "",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  devIndicators: false,
};

export default nextConfig;
