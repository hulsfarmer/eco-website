import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: '/news',
        destination: '/news',
      },
      {
        source: '/tips',
        destination: '/tips',
      },
      {
        source: '/reviews', 
        destination: '/reviews',
      },
      {
        source: '/data',
        destination: '/data',
      },
      {
        source: '/about',
        destination: '/about',
      },
    ];
  },
};

export default nextConfig;
