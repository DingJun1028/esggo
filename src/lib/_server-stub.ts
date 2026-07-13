/**
 * Server-only stub — replaces firebase-admin / @upstash/redis during build
 * to prevent build-time crashes when env vars are missing.
 *
 * The real modules are loaded lazily at runtime on the server.
 */

// Lazy proxy that defers actual loading to first use
function createLazyProxy(importPath: string): unknown {
  let cached: Promise<unknown> | null = null;
  const loader = (): Promise<unknown> => {
    if (!cached) {
      cached = import(importPath).catch((err) => {
        console.warn(`[ServerStub] Failed to load ${importPath}`, err);
        return {} as Record<string, unknown>;
      });
    }
    return cached;
  };
  return new Proxy(function () {} as object, {
    get(_t, prop) {
      return loader().then((mod) => (mod as Record<string, unknown>)[prop as string]);
    },
    apply(_t, _this, args) {
      return loader().then((mod) => {
        if (typeof mod === 'function') return (mod as (...a: unknown[]) => unknown)(...args);
        return mod;
      });
    },
  });
}

const AdminModule = createLazyProxy('firebase-admin');
const UpstashModule = createLazyProxy('@upstash/redis');

export default AdminModule;
export const apps = (AdminModule as Record<string, unknown>).apps ?? [];
export const initializeApp = (AdminModule as Record<string, unknown>).initializeApp ?? (() => ({}));
export const credential = (AdminModule as Record<string, unknown>).credential ?? {};
export const firestore = (AdminModule as Record<string, unknown>).firestore ?? (() => ({}));
export const Redis = (UpstashModule as Record<string, unknown>).Redis ?? class StubRedis { constructor() { /* stub */ } };
