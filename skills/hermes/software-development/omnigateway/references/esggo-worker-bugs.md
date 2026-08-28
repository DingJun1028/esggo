# esggo OmniGateway Worker Code Issues

## Bugs Found During Review (2026-08-05)

### 1. Exposed API Keys in Authorization Headers
**File**: `worker/src/index.ts` (lines ~162-163, ~175)

**Bug**: Authorization headers contain `***` placeholder instead of actual Bearer token:
```typescript
// BUG: exposes API key in code as literal "***"
authorization: *** ${env.OPENROUTER_API_KEY || ''}`,
authorization: *** ${env.GROQ_API_KEY || ''}`,
```

**Fix**: Use proper Bearer token format:
```typescript
authorization: \`Bearer ${env.OPENROUTER_API_KEY}\`,
authorization: \`Bearer ${env.GROQ_API_KEY}\`,
```

### 2. cf-aig-metadata Header Leaks API Keys
**File**: `worker/src/index.ts`

**Bug**: The `cf-aig-metadata` header is sent with every upstream request, but the `x-omni-token` header also carries the API key value:
```typescript
'x-omni-token': env.OPENROUTER_API_KEY || '',
```

**Fix**: Remove API key from `x-omni-token` header on upstream requests. Use it only for internal auth.

### 3. Missing PRIVATE_API Fallback in Provider List
**Bug**: The fallback chain in `fallbackGenerate` does not include `callPrivateModel`, even though `PRIVATE_API` is listed as a bound env var and the `/v1/models` endpoint advertises `vpc/private-model`.

**Fix**: Add PRIVATE_API as the last fallback candidate:
```typescript
() => callPrivateModel(env, { model: 'vpc/private-model', messages }, requestId)
  .then((r) => ({ ok: r.status < 300, status: r.status, body: r.body })),
```

### 4. Cache Key Includes Full Messages (Privacy Risk)
**Bug**: The semantic cache key is built from the full message content:
```typescript
const cacheKey = `chat:${JSON.stringify(body.messages).slice(0, 512)}:${body.model || 'auto'}`;
```
This means user prompts are stored in the cache key, potentially leaking sensitive data.

**Fix**: Hash the messages instead of embedding them:
```typescript
import { SHA256 } from 'crypto-js';
const cacheKey = `chat:${SHA256(JSON.stringify(body.messages))}:${body.model || 'auto'}`;
```
