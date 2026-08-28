# AI Station monorepo integration (esggo)

Verified 2026-08-27 on `C:\Project\esggo`, branch `feature/aistation-core-modules`.

## Root wiring
- `pyproject.toml` optional-deps:
  - `[project.optional-dependencies] aistation = ["fastapi>=0.100.0", "uvicorn>=0.23.0", "Pillow>=10.0.0"]`
- `pyproject.toml` scripts:
  - `[project.scripts] aistation = "apps.aistation.src.cli:main"`
- launcher:
  - `scripts/aistation` -> `cd apps/aistation && python -m src.cli "$@"`

## App-local pytest config
`apps/aistation/pyproject.toml`:
```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "-q"
```

## FastAPI schema pitfall
With FastAPI 0.133 + Pydantic 2.13, declaring endpoint params as plain function args can 422 on JSON bodies. Fix: use `Body(...)` explicitly.

```python
from fastapi import FastAPI, Body

@app.post("/v1/generate")
def generate(
    script: str = Body(...),
    series: Optional[str] = Body(None),
    voice: str = Body("zh-TW-YunJheNeural"),
    output_path: Optional[str] = Body(None),
): ...
```

## Verification recipe
```bash
cd C:\Project\esggo\apps\aistation
pytest -q
bash C:\Project\esggo\scripts\aistation --help
```

## Notes
- Windows `bash scripts/...` may resolve to WSL bash and fail; use Git Bash explicitly or PowerShell wrapper.
- Port 8796 may already be in use during OmniLive local tests; use an alternate port.