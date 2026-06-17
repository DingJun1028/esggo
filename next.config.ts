import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  // Output configuration for Firebase hosting
  output: 'standalone',
  // Explicitly set the output file tracing root to the current directory
  // to help Next.js correctly infer the project root in dynamic deployment environments.

  output: 'export',

  outputFileTracingRoot: path.join(__dirname, './'),
  serverExternalPackages: [
    'genkit',
    'sharp',
    'firebase-admin',
    '@genkit-ai/googleai',
    '@grpc/grpc-js',
    '@opentelemetry/sdk-node',
    'snarkjs',
    'ffjavascript',
    'web-worker',
    'protobufjs',
    '@grpc/proto-loader',
    'pdf-parse',
    'gaxios',
    'google-auth-library',
    'googleapis-common',
    '@google-cloud/logging',
    '@google-cloud/logging-winston',
    '@genkit-ai/google-cloud',
    '@genkit-ai/firebase',
  ],
  turbopack: {},
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  webpack: (config) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/@firebase/ },
      { module: /node_modules\/firebase/ },
      { module: /node_modules\/idb/ },
      { module: /node_modules\/snarkjs/ },
      { module: /node_modules\/ffjavascript/ },
      { module: /node_modules\/web-worker/ },
      { module: /node_modules\/@protobufjs\/inquire/ },
      { module: /node_modules\/@opentelemetry\/instrumentation-winston/ },
    ];

    if (!config.resolve) config.resolve = {};
    if (!config.resolve.fallback) config.resolve.fallback = {};
    Object.assign(config.resolve.fallback, {
      net: false,
      tls: false,
      fs: false,
      dns: false,
      child_process: false,
      dgram: false,
      async_hooks: false,
      http2: false,
      http: false,
      https: false,
      zlib: false,
      stream: false,
      crypto: false,
    });

    return config;
  },
  turbopack: {}, // Suppress Turbopack error when using custom webpack config in Next.js 16
};

export default nextConfig;
