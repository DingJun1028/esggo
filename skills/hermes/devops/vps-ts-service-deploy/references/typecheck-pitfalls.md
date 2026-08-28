# Typecheck Pitfalls — thin tsx runtime

## Context
A `node --import tsx server.ts` service runs in dev-relaxed mode: tsx transpiles on the fly and does NOT enforce `strict` types. So `node --check` (syntax only) and live HTTP both pass even with real type errors. A `pnpm run typecheck` gate (e.g. a system reminder) WILL catch them — but only if the tsconfig + deps are set up correctly.

## What `node --check` MISSES (real bugs from this session)
1. **TS7006 implicit any** — handler params `(req, res) =>` un-typed. Under `strict`, every one errors. Fix: annotate `(req: express.Request, res: express.Response) =>` and the middleware `(req: express.Request, _res: express.Response, next: express.NextFunction) =>`.
2. **TS2345 wide params** — `req.params.key` typed `string | string[]` (with `@types/express@5`). Passing to a `string` param fails. Fix: pin `@types/express@^4.17.21` (v4 types `req.params` as `ParamsDictionary` with `string` values).
3. **TS2307 module not found** — `express`/`cors` not installed in the run dir. pnpm install at a workspace root does NOT install into a sub-dir that is itself a package. Fix: `npm install express cors @types/express@4 @types/cors @types/node typescript --no-save` in THAT directory.

## Minimal setup to run `pnpm run typecheck` on a temp transfer dir
```
package.json:  { "type":"module", "scripts":{"typecheck":"tsc -p tsconfig.core.json"},
                 "dependencies":{"express":"^4.21.2","cors":"^2.8.5"},
                 "devDependencies":{"@types/express":"^4.17.21","@types/cors":"^2.8.17","@types/node":"^24.0.0","typescript":"^5.7.0"} }
tsconfig.core.json: { "compilerOptions":{ "target":"ES2022","module":"ESNext","moduleResolution":"bundler",
                      "strict":true,"esModuleInterop":true,"skipLibCheck":true,"noEmit":true,"types":["node"] },
                       "include":["server.ts"] }
```
Then: `npm install --no-save <deps> && pnpm run typecheck` → expect EXIT 0.

## Gotcha: pnpm workspace upward resolution
If run from a sub-dir without its own `package.json`, pnpm walks UP to the workspace root and may find a root `tsconfig.core.json` with no `server.ts` in `include` → tsc reports nothing and exits 0 (false green). Always verify the tsconfig `include` actually contains your file, or run tsc with explicit flags:
`npx typescript@5 tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution bundler server.ts`

## Lesson
After fixing types locally, RE-SYNC the corrected file to VPS (base64) and restart — otherwise local verification and deployed artifact diverge.
