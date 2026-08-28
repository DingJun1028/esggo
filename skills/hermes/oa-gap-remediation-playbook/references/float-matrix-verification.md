# Float Matrix Verification Reference

## Session Context
Date: 2026-08-25
Task: Deploy beautiful floating window HTML with 5T-compliant TypeScript ↔ Runtime bidirectional sync

## Key Decisions

### 1. BREAKPOINT_NAMES Mapping Convention
- **TypeScript**: `FLOAT_CANONICAL.breakpoints` keys are `mobile, tablet, desktop, ultrawide`
- **Runtime (mjs)**: `BREAKPOINTS` is an object `{ mobile: {min, max}, ... }`, and `BREAKPOINT_NAMES = Object.keys(BREAKPOINTS)` is the exported const array
- **Verification**: Compare `BREAKPOINT_NAMES` (TS extracted keys) ↔ `BREAKPOINT_NAMES` (mjs exported array)

### 2. CSS Variable Completeness
- 19 CSS variables in `FloatCSSVars` interface must ALL be present in `:root` of float.html
- Missing variables: `--bg`, `--panel`, `--panel2`, `--muted`, `--txt`, `--radius`, `--gap`, `--font`
- These must be added to both `float.html` files for Tangible validation

### 3. ESM Path Resolution (Windows)
Use `fileURLToPath(import.meta.url)` instead of `new URL(import.meta.url).pathname`
