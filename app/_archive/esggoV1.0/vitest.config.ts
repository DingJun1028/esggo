import { defineConfig } from 'vitest/config';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom', // 使用 jsdom 支援 React UI 元件測試
        globals: true,
        setupFiles: ['./vitest.setup.ts'], // 加入 setup 檔案
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/**',
                '.next/**',
                'out/**',
                'vitest.config.ts',
                'vitest.setup.ts',
                '**/*.test.tsx',
                '**/*.test.ts',
                'stress-test-orchestrator.ts',
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});
