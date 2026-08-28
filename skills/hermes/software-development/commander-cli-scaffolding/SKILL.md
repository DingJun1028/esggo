---
name: commander-cli-scaffolding
description: "Scaffold Node.js CLIs with commander.js groups and dry-run."
version: 1.0.0
author: Hermes Agent (DingJun1028)
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [commander, cli, node, typescript, dry-run]
---

# commander-cli-scaffolding

Class-level patterns for building production-style CLIs with `commander` in TypeScript/Node.

## 1. Multi-word command names break option parsing

`commander` treats spaces in `.command('task dispatch <prompt>')` as part of the command identity,
not as nested subcommands. The result is broken option parsing:
- `--dry-run` is silently dropped
- positional args swallow option values
- `opts.dryRun` is `undefined` even when the flag is present

**Verified failure:**
```ts
program.command('task dispatch <prompt>').option('--dry-run').action((prompt, opts) => {
  console.log(opts.dryRun); // undefined, even with --dry-run
});
```

## 2. Use command groups for nested commands

The reliable pattern is a top-level group command with child commands:

```ts
const task = program.command('task').description('任務派發與管理');
task
  .command('dispatch <prompt>')
  .description('派發任務到指定陣列')
  .option('--array <id>', '目標陣列')
  .option('--dry-run', '預演模式')
  .action(async (prompt, opts) => {
    if (opts.dryRun) {
      console.log(`[DRY-RUN] task dispatch "${prompt}" → array=${opts.array || 'auto'}`);
      return;
    }
    // real execution
  });
```

Same pattern for all multi-word commands:
| Broken | Fixed |
|--------|-------|
| `agents list` | `program.command('agents')` + `agents.command('list')` |
| `gateway status` | `program.command('gateway')` + `gateway.command('status')` |
| `route list` | `program.command('route')` + `route.command('list')` |
| `auth check` | `program.command('auth')` + `auth.command('check')` |
| `data get/set` | `program.command('data')` + `data.command('get')` / `data.command('set')` |

## 3. Duplicate command registration throws at runtime

```ts
// BROKEN — throws "cannot add command 'data' as already have command 'data'"
program.command('data get <key>');
program.command('data set <key> <value>');
```

Fix: register the group once, then attach children:
```ts
const data = program.command('data').description('核心數據讀寫');
data.command('get <key>')...;
data.command('set <key> <value>')...;
```

## 4. --dry-run pattern

Every action that has side effects should support `--dry-run`:
```ts
.action(async (opts) => {
  if (opts.dryRun) {
    console.log('[DRY-RUN] <command> → 將...');
    console.log('[5T:Trustworthy] dry-run 無副作用');
    return;
  }
  // real execution
})
```

## 5. 5T traceability hook

Add a `preAction` hook for traceability:
```ts
program.hook('preAction', (thisCommand) => {
  console.log(`[5T:Traceable] source_origin=<cli-name> command=${thisCommand.name()}`);
});
```

## 6. package.json + tsconfig baseline

```json
{
  "name": "<cli-name>",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "bin": { "<bin>": "dist/index.js" },
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  }
}
```

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

Dependencies: `commander`, `tsx`, `typescript`, `vitest`.

## 7. Verification

After any CLI change, run:
```bash
npx tsx src/index.ts --version
npx tsx src/index.ts <subcommand> --dry-run
npx vitest run
npx tsc --noEmit
```

If `npx tsc --noEmit` hangs or times out in a large monorepo, run it in the CLI's own directory,
not the workspace root.

## 8. Vitest in a workspace with `vitest.workspace.ts`

When the repo root has `vitest.workspace.ts` that references `vitest.config.ts`, every CLI package
**must** have its own `vitest.config.ts`. Missing it causes startup failure:

```
Error: Workspace config file ".../vitest.workspace.ts" references a non-existing file or directory:
C:/.../cli/<name>/vitest.config.ts
```

Fix: add a minimal per-package config:
```ts
// cli/<name>/vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['src/**/*.test.ts'], testTimeout: 10000 },
});
```

