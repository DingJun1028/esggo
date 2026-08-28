---
name: typescript-hybrid
description: "Full-stack bidirectional TypeScript sharing between Python Pydantic and frontend. Uses Pydantic models as canonical type source with auto-generated Zod schemas and TypeScript interfaces."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [typescript, pydantic, zod, fastapi, frontend, types]
    related_skills: [cross-repo-type-sync, fastapi-testing-hardening]
---

# Hybrid TypeScript Approach

## Principle

Use **Pydantic models as the canonical type source**. Generate Zod schemas and TypeScript types from them to achieve full-stack bidirectional type safety.

## Architecture

```
backend/
├── src/types/api.py       # Pydantic models (canonical source)
└── app.py                 # FastAPI routes

frontend/
├── src/types/
│   ├── schemas.ts         # Zod schemas (runtime validation)
│   └── api.ts             # TypeScript interfaces (compile-time)
├── src/api-client.ts      # Type-safe API client
└── src/main.ts            # Frontend code

scripts/
├── generate_zod.py        # Pydantic → Zod generator
└── sync-types.ts          # Automation script
```

## Three-Part Hybrid Solution

### 方案 A: Direct TypeScript Types
- **File**: `frontend/src/types/api.ts`
- **Source**: Synced from Pydantic models
- **Purpose**: Compile-time type checking

### 方案 B: Zod Schemas
- **File**: `frontend/src/types/schemas.ts`
- **Source**: Auto-generated from Pydantic
- **Purpose**: Runtime validation

### 方案 C: OpenAPI + tRPC
- **Source**: FastAPI auto-generates OpenAPI spec
- **Tool**: `openapi-typescript`, `@trpc/client`
- **Purpose**: API client generation

## Workflow

1. **Define Pydantic model**:
```python
# src/types/api.py
class ScriptIn(BaseModel):
    title: str = Field(default="Untitled")
    script: str
    brand_preset: Optional[str] = None
```

2. **Generate TypeScript**:
```bash
python scripts/generate_zod.py
# or: npm run sync-types
```

3. **Use in frontend**:
```typescript
import { ScriptInSchema } from './types/schemas';
import { apiClient } from './api-client';

// With validation
const job = await apiClient.createJobValidated({
  script: "content",
  title: "title"
});
```

## Key Files

| File | Purpose |
|------|---------|
| `src/types/api.py` | Pydantic models (canonical) |
| `web/src/types/schemas.ts` | Zod schemas for runtime validation |
| `web/src/types/api.ts` | TypeScript interfaces |
| `web/src/api-client.ts` | Type-safe API client |
| `scripts/generate_zod.py` | Pydantic → Zod generator |
| `scripts/sync-types.ts` | Automation script |

## Pitfalls

- **Don't edit generated files manually**: Always modify the source Pydantic model
- **Handle `anyOf` in JSON schema**: Pydantic `Optional[str]` produces `anyOf: [string, null]`
- **Keep import statements**: Generated files need `import { z } from 'zod'`
- **Test both ends**: Verify types work in Python AND TypeScript

## Reference Files

- `references/generate-zod.md` — Detailed generator script explanation
- `references/api-client-patterns.md` — API client usage patterns