import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
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
