/**
 * Server-only stub — replaces firebase-admin / @upstash/redis during build
 * to prevent build-time crashes when env vars are missing.
 *
 * The real modules are loaded lazily at runtime on the server.
 */

// Lazy proxy that deferres actual loading to first use
function createLazyProxy(importPath: string): any {
  let cached: any = null;
  const loader = () => {
    if (!cached) {
      try {
        cached = require(importPath);
      } catch {
        console.warn(`[ServerStub] Failed to load ${importPath}`);
        cached = {};
      }
    }
    return cached;
  };
  return new Proxy({}, {
    get(_t, prop) {
      const mod = loader();
      return (mod as any)[prop];
    },
    apply(_t, _this, args) {
      const mod = loader();
      if (typeof mod === 'function') return mod(...args);
      return mod;
    },
  });
}

const AdminModule = createLazyProxy('firebase-admin');
const UpstashModule = createLazyProxy('@upstash/redis');

export default AdminModule;
export const apps = (AdminModule as any).apps ?? [];
export const initializeApp = (AdminModule as any).initializeApp ?? (() => ({}));
export const credential = (AdminModule as any).credential ?? {};
export const firestore = (AdminModule as any).firestore ?? (() => ({}));
export const Redis = (UpstashModule as any).Redis ?? class StubRedis { constructor() { /* stub */ } };
