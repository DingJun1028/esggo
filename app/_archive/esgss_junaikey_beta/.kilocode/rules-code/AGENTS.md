# AGENTS.md - Code Mode

This file provides coding-specific guidance for this repository.

## Critical Coding Rules (Non-Obvious Only)

### 5T Protocol Implementation

1. **TrustworthyLock Usage**: Always use `TrustworthyLock` from `src/utils/TrustworthyLock.ts` for SHA-256 hashing - NEVER implement custom hashing
2. **Status Field**: Only `"Trustworthy"` is valid for sealed/locked state - NOT "Immutable", "Sealed", or "Locked"
3. **Evidence Required**: All data mutations MUST update the `evidence` field with 5T tracking

### Import Patterns

```typescript
// Core imports - use these paths
import { IComponentCore, IEvidenceMap } from '../0-domain/contracts/IComponentCore.js';
import { TrustworthyLock } from '../utils/TrustworthyLock.js';
import { Protocol5T } from '../types/core/index.js';
```

### Component Creation Pattern

```typescript
// All core components must follow this pattern
interface IMyComponent extends IComponentCore {
  readonly uuid: string;           // [Traceable 可溯源]
  readonly timestamp: number;      // [Trackable 可追蹤]
  readonly formula: string;        // [Transparent 可透明]
  readonly impactMetric: string;   // [Tangible 可感知]
  readonly status: "Trustworthy";  // [Trustworthy 不可篡改]
  readonly evidence: IEvidenceMap;
}
```

### Forbidden Patterns

- ❌ NEVER use "Immutable" - use "不可篡改" or "Trustworthy"
- ❌ NEVER skip `source_origin` field in data objects
- ❌ NEVER use custom hash functions - use `TrustworthyLock`
- ❌ NEVER modify frozen objects after `Object.freeze()`

### Testing Requirements

- Test files should be co-located with source files: `MyComponent.test.ts` next to `MyComponent.ts`
- Use Vitest with `@testing-library/react` for component tests
- All 5T validations must have corresponding test cases
