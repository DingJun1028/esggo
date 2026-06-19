/**
 * ⚡ OmniCache: Sentient Proxy Cache (Edge Compatible)
 * 
 * L1: In-Memory Map (all environments)
 * L2: Upstash Redis via HTTP (Edge / Vercel compatible, no native Node deps)
 * 
 * ioredis has been removed to ensure compatibility with Next.js Edge Runtime.
 */

import { omniLogger, LogCategory } from './omniLogger';

// Upstash REST client (HTTP-based, Edge compatible)
let upstash: { url: string; token: string } | null = null;

function getUpstash() {
    if (!upstash) {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;
        if (url && token) upstash = { url, token };
    }
    return upstash;
}

async function upstashGet(key: string): Promise<string | null> {
    const u = getUpstash();
    if (!u) return null;
    try {
        const res = await fetch(`${u.url}/get/${encodeURIComponent(key)}`, {
            headers: { Authorization: `Bearer ${u.token}` },
        });
        const json = await res.json() as { result: string | null };
        return json.result;
    } catch { return null; }
}

async function upstashSet(key: string, value: string, ttlSeconds: number): Promise<void> {
    const u = getUpstash();
    if (!u) return;
    try {
        await fetch(`${u.url}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}/ex/${ttlSeconds}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${u.token}` },
        });
    } catch { /* ignore */ }
}

async function upstashDel(key: string): Promise<void> {
    const u = getUpstash();
    if (!u) return;
    try {
        await fetch(`${u.url}/del/${encodeURIComponent(key)}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${u.token}` },
        });
    } catch { /* ignore */ }
}

async function upstashIncr(key: string): Promise<number> {
    const u = getUpstash();
    if (!u) return 0;
    try {
        const res = await fetch(`${u.url}/incr/${encodeURIComponent(key)}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${u.token}` },
        });
        const json = await res.json() as { result: number };
        return json.result;
    } catch { return 0; }
}

async function upstashExpire(key: string, seconds: number): Promise<void> {
    const u = getUpstash();
    if (!u) return;
    try {
        await fetch(`${u.url}/expire/${encodeURIComponent(key)}/${seconds}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${u.token}` },
        });
    } catch { /* ignore */ }
}

export class OmniCache {
    private static cache = new Map<string, { value: any; expiry: number }>();
    private static DEFAULT_TTL = 3600000; // 1 hour in ms

    /** 🌊 Redis Streams Configuration */
    public static readonly STREAMS = {
        MANIFESTATIONS: 'omni:streams:manifestations',
        TELEMETRY: 'omni:streams:telemetry'
    };

    /** No-op: kept for backwards compatibility */
    public static async connect(): Promise<void> {
        omniLogger.info(LogCategory.SYSTEM, 'OmniCache: Using Edge-compatible HTTP cache (Upstash). No TCP connection needed.');
    }

    public static async getDiagnostics() {
        const u = getUpstash();
        return {
            status: u ? 'STABLE' : 'DEGRADED (no Upstash env)',
            latency: 'N/A',
            memory: 'N/A',
            l1Size: this.cache.size,
        };
    }

    public static getStatus(): 'STABLE' | 'DEGRADED' {
        return getUpstash() ? 'STABLE' : 'DEGRADED';
    }

    public static async get<T>(key: string): Promise<T | null> {
        try {
            // L1 Hit
            const item = this.cache.get(key);
            if (item && Date.now() <= item.expiry) {
                omniLogger.info(LogCategory.SYSTEM, `OmniCache [L1]: HIT key: ${key}`);
                return item.value as T;
            }

            // L2 Hit (Upstash via HTTP)
            const raw = await upstashGet(key);
            if (raw) {
                const parsed = JSON.parse(raw);
                this.cache.set(key, { value: parsed, expiry: Date.now() + this.DEFAULT_TTL });
                omniLogger.info(LogCategory.SYSTEM, `OmniCache [L2]: HIT key: ${key} (Promoted to L1)`);
                return parsed as T;
            }

            if (item) this.cache.delete(key);
            return null;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `OmniCache Retrieval Failure: ${key} -> ${error}`);
            return null;
        }
    }

    public static async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
        try {
            this.cache.set(key, { value, expiry: Date.now() + ttl });
            const ttlSeconds = Math.ceil(ttl / 1000);
            await upstashSet(key, JSON.stringify(value), ttlSeconds);
            omniLogger.info(LogCategory.SYSTEM, `OmniCache: STORED key: ${key} [TTL: ${ttl}ms]`);
        } catch (error) {
            omniLogger.warn(LogCategory.SYSTEM, `OmniCache Persistence Error for ${key}: ${error}`);
        }
    }

    /**
     * 🚀 Atomic Increment (Redis-backed)
     * Used primarily for rate limiting.
     */
    public static async incr(key: string, ttlSeconds: number): Promise<number> {
        const count = await upstashIncr(key);
        if (count === 1) {
            // First hit, set expiry
            await upstashExpire(key, ttlSeconds);
        }
        return count;
    }

    public static async delete(key: string): Promise<void> {
        this.cache.delete(key);
        await upstashDel(key);
    }

    public static async clear(): Promise<void> {
        this.cache.clear();
        omniLogger.info(LogCategory.SYSTEM, 'OmniCache: Sentient cache purged. ♾️');
    }

    /**
     * 🌊 Push data to a Redis Stream (XADD)
     * Uses Upstash REST API compatibility.
     */
    public static async pushToStream(stream: string, data: any): Promise<string | null> {
        const u = getUpstash();
        if (!u) return null;

        try {
            const payload = JSON.stringify(data);
            // Upstash XADD via REST: command/xadd/stream/*/data/json_string
            const res = await fetch(`${u.url}/xadd/${stream}/*/data/${encodeURIComponent(payload)}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${u.token}` },
            });
            const json = await res.json() as { result: string };
            omniLogger.info(LogCategory.SYSTEM, `OmniCache: Pushed to stream ${stream} -> ID: ${json.result}`);
            return json.result;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `OmniCache Stream Failure: ${stream} -> ${error}`);
            return null;
        }
    }

    public static generateKey(namespace: string, id: string, params?: any): string {
        const paramStr = params ? `:${JSON.stringify(params)}` : '';
        return `omni:${namespace}:${id}${paramStr}`;
    }

    public static async wrap<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl: number = this.DEFAULT_TTL
    ): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached !== null) return cached;
        const fresh = await fetcher();
        await this.set(key, fresh, ttl);
        return fresh;
    }
}
