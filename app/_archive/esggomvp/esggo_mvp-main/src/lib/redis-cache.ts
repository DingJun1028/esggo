/**
 * ⚡ OmniCache: Sentient Proxy Cache (Edge Compatible)
 *
 * L1: In-Memory Map (all environments)
 * L2: Upstash Redis via HTTP REST API (Edge / Vercel compatible, no native Node deps)
 *
 * ioredis has been removed to ensure compatibility with Next.js Edge Runtime.
 *
 * Upstash REST API reference: https://upstash.com/docs/redis/features/restapi
 */

import { omniLogger, LogCategory } from '../core/omniLogger';

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

/**
 * Execute an Upstash Redis command via the REST API.
 * Upstash REST POST body format: [command, ...args]
 */
async function upstashCommand(command: string, args: (string | number)[]): Promise<unknown> {
    const u = getUpstash();
    if (!u) return null;
    try {
        const res = await fetch(`${u.url}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${u.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([command, ...args]),
        });
        if (!res.ok) {
            const errorText = await res.text();
            omniLogger.error(LogCategory.SYSTEM, `OmniCache [L2] Upstash Error [${command}]: ${res.status} ${errorText}`);
            return null;
        }
        const json = await res.json() as { result: unknown };
        return json.result;
    } catch (err) {
        omniLogger.error(LogCategory.SYSTEM, `OmniCache [L2] Upstash Exception [${command}]: ${err}`);
        return null;
    }
}

async function upstashGet(key: string): Promise<string | null> {
    const result = await upstashCommand('GET', [key]);
    return typeof result === 'string' ? result : null;
}

async function upstashSet(key: string, value: string, ttlSeconds: number): Promise<void> {
    await upstashCommand('SET', [key, value, 'EX', ttlSeconds]);
    omniLogger.info(LogCategory.SYSTEM, `OmniCache [L2]: STORED key: ${key} [TTL: ${ttlSeconds}s]`);
}

async function upstashDel(...keys: string[]): Promise<void> {
    await upstashCommand('DEL', keys);
}

async function upstashXAdd(stream: string, id: string, fields: Record<string, string>): Promise<string | null> {
    const fieldArgs: string[] = [];
    for (const [k, v] of Object.entries(fields)) {
        fieldArgs.push(k, v);
    }
    const result = await upstashCommand('XADD', [stream, id, ...fieldArgs]);
    return typeof result === 'string' ? result : null;
}

/**
 * Atomic Increment for Upstash Redis (Edge compatible)
 */
async function upstashIncr(key: string, ttlSeconds: number): Promise<number> {
    const count = await upstashCommand('INCR', [key]) as number;
    if (count === 1) {
        // Set expiry on first increment
        await upstashCommand('EXPIRE', [key, ttlSeconds]);
    }
    return count;
}

export class OmniCache {
    private static cache = new Map<string, { value: unknown; expiry: number }>();
    private static DEFAULT_TTL = 3600000; // 1 hour in ms

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
            const u = getUpstash();

            // L1 Hit
            const item = this.cache.get(key);
            if (item && Date.now() <= item.expiry) {
                omniLogger.info(LogCategory.SYSTEM, `OmniCache [L1]: HIT key: ${key}`);
                return item.value as T;
            }

            // L2 Hit (Upstash via HTTP)
            if (u) {
                const raw = await upstashGet(key);
                if (raw) {
                    try {
                        const parsed: unknown = JSON.parse(raw);
                        // Promote to L1
                        this.cache.set(key, { value: parsed, expiry: Date.now() + this.DEFAULT_TTL });
                        omniLogger.info(LogCategory.SYSTEM, `OmniCache [L2]: HIT key: ${key} (Promoted to L1)`);
                        return parsed as T;
                    } catch (parseError) {
                        omniLogger.error(LogCategory.SYSTEM, `OmniCache [L2] Parse Error for ${key}: ${parseError}`);
                    }
                }
            }

            if (item) {
                this.cache.delete(key);
                omniLogger.info(LogCategory.SYSTEM, `OmniCache [L1]: Expired/Invalid key removed: ${key}`);
            }
            return null;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `OmniCache Retrieval Failure: ${key} -> ${error}`);
            return null;
        }
    }

    public static async set(key: string, value: unknown, ttl: number = this.DEFAULT_TTL): Promise<void> {
        try {
            const u = getUpstash();
            // Store in L1
            this.cache.set(key, { value, expiry: Date.now() + ttl });

            // Persist to L2 (Upstash)
            if (u) {
                const ttlSeconds = Math.max(1, Math.ceil(ttl / 1000));
                await upstashSet(key, JSON.stringify(value), ttlSeconds);
            } else {
                omniLogger.info(LogCategory.SYSTEM, `OmniCache [L1]: STORED key: ${key} (L2 Skipped — Upstash not configured)`);
            }
        } catch (error) {
            omniLogger.warn(LogCategory.SYSTEM, `OmniCache Persistence Error for ${key}: ${error}`);
        }
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
     * ⏱️ Atomic Increment with TTL support
     */
    public static async incr(key: string, ttlSeconds: number): Promise<number> {
        return await upstashIncr(key, ttlSeconds);
    }

    /**
     * 🌊 Push data to a Redis Stream for async processing
     * Recommendation 3: High-concurrency performance optimization.
     */
    public static async pushToStream(streamName: string, payload: Record<string, unknown>): Promise<string | null> {
        try {
            const id = '*'; // Auto-generate ID
            const data: Record<string, string> = {
                data: JSON.stringify(payload),
                timestamp: Date.now().toString(),
                type: (payload.type as string) || 'unknown',
            };
            const result = await upstashXAdd(streamName, id, data);
            if (result) {
                omniLogger.info(LogCategory.SYSTEM, `OmniCache [Stream]: Pushed event to ${streamName}. StreamID: ${result}`);
            }
            return result;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `OmniCache [Stream] Failure for ${streamName}: ${error}`);
            return null;
        }
    }

    public static readonly STREAMS = {
        MANIFESTATIONS: 'omni:stream:manifestations',
        /** @deprecated Use ALCHEMY_LEVELS */
        ALCHEMEY_LEVELS: 'omni:stream:alchemy',
        ALCHEMY_LEVELS: 'omni:stream:alchemy',
        ANALYTICS: 'omni:stream:analytics',
    } as const;

    public static generateKey(namespace: string, id: string, params?: Record<string, unknown>): string {
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

        try {
            const fresh = await fetcher();
            await this.set(key, fresh, ttl);
            return fresh;
        } catch (error) {
            omniLogger.error(LogCategory.SYSTEM, `OmniCache [WRAP] Failure for ${key}: ${error}`);
            throw error;
        }
    }
}
