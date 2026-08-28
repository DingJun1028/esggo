# Generate Zod Schemas from Pydantic

## Overview

The `scripts/generate_zod.py` script bridges Python Pydantic models to TypeScript Zod schemas.

## Key Challenges

### 1. `anyOf` Handling
Pydantic's `Optional[str]` produces JSON Schema with `anyOf: [string, null]`, not `nullable: true`.

**Solution**: Detect `anyOf` with `[string, null]` and generate `z.string().nullable()`.

```python
if 'anyOf' in prop_schema:
    types = prop_schema['anyOf']
    if len(types) == 2:
        t1, t2 = types[0].get('type'), types[1].get('type')
        if (t1 == 'null' and t2 == 'string'):
            return 'z.string().nullable()'
```

### 2. Default Values
Pydantic defaults need special handling in Zod:

```python
if 'default' in prop_schema:
    default = prop_schema['default']
    if default is None:
        zod_type = 'z.any().nullable()'
    elif isinstance(default, str):
        zod_type = f'z.string().default("{default}")'
```

### 3. Import Statements
Generated files must include:
```typescript
import { z } from 'zod';
```

## Generator Script

```python
# scripts/generate_zod.py
def python_type_to_zod(prop_schema: dict, indent: int = 0) -> str:
    # Handle anyOf first
    if 'anyOf' in prop_schema:
        types = prop_schema['anyOf']
        if len(types) == 2 and types[1].get('type') == 'null':
            return 'z.string().nullable()'
    
    t = prop_schema.get('type')
    if t == 'string':
        return 'z.string()'
    elif t == 'number':
        return 'z.number()'
    # ... etc
```

## Usage

```bash
# Generate all schemas
python scripts/generate_zod.py

# Or via npm
npm run sync-types
```

## Output Location

Generated files go to:
- `web/src/types/{ModelName}.ts`
- `web/src/types/api.ts` (hand-edited fallback)