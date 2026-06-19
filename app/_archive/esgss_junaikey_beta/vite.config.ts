import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isProduction = mode === 'production';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // Prevent Vite from serving server-side files to the browser
      fs: {
        deny: ['server/**'],
      },
      // https: true, // Disabled for local dev stability
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
        '/junaikey/api': {
          target: 'http://localhost:3004',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@domain': path.resolve(__dirname, './src/0-domain'),
        '@infra': path.resolve(__dirname, './src/2-infra'),
        '@interface': path.resolve(__dirname, './src/3-interface'),
        '@store': path.resolve(__dirname, './src/4-store'),
        '@hooks': path.resolve(__dirname, './src/5-hooks'),
        '@core': path.resolve(__dirname, './src/0-core'),
        '@services': path.resolve(__dirname, './src/services'),
        '@service': path.resolve(__dirname, './src/1-service'),
        '@omni': path.resolve(__dirname, './src/omni'),

        // Node.js mocks re-enabled to fix 'Identifier.bind' crash
        'pino': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'pino-pretty': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'fs': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:fs': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'path': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:path': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'stream/web': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:stream/web': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'stream': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:stream': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'process': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:process': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'crypto': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:crypto': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'url': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:url': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'util': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:util': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'http': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:http': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'https': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:https': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'net': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:net': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:zlib': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        // events and node:events
        'events': path.resolve(__dirname, './src/utils/EventEmitter.ts'),
        'node:events': path.resolve(__dirname, './src/utils/EventEmitter.ts'),
        'assert': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:assert': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'os': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:os': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'querystring': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:querystring': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'tls': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:tls': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'ioredis': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'dns': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:dns': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'child_process': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:child_process': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'worker_threads': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:worker_threads': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'http2': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:http2': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'string_decoder': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:string_decoder': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'constants': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:constants': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'buffer': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:buffer': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'async_hooks': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:async_hooks': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'module': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'node:module': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'dotenv': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'dotenv/config': path.resolve(__dirname, './src/utils/empty-mock.ts'),
        'keccak': path.resolve(__dirname, './src/utils/keccak-browser-mock.ts'),
        'keccak256': path.resolve(__dirname, './src/utils/keccak-browser-mock.ts'),
      },
    },
    define: {
      // Only expose VITE_-prefixed vars to the frontend bundle
      // WARNING: do NOT use 'process.env': env (leaks ALL env vars to client bundle)
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || ''),
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
      'process.env.VITE_JUNAIKEY_API_KEY': JSON.stringify(env.VITE_JUNAIKEY_API_KEY || ''),
      'process.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME || 'ESG Sunshine JunAiKey'),
      'process.env.VITE_APP_VERSION': JSON.stringify(env.VITE_APP_VERSION || '1.0.0'),
      'global': 'window',
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      minify: 'esbuild',
      rollupOptions: {
        external: [
          'nodemailer',
          'web-push',
          'puppeteer',
          'express',
          'pg',
          'cheerio',
          'jsdom',
          'bullmq',
          'ioredis',
          'firebase-admin',
          'openai',
          'bcryptjs',
          'jsonwebtoken',
          'turndown',
          'multer'
        ],
        output: {
          manualChunks: {
            // 'vendor': ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'zustand', 'axios'],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'lucide-react',
        'zustand',
        'axios',
        'zod',
        'recharts',
      ],
      exclude: [
        '@supabase/supabase-js',
        '@google/generative-ai',
        'openai',
      ],
    },
  };
});
