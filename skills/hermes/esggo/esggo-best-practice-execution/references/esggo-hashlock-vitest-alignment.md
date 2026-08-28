# esggo 5T Hash Lock & Vitest @lib Alignment Notes

## 1. Vitest & tsconfig @lib Alias Alignment
When Next.js routes move `lib/` files to `src/lib/`, the `@lib` alias must be aligned across `vitest.config.ts` and `tsconfig.json`:
- `vitest.config.ts`: `'@lib': path.resolve(__dirname, './src/lib')`
- `tsconfig.json`: `"@lib/*": ["./src/lib/*", "./lib/*"]`
- `vitest.config.ts` excludes: `'**/archive/**'`, `'archive/**'`.

## 2. §18 Hash Lock Isomorphism
- TypeScript `src/incremental-output/index.ts`: `generateHashLock(source, content, timestamp)` uses SHA-256 (`sha256("${source}|${content}|${timestamp}")`).
- Bit-for-bit isomorphic with Python `src.core.verification.generate_hash_lock` and `tests/hashlock_vectors.json`.
- Tested via `src/incremental-output/__tests__/cross-lang.test.ts`.

## 3. Python Pytest Dependency
- Pytest requires `openpyxl` when `infra/scripts/generate_answer_db.py` is loaded in test collection.
- Install: `python -m pip install openpyxl`