## 9. Do NOT cross-import source files between CLI packages

In a multi-package CLI repo, `cli/oa-cli/src/index.ts` importing
`import { gatewayRequest } from '../esggo-cli/src/gateway.js'` fails under Node ESM:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:/.../cli/oa-cli/esggo-cli/src/gateway.js'
```

Even though the relative path looks correct, Node resolves it against the importing package's
directory and the traversal does not land where expected.

Fix: **copy the shared module** into each package that needs it, then import it locally:
```bash
cp cli/esggo-cli/src/gateway.ts cli/oa-cli/src/gateway.ts
cp cli/esggo-cli/src/gateway.ts cli/omnicli/src/gateway.ts
```

For shared code that grows beyond a single file, prefer a local `cli/_shared/` directory or a
separate workspace package with proper `workspace:*` dependency declarations.

## 10. Vitest globals must be explicitly imported

With Vitest 2.x, `beforeAll` / `describe` / `it` / `expect` are **not** automatically injected as
globals in all environments. Using them without import throws:

```
ReferenceError: beforeAll is not defined
```

Fix: always import explicitly:
```ts
import { beforeAll, describe, expect, it } from 'vitest';
```

## 11. Use `console.log` for CLI test assertions, not `console.error`

Vitest's `spawnSync('npx', ['tsx', src, ...args], { encoding: 'utf-8', shell: true })` captures
**stdout only by convention**. If your CLI prints BLOCKER/status markers via `console.error`,
the test's `expect(stdout).toContain('BLOCKER')` will fail even though the CLI is working.

Verified failure:
```
AssertionError: expected '[5T:Traceable] source_origin=esggo-cli' to contain 'BLOCKER'
Received: '[5T:Traceable] source_origin=esggo-cli'
```

Fix: route all user-facing markers through `console.log`:
```ts
console.log('[BLOCKER] Gateway 查詢失敗:', error.message);
console.log('[5T:Trustworthy] Bearer token 不落地日誌');
```

## 12. Gateway module with 3s AbortController timeout

A shared `gateway.ts` should include a hard timeout to avoid hanging tests:

```ts
export async function gatewayRequest(path: string, token?: string, body?: unknown): Promise<any> {
  const cfg = loadGatewayConfig();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(`${cfg.url}${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || cfg.token || ''}`,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Gateway ${res.status}: ${await res.text()}`);
    return res.json();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const reason = msg === 'The user aborted a request.' ? 'connection timeout' : msg;
    throw new Error(`Gateway ${path} failed: ${reason}`);
  } finally {
    clearTimeout(timeout);
  }
}
```

Without this timeout, `fetch('http://localhost:8420/...')` without a running server will hang the
test process.

## 13. Do NOT cross-import source files between CLI packages

In a multi-package CLI repo, `cli/oa-cli/src/index.ts` importing
`import { gatewayRequest } from '../esggo-cli/src/gateway.js'` fails under Node ESM:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'C:/.../cli/oa-cli/esggo-cli/src/gateway.js'
```

Even though the relative path looks correct, Node resolves it against the importing package's
directory and the traversal does not land where expected.

Fix: **copy the shared module** into each package that needs it:
```bash
cp cli/esggo-cli/src/gateway.ts cli/oa-cli/src/gateway.ts
cp cli/esggo-cli/src/gateway.ts cli/omnicli/src/gateway.ts
```

For shared code that grows beyond a single file, prefer a local `cli/_shared/` directory or a
separate workspace package with proper `workspace:*` dependency declarations.

## 14. Vitest workspace packages must each have their own `vitest.config.ts`

When the repo root has `vitest.workspace.ts` that references `vitest.config.ts`, every CLI package
**must** have its own config file. Missing it causes startup failure:

```
Error: Workspace config file ".../vitest.workspace.ts" references a non-existing file or directory:
C:/.../cli/<name>/vitest.config.ts
```

Fix: add a minimal per-package config:
```ts
// cli/<name>/vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { include: ['src/**/*.test.ts'], testTimeout: 10000 },
});
```
