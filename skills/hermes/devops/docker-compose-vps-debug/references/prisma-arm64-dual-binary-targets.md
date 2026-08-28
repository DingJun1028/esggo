# Prisma ARM64 Dual Binary Targets — Reproduction

## Environment
- VPS: Oracle Cloud Ampere A1 (ARM64)
- Docker runner: `node:22-slim` after Alpine 3.20 `openssl1.1-compat` removal
- Prisma: `^5.22.0`

## Reproduction

### Step 1: Alpine fails with libssl.so.1.1 missing
```
Error [PrismaClientInitializationError]: Unable to require(
  `/app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client/libquery_engine-linux-musl-arm64-openssl-1.1.x.so.node`
).
Details: Error loading shared library libssl.so.1.1: No such file or directory
```

### Step 2: Switch to Debian slim + install libssl3
`Dockerfile.arm64` runner stage must use `node:22-slim` and install `libssl3 ca-certificates`.

### Step 3: Single-target schema fails on Debian slim runner
Even after changing base image, if `schema.prisma` only declares:
```prisma
binaryTargets = ["linux-musl-arm64-openssl-3.0.x"]
```
Prisma throws:
```
Prisma Client could not locate the Query Engine for runtime "linux-arm64-openssl-3.0.x".
Add "linux-arm64-openssl-3.0.x" to `binaryTargets` in `schema.prisma` and run `prisma generate`.
```

### Step 4: Fix — dual targets
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["linux-musl-arm64-openssl-3.0.x", "linux-arm64-openssl-3.0.x"]
}
```
Re-run `npx prisma generate` in builder stage. Both engine files are bundled into the client.

## Lessons
- Alpine 3.20+ dropped `openssl1.1-compat`. Debian slim is the preferred workaround for Prisma 5.x on arm64.
- Declaring only the musl target is insufficient even on musl-based containers. Prisma's runtime detection can request the generic arm64 opaque engine as well.
- Always pair the base-image change with a `binaryTargets` update and `prisma generate`; otherwise you'll hit a second, different engine-missing error.
