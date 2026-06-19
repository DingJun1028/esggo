import path from 'path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProduction = mode === 'production';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      // https: true, // Disabled for local dev stability
    },
    plugins: [
      react()
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction, // 生產環境關閉sourcemap以減小體積

      // 啟用代碼分割和優化
      rollupOptions: {
        external: [
          'nodemailer',
          'web-push'
        ],
        output: {
          // 自定義chunk分割策略
          manualChunks: {
            // React相關庫
            'react-vendor': ['react', 'react-dom', 'react-is'],

            // UI庫
            'ui-vendor': ['framer-motion', 'lucide-react', 'recharts'],

            // 狀態管理
            'state-vendor': ['zustand', 'rxjs'],

            // 數據處理
            'data-vendor': ['axios', 'zod'],

            // 工具庫
            'utils-vendor': ['uuid', 'markdown-it', 'marked', 'html2pdf.js'],

            // ESG核心組件 (懶載入)
            'esg-core': [
              './components/ESGConsole.tsx',
              './components/ESGDashboard.tsx',
              './components/ESGAiAssistant.tsx'
            ],

            // 遊戲組件 (懶載入)
            'game-core': [
              './components/CardGameArena.tsx',
              './components/UniversalCard.tsx',
              './components/UniversalCrystal.tsx'
            ],

            // AI組件 (懶載入)
            'ai-core': [
              './components/OmniKeyDashboard.tsx',
              './components/OmniManager.tsx',
              './components/OmniDimensionAgent.tsx'
            ]
          }
        }
      },

      // 優化配置
      chunkSizeWarningLimit: 1000, // 增加chunk大小警告限制
      minify: 'esbuild', // 使用esbuild進行壓縮（內建）

      // 資源優化
      assetsInlineLimit: 4096, // 小於4KB的資源內聯
      cssCodeSplit: true, // CSS代碼分割
    },

    // 預載配置 - 優化依賴預加載
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'lucide-react',
        'zustand',
        'axios',
        'zod'
      ],
      exclude: [
        // 排除大型庫，這些會被懶載入
        '@supabase/supabase-js',
        '@google/generative-ai',
        'openai',
        'recharts'
      ]
    },


  };
});
