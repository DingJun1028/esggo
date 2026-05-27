import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['sharp', 'firebase-admin', '@genkit-ai/googleai', '@grpc/grpc-js', '@opentelemetry/sdk-node'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  webpack: (config) => {
    // 萬能修復 (Universal Fix): Suppress CaseSensitivePathsPlugin warnings 
    // caused by Windows drive letter casing mismatches (e.g., c:\ vs C:\)
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /node_modules\/@firebase/ },
      { module: /node_modules\/firebase/ },
      { module: /node_modules\/idb/ },
      /There are multiple modules with names that only differ in casing/
    ];
    return config;
  },
};

export default nextConfig;

