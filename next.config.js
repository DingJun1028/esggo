/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['firebase-admin', '@upstash/redis'],
  turbopack: {},
};

module.exports = nextConfig;
