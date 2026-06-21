import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  // Removed outputFileTracingRoot to silence Turbopack warnings
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
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default nextConfig;
