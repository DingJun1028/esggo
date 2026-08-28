# 5T Cross-Language Hash Lock Isomorphism & Cron Auth Test Isolation (2026-08-28)

## 1. §18 SHA-256 Cross-Language Hash Lock Isomorphism
- **Algorithm**: `sha256(f"${source}|${content}|${timestamp}")`
- **TypeScript**: `src/incremental-output/index.ts` -> `generateHashLock(sourceOrigin, content, timestamp)`
- **Python**: `src.core.verification.generate_hash_lock` and `src.incremental.gate.generate_hash_lock`
- **Cross-Language Test**: `src/incremental-output/__tests__/cross-lang.test.ts` loads test vectors from `tests/hashlock_vectors.json` to guarantee bit-for-bit SHA-256 (64-hex) equivalence between TypeScript and Python.

## 2. Cron Auth Guard Unit Test Isolation
- **Problem**: When testing HTTP route auth guards in `tests/cron-auth.test.ts`, passing a job payload like `{ job: 'daily-report' }` causes the handler to attempt actual job execution after passing authentication. In offline or isolated test environments, this triggers Prisma database queries to external Supabase endpoints (e.g., `aws-1-ap-northeast-1.pooler.supabase.com:6543`), resulting in 5000ms Vitest timeouts.
- **Fix**: Use a pure auth check job name such as `{ job: 'auth-check' }` in `tests/cron-auth.test.ts`. This allows the handler to execute the `assertCronAuth` guard without attempting database initialization or network calls.
