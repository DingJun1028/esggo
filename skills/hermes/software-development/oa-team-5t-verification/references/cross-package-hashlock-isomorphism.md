# §18 Cross-Package Hash-Lock Isomorphism — Concrete Shapes

Captured from a real session (2026-08-28): the `apps/aistation/src/incremental/*`
modules implemented soul.md §12, but the TypeScript layer (`src/incremental-output/index.ts`)
used FNV-1a (8-hex) while the §18 contract is SHA-256 of `f"{source}|{content}|{timestamp}"`
(64-hex). Each side passed its OWN tests → the cross-language break was SILENT. Fix + lock below.

## Contract (single source of truth)
```
payload = f"{source}|{content}|{timestamp}"
hash_lock = sha256(payload.encode("utf-8")).hexdigest()   # 64 hex
```
- Python root: `src/core/verification.py::generate_hash_lock`
- Python sub-pkg: `apps/aistation/src/incremental/gate.py::generate_hash_lock` (same impl)
- TS: `src/incremental-output/index.ts::generateHashLock` — use `import { createHash } from 'node:crypto'` + `createHash('sha256').update(payload,'utf-8').digest('hex')`.

## Recovery (untracked dir cleared, git objects intact)
```bash
# UNSTABLE (subdir-only, can leave subtree empty):
git checkout <branch> -- apps/aistation/src/incremental/
# STABLE (full tree):
git checkout <branch> -- apps/aistation/
# Or byte-exact per file:
python -c "
import subprocess, os
base='apps/aistation/src/incremental'
files={'__init__.py':'<blob>','gate.py':'<blob>','optimizer.py':'<blob>','patterns.py':'<blob>','delivery.py':'<blob>'}
os.makedirs(base, exist_ok=True)
for n,h in files.items():
    out=subprocess.run(['git','cat-file','-p',h],capture_output=True).stdout
    open(os.path.join(base,n),'wb').write(out)
"
# blob hashes: git rev-parse <branch>:apps/aistation/src/incremental/<file>
```
Verify with `os.path.isfile(...)` — `ls` can disagree if the tree was cleared between calls.

## Python isomorphism test (apps/aistation/tests/test_isomorphism.py)
```python
import hashlib, importlib.util, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path: sys.path.insert(0, ROOT)
from src.incremental.gate import generate_hash_lock as aistation_hash_lock
from src.incremental.patterns import EventBus, ServiceOrchestrator, ETLPipeline, APIGateway, CacheManager, ErrorHandler
from src.incremental.optimizer import IncrementalOutputOptimizer

def _root():
    p = os.path.join(os.path.dirname(os.path.dirname(ROOT)), "src", "core", "verification.py")
    spec = importlib.util.spec_from_file_location("esggo_core_verification_x", p)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
R = _root()
assert R is not None   # hard requirement, never skip

def iso(src, content, ts):
    exp = hashlib.sha256(f"{src}|{content}|{ts}".encode()).hexdigest()
    assert aistation_hash_lock(src, content, ts) == exp
    assert R.generate_hash_lock(src, content, ts) == exp

# each pattern stamps hash_lock; e.g.
bus = EventBus(); eid = bus.publish({"source":"agent:07","payload":{"x":1}})
rec = next(e for e in bus._events if e["id"]==eid)
iso("EventBus", str({"x":1}), bus._seq)
assert rec["hash_lock"] == aistation_hash_lock("EventBus", str({"x":1}), bus._seq)
# repeat for ServiceOrchestrator / ETLPipeline / APIGateway / CacheManager / ErrorHandler / optimizer.seal
```
Run: `cd apps/aistation && export PYTHONPATH="$PWD" && python -m pytest tests -q -o addopts=`

## TS cross-lang test (src/incremental-output/__tests__/cross-lang.test.ts)
```ts
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateHashLock } from '../index';
const v = JSON.parse(readFileSync(resolve(__dirname,'../../../tests/hashlock_vectors.json'),'utf-8'));
describe('§18 TS<->PY', () => {
  it('matches Python expected_hash for every vector', () => {
    for (const x of v) expect(generateHashLock(x.source, x.content, x.timestamp)).toBe(x.expected_hash);
  });
});
```
Fixture `tests/hashlock_vectors.json` is produced by `src/core/verification.py::emit_cross_lang_vectors()`
(algo `sha256(source|content|timestamp)`). Both layers MUST consume the SAME file.

## Windows git-bash pytest gotcha
`PYTHONPATH=/x python -m pytest` silently drops the env → `ModuleNotFoundError`.
Always `export PYTHONPATH="/abs/path"` on its own line, then `cd` to package root, then run.
