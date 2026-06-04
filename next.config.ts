import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: [
    'genkit',
    'sharp',
    'firebase-admin',
    '@genkit-ai/googleai',
    '@grpc/grpc-js',
    '@opentelemetry/sdk-node',
    // ZKP / SnarkJS — Node-only，不應打包進 browser bundle
    'snarkjs',
    'ffjavascript',
    'web-worker',
    // Protobuf / gRPC — 動態 require 相容性
    'protobufjs',
    '@grpc/proto-loader',
    // PDF / OCR
    'pdf-parse',
    // Google API 客戶端 — 避免 uuid ESM race condition
    'gaxios',
    'google-auth-library',
    'googleapis-common',
    // Google Cloud Logging — uuid ESM chain
    '@google-cloud/logging',
    '@google-cloud/logging-winston',
    '@genkit-ai/google-cloud',
    '@genkit-ai/firebase',
  ],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  webpack: (config: any) => {
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/@firebase/ },
      { module: /node_modules\/firebase/ },
      { module: /node_modules\/idb/ },
      // ZKP / SnarkJS — Node-only 動態 require 語法
      { module: /node_modules\/snarkjs/ },
      { module: /node_modules\/ffjavascript/ },
      { module: /node_modules\/web-worker/ },
      // Protobuf 動態 require
      { module: /node_modules\/@protobufjs\/inquire/ },
      // OpenTelemetry winston transport 缺失警告
      { module: /node_modules\/@opentelemetry\/instrumentation-winston/ },
      /There are multiple modules with names that only differ in casing/,
      /textEmbedding004/,
      /pdf-parse/,
      /Critical dependency: the request of a dependency is an expression/,
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
};

export default nextConfig;

