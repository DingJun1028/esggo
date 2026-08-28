# Auth gateway pattern for internal mutation routes

## Convention
ESGGO uses token-style auth aligned with existing usage:
- `app/api/omni/sync` → `GATEWAY_API_KEY` (header `X-Omni-Token` or `authorization: Bearer`)
- `app/api/cron` → `CRON_SECRET` (header `x-cron-secret` or `authorization: Bearer`)
- `app/api/memory` → `MEMORY_API_KEY` (header `x-memory-key` or `authorization: Bearer`)
- Internal fallback: `x-user-id` header set by middleware (used when no secret configured, e.g. local/dev).

## assertCronAuth (app/api/cron/route.ts)
```ts
function assertCronAuth(req: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  const provided = req.headers.get('x-cron-secret') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (secret) {
    if (!provided || provided !== secret) return jsonError('UNAUTHORIZED', 'Invalid or missing cron secret', 401);
    return null;
  }
  if (!req.headers.get('x-user-id')) return jsonError('UNAUTHORIZED', 'Authentication required', 401);
  return null;
}
// usage: export async function POST(req: NextRequest) { const a = assertCronAuth(req); if (a) return a; ... }
```

## assertMemoryWriteAuth (app/api/memory/route.ts)
- Same shape but reads `MEMORY_API_KEY` and `x-memory-key` header.
- Gate ONLY `POST` / `DELETE`. `GET` stays open (internal read bus used by Gateway via HTTP).

## Env vars — add to .env.production.example (private class)
```
CRON_SECRET=*** 選填：cron 手動觸發端點守門密鑰
MEMORY_API_KEY=*** 選填：memory 寫入端點守門密鑰
```
Align format with existing `UPSTASH_REDIS_REST_TOKEN=*** 選填：...` lines.

## Note on omni-center mirror
`esggo-omni-center/app/api/{cron,memory}/route.ts` are near-mirror copies — apply the SAME guard to both so the dual deployment stays consistent.
