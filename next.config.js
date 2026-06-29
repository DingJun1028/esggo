/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' },
      },
    },
    serverComponentsExternalPackages: ['firebase-admin', '@upstash/redis'],
  },
  webpack: (config) => {
    config.resolve.alias['@lib'] = require('path').resolve(__dirname, 'lib');
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      child_process: false,
      dns: false,
      path: false,
    };
    return config;
  },
};

module.exports = nextConfig;
