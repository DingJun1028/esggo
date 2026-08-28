# aistation — verification command recipes

## Run the test suite (hermes venv — pytest is NOT in system python)
```
PY=/c/Users/dingj/AppData/Local/hermes/hermes-agent/venv/Scripts/python
$PY -m pytest -q            # full suite; expect exit=0
$PY -m pytest -v 2>&1 | grep -E "metrics_endpoint|passed|failed"   # spot-check a test
```
Install pytest once if missing:
```
$PY -m pip install pytest -q
```

## Confirm /api/metrics end-to-end (no server needed)
```
$PY -c "
import tempfile, json
from pathlib import Path
from src import config, db, app as a
d = Path(tempfile.mkdtemp())/'state'; d.mkdir(parents=True, exist_ok=True)
config.STORAGE_DIR = d; db.DB_PATH = d/'jobs.db'; db.init_db()
db.create_job('x1','a',{'brand_preset':'sushi_dr'}); db.update_job('x1',status='done',result=json.dumps({'shots':3}))
db.create_job('x2','b',{'brand_preset':'default'}); db.update_job('x2',status='failed',result=json.dumps({'error':'x'}))
from fastapi.testclient import TestClient
import pprint; pprint.pprint(TestClient(a.app).get('/api/metrics').json())
"
```

## Reconcile git state before claiming uncommitted/pushed
```
git status --short
git log --oneline -3
git fetch origin && git ls-remote origin | grep HEAD
git rev-list --count origin/main..HEAD     # 0 == nothing to push
```

## Test inventory (as of last session — keep in sync with TODO.md count)
29 tests covering: config / parser (free + DNA + OpenAI mock) / tts / renderer /
db / api / ci / security (webhook auth, path traversal) / integration (real
ffmpeg, skips if absent) / runway fallback mock / submit-failure regression /
webhook `ok`-flag / metrics aggregation.
