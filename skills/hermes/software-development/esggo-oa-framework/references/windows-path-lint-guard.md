# Windows / MSYS path + fake-lint guard (esggo / aistation sessions)

Reproduced pitfalls from a session that edited `C:\Project\esggo` (Windows, MSYS bash) and
`C:\Project\aistation` Python package. These are tooling artifacts, not code bugs.

## 1. `search_files` fails on `C:\` backslash paths

Symptom: `search_files` returns `total_count: 0` plus an IO error
"rg: /c/Project/esggo/esggo-omni-center/soul-full.md: IO error ... 系統找不到指定的路徑。 (os error 3)"
even though the file exists and `terminal` + `cat` can read it.

Fix: do NOT use `search_files` with backslash `C:\...` paths on this host. Use `terminal`:
```bash
cd /c/Project/esggo
grep -rnE '^#{1,3} ' esggo-omni-center/soul-full.md | head
# or for content:
grep -rlE "verify_5t|gate5t|HashLock" --include=*.ts packages app src 2>/dev/null | head
```
Forward-slash `/c/Project/...` in MSYS bash works fine in `terminal`; the failure is specific to
the `search_files` tool's path handling.

## 2. `write_file` / `patch` report a FALSE "error TS6053: File not found"

Symptom after editing an esggo `.ts` file:
```
lint: error TS6053: File '/c/Project/esggo/app/api/verify-5t/route.ts' not found.
  The file is in the program because: Root file specified for compilation
```
The file WAS written (verified by `read_file`). This is the MSYS-path<->tsc mismatch in the
auto-lint, not a real syntax error.

Fix: ignore the banner. Verify by actually running the project's compiler/test on the file:
```bash
cd /c/Project/esggo
npx tsc --noEmit -p tsconfig.json 2>&1 | grep -iE "verify-5t|five-t-protocol|error TS"
# expect: no matching lines, exit 0
```
For aistation Python: `python -m pytest tests/test_chapter10.py -q` is the real evidence.

## 3. `omni-agent-bus` — how to verify a NEW pattern module

`test/patterns.smoke.ts` does NOT run (stale `APIGateway` import from `../src/index.js` ->
resolves to `dist/` not `src/`; the package `test` script doesn't list it anyway). So:

```bash
cd /c/Project/esggo/packages/omni-agent-bus
cat > _chk.ts <<'EOF'
import { createLifecycleTracker } from './src/patterns/lifecycle.js';
const lt = createLifecycleTracker();
lt.record({ taskId:'a', crossUnit:true, dualSigned:true, entropyDelta:-0.03, source:'esggo:src/omni' });
lt.record({ taskId:'b', crossUnit:true, dualSigned:false, entropyDelta:-0.03, source:'esggo:src/api' });
console.log(JSON.stringify(lt.snapshot()), 'gaps', JSON.stringify(lt.gaps()));
process.exit(0);
EOF
npx tsx _chk.ts        # ESM file mode -> top-level await OK
rm -f _chk.ts
```
Also remember: export the new pattern from `patterns/index.ts`
(`export { X, createX } from './x.js'`) or the bus can't reach it.

## 4. `tsx -e` is CJS (no top-level await)

`tsx -e "await import(...)"` dies with "Top-level await is currently not supported with the cjs
output format". Always write a `.ts` file and run `tsx file.ts` (file mode is ESM).
