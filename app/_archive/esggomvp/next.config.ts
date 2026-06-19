import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Prevent ioredis and other Node-native packages from being bundled for the client
  serverExternalPackages: ['ioredis', '@redis/client', 'redis'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
    ],
  },
};

export default nextConfig;
