import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['firebase-admin', '@upstash/redis'],
  turbopack: {},
};

export default nextConfig;
