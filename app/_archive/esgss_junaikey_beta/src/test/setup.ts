import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 模擬全域變數或 API (若是 Node.js 環境中需要的)
if (typeof window === 'undefined') {
  (global as any).window = {};
}

// Mock window properties for SSR compatibility
const mockWindowProps = {
  scrollTo: () => { },
  scrollBy: () => { },
};

// 模擬 localStorage（使用完整的 store 實作）
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

// Setup global mocks before tests
beforeAll(() => {
  // ⚡ Bolt: Extend global.window instead of overwriting it to preserve JSDOM
  if (typeof window !== 'undefined') {
    Object.assign(window, mockWindowProps);
  }

  // Mock localStorage if not present (JSDOM usually has it, but good to be safe)
  if (!global.localStorage) {
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
    });
  }

  // Mock sessionStorage if not present
  if (!global.sessionStorage) {
    (global as any).sessionStorage = {
      getItem: () => null,
      setItem: () => { },
      removeItem: () => { },
      clear: () => { },
    };
  }
});

// Cleanup after all tests
afterAll(() => {
  // Cleanup if needed
});
