/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    turbo: {
      rules: {
        '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' },
      },
    },
  },
  webpack: (config, { defaultLoaders }) => {
    // Support @lib/* path alias for lib/ directory
    config.resolve.alias['@lib'] = require('path').resolve(__dirname, 'lib');
    return config;
  },
};

module.exports = nextConfig;
