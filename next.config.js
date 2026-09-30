/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the Base44 preview origin to access dev assets/HMR
  allowedDevOrigins: process.env.BASE44_PUBLIC_HOST_SUFFIX
    ? ['3000-' + process.env.BASE44_PUBLIC_HOST_SUFFIX]
    : [],
  // Type errors MUST be caught at build time — never ignore them
  typescript: {
    ignoreBuildErrors: false,
  },
  // Strict mode for React
  reactStrictMode: true,
  // Server-only packages (not bundled for client)
  serverExternalPackages: ['firebase-admin', '@upstash/redis', 'ioredis', 'pg'],
  // Experimental features
  experimental: {},
  // Security: disable x-powered-by header (defense-in-depth with middleware)
  poweredByHeader: false,
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Turbopack (default bundler in Next.js 16)
  turbopack: {},
};

module.exports = nextConfig;
