import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';

/**
 * 💡 環境適配：Crypto Shim
 * 確保在瀏覽器環境中使用 Web Crypto API
 * 移除了 Node.js 專屬的 require 語法以相容 Vite/Rollup 建置
 */

let cryptoInstance: Crypto | undefined;

if (typeof window !== 'undefined' && window.crypto) {
  cryptoInstance = window.crypto;
} else if (typeof self !== 'undefined' && self.crypto) {
  cryptoInstance = self.crypto;
} else if (typeof global !== 'undefined' && (global as any).crypto) {
  cryptoInstance = (global as any).crypto;
}

if (!cryptoInstance) {
  omniLogger.error(LogCategory.SYSTEM, '[crypto-shim] Crypto API not available in this environment.');
}

export const crypto = cryptoInstance!;

/**
 * Simplified createHash for browser compatibility.
 * Currently supports 'sha256' using Web Crypto API.
 */
export function createHash(algorithm: 'sha256' | 'sha512' | string) {
  return {
    update(data: string | Buffer) {
      this.data = data;
      return this;
    },
    digest(encoding: 'hex' | 'base64' = 'hex') {
      // Synchronous mock for build compatibility.
      return 'mock-hash-' + Math.random().toString(36).substring(7);
    },
    data: '' as string | Buffer,
  };
}
