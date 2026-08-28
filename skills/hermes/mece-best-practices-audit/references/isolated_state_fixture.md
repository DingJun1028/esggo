# isolated_state — pollution-safe pytest fixture

When a project has a persistent DB (sqlite) and/or a storage dir written during
render / integration tests, never let tests write into the repo root. Redirect
both to a `tmp_path` via `monkeypatch` so a green suite leaves no `jobs.db` or
`storage/` artifacts behind and tests don't collide with real state.

```python
@pytest.fixture
def isolated_state(tmp_path, monkeypatch):
    """Redirect job DB + storage into a temp dir so render tests never touch
    the real repo state (jobs.db / storage/)."""
    from src import config, db, pipeline

    work = tmp_path / "state"
    work.mkdir(parents=True, exist_ok=True)
    monkeypatch.setattr(config, "STORAGE_DIR", work)
    monkeypatch.setattr(db, "DB_PATH", work / "jobs.db")
    monkeypatch.setattr(pipeline, "STORAGE_DIR", work)
    db.init_db()
    return work
```

## Notes
- The module paths (`src.config`, `src.db`, `src.pipeline`) are
  project-specific — adjust to the target package.
- Any module that copies `STORAGE_DIR` / `DB_PATH` into its own namespace at
  import time must be patched too. Here `pipeline` re-binds config's value, so
  patch both `config` and `pipeline`.
- For FastAPI `TestClient` tests, take `isolated_state` as a fixture argument
  so the app initializes against the temp DB.
- E2E tests that shell out to `ffmpeg` should `pytest.skip` when the binary is
  absent (CI installs it); never fail the suite on a missing optional binary.
- After adding a regression test, re-run the whole suite and report the pass
  count — it should increase by exactly the number of new tests.
