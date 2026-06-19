// Re-export playwright types to help TypeScript resolve the package
// Playwright v1.x ships its own index.d.ts but the package.json lacks a "types" field
export * from 'playwright-core';
