// Shared Memory HTTP Proxy — RESTful CRUD
// app/api/memory/route.ts
// Both Next.js (internal) and Gateway (via HTTP) can use this

import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import type { MemoryEntry, MemoryQuery } from '@esggo/shared';
// Import Redis client lazily for graceful fallback
let redisClient: any = null;
let memoryFallback: Map<string, { entry: MemoryEntry; expiry: number }> | null = null;

async function getStore() {
  if (!redisClient) {
    try {
      const { getRedis } = await import('@lib/redis');
      redisClient = await getRedis();
    } catch { /* no redis */ }
    if (!redisClient) {
      memoryFallback = new Map();
    }
  }
  return redisClient || memoryFallback!;
}

function now() { return new Date().toISOString(); }

// GET /api/memory?key=xxx | ?prefix=abc&tags=... | ?stats=true
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  if (sp.get('stats') === 'true') {
    const { getRedisHealth } = await import('@lib/redis');
    const health = await getRedisHealth();
    return NextResponse.json({
      success: true,
      data: {
        totalEntries: health?.keys || 0,
        totalKeys: health?.keys || 0,
        redisConnected: health?.connected || false,
        provider: health?.connected ? 'redis' : 'memory',
        uptimeSeconds: process.uptime(),
      },
    });
  }

  const store = await getStore();
  const query: MemoryQuery = {
    key: sp.get('key') || undefined,
    prefix: sp.get('prefix') || undefined,
    tags: sp.get('tags')?.split(',').filter(Boolean),
    source: sp.get('source') || undefined,
    limit: Number(sp.get('limit')) || 50,
    offset: Number(sp.get('offset')) || 0,
  };

  if (query.key) {
    if (redisClient) {
      const raw = await redisClient.get(`mem:${query.key}`);
      if (!raw) return NextResponse.json({ success: true, data: [] });
      return NextResponse.json({ success: true, data: [JSON.parse(raw)] });
    }
    const found = memoryFallback!.get(query.key);
    if (!found || found.expiry < Date.now()) {
      memoryFallback!.delete(query.key);
      return NextResponse.json({ success: true, data: [] });
    }
    return NextResponse.json({ success: true, data: [found.entry] });
  }

  // List all matching entries
  if (redisClient) {
    const keys = query.prefix ? await redisClient.keys(`mem:${query.prefix}*`) : await redisClient.keys('mem:*');
    const entries: MemoryEntry[] = [];
    for (const k of keys.slice(query.offset, query.offset! + query.limit!)) {
      const raw = await redisClient.get(k);
      if (raw) entries.push(JSON.parse(raw));
    }
    return NextResponse.json({ success: true, data: entries });
  }

  // In-memory fallback: filter by prefix/tags
  let entries = Array.from(memoryFallback!.values())
    .filter(e => e.expiry > Date.now())
    .map(e => e.entry);
  if (query.prefix) entries = entries.filter(e => e.key.startsWith(query.prefix!));
  if (query.tags?.length) entries = entries.filter(e => query.tags!.some(t => e.tags?.includes(t)));
  entries = entries.slice(query.offset, query.offset! + query.limit!);
  return NextResponse.json({ success: true, data: entries });
}

// POST /api/memory — Create/Update entry
export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.key || body.value === undefined) {
    return NextResponse.json({ success: false, error: 'key and value required' }, { status: 400 });
  }

  const existing = redisClient ? await redisClient.get(`mem:${body.key}`) : memoryFallback?.get(body.key);
  const entry: MemoryEntry = {
    id: body.id || uuidv4(),
    key: body.key,
    value: typeof body.value === 'string' ? body.value : JSON.stringify(body.value),
    tags: body.tags || [],
    source: body.source || 'web',
    ttlSeconds: body.ttlSeconds || 3600,
    createdAt: existing ? (JSON.parse(existing).createdAt || now()) : now(),
    updatedAt: now(),
  };

  if (redisClient) {
    await redisClient.set(`mem:${entry.key}`, JSON.stringify(entry), 'EX', entry.ttlSeconds!);
  } else {
    memoryFallback!.set(entry.key, { entry, expiry: Date.now() + entry.ttlSeconds! * 1000 });
  }

  return NextResponse.json({ success: true, data: entry });
}

// DELETE /api/memory?key=xxx
export async function DELETE(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  if (!key) {
    return NextResponse.json({ success: false, error: 'key required' }, { status: 400 });
  }

  if (redisClient) {
    await redisClient.del(`mem:${key}`);
  } else {
    memoryFallback!.delete(key);
  }
  return NextResponse.json({ success: true, data: { deleted: true } });
}
