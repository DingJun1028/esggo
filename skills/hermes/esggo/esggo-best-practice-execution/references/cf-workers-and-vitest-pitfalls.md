# Cloudflare Workers & Vitest Path Alignment Pitfalls (2026-08-28)

## 1. Vitest Path Mapping & `@lib` Alias Trap
Next.js monorepo code imports `@lib/five-t-protocol`, `@lib/webhook-auth`, etc.
- If `vitest.config.ts` or `tsconfig.json` maps `@lib/*` only to `./lib/*` instead of `./src/lib/*`, vitest fails with `Cannot find package '@lib/...'`.
- Fix: Map `"@lib/*"` to `["./src/lib/*", "./lib/*"]` in `tsconfig.json`, and set `alias: { '@lib': path.resolve(__dirname, './src/lib') }` in `vitest.config.ts`.
- Exclude `**/archive/**` and `archive/**` in `vitest.config.ts` so untracked archive test files don't pollute workspace test runs.

## 2. Cloudflare Workers `wrangler.toml` Dead Binding & Entrypoint Pitfalls
1. **`kv_namespaces.id` non-interpolation**: `wrangler` does NOT interpolate `${VAR}` inside `kv_namespaces.id` in `wrangler.toml`. Sending literal `${FREE_MODELS_KV_ID}` causes Cloudflare API code `10042` rejection on Workers Builds. If dead/unused, remove the binding.
2. **Notion Worker vs Cloudflare Worker entrypoint**: Root `wrangler.toml` pointing `main` to a Notion Worker (`my-worker/src/index.ts` with top-level `createRequire` from `@notionhq/workers`) kills Workers Builds with code `10021`. Point `main` to the actual Cloudflare Worker (`worker/src/index.ts`).
3. **GitHub Actions TS5058 directory mismatch**: In `.github/workflows/deploy-worker.yml`, setting `workingDirectory: worker` causes `wrangler` to resolve `my-worker/tsconfig.json` against `cwd=worker/` → `TS5058`. Run from repo root via `command: deploy --config wrangler.toml`.
