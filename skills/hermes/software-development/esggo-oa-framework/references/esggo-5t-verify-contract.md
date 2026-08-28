# esggo ↔ aistation 5T verify-5t contract (reference)

Captured from the §23–§25 best-practice implementation session (2026-08-10).

## Endpoint: `POST /api/verify-5t` (esggo)
Source: `app/api/verify-5t/route.ts`, uses `@/lib/five-t-protocol`
(`calculateFiveTScore` + `FiveTGatekeeper`). No auth (pure compute; like `/api/hashlock`).

### Request body
```json
{
  "source_origin": "aistation:src/pipeline.py",
  "sources": [
    "aistation:src/pipeline.py",
    "aistation:src/notify.py",
    "esggo:app/api/verify-5t",
    "esggo:packages/omni-agent-bus"
  ],
  "lifecycle_hooks": ["locked"],
  "ui_feedback": false,
  "transparent_audit": true,
  "frozen": true
}
```
- `sources` is the authoritative multi-source array. `calculateFiveTScore` grades
  `traceable` from `sources.length` (>=4 -> traceable~=1). A single `source_origin`
  only -> `sources.length=1` -> `traceable=0` -> `pass=false`.
- `source_origin` alone (no `sources`) is accepted for BACKWARD COMPAT but yields
  a 1-element `sources` -> still fails the authority gate (by design).

### Response (200)
```json
{ "pass": false,
  "status":  { "traceable": false, "transparent": false, "tangible": false, "trustworthy": false, "trackable": false },
  "score":   { "traceable": 0, "transparent": 0.3, "tangible": 0.5, "trustworthy": 0.2, "trackable": 0.3 },
  "hashLock": "4ea30505...",
  "source":  "esggo-five-t-protocol" }
```

### Live probe (no SSH)
```bash
cd C:/Project/esggo
NEXT_TELEMETRY_DISABLED=1 ./node_modules/.bin/next dev -p 3939   # background=true, wait "✓ Ready"
curl -s -X POST http://localhost:3939/api/verify-5t \
  -H "Content-Type: application/json" --data-binary @payload.json
# Chinese double-quotes in -d STRING fail with "Bad escaped character"; always use @file.
```

## aistation side: `src/gate5t.py`
- `verify_via_esggo(locked)` reads `ESGO_HASHLOCK_URL` (module-level, read at import),
  builds payload from `json.loads(locked.payload)` -- pulls `sources` if present,
  else falls back to `[source_origin]`. On any exception/HTTP!=200 -> local
  `verify_locked()` fallback (graceful).
- **BUG PATTERN: module-const typo -> silent local fallback.** A typo
  `ESGGG_HASHLOCK_URL` (4 G) vs used `ESGO_HASHLOCK_URL` (3 G) made the function
  ALWAYS hit `if not ESGO_HASHLOCK_URL:` -> never called esggo, no error.
  Test must monkeypatch the module attribute, not `setenv`:
  ```python
  monkeypatch.setattr(gate5t, "ESGO_HASHLOCK_URL", "http://esggo.test")
  # then assert res["source"] == "esggo" and payload["sources"] == [...]
  ```

## esggo `/api/omni-center/summary` is DOUBLE-NESTED
```json
{ "success": true,
  "data": { "success": true,
            "data": { "caseCount": 47, "griIndicatorCount": 142, "updatedAt": ..., "fallback": true,
                      "kpiCards": [ ... ] } } }
```
Consumer unwrap (Python):
```python
inner = payload.get("data", payload)
if isinstance(inner, dict) and "data" in inner:
    inner = inner["data"]
case_count = inner.get("caseCount")
```

## `omni-agent-bus/src/patterns/` is UNTRACKED in esggo git
`git ls-files packages/omni-agent-bus/` -> only 11 top-level files. The entire
`src/patterns/` (incl. pre-existing `five-t.ts` that `/api/verify-5t` depends on)
is untracked. To add a new pattern, stage ONLY the specific files:
```bash
git add packages/omni-agent-bus/src/patterns/lifecycle.ts \
        packages/omni-agent-bus/src/patterns/index.ts \
        packages/omni-agent-bus/test/patterns.smoke.ts
# do NOT: git add packages/omni-agent-bus/src/patterns/  (drags in all dev patterns)
```
Verify a new pattern standalone (patterns.smoke.ts does NOT run via tsx -- see
windows-path-lint-guard.md):
```bash
cd packages/omni-agent-bus
cat > _chk.ts <<'EOF'
import { createLifecycleTracker } from './src/patterns/lifecycle.js';
const lt = createLifecycleTracker();
lt.record({ taskId:'a', crossUnit:true, dualSigned:true, entropyDelta:-0.03, source:'esggo:src/x' });
console.log(JSON.stringify(lt.snapshot()));
EOF
npx tsx _chk.ts && rm -f _chk.ts
```
