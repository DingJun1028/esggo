# vitest + Next.js route handlers in ESGGO

Two real traps when writing vitest for `app/api/**/route.ts` handlers in this repo.

## Trap 1 — `await res.json()` returns `undefined`

In the vitest env, `NextResponse.json(...)` produces a body whose `res.json()`
resolves to `undefined` (Next's ReadableStream is not consumed the way a live
server would). `res.status` IS correct. So a naive `const body = await res.json()`
yields `body === undefined` and every field assertion fails.

### Reliable workarounds (pick one)

**(a) Assert `res.status` only** — sufficient when you only care about the
auth gate (401 vs non-401) or param validation (400). This is what the
cron/memory/omni-sync auth tests do.

```ts
const res = await POST(makePost(body, headers));
expect(res.status).toBe(401);
```

**(b) Test the underlying service/function directly** — for handlers that just
wrap a service (e.g. `zkp` → `ZKPService`), import the service and test its
methods. No HTTP layer, no body problem.

```ts
import { ZKPService } from '../src/lib/zkp-service';
const r = ZKPService.seal('doc-1', 'secret');
expect(typeof r.hashLock).toBe('string');
const v = ZKPService.verify('doc-1', r.hashLock);
expect(v.valid).toBe(true); // verify returns { valid: boolean }, NOT a boolean
```

**(c) Read JSON via `res.text()` + `JSON.parse`** — if you must inspect the body:

```ts
function parse(res: Response): Promise<any> {
  return res.text().then((t) => (t ? JSON.parse(t) : undefined));
}
const body = await parse(res);
expect(body.provider).toBe('mock');
```

## Trap 2 — module-level `const TOKEN = process.env.X` ignores `vi.stubEnv`

Routes like `omni/sync` do `const TOKEN = process.env.OMNI_KEY || process.env.GATEWAY_API_KEY || ''`
at module top level. Once the module is imported, `TOKEN` is frozen; setting
`vi.stubEnv('OMNI_KEY', 'x')` afterwards has no effect, so the "correct token →
non-401" case wrongly returns 401.

### Fix — reset modules + dynamic import per test

```ts
import { describe, it, expect, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

describe('POST /api/omni/sync — 認證守門', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules(); // <-- required so the next import re-reads process.env
  });

  it('有 TOKEN 時正確 x-omni-token → 非 401', async () => {
    vi.stubEnv('OMNI_KEY', 'sync-token-abc');
    vi.stubEnv('GATEWAY_API_KEY', '');
    const { POST } = await import('../app/api/omni/sync/route'); // dynamic, after stub
    const res = await POST(makePost(VALID_STATE, { 'x-omni-token': 'sync-token-abc' }));
    expect(res.status).not.toBe(401);
  });
});
```

Without `vi.resetModules()`, the assertion fails with `expected 401 not to be 401`.

## Assert the REAL shape, not your assumption

- `ZKPService.verify` returns `{ valid: boolean }` → assert `res.valid`, not `res`.
- `ZKPService.seal` is NON-deterministic (uses `randomBytes`) → do NOT assert
  two seals of the same input produce equal `hashLock`. Assert only that a
  valid `hashLock` string is present and that `verify` round-trips.
- Read the source signature before writing the assertion; the route handler and
  the service may differ from what you expect.
