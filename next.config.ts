import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: [
    'sharp',
    'firebase-admin',
    '@genkit-ai/googleai',
    '@grpc/grpc-js',
    '@opentelemetry/sdk-node',
    '@opentelemetry/otlp-grpc-exporter-base',
    '@opentelemetry/exporter-trace-otlp-grpc',
    '@opentelemetry/otlp-exporter-base',
    '@opentelemetry/otlp-http-exporter'
  ],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/@firebase/ },
      { module: /node_modules\/firebase/ },
      { module: /node_modules\/idb/ },
      /There are multiple modules with names that only differ in casing/
    ];

    if (!config.resolve) config.resolve = {};
    if (!config.resolve.fallback) config.resolve.fallback = {};
    Object.assign(config.resolve.fallback, {
      net: false,
      tls: false,
      fs: false,
      http2: false,
      http: false,
      https: false,
      zlib: false,
      stream: false,
      crypto: false,
    });

    return config;
  },
};

export default nextConfig;

