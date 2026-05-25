import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['sharp', 'firebase-admin', '@genkit-ai/googleai', '@grpc/grpc-js', '@opentelemetry/sdk-node'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default nextConfig;