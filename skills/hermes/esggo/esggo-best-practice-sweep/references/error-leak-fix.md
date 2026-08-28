# Error-leak root-cause fix

## Helper (add to src/lib/api-utils.ts AND esggo-omni-center/src/lib/api-utils.ts)
```ts
export function jsonErrorInternal(
  error: unknown,
  errorKey: ErrorCodeKey = 'INTERNAL_ERROR',
  status?: number
): NextResponse {
  console.error(`[api] ${errorKey}:`, error);
  return jsonError(errorKey, undefined, status);
}
```

## Replacement patterns (batch via script, then typecheck)
- `jsonError('INTERNAL_ERROR', (error as Error).message)` → `jsonErrorInternal(error)`
- `jsonError('INTERNAL_ERROR', (error as Error).message, 500)` → `jsonErrorInternal(error, 'INTERNAL_ERROR', 500)`
- `NextResponse.json({ error: error.message }, { status: 500 })` → `NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })`
- `const message = error instanceof Error ? error.message : 'Unknown error'; return jsonError('INTERNAL_ERROR', message);` → `return jsonErrorInternal(error);`
- `return jsonError('INTERNAL_ERROR', (error as Error).message || 'Internal server error')` → `jsonErrorInternal(error, 'INTERNAL_ERROR')`

## Edges that need custom handling (not blind replace)
- `category as any` where the param is already a union type → just drop `as any`.
- `(report as any)` where target fn expects `{ companyName; version?; generatedAt? }` → `report as { companyName: string; version?: string; generatedAt?: string }`.
- `event.evidence as any?.hash` → `event.evidence?.hash` (evidence field is already typed).

## Test (tests/json-error-internal.test.ts)
```ts
const res = jsonErrorInternal(new Error('SECRET_DETAIL'));
const body = await res.json();
expect(JSON.stringify(body)).not.toContain('SECRET_DETAIL');
expect(body.error).toBeDefined();
// Contrast case proves the leak existed: jsonError('X', 'SECRET_DETAIL') body DOES contain it.
```
